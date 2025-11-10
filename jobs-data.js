// 杭州市各职业真实薪资数据和岗位要求
const jobsData = [
    {
        id: 1,
        title: '前端工程师',
        salary: 22000,
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { id: 'r1', text: '熟练掌握 HTML、CSS、JavaScript', growthTask: '完成 MDN Web 文档学习，每天编写 2 个小项目练习基础知识' },
            { id: 'r2', text: '精通 Vue 或 React 框架', growthTask: '系统学习 Vue3/React 官方文档，完成 3 个实战项目（Todo、电商、后台管理）' },
            { id: 'r3', text: '了解前端工程化（Webpack、Vite）', growthTask: '学习构建工具原理，手写简易打包工具，配置实际项目脚手架' },
            { id: 'r4', text: '熟悉 TypeScript', growthTask: '学习 TypeScript 官方文档，将现有项目改造为 TS 版本' },
            { id: 'r5', text: '掌握前端性能优化', growthTask: '学习性能优化技巧，使用 Lighthouse 分析并优化 3 个项目' },
            { id: 'r6', text: '有良好的代码规范和团队协作能力', growthTask: '学习 ESLint、Prettier 配置，参与开源项目贡献代码' }
        ]
    },
    {
        id: 2,
        title: 'Java 后端工程师',
        salary: 25000,
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { id: 'r1', text: '精通 Java 基础和面向对象编程', growthTask: '系统学习 Java 核心技术，每天刷 2 道 LeetCode 算法题' },
            { id: 'r2', text: '熟练使用 Spring Boot、Spring Cloud', growthTask: '学习 Spring 全家桶，搭建微服务项目（用户、订单、支付模块）' },
            { id: 'r3', text: '掌握 MySQL 数据库设计和优化', growthTask: '学习数据库原理，设计 3 个业务数据库，练习 SQL 优化和索引设计' },
            { id: 'r4', text: '熟悉 Redis 缓存应用', growthTask: '学习 Redis 数据结构和应用场景，实现缓存、分布式锁、排行榜功能' },
            { id: 'r5', text: '了解消息队列（RabbitMQ/Kafka）', growthTask: '学习消息队列原理，实现异步处理、削峰填谷场景' },
            { id: 'r6', text: '具备高并发系统设计经验', growthTask: '学习分布式系统设计，实现秒杀系统、限流降级方案' }
        ]
    },
    {
        id: 3,
        title: '产品经理',
        salary: 18000,
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '产品'],
        requirements: [
            { id: 'r1', text: '熟练使用 Axure、Figma 等原型工具', growthTask: '学习原型设计工具，每周设计 2 个产品原型（APP、Web、小程序）' },
            { id: 'r2', text: '具备需求分析和用户调研能力', growthTask: '学习用户研究方法，完成 5 次用户访谈，输出需求分析报告' },
            { id: 'r3', text: '了解产品生命周期管理', growthTask: '学习产品方法论（精益创业、增长黑客），分析 10 个成功产品案例' },
            { id: 'r4', text: '掌握数据分析能力', growthTask: '学习数据分析工具（Google Analytics、神策），分析产品数据并提出优化方案' },
            { id: 'r5', text: '良好的沟通协调能力', growthTask: '参与项目管理，组织需求评审会，撰写 PRD 文档' },
            { id: 'r6', text: '对互联网行业有深刻理解', growthTask: '每天阅读行业资讯，每周输出 1 篇产品分析文章' }
        ]
    },
    {
        id: 4,
        title: 'UI 设计师',
        salary: 14000,
        experience: '1-3年',
        education: '本科',
        tags: ['设计', '创意'],
        requirements: [
            { id: 'r1', text: '精通 Figma、Sketch、PS、AI 等设计工具', growthTask: '每天练习设计工具，完成 30 天设计挑战（每天一个作品）' },
            { id: 'r2', text: '具备扎实的视觉设计功底', growthTask: '学习设计理论（色彩、排版、构图），临摹 50 个优秀设计作品' },
            { id: 'r3', text: '了解用户体验设计原则', growthTask: '学习 UX 设计方法，完成 3 个完整的用户体验设计项目' },
            { id: 'r4', text: '熟悉移动端和 Web 端设计规范', growthTask: '学习 iOS、Android、Web 设计规范，设计符合规范的界面' },
            { id: 'r5', text: '有良好的审美和创新能力', growthTask: '每周浏览 Dribbble、Behance，收集灵感，输出创意设计' },
            { id: 'r6', text: '能够与开发团队高效协作', growthTask: '学习设计交付流程，使用设计系统和组件库提高协作效率' }
        ]
    },
    {
        id: 5,
        title: '运营专员',
        salary: 11000,
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '运营'],
        requirements: [
            { id: 'r1', text: '熟悉新媒体运营（微信、抖音、小红书）', growthTask: '运营个人账号，3 个月内涨粉 1000+，学习爆款内容创作' },
            { id: 'r2', text: '具备内容策划和文案撰写能力', growthTask: '每周输出 3 篇优质文案，学习爆款文案技巧，建立素材库' },
            { id: 'r3', text: '了解用户增长和活动策划', growthTask: '策划 5 个线上活动方案，学习增长黑客方法论' },
            { id: 'r4', text: '掌握数据分析能力', growthTask: '学习数据分析工具，每周输出运营数据报告和优化建议' },
            { id: 'r5', text: '熟悉社群运营', growthTask: '运营 2 个社群（500 人以上），提升活跃度和转化率' },
            { id: 'r6', text: '有创意思维和执行力', growthTask: '每月完成 2 个创意项目，从策划到执行全流程落地' }
        ]
    },
    {
        id: 6,
        title: '算法工程师',
        salary: 35000,
        experience: '1-3年',
        education: '硕士',
        tags: ['AI', '技术'],
        requirements: [
            { id: 'r1', text: '扎实的数学基础（线性代数、概率论、统计学）', growthTask: '系统复习数学知识，完成吴恩达机器学习课程' },
            { id: 'r2', text: '精通 Python 和机器学习框架（TensorFlow/PyTorch）', growthTask: '学习深度学习框架，复现 10 篇经典论文算法' },
            { id: 'r3', text: '熟悉常见机器学习算法', growthTask: '手写实现 10 个经典算法，参加 Kaggle 竞赛获得奖牌' },
            { id: 'r4', text: '有深度学习项目经验', growthTask: '完成 3 个深度学习项目（图像识别、NLP、推荐系统）' },
            { id: 'r5', text: '了解模型优化和部署', growthTask: '学习模型压缩、量化技术，部署模型到生产环境' },
            { id: 'r6', text: '阅读前沿论文能力', growthTask: '每周精读 2 篇顶会论文，输出论文笔记和代码实现' }
        ]
    },
    {
        id: 7,
        title: '测试工程师',
        salary: 16000,
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { id: 'r1', text: '熟悉软件测试理论和方法', growthTask: '学习测试理论，考取 ISTQB 认证，掌握黑盒白盒测试方法' },
            { id: 'r2', text: '掌握自动化测试工具（Selenium、Appium）', growthTask: '学习自动化测试框架，编写 3 个项目的自动化测试脚本' },
            { id: 'r3', text: '熟悉接口测试（Postman、JMeter）', growthTask: '学习接口测试方法，完成 API 自动化测试和性能测试' },
            { id: 'r4', text: '了解性能测试和安全测试', growthTask: '学习性能测试工具，完成压力测试和安全漏洞扫描' },
            { id: 'r5', text: '具备编程能力（Python/Java）', growthTask: '学习编程语言，开发测试工具和测试平台' },
            { id: 'r6', text: '有 Bug 跟踪和质量管理经验', growthTask: '使用 JIRA 管理测试流程，建立质量度量体系' }
        ]
    },
    {
        id: 8,
        title: '数据分析师',
        salary: 20000,
        experience: '1-3年',
        education: '本科',
        tags: ['数据', '分析'],
        requirements: [
            { id: 'r1', text: '精通 SQL 和数据库操作', growthTask: '每天练习 SQL，完成 LeetCode 数据库题目，掌握复杂查询' },
            { id: 'r2', text: '熟练使用 Python 数据分析库（Pandas、NumPy）', growthTask: '学习 Python 数据分析，完成 5 个数据分析项目' },
            { id: 'r3', text: '掌握数据可视化工具（Tableau、Power BI）', growthTask: '学习可视化工具，制作 10 个数据看板和报表' },
            { id: 'r4', text: '具备统计学知识和数据建模能力', growthTask: '学习统计学和机器学习，完成用户画像、预测模型项目' },
            { id: 'r5', text: '了解业务指标和数据驱动决策', growthTask: '学习业务分析方法，输出 10 份数据分析报告和优化建议' },
            { id: 'r6', text: '良好的沟通和汇报能力', growthTask: '练习数据storytelling，向非技术人员清晰传达分析结果' }
        ]
    }
];
