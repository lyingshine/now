// 应用状态管理
let currentJob = null;
let userProgress = JSON.parse(localStorage.getItem('jobProgress')) || {};

// 渲染职位列表
function renderJobs() {
    const jobsGrid = document.getElementById('jobsGrid');
    jobsGrid.innerHTML = jobsData.map(job => {
        const rank = rankSystem.getRank(job.salary);
        const progress = userProgress[job.id];
        const isAccepted = progress && progress.accepted;
        const acceptedBadge = isAccepted ? '<div style="position: absolute; top: 12px; right: 12px; background: #4caf50; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">✓ 已接取</div>' : '';
        
        return `
            <div class="job-card" onclick="openJobModal(${job.id})" style="position: relative;">
                ${acceptedBadge}
                <div class="job-title">${job.title}</div>
                <div class="job-salary">¥${job.salary.toLocaleString()}/月</div>
                <div class="job-rank" style="border-color: ${rank.color}; color: ${rank.color};">
                    ${rank.icon} ${rank.name}段位
                </div>
                <div class="job-info">
                    <div style="margin-bottom: 10px;">
                        经验要求: ${job.experience} | 学历: ${job.education}
                    </div>
                    <div>
                        ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 打开职位详情弹窗
function openJobModal(jobId) {
    currentJob = jobsData.find(job => job.id === jobId);
    if (!currentJob) return;

    // 初始化用户进度
    if (!userProgress[jobId]) {
        userProgress[jobId] = {
            requirements: {},
            accepted: false
        };
    }

    const modal = document.getElementById('jobModal');
    const rank = rankSystem.getRank(currentJob.salary);
    document.getElementById('modalTitle').textContent = `${currentJob.title} ${rank.icon}`;
    document.getElementById('modalSalary').textContent = `¥${currentJob.salary.toLocaleString()}/月 (${rank.name}段位)`;

    renderRequirements();
    updateProgress();
    updateAcceptButton();
    updateAcceptedInfo();
    renderLifestyleComparison();

    modal.classList.add('active');
}

// 渲染生活水平对比
function renderLifestyleComparison() {
    const comparisonSection = document.getElementById('lifestyleComparison');
    
    // 获取当前薪资（从 localStorage 或默认值）
    const salaryData = JSON.parse(localStorage.getItem('salaryData') || '{}');
    const currentSalary = salaryData.salary || 8000; // 默认8000
    const futureSalary = currentJob.salary;
    
    // 显示对比区域
    comparisonSection.style.display = 'block';
    
    // 更新薪资显示
    document.getElementById('currentSalary').textContent = `¥${currentSalary.toLocaleString()}/月`;
    document.getElementById('futureSalary').textContent = `¥${futureSalary.toLocaleString()}/月`;
    
    // 生成生活水平描述
    const currentLifestyle = getLifestyleDescription(currentSalary);
    const futureLifestyle = getLifestyleDescription(futureSalary);
    
    // 渲染当前生活
    document.getElementById('currentLifestyle').innerHTML = currentLifestyle.map(item => `
        <div class="comparison-item">
            <span class="comparison-item-icon">${item.icon}</span>
            <span>${item.text}</span>
        </div>
    `).join('');
    
    // 渲染未来生活
    document.getElementById('futureLifestyle').innerHTML = futureLifestyle.map(item => `
        <div class="comparison-item">
            <span class="comparison-item-icon">${item.icon}</span>
            <span>${item.text}</span>
        </div>
    `).join('');
    
    // 生成亮点对比
    const highlights = getLifestyleHighlights(currentSalary, futureSalary);
    document.getElementById('comparisonHighlights').innerHTML = `
        <div class="highlight-title">✨ 生活升级亮点</div>
        <div class="highlight-items">
            ${highlights.map(h => `
                <div class="highlight-item">
                    <span class="highlight-icon">${h.icon}</span>
                    <span>${h.text}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 根据薪资获取生活水平描述
function getLifestyleDescription(salary) {
    const items = [];
    
    // 住房
    if (salary < 8000) {
        items.push({ icon: '🏠', text: '合租单间' });
    } else if (salary < 12000) {
        items.push({ icon: '🏠', text: '整租一居室' });
    } else if (salary < 18000) {
        items.push({ icon: '🏠', text: '精装两居室' });
    } else if (salary < 25000) {
        items.push({ icon: '🏠', text: '品质三居室' });
    } else {
        items.push({ icon: '🏠', text: '高档公寓/别墅' });
    }
    
    // 饮食
    if (salary < 8000) {
        items.push({ icon: '🍜', text: '食堂/外卖为主' });
    } else if (salary < 15000) {
        items.push({ icon: '🍱', text: '偶尔下馆子' });
    } else if (salary < 25000) {
        items.push({ icon: '🍽️', text: '经常品质餐厅' });
    } else {
        items.push({ icon: '🥘', text: '米其林/高端餐厅' });
    }
    
    // 出行
    if (salary < 10000) {
        items.push({ icon: '🚇', text: '地铁/公交出行' });
    } else if (salary < 18000) {
        items.push({ icon: '🚗', text: '打车/共享汽车' });
    } else if (salary < 30000) {
        items.push({ icon: '🚙', text: '15-25万代步车' });
    } else {
        items.push({ icon: '🏎️', text: '30万+豪华车' });
    }
    
    // 娱乐
    if (salary < 10000) {
        items.push({ icon: '📱', text: '线上娱乐为主' });
    } else if (salary < 20000) {
        items.push({ icon: '🎬', text: '电影/展览/演出' });
    } else {
        items.push({ icon: '✈️', text: '国内外旅游' });
    }
    
    // 储蓄
    const savingsRate = salary < 10000 ? 10 : salary < 20000 ? 20 : 30;
    const monthlySavings = Math.round(salary * savingsRate / 100);
    items.push({ icon: '💰', text: `月存 ${monthlySavings.toLocaleString()}元` });
    
    return items;
}

// 获取生活升级亮点
function getLifestyleHighlights(currentSalary, futureSalary) {
    const increase = futureSalary - currentSalary;
    const increasePercent = Math.round((increase / currentSalary) * 100);
    
    const highlights = [
        { icon: '📈', text: `月薪增加 ¥${increase.toLocaleString()}` },
        { icon: '💹', text: `涨幅 ${increasePercent}%` },
        { icon: '💰', text: `年收入增加 ¥${(increase * 12).toLocaleString()}` }
    ];
    
    // 根据薪资差异添加具体改善
    if (increase >= 2000) {
        highlights.push({ icon: '🏠', text: '可升级更好的住房' });
    }
    if (increase >= 5000) {
        highlights.push({ icon: '🚗', text: '可考虑购车计划' });
    }
    if (increase >= 8000) {
        highlights.push({ icon: '✈️', text: '每年多次出国旅游' });
    }
    if (increase >= 10000) {
        highlights.push({ icon: '💎', text: '进入中产生活水平' });
    }
    
    // 储蓄对比
    const currentSavings = Math.round(currentSalary * 0.2);
    const futureSavings = Math.round(futureSalary * 0.2);
    const savingsIncrease = futureSavings - currentSavings;
    
    if (savingsIncrease > 0) {
        highlights.push({ icon: '🏦', text: `月储蓄增加 ¥${savingsIncrease.toLocaleString()}` });
    }
    
    // 5年后的差距
    const fiveYearDiff = increase * 12 * 5;
    highlights.push({ icon: '⏰', text: `5年累计多赚 ¥${(fiveYearDiff / 10000).toFixed(1)}万` });
    
    return highlights;
}

// 更新已接取信息显示
function updateAcceptedInfo() {
    const progress = userProgress[currentJob.id];
    const acceptedInfo = document.getElementById('acceptedInfo');
    
    if (progress && progress.accepted && progress.acceptedDate) {
        acceptedInfo.style.display = 'block';
        const date = new Date(progress.acceptedDate);
        document.getElementById('acceptedDate').textContent = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        acceptedInfo.style.display = 'none';
    }
}

// 渲染岗位要求列表
function renderRequirements() {
    const requirementsList = document.getElementById('requirementsList');
    const progress = userProgress[currentJob.id];

    requirementsList.innerHTML = currentJob.requirements.map(req => {
        const isChecked = progress.requirements[req.id] || false;
        const rewardBadge = req.reward ? `<span style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 8px; white-space: nowrap;">💰 ${req.reward}</span>` : '';
        
        return `
            <div class="requirement-item ${isChecked ? 'checked' : ''}" id="req-${req.id}">
                <input 
                    type="checkbox" 
                    class="requirement-checkbox" 
                    ${isChecked ? 'checked' : ''}
                    onchange="toggleRequirement('${req.id}')"
                >
                <div class="requirement-text">
                    ${req.text}
                    ${rewardBadge}
                </div>
            </div>
            ${!isChecked ? `
                <div class="growth-task">
                    <div class="growth-task-title">🎯 成长任务</div>
                    <div class="growth-task-content">${req.growthTask}</div>
                </div>
            ` : ''}
        `;
    }).join('');
}

// 切换要求完成状态
function toggleRequirement(reqId) {
    const progress = userProgress[currentJob.id];
    progress.requirements[reqId] = !progress.requirements[reqId];
    
    saveProgress();
    renderRequirements();
    updateProgress();
    updateAcceptButton();
}

// 更新进度显示
function updateProgress() {
    const progress = userProgress[currentJob.id];
    const total = currentJob.requirements.length;
    const completed = Object.values(progress.requirements).filter(v => v).length;
    const percent = Math.round((completed / total) * 100);

    document.getElementById('progressPercent').textContent = `${percent}%`;
    document.getElementById('progressFill').style.width = `${percent}%`;
}

// 更新接取按钮状态
function updateAcceptButton() {
    const acceptBtn = document.getElementById('acceptBtn');
    const progress = userProgress[currentJob.id];
    const total = currentJob.requirements.length;
    const completed = Object.values(progress.requirements).filter(v => v).length;

    if (progress.accepted) {
        acceptBtn.textContent = '🔄 重新接取任务';
        acceptBtn.disabled = false;
        acceptBtn.style.background = 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)';
    } else if (completed === total) {
        acceptBtn.textContent = '✅ 接取任务';
        acceptBtn.disabled = false;
        acceptBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        acceptBtn.textContent = `完成所有要求后可接取 (${completed}/${total})`;
        acceptBtn.disabled = true;
        acceptBtn.style.background = 'linear-gradient(135deg, #ccc 0%, #aaa 100%)';
    }
}

// 接取任务
function acceptJob() {
    const progress = userProgress[currentJob.id];
    const total = currentJob.requirements.length;
    const completed = Object.values(progress.requirements).filter(v => v).length;

    if (completed === total) {
        const wasAccepted = progress.accepted;
        progress.accepted = true;
        progress.acceptedDate = new Date().toISOString().split('T')[0];
        saveProgress();
        
        // 保存到收入计算器
        const salaryData = {
            salary: currentJob.salary,
            joinDate: new Date().toISOString().split('T')[0],
            workStart: '09:00',
            workEnd: '18:00',
            workDays: 22
        };
        localStorage.setItem('salaryData', JSON.stringify(salaryData));

        // 生成学习计划
        if (typeof growthCenterData !== 'undefined') {
            growthCenterData.addOrUpdatePlan(currentJob);
            growthCenterData.updateStats();
            console.log('学习计划已生成:', currentJob.title);
        }

        if (wasAccepted) {
            alert(`🔄 任务已重新接取！\n\n【${currentJob.title}】\n月薪: ¥${currentJob.salary.toLocaleString()}\n\n恭喜你换了新工作！入职日期已更新为今天，数据已同步到 NOW 收入计算器和成长中心。`);
        } else {
            alert(`🎉 恭喜！你已成功接取【${currentJob.title}】任务！\n\n月薪: ¥${currentJob.salary.toLocaleString()}\n\n数据已同步到 NOW 收入计算器和成长中心，快去查看你的学习计划吧！`);
        }
        
        updateAcceptButton();
    }
}

// 保存进度
function saveProgress() {
    localStorage.setItem('jobProgress', JSON.stringify(userProgress));
}

// 关闭弹窗
function closeModal() {
    document.getElementById('jobModal').classList.remove('active');
    currentJob = null;
}

// 事件监听
document.getElementById('closeBtn').addEventListener('click', closeModal);
document.getElementById('acceptBtn').addEventListener('click', acceptJob);
document.getElementById('jobModal').addEventListener('click', (e) => {
    if (e.target.id === 'jobModal') {
        closeModal();
    }
});

// 初始化
renderJobs();
