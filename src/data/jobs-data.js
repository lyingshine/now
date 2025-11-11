// 杭州市各职业真实薪资数据和岗位要求（2024-2025年中位数）
const jobsData = [
    {
        id: 1,
        title: '前端工程师',
        salary: 18000, // 杭州1-3年前端中位数：15k-22k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        difficulty: '⭐⭐⭐',
        monthlyGold: 18000, // 每月金币收入
        totalMonths: 6, // 完整学习周期（月）
        expReward: 3600,
        requirements: [
            { 
                id: 'r1', 
                text: '精通 HTML5/CSS3/ES6+，能独立完成响应式页面开发', 
                monthlyReward: 3000, // 每月金币
                estimatedMonths: 2, // 预计学习时长
                subTasks: [
                    {
                        id: 'r1-theory',
                        type: '理论学习',
                        title: 'HTML/CSS/JS 核心知识体系',
                        duration: '3周',
                        goldPerMonth: 1000,
                        tasks: [
                            '学习 HTML5 语义化标签、表单、多媒体',
                            '掌握 CSS3 选择器、盒模型、定位、浮动',
                            '学习 Flexbox 和 Grid 布局系统',
                            '掌握 ES6+ 核心语法（let/const、箭头函数、解构、模板字符串）',
                            '学习 Promise、async/await 异步编程'
                        ],
                        resources: ['MDN 文档', '《JavaScript 高级程序设计》', 'FreeCodeCamp 课程']
                    },
                    {
                        id: 'r1-practice',
                        type: '实践练习',
                        title: '页面布局与 JS 编程实战',
                        duration: '4周',
                        goldPerMonth: 1500,
                        tasks: [
                            '完成 30 个页面布局练习（Flexbox、Grid、响应式）',
                            '手写 10 个常见 JS 原生方法（防抖、节流、深拷贝、bind、Promise）',
                            '完成 5 个响应式网页（PC + 移动端适配）',
                            '通过 FreeCodeCamp 响应式网页设计认证',
                            '完成 LeetCode 简单题 50 道（数组、字符串、对象操作）'
                        ],
                        resources: ['CodePen 练习', 'LeetCode', 'FreeCodeCamp']
                    },
                    {
                        id: 'r1-output',
                        type: '成果输出',
                        title: '个人作品集与技术博客',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '搭建个人作品集网站（展示 10+ 页面作品）',
                            '输出 5 篇技术博客（布局技巧、JS 原理、响应式方案）',
                            '整理 HTML/CSS/JS 学习笔记和代码片段库',
                            'GitHub 提交 30+ 天代码记录'
                        ],
                        resources: ['GitHub Pages', '掘金/CSDN', 'Notion']
                    }
                ]
            },
            { 
                id: 'r2', 
                text: '熟练使用 Vue3/React18，掌握组件化开发和状态管理', 
                monthlyReward: 4000,
                estimatedMonths: 3,
                subTasks: [
                    {
                        id: 'r2-theory',
                        type: '理论学习',
                        title: 'Vue3/React 框架核心原理',
                        duration: '4周',
                        goldPerMonth: 1200,
                        tasks: [
                            '学习 Vue3 Composition API、响应式原理、生命周期',
                            '学习 React18 Hooks、虚拟 DOM、Fiber 架构',
                            '掌握组件化思想、Props/Events 通信',
                            '学习状态管理（Pinia/Redux）原理和最佳实践',
                            '学习 Vue Router / React Router 路由管理'
                        ],
                        resources: ['Vue 官方文档', 'React 官方文档', '《深入浅出 Vue.js》']
                    },
                    {
                        id: 'r2-practice',
                        type: '实践练习',
                        title: '完整项目开发实战',
                        duration: '7周',
                        goldPerMonth: 2000,
                        tasks: [
                            '项目1：电商前台（商品列表、筛选、购物车、订单流程）',
                            '项目2：后台管理系统（登录鉴权、权限管理、表格、图表）',
                            '项目3：移动端 H5（Vant/Ant Design Mobile、适配、性能优化）',
                            '每个项目实现完整的状态管理和路由配置',
                            '集成 Axios 封装、请求拦截、错误处理'
                        ],
                        resources: ['Vue3 项目实战', 'React 项目实战', 'GitHub 优秀项目']
                    },
                    {
                        id: 'r2-output',
                        type: '成果输出',
                        title: '项目作品与技术总结',
                        duration: '1周',
                        goldPerMonth: 800,
                        tasks: [
                            '3 个完整项目部署上线（Vercel/Netlify）',
                            '编写项目 README 和技术文档',
                            '输出 3 篇技术博客（Vue3/React 实战经验、状态管理、性能优化）',
                            '整理组件库和工具函数库',
                            '录制项目演示视频'
                        ],
                        resources: ['Vercel', 'GitHub', '技术博客平台']
                    }
                ]
            },
            { 
                id: 'r3', 
                text: '掌握前端工程化：Webpack5/Vite 配置、模块化、代码分割', 
                monthlyReward: 2500,
                estimatedMonths: 1.5,
                subTasks: [
                    {
                        id: 'r3-theory',
                        type: '理论学习',
                        title: '前端工程化体系',
                        duration: '2周',
                        goldPerMonth: 800,
                        tasks: [
                            '学习 Webpack5 核心概念（entry、output、loader、plugin）',
                            '学习 Vite 原理（ESM、预构建、HMR）',
                            '掌握模块化规范（CommonJS、ES Module）',
                            '学习代码分割、Tree Shaking、懒加载',
                            '学习环境变量、多环境配置'
                        ],
                        resources: ['Webpack 官方文档', 'Vite 官方文档', '《深入浅出 Webpack》']
                    },
                    {
                        id: 'r3-practice',
                        type: '实践练习',
                        title: '脚手架搭建与优化',
                        duration: '3周',
                        goldPerMonth: 1200,
                        tasks: [
                            '从零搭建 Webpack 项目（支持 TS、热更新、代码压缩）',
                            '从零搭建 Vite 项目（支持多页面、环境变量）',
                            '优化打包体积至 50% 以下（分析工具、CDN、压缩）',
                            '配置 CI/CD 自动部署（GitHub Actions）',
                            '编写自定义 Webpack Plugin 和 Loader'
                        ],
                        resources: ['Webpack 实战', 'Vite 实战', 'GitHub Actions']
                    },
                    {
                        id: 'r3-output',
                        type: '成果输出',
                        title: '脚手架工具与文档',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '发布个人脚手架到 npm（CLI 工具）',
                            '输出工程化配置文档和最佳实践',
                            '编写 2 篇技术博客（Webpack/Vite 优化实战）',
                            '整理工程化配置模板库'
                        ],
                        resources: ['npm', 'GitHub', '技术博客']
                    }
                ]
            },
            { 
                id: 'r4', 
                text: 'TypeScript 开发经验，能编写类型安全的代码', 
                monthlyReward: 2000,
                estimatedMonths: 1.5,
                subTasks: [
                    {
                        id: 'r4-theory',
                        type: '理论学习',
                        title: 'TypeScript 类型系统',
                        duration: '2周',
                        goldPerMonth: 600,
                        tasks: [
                            '学习 TS 基础类型、接口、类型别名',
                            '掌握泛型、装饰器、命名空间',
                            '学习高级类型（联合类型、交叉类型、映射类型）',
                            '学习类型体操（Partial、Pick、Omit、ReturnType）',
                            '学习 TS 配置文件和编译选项'
                        ],
                        resources: ['TypeScript 官方文档', '《TypeScript 编程》', 'type-challenges']
                    },
                    {
                        id: 'r4-practice',
                        type: '实践练习',
                        title: 'TS 项目重构与实战',
                        duration: '3周',
                        goldPerMonth: 1000,
                        tasks: [
                            '将 2 个 JS 项目重构为 TS（完整类型标注）',
                            '完成 type-challenges 简单和中等题 50 道',
                            '为第三方库编写 .d.ts 类型声明文件',
                            '在 Vue3/React 项目中使用 TS（组件类型、Props 类型）',
                            '编写类型安全的工具函数库'
                        ],
                        resources: ['type-challenges', 'DefinitelyTyped', 'GitHub']
                    },
                    {
                        id: 'r4-output',
                        type: '成果输出',
                        title: 'TS 规范与类型库',
                        duration: '1周',
                        goldPerMonth: 400,
                        tasks: [
                            '编写团队 TS 开发规范文档',
                            '发布个人 TS 工具类型库到 npm',
                            '输出 2 篇技术博客（TS 实战、类型体操）',
                            '整理 TS 常用类型和代码片段'
                        ],
                        resources: ['npm', 'GitHub', '技术博客']
                    }
                ]
            },
            { 
                id: 'r5', 
                text: '前端性能优化：首屏加载、懒加载、缓存策略', 
                monthlyReward: 2500,
                estimatedMonths: 1.5,
                subTasks: [
                    {
                        id: 'r5-theory',
                        type: '理论学习',
                        title: '性能优化理论体系',
                        duration: '2周',
                        goldPerMonth: 800,
                        tasks: [
                            '学习性能指标（FCP、LCP、TTI、CLS、FID）',
                            '学习浏览器渲染原理（重排、重绘、合成）',
                            '掌握资源加载优化（懒加载、预加载、CDN）',
                            '学习缓存策略（强缓存、协商缓存、Service Worker）',
                            '学习 Lighthouse 性能分析工具'
                        ],
                        resources: ['Web.dev', '《高性能网站建设指南》', 'Chrome DevTools']
                    },
                    {
                        id: 'r5-practice',
                        type: '实践练习',
                        title: '性能优化实战',
                        duration: '3周',
                        goldPerMonth: 1200,
                        tasks: [
                            '优化 3 个项目性能指标（FCP < 1.5s、LCP < 2.5s、TTI < 3.5s）',
                            '实现图片懒加载、路由懒加载、组件懒加载',
                            '配置 CDN 加速、Gzip 压缩、资源预加载',
                            '使用 Lighthouse 分析并优化至 90+ 分',
                            '实现骨架屏、虚拟列表、防抖节流'
                        ],
                        resources: ['Lighthouse', 'Chrome DevTools', 'WebPageTest']
                    },
                    {
                        id: 'r5-output',
                        type: '成果输出',
                        title: '性能优化方案文档',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '输出性能优化方案文档（含优化前后对比数据）',
                            '编写 2 篇技术博客（性能优化实战、Lighthouse 使用）',
                            '整理性能优化 Checklist 和工具库',
                            '录制性能优化实战视频教程'
                        ],
                        resources: ['技术博客', 'GitHub', 'B站']
                    }
                ]
            },
            { 
                id: 'r6', 
                text: '熟悉 Git 协作流程、代码规范、单元测试', 
                monthlyReward: 2000,
                estimatedMonths: 1,
                subTasks: [
                    {
                        id: 'r6-theory',
                        type: '理论学习',
                        title: '团队协作与质量保障',
                        duration: '1周',
                        goldPerMonth: 600,
                        tasks: [
                            '学习 Git 工作流（Git Flow、GitHub Flow）',
                            '掌握代码规范工具（ESLint、Prettier、Husky）',
                            '学习单元测试（Jest/Vitest）和 E2E 测试',
                            '学习 Code Review 最佳实践',
                            '学习 CI/CD 持续集成流程'
                        ],
                        resources: ['Git 官方文档', '《Pro Git》', 'Jest 官方文档']
                    },
                    {
                        id: 'r6-practice',
                        type: '实践练习',
                        title: '开源贡献与测试实战',
                        duration: '2周',
                        goldPerMonth: 1000,
                        tasks: [
                            '参与 2 个开源项目贡献（提交 PR 并被合并）',
                            '为项目配置完整的 Lint 和测试环境',
                            '编写单元测试覆盖率达 80% 以上',
                            '配置 Git Hooks（commit 规范、代码检查）',
                            '搭建 CI/CD 流水线（自动测试、自动部署）'
                        ],
                        resources: ['GitHub', 'Jest', 'GitHub Actions']
                    },
                    {
                        id: 'r6-output',
                        type: '成果输出',
                        title: '团队规范与工具',
                        duration: '1周',
                        goldPerMonth: 400,
                        tasks: [
                            '编写团队 Git 协作规范文档',
                            '编写代码规范和 Code Review 指南',
                            '输出 1 篇技术博客（Git 工作流、单元测试实践）',
                            '整理开源贡献经验和 PR 模板'
                        ],
                        resources: ['GitHub', '技术博客', 'Notion']
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Java 后端工程师',
        salary: 20000, // 杭州1-3年Java后端中位数：16k-25k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '精通 Java 核心（集合、并发、JVM）+ 数据结构与算法（LeetCode 200 题以上）', 
                reward: '基础薪资 +3500元',
                growthTask: '【任务】完成《Java 核心技术》学习 + LeetCode 刷题 200 道（中等 150+困难 50）+ 手写 HashMap、线程池、AQS 原理 + 输出 JVM 调优笔记'
            },
            { 
                id: 'r2', 
                text: '熟练使用 Spring Boot 3.x、Spring Cloud Alibaba 微服务开发', 
                reward: '框架薪资 +4500元',
                growthTask: '【任务】搭建完整微服务项目（网关、注册中心、配置中心、用户服务、订单服务、支付服务）+ 实现服务调用、熔断降级、链路追踪'
            },
            { 
                id: 'r3', 
                text: 'MySQL 数据库设计与优化：索引优化、慢查询分析、分库分表', 
                reward: '数据库薪资 +3000元',
                growthTask: '【任务】设计 3 个业务数据库（电商、社交、内容）+ 优化 10 条慢 SQL（执行时间降低 80%）+ 实现分库分表方案（ShardingSphere）'
            },
            { 
                id: 'r4', 
                text: 'Redis 缓存架构：缓存穿透/击穿/雪崩解决方案、分布式锁', 
                reward: '缓存薪资 +2500元',
                growthTask: '【任务】实现 Redis 缓存方案（多级缓存、热点数据）+ 解决缓存一致性问题 + 实现分布式锁（Redisson）+ 设计排行榜、限流系统'
            },
            { 
                id: 'r5', 
                text: '消息队列应用：RabbitMQ/Kafka 异步处理、削峰填谷、最终一致性', 
                reward: '中间件薪资 +3000元',
                growthTask: '【任务】实现订单异步处理系统 + 秒杀削峰方案 + 分布式事务（Seata）+ 消息可靠性保证（确认机制、死信队列）'
            },
            { 
                id: 'r6', 
                text: '高并发系统设计：QPS 5000+ 系统架构、限流降级、性能调优', 
                reward: '高并发薪资 +3500元',
                growthTask: '【任务】设计秒杀系统（库存扣减、超卖防止）+ 实现限流策略（令牌桶、漏桶）+ 压测优化（JMeter）+ 输出高并发架构方案'
            }
        ]
    },
    {
        id: 3,
        title: '产品经理',
        salary: 15000,
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '产品'],
        difficulty: '⭐⭐⭐',
        monthlyGold: 15000,
        totalMonths: 6,
        expReward: 3000,
        requirements: [
            { 
                id: 'r1', 
                text: '熟练使用 Axure/Figma/墨刀，能独立完成高保真原型和交互设计', 
                monthlyReward: 2500,
                estimatedMonths: 2,
                subTasks: [
                    {
                        id: 'r1-theory',
                        type: '理论学习',
                        title: '原型设计理论与工具',
                        duration: '2周',
                        goldPerMonth: 800,
                        tasks: [
                            '学习交互设计原则（尼尔森十大可用性原则）',
                            '掌握 Axure/Figma/墨刀 工具基础操作',
                            '学习组件化设计思维和设计系统',
                            '学习原型设计规范（iOS/Android/Web）',
                            '学习交互动效和页面流转设计'
                        ],
                        resources: ['Figma 官方教程', '《交互设计精髓》', 'UI 中国']
                    },
                    {
                        id: 'r1-practice',
                        type: '实践练习',
                        title: '多平台原型设计实战',
                        duration: '5周',
                        goldPerMonth: 1200,
                        tasks: [
                            '设计 3 个 APP 原型（社交、电商、工具类）',
                            '设计 3 个 Web 原型（SaaS、电商、内容平台）',
                            '设计 2 个小程序原型（服务类、电商类）',
                            '设计 2 个后台管理系统原型',
                            '建立组件库和设计规范文档'
                        ],
                        resources: ['Figma Community', 'Dribbble', 'Behance']
                    },
                    {
                        id: 'r1-output',
                        type: '成果输出',
                        title: '原型作品集与设计规范',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '整理 10 个完整原型作品集（含交互说明）',
                            '输出设计规范文档（颜色、字体、间距、组件）',
                            '发布作品到 Dribbble/Behance',
                            '编写原型设计经验总结文档'
                        ],
                        resources: ['Dribbble', 'Behance', 'Notion']
                    }
                ]
            },
            { 
                id: 'r2', 
                text: '需求分析与用户调研：用户访谈、问卷调查、竞品分析', 
                monthlyReward: 3000,
                estimatedMonths: 2,
                subTasks: [
                    {
                        id: 'r2-theory',
                        type: '理论学习',
                        title: '用户研究方法论',
                        duration: '2周',
                        goldPerMonth: 900,
                        tasks: [
                            '学习用户研究方法（访谈、问卷、观察、焦点小组）',
                            '掌握 KANO 模型、用户画像、用户旅程地图',
                            '学习竞品分析框架（SWOT、波特五力）',
                            '学习需求优先级评估方法（四象限法、MoSCoW）',
                            '学习数据分析基础（Excel、SQL）'
                        ],
                        resources: ['《用户体验要素》', '《精益数据分析》', '人人都是产品经理']
                    },
                    {
                        id: 'r2-practice',
                        type: '实践练习',
                        title: '用户调研与竞品分析实战',
                        duration: '5周',
                        goldPerMonth: 1500,
                        tasks: [
                            '完成 10 次用户访谈（录音+文字稿+洞察总结）',
                            '设计 5 份调查问卷（回收 200+ 份并分析）',
                            '输出 5 份竞品分析报告（功能、交互、数据对比）',
                            '绘制 5 个用户画像和用户旅程地图',
                            '使用 KANO 模型评估 50+ 需求优先级'
                        ],
                        resources: ['问卷星', '腾讯问卷', '七麦数据']
                    },
                    {
                        id: 'r2-output',
                        type: '成果输出',
                        title: '调研报告与需求文档',
                        duration: '1周',
                        goldPerMonth: 600,
                        tasks: [
                            '输出 5 份完整用户调研报告',
                            '输出 5 份竞品分析报告（PPT 形式）',
                            '建立需求池和需求管理表格',
                            '编写需求分析方法论文档'
                        ],
                        resources: ['PPT', 'Excel', 'Notion']
                    }
                ]
            },
            { 
                id: 'r3', 
                text: '产品规划与项目管理：PRD 文档、产品路线图、敏捷开发', 
                monthlyReward: 2500,
                estimatedMonths: 2,
                subTasks: [
                    {
                        id: 'r3-theory',
                        type: '理论学习',
                        title: '产品规划与敏捷管理',
                        duration: '2周',
                        goldPerMonth: 750,
                        tasks: [
                            '学习 PRD 文档撰写规范和模板',
                            '学习产品路线图规划方法（OKR、Roadmap）',
                            '掌握敏捷开发流程（Scrum、看板）',
                            '学习项目管理工具（JIRA、Teambition）',
                            '学习需求评审和项目推进技巧'
                        ],
                        resources: ['《启示录》', '《用户故事地图》', 'JIRA 官方文档']
                    },
                    {
                        id: 'r3-practice',
                        type: '实践练习',
                        title: '产品文档与项目管理实战',
                        duration: '5周',
                        goldPerMonth: 1250,
                        tasks: [
                            '撰写 10 份 PRD 文档（需求背景、功能清单、流程图、异常处理）',
                            '制定 3 个产品路线图（季度/年度规划）',
                            '主导 3 个项目从 0 到 1 落地（需求→设计→开发→测试→上线）',
                            '组织 20 次需求评审会议',
                            '使用 JIRA 管理 3 个敏捷项目'
                        ],
                        resources: ['JIRA', 'Confluence', 'ProcessOn']
                    },
                    {
                        id: 'r3-output',
                        type: '成果输出',
                        title: 'PRD 文档与项目复盘',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '整理 10 份高质量 PRD 文档模板',
                            '输出 3 份项目复盘报告',
                            '编写产品规划方法论文档',
                            '建立 PRD 文档库和需求模板'
                        ],
                        resources: ['Confluence', 'Notion', 'PPT']
                    }
                ]
            },
            { 
                id: 'r4', 
                text: '数据驱动决策：埋点设计、数据分析、A/B 测试', 
                monthlyReward: 2500,
                estimatedMonths: 1.5,
                subTasks: [
                    {
                        id: 'r4-theory',
                        type: '理论学习',
                        title: '数据分析与增长方法论',
                        duration: '2周',
                        goldPerMonth: 800,
                        tasks: [
                            '学习数据埋点设计（事件埋点、全埋点）',
                            '学习数据分析工具（神策、GA、友盟）',
                            '掌握 A/B 测试原理和实施方法',
                            '学习数据指标体系（AARRR、北极星指标）',
                            '学习 SQL 基础和数据可视化'
                        ],
                        resources: ['《精益数据分析》', '《增长黑客》', 'SQL 教程']
                    },
                    {
                        id: 'r4-practice',
                        type: '实践练习',
                        title: '数据分析与 A/B 测试实战',
                        duration: '3周',
                        goldPerMonth: 1200,
                        tasks: [
                            '设计完整埋点方案（用户行为、页面浏览、转化漏斗）',
                            '分析 5 个功能数据表现（留存、活跃、转化）',
                            '执行 3 次 A/B 测试（提升转化率 20%+）',
                            '输出 6 份月度数据分析报告',
                            '搭建数据看板（实时监控核心指标）'
                        ],
                        resources: ['神策数据', 'Google Analytics', 'Excel']
                    },
                    {
                        id: 'r4-output',
                        type: '成果输出',
                        title: '数据分析报告与优化方案',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '输出数据埋点设计文档',
                            '输出 6 份数据分析报告（含优化建议）',
                            '输出 A/B 测试方法论文档',
                            '建立数据指标体系和看板模板'
                        ],
                        resources: ['PPT', 'Excel', 'Notion']
                    }
                ]
            },
            { 
                id: 'r5', 
                text: '跨部门协作：需求评审、项目推进、资源协调', 
                monthlyReward: 2000,
                estimatedMonths: 1,
                subTasks: [
                    {
                        id: 'r5-theory',
                        type: '理论学习',
                        title: '沟通协作与项目管理',
                        duration: '1周',
                        goldPerMonth: 600,
                        tasks: [
                            '学习高效沟通技巧（金字塔原理、STAR 法则）',
                            '学习需求评审流程和技巧',
                            '学习项目风险管理和应对策略',
                            '学习资源协调和优先级管理',
                            '学习会议组织和主持技巧'
                        ],
                        resources: ['《金字塔原理》', '《非暴力沟通》', 'PMP 教程']
                    },
                    {
                        id: 'r5-practice',
                        type: '实践练习',
                        title: '跨部门协作实战',
                        duration: '2周',
                        goldPerMonth: 1000,
                        tasks: [
                            '组织 20 次需求评审会（技术、设计、运营）',
                            '协调技术、设计、运营资源推进 3 个项目',
                            '处理 10 个项目风险问题（延期、资源冲突）',
                            '主持 10 次项目周会和站会',
                            '完成 3 个项目从立项到上线全流程'
                        ],
                        resources: ['JIRA', '飞书/钉钉', '会议纪要模板']
                    },
                    {
                        id: 'r5-output',
                        type: '成果输出',
                        title: '项目复盘与协作文档',
                        duration: '1周',
                        goldPerMonth: 400,
                        tasks: [
                            '输出 3 份项目复盘报告',
                            '编写需求评审流程文档',
                            '整理项目管理工具和模板',
                            '输出跨部门协作经验总结'
                        ],
                        resources: ['PPT', 'Notion', 'Confluence']
                    }
                ]
            },
            { 
                id: 'r6', 
                text: '行业洞察与产品思维：关注行业动态、产品方法论', 
                monthlyReward: 2500,
                estimatedMonths: 3,
                subTasks: [
                    {
                        id: 'r6-theory',
                        type: '理论学习',
                        title: '产品思维与方法论',
                        duration: '4周',
                        goldPerMonth: 800,
                        tasks: [
                            '学习产品经典书籍（《启示录》《用户体验要素》《精益创业》）',
                            '学习产品方法论（精益、增长黑客、设计思维）',
                            '学习商业模式分析（商业画布、价值主张）',
                            '学习行业分析方法（波特五力、PEST）',
                            '关注产品行业动态（36氪、人人都是产品经理）'
                        ],
                        resources: ['产品经典书籍', '人人都是产品经理', '36氪']
                    },
                    {
                        id: 'r6-practice',
                        type: '实践练习',
                        title: '产品分析与案例拆解',
                        duration: '7周',
                        goldPerMonth: 1200,
                        tasks: [
                            '每周输出 1 篇产品分析文章（共 12 篇）',
                            '拆解 20 个成功产品案例（功能、增长、商业模式）',
                            '分析 10 个行业趋势和机会点',
                            '参与 5 个产品社区讨论和分享',
                            '关注 50+ 优秀产品并体验分析'
                        ],
                        resources: ['人人都是产品经理', '产品大牛', 'Medium']
                    },
                    {
                        id: 'r6-output',
                        type: '成果输出',
                        title: '产品分析作品集',
                        duration: '1周',
                        goldPerMonth: 500,
                        tasks: [
                            '整理 12 篇产品分析文章发布到社区',
                            '输出 20 个产品案例拆解报告',
                            '建立个人产品知识库和方法论',
                            '输出行业洞察报告'
                        ],
                        resources: ['人人都是产品经理', 'Notion', 'Medium']
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'UI 设计师',
        salary: 12000, // 杭州1-3年UI设计师中位数：9k-15k
        experience: '1-3年',
        education: '本科',
        tags: ['设计', '创意'],
        requirements: [
            { 
                id: 'r1', 
                text: '精通 Figma/Sketch/Adobe 全家桶，掌握设计工具高级技巧', 
                reward: '工具技能薪资 +2000元',
                growthTask: '【任务】完成 30 天设计挑战（每天 1 个作品）+ 掌握 Figma 插件开发 + 学习 Auto Layout、组件变体 + 输出工具使用技巧文档'
            },
            { 
                id: 'r2', 
                text: '扎实的视觉设计功底：色彩理论、排版、构图、品牌设计', 
                reward: '视觉设计薪资 +2500元',
                growthTask: '【任务】临摹 100 个优秀作品（Dribbble Top 作品）+ 设计 5 套完整 VI 系统 + 学习《设计心理学》《写给大家看的设计书》'
            },
            { 
                id: 'r3', 
                text: 'UI/UX 设计能力：用户体验、交互设计、信息架构、可用性测试', 
                reward: '体验设计薪资 +2500元',
                growthTask: '【任务】完成 5 个完整 UX 项目（用户研究→信息架构→原型→测试）+ 绘制 20 个用户旅程地图 + 执行 10 次可用性测试'
            },
            { 
                id: 'r4', 
                text: '多平台设计规范：iOS/Android/Web/小程序设计规范和适配', 
                reward: '规范适配薪资 +2000元',
                growthTask: '【任务】学习各平台设计规范（HIG、Material Design）+ 设计 3 套多平台适配方案 + 输出设计规范文档和组件库'
            },
            { 
                id: 'r5', 
                text: '设计趋势与创新：关注设计趋势、动效设计、3D 设计、插画能力', 
                reward: '创新能力薪资 +1500元',
                growthTask: '【任务】每周收集 50 个设计灵感 + 学习 Principle/AE 动效设计 + 学习 Blender/C4D 3D 设计 + 创作 20 个原创插画'
            },
            { 
                id: 'r6', 
                text: '设计协作与交付：设计系统、组件库、设计走查、开发协作', 
                reward: '协作交付薪资 +1500元',
                growthTask: '【任务】搭建完整设计系统（颜色、字体、组件、图标）+ 参与 10 次设计走查 + 输出设计标注和切图 + 学习前端基础知识'
            }
        ]
    },
    {
        id: 5,
        title: '运营专员',
        salary: 9000, // 杭州1-3年运营专员中位数：7k-12k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '运营'],
        requirements: [
            { 
                id: 'r1', 
                text: '新媒体运营：微信公众号、视频号、抖音、小红书、B站内容运营', 
                reward: '新媒体薪资 +1500元',
                growthTask: '【任务】运营个人账号 6 个月（涨粉 5000+）+ 产出 10 个爆款内容（10w+ 阅读）+ 学习平台算法规则 + 输出运营 SOP'
            },
            { 
                id: 'r2', 
                text: '内容策划与文案：爆款文案、选题策划、内容日历、素材库管理', 
                reward: '内容创作薪资 +1500元',
                growthTask: '【任务】输出 100 篇优质文案 + 策划 20 个选题方向 + 建立 500+ 素材库 + 学习《爆款文案》《疯传》等书籍'
            },
            { 
                id: 'r3', 
                text: '用户增长：拉新、促活、留存、转化，AARRR 模型应用', 
                reward: '用户增长薪资 +2000元',
                growthTask: '【任务】策划 10 个增长活动（裂变、拼团、分销）+ 实现用户增长 10000+ + 提升留存率 30% + 输出增长复盘报告'
            },
            { 
                id: 'r4', 
                text: '活动策划与执行：线上活动、营销活动、ROI 分析、资源整合', 
                reward: '活动策划薪资 +1500元',
                growthTask: '【任务】策划并执行 15 个活动（节日营销、促销、品牌活动）+ 活动 ROI > 3 + 输出活动方案和复盘文档'
            },
            { 
                id: 'r5', 
                text: '数据分析与优化：数据埋点、用户行为分析、转化漏斗、A/B 测试', 
                reward: '数据分析薪资 +1500元',
                growthTask: '【任务】搭建数据看板 + 分析 20 个运营指标 + 执行 5 次 A/B 测试 + 每周输出数据周报和优化建议'
            },
            { 
                id: 'r6', 
                text: '社群运营：社群搭建、用户维护、活跃度提升、社群变现', 
                reward: '社群运营薪资 +1000元',
                growthTask: '【任务】运营 3 个社群（总人数 2000+）+ 社群活跃度 > 40% + 实现社群转化 + 输出社群运营手册'
            }
        ]
    },
    {
        id: 6,
        title: '算法工程师',
        salary: 28000, // 杭州1-3年算法工程师中位数：22k-35k（硕士）
        experience: '1-3年',
        education: '硕士',
        tags: ['AI', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '扎实的数学基础：线性代数、概率论、统计学、最优化理论', 
                reward: '数学基础薪资 +4000元',
                growthTask: '【任务】完成《线性代数》《概率论》复习 + 吴恩达机器学习课程 + 斯坦福 CS229 + 手推 10 个经典算法数学推导'
            },
            { 
                id: 'r2', 
                text: '精通 Python + 深度学习框架（PyTorch/TensorFlow）+ CUDA 编程', 
                reward: '编程能力薪资 +5000元',
                growthTask: '【任务】复现 20 篇经典论文（ResNet、BERT、GPT、Transformer）+ 手写神经网络框架 + 学习 CUDA 并优化模型推理速度'
            },
            { 
                id: 'r3', 
                text: '机器学习算法：监督学习、无监督学习、强化学习、集成学习', 
                reward: '算法能力薪资 +4500元',
                growthTask: '【任务】手写实现 15 个经典算法（决策树、SVM、KMeans、XGBoost）+ Kaggle 竞赛获得银牌以上 + 输出算法原理笔记'
            },
            { 
                id: 'r4', 
                text: '深度学习项目：CV（图像分类、目标检测）、NLP（文本分类、命名实体识别）、推荐系统', 
                reward: '项目经验薪资 +5000元',
                growthTask: '【任务】完成 5 个深度学习项目：图像分类（准确率 95%+）+ 目标检测（YOLO）+ 文本分类 + NER + 推荐系统（CTR 预估）'
            },
            { 
                id: 'r5', 
                text: '模型优化与部署：模型压缩、量化、蒸馏、TensorRT/ONNX 部署', 
                reward: '工程化薪资 +4500元',
                growthTask: '【任务】将 3 个模型部署到生产环境 + 模型压缩至原大小 30% + 推理速度提升 5 倍 + 使用 TensorRT/ONNX 优化'
            },
            { 
                id: 'r6', 
                text: '论文阅读与创新：跟踪顶会论文（CVPR、NeurIPS、ACL）、算法创新能力', 
                reward: '研究能力薪资 +5000元',
                growthTask: '【任务】精读 100 篇顶会论文 + 每周输出论文笔记 + 提出 3 个算法改进方案 + 在顶会/期刊发表 1 篇论文'
            }
        ]
    },
    {
        id: 7,
        title: '测试工程师',
        salary: 13000, // 杭州1-3年测试工程师中位数：10k-16k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '测试理论与方法：黑盒/白盒测试、等价类、边界值、测试用例设计', 
                reward: '测试理论薪资 +2000元',
                growthTask: '【任务】学习《软件测试》教材 + 考取 ISTQB 认证 + 设计 100 个测试用例（覆盖各种场景）+ 输出测试规范文档'
            },
            { 
                id: 'r2', 
                text: 'UI 自动化测试：Selenium/Playwright/Cypress，POM 设计模式', 
                reward: 'UI 自动化薪资 +2500元',
                growthTask: '【任务】为 3 个项目编写 UI 自动化脚本（覆盖率 80%+）+ 搭建自动化测试框架 + 集成 CI/CD 自动执行'
            },
            { 
                id: 'r3', 
                text: '接口测试：Postman/JMeter/RestAssured，接口自动化测试框架', 
                reward: '接口测试薪资 +2500元',
                growthTask: '【任务】完成 5 个项目接口测试（200+ 接口）+ 搭建接口自动化框架 + 实现数据驱动测试 + 输出接口测试报告'
            },
            { 
                id: 'r4', 
                text: '性能测试：JMeter/Locust 压测，性能瓶颈分析，性能调优', 
                reward: '性能测试薪资 +2500元',
                growthTask: '【任务】完成 3 个项目性能测试（QPS 5000+）+ 定位性能瓶颈并优化 + 输出性能测试报告和调优方案'
            },
            { 
                id: 'r5', 
                text: '编程能力：Python/Java 测试脚本开发、测试工具开发', 
                reward: '编程能力薪资 +2000元',
                growthTask: '【任务】掌握 Python/Java 编程 + 开发 3 个测试工具（数据生成、日志分析、报告生成）+ 搭建测试平台'
            },
            { 
                id: 'r6', 
                text: '质量管理：Bug 跟踪（JIRA）、测试流程、质量度量、持续集成', 
                reward: '质量管理薪资 +1500元',
                growthTask: '【任务】使用 JIRA 管理 10 个项目测试流程 + 建立质量度量体系（缺陷密度、测试覆盖率）+ 集成 Jenkins CI/CD'
            }
        ]
    },
    {
        id: 8,
        title: '数据分析师',
        salary: 16000, // 杭州1-3年数据分析师中位数：12k-20k
        experience: '1-3年',
        education: '本科',
        tags: ['数据', '分析'],
        requirements: [
            { 
                id: 'r1', 
                text: '精通 SQL：复杂查询、窗口函数、性能优化、数据仓库建模', 
                reward: 'SQL 能力薪资 +2500元',
                growthTask: '【任务】完成 LeetCode 数据库题目 100 道 + 优化 20 条慢 SQL + 设计 3 个数据仓库模型（维度建模）+ 输出 SQL 规范文档'
            },
            { 
                id: 'r2', 
                text: 'Python 数据分析：Pandas/NumPy/Matplotlib，数据清洗与处理', 
                reward: 'Python 薪资 +3000元',
                growthTask: '【任务】完成 10 个数据分析项目（用户行为、销售、运营）+ 处理 100w+ 数据集 + 输出数据分析报告和可视化图表'
            },
            { 
                id: 'r3', 
                text: '数据可视化：Tableau/Power BI/FineBI，数据看板设计', 
                reward: '可视化薪资 +2500元',
                growthTask: '【任务】制作 20 个数据看板（实时监控、业务分析）+ 设计可视化规范 + 为业务方提供数据支持'
            },
            { 
                id: 'r4', 
                text: '统计学与建模：假设检验、回归分析、用户画像、预测模型', 
                reward: '建模能力薪资 +3000元',
                growthTask: '【任务】学习统计学和机器学习 + 完成 5 个建模项目（用户画像、流失预测、销售预测、RFM 分析）+ 模型准确率 85%+'
            },
            { 
                id: 'r5', 
                text: '业务理解：业务指标体系、数据驱动决策、A/B 测试、增长分析', 
                reward: '业务分析薪资 +2500元',
                growthTask: '【任务】搭建业务指标体系（北极星指标、AARRR）+ 执行 10 次 A/B 测试 + 输出 20 份业务分析报告和优化建议'
            },
            { 
                id: 'r6', 
                text: '数据思维与沟通：数据 Storytelling、汇报演示、跨部门协作', 
                reward: '沟通能力薪资 +2500元',
                growthTask: '【任务】向管理层汇报 10 次数据分析结果 + 输出数据分析 PPT + 协助业务方制定数据驱动策略 + 培训团队数据思维'
            }
        ]
    },
    {
        id: 9,
        title: 'Go 后端工程师',
        salary: 22000, // 杭州1-3年Go后端中位数：18k-26k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '精通 Go 语言：并发编程、goroutine、channel、GC 机制', 
                reward: 'Go 基础薪资 +3500元',
                growthTask: '【任务】完成《Go 程序设计语言》学习 + 手写协程池、内存池 + LeetCode 刷题 150 道 + 深入理解 Go 调度器和 GC'
            },
            { 
                id: 'r2', 
                text: '微服务框架：Gin/Echo/Go-Zero，gRPC 通信，服务治理', 
                reward: '框架薪资 +4000元',
                growthTask: '【任务】使用 Go-Zero 搭建微服务项目（用户、订单、支付）+ 实现 gRPC 服务调用 + 集成服务注册发现、熔断降级'
            },
            { 
                id: 'r3', 
                text: '数据库与缓存：MySQL/PostgreSQL 优化、Redis 高级应用', 
                reward: '数据层薪资 +3500元',
                growthTask: '【任务】使用 GORM 开发 ORM 层 + 实现数据库连接池优化 + Redis 缓存架构设计 + 解决缓存一致性问题'
            },
            { 
                id: 'r4', 
                text: '消息队列：Kafka/RabbitMQ/NATS，事件驱动架构', 
                reward: '消息队列薪资 +3000元',
                growthTask: '【任务】实现基于 Kafka 的事件驱动系统 + 消息可靠性保证 + 实现 CQRS 模式 + 分布式事务处理'
            },
            { 
                id: 'r5', 
                text: '云原生技术：Docker/K8s 容器化部署、CI/CD 流程', 
                reward: '云原生薪资 +4000元',
                growthTask: '【任务】编写 Dockerfile 和 K8s 配置 + 搭建 CI/CD 流水线 + 实现灰度发布 + 监控告警系统（Prometheus）'
            },
            { 
                id: 'r6', 
                text: '高性能优化：性能分析（pprof）、并发优化、内存优化', 
                reward: '性能优化薪资 +4000元',
                growthTask: '【任务】使用 pprof 分析性能瓶颈 + 优化 3 个项目性能（QPS 提升 5 倍）+ 解决内存泄漏问题 + 输出性能优化方案'
            }
        ]
    },
    {
        id: 10,
        title: '全栈工程师',
        salary: 24000, // 杭州1-3年全栈工程师中位数：20k-28k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '前端全栈：React/Vue3 + TypeScript + Next.js/Nuxt.js SSR', 
                reward: '前端能力薪资 +4000元',
                growthTask: '【任务】完成 3 个前端项目（SPA、SSR、SSG）+ 掌握前端工程化 + 性能优化（Lighthouse 90+）+ 移动端适配'
            },
            { 
                id: 'r2', 
                text: '后端全栈：Node.js/Python/Go 任一语言 + RESTful/GraphQL API', 
                reward: '后端能力薪资 +4500元',
                growthTask: '【任务】使用 Node.js/Nest.js 搭建后端服务 + 设计 RESTful API + 实现 GraphQL 接口 + JWT 认证授权'
            },
            { 
                id: 'r3', 
                text: '数据库设计：MySQL/MongoDB 数据建模、SQL 优化、NoSQL 应用', 
                reward: '数据库薪资 +3500元',
                growthTask: '【任务】设计 5 个业务数据库 + 优化慢查询 + 使用 MongoDB 存储非结构化数据 + 实现数据迁移方案'
            },
            { 
                id: 'r4', 
                text: '云服务部署：AWS/阿里云/腾讯云，服务器运维、域名配置', 
                reward: '运维能力薪资 +3000元',
                growthTask: '【任务】部署 3 个完整项目到云服务器 + 配置 Nginx 反向代理 + HTTPS 证书配置 + 自动化部署脚本'
            },
            { 
                id: 'r5', 
                text: '项目架构：微服务架构、前后端分离、DevOps 实践', 
                reward: '架构能力薪资 +4500元',
                growthTask: '【任务】设计完整的全栈项目架构 + 实现前后端分离 + 搭建 CI/CD 流水线 + 监控日志系统'
            },
            { 
                id: 'r6', 
                text: '独立开发能力：从需求到上线全流程，产品思维、用户体验', 
                reward: '综合能力薪资 +4500元',
                growthTask: '【任务】独立完成 2 个完整项目（从 0 到 1）+ 产品设计 + 开发 + 测试 + 上线 + 运营数据分析'
            }
        ]
    },
    {
        id: 11,
        title: '移动端开发工程师',
        salary: 19000, // 杭州1-3年移动端中位数：16k-23k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '原生开发：iOS (Swift/SwiftUI) 或 Android (Kotlin/Jetpack)', 
                reward: '原生开发薪资 +3500元',
                growthTask: '【任务】完成 3 个原生 APP 项目 + 掌握 UI 布局、网络请求、数据存储 + 发布到 App Store/Google Play'
            },
            { 
                id: 'r2', 
                text: '跨平台开发：Flutter/React Native，一套代码多端运行', 
                reward: '跨平台薪资 +4000元',
                growthTask: '【任务】使用 Flutter 开发 3 个跨平台 APP + 掌握状态管理（Provider/Riverpod）+ 原生模块集成 + 性能优化'
            },
            { 
                id: 'r3', 
                text: '移动端架构：MVVM/MVI 架构、组件化、模块化设计', 
                reward: '架构设计薪资 +3000元',
                growthTask: '【任务】重构 2 个项目为 MVVM 架构 + 实现组件化拆分 + 设计路由管理 + 依赖注入框架'
            },
            { 
                id: 'r4', 
                text: '性能优化：启动优化、内存优化、卡顿优化、包体积优化', 
                reward: '性能优化薪资 +3500元',
                growthTask: '【任务】优化 APP 启动时间至 2s 内 + 解决内存泄漏 + 优化列表滑动流畅度 + 包体积压缩 50%'
            },
            { 
                id: 'r5', 
                text: '网络与数据：HTTP/WebSocket、数据缓存、离线存储', 
                reward: '网络数据薪资 +2500元',
                growthTask: '【任务】实现网络请求封装 + 数据缓存策略 + 离线模式 + 数据同步机制 + 网络异常处理'
            },
            { 
                id: 'r6', 
                text: '用户体验：动画效果、手势交互、适配方案、无障碍支持', 
                reward: '用户体验薪资 +2500元',
                growthTask: '【任务】实现 20 个流畅动画效果 + 手势交互优化 + 多屏幕适配 + 暗黑模式 + 无障碍功能'
            }
        ]
    },
    {
        id: 12,
        title: '游戏开发工程师',
        salary: 21000, // 杭州1-3年游戏开发中位数：17k-25k
        experience: '1-3年',
        education: '本科',
        tags: ['游戏', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: 'Unity3D 开发：C# 编程、游戏物理、碰撞检测、粒子系统', 
                reward: 'Unity 开发薪资 +3500元',
                growthTask: '【任务】完成 3 个 Unity 游戏项目（2D 横版、3D 第三人称、休闲游戏）+ 掌握物理引擎 + 特效制作'
            },
            { 
                id: 'r2', 
                text: '游戏逻辑：状态机、AI 系统、战斗系统、关卡设计', 
                reward: '游戏逻辑薪资 +4000元',
                growthTask: '【任务】实现敌人 AI（寻路、攻击、巡逻）+ 战斗系统（技能、buff、伤害计算）+ 设计 10 个游戏关卡'
            },
            { 
                id: 'r3', 
                text: '网络同步：帧同步/状态同步、服务器通信、多人对战', 
                reward: '网络同步薪资 +4000元',
                growthTask: '【任务】实现多人在线游戏 + 帧同步或状态同步 + 解决网络延迟和丢包 + 断线重连机制'
            },
            { 
                id: 'r4', 
                text: '性能优化：渲染优化、内存管理、资源加载、热更新', 
                reward: '性能优化薪资 +3500元',
                growthTask: '【任务】优化游戏帧率至 60fps + DrawCall 优化 + 资源异步加载 + 实现热更新方案（Lua/ILRuntime）'
            },
            { 
                id: 'r5', 
                text: 'UI 系统：UGUI/UIToolkit、界面框架、动画系统', 
                reward: 'UI 系统薪资 +3000元',
                growthTask: '【任务】搭建完整 UI 框架（MVC/MVVM）+ 实现 20 个游戏界面 + UI 动画和特效 + 适配多分辨率'
            },
            { 
                id: 'r6', 
                text: '游戏发布：多平台打包（iOS/Android/PC）、SDK 接入、上线流程', 
                reward: '发布能力薪资 +3000元',
                growthTask: '【任务】发布游戏到 3 个平台 + 接入支付 SDK + 广告 SDK + 数据统计 + 版本管理和更新'
            }
        ]
    },
    {
        id: 13,
        title: '视频剪辑师',
        salary: 10000, // 杭州1-3年视频剪辑中位数：8k-13k
        experience: '1-3年',
        education: '本科',
        tags: ['创意', '内容'],
        requirements: [
            { 
                id: 'r1', 
                text: '剪辑软件：Premiere Pro/Final Cut Pro/DaVinci Resolve 精通', 
                reward: '剪辑技能薪资 +1800元',
                growthTask: '【任务】完成 50 个视频剪辑项目（短视频、Vlog、广告片）+ 掌握快捷键和高效工作流 + 输出剪辑教程'
            },
            { 
                id: 'r2', 
                text: '视频节奏：音乐卡点、镜头切换、叙事节奏、情绪把控', 
                reward: '节奏感薪资 +2000元',
                growthTask: '【任务】剪辑 30 个音乐卡点视频 + 分析 50 个爆款视频节奏 + 掌握不同类型视频的剪辑风格'
            },
            { 
                id: 'r3', 
                text: '特效制作：After Effects 动画、转场特效、文字动效', 
                reward: '特效能力薪资 +2000元',
                growthTask: '【任务】学习 AE 基础 + 制作 50 个转场特效 + 文字动画模板 + MG 动画短片 + 粒子特效'
            },
            { 
                id: 'r4', 
                text: '调色技术：色彩理论、LUT 调色、风格化调色、肤色校正', 
                reward: '调色薪资 +1700元',
                growthTask: '【任务】学习达芬奇调色 + 调色 30 个视频（电影感、小清新、复古风）+ 制作 10 个 LUT 预设'
            },
            { 
                id: 'r5', 
                text: '内容理解：脚本分析、素材整理、故事板、创意表达', 
                reward: '内容能力薪资 +1500元',
                growthTask: '【任务】分析 50 个优秀视频脚本 + 绘制 20 个故事板 + 独立策划 10 个视频选题 + 素材管理系统'
            },
            { 
                id: 'r6', 
                text: '平台运营：抖音/B站/小红书视频特点、爆款分析、数据优化', 
                reward: '运营能力薪资 +1000元',
                growthTask: '【任务】研究各平台算法规则 + 剪辑 100 个平台视频 + 产出 5 个爆款视频（10w+ 播放）+ 数据分析优化'
            }
        ]
    },
    {
        id: 14,
        title: '新媒体运营',
        salary: 10000, // 杭州1-3年新媒体运营中位数：8k-13k
        experience: '1-3年',
        education: '本科',
        tags: ['互联网', '运营'],
        requirements: [
            { 
                id: 'r1', 
                text: '内容创作：爆款文案、短视频脚本、图文排版、选题策划', 
                reward: '内容创作薪资 +2000元',
                growthTask: '【任务】输出 200 篇优质内容 + 产出 10 个爆款（10w+ 阅读）+ 建立选题库 500+ + 学习爆款方法论'
            },
            { 
                id: 'r2', 
                text: '平台运营：微信公众号、抖音、小红书、B站、视频号', 
                reward: '平台运营薪资 +2000元',
                growthTask: '【任务】运营 3 个平台账号（涨粉 10000+）+ 掌握各平台算法 + 内容分发策略 + 数据分析优化'
            },
            { 
                id: 'r3', 
                text: '用户增长：裂变活动、社群运营、私域流量、转化漏斗', 
                reward: '用户增长薪资 +2000元',
                growthTask: '【任务】策划 10 个裂变活动（单次涨粉 1000+）+ 运营私域社群 5000 人 + 转化率提升 50%'
            },
            { 
                id: 'r4', 
                text: '数据分析：用户画像、内容数据、转化数据、A/B 测试', 
                reward: '数据分析薪资 +1500元',
                growthTask: '【任务】搭建数据看板 + 分析 100 篇内容数据 + 执行 10 次 A/B 测试 + 输出数据分析报告'
            },
            { 
                id: 'r5', 
                text: '商业变现：广告投放、直播带货、知识付费、电商转化', 
                reward: '商业变现薪资 +1500元',
                growthTask: '【任务】策划 5 场直播带货（GMV 10w+）+ 广告投放 ROI > 3 + 知识付费产品设计 + 电商转化优化'
            },
            { 
                id: 'r6', 
                text: '热点把握：追热点能力、话题营销、事件营销、品牌传播', 
                reward: '热点营销薪资 +1000元',
                growthTask: '【任务】追 50 个热点并产出内容 + 策划 5 个话题营销活动 + 产出 3 个刷屏级传播案例'
            }
        ]
    },
    {
        id: 15,
        title: 'AI 产品经理',
        salary: 26000, // 杭州1-3年AI产品经理中位数：22k-32k
        experience: '1-3年',
        education: '本科',
        tags: ['AI', '产品'],
        requirements: [
            { 
                id: 'r1', 
                text: 'AI 技术理解：机器学习、深度学习、NLP、CV 基础原理', 
                reward: 'AI 技术薪资 +4500元',
                growthTask: '【任务】学习吴恩达 AI 课程 + 了解 10 种 AI 算法原理 + 体验 50 个 AI 产品 + 输出 AI 技术学习笔记'
            },
            { 
                id: 'r2', 
                text: 'AI 产品设计：Prompt 工程、模型选型、数据标注、效果评估', 
                reward: '产品设计薪资 +5000元',
                growthTask: '【任务】设计 3 个 AI 产品（对话机器人、图像生成、智能推荐）+ 编写 100+ Prompt + 设计数据标注流程'
            },
            { 
                id: 'r3', 
                text: 'AI 应用场景：ChatGPT、Midjourney、Stable Diffusion 等工具应用', 
                reward: '应用能力薪资 +4000元',
                growthTask: '【任务】深度使用 10 个 AI 工具 + 输出 20 个应用场景方案 + 完成 5 个 AI 落地项目'
            },
            { 
                id: 'r4', 
                text: '数据驱动：A/B 测试、模型效果评估、用户反馈分析', 
                reward: '数据分析薪资 +4000元',
                growthTask: '【任务】设计 AI 产品评估体系 + 执行 10 次 A/B 测试 + 优化模型准确率 20% + 输出数据分析报告'
            },
            { 
                id: 'r5', 
                text: '跨部门协作：与算法、工程、运营团队协作，推动项目落地', 
                reward: '协作能力薪资 +4000元',
                growthTask: '【任务】主导 3 个 AI 项目从 0 到 1 + 协调算法和工程资源 + 输出 PRD 和技术方案文档'
            },
            { 
                id: 'r6', 
                text: 'AI 行业洞察：关注 AI 前沿动态、竞品分析、商业化路径', 
                reward: '行业洞察薪资 +4500元',
                growthTask: '【任务】每周输出 1 篇 AI 行业分析 + 拆解 20 个 AI 产品案例 + 设计 AI 商业化方案'
            }
        ]
    },
    {
        id: 16,
        title: 'AI 应用开发工程师',
        salary: 24000, // 杭州1-3年AI应用开发中位数：20k-28k
        experience: '1-3年',
        education: '本科',
        tags: ['AI', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: 'Python 开发：熟练使用 Python + FastAPI/Flask + 异步编程', 
                reward: 'Python 开发薪资 +4000元',
                growthTask: '【任务】完成 5 个 Python 项目 + 掌握异步编程 + 学习 FastAPI 框架 + 性能优化实践'
            },
            { 
                id: 'r2', 
                text: 'AI 模型调用：OpenAI API、文心一言、通义千问等大模型接入', 
                reward: '模型接入薪资 +4500元',
                growthTask: '【任务】接入 5 个大模型 API + 实现 Prompt 优化 + 流式输出 + 上下文管理 + 成本优化'
            },
            { 
                id: 'r3', 
                text: 'RAG 应用开发：向量数据库、知识库构建、检索增强生成', 
                reward: 'RAG 开发薪资 +4500元',
                growthTask: '【任务】搭建 RAG 系统（Langchain + Pinecone/Milvus）+ 文档解析 + 向量化 + 检索优化'
            },
            { 
                id: 'r4', 
                text: 'AI Agent 开发：Function Calling、工具调用、多轮对话', 
                reward: 'Agent 开发薪资 +4000元',
                growthTask: '【任务】开发 3 个 AI Agent（客服机器人、代码助手、数据分析助手）+ 实现工具调用和多轮对话'
            },
            { 
                id: 'r5', 
                text: '前端集成：React/Vue + WebSocket + 流式渲染 + 语音交互', 
                reward: '前端集成薪资 +3500元',
                growthTask: '【任务】开发 AI 对话界面 + 实现流式输出 + 语音输入输出 + Markdown 渲染 + 代码高亮'
            },
            { 
                id: 'r6', 
                text: '部署运维：Docker 容器化、云服务部署、监控告警、成本优化', 
                reward: '部署运维薪资 +3500元',
                growthTask: '【任务】部署 3 个 AI 应用到云端 + 实现自动扩缩容 + 监控日志系统 + API 成本优化 50%'
            }
        ]
    },
    {
        id: 17,
        title: '大模型训练工程师',
        salary: 32000, // 杭州1-3年大模型训练中位数：28k-38k（硕士）
        experience: '1-3年',
        education: '硕士',
        tags: ['AI', '技术'],
        requirements: [
            { 
                id: 'r1', 
                text: '深度学习基础：Transformer、BERT、GPT 架构原理、注意力机制', 
                reward: '深度学习薪资 +5500元',
                growthTask: '【任务】精读 Transformer 论文 + 手写 Attention 机制 + 复现 BERT/GPT 模型 + 输出技术博客'
            },
            { 
                id: 'r2', 
                text: '大模型训练：预训练、微调（LoRA/QLoRA）、RLHF、指令微调', 
                reward: '模型训练薪资 +6000元',
                growthTask: '【任务】微调 3 个开源大模型（LLaMA/ChatGLM/Qwen）+ 实现 LoRA 微调 + RLHF 训练 + 评估优化'
            },
            { 
                id: 'r3', 
                text: '分布式训练：多卡训练、模型并行、数据并行、DeepSpeed/Megatron', 
                reward: '分布式训练薪资 +5500元',
                growthTask: '【任务】搭建分布式训练环境 + 实现 8 卡并行训练 + 使用 DeepSpeed 优化 + 训练效率提升 3 倍'
            },
            { 
                id: 'r4', 
                text: '数据工程：数据清洗、数据标注、数据增强、质量评估', 
                reward: '数据工程薪资 +5000元',
                growthTask: '【任务】构建高质量训练数据集（100w+ 样本）+ 设计数据清洗流程 + 数据标注规范 + 质量评估体系'
            },
            { 
                id: 'r5', 
                text: '模型优化：量化、剪枝、蒸馏、推理加速、显存优化', 
                reward: '模型优化薪资 +5000元',
                growthTask: '【任务】模型量化至 INT8/INT4 + 推理速度提升 5 倍 + 显存占用降低 70% + 精度损失 < 2%'
            },
            { 
                id: 'r6', 
                text: '论文复现：跟踪顶会论文、算法创新、实验设计、论文撰写', 
                reward: '研究能力薪资 +5000元',
                growthTask: '【任务】复现 20 篇顶会论文（NeurIPS/ICML/ACL）+ 提出算法改进 + 发表 1 篇论文 + 开源代码'
            }
        ]
    },
    {
        id: 18,
        title: 'AI 绘画师 / Prompt 工程师',
        salary: 15000, // 杭州1-3年AI绘画师中位数：12k-18k
        experience: '1-3年',
        education: '本科',
        tags: ['AI', '创意'],
        requirements: [
            { 
                id: 'r1', 
                text: 'AI 绘画工具：Midjourney、Stable Diffusion、DALL-E 3 精通', 
                reward: '工具使用薪资 +2500元',
                growthTask: '【任务】使用 MJ 生成 500+ 作品 + 掌握 SD 本地部署 + 学习 ControlNet/LoRA + 输出工具教程'
            },
            { 
                id: 'r2', 
                text: 'Prompt 工程：提示词编写、参数调优、风格控制、质量提升', 
                reward: 'Prompt 能力薪资 +3000元',
                growthTask: '【任务】编写 1000+ 高质量 Prompt + 建立 Prompt 模板库 + 掌握各种风格关键词 + 输出 Prompt 指南'
            },
            { 
                id: 'r3', 
                text: '美术基础：构图、色彩、光影、透视、设计理论', 
                reward: '美术基础薪资 +2500元',
                growthTask: '【任务】学习美术基础理论 + 分析 100 个优秀作品 + 掌握各种艺术风格 + 临摹大师作品'
            },
            { 
                id: 'r4', 
                text: '模型训练：LoRA 训练、DreamBooth、风格迁移、角色一致性', 
                reward: '模型训练薪资 +2500元',
                growthTask: '【任务】训练 10 个 LoRA 模型（人物、风格、场景）+ 实现角色一致性 + 风格迁移应用'
            },
            { 
                id: 'r5', 
                text: '商业应用：电商设计、品牌设计、插画创作、IP 设计', 
                reward: '商业应用薪资 +2500元',
                growthTask: '【任务】完成 50 个商业项目（电商主图、海报、插画）+ 设计 5 个 IP 形象 + 建立作品集'
            },
            { 
                id: 'r6', 
                text: '后期处理：PS 精修、图像合成、细节优化、批量处理', 
                reward: '后期处理薪资 +2000元',
                growthTask: '【任务】掌握 PS 高级技巧 + 图像精修 100+ 张 + 开发批量处理脚本 + 输出后期教程'
            }
        ]
    },
    {
        id: 19,
        title: 'AI 视频制作师',
        salary: 16000, // 杭州1-3年AI视频制作中位数：13k-19k
        experience: '1-3年',
        education: '本科',
        tags: ['AI', '创意'],
        requirements: [
            { 
                id: 'r1', 
                text: 'AI 视频工具：Runway、Pika、Sora、HeyGen 等工具应用', 
                reward: 'AI 工具薪资 +2800元',
                growthTask: '【任务】掌握 5 个 AI 视频工具 + 生成 100+ 视频片段 + 了解各工具特点 + 输出使用教程'
            },
            { 
                id: 'r2', 
                text: 'AI 数字人：数字人制作、口型同步、表情驱动、虚拟主播', 
                reward: '数字人薪资 +3000元',
                growthTask: '【任务】制作 5 个数字人形象 + 实现口型同步 + 表情驱动 + 完成 20 个数字人视频'
            },
            { 
                id: 'r3', 
                text: '视频剪辑：Premiere/Final Cut + AI 辅助剪辑 + 节奏把控', 
                reward: '剪辑能力薪资 +2500元',
                growthTask: '【任务】剪辑 50 个 AI 视频 + 掌握 AI 辅助剪辑工具 + 音乐卡点 + 转场特效'
            },
            { 
                id: 'r4', 
                text: '特效合成：AE 特效 + AI 抠图 + 画面增强 + 风格化处理', 
                reward: '特效合成薪资 +2700元',
                growthTask: '【任务】制作 30 个特效视频 + AI 抠图/换背景 + 画面超分辨率 + 风格迁移应用'
            },
            { 
                id: 'r5', 
                text: '脚本创作：故事板设计、分镜头脚本、AI 辅助创作', 
                reward: '创作能力薪资 +2500元',
                growthTask: '【任务】创作 20 个视频脚本 + 绘制故事板 + 使用 AI 辅助创意 + 完成 10 个完整作品'
            },
            { 
                id: 'r6', 
                text: '商业应用：广告片、宣传片、短视频、直播背景', 
                reward: '商业应用薪资 +2500元',
                growthTask: '【任务】完成 30 个商业项目 + 广告片制作 + 品牌宣传片 + 短视频批量生产 + 建立作品集'
            }
        ]
    },
    {
        id: 20,
        title: 'AI 对话设计师',
        salary: 18000, // 杭州1-3年AI对话设计师中位数：15k-22k
        experience: '1-3年',
        education: '本科',
        tags: ['AI', '产品'],
        requirements: [
            { 
                id: 'r1', 
                text: '对话设计：对话流程设计、意图识别、槽位填充、多轮对话', 
                reward: '对话设计薪资 +3000元',
                growthTask: '【任务】设计 10 个对话场景（客服、助手、陪伴）+ 绘制对话流程图 + 设计异常处理逻辑'
            },
            { 
                id: 'r2', 
                text: 'Prompt 工程：System Prompt、Few-shot、Chain of Thought', 
                reward: 'Prompt 工程薪资 +3500元',
                growthTask: '【任务】编写 200+ System Prompt + 设计 Few-shot 示例 + 实现 CoT 推理 + 优化回复质量'
            },
            { 
                id: 'r3', 
                text: '人格设定：角色人设、语言风格、情感表达、个性化回复', 
                reward: '人格设定薪资 +3000元',
                growthTask: '【任务】设计 10 个 AI 角色人设 + 定义语言风格 + 情感表达规则 + 完成人格一致性测试'
            },
            { 
                id: 'r4', 
                text: '知识库构建：FAQ 整理、知识图谱、RAG 应用、检索优化', 
                reward: '知识库薪资 +3000元',
                growthTask: '【任务】构建 3 个领域知识库（1000+ 条目）+ 设计知识图谱 + 优化检索准确率 90%+'
            },
            { 
                id: 'r5', 
                text: '效果评估：对话质量评估、用户满意度、A/B 测试、持续优化', 
                reward: '效果评估薪资 +2500元',
                growthTask: '【任务】设计评估体系 + 执行 10 次 A/B 测试 + 分析 1000+ 对话记录 + 优化满意度至 85%+'
            },
            { 
                id: 'r6', 
                text: '工具使用：Botpress、Rasa、Dialogflow 等对话平台', 
                reward: '工具使用薪资 +3000元',
                growthTask: '【任务】掌握 3 个对话平台 + 搭建 5 个对话机器人 + 集成第三方服务 + 部署上线'
            }
        ]
    },
    {
        id: 21,
        title: '数字化转型专家/顾问',
        salary: 35000, // 杭州1-3年数字化转型顾问中位数：28k-45k
        experience: '1-3年',
        education: '本科',
        tags: ['咨询', '管理'],
        requirements: [
            { 
                id: 'r1', 
                text: '数字化战略：企业数字化转型规划、业务流程优化、数字化成熟度评估', 
                reward: '战略规划薪资 +6000元',
                growthTask: '【任务】完成 5 个企业数字化诊断 + 输出数字化转型战略规划 + 设计数字化成熟度评估模型 + 学习《数字化转型方法论》'
            },
            { 
                id: 'r2', 
                text: '技术架构：云计算、大数据、AI、IoT 等技术选型与架构设计', 
                reward: '技术架构薪资 +6500元',
                growthTask: '【任务】设计 3 个企业级技术架构方案 + 掌握主流云平台（阿里云/AWS/Azure）+ 了解 10+ 数字化技术栈 + 输出技术选型报告'
            },
            { 
                id: 'r3', 
                text: '项目管理：数字化项目规划、敏捷管理、风险控制、交付管理', 
                reward: '项目管理薪资 +5500元',
                growthTask: '【任务】主导 3 个数字化转型项目（从规划到落地）+ 考取 PMP/ACP 认证 + 掌握敏捷方法论 + 输出项目管理手册'
            },
            { 
                id: 'r4', 
                text: '行业洞察：深入了解制造、零售、金融、医疗等行业数字化痛点与解决方案', 
                reward: '行业洞察薪资 +6000元',
                growthTask: '【任务】深度研究 3 个行业数字化案例 + 输出 10 份行业分析报告 + 参与 5 个行业峰会/论坛 + 建立行业知识库'
            },
            { 
                id: 'r5', 
                text: '变革管理：组织变革、文化转型、培训赋能、利益相关方管理', 
                reward: '变革管理薪资 +5500元',
                growthTask: '【任务】设计 3 个组织变革方案 + 完成 10 场数字化培训（100+ 人）+ 处理 5 个变革阻力案例 + 输出变革管理指南'
            },
            { 
                id: 'r6', 
                text: '商业价值：ROI 分析、成本效益评估、价值实现路径、成功案例复制', 
                reward: '商业价值薪资 +5500元',
                growthTask: '【任务】完成 5 个项目 ROI 分析（投资回报率 > 200%）+ 设计价值实现路径图 + 输出 10 个成功案例白皮书 + 建立价值评估模型'
            }
        ]
    }
];


export default jobsData
