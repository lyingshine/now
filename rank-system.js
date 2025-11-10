// 段位系统 - 基于杭州2024年实际薪资水平
// 参考：杭州平均工资11000元，中位数8500元，最低工资2490元

const rankSystem = {
    // 动态生成段位数组，从配置文件获取数据
    get ranks() {
        // 直接访问全局的 hangzhouDataConfig
        if (typeof hangzhouDataConfig === 'undefined') {
            console.error('hangzhouDataConfig 未定义');
            return [];
        }
        return hangzhouDataConfig.rankTiers.map(tier => ({
            name: tier.name,
            icon: tier.icon,
            color: tier.color,
            minSalary: tier.salaryRange.min,
            maxSalary: tier.salaryRange.max,
            description: tier.description,
            percentage: tier.percentile,
            lifestyleLevel: tier.lifestyleLevel
        }));
    },

    // 根据月薪获取段位
    getRank(salary) {
        if (typeof hangzhouDataConfig === 'undefined') {
            console.error('hangzhouDataConfig 未定义');
            return this.ranks[0];
        }
        const configRank = hangzhouDataConfig.getRankBySalary(salary);
        
        // 转换为向后兼容的格式
        return {
            name: configRank.name,
            icon: configRank.icon,
            color: configRank.color,
            minSalary: configRank.salaryRange.min,
            maxSalary: configRank.salaryRange.max,
            description: configRank.description,
            percentage: configRank.percentile,
            lifestyleLevel: configRank.lifestyleLevel
        };
    },

    // 获取下一个段位
    getNextRank(currentSalary) {
        const currentRank = this.getRank(currentSalary);
        const currentIndex = this.ranks.findIndex(r => r.name === currentRank.name);
        
        if (currentIndex < this.ranks.length - 1) {
            return this.ranks[currentIndex + 1];
        }
        return null; // 已经是最高段位
    },

    // 计算到下一段位的进度
    getProgress(salary) {
        const currentRank = this.getRank(salary);
        const nextRank = this.getNextRank(salary);
        
        if (!nextRank) {
            return 100; // 已经是最高段位
        }
        
        const rangeSize = currentRank.maxSalary - currentRank.minSalary;
        const currentProgress = salary - currentRank.minSalary;
        const percentage = (currentProgress / rangeSize) * 100;
        
        return Math.min(Math.max(percentage, 0), 100);
    },

    // 获取段位信息文本
    getRankInfo(salary) {
        const rank = this.getRank(salary);
        const nextRank = this.getNextRank(salary);
        const progress = this.getProgress(salary);
        
        let info = {
            current: rank,
            next: nextRank,
            progress: progress.toFixed(1),
            needMore: nextRank ? nextRank.minSalary - salary : 0
        };
        
        return info;
    },
    
    // 获取储蓄率建议
    getSavingsRateRecommendation(salary) {
        if (typeof hangzhouDataConfig === 'undefined') {
            console.error('hangzhouDataConfig 未定义');
            return { min: 0, max: 50, recommended: 30, reason: '平衡生活质量与储蓄', rankName: '未知' };
        }
        const rank = hangzhouDataConfig.getRankBySalary(salary);
        const recommendation = hangzhouDataConfig.savingsRateRecommendation[rank.id];
        
        return {
            min: recommendation.min,
            max: recommendation.max,
            recommended: recommendation.recommended,
            reason: recommendation.reason,
            rankName: rank.name
        };
    }
};
