---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface Brief — 摘星计划/飞控中心 App Shell（src/App.tsx 及全部视图）

## Scope & Visitor Mode

Operate（夜间任务打卡控制台）。移动优先 Web，深色控制台。四标签：今夜 / 星图 / 任务 / 地面站。

## Audience · Job · Action · Proof · Constraints

- 受众：减肥者本人，晚间手机场景（深色环境 → 深色主题由使用场景决定）。
- 任务：≤30 秒记录晚饭四件事，得到任务判定与正反馈。
- 行动：遥测点选 → 「点火」执行 → 星图点亮航点 → 看距下一任务节点还差 N 夜。
- 证据：本地真实数据；演示数据为合成。
- 约束：纯前端 localStorage；正向语气；规则透明。

## Direction Contract

THESIS: 用户是自己减肥任务的指挥官——每个晚饭是一次夜间任务，飞控台让"记录四件小事"变成发射程序；拒绝记账面板与 v1 糖果街机两个默认。
OWN-WORLD: 深空石墨蓝底（#0A0F1E 系）上的荧光控制台：细亮规则线面板、琥珀（行动）与信号绿（成功）双色遥测、JetBrains Mono 遥测数字、ZCOOL XiaoWei 任务铭牌；圆头机器人「阿控」为伴飞 AI；去掉内容仍是飞控中心。
STORY: 选完四件遥测 → 点火 → 夜空小火箭升空+成功遥测卡 → 星图点亮航点并与昨日连线 → 「距下一节点还差 N 夜」拉你明晚再来。
FIRST VIEWPORT: 深色单栏；顶栏任务时钟(Day N)+连飞火焰；阿控状态卡；四组遥测输入(时间/食量/饮料/运动)；实时判定读数；底部「点火」大按钮（琥珀，按下有下沉+光晕）。
FORM: 深空任务控制台（seed eb263492，候选 3），捐助融合：候选 2 夜空星图的星座航线收集面（星图日历连线）；v1 禁用世界的材质（果冻/糖果色/消除隐喻）全部不出现。
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved Decisions

无（评分规则沿用 v1 已验证的透明权重）。
