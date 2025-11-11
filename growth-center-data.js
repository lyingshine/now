// 成长中心数据模型和学习计划生成器

const growthCenterData = {
    // 从 localStorage 获取学习计划
    getPlans() {
        const data = localStorage.getItem('growthCenter');
        return data ? JSON.parse(data) : { plans: [], stats: this.getDefaultStats() };
    },
    
    // 保存学习计划
    savePlans(data) {
        localStorage.setItem('growthCenter', JSON.stringify(data));
    },
    
    // 获取默认统计数据
    getDefaultStats() {
        return {
            totalHours: 0,
            consecutiveDays: 0,
            lastStudyDate: null,
            completedProjects: 0,
            achievements: 0
        };
    },
    
    // 生成学习计划
    generateLearningPlan(job) {
        const plan = {
            jobId: job.id,
            jobTitle: job.title,
            salary: job.salary,
            acceptedDate: new Date().toISOString().split('T')[0],
            startDate: new Date().toISOString().split('T')[0],
            weeklyHours: 10, // 默认每周10小时
            overallProgress: 0,
            skills: []
        };
        
        // 为每项技能生成学习步骤
        job.requirements.forEach((req, index) => {
            const skill = {
                skillId: req.id,
                skillName: req.text,
                reward: this.extractReward(req.reward),
                progress: 0,
                status: 'not_started', // not_started, in_progress, completed
                steps: this.generateSteps(req, index, job.title)
            };
            plan.skills.push(skill);
        });
        
        // 计算预计完成时间
        plan.estimatedWeeks = plan.skills.length * 4;
        plan.estimatedEndDate = this.calculateEndDate(plan.startDate, plan.estimatedWeeks);
        
        return plan;
    },
    
    // 提取奖励金额
    extractReward(rewardText) {
        if (!rewardText) return 0;
        const match = rewardText.match(/\+(\d+)/);
        return match ? parseInt(match[1]) : 0;
    },
    
    // 生成学习步骤（每项技能4周）
    generateSteps(requirement, skillIndex, jobTitle) {
        const steps = [];
        const baseWeek = skillIndex * 4;
        
        // 解析成长任务
        const taskText = requirement.growthTask || '';
        const tasks = this.parseGrowthTask(taskText);
        
        // 将任务分配到4周
        const tasksPerWeek = Math.ceil(tasks.length / 4);
        
        for (let week = 1; week <= 4; week++) {
            const weekTasks = tasks.slice((week - 1) * tasksPerWeek, week * tasksPerWeek);
            
            steps.push({
                week: baseWeek + week,
                title: `第${baseWeek + week}周：${this.getWeekTitle(requirement, week)}`,
                description: this.getWeekDescription(requirement, week),
                tasks: weekTasks.map((task, idx) => ({
                    id: `task_${skillIndex}_${week}_${idx}`,
                    text: task,
                    estimatedHours: 8,
                    actualHours: 0,
                    completed: false,
                    completedDate: null,
                    notes: ''
                })),
                resources: this.getWeekResources(requirement, week),
                completed: false
            });
        }
        
        return steps;
    },
    
    // 解析成长任务文本
    parseGrowthTask(taskText) {
        // 移除【任务】标记
        taskText = taskText.replace(/【任务】/g, '');
        
        // 按 + 号分割任务
        const tasks = taskText.split('+').map(t => t.trim()).filter(t => t);
        
        // 如果没有任务，返回默认任务
        if (tasks.length === 0) {
            return ['学习相关知识', '完成实践项目', '总结学习笔记'];
        }
        
        return tasks;
    },
    
    // 获取周标题
    getWeekTitle(requirement, week) {
        const skillName = requirement.text.split('：')[0] || requirement.text.substring(0, 20);
        const weekTitles = {
            1: `${skillName} - 基础学习`,
            2: `${skillName} - 实践项目`,
            3: `${skillName} - 进阶学习`,
            4: `${skillName} - 综合应用`
        };
        return weekTitles[week] || `${skillName} - 学习`;
    },
    
    // 获取周描述
    getWeekDescription(requirement, week) {
        const descriptions = {
            1: '掌握基础理论知识，了解核心概念',
            2: '通过实践项目巩固所学知识',
            3: '学习进阶内容，提升技能水平',
            4: '综合运用所学，完成完整项目'
        };
        return descriptions[week] || '继续学习和实践';
    },
    
    // 获取学习资源
    getWeekResources(requirement, week) {
        // 这里可以根据不同技能返回不同资源
        // 简化版本，返回通用资源
        return [
            {
                type: 'doc',
                name: '官方文档',
                url: '#',
                rating: 5,
                reason: '最权威的学习资料'
            },
            {
                type: 'video',
                name: '视频教程',
                url: '#',
                rating: 4.5,
                reason: '适合初学者的视频课程'
            }
        ];
    },
    
    // 计算结束日期
    calculateEndDate(startDate, weeks) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + weeks * 7);
        return date.toISOString().split('T')[0];
    },
    
    // 计算技能进度
    calculateSkillProgress(skill) {
        const totalTasks = skill.steps.reduce((sum, step) => sum + step.tasks.length, 0);
        const completedTasks = skill.steps.reduce((sum, step) => 
            sum + step.tasks.filter(t => t.completed).length, 0
        );
        return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    },
    
    // 计算整体进度
    calculateOverallProgress(plan) {
        if (!plan.skills || plan.skills.length === 0) return 0;
        const avgProgress = plan.skills.reduce((sum, skill) => 
            sum + this.calculateSkillProgress(skill), 0
        ) / plan.skills.length;
        return Math.round(avgProgress);
    },
    
    // 更新进度
    updateProgress(planId) {
        const data = this.getPlans();
        const plan = data.plans.find(p => p.jobId === planId);
        if (!plan) return;
        
        // 更新每个技能的进度
        plan.skills.forEach(skill => {
            skill.progress = this.calculateSkillProgress(skill);
            
            // 更新技能状态
            if (skill.progress === 0) {
                skill.status = 'not_started';
            } else if (skill.progress === 100) {
                skill.status = 'completed';
            } else {
                skill.status = 'in_progress';
            }
        });
        
        // 更新整体进度
        plan.overallProgress = this.calculateOverallProgress(plan);
        
        this.savePlans(data);
    },
    
    // 添加或更新学习计划
    addOrUpdatePlan(job) {
        const data = this.getPlans();
        
        // 检查是否已存在
        const existingIndex = data.plans.findIndex(p => p.jobId === job.id);
        
        if (existingIndex >= 0) {
            // 已存在，更新接取日期
            data.plans[existingIndex].acceptedDate = new Date().toISOString().split('T')[0];
        } else {
            // 不存在，生成新计划
            const plan = this.generateLearningPlan(job);
            data.plans.push(plan);
        }
        
        this.savePlans(data);
    },
    
    // 获取单个学习计划
    getPlan(jobId) {
        const data = this.getPlans();
        return data.plans.find(p => p.jobId === jobId);
    },
    
    // 更新统计数据
    updateStats() {
        const data = this.getPlans();
        
        // 计算总学习时长
        let totalHours = 0;
        data.plans.forEach(plan => {
            plan.skills.forEach(skill => {
                skill.steps.forEach(step => {
                    step.tasks.forEach(task => {
                        if (task.completed) {
                            totalHours += task.actualHours || task.estimatedHours;
                        }
                    });
                });
            });
        });
        
        // 计算完成项目数（假设每个技能算一个项目）
        let completedProjects = 0;
        data.plans.forEach(plan => {
            completedProjects += plan.skills.filter(s => s.status === 'completed').length;
        });
        
        // 更新统计
        data.stats.totalHours = totalHours;
        data.stats.completedProjects = completedProjects;
        
        // 计算连续学习天数（简化版本）
        const today = new Date().toISOString().split('T')[0];
        if (data.stats.lastStudyDate === today) {
            // 今天已经学习过
        } else if (data.stats.lastStudyDate) {
            const lastDate = new Date(data.stats.lastStudyDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // 连续学习
                data.stats.consecutiveDays += 1;
            } else if (diffDays > 1) {
                // 中断了，重新开始
                data.stats.consecutiveDays = 1;
            }
        } else {
            data.stats.consecutiveDays = 1;
        }
        
        data.stats.lastStudyDate = today;
        
        this.savePlans(data);
        return data.stats;
    }
};
