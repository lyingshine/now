// 成长中心应用逻辑

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadGrowthCenter();
});

// 加载成长中心
function loadGrowthCenter() {
    const data = growthCenterData.getPlans();
    
    // 显示统计数据
    displayStats(data.stats);
    
    // 显示任务列表
    displayTasks(data.plans);
}

// 显示统计数据
function displayStats(stats) {
    document.getElementById('totalHours').textContent = stats.totalHours || 0;
    document.getElementById('consecutiveDays').textContent = stats.consecutiveDays || 0;
    document.getElementById('completedProjects').textContent = stats.completedProjects || 0;
    document.getElementById('achievements').textContent = stats.achievements || 0;
}

// 显示任务列表
function displayTasks(plans) {
    const tasksGrid = document.getElementById('tasksGrid');
    const emptyState = document.getElementById('emptyState');
    const taskCount = document.getElementById('taskCount');
    
    if (!plans || plans.length === 0) {
        tasksGrid.style.display = 'none';
        emptyState.style.display = 'block';
        taskCount.textContent = '(0)';
        return;
    }
    
    tasksGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    taskCount.textContent = `(${plans.length})`;
    
    tasksGrid.innerHTML = plans.map(plan => `
        <div class="task-card" onclick="viewTaskDetail(${plan.jobId})">
            <div class="task-header">
                <div>
                    <div class="task-title">${plan.jobTitle}</div>
                    <div class="task-salary">¥${plan.salary.toLocaleString()}/月</div>
                </div>
            </div>
            
            <div class="task-progress">
                <div class="progress-label">
                    <span>学习进度</span>
                    <span><strong>${plan.overallProgress}%</strong></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${plan.overallProgress}%"></div>
                </div>
            </div>
            
            <div class="task-meta">
                <span>📅 接取日期：${plan.acceptedDate}</span>
                <span>🎯 预计完成：${plan.estimatedWeeks} 周</span>
            </div>
            
            <div class="task-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); viewTaskDetail(${plan.jobId})">
                    查看详情
                </button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); continueStudy(${plan.jobId})">
                    继续学习
                </button>
            </div>
        </div>
    `).join('');
}

// 查看任务详情
function viewTaskDetail(jobId) {
    // 跳转到详情页
    window.location.href = `growth-detail.html?id=${jobId}`;
}

// 继续学习
function continueStudy(jobId) {
    const plan = growthCenterData.getPlan(jobId);
    if (!plan) return;
    
    // 找到第一个未完成的技能
    const currentSkill = plan.skills.find(s => s.status !== 'completed');
    
    if (currentSkill) {
        alert(`继续学习：${currentSkill.skillName}\n\n当前进度：${currentSkill.progress}%\n\n加油！💪`);
        viewTaskDetail(jobId);
    } else {
        alert('🎉 恭喜！你已经完成了所有技能！');
    }
}

// 从职位页面接取任务时调用
function onJobAccepted(job) {
    // 生成学习计划
    growthCenterData.addOrUpdatePlan(job);
    
    // 更新统计
    growthCenterData.updateStats();
    
    console.log('学习计划已生成:', job.title);
}

// 导出函数供其他页面使用
window.growthCenter = {
    onJobAccepted,
    loadGrowthCenter
};
