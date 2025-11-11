// 生活水平数据 - 基于杭州2024年实际开销计算

const lifestyleData = {
    // 输入验证函数
    validateSalary(salary) {
        if (typeof salary !== 'number' || isNaN(salary)) {
            throw new Error('月薪必须是有效的数字');
        }
        if (salary < 0) {
            throw new Error('月薪不能为负数');
        }
        if (salary > 1000000) {
            console.warn('月薪超过100万元，这是一个非常高的值');
        }
        return true;
    },
    
    validatePeopleCount(count) {
        if (typeof count !== 'number' || isNaN(count)) {
            throw new Error('人数必须是有效的数字');
        }
        if (!Number.isInteger(count)) {
            throw new Error('人数必须是整数');
        }
        if (count < 1) {
            throw new Error('人数至少为1人');
        }
        if (count > 20) {
            console.warn('人数超过20人，这是一个非常大的值');
        }
        return true;
    },
    
    validateSavingsRate(rate) {
        if (rate === null || rate === undefined) {
            return true; // 允许为空，将使用默认值
        }
        if (typeof rate !== 'number' || isNaN(rate)) {
            throw new Error('储蓄率必须是有效的数字');
        }
        if (rate < 0 || rate > 100) {
            throw new Error('储蓄率必须在0-100之间');
        }
        return true;
    },
    
    validateCustomCost(cost) {
        if (cost === null || cost === undefined) {
            return true; // 允许为空，将使用默认值
        }
        if (typeof cost !== 'number' || isNaN(cost)) {
            throw new Error('费用必须是有效的数字');
        }
        if (cost < 0) {
            throw new Error('费用不能为负数');
        }
        return true;
    },
    
    // 计算生活水平
    calculate(salary, peopleCount = 1, rent = null, utilities = null, savingsRate = null) {
        // 输入验证
        try {
            this.validateSalary(salary);
            this.validatePeopleCount(peopleCount);
            this.validateSavingsRate(savingsRate);
            this.validateCustomCost(rent);
            this.validateCustomCost(utilities);
        } catch (error) {
            console.error('输入验证失败:', error.message);
            throw error;
        }
        
        // 获取用户段位（带降级策略）
        let rank;
        try {
            if (typeof hangzhouDataConfig === 'undefined') {
                throw new Error('hangzhouDataConfig 未定义');
            }
            rank = hangzhouDataConfig.getRankBySalary(salary);
        } catch (error) {
            console.error('获取段位失败，使用默认段位:', error);
            // 降级策略：使用默认青铜段位
            rank = {
                id: 'bronze',
                name: '青铜',
                icon: '🥉',
                color: '#CD7F32',
                salaryRange: { min: 0, max: 5000 },
                percentile: '后20%',
                lifestyleLevel: 'struggling',
                description: '低于最低生活标准，生存压力大'
            };
        }
        
        // 如果未指定储蓄率，使用段位推荐的储蓄率（带降级策略）
        let actualSavingsRate;
        let savingsRateRecommendation;
        try {
            savingsRateRecommendation = hangzhouDataConfig.savingsRateRecommendation[rank.id];
            actualSavingsRate = savingsRate !== null ? savingsRate : savingsRateRecommendation.recommended;
        } catch (error) {
            console.error('获取储蓄率建议失败，使用默认值:', error);
            // 降级策略：使用默认储蓄率
            actualSavingsRate = savingsRate !== null ? savingsRate : 30;
            savingsRateRecommendation = {
                min: 0,
                max: 50,
                recommended: 30,
                reason: '平衡生活质量与储蓄'
            };
        }
        
        // 根据用户设置的储蓄率计算可支配收入
        const disposableIncome = salary * (1 - actualSavingsRate / 100);
        const perPersonDisposable = disposableIncome / peopleCount;
        
        // 基础开销（基于个人月薪，而非分摊后的可支配收入）
        // 使用配置文件查找房租和交通费用（带降级策略）
        let rentConfig, transportConfig;
        try {
            rentConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.rent, salary);
            transportConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.transport, salary);
        } catch (error) {
            console.error('获取基础开销配置失败，使用默认值:', error);
            // 降级策略：使用保守估计值
            rentConfig = { amount: 2000, desc: '普通合租' };
            transportConfig = { amount: 300, desc: '地铁+公交' };
        }
        
        const actualRent = rent !== null ? rent : rentConfig.amount;
        const actualUtilities = utilities !== null ? utilities : 300;
        
        const baseExpenses = {
            rent: actualRent / peopleCount, // 房租按人数分摊
            utilities: actualUtilities / peopleCount, // 水电网费按人数分摊
            transport: transportConfig.amount, // 交通费基于个人月薪
        };
        
        // 剩余可支配金额（人均）
        const remaining = perPersonDisposable - baseExpenses.rent - baseExpenses.utilities - baseExpenses.transport;
        
        // 使用配置文件查找各项消费阈值（基于剩余可支配收入，带降级策略）
        let diningConfig, clothingConfig, snacksConfig, electronicsConfig, entertainmentConfig, satisfaction;
        try {
            diningConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.dining, remaining);
            clothingConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.clothing, remaining);
            snacksConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.snacks, remaining);
            electronicsConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.electronics, remaining);
            entertainmentConfig = hangzhouDataConfig.getThresholdValue(hangzhouDataConfig.livingCosts.entertainment, remaining);
            satisfaction = hangzhouDataConfig.satisfactionLevels[rank.lifestyleLevel];
        } catch (error) {
            console.error('获取消费配置失败，使用默认值:', error);
            // 降级策略：使用保守估计值
            diningConfig = {
                breakfast: 5,
                lunch: 7,
                dinner: 7,
                desc: '三餐基本满足',
                budget: '早餐10元，午餐25元，晚餐30元',
                diningOut: '每月2-3次外出聚餐'
            };
            clothingConfig = { desc: '每月适度购买' };
            snacksConfig = { desc: '每月适度消费' };
            electronicsConfig = { desc: '需要攒几个月购买' };
            entertainmentConfig = { desc: '每月适度娱乐' };
            satisfaction = { level: '一般', desc: '生活基本满足', emoji: '🙂' };
        }
        
        // 计算各项消费
        const lifestyle = {
            // 段位信息
            rank: {
                id: rank.id,
                name: rank.name,
                icon: rank.icon,
                color: rank.color,
                percentile: rank.percentile,
                lifestyleLevel: rank.lifestyleLevel
            },
            
            // 基础信息
            salary: salary,
            people: peopleCount,
            savingsRate: actualSavingsRate,
            savingsRateRecommendation: savingsRateRecommendation,
            monthlySavings: salary * (actualSavingsRate / 100),
            yearlySavings: salary * (actualSavingsRate / 100) * 12,
            
            // 可支配收入
            disposableIncome: disposableIncome,
            perPersonDisposable: perPersonDisposable,
            
            // 基础开销
            rent: actualRent,
            rentDesc: rentConfig.desc,
            utilities: actualUtilities,
            transport: transportConfig.amount,
            transportDesc: transportConfig.desc,
            baseExpensesTotal: actualRent + actualUtilities + transportConfig.amount * peopleCount,
            
            // 剩余金额
            remaining: remaining,
            
            // 饮食
            mealsPerDay: {
                breakfast: diningConfig.breakfast,
                lunch: diningConfig.lunch,
                dinner: diningConfig.dinner,
                desc: diningConfig.desc
            },
            mealBudget: diningConfig.budget,
            diningOut: diningConfig.diningOut,
            
            // 购物
            clothing: clothingConfig.desc,
            snacks: snacksConfig.desc,
            
            // 数码产品
            electronics: electronicsConfig.desc,
            
            // 娱乐
            entertainment: entertainmentConfig.desc,
            
            // 总体满意度（基于段位的生活水平等级）
            satisfaction: satisfaction
        };
        
        return this.formatLifestyle(lifestyle);
    },
    
    formatLifestyle(data) {
        const items = [
            // === 段位信息 ===
            { 
                icon: data.rank.icon, 
                title: `段位：${data.rank.name}`, 
                desc: `在杭州属于${data.rank.percentile}，${data.satisfaction.level}生活水平`,
                category: 'rank'
            },
            
            // === 收入与储蓄 ===
            { 
                icon: '💰', 
                title: '收入与储蓄', 
                desc: `月薪${data.salary}元，储蓄率${data.savingsRate}%（建议${data.savingsRateRecommendation.recommended}%：${data.savingsRateRecommendation.reason}），每月存${data.monthlySavings.toFixed(0)}元，一年存${data.yearlySavings.toFixed(0)}元`,
                category: 'income'
            },
            
            // === 基础开销（必需） ===
            { 
                icon: '🏠', 
                title: '【基础开销】住房', 
                desc: `${data.people}人生活，房租${data.rent}元/月（${data.rentDesc}），人均${(data.rent/data.people).toFixed(0)}元`,
                category: 'basic'
            },
            { 
                icon: '💡', 
                title: '【基础开销】水电网', 
                desc: `水电网费${data.utilities}元/月，人均${(data.utilities/data.people).toFixed(0)}元`,
                category: 'basic'
            },
            { 
                icon: '🚇', 
                title: '【基础开销】交通', 
                desc: `交通费${data.transport}元/月（${data.transportDesc}）`,
                category: 'basic'
            },
            
            // === 日常饮食（必需） ===
            { 
                icon: '🍚', 
                title: '【日常饮食】三餐', 
                desc: `${data.mealsPerDay.desc}，${data.mealBudget}`,
                category: 'food'
            },
            { 
                icon: '🍽️', 
                title: '【日常饮食】聚餐', 
                desc: data.diningOut,
                category: 'food'
            },
            
            // === 日常消费（半必需） ===
            { 
                icon: '👕', 
                title: '【日常消费】服装', 
                desc: data.clothing,
                category: 'daily'
            },
            { 
                icon: '🍿', 
                title: '【日常消费】零食', 
                desc: data.snacks,
                category: 'daily'
            },
            
            // === 大件消费（可选） ===
            { 
                icon: '📱', 
                title: '【大件消费】数码', 
                desc: data.electronics,
                category: 'optional'
            },
            { 
                icon: '🎮', 
                title: '【大件消费】娱乐', 
                desc: data.entertainment,
                category: 'optional'
            },
            
            // === 整体评价 ===
            { 
                icon: data.satisfaction.emoji, 
                title: `生活满意度：${data.satisfaction.level}`, 
                desc: data.satisfaction.desc,
                category: 'summary'
            }
        ];
        
        return items;
    },

    getLifestyle(salary, peopleCount = 1, rent = null, utilities = null, savingsRate = 30) {
        return this.calculate(salary, peopleCount, rent, utilities, savingsRate);
    }
};

// 升级建议数据
const upgradeTips = {
    getTips(salary, rank) {
        const tips = [];
        
        if (salary < 10000) {
            tips.push({
                title: '提升技能',
                content: '学习一门热门技术（前端/后端/数据分析），参加在线课程，获得认证证书。'
            });
            tips.push({
                title: '积累经验',
                content: '参与实际项目，建立个人作品集，在 GitHub 上展示你的代码。'
            });
        } else if (salary < 20000) {
            tips.push({
                title: '深度专精',
                content: '在当前领域深耕，成为某个细分方向的专家，提升不可替代性。'
            });
            tips.push({
                title: '拓展人脉',
                content: '参加行业活动，建立职业人脉，寻找更好的职业机会。'
            });
        } else if (salary < 35000) {
            tips.push({
                title: '管理能力',
                content: '培养团队管理能力，向技术管理或项目管理方向发展。'
            });
            tips.push({
                title: '行业影响力',
                content: '撰写技术博客，参与开源项目，在行业内建立个人品牌。'
            });
        } else {
            tips.push({
                title: '战略思维',
                content: '提升商业思维和战略眼光，考虑创业或成为合伙人。'
            });
            tips.push({
                title: '投资理财',
                content: '学习投资理财知识，实现财富增值，建立被动收入渠道。'
            });
        }
        
        tips.push({
            title: '持续学习',
            content: '保持学习热情，关注行业动态，每年设定新的学习目标。'
        });
        
        return tips;
    }
};

export default { lifestyleData, upgradeTips }
