// 成长详情页面应用逻辑

let currentPlan = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadTaskDetail();
});

// 加载任务详情
function loadTaskDetail() {
    // 从 URL 参数获取任务 ID
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));
    
    if (!jobId) {
        alert('未找到任务信息');
        window.location.href = 'growth-center.html';
        return;
    }
    
    // 获取学习计划
    currentPlan = growthCenterData.getPlan(jobId);
    
    if (!currentPlan) {
        alert('未找到学习计划');
        window.location.href = 'growth-center.html';
        return;
    }
    
    // 显示任务信息
    displayTaskInfo();
    
    // 显示技能列表
    displaySkills();
}

// 显示任务信息
function displayTaskInfo() {
    document.getElementById('taskTitle').textContent = `${currentPlan.jobTitle} - 成长计划`;
    document.getElementById('taskSalary').textContent = `¥${currentPlan.salary.toLocaleString()}`;
    document.getElementById('startDate').textContent = currentPlan.startDate;
    document.getElementById('estimatedWeeks').textContent = `${currentPlan.estimatedWeeks}周`;
    document.getElementById('endDate').textContent = currentPlan.estimatedEndDate;
    document.getElementById('overallProgress').textContent = `${currentPlan.overallProgress}%`;
    document.getElementById('progressFill').style.width = `${currentPlan.overallProgress}%`;
    document.getElementById('weeklyHours').value = currentPlan.weeklyHours || 10;
}

// 显示技能列表
function displaySkills() {
    const skillsList = document.getElementById('skillsList');
    
    skillsList.innerHTML = currentPlan.skills.map((skill, skillIndex) => {
        const statusIcon = getStatusIcon(skill.status);
        const statusClass = skill.status === 'completed' ? 'completed' : 
                           skill.status === 'in_progress' ? 'in-progress' : '';
        
        return `
            <div class="skill-card ${statusClass}" id="skill-${skillIndex}">
                <div class="skill-header" onclick="toggleSkill(${skillIndex})">
                    <div class="skill-info">
                        <div class="skill-name">${skill.skillName}</div>
                        <div class="skill-meta">
                            <span class="skill-reward">💰 奖励：+${skill.reward.toLocaleString()}元</span>
                            <span>进度：${skill.progress}%</span>
                        </div>
                    </div>
                    <div class="skill-status">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="expand-icon">▼</span>
                    </div>
                </div>
                <div class="skill-content">
                    ${renderSkillSteps(skill, skillIndex)}
                </div>
            </div>
        `;
    }).join('');
}

// 渲染技能学习步骤
function renderSkillSteps(skill, skillIndex) {
    return skill.steps.map((step, stepIndex) => `
        <div class="week-section">
            <div class="week-title">📅 ${step.title}</div>
            <div class="week-description">${step.description}</div>
            <div class="task-list">
                ${step.tasks.map((task, taskIndex) => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" 
                         onclick="toggleTask(${skillIndex}, ${stepIndex}, ${taskIndex})">
                        <input type="checkbox" 
                               class="task-checkbox" 
                               ${task.completed ? 'checked' : ''}
                               onclick="event.stopPropagation(); toggleTask(${skillIndex}, ${stepIndex}, ${taskIndex})">
                        <div class="task-text">${task.text}</div>
                        <div class="task-hours">${task.estimatedHours}h</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 获取状态图标
function getStatusIcon(status) {
    switch (status) {
        case 'completed':
            return '✅';
        case 'in_progress':
            return '🔄';
        default:
            return '⏳';
    }
}

// 切换技能展开/折叠
function toggleSkill(skillIndex) {
    const skillCard = document.getElementById(`skill-${skillIndex}`);
    skillCard.classList.toggle('expanded');
}

// 切换任务完成状态
function toggleTask(skillIndex, stepIndex, taskIndex) {
    const task = currentPlan.skills[skillIndex].steps[stepIndex].tasks[taskIndex];
    task.completed = !task.completed;
    
    if (task.completed) {
        task.completedDate = new Date().toISOString().split('T')[0];
        task.actualHours = task.estimatedHours; // 简化版本，使用预估时间
    } else {
        task.completedDate = null;
        task.actualHours = 0;
    }
    
    // 更新进度
    growthCenterData.updateProgress(currentPlan.jobId);
    
    // 更新统计
    growthCenterData.updateStats();
    
    // 重新加载数据
    currentPlan = growthCenterData.getPlan(currentPlan.jobId);
    
    // 重新渲染
    displayTaskInfo();
    displaySkills();
    
    // 显示庆祝动画（如果完成了技能）
    const skill = currentPlan.skills[skillIndex];
    if (skill.status === 'completed') {
        showCelebration(`🎉 恭喜完成技能：${skill.skillName}！`);
    }
}

// 更新每周学习时间
function updateWeeklyHours() {
    const weeklyHours = parseInt(document.getElementById('weeklyHours').value);
    
    if (weeklyHours < 1 || weeklyHours > 40) {
        alert('请输入 1-40 之间的学习时间');
        return;
    }
    
    currentPlan.weeklyHours = weeklyHours;
    
    // 重新计算完成时间
    const totalHours = currentPlan.skills.reduce((sum, skill) => {
        return sum + skill.steps.reduce((stepSum, step) => {
            return stepSum + step.tasks.reduce((taskSum, task) => {
                return taskSum + task.estimatedHours;
            }, 0);
        }, 0);
    }, 0);
    
    const weeks = Math.ceil(totalHours / weeklyHours);
    currentPlan.estimatedWeeks = weeks;
    currentPlan.estimatedEndDate = growthCenterData.calculateEndDate(currentPlan.startDate, weeks);
    
    // 保存更新
    const data = growthCenterData.getPlans();
    const planIndex = data.plans.findIndex(p => p.jobId === currentPlan.jobId);
    if (planIndex >= 0) {
        data.plans[planIndex] = currentPlan;
        growthCenterData.savePlans(data);
    }
    
    // 重新显示
    displayTaskInfo();
    
    alert(`✅ 学习计划已更新！\n\n每周学习：${weeklyHours} 小时\n预计完成：${weeks} 周\n结束日期：${currentPlan.estimatedEndDate}`);
}

// 显示庆祝动画
function showCelebration(message) {
    // 简化版本，使用 alert
    // 后续可以实现更炫酷的动画
    setTimeout(() => {
        alert(message);
    }, 300);
}

// 导出函数
window.growthDetail = {
    toggleSkill,
    toggleTask,
    updateWeeklyHours
};
