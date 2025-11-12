/**
 * 杭州数据配置文件 - 统一数据源
 * 
 * 用途：为段位系统和生活水平计算提供统一的数据参考
 * 包含：杭州薪资数据、段位配置、生活成本阈值、满意度评估等
 * 
 * 数据来源：杭州2024年实际薪资水平和生活成本
 * 更新时间：2024-11
 * 
 * 参考数据：
 * - 杭州平均工资：11000元/月
 * - 杭州中位数工资：8500元/月
 * - 杭州最低工资：2490元/月
 */

const hangzhouDataConfig = {
    /**
     * 杭州薪资参考数据（2024年）
     */
    salaryReference: {
        average: 11000,      // 平均工资
        median: 8500,        // 中位数
        minimum: 2490,       // 最低工资
        updateDate: '2024-11'
    },
    
    /**
     * 8个段位定义（与生活水平阈值对齐）
     * 薪资区间连续且不重叠
     */
    rankTiers: [
        {
            id: 'bronze',
            name: '青铜',
            icon: '🥉',
            color: '#CD7F32',
            salaryRange: { min: 0, max: 5000 },
            percentile: '20%',
            lifestyleLevel: 'struggling',
            description: '低于最低生活标准，生存压力大'
        },
        {
            id: 'silver',
            name: '白银',
            icon: '🥈',
            color: '#C0C0C0',
            salaryRange: { min: 5001, max: 7000 },
            percentile: '40%',
            lifestyleLevel: 'subsistence',
            description: '温饱线，需要极度节俭'
        },
        {
            id: 'gold',
            name: '黄金',
            icon: '🥇',
            color: '#FFD700',
            salaryRange: { min: 7001, max: 10000 },
            percentile: '60%',
            lifestyleLevel: 'basic',
            description: '接近中位数，基本生活无忧'
        },
        {
            id: 'platinum',
            name: '铂金',
            icon: '💎',
            color: '#00CED1',
            salaryRange: { min: 10001, max: 15000 },
            percentile: '70%',
            lifestyleLevel: 'comfortable',
            description: '达到平均水平，小康生活'
        },
        {
            id: 'diamond',
            name: '钻石',
            icon: '💠',
            color: '#4169E1',
            salaryRange: { min: 15001, max: 25000 },
            percentile: '85%',
            lifestyleLevel: 'prosperous',
            description: '中产阶级，生活舒适'
        },
        {
            id: 'master',
            name: '大师',
            icon: '🏆',
            color: '#FF8C00',
            salaryRange: { min: 25001, max: 35000 },
            percentile: '92%',
            lifestyleLevel: 'affluent',
            description: '高收入群体，生活优越'
        },
        {
            id: 'grandmaster',
            name: '宗师',
            icon: '👑',
            color: '#9370DB',
            salaryRange: { min: 35001, max: 50000 },
            percentile: '96%',
            lifestyleLevel: 'wealthy',
            description: '精英阶层，财务相对自由'
        },
        {
            id: 'king',
            name: '王者',
            icon: '⭐',
            color: '#FF6B6B',
            salaryRange: { min: 50001, max: Infinity },
            percentile: '99%',
            lifestyleLevel: 'financial_freedom',
            description: '顶尖收入，财务自由'
        }
    ],
    
    /**
     * 生活成本计算阈值（与段位对齐）
     */
    livingCosts: {
        /**
         * 房租阈值（基于月薪）
         * 数据来源：杭州2024年租房市场实际价格
         */
        rent: [
            { maxSalary: 5000, amount: 1200, desc: '城中村/远郊合租' },
            { maxSalary: 7000, amount: 1500, desc: '远郊合租单间' },
            { maxSalary: 10000, amount: 2000, desc: '普通合租单间' },
            { maxSalary: 15000, amount: 3000, desc: '品质合租/小一居' },
            { maxSalary: 20000, amount: 4500, desc: '一居室' },
            { maxSalary: 30000, amount: 6500, desc: '两居室' },
            { maxSalary: 50000, amount: 9000, desc: '三居室/品质小区' },
            { maxSalary: Infinity, amount: 15000, desc: '高档住宅' }
        ],
        
        /**
         * 交通费用阈值（基于月薪）
         * 数据来源：杭州2024年交通成本（地铁、公交、打车、开车）
         */
        transport: [
            { maxSalary: 5000, amount: 200, desc: '地铁+公交' },
            { maxSalary: 7000, amount: 250, desc: '地铁为主' },
            { maxSalary: 10000, amount: 350, desc: '地铁+偶尔打车' },
            { maxSalary: 15000, amount: 600, desc: '打车+地铁' },
            { maxSalary: 20000, amount: 1000, desc: '经常打车/电动车' },
            { maxSalary: 30000, amount: 1500, desc: '开车通勤（油费+停车）' },
            { maxSalary: 50000, amount: 2000, desc: '开车+停车' },
            { maxSalary: Infinity, amount: 2500, desc: '开车+偶尔代驾' }
        ],
        
        /**
         * 餐饮消费阈值（基于剩余可支配收入）
         * 数据来源：杭州2024年餐饮市场实际价格
         */
        dining: [
            { 
                maxRemaining: 1500, 
                breakfast: 2, 
                lunch: 7, 
                dinner: 7, 
                desc: '早餐很少吃，午晚餐食堂/快餐', 
                budget: '早餐5元，午餐15元，晚餐18元', 
                diningOut: '每月0-1次，人均50元（快餐）' 
            },
            { 
                maxRemaining: 2500, 
                breakfast: 3, 
                lunch: 7, 
                dinner: 7, 
                desc: '早餐偶尔吃，午晚餐快餐为主', 
                budget: '早餐8元，午餐18元，晚餐20元', 
                diningOut: '每月1-2次，人均70元（商场餐厅）' 
            },
            { 
                maxRemaining: 3500, 
                breakfast: 5, 
                lunch: 7, 
                dinner: 7, 
                desc: '工作日有早餐，午晚餐20-30元', 
                budget: '早餐10元，午餐22元，晚餐28元', 
                diningOut: '每月2-3次，人均100元（普通餐厅）' 
            },
            { 
                maxRemaining: 5000, 
                breakfast: 7, 
                lunch: 7, 
                dinner: 7, 
                desc: '三餐正常，午晚餐30-40元', 
                budget: '早餐12元，午餐30元，晚餐35元', 
                diningOut: '每月3-5次，人均150元（品质餐厅）' 
            },
            { 
                maxRemaining: 7000, 
                breakfast: 7, 
                lunch: 7, 
                dinner: 7, 
                desc: '三餐无忧，午晚餐40-60元', 
                budget: '早餐15元，午餐40元，晚餐50元', 
                diningOut: '每月6-8次，人均200元（中档餐厅）' 
            },
            { 
                maxRemaining: 10000, 
                breakfast: 7, 
                lunch: 7, 
                dinner: 7, 
                desc: '三餐品质好，午晚餐60-80元', 
                budget: '早餐20元，午餐55元，晚餐65元', 
                diningOut: '每周2-3次，人均300元（高档餐厅）' 
            },
            { 
                maxRemaining: Infinity, 
                breakfast: 7, 
                lunch: 7, 
                dinner: 7, 
                desc: '三餐自由，可以随心选择任何餐厅', 
                budget: '早餐30元+，午餐80元+，晚餐100元+', 
                diningOut: '随时想吃就吃，人均500元+不是问题' 
            }
        ],
        
        /**
         * 服装消费阈值（基于剩余可支配收入）
         * 数据来源：杭州2024年服装市场价格（平价到奢侈品牌）
         */
        clothing: [
            { maxRemaining: 1500, desc: '每季度1件，平价品牌（50-100元/件）' },
            { maxRemaining: 2500, desc: '每季度2件，平价品牌（优衣库100-200元/件）' },
            { maxRemaining: 3500, desc: '每2月1件，中档品牌（ZARA 200-400元/件）' },
            { maxRemaining: 5000, desc: '每月1件，中档品牌（UR、COS 300-600元/件）' },
            { maxRemaining: 7000, desc: '每月1-2件，品牌服饰（Nike、Adidas 500-1000元/件）' },
            { maxRemaining: 10000, desc: '每月2件，轻奢品牌（CK、Tommy 800-1500元/件）' },
            { maxRemaining: Infinity, desc: '随心购买，奢侈品牌（Coach、MK 2000元+）也不心疼' }
        ],
        
        /**
         * 零食饮料消费阈值（基于剩余可支配收入）
         * 数据来源：杭州2024年零食、奶茶、咖啡价格
         */
        snacks: [
            { maxRemaining: 1500, desc: '每月200元，超市零食' },
            { maxRemaining: 2500, desc: '每月350元，超市零食+偶尔奶茶' },
            { maxRemaining: 3500, desc: '每月500元，每周2-3杯奶茶' },
            { maxRemaining: 5000, desc: '每月700元，奶茶自由（每天一杯）' },
            { maxRemaining: 7000, desc: '每月1000元，奶茶+咖啡自由' },
            { maxRemaining: 10000, desc: '每月1500元，星巴克随便喝+进口零食' },
            { maxRemaining: Infinity, desc: '每月2500元+，想吃什么买什么' }
        ],
        
        /**
         * 数码产品消费能力（基于剩余可支配收入）
         * 数据来源：杭州2024年数码产品市场价格
         */
        electronics: [
            { maxRemaining: 1500, desc: '需要攒8-12个月，只能买千元机' },
            { maxRemaining: 2500, desc: '需要攒6-8个月，入门款（2000元以内）' },
            { maxRemaining: 3500, desc: '攒4-5个月买中端机（小米/荣耀 2500-3500元）' },
            { maxRemaining: 5000, desc: '攒3-4个月买中高端（iPhone SE/小米旗舰 4000元）' },
            { maxRemaining: 7000, desc: '攒2-3个月买旗舰（iPhone 15/华为Mate 6000-7000元）' },
            { maxRemaining: 10000, desc: '攒1-2个月买高端旗舰，一年可换新机' },
            { maxRemaining: Infinity, desc: '想买就买，iPhone Pro Max、iPad Pro、MacBook随便选' }
        ],
        
        /**
         * 娱乐消费阈值（基于剩余可支配收入）
         * 数据来源：杭州2024年娱乐消费价格（电影、KTV、剧本杀、演唱会等）
         */
        entertainment: [
            { maxRemaining: 1500, desc: '每月1次电影（50元），主要靠免费娱乐' },
            { maxRemaining: 2500, desc: '每月2次电影（60元/次），偶尔逛展' },
            { maxRemaining: 3500, desc: '每月3-4次电影/剧本杀（100元/次）' },
            { maxRemaining: 5000, desc: '每月5-6次娱乐（KTV、密室 150元/次）' },
            { maxRemaining: 7000, desc: '每周1-2次娱乐（展览、剧本杀 200元/次）' },
            { maxRemaining: 10000, desc: '每周2-3次娱乐，演唱会、音乐节都能去（500元/次）' },
            { maxRemaining: Infinity, desc: '想玩就玩，周末短途游、演唱会VIP、高端SPA随心所欲' }
        ]
    },
    
    /**
     * 生活满意度评估（与段位的lifestyleLevel一一对应）
     * 8个生活水平等级
     */
    satisfactionLevels: {
        struggling: { 
            level: '艰难', 
            desc: '在杭州生活压力很大，需要极度节俭', 
            emoji: '😰' 
        },
        subsistence: { 
            level: '温饱', 
            desc: '基本需求能满足，但需要精打细算，存不下钱', 
            emoji: '😐' 
        },
        basic: { 
            level: '小康', 
            desc: '生活基本无忧，偶尔能满足小愿望，有少量储蓄', 
            emoji: '🙂' 
        },
        comfortable: { 
            level: '舒适', 
            desc: '生活质量不错，大部分想要的都能得到', 
            emoji: '😊' 
        },
        prosperous: { 
            level: '富足', 
            desc: '生活很舒适，想要的基本都能实现，有投资能力', 
            emoji: '😄' 
        },
        affluent: { 
            level: '优越', 
            desc: '生活品质优越，追求更高层次的享受，财务压力小', 
            emoji: '🤩' 
        },
        wealthy: { 
            level: '优越+', 
            desc: '生活品质优越，追求更高层次的享受，财务压力小', 
            emoji: '🤩' 
        },
        financial_freedom: { 
            level: '自由', 
            desc: '财务相对自由，可以追求精神层面的满足', 
            emoji: '😎' 
        }
    },
    
    /**
     * 储蓄率建议（基于段位）
     * 青铜段位推荐5%，王者段位推荐50%，中间段位递增
     */
    savingsRateRecommendation: {
        bronze: { 
            min: 0, 
            max: 10, 
            recommended: 5, 
            reason: '优先保证基本生活质量' 
        },
        silver: { 
            min: 5, 
            max: 15, 
            recommended: 10, 
            reason: '适度储蓄，避免过度节俭' 
        },
        gold: { 
            min: 15, 
            max: 25, 
            recommended: 20, 
            reason: '建立应急储备金' 
        },
        platinum: { 
            min: 20, 
            max: 35, 
            recommended: 30, 
            reason: '平衡生活质量与储蓄' 
        },
        diamond: { 
            min: 30, 
            max: 45, 
            recommended: 35, 
            reason: '积累投资本金' 
        },
        master: { 
            min: 35, 
            max: 50, 
            recommended: 40, 
            reason: '开始投资理财' 
        },
        grandmaster: { 
            min: 40, 
            max: 60, 
            recommended: 45, 
            reason: '财富增值为主' 
        },
        king: { 
            min: 45, 
            max: 70, 
            recommended: 50, 
            reason: '追求财务自由' 
        }
    },
    
    /**
     * 工具函数：根据月薪查找对应段位
     * @param {number} salary - 月薪
     * @returns {object} 段位信息对象
     */
    getRankBySalary(salary) {
        // 边界情况处理：月薪为0或负数，返回最低段位
        if (salary <= 0) {
            return this.rankTiers[0];
        }
        
        // 查找对应段位
        const rank = this.rankTiers.find(tier => 
            salary >= tier.salaryRange.min && salary <= tier.salaryRange.max
        );
        
        // 如果找不到（理论上不会发生，因为最高段位max是Infinity），返回最低段位
        return rank || this.rankTiers[0];
    },
    
    /**
     * 工具函数：根据阈值数组查找对应配置
     * @param {Array} thresholds - 阈值数组
     * @param {number} value - 查找值（可能是月薪或剩余可支配收入）
     * @returns {object} 对应的配置对象
     */
    getThresholdValue(thresholds, value) {
        // 边界情况处理：值为0或负数，返回第一个阈值
        if (value <= 0) {
            return thresholds[0];
        }
        
        // 查找对应阈值（支持maxSalary和maxRemaining两种字段）
        const threshold = thresholds.find(t => {
            if (t.maxSalary !== undefined) {
                return value <= t.maxSalary;
            } else if (t.maxRemaining !== undefined) {
                return value <= t.maxRemaining;
            }
            return false;
        });
        
        // 如果找不到（超出最大值），返回最后一个阈值
        return threshold || thresholds[thresholds.length - 1];
    }
};

export default hangzhouDataConfig
