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

    modal.classList.add('active');
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
        return `
            <div class="requirement-item ${isChecked ? 'checked' : ''}" id="req-${req.id}">
                <input 
                    type="checkbox" 
                    class="requirement-checkbox" 
                    ${isChecked ? 'checked' : ''}
                    onchange="toggleRequirement('${req.id}')"
                >
                <div class="requirement-text">${req.text}</div>
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

        if (wasAccepted) {
            alert(`🔄 任务已重新接取！\n\n【${currentJob.title}】\n月薪: ¥${currentJob.salary.toLocaleString()}\n\n恭喜你换了新工作！入职日期已更新为今天，数据已同步到 NOW 收入计算器。`);
        } else {
            alert(`🎉 恭喜！你已成功接取【${currentJob.title}】任务！\n\n月薪: ¥${currentJob.salary.toLocaleString()}\n\n数据已同步到 NOW 收入计算器，快去查看你的实时收入吧！`);
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
