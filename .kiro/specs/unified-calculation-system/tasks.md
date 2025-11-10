# 实施计划

- [x] 1. 创建统一配置文件




- [x] 1.1 创建 hangzhou-data-config.js 文件







  - 定义文件结构和导出方式
  - 添加详细的文件头注释说明用途和更新时间
  - _需求: 1.1, 4.1, 4.2_


- [-] 1.2 迁移杭州薪资参考数据

  - 从 rank-system.js 提取薪资参考数据（平均工资11000、中位数8500、最低工资2490）
  - 创建 salaryReference 对象
  - 添加 updateDate 字段标记数据更新时间
  - _需求: 1.1, 4.2_


- [-] 1.3 定义8个段位配置

  - 创建 rankTiers 数组，包含8个段位（青铜到王者）
  - 每个段位包含：id、name、icon、color、salaryRange、percentile、lifestyleLevel、description
  - 确保薪资区间连续且不重叠（青铜0-5000，白银5001-7000，...，王者50001+）
  - 为每个段位分配对应的生活水平等级（struggling、subsistence、basic、comfortable、prosperous、affluent、wealthy、financial_freedom）

  - _需求: 1.2, 2.1, 6.3_

- [-] 1.4 迁移房租计算阈值

  - 从 lifestyle-data.js 提取 calculateRent 函数中的阈值数据
  - 创建 livingCosts.rent 数组，包含8个阈值配置
  - 每个配置包含：maxSalary、amount、desc
  - 确保阈值与段位薪资区间对齐

  - _需求: 1.1, 3.2, 4.4_


- [ ] 1.5 迁移交通费用阈值
  - 从 lifestyle-data.js 提取 calculateTransport 函数中的阈值数据
  - 创建 livingCosts.transport 数组，包含8个阈值配置

  - 每个配置包含：maxSalary、amount、desc
  - 确保阈值与段位薪资区间对齐
  - _需求: 1.1, 3.3, 4.4_

- [-] 1.6 迁移餐饮消费阈值

  - 从 lifestyle-data.js 提取 calculateMeals、calculateMealBudget、calculateDiningOut 函数中的阈值数据
  - 创建 livingCosts.dining 数组，包含7个阈值配置

  - 每个配置包含：maxRemaining、breakfast、lunch、dinner、desc、budget、diningOut
  - 基于剩余可支配收入而非月薪
  - _需求: 1.1, 4.4_



- [ ] 1.7 迁移其他消费阈值
  - 迁移服装消费（clothing）、零食饮料（snacks）、数码产品（electronics）、娱乐（entertainment）的阈值数据
  - 每个类别创建对应的阈值数组
  - 所有阈值基于剩余可支配收入（maxRemaining）
  - _需求: 1.1, 4.4_


- [-] 1.8 定义生活满意度等级

  - 创建 satisfactionLevels 对象，包含8个生活水平等级
  - 每个等级包含：level、desc、emoji
  - 与段位的 lifestyleLevel 一一对应
  - _需求: 2.2, 2.4, 3.4_


- [-] 1.9 定义储蓄率建议

  - 创建 savingsRateRecommendation 对象，为每个段位定义储蓄率建议
  - 每个段位包含：min、max、recommended、reason
  - 青铜段位推荐5%，王者段位推荐50%，中间段位递增
  - _需求: 5.1, 5.2, 5.3, 8.4_

- [-] 1.10 实现工具函数

  - 实现 getRankBySalary(salary) 函数，根据月薪查找对应段位
  - 实现 getThresholdValue(thresholds, value) 函数，根据阈值数组查找对应配置
  - 添加边界情况处理（如月薪为0或超大值）
  - _需求: 1.1, 4.5_

- [x] 2. 重构段位系统


- [x] 2.1 修改 rank-system.js 导入配置


  - 在文件顶部添加 import hangzhouDataConfig from './hangzhou-data-config.js'
  - 移除所有硬编码的段位数据
  - _需求: 1.1, 4.5_


- [x] 2.2 重构 ranks 属性


  - 将 ranks 改为 getter，从 hangzhouDataConfig.rankTiers 动态生成
  - 转换数据格式以保持向后兼容（minSalary、maxSalary、percentage）
  - _需求: 1.2, 3.1_




- [x] 2.3 重构 getRank 方法

  - 使用 hangzhouDataConfig.getRankBySalary(salary) 获取段位
  - 在返回对象中添加 lifestyleLevel 字段
  - 保持原有返回格式不变，确保向后兼容
  - _需求: 1.2, 2.1, 3.4_


- [x] 2.4 更新其他方法

  - 确保 getNextRank、getProgress、getRankInfo 方法使用配置文件数据
  - 移除所有硬编码的薪资阈值
  - _需求: 1.2_



- [x] 2.5 添加储蓄率建议接口


  - 新增 getSavingsRateRecommendation(salary) 方法
  - 根据段位返回储蓄率建议（min、max、recommended、reason）
  - _需求: 5.1, 5.2, 5.3, 8.4_

- [x] 3. 重构生活水平计算



- [x] 3.1 修改 lifestyle-data.js 导入配置


  - 在文件顶部添加 import hangzhouDataConfig from './hangzhou-data-config.js'
  - 移除所有硬编码的阈值数据
  - _需求: 1.1, 4.5_


- [-] 3.2 重构 calculate 方法 - 段位集成

  - 在方法开始时使用 hangzhouDataConfig.getRankBySalary(salary) 获取用户段位
  - 如果 savingsRate 参数为 null，使用段位推荐的储蓄率
  - 在返回对象中添加 rank 和 savingsRateRecommendation 字段
  - _需求: 2.1, 5.1, 5.2, 5.3, 8.1, 8.2, 8.4_



- [ ] 3.3 重构 calculate 方法 - 房租和交通
  - 使用 hangzhouDataConfig.getThresholdValue 查找房租配置
  - 使用 hangzhouDataConfig.getThresholdValue 查找交通配置
  - 移除 calculateRent 和 calculateTransport 方法
  - 在返回对象中添加 rentDesc 和 transportDesc 字段

  - _需求: 3.2, 3.3, 7.2, 7.3_

- [-] 3.4 重构 calculate 方法 - 餐饮消费

  - 使用 hangzhouDataConfig.getThresholdValue 查找餐饮配置（基于 remaining）
  - 移除 calculateMeals、calculateMealBudget、calculateDiningOut 方法
  - 返回完整的 diningConfig 对象

  - _需求: 3.3_


- [ ] 3.5 重构 calculate 方法 - 其他消费
  - 使用配置文件查找服装、零食、数码、娱乐的阈值

  - 移除 calculateClothing、calculateSnacks、calculateElectronics、calculateEntertainment 方法
  - 所有查找基于 remaining（剩余可支配收入）
  - _需求: 3.3_

- [-] 3.6 重构 calculate 方法 - 满意度评估

  - 使用 hangzhouDataConfig.satisfactionLevels[rank.lifestyleLevel] 获取满意度

  - 移除 calculateSatisfaction 方法
  - 确保满意度与段位等级匹配
  - _需求: 2.2, 2.3, 2.4, 3.4_



- [ ] 3.7 更新 formatLifestyle 方法
  - 在格式化输出中添加段位信息
  - 在"收入与储蓄"部分添加储蓄率建议提示
  - 在"整体评价"部分显示段位名称和百分位排名
  - _需求: 2.1, 5.4, 6.1, 6.2_

- [-] 3.8 保持向后兼容

  - 确保 getLifestyle 方法签名不变
  - 所有新增字段为可选，不影响现有调用
  - _需求: 1.5_

- [x] 4. 更新 UI 显示




- [ ] 4.1 在段位显示中添加生活水平信息
  - 在 index.html 的段位卡片中显示对应的生活满意度等级
  - 添加"在杭州属于XX生活水平"的提示

  - _需求: 2.1, 6.1, 6.2_


- [x] 4.2 在生活水平计算中显示段位信息

  - 在 index.html 的生活水平结果顶部显示用户段位
  - 显示段位图标、名称、百分位排名

  - _需求: 2.1, 6.1, 6.2_


- [ ] 4.3 添加储蓄率建议提示
  - 在储蓄率输入框旁边显示推荐值
  - 添加"基于您的段位，建议储蓄率XX%"的提示






  - 显示推荐理由
  - _需求: 5.1, 5.2, 5.3, 5.4, 8.4_

- [x] 4.4 优化多人生活显示

  - 在房租和水电费显示中明确标注"人均XX元"

  - 在总览中显示"X人生活"
  - _需求: 7.1, 7.4, 7.5_


- [ ] 5. 添加输入验证和错误处理
- [-] 5.1 实现输入验证函数

  - 创建 validateSalary(salary) 函数，验证月薪为正数且在合理范围内
  - 创建 validatePeopleCount(count) 函数，验证人数为正整数

  - 创建 validateSavingsRate(rate) 函数，验证储蓄率在0-100之间
  - 创建 validateCustomCost(cost) 函数，验证自定义开销为非负数
  - _需求: 8.1, 8.2, 8.3_


- [ ] 5.2 在 calculate 方法中添加验证
  - 在计算前验证所有输入参数
  - 对无效输入抛出有意义的错误信息
  - 对超出建议范围的值给出警告（但不阻止计算）
  - _需求: 8.1, 8.2, 8.3_

- [ ] 5.3 实现降级策略
  - 如果配置文件加载失败，使用硬编码的默认值
  - 如果阈值查找失败，返回最接近的阈值
  - 如果计算结果异常，返回保守估计值
  - _需求: 1.5_

- [ ] 5.4 在 UI 中显示验证错误
  - 在输入框旁边显示错误提示
  - 使用红色边框标记无效输入
  - 提供修正建议
  - _需求: 8.1, 8.2, 8.3_

- [ ] 6. 测试和验证
- [ ] 6.1 编写配置文件测试
  - 验证所有段位的薪资区间连续且不重叠
  - 验证所有阈值数组按升序排列
  - 验证所有必需字段存在
  - _需求: 1.1, 1.2_

- [ ] 6.2 编写段位系统测试
  - 测试边界值（5000元为青铜，5001元为白银）
  - 测试段位进度计算
  - 测试下一段位获取
  - 测试储蓄率建议获取
  - _需求: 1.2, 5.1_





- [ ] 6.3 编写生活水平计算测试
  - 测试不同月薪下的计算结果
  - 测试多人生活的分摊计算
  - 测试自定义储蓄率的影响

  - 测试自定义房租、水电的影响

  - _需求: 3.1, 3.2, 3.3, 7.1, 8.1_

- [x] 6.4 进行数据一致性测试

  - 验证段位系统和生活水平计算使用相同的薪资阈值
  - 验证段位描述与生活满意度描述一致

  - 验证百分位排名数据一致
  - _需求: 1.1, 1.2, 2.2, 6.3_

- [ ] 6.5 进行端到端测试
  - 在浏览器中测试完整流程
  - 输入不同月薪，验证段位和生活水平显示正确
  - 调整储蓄率，验证计算结果实时更新
  - 测试多人生活场景
  - _需求: 1.5, 2.1, 7.1, 8.1_

- [ ] 7. 文档和优化
- [ ] 7.1 添加代码注释
  - 在 hangzhou-data-config.js 中为所有配置项添加详细注释
  - 说明数据来源和更新时间
  - 在关键算法处添加计算说明
  - _需求: 4.6_

- [ ] 7.2 更新用户文档
  - 在 README 或帮助文档中说明段位系统的评级标准
  - 解释生活水平计算的依据
  - 提供储蓄率建议的理由
  - _需求: 5.4, 6.1_

- [ ] 7.3 性能优化
  - 实现配置文件缓存
  - 优化阈值查找算法（如使用二分查找）
  - 实现计算结果缓存（相同输入返回缓存结果）
  - _需求: 1.5_

- [x] 8. 清理和发布



- [x] 8.1 移除废弃代码


  - 删除 rank-system.js 中的硬编码数据
  - 删除 lifestyle-data.js 中的独立计算函数
  - 清理未使用的变量和注释
  - _需求: 1.1, 3.1_



- [x] 8.2 代码格式化

  - 统一代码风格
  - 确保所有文件使用一致的缩进和命名规范
  - _需求: 4.5_




- [ ] 8.3 最终验证
  - 在多个浏览器中测试（Chrome、Firefox、Safari、Edge）
  - 验证所有功能正常工作
  - 确认没有控制台错误

  - _需求: 1.5_



- [ ] 8.4 备份和部署

  - 备份原始文件
  - 部署新版本
  - 监控用户反馈
  - _需求: 1.5_
