# 设计文档

## 概述

本设计旨在统一段位系统（rank-system.js）和生活水平计算（lifestyle-data.js）的数据参考和计算逻辑。通过创建一个集中的配置文件（hangzhou-data-config.js），确保两个系统使用一致的杭州薪资数据和生活成本标准，提供更准确、更有参考价值的评估结果。

## 架构

### 当前架构问题

1. **数据重复**：段位系统和生活水平计算各自维护薪资阈值，容易不一致
2. **逻辑分散**：房租、交通等计算逻辑在两个文件中重复实现
3. **维护困难**：更新数据需要同时修改多个文件
4. **缺乏关联**：段位等级与生活水平描述没有明确对应关系

### 新架构设计

```
hangzhou-data-config.js (数据层)
    ↓
    ├─→ rank-system.js (段位评级)
    └─→ lifestyle-data.js (生活水平计算)
```

**核心原则：**
- 单一数据源（Single Source of Truth）
- 数据与逻辑分离
- 段位与生活水平强关联

## 组件和接口

### 1. hangzhou-data-config.js（新建）

集中管理所有数据参考和阈值配置。

#### 数据结构

```javascript
const hangzhouDataConfig = {
    // 杭州薪资参考数据（2024年）
    salaryReference: {
        average: 11000,      // 平均工资
        median: 8500,        // 中位数
        minimum: 2490,       // 最低工资
        updateDate: '2024-11'
    },
    
    // 8个段位定义（与生活水平阈值对齐）
    rankTiers: [
        {
            id: 'bronze',
            name: '青铜',
            icon: '🥉',
            color: '#CD7F32',
            salaryRange: { min: 0, max: 5000 },
            percentile: '后20%',
            lifestyleLevel: 'struggling',  // 对应生活水平等级
            description: '低于最低生活标准，生存压力大'
        },
        {
            id: 'silver',
            name: '白银',
            icon: '🥈',
            color: '#C0C0C0',
            salaryRange: { min: 5001, max: 7000 },
            percentile: '后30-50%',
            lifestyleLevel: 'subsistence',
            description: '温饱线，需要极度节俭'
        },
        {
            id: 'gold',
            name: '黄金',
            icon: '🥇',
            color: '#FFD700',
            salaryRange: { min: 7001, max: 10000 },
            percentile: '中等50-70%',
            lifestyleLevel: 'basic',
            description: '接近中位数，基本生活无忧'
        },
        {
            id: 'platinum',
            name: '铂金',
            icon: '💎',
            color: '#E5E4E2',
            salaryRange: { min: 10001, max: 15000 },
            percentile: '前30%',
            lifestyleLevel: 'comfortable',
            description: '达到平均水平，小康生活'
        },
        {
            id: 'diamond',
            name: '钻石',
            icon: '💠',
            color: '#B9F2FF',
            salaryRange: { min: 15001, max: 25000 },
            percentile: '前15%',
            lifestyleLevel: 'prosperous',
            description: '中产阶级，生活舒适'
        },
        {
            id: 'master',
            name: '大师',
            icon: '🌟',
            color: '#FFD700',
            salaryRange: { min: 25001, max: 35000 },
            percentile: '前8%',
            lifestyleLevel: 'affluent',
            description: '高收入群体，生活优越'
        },
        {
            id: 'grandmaster',
            name: '宗师',
            icon: '👑',
            color: '#9370DB',
            salaryRange: { min: 35001, max: 50000 },
            percentile: '前4%',
            lifestyleLevel: 'wealthy',
            description: '精英阶层，财务相对自由'
        },
        {
            id: 'king',
            name: '王者',
            icon: '⭐',
            color: '#FF6B6B',
            salaryRange: { min: 50001, max: Infinity },
            percentile: '前1%',
            lifestyleLevel: 'financial_freedom',
            description: '顶尖收入，财务自由'
        }
    ],
    
    // 生活成本计算阈值（与段位对齐）
    livingCosts: {
        // 房租阈值（基于段位）
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
        
        // 交通费用阈值（基于段位）
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
        
        // 餐饮消费阈值（基于剩余可支配收入）
        dining: [
            { maxRemaining: 1500, breakfast: 2, lunch: 7, dinner: 7, desc: '早餐很少吃，午晚餐食堂/快餐', budget: '早餐5元，午餐15元，晚餐18元', diningOut: '每月0-1次，人均50元（快餐）' },
            { maxRemaining: 2500, breakfast: 3, lunch: 7, dinner: 7, desc: '早餐偶尔吃，午晚餐快餐为主', budget: '早餐8元，午餐18元，晚餐20元', diningOut: '每月1-2次，人均70元（商场餐厅）' },
            { maxRemaining: 3500, breakfast: 5, lunch: 7, dinner: 7, desc: '工作日有早餐，午晚餐20-30元', budget: '早餐10元，午餐22元，晚餐28元', diningOut: '每月2-3次，人均100元（普通餐厅）' },
            { maxRemaining: 5000, breakfast: 7, lunch: 7, dinner: 7, desc: '三餐正常，午晚餐30-40元', budget: '早餐12元，午餐30元，晚餐35元', diningOut: '每月3-5次，人均150元（品质餐厅）' },
            { maxRemaining: 7000, breakfast: 7, lunch: 7, dinner: 7, desc: '三餐无忧，午晚餐40-60元', budget: '早餐15元，午餐40元，晚餐50元', diningOut: '每月6-8次，人均200元（中档餐厅）' },
            { maxRemaining: 10000, breakfast: 7, lunch: 7, dinner: 7, desc: '三餐品质好，午晚餐60-80元', budget: '早餐20元，午餐55元，晚餐65元', diningOut: '每周2-3次，人均300元（高档餐厅）' },
            { maxRemaining: Infinity, breakfast: 7, lunch: 7, dinner: 7, desc: '三餐自由，可以随心选择任何餐厅', budget: '早餐30元+，午餐80元+，晚餐100元+', diningOut: '随时想吃就吃，人均500元+不是问题' }
        ],
        
        // 服装消费阈值
        clothing: [
            { maxRemaining: 1500, desc: '每季度1件，平价品牌（50-100元/件）' },
            { maxRemaining: 2500, desc: '每季度2件，平价品牌（优衣库100-200元/件）' },
            { maxRemaining: 3500, desc: '每2月1件，中档品牌（ZARA 200-400元/件）' },
            { maxRemaining: 5000, desc: '每月1件，中档品牌（UR、COS 300-600元/件）' },
            { maxRemaining: 7000, desc: '每月1-2件，品牌服饰（Nike、Adidas 500-1000元/件）' },
            { maxRemaining: 10000, desc: '每月2件，轻奢品牌（CK、Tommy 800-1500元/件）' },
            { maxRemaining: Infinity, desc: '随心购买，奢侈品牌（Coach、MK 2000元+）也不心疼' }
        ],
        
        // 零食饮料消费阈值
        snacks: [
            { maxRemaining: 1500, desc: '每月200元，超市零食' },
            { maxRemaining: 2500, desc: '每月350元，超市零食+偶尔奶茶' },
            { maxRemaining: 3500, desc: '每月500元，每周2-3杯奶茶' },
            { maxRemaining: 5000, desc: '每月700元，奶茶自由（每天一杯）' },
            { maxRemaining: 7000, desc: '每月1000元，奶茶+咖啡自由' },
            { maxRemaining: 10000, desc: '每月1500元，星巴克随便喝+进口零食' },
            { maxRemaining: Infinity, desc: '每月2500元+，想吃什么买什么' }
        ],
        
        // 数码产品消费能力
        electronics: [
            { maxRemaining: 1500, desc: '需要攒8-12个月，只能买千元机' },
            { maxRemaining: 2500, desc: '需要攒6-8个月，入门款（2000元以内）' },
            { maxRemaining: 3500, desc: '攒4-5个月买中端机（小米/荣耀 2500-3500元）' },
            { maxRemaining: 5000, desc: '攒3-4个月买中高端（iPhone SE/小米旗舰 4000元）' },
            { maxRemaining: 7000, desc: '攒2-3个月买旗舰（iPhone 15/华为Mate 6000-7000元）' },
            { maxRemaining: 10000, desc: '攒1-2个月买高端旗舰，一年可换新机' },
            { maxRemaining: Infinity, desc: '想买就买，iPhone Pro Max、iPad Pro、MacBook随便选' }
        ],
        
        // 娱乐消费
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
    
    // 生活满意度评估（与段位对齐）
    satisfactionLevels: {
        struggling: { level: '艰难', desc: '在杭州生活压力很大，需要极度节俭', emoji: '😰' },
        subsistence: { level: '温饱', desc: '基本需求能满足，但需要精打细算，存不下钱', emoji: '😐' },
        basic: { level: '小康', desc: '生活基本无忧，偶尔能满足小愿望，有少量储蓄', emoji: '🙂' },
        comfortable: { level: '舒适', desc: '生活质量不错，大部分想要的都能得到', emoji: '😊' },
        prosperous: { level: '富足', desc: '生活很舒适，想要的基本都能实现，有投资能力', emoji: '😄' },
        affluent: { level: '优越', desc: '生活品质优越，追求更高层次的享受，财务压力小', emoji: '🤩' },
        wealthy: { level: '优越+', desc: '生活品质优越，追求更高层次的享受，财务压力小', emoji: '🤩' },
        financial_freedom: { level: '自由', desc: '财务相对自由，可以追求精神层面的满足', emoji: '😎' }
    },
    
    // 储蓄率建议（基于段位）
    savingsRateRecommendation: {
        bronze: { min: 0, max: 10, recommended: 5, reason: '优先保证基本生活质量' },
        silver: { min: 5, max: 15, recommended: 10, reason: '适度储蓄，避免过度节俭' },
        gold: { min: 15, max: 25, recommended: 20, reason: '建立应急储备金' },
        platinum: { min: 20, max: 35, recommended: 30, reason: '平衡生活质量与储蓄' },
        diamond: { min: 30, max: 45, recommended: 35, reason: '积累投资本金' },
        master: { min: 35, max: 50, recommended: 40, reason: '开始投资理财' },
        grandmaster: { min: 40, max: 60, recommended: 45, reason: '财富增值为主' },
        king: { min: 45, max: 70, recommended: 50, reason: '追求财务自由' }
    },
    
    // 工具函数
    getRankBySalary(salar
y) {
        return this.rankTiers.find(tier => 
            salary >= tier.salaryRange.min && salary <= tier.salaryRange.max
        ) || this.rankTiers[0];
    },
    
    getThresholdValue(thresholds, value) {
        return thresholds.find(t => value <= t.maxSalary || value <= t.maxRemaining) || thresholds[thresholds.length - 1];
    }
};

export default hangzhouDataConfig;
```

#### 接口说明

- `getRankBySalary(salary)`: 根据月薪获取对应的段位信息
- `getThresholdValue(thresholds, value)`: 根据阈值数组和值获取对应的配置项

### 2. rank-system.js（重构）

简化为使用配置文件的薄包装层。

#### 主要变更

```javascript
import hangzhouDataConfig from './hangzhou-data-config.js';

const rankSystem = {
    // 直接使用配置文件的段位数据
    get ranks() {
        return hangzhouDataConfig.rankTiers.map(tier => ({
            name: tier.name,
            icon: tier.icon,
            color: tier.color,
            minSalary: tier.salaryRange.min,
            maxSalary: tier.salaryRange.max,
            description: tier.description,
            percentage: `杭州${tier.percentile}`
        }));
    },
    
    getRank(salary) {
        const tier = hangzhouDataConfig.getRankBySalary(salary);
        return {
            name: tier.name,
            icon: tier.icon,
            color: tier.color,
            minSalary: tier.salaryRange.min,
            maxSalary: tier.salaryRange.max,
            description: tier.description,
            percentage: `杭州${tier.percentile}`,
            lifestyleLevel: tier.lifestyleLevel  // 新增：关联生活水平等级
        };
    },
    
    // 其他方法保持不变，但使用配置文件数据
    getNextRank(currentSalary) { /* ... */ },
    getProgress(salary) { /* ... */ },
    getRankInfo(salary) { /* ... */ }
};
```

### 3. lifestyle-data.js（重构）

使用配置文件的阈值数据，并与段位系统关联。

#### 主要变更

```javascript
import hangzhouDataConfig from './hangzhou-data-config.js';

const lifestyleData = {
    calculate(salary, peopleCount = 1, rent = null, utilities = null, savingsRate = null) {
        // 获取用户段位
        const rank = hangzhouDataConfig.getRankBySalary(salary);
        
        // 如果未指定储蓄率，使用段位推荐值
        const actualSavingsRate = savingsRate !== null 
            ? savingsRate 
            : hangzhouDataConfig.savingsRateRecommendation[rank.id].recommended;
        
        // 计算可支配收入
        const disposableIncome = salary * (1 - actualSavingsRate / 100);
        const perPersonDisposable = disposableIncome / peopleCount;
        
        // 使用配置文件计算基础开销
        const rentConfig = hangzhouDataConfig.getThresholdValue(
            hangzhouDataConfig.livingCosts.rent, 
            salary
        );
        const actualRent = rent !== null ? rent : rentConfig.amount;
        
        const transportConfig = hangzhouDataConfig.getThresholdValue(
            hangzhouDataConfig.livingCosts.transport, 
            salary
        );
        
        const actualUtilities = utilities !== null ? utilities : 300;
        
        const baseExpenses = {
            rent: actualRent / peopleCount,
            utilities: actualUtilities / peopleCount,
            transport: transportConfig.amount
        };
        
        // 剩余可支配金额
        const remaining = perPersonDisposable - baseExpenses.rent - baseExpenses.utilities - baseExpenses.transport;
        
        // 使用配置文件计算各项消费
        const diningConfig = hangzhouDataConfig.getThresholdValue(
            hangzhouDataConfig.livingCosts.dining,
            remaining
        );
        
        const clothingConfig = hangzhouDataConfig.getThresholdValue(
            hangzhouDataConfig.livingCosts.clothing,
            remaining
        );
        
        // ... 其他消费项类似
        
        // 获取满意度（基于段位的生活水平等级）
        const satisfaction = hangzhouDataConfig.satisfactionLevels[rank.lifestyleLevel];
        
        return {
            // 段位信息
            rank: rank,
            
            // 收入与储蓄
            salary: salary,
            savingsRate: actualSavingsRate,
            savingsRateRecommendation: hangzhouDataConfig.savingsRateRecommendation[rank.id],
            
            // 基础开销
            rent: actualRent,
            rentDesc: rentConfig.desc,
            transport: transportConfig.amount,
            transportDesc: transportConfig.desc,
            
            // 消费能力
            dining: diningConfig,
            clothing: clothingConfig.desc,
            
            // 满意度
            satisfaction: satisfaction,
            
            // ... 其他数据
        };
    }
};
```

## 数据模型

### 段位数据模型

```typescript
interface RankTier {
    id: string;                    // 段位ID（bronze, silver, ...）
    name: string;                  // 段位名称（青铜、白银、...）
    icon: string;                  // 段位图标
    color: string;                 // 段位颜色
    salaryRange: {
        min: number;               // 最低月薪
        max: number;               // 最高月薪
    };
    percentile: string;            // 百分位排名
    lifestyleLevel: string;        // 对应的生活水平等级
    description: string;           // 段位描述
}
```

### 生活成本阈值模型

```typescript
interface CostThreshold {
    maxSalary?: number;            // 薪资上限（用于房租、交通）
    maxRemaining?: number;         // 剩余可支配收入上限（用于消费）
    amount?: number;               // 金额
    desc: string;                  // 描述
    [key: string]: any;            // 其他特定字段
}
```

### 生活水平计算结果模型

```typescript
interface LifestyleResult {
    rank: RankTier;                // 用户段位
    salary: number;                // 月薪
    savingsRate: number;           // 储蓄率
    savingsRateRecommendation: {   // 储蓄率建议
        min: number;
        max: number;
        recommended: number;
        reason: string;
    };
    disposableIncome: number;      // 可支配收入
    rent: number;                  // 房租
    rentDesc: string;              // 房租描述
    transport: number;             // 交通费
    transportDesc: string;         // 交通描述
    remaining: number;             // 剩余金额
    dining: DiningConfig;          // 餐饮配置
    clothing: string;              // 服装消费
    snacks: string;                // 零食消费
    electronics: string;           // 数码产品
    entertainment: string;         // 娱乐消费
    satisfaction: {                // 满意度
        level: string;
        desc: string;
        emoji: string;
    };
}
```

## 错误处理

### 输入验证

1. **月薪验证**
   - 必须为正数
   - 建议范围：0-200000元
   - 超出范围给出警告但不阻止计算

2. **人数验证**
   - 必须为正整数
   - 建议范围：1-10人
   - 默认值：1人

3. **储蓄率验证**
   - 必须在0-100之间
   - 给出基于段位的推荐值
   - 默认值：根据段位自动设置

4. **自定义开销验证**
   - 房租、水电费必须为非负数
   - 过高的自定义值给出警告

### 错误类型

```javascript
const ErrorTypes = {
    INVALID_SALARY: '月薪必须为正数',
    INVALID_PEOPLE_COUNT: '人数必须为正整数',
    INVALID_SAVINGS_RATE: '储蓄率必须在0-100之间',
    INVALID_CUSTOM_COST: '自定义开销必须为非负数',
    CONFIG_NOT_LOADED: '配置文件加载失败'
};
```

### 降级策略

1. 如果配置文件加载失败，使用硬编码的默认值
2. 如果某个阈值查找失败，返回最接近的阈值
3. 如果计算结果异常，返回保守估计值

## 测试策略

### 单元测试

1. **配置文件测试**
   - 验证所有段位的薪资区间连续且不重叠
   - 验证所有阈值数组按升序排列
   - 验证所有必需字段存在

2. **段位系统测试**
   - 测试边界值（如5000元应为青铜，5001元应为白银）
   - 测试段位进度计算
   - 测试下一段位获取

3. **生活水平计算测试**
   - 测试不同月薪下的计算结果
   - 测试多人生活的分摊计算
   - 测试自定义储蓄率的影响
   - 测试自定义房租、水电的影响

### 集成测试

1. **数据一致性测试**
   - 验证段位系统和生活水平计算使用相同的薪资阈值
   - 验证段位描述与生活满意度描述一致
   - 验证百分位排名数据一致

2. **端到端测试**
   - 模拟用户输入不同月薪，验证完整流程
   - 验证UI显示的段位信息与计算结果匹配

### 测试用例

```javascript
// 测试用例示例
const testCases = [
    {
        salary: 5000,
        expectedRank: '青铜',
        expectedSatisfaction: '艰难',
        expectedSavingsRate: 5
    },
    {
        salary: 10000,
        expectedRank: '黄金',
        expectedSatisfaction: '小康',
        expectedSavingsRate: 20
    },
    {
        salary: 50000,
        expectedRank: '王者',
        expectedSatisfaction: '自由',
        expectedSavingsRate: 50
    }
];
```

## 实现计划

### 阶段1：创建配置文件
1. 创建 hangzhou-data-config.js
2. 迁移所有硬编码数据到配置文件
3. 添加工具函数

### 阶段2：重构段位系统
1. 修改 rank-system.js 使用配置文件
2. 添加 lifestyleLevel 关联
3. 更新所有引用

### 阶段3：重构生活水平计算
1. 修改 lifestyle-data.js 使用配置文件
2. 集成段位信息
3. 实现储蓄率推荐

### 阶段4：UI更新
1. 在段位显示中添加生活水平等级
2. 在生活水平计算中显示段位信息
3. 添加储蓄率建议提示

### 阶段5：测试与优化
1. 编写单元测试
2. 进行集成测试
3. 性能优化

## 迁移策略

### 向后兼容

1. 保持现有API接口不变
2. 新增的字段为可选
3. 提供默认值确保旧代码正常运行

### 数据迁移

1. 不需要数据库迁移（纯前端计算）
2. 配置文件可独立更新
3. 支持热更新（刷新页面即可）

### 回滚计划

1. 保留原始文件的备份
2. 配置文件独立，可快速切换
3. 如有问题可立即回退到旧版本

## 性能考虑

### 优化点

1. **配置文件缓存**：一次加载，多次使用
2. **阈值查找优化**：使用二分查找（如果数组很大）
3. **计算结果缓存**：相同输入返回缓存结果

### 性能目标

- 配置文件加载时间：< 10ms
- 单次计算时间：< 5ms
- 内存占用：< 1MB

## 安全考虑

### 输入安全

1. 所有用户输入进行类型检查和范围验证
2. 防止注入攻击（虽然是纯前端计算）
3. 敏感数据不记录日志

### 数据隐私

1. 所有计算在客户端完成
2. 不向服务器发送用户薪资数据
3. 不使用Cookie或LocalStorage存储敏感信息

## 维护指南

### 更新配置数据

1. 修改 hangzhou-data-config.js 中的相应字段
2. 更新 updateDate 字段
3. 在注释中说明更新原因和数据来源

### 添加新段位

1. 在 rankTiers 数组中添加新段位
2. 确保薪资区间连续
3. 添加对应的生活满意度等级
4. 更新储蓄率建议

### 添加新消费类别

1. 在 livingCosts 中添加新的阈值数组
2. 在 lifestyle-data.js 中添加计算逻辑
3. 在 formatLifestyle 中添加显示逻辑

## 文档

### 代码注释

- 所有配置项添加详细注释
- 说明数据来源和更新时间
- 关键算法添加计算说明

### 用户文档

- 说明段位系统的评级标准
- 解释生活水平计算的依据
- 提供储蓄率建议的理由

### 开发文档

- 配置文件结构说明
- API接口文档
- 测试用例文档
