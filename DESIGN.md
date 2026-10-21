---
name: 摘星计划 SlimStars
description: 深夜飞控中心主题的减肥打卡游戏设计系统
colors:
  bg: "#0A0F1E"
  panel: "#111834"
  panel-2: "#0E1428"
  line: "#1F2A4E"
  line-bright: "#2D3A68"
  ink: "#E9EDFF"
  ink-2: "#A6B0DC"
  ink-3: "#7A85B8"
  amber: "#FFB454"
  amber-deep: "#E08A12"
  green: "#3DDC97"
  red: "#FF6B81"
  blue: "#8FA0FF"
typography:
  display:
    fontFamily: "'ZCOOL XiaoWei', 'PingFang SC', serif"
    fontWeight: 400
    letterSpacing: "0.05-0.08em"
  body:
    fontFamily: "-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
  num:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontWeight: 500-700
    fontVariantNumeric: tabular-nums
rounded:
  sm: "10-12px"
  md: "14-16px"
  lg: "18-20px"
spacing:
  sm: "8px"
  md: "14-16px"
  lg: "18px"
components:
  button-primary:
    backgroundColor: "linear-gradient(180deg,#FFC164,#F79E2E)"
    textColor: "#241500"
    typography: "{typography.display}"
    rounded: "13px"
    padding: "15px"
  chip-selected:
    backgroundColor: "rgba(255,180,84,0.14)"
    textColor: "{colors.amber}"
---

# Design System: 摘星计划 SlimStars

## Overview

**Creative North Star: "深夜飞控中心"**

用户是自己减肥任务的指挥官：每个晚饭是一次夜间任务，四件遥测参数录入后「点火」，成功夜在个人星图点亮一颗航点，连续的成功夜自动连线成航线。深色由使用场景决定（晚间饭后/睡前，暗光环境）。拒绝两个默认：记账面板的灰列表，以及 v1 的明亮糖果街机。

**Key Characteristics:**
- 深空石墨蓝底 + 荧光琥珀（行动）/信号绿（成功）双色遥测 + 星蓝（航线）
- 面板 = 细亮规则线（1px #1F2A4E）+ 深投影；控件是「描边荧光」而非果冻
- JetBrains Mono 承担全部数据读数（遥测数字是本世界的母语）；ZCOOL XiaoWei 任务铭牌
- 庆祝 = 星形彩带 + 小火箭升空 + 航线绘制动画

## Colors

### Primary
- **发射琥珀**（#FFB454）：点火按钮、选中态、当前节点、金光。选中 = 琥珀 14% 透明底 + 琥珀描边 + 琥珀字。
- **信号绿**（#3DDC97）：成功语义——运动选中、成功读数、任务完成横幅、饮料区选中。

### Secondary
- **星图蓝**（#8FA0FF）：航线连线、日历选中格、周末标记。
- **偏航红**（#FF6B81）：仅负分读数与异常航点，永不做横幅。

### Neutral
- **深空底**（#0A0F1E / 面板 #111834 / 内里 #0E1428）：三层递进。
- **星文**（#E9EDFF / #A6B0DC / #7A85B8）：正文/次要/注记，全部 ≥4.5:1。

### Named Rules
**The Two-Signal Rule.** 琥珀=行动/奖励，绿=成功/健康，一屏内高亮不混用语义。  
**The Telemetry Ink Rule.** 一切数字用 JetBrains Mono tabular；正文绝不用等宽（等宽只属于数据）。

## Typography

**Display Font:** ZCOOL XiaoWei（任务铭牌/标题，字距 0.05-0.08em）
**Body Font:** 系统栈
**Data Font:** JetBrains Mono 500/700（读数、日期、进度标签、注记）

## Layout

同 v1 的手机单栏骨架（max-width 430px、底部悬浮 TabBar 4 标签：今夜/星图/任务/地面站）。分区注记用等宽小字（"虚线为成功线"）。

## Elevation & Depth

面板 = 1px 亮线描边 + 大而柔的深色投影（`0 12px 32px rgba(2,5,16,.5)`）；荧光感来自 box-shadow 光晕（选中 14px 内外发光、CTA 26px 琥珀环境光）而非浮雕。发光只给「当前/行动中」的元素。

## Shapes

控件 10-13px 圆角（比 v1 收敛，更工具感）、面板 14-18px；星图航点 = 同心圆光晕 + 四角星（完美夜）；阿控 = 圆角矩形头 + 面罩屏。

## Components

### 点火按钮
琥珀渐变块 + 1px 亮描边 + 内顶高光 + 26px 环境光晕；按下 translateY(2px) 光晕收敛；成功语境变薄荷绿。字距 0.22em 的仪式感排版。

### 遥测 Chip
深色内里面板 + 1px 线；选中=语义色荧光描边+同色字，无填充色块。

### 星图航点（签名组件）
成功夜=金/绿亮星（同心光晕），完美夜=四角超新星，平稳=暗点，偏航=红圈叉。连续成功夜之间由 SVG 航线相连（non-scaling-stroke + 0.9s 描线动画）。

### 阿控（签名组件）
圆角机器人头 + 天线信号灯 + 面罩脸，情绪随判定切换（待命圆眼/成功弯眼/完美波形眼+全开嘴/平稳方眼/偏航垂眼），2.6s 悬浮呼吸。

### 任务徽章
圆形暗金雷达底徽章 + 发光图标；锁定降饱和 55%。

## Do's and Don'ts

### Do:
- **Do** 让数据读数全部走 JetBrains Mono tabular-nums。
- **Do** 庆祝时刻使用星形 confetti + 火箭升空尾迹（launchFrom）。
- **Do** 航线、进度、经验条用描线/填充动画表达「飞行中」。
- **Do** 深色下所有文字 ≥4.5:1，荧光只做点睛不做底色。

### Don't:
- **Don't** 出现 v1 的糖果材质：果冻挤出、奶油底、圆胖卡片、六色宝石。
- **Don't** 给卡片加单侧粗色边（聊天气泡的高光条除外，用圆角短棒实现）。
- **Don't** 用等宽字体写正文句子。
- **Don't** 红色大面积告警——偏航夜也保持鼓励语气。
