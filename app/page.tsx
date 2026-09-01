'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ChevronRight,
  Database,
  Download,
  FlaskConical,
  Gauge,
  Info,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Atom,
  Scale,
  Workflow,
  Zap,
} from 'lucide-react';

type Candidate = {
  id: string;
  name: string;
  family: string;
  summary: string;
  strength: number;
  conductivity: number;
  elongation: number;
  stressRelaxation: number;
  cost: string;
  novelty: string;
  risk: string;
  route: string;
  composition: CompositionEntry[];
  processSteps: { label: string; detail: string }[];
  physics: {
    phase: string;
    precipitate: string;
    window: string;
    balance: string;
    driving: string;
    explanation: string;
  };
  phaseDiagram: PhaseDiagram;
  conductivityAging: ConductivityAging;
  color: string;
};

type LocalResponse = {
  delta: string;
  metric: string;
  effect: string;
  tone: 'positive' | 'tradeoff' | 'neutral';
  basis: string;
};

type CompositionEntry = {
  element: string;
  lower: string;
  target: string;
  upper: string;
  role: string;
  localResponses: LocalResponse[];
};

type PhasePoint = [number, number];

type AgingPoint = [number, number];

type ConductivityAging = {
  points: AgingPoint[];
  temperature: number;
  measurementTemperature: number;
  precipitationStart: number;
  recommendedTime: [number, number];
  peakTime: number;
  overageStart: number;
  confidence: 'illustrative' | 'low';
  note: string;
};

type PhaseDiagram = {
  axisElement: string;
  xMax: number;
  yMin: number;
  yMax: number;
  solvus: PhasePoint[];
  liquidus: PhasePoint[];
  solidus: PhasePoint[];
  targetX: number;
  solutionTemp: number;
  agingLow: number;
  agingHigh: number;
  targetLabel: string;
  confidence: 'illustrative' | 'low';
  note: string;
};

const localResponse = (
  delta: string,
  metric: string,
  effect: string,
  tone: LocalResponse['tone'],
  basis: string,
): LocalResponse => ({ delta, metric, effect, tone, basis });
const compositionEntry = (
  element: string,
  lower: string,
  target: string,
  upper: string,
  role: string,
  localResponses: LocalResponse[],
): CompositionEntry => ({
  element,
  lower,
  target,
  upper,
  role,
  localResponses,
});
const phaseDiagram = (
  axisElement: string,
  xMax: number,
  targetX: number,
  solutionTemp: number,
  agingLow: number,
  agingHigh: number,
  solvus: PhasePoint[],
  confidence: PhaseDiagram['confidence'],
  note: string,
): PhaseDiagram => ({
  axisElement,
  xMax,
  yMin: 300,
  yMax: 1150,
  solvus,
  liquidus: [
    [0, 1084.9],
    [xMax * 0.25, 1082.9],
    [xMax * 0.5, 1080.4],
    [xMax * 0.75, 1078.4],
    [xMax, 1076.8],
  ],
  solidus: [
    [0, 1084.9],
    [xMax * 0.25, 1080.8],
    [xMax * 0.5, 1078.2],
    [xMax * 0.75, 1077.1],
    [xMax, 1076.8],
  ],
  targetX,
  solutionTemp,
  agingLow,
  agingHigh,
  targetLabel: '目标成分',
  confidence,
  note,
});

const agingCurve = (
  temperature: number,
  points: AgingPoint[],
  precipitationStart: number,
  recommendedTime: [number, number],
  peakTime: number,
  overageStart: number,
  confidence: ConductivityAging['confidence'],
  note: string,
): ConductivityAging => ({
  points,
  temperature,
  measurementTemperature: 20,
  precipitationStart,
  recommendedTime,
  peakTime,
  overageStart,
  confidence,
  note,
});

const candidates: Candidate[] = [
  {
    id: 'CU-01',
    name: 'Cu-Cr-Zr · 析出强化',
    family: '高强高导基线',
    summary: '成熟体系微合金化，优先验证稳定的强度—导电率窗口。',
    strength: 928,
    conductivity: 48.6,
    elongation: 13.5,
    stressRelaxation: 7.2,
    cost: '1.08×',
    novelty: '★★☆',
    risk: '低',
    route: '固溶 980°C → 快冷 → 450°C / 2h 时效',
    composition: [
      compositionEntry('Cr', '0.15', '0.32', '0.55', '析出强化', [
        localResponse(
          '+0.01 wt.%',
          '抗拉强度',
          '+8 MPa',
          'positive',
          '析出驱动力↑',
        ),
      ]),
      compositionEntry('Zr', '0.03', '0.08', '0.15', '晶粒细化', [
        localResponse(
          '+0.01 wt.%',
          '应力松弛',
          '−0.05 %/1000h',
          'positive',
          '析出相稳定性↑',
        ),
      ]),
      compositionEntry('Mg', '0.00', '0.05', '0.12', '辅助强化', [
        localResponse(
          '+0.10 wt.%',
          '导电率',
          '−0.6 % IACS',
          'tradeoff',
          '固溶散射↑',
        ),
      ]),
    ],
    processSteps: [
      { label: '均匀化 / 固溶', detail: '980°C，释放过饱和固溶体' },
      { label: '冷轧 60%', detail: '引入位错与织构' },
      { label: '峰值时效', detail: '450°C / 2h，形成细小析出相' },
    ],
    physics: {
      phase: 'FCC-Cu',
      precipitate: 'Cr-rich / Cu₅Zr（候选）',
      window: '440–465°C',
      balance: '48.6% IACS',
      driving: '0.78',
      explanation:
        'Cr 与 Zr 的析出驱动力集中在 440–465°C；细小弥散相钉扎位错，同时保留连续 Cu 基体以维持导电通道。',
    },
    phaseDiagram: phaseDiagram(
      'Cr/Zr 固定比例路径',
      0.8,
      0.4,
      980,
      440,
      465,
      [
        [0.02, 640],
        [0.05, 760],
        [0.12, 840],
        [0.21, 900],
        [0.31, 950],
        [0.49, 1000],
        [0.73, 1050],
      ],
      'illustrative',
      'Cr/Zr 以固定比例路径投影，非 wt.% 简单相加；相界仅用于演示路线筛选。',
    ),
    conductivityAging: agingCurve(
      450,
      [
        [0, 42.1],
        [0.5, 44.6],
        [1, 47.4],
        [2, 48.6],
        [4, 48.9],
        [8, 48.5],
      ],
      0.5,
      [1.5, 2.5],
      2,
      4,
      'illustrative',
      '示意：析出回收使导电率上升并在峰值时效附近趋于平台；过时效段不代表普遍下降。',
    ),
    color: 'copper',
  },
  {
    id: 'CU-02',
    name: 'Cu-Ni-Si · 复合析出',
    family: '平衡性能路线',
    summary: 'Ni-Si 析出相与微量 Zr 协同，优先改善延伸率与应力松弛。',
    strength: 914,
    conductivity: 51.2,
    elongation: 16.2,
    stressRelaxation: 6.4,
    cost: '1.12×',
    novelty: '★★★',
    risk: '中',
    route: '固溶 930°C → 冷轧 60% → 400°C / 4h 时效',
    composition: [
      compositionEntry('Ni', '1.00', '1.65', '2.20', 'Ni₂Si 析出', [
        localResponse(
          '+0.10 wt.%',
          '抗拉强度',
          '+7 MPa',
          'positive',
          '析出体积分数↑',
        ),
      ]),
      compositionEntry('Si', '0.30', '0.55', '0.80', '复合析出', [
        localResponse(
          '+0.10 wt.%',
          '延伸率',
          '−0.2 pp',
          'tradeoff',
          '界面密度↑',
        ),
      ]),
      compositionEntry('Zr', '0.02', '0.06', '0.12', '抑制粗化', [
        localResponse(
          '+0.01 wt.%',
          '应力松弛',
          '−0.07 %/1000h',
          'positive',
          '粗化速率↓',
        ),
      ]),
      compositionEntry('Cr', '0.00', '0.08', '0.20', '协同强化', [
        localResponse(
          '+0.10 wt.%',
          '抗拉强度',
          '+4 MPa',
          'positive',
          '固溶强化↑',
        ),
      ]),
    ],
    processSteps: [
      { label: '固溶处理', detail: '930°C，控制初始偏析' },
      { label: '冷轧 60%', detail: '调节位错密度与织构' },
      { label: '双级时效', detail: '400°C / 4h，稳定 Ni₂Si 析出' },
    ],
    physics: {
      phase: 'FCC-Cu',
      precipitate: 'δ-Ni₂Si',
      window: '380–420°C',
      balance: '51.2% IACS',
      driving: '0.71',
      explanation:
        'Ni₂Si 的析出窗口更宽，可在强度提升后保留较高塑性；Zr 用于抑制析出相粗化，降低长期应力松弛。',
    },
    phaseDiagram: phaseDiagram(
      'Ni/Si 固定比例路径',
      3.0,
      2.2,
      930,
      380,
      420,
      [
        [0.15, 650],
        [0.35, 720],
        [0.7, 790],
        [1.2, 850],
        [1.8, 900],
        [2.3, 925],
        [2.8, 970],
      ],
      'illustrative',
      'Ni-Si 以固定比例路径投影，需用多元数据库复算多个两相/三相区。',
    ),
    conductivityAging: agingCurve(
      400,
      [
        [0, 43.8],
        [1, 46.0],
        [2, 48.9],
        [4, 51.2],
        [6, 51.5],
        [8, 51.3],
      ],
      1,
      [3, 5],
      4,
      6,
      'illustrative',
      '示意：Ni-Si 析出动力学较慢，导电率在较长时效时间后达到平台。',
    ),
    color: 'teal',
  },
  {
    id: 'CU-03',
    name: 'Cu-Cr-Zr · 梯度组织',
    family: '组织调控路线',
    summary: '通过多级变形构建表层细晶与芯部高导的梯度结构。',
    strength: 956,
    conductivity: 46.8,
    elongation: 11.8,
    stressRelaxation: 7.6,
    cost: '1.19×',
    novelty: '★★★★',
    risk: '中高',
    route: '固溶 → 多级冷轧 → 短时退火 → 峰值时效',
    composition: [
      compositionEntry('Cr', '0.20', '0.40', '0.65', '表层析出', [
        localResponse(
          '+0.01 wt.%',
          '表层强度',
          '+9 MPa',
          'positive',
          '形核密度↑',
        ),
      ]),
      compositionEntry('Zr', '0.05', '0.10', '0.18', '细晶稳定', [
        localResponse(
          '+0.01 wt.%',
          '形核密度',
          '+12%',
          'positive',
          '晶界钉扎↑',
        ),
      ]),
      compositionEntry('Mg', '0.02', '0.06', '0.15', '位错钉扎', [
        localResponse(
          '+0.05 wt.%',
          '性能',
          '变化小',
          'neutral',
          '局部响应平坦',
        ),
      ]),
    ],
    processSteps: [
      { label: '固溶 / 快冷', detail: '970°C，保留过饱和组织' },
      { label: '多级冷轧', detail: '30% + 20%，形成梯度应变' },
      { label: '短时退火 / 时效', detail: '520°C → 450°C，细化表层晶粒' },
    ],
    physics: {
      phase: 'FCC-Cu + 梯度缺陷层',
      precipitate: 'Cr-rich / Cu₅Zr（候选）',
      window: '430–460°C',
      balance: '46.8% IACS',
      driving: '0.84',
      explanation:
        '高缺陷表层提高形核密度，芯部保留较低缺陷以维持导电率；该方案的性能增益来自组织梯度而非单纯提高合金化量。',
    },
    phaseDiagram: phaseDiagram(
      'Cr/Zr 固定比例路径',
      0.9,
      0.5,
      970,
      430,
      460,
      [
        [0.02, 620],
        [0.06, 760],
        [0.12, 840],
        [0.21, 900],
        [0.31, 950],
        [0.49, 1000],
        [0.73, 1050],
        [0.85, 1065],
      ],
      'illustrative',
      'Cr/Zr 以固定比例路径投影；相图只表示基体/析出相趋势，梯度组织效应需结合组织模型。',
    ),
    conductivityAging: agingCurve(
      450,
      [
        [0, 41.4],
        [0.5, 43.0],
        [1, 45.3],
        [2, 46.8],
        [4, 47.0],
        [8, 46.9],
      ],
      0.5,
      [1.5, 2.5],
      2,
      4,
      'illustrative',
      '示意：梯度缺陷与析出共同影响电阻率，曲线只表示基体导电率趋势。',
    ),
    color: 'violet',
  },
  {
    id: 'CU-04',
    name: 'Cu-Co-Si-Ti · 跨体系迁移',
    family: '非常规元素组合',
    summary: '迁移 Co-Si 析出机制，探索高温稳定性与抗松弛的组合窗口。',
    strength: 938,
    conductivity: 47.6,
    elongation: 14.2,
    stressRelaxation: 6.8,
    cost: '1.24×',
    novelty: '★★★★',
    risk: '高',
    route: '固溶 960°C → 热/冷复合轧制 → 470°C / 2h 时效',
    composition: [
      compositionEntry('Co', '0.55', '0.70', '0.90', 'Co₂Si 候选', [
        localResponse(
          '+0.10 wt.%',
          '抗拉强度',
          '+6 MPa',
          'positive',
          '析出体积分数↑',
        ),
      ]),
      compositionEntry('Si', '0.14', '0.20', '0.26', '析出驱动', [
        localResponse(
          '+0.02 wt.%',
          '析出驱动力',
          '+0.04',
          'positive',
          '过饱和度↑',
        ),
      ]),
      compositionEntry('Ti', '0.02', '0.04', '0.06', '异质形核', [
        localResponse('+0.01 wt.%', '形核率', '+8%', 'positive', '异质核心↑'),
      ]),
      compositionEntry('Zr', '0.01', '0.02', '0.04', '抑制粗化', [
        localResponse(
          '+0.01 wt.%',
          '粗化速率',
          '−0.002 /h',
          'positive',
          '界面迁移率↓',
        ),
      ]),
    ],
    processSteps: [
      { label: '固溶处理', detail: '960°C，均匀化元素分布' },
      { label: '热 / 冷复合轧制', detail: '控制织构与残余应力' },
      { label: '稳定化时效', detail: '470°C / 2h，验证高温保持率' },
    ],
    physics: {
      phase: 'FCC-Cu',
      precipitate: 'Co–Si 富集相（候选 Co₂Si）',
      window: '450–500°C',
      balance: '47.6% IACS',
      driving: '0.61',
      explanation:
        '模型假设 Co–Si 纳米析出相提高粗化温度，Ti 作为异质形核核心；该跨体系组合尚需 DFT / 相场和相组成实验复核。',
    },
    phaseDiagram: phaseDiagram(
      'Co/Si 固定比例路径',
      1.4,
      0.9,
      960,
      450,
      500,
      [
        [0.05, 620],
        [0.15, 720],
        [0.3, 800],
        [0.55, 870],
        [0.9, 930],
        [1.2, 980],
        [1.35, 1010],
      ],
      'low',
      '跨体系迁移路线：相界和析出相均为低置信度示意，需 DFT / 相场复核。',
    ),
    conductivityAging: agingCurve(
      470,
      [
        [0, 40.8],
        [0.5, 42.9],
        [1, 45.6],
        [2, 47.4],
        [4, 47.6],
        [8, 47.4],
      ],
      0.5,
      [1.5, 3],
      2,
      4,
      'low',
      '低置信度示意：跨体系析出相的形成与导电率恢复需由 DFT / 相场及实验共同校准。',
    ),
    color: 'blue',
  },
  {
    id: 'CU-05',
    name: 'Cu-Mg-Si · 规模化优先',
    family: '低成本可制造路线',
    summary: '以低成本元素和连续挤压为主，牺牲部分强度换取延伸率与放大能力。',
    strength: 882,
    conductivity: 53.5,
    elongation: 18.6,
    stressRelaxation: 8.4,
    cost: '0.96×',
    novelty: '★★★',
    risk: '低',
    route: '连续挤压 → 70% 冷轧 → 380°C / 4h 时效',
    composition: [
      compositionEntry('Mg', '0.10', '0.28', '0.50', 'Mg₂Si 析出', [
        localResponse(
          '+0.10 wt.%',
          '抗拉强度',
          '+6 MPa',
          'positive',
          'Mg₂Si 析出↑',
        ),
      ]),
      compositionEntry('Si', '0.05', '0.12', '0.22', '析出配平', [
        localResponse(
          '+0.10 wt.%',
          '导电率',
          '−0.4 % IACS',
          'tradeoff',
          '固溶散射↑',
        ),
      ]),
      compositionEntry('Ti', '0.02', '0.06', '0.12', '晶粒细化', [
        localResponse(
          '+0.05 wt.%',
          '性能',
          '变化小',
          'neutral',
          '细化效应趋于饱和',
        ),
      ]),
    ],
    processSteps: [
      { label: '连续挤压', detail: '近净成形，降低制造成本' },
      { label: '冷轧 70%', detail: '获得均匀加工硬化' },
      { label: '低温时效', detail: '380°C / 4h，平衡塑性与强度' },
    ],
    physics: {
      phase: 'FCC-Cu',
      precipitate: 'β′-Mg₂Si / Ti-rich 细化相',
      window: '360–400°C',
      balance: '53.5% IACS',
      driving: '0.59',
      explanation:
        'Mg-Si 析出消耗部分固溶原子，降低电子散射并保留较高导电率；物理筛选显示其强度不足以满足当前目标，适合作为成本对照路线。',
    },
    phaseDiagram: phaseDiagram(
      'Mg/Si 固定比例路径',
      0.9,
      0.4,
      900,
      360,
      400,
      [
        [0.03, 520],
        [0.08, 640],
        [0.15, 730],
        [0.28, 810],
        [0.45, 880],
        [0.7, 950],
        [0.85, 990],
      ],
      'illustrative',
      'Mg/Si 以固定比例路径投影；相区用于展示析出趋势，连续挤压后的组织需实测校准。',
    ),
    conductivityAging: agingCurve(
      380,
      [
        [0, 45.1],
        [0.5, 47.0],
        [1, 49.6],
        [2, 52.4],
        [4, 53.5],
        [6, 53.6],
        [8, 53.6],
      ],
      1,
      [3, 5],
      4,
      6,
      'illustrative',
      '示意：低温时效下导电率逐步恢复并趋于平台，适合作为成本优先对照路线。',
    ),
    color: 'cost',
  },
];

export default function Home() {
  const [taskName, setTaskName] = useState('高强高导铜合金导电连接件');
  const [family, setFamily] = useState('Cu-Cr-Zr');
  const [scenario, setScenario] = useState('高频连接器');
  const [strengthTarget, setStrengthTarget] = useState(900);
  const [conductivityTarget, setConductivityTarget] = useState(45);
  const [elongationTarget, setElongationTarget] = useState(12);
  const [relaxationTarget, setRelaxationTarget] = useState('≤ 8% / 1000h');
  const [process, setProcess] = useState('固溶 + 冷轧 + 时效');
  const [cost, setCost] = useState('≤ 1.20×基准');
  const [selectedId, setSelectedId] = useState('CU-01');
  const [generated, setGenerated] = useState(false);

  const selected = useMemo(
    () => candidates.find((item) => item.id === selectedId) ?? candidates[0],
    [selectedId],
  );
  const relaxationLimit = Number(relaxationTarget.match(/\d+/)?.[0] ?? 8);
  const costLimit = cost.includes('优先')
    ? 1
    : Number(cost.match(/[\d.]+/)?.[0] ?? 1.2);
  const costOf = (value: string) => Number(value.match(/[\d.]+/)?.[0] ?? 99);
  const meetsTargets =
    selected.strength >= strengthTarget &&
    selected.conductivity >= conductivityTarget &&
    selected.elongation >= elongationTarget &&
    selected.stressRelaxation <= relaxationLimit &&
    costOf(selected.cost) <= costLimit;
  const diagram = selected.phaseDiagram;
  const chart = {
    width: 640,
    height: 300,
    left: 52,
    right: 18,
    top: 18,
    bottom: 40,
  };
  const scaleX = (value: number) =>
    chart.left +
    (value / diagram.xMax) * (chart.width - chart.left - chart.right);
  const scaleY = (value: number) =>
    chart.height -
    chart.bottom -
    ((value - diagram.yMin) / (diagram.yMax - diagram.yMin)) *
      (chart.height - chart.top - chart.bottom);
  const pointsToSvg = (points: PhasePoint[]) =>
    points
      .map(
        ([x, temperature]) =>
          `${scaleX(x).toFixed(1)},${scaleY(temperature).toFixed(1)}`,
      )
      .join(' ');
  const solvusRegion = pointsToSvg([
    ...diagram.solvus,
    [diagram.xMax, diagram.yMin],
    [diagram.solvus[0][0], diagram.yMin],
  ]);
  const solidificationRegion = pointsToSvg([
    ...diagram.liquidus,
    ...diagram.solidus.slice().reverse(),
  ]);
  const ageBandY = scaleY(diagram.agingHigh);
  const ageBandHeight = Math.max(5, scaleY(diagram.agingLow) - ageBandY);
  const targetPoint = {
    x: scaleX(diagram.targetX),
    y: scaleY(diagram.agingLow + (diagram.agingHigh - diagram.agingLow) / 2),
  };
  const stressMax = Math.max(
    1000,
    Math.ceil(Math.max(selected.strength * 1.1, strengthTarget * 1.05) / 100) *
      100,
  );
  const fractureStrain = selected.elongation;
  const strainMax = Math.max(14, Math.ceil(fractureStrain * 1.12));
  // 铜合金的工程曲线示意：E≈120 GPa，用示意屈服应力与屈服应变标记连续屈服过渡。
  const youngsModulus = 120000;
  const proofStress = selected.strength * 0.86;
  const proofStrain = (proofStress / youngsModulus) * 100;
  const uniformStrain = Math.min(
    fractureStrain - 0.6,
    Math.max(proofStrain + 1, fractureStrain * 0.68),
  );
  const fractureStress =
    selected.strength * (0.84 + Math.min(0.04, fractureStrain / 500));
  const stressX = (strain: number) => 38 + (strain / strainMax) * 344;
  const stressY = (stress: number) =>
    164 - (Math.max(0, stress) / stressMax) * 134;
  const stressStrains = [
    ...Array.from({ length: 80 }, (_, index) => (index / 79) * fractureStrain),
    proofStrain,
    uniformStrain,
    fractureStrain,
  ]
    .filter(
      (strain, index, values) =>
        strain >= 0 &&
        strain <= fractureStrain &&
        values.indexOf(strain) === index,
    )
    .sort((a, b) => a - b);
  const stressPath = stressStrains
    .map((strain, index) => {
      let stress = 0;
      if (strain <= proofStrain) {
        stress = youngsModulus * (strain / 100);
      } else if (strain <= uniformStrain) {
        const t = (strain - proofStrain) / (uniformStrain - proofStrain);
        const hardening = t + 0.35 * t * (1 - t);
        stress = proofStress + (selected.strength - proofStress) * hardening;
      } else {
        const t = (strain - uniformStrain) / (fractureStrain - uniformStrain);
        const neckingProgress = t ** 1.2;
        stress =
          selected.strength -
          (selected.strength - fractureStress) * neckingProgress;
      }
      return `${index === 0 ? 'M' : 'L'} ${stressX(strain).toFixed(1)} ${stressY(stress).toFixed(1)}`;
    })
    .join(' ');
  const proofPoint = { x: stressX(proofStrain), y: stressY(proofStress) };
  const uniformPoint = {
    x: stressX(uniformStrain),
    y: stressY(selected.strength),
  };
  const fracturePoint = {
    x: stressX(fractureStrain),
    y: stressY(fractureStress),
  };
  const aging = selected.conductivityAging;
  const agingChart = {
    width: 420,
    height: 190,
    left: 38,
    right: 16,
    top: 24,
    bottom: 36,
  };
  const agingTimes = aging.points.map(([time]) => time);
  const agingValues = aging.points.map(([, value]) => value);
  const agingValueMin = agingValues.reduce(
    (minimum, value) => Math.min(minimum, value),
    conductivityTarget,
  );
  const agingValueMax = agingValues.reduce(
    (maximum, value) => Math.max(maximum, value),
    conductivityTarget,
  );
  const agingTimeMaxValue = agingTimes.reduce(
    (maximum, time) => Math.max(maximum, time),
    aging.overageStart,
  );
  const agingTimeMax = Math.max(8, Math.ceil(agingTimeMaxValue / 2) * 2);
  const agingYMin = Math.max(0, Math.floor((agingValueMin - 2) / 5) * 5);
  const agingYMax = Math.max(
    agingYMin + 10,
    Math.ceil((agingValueMax + 2) / 5) * 5,
  );
  const agingScaleX = (time: number) =>
    agingChart.left +
    (time / agingTimeMax) *
      (agingChart.width - agingChart.left - agingChart.right);
  const agingScaleY = (value: number) =>
    agingChart.height -
    agingChart.bottom -
    ((value - agingYMin) / (agingYMax - agingYMin)) *
      (agingChart.height - agingChart.top - agingChart.bottom);
  const agingUncertaintyWidth = aging.confidence === 'low' ? 0.8 : 0.45;
  const agingPath = aging.points
    .map(
      ([time, value], index) =>
        `${index === 0 ? 'M' : 'L'} ${agingScaleX(time).toFixed(1)} ${agingScaleY(value).toFixed(1)}`,
    )
    .join(' ');
  const agingUncertainty = [
    ...aging.points.map(
      ([time, value]) =>
        `${agingScaleX(time).toFixed(1)},${agingScaleY(value + agingUncertaintyWidth).toFixed(1)}`,
    ),
    ...aging.points
      .slice()
      .reverse()
      .map(
        ([time, value]) =>
          `${agingScaleX(time).toFixed(1)},${agingScaleY(value - agingUncertaintyWidth).toFixed(1)}`,
      ),
  ].join(' ');
  const agingWindowX = agingScaleX(aging.recommendedTime[0]);
  const agingWindowWidth = Math.max(
    4,
    agingScaleX(aging.recommendedTime[1]) - agingWindowX,
  );
  const agingPeakPoint = aging.points.reduce((closest, point) =>
    Math.abs(point[0] - aging.peakTime) < Math.abs(closest[0] - aging.peakTime)
      ? point
      : closest,
  );
  const agingTargetY = agingScaleY(conductivityTarget);
  const agingPlotWidth = agingChart.width - agingChart.left - agingChart.right;
  const agingPlotHeight =
    agingChart.height - agingChart.top - agingChart.bottom;

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGenerated(false);
    window.setTimeout(() => setGenerated(true), 550);
  }

  function resetDemo() {
    setTaskName('高强高导铜合金导电连接件');
    setFamily('Cu-Cr-Zr');
    setScenario('高频连接器');
    setStrengthTarget(900);
    setConductivityTarget(45);
    setElongationTarget(12);
    setRelaxationTarget('≤ 8% / 1000h');
    setProcess('固溶 + 冷轧 + 时效');
    setCost('≤ 1.20×基准');
    setSelectedId('CU-01');
    setGenerated(false);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-brand-group">
          <a className="brand" href="#top" aria-label="回到铜合金工作台首页">
            <span className="brand-mark">
              <span>Cu</span>
            </span>
            <span className="brand-copy">
              <strong>COPPER / LAB</strong>
              <small>铜合金设计工作台</small>
            </span>
          </a>
          <div
            className="partner-lockup"
            aria-label="博威合金与深势科技联合研发"
          >
            <img
              className="partner-logo partner-logo-boway"
              src="./brands/boway-alloy.png"
              alt="博威合金"
              draggable="false"
            />
            <span className="partner-separator" aria-hidden="true">
              ×
            </span>
            <img
              className="partner-logo partner-logo-dp"
              src="./brands/dp-technology.png"
              alt="深势科技"
              draggable="false"
            />
          </div>
        </div>
        <div className="topbar-context">
          <span className="context-dot" />
          <span>本地演示模型</span>
          <span className="divider" />
          <span>设计任务 / {selected.id}</span>
        </div>
        <div className="topbar-actions">
          <button
            className="icon-button"
            type="button"
            onClick={resetDemo}
            title="恢复演示任务"
            aria-label="恢复演示任务"
          >
            <RotateCcw size={17} />
          </button>
          <button className="ghost-button" type="button">
            <Download size={15} /> 导出演示
          </button>
          <div className="avatar" aria-label="当前用户 Materials Engineer">
            ME
          </div>
        </div>
      </header>

      <div id="top" className="workspace">
        <section className="intro-row" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">COPPER ALLOY / DESIGN LOOP 04</p>
            <h1 id="page-title">从目标性能，反推铜合金成分与工艺。</h1>
            <p className="intro-copy">
              输入高强、高导、延伸率、应力松弛与制造边界，快速生成可解释、可验证的铜合金候选方案。
            </p>
          </div>
          <div className={`model-note ${generated ? 'model-note-ready' : ''}`}>
            <span className="model-note-label">当前状态</span>
            <strong>
              {generated
                ? '示例筛选完成 · 5 套独立方案'
                : '等待一次新的约束匹配'}
            </strong>
            <span>
              {generated
                ? '成分、工艺与物理证据已同步'
                : '静态演示数据 · 待接入预测模型'}
            </span>
          </div>
        </section>

        <div className="workspace-grid">
          <aside className="brief-panel panel" aria-labelledby="brief-heading">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">01 / DESIGN BRIEF</p>
                <h2 id="brief-heading">设计目标</h2>
              </div>
              <span className="step-tag">输入约束</span>
            </div>
            <form className="brief-form" onSubmit={handleGenerate}>
              <label className="field-label" htmlFor="task-name">
                任务名称
              </label>
              <input
                className="text-input"
                id="task-name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <label className="field-label" htmlFor="family">
                合金体系
              </label>
              <select
                className="select-input"
                id="family"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
              >
                <option>Cu-Cr-Zr</option>
                <option>Cu-Ni-Si</option>
                <option>Cu-Co-Si-Ti</option>
                <option>Cu-Mg-Si</option>
              </select>
              <fieldset className="field-group">
                <legend className="field-label">应用场景</legend>
                <div className="choice-grid">
                  {[
                    '高频连接器',
                    '弹性接触件',
                    '新能源汽车导电件',
                    '耐蚀换热件',
                  ].map((item, index) => (
                    <label
                      key={item}
                      className={`choice-card ${scenario === item ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="scenario"
                        value={item}
                        checked={scenario === item}
                        onChange={() => setScenario(item)}
                      />
                      <span className="choice-code">
                        {['RF', 'EL', 'EV', 'HX'][index]}
                      </span>
                      <span>{item}</span>
                      <small>
                        {
                          [
                            '高频 · 高导',
                            '高强 · 抗松弛',
                            '轻量 · 低损耗',
                            '耐热 · 耐蚀',
                          ][index]
                        }
                      </small>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="form-divider">
                <span>服役目标</span>
                <span>02</span>
              </div>
              <div className="input-pair">
                <div>
                  <label className="field-label" htmlFor="strength">
                    抗拉强度
                  </label>
                  <div className="unit-input">
                    <input
                      id="strength"
                      type="number"
                      value={strengthTarget}
                      onChange={(e) =>
                        setStrengthTarget(Number(e.target.value))
                      }
                    />
                    <span>MPa</span>
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="conductivity">
                    导电率
                  </label>
                  <div className="unit-input">
                    <input
                      id="conductivity"
                      type="number"
                      value={conductivityTarget}
                      onChange={(e) =>
                        setConductivityTarget(Number(e.target.value))
                      }
                    />
                    <span>% IACS</span>
                  </div>
                </div>
              </div>
              <label className="field-label" htmlFor="elongation">
                延伸率目标
              </label>
              <div className="unit-input">
                <input
                  id="elongation"
                  type="number"
                  value={elongationTarget}
                  min={5}
                  max={35}
                  step={0.5}
                  onChange={(e) => setElongationTarget(Number(e.target.value))}
                />
                <span>%</span>
              </div>
              <label className="field-label" htmlFor="relaxation">
                应力松弛目标
              </label>
              <select
                className="select-input"
                id="relaxation"
                value={relaxationTarget}
                onChange={(e) => setRelaxationTarget(e.target.value)}
              >
                <option>≤ 8% / 1000h</option>
                <option>≤ 10% / 1000h</option>
                <option>≤ 12% / 1000h</option>
              </select>
              <div className="form-divider">
                <span>制造边界</span>
                <span>03</span>
              </div>
              <label className="field-label" htmlFor="process">
                目标工艺路线
              </label>
              <select
                className="select-input"
                id="process"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
              >
                <option>固溶 + 冷轧 + 时效</option>
                <option>连续挤压 + 峰值时效</option>
                <option>多级变形 + 短时退火</option>
              </select>
              <label className="field-label" htmlFor="cost">
                成本边界
              </label>
              <select
                className="select-input"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              >
                <option>≤ 1.20×基准</option>
                <option>≤ 1.10×基准</option>
                <option>优先规模化成本</option>
              </select>
              <div className="constraint-meter">
                <span>
                  <strong>13</strong> 项约束已锁定
                </span>
                <span className="meter-track">
                  <i />
                </span>
              </div>
              <button className="primary-button" type="submit">
                <span className="button-pulse" />
                <span>{generated ? '重新生成候选方案' : '生成推荐方案'}</span>
                <ChevronRight size={17} />
              </button>
            </form>
            <p className="panel-footnote">
              <Info size={14} />
              <span>
                当前结果用于演示工作流，不替代材料试验、标准校核或工程判断。
              </span>
            </p>
          </aside>

          <section className="results-column" aria-labelledby="results-heading">
            <div className="results-header">
              <div>
                <p className="eyebrow">02 / RECOMMENDATION OUTPUT</p>
                <h2 id="results-heading">推荐结果</h2>
              </div>
              <div className="result-status" role="status" aria-live="polite">
                <span className={`status-light ${generated ? 'ready' : ''}`} />
                <span>{generated ? '约束匹配完成' : '等待约束匹配'}</span>
              </div>
            </div>
            <section
              className="candidate-section"
              aria-labelledby="candidate-heading"
            >
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">CANDIDATE SET</p>
                  <h3 id="candidate-heading">
                    候选路线选择 <span>5 套</span>
                  </h3>
                </div>
                <span className="candidate-order-note">
                  先选路线，再查看对应的成分、工艺与物理证据
                </span>
              </div>
              <div className="candidate-list">
                {candidates.map((candidate) => {
                  const pass =
                    candidate.strength >= strengthTarget &&
                    candidate.conductivity >= conductivityTarget &&
                    candidate.elongation >= elongationTarget &&
                    candidate.stressRelaxation <= relaxationLimit &&
                    costOf(candidate.cost) <= costLimit;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      className={`candidate-card panel ${selectedId === candidate.id ? 'selected' : ''}`}
                      onClick={() => setSelectedId(candidate.id)}
                    >
                      <span className={`candidate-index ${candidate.color}`}>
                        {candidate.id.replace('CU-', '')}
                      </span>
                      <span className="candidate-body">
                        <strong>{candidate.name}</strong>
                        <small>{candidate.summary}</small>
                        <span className="candidate-spec">
                          <b>成分</b>{' '}
                          {candidate.composition
                            .map((row) => `${row.element} ${row.target}`)
                            .join(' · ')}
                        </span>
                        <span className="candidate-spec">
                          <b>工艺</b>{' '}
                          {candidate.processSteps
                            .map((step) => step.label)
                            .join(' → ')}
                        </span>
                        <span className="candidate-tags">
                          <em>{candidate.novelty} 新颖性</em>
                          <em>{candidate.risk}风险</em>
                          <em>{candidate.cost}</em>
                          <em className={pass ? 'pass-tag' : 'hold-tag'}>
                            {pass ? '约束通过' : '待验证'}
                          </em>
                        </span>
                      </span>
                      <span className="candidate-metric">
                        <strong>{candidate.strength}</strong>
                        <small>MPa</small>
                        <b>{candidate.conductivity}%</b>
                        <small>IACS</small>
                        <i>A {candidate.elongation}%</i>
                      </span>
                      <ChevronRight size={18} className="candidate-arrow" />
                    </button>
                  );
                })}
              </div>
            </section>
            <article className="recommendation-card panel">
              <div className="recommendation-topline">
                <span className="recommendation-label">
                  PRIORITY CANDIDATE / {selected.id.replace('CU-', '')}
                </span>
                <span>基于当前设计边界</span>
              </div>
              <div className="recommendation-main">
                <div>
                  <h3>{selected.name}</h3>
                  <p>{selected.summary}</p>
                </div>
                <div className="selection-note">
                  <span>物理筛选结论</span>
                  <strong>
                    {meetsTargets ? '目标约束通过' : '存在待验证约束'}
                  </strong>
                  <small>
                    {selected.strength} MPa · {selected.conductivity}% IACS · A{' '}
                    {selected.elongation}%
                  </small>
                </div>
              </div>
              <div className="recommendation-meta">
                <span>
                  <i className="meta-dot copper" />
                  <strong>{selected.family}</strong>
                </span>
                <span>
                  <i className="meta-dot green" />
                  <strong>延伸率 ≥ {elongationTarget}%</strong>
                </span>
                <span>
                  <i className="meta-dot yellow" />
                  <strong>
                    应力松弛 {selected.stressRelaxation}% / {relaxationTarget}
                  </strong>
                </span>
                <span>
                  建议优先验证：
                  {selected.risk === '低' ? '成本优先小试' : '相组成与窗口'}
                </span>
              </div>
            </article>

            <section
              className="physics-card panel"
              aria-labelledby="physics-heading"
            >
              <div className="card-heading">
                <div>
                  <p className="eyebrow">THERMODYNAMIC + PHYSICS LENS</p>
                  <h3 id="physics-heading">热力学与物理约束</h3>
                </div>
                <span className="explanation-badge">
                  <ShieldCheck size={14} /> 物理证据链（示意）
                </span>
              </div>
              <p className="card-description">
                当前选中方案先经过相平衡、析出驱动力和工艺窗口筛选，再输出性能预测；切换候选卡片，下面的物理证据会同步变化。
              </p>
              <div className="physics-metrics">
                <div className="physics-metric">
                  <span>
                    <Atom size={15} /> 稳定基体相
                  </span>
                  <strong>{selected.physics.phase}</strong>
                  <small>CALPHAD 稳定区 · 演示结果</small>
                </div>
                <div className="physics-metric">
                  <span>
                    <Sparkles size={15} /> 主析出相
                  </span>
                  <strong>{selected.physics.precipitate}</strong>
                  <small>析出相类型 · 需实验确认</small>
                </div>
                <div className="physics-metric">
                  <span>
                    <Thermometer size={15} /> 析出窗口
                  </span>
                  <strong>{selected.physics.window}</strong>
                  <small>动力学推荐温区</small>
                </div>
                <div className="physics-metric">
                  <span>
                    <Scale size={15} /> 析出驱动力
                  </span>
                  <strong>ΔG {selected.physics.driving}</strong>
                  <small>相对析出驱动力指标 · 待校准</small>
                </div>
              </div>
              <div
                className="phase-diagram-panel"
                aria-labelledby="phase-diagram-heading"
              >
                <div className="phase-diagram-head">
                  <div>
                    <p className="eyebrow">PHASE MAP / ILLUSTRATIVE</p>
                    <h4 id="phase-diagram-heading">
                      Cu-rich 固定比例相图示意 · {selected.id}
                    </h4>
                    <span>
                      Cu-rich 固定比例截面（示意） · {diagram.axisElement}
                    </span>
                  </div>
                  <span
                    className={`phase-confidence ${diagram.confidence === 'low' ? 'low' : ''}`}
                  >
                    <Info size={14} />{' '}
                    {diagram.confidence === 'low'
                      ? '低置信度示意'
                      : '示意 / 非严格平衡计算'}
                  </span>
                </div>
                <div className="phase-diagram-layout">
                  <div className="phase-chart-wrap">
                    <svg
                      viewBox={`0 0 ${chart.width} ${chart.height}`}
                      role="img"
                      aria-label={`Cu-rich 固定比例截面示意相图，横轴为${diagram.axisElement}路径参数，纵轴为温度，标出目标成分与时效窗口`}
                    >
                      <rect
                        x={chart.left}
                        y={chart.top}
                        width={chart.width - chart.left - chart.right}
                        height={chart.height - chart.top - chart.bottom}
                        className="phase-chart-bg"
                      />
                      <g className="phase-grid-lines">
                        {[350, 550, 750, 950, 1100].map((temperature) => (
                          <line
                            key={`y-${temperature}`}
                            x1={chart.left}
                            x2={chart.width - chart.right}
                            y1={scaleY(temperature)}
                            y2={scaleY(temperature)}
                          />
                        ))}
                        {[
                          0,
                          diagram.xMax / 4,
                          diagram.xMax / 2,
                          diagram.xMax * 0.75,
                          diagram.xMax,
                        ].map((value, index) => (
                          <line
                            key={`x-${index}`}
                            x1={scaleX(value)}
                            x2={scaleX(value)}
                            y1={chart.top}
                            y2={chart.height - chart.bottom}
                          />
                        ))}
                      </g>
                      <polygon
                        points={solvusRegion}
                        className="phase-region-precipitate"
                      />
                      <polygon
                        points={solidificationRegion}
                        className="phase-region-liquid"
                      />
                      <polyline
                        points={pointsToSvg(diagram.liquidus)}
                        className="phase-liquidus"
                      />
                      <polyline
                        points={pointsToSvg(diagram.solidus)}
                        className="phase-solidus"
                      />
                      <polyline
                        points={pointsToSvg(diagram.solvus)}
                        className={`phase-solvus ${diagram.confidence === 'low' ? 'dashed' : ''}`}
                      />
                      <rect
                        x={chart.left}
                        y={ageBandY}
                        width={chart.width - chart.left - chart.right}
                        height={ageBandHeight}
                        className="phase-aging-band"
                      />
                      <line
                        x1={chart.left}
                        x2={chart.width - chart.right}
                        y1={scaleY(diagram.solutionTemp)}
                        y2={scaleY(diagram.solutionTemp)}
                        className="phase-solution-line"
                      />
                      <line
                        x1={targetPoint.x}
                        x2={targetPoint.x}
                        y1={chart.top}
                        y2={chart.height - chart.bottom}
                        className="phase-target-guide"
                      />
                      <circle
                        cx={targetPoint.x}
                        cy={targetPoint.y}
                        r="6"
                        className="phase-target-point"
                      />
                      <rect
                        x={scaleX(diagram.targetX) - 4}
                        y={scaleY(diagram.solutionTemp) - 4}
                        width="8"
                        height="8"
                        rx="2"
                        className="phase-solution-point"
                      />
                      <line
                        x1={chart.left}
                        x2={chart.width - chart.right}
                        y1={chart.height - chart.bottom}
                        y2={chart.height - chart.bottom}
                        className="phase-axis"
                      />
                      <line
                        x1={chart.left}
                        x2={chart.left}
                        y1={chart.top}
                        y2={chart.height - chart.bottom}
                        className="phase-axis"
                      />
                      <g className="phase-axis-labels">
                        {[350, 550, 750, 950, 1100].map((temperature) => (
                          <text
                            key={`yt-${temperature}`}
                            x={chart.left - 8}
                            y={scaleY(temperature) + 4}
                            textAnchor="end"
                          >
                            {temperature}°C
                          </text>
                        ))}
                        {[0, diagram.xMax / 2, diagram.xMax].map(
                          (value, index) => (
                            <text
                              key={`xt-${index}`}
                              x={scaleX(value)}
                              y={chart.height - chart.bottom + 19}
                              textAnchor="middle"
                            >
                              {value.toFixed(value < 1 ? 2 : 1)}
                            </text>
                          ),
                        )}
                        <text
                          x={chart.width / 2}
                          y={chart.height - 5}
                          textAnchor="middle"
                        >
                          固定比例路径参数 / 相对含量
                        </text>
                        <text
                          x="14"
                          y={chart.height / 2}
                          textAnchor="middle"
                          transform={`rotate(-90 14 ${chart.height / 2})`}
                        >
                          温度
                        </text>
                      </g>
                      <g className="phase-region-labels">
                        <text x={scaleX(diagram.xMax * 0.36)} y={scaleY(1100)}>
                          L（液相）
                        </text>
                        <text x={scaleX(diagram.xMax * 0.55)} y={scaleY(1079)}>
                          L + α（背景示意）
                        </text>
                        <text x={scaleX(diagram.xMax * 0.16)} y={scaleY(900)}>
                          α-Cu（FCC）
                        </text>
                        <text x={scaleX(diagram.xMax * 0.56)} y={scaleY(560)}>
                          α-Cu + 析出相
                        </text>
                      </g>
                      <g className="phase-line-labels">
                        <text
                          x={chart.width - chart.right - 4}
                          y={
                            scaleY(
                              diagram.solvus[diagram.solvus.length - 1][1],
                            ) - 7
                          }
                          textAnchor="end"
                        >
                          solvus / 析出边界
                        </text>
                        <text
                          x={chart.width - chart.right - 4}
                          y={
                            scaleY(
                              diagram.liquidus[diagram.liquidus.length - 1][1],
                            ) - 7
                          }
                          textAnchor="end"
                        >
                          液相线（背景示意）
                        </text>
                        <text
                          x={chart.width - chart.right - 4}
                          y={
                            scaleY(
                              diagram.solidus[diagram.solidus.length - 1][1],
                            ) + 14
                          }
                          textAnchor="end"
                        >
                          固相线（背景示意）
                        </text>
                        <text x={chart.left + 8} y={ageBandY - 5}>
                          时效 {diagram.agingLow}–{diagram.agingHigh}°C
                        </text>
                        <text
                          x={chart.left + 8}
                          y={scaleY(diagram.solutionTemp) - 6}
                        >
                          工艺固溶温度（示意） {diagram.solutionTemp}°C
                        </text>
                        <text x={targetPoint.x + 9} y={targetPoint.y - 8}>
                          目标点
                        </text>
                      </g>
                    </svg>
                  </div>
                  <div className="phase-diagram-legend">
                    <div className="phase-legend-item">
                      <i className="phase-swatch alpha" />
                      <span>α-Cu 单相基体</span>
                    </div>
                    <div className="phase-legend-item">
                      <i className="phase-swatch precipitate" />
                      <span>α-Cu + {selected.physics.precipitate}</span>
                    </div>
                    <div className="phase-legend-item">
                      <i className="phase-swatch aging" />
                      <span>析出 / 时效窗口</span>
                    </div>
                    <div className="phase-line-legend">
                      <span>
                        <i className="phase-line-swatch liquid" />
                        液相线（背景示意）
                      </span>
                      <span>
                        <i className="phase-line-swatch solidus" />
                        固相线（背景示意）
                      </span>
                      <span>
                        <i className="phase-line-swatch solvus" />
                        溶解度线
                      </span>
                    </div>
                    <div className="phase-route-list">
                      <div>
                        <b>目标成分</b>
                        <span>
                          {diagram.axisElement}{' '}
                          {diagram.targetX.toFixed(diagram.targetX < 1 ? 2 : 1)}{' '}
                          路径参数
                        </span>
                      </div>
                      <div>
                        <b>工艺固溶温度</b>
                        <span>{diagram.solutionTemp}°C</span>
                      </div>
                      <div>
                        <b>时效窗口</b>
                        <span>
                          {diagram.agingLow}–{diagram.agingHigh}°C
                        </span>
                      </div>
                      <div>
                        <b>相对 ΔG</b>
                        <span>{selected.physics.driving}</span>
                      </div>
                    </div>
                    <p className="phase-diagram-note">
                      {diagram.note} 该图使用 UI
                      路径参数作投影；凝固边界为背景示意，不代表数据库计算，工艺固溶温度也不作为“完全进入单相区”的判据。正式设计需固定三元截面、调用
                      CALPHAD 数据库，并以实验校准。
                    </p>
                  </div>
                </div>
              </div>
              <div className="physics-chain">
                <span>
                  <b>01</b>目标约束
                </span>
                <ChevronRight size={15} />
                <span>
                  <b>02</b>CALPHAD 相区
                </span>
                <ChevronRight size={15} />
                <span>
                  <b>03</b>析出 / 组织模型
                </span>
                <ChevronRight size={15} />
                <span>
                  <b>04</b>性能与风险
                </span>
              </div>
              <div className="explain-factor-grid" aria-label="性能可解释分解">
                <div>
                  <strong>强度</strong>
                  <span>析出相 + 晶粒 / 位错强化</span>
                </div>
                <div>
                  <strong>导电率</strong>
                  <span>固溶散射 ↓ + 析出回收</span>
                </div>
                <div>
                  <strong>延伸率</strong>
                  <span>相界面与缺陷均匀性</span>
                </div>
                <div>
                  <strong>松弛</strong>
                  <span>析出稳定性 + 位错回复</span>
                </div>
              </div>
              <div className="physics-foot">
                <Workflow size={15} />
                <span>
                  <strong>物理解释：</strong>
                  {selected.physics.explanation}{' '}
                  所有数值为演示接口，可替换为你们的 CALPHAD、DFT 和实验数据库。
                </span>
              </div>
            </section>

            <div className="detail-grid">
              <section
                className="detail-card panel"
                aria-labelledby="composition-heading"
              >
                <div className="card-heading">
                  <div>
                    <p className="eyebrow">03 / COMPOSITION WINDOW</p>
                    <h3 id="composition-heading">成分窗口 · {selected.id}</h3>
                  </div>
                  <span className="unit-label">mass %</span>
                </div>
                <p className="card-description">
                  当前方案的独立成分窗口；点击上方候选卡片，元素组合与局部响应会同步切换。
                </p>
                <div className="composition-table-wrap">
                  <table className="composition-table">
                    <thead>
                      <tr>
                        <th>元素</th>
                        <th>下限</th>
                        <th>目标</th>
                        <th>上限</th>
                        <th>局部响应（演示）</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.composition.map((entry) => (
                        <tr key={entry.element}>
                          <td>
                            {entry.element}
                            <small className="composition-role">
                              {entry.role}
                            </small>
                          </td>
                          <td>{entry.lower}</td>
                          <td className="target-cell">{entry.target}</td>
                          <td>{entry.upper}</td>
                          <td className="local-response-cell">
                            {entry.localResponses.map((response) => (
                              <span
                                className={`local-response ${response.tone}`}
                                key={`${entry.element}-${response.delta}-${response.metric}`}
                                title={`物理依据：${response.basis}`}
                              >
                                <b>{response.delta}</b>
                                <span>→</span>
                                <strong>
                                  {response.metric} {response.effect}
                                </strong>
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-note">
                  <span className="range-legend">
                    <i /> 推荐窗口
                  </span>
                  <span>固定其余成分与工艺 · wt.% 局部微扰示意</span>
                </div>
              </section>
              <section
                className="detail-card panel"
                aria-labelledby="performance-heading"
              >
                <div className="card-heading">
                  <div>
                    <p className="eyebrow">04 / PERFORMANCE BALANCE</p>
                    <h3 id="performance-heading">性能预测</h3>
                  </div>
                  <span className="unit-label">预测值 / 目标</span>
                </div>
                <div className="prediction-grid">
                  <div className="prediction-metric">
                    <span>
                      <Gauge size={17} /> 抗拉强度
                    </span>
                    <strong>
                      {selected.strength} <small>/ {strengthTarget} MPa</small>
                    </strong>
                    <i
                      style={{
                        width: `${Math.min(100, (selected.strength / 1000) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="prediction-metric">
                    <span>
                      <Zap size={17} /> 导电率
                    </span>
                    <strong>
                      {selected.conductivity}{' '}
                      <small>/ {conductivityTarget}% IACS</small>
                    </strong>
                    <i
                      className="teal-bar"
                      style={{
                        width: `${Math.min(100, selected.conductivity * 1.5)}%`,
                      }}
                    />
                  </div>
                  <div className="prediction-metric">
                    <span>
                      <Activity size={17} /> 延伸率
                    </span>
                    <strong>
                      {selected.elongation}{' '}
                      <small>/ ≥ {elongationTarget}%</small>
                    </strong>
                    <i
                      className="violet-bar"
                      style={{
                        width: `${Math.min(100, selected.elongation * 5)}%`,
                      }}
                    />
                  </div>
                  <div className="prediction-metric">
                    <span>
                      <RefreshCw size={17} /> 应力松弛
                    </span>
                    <strong>
                      {selected.stressRelaxation}%{' '}
                      <small>/ 目标 {relaxationTarget}</small>
                    </strong>
                    <i
                      className="green-bar"
                      style={{
                        width: `${Math.max(18, 100 - selected.stressRelaxation * 9)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="performance-visuals">
                  <div className="visual-card stress-visual">
                    <div className="visual-heading">
                      <span>
                        <Activity size={15} /> 应力–应变曲线
                      </span>
                      <small>工程曲线示意</small>
                    </div>
                    <svg
                      viewBox="0 0 420 190"
                      role="img"
                      aria-label={`${selected.name} 工程应力–应变示意曲线`}
                    >
                      <g className="curve-grid">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <line
                            key={`stress-y-${index}`}
                            x1="38"
                            x2="382"
                            y1={30 + index * 33.5}
                            y2={30 + index * 33.5}
                          />
                        ))}
                        {[0, 1, 2, 3, 4].map((index) => (
                          <line
                            key={`stress-x-${index}`}
                            x1={38 + index * 86}
                            x2={38 + index * 86}
                            y1="30"
                            y2="164"
                          />
                        ))}
                      </g>
                      <line
                        className="curve-axis"
                        x1="38"
                        x2="382"
                        y1="164"
                        y2="164"
                      />
                      <line
                        className="curve-axis"
                        x1="38"
                        x2="38"
                        y1="30"
                        y2="164"
                      />
                      <line
                        className="curve-target"
                        x1="38"
                        x2={fracturePoint.x}
                        y1={164 - (strengthTarget / stressMax) * 134}
                        y2={164 - (strengthTarget / stressMax) * 134}
                      />
                      <line
                        className="curve-proof-guide"
                        x1={proofPoint.x}
                        x2={proofPoint.x}
                        y1="30"
                        y2="164"
                      />
                      <line
                        className="curve-fracture-guide"
                        x1={fracturePoint.x}
                        x2={fracturePoint.x}
                        y1="30"
                        y2="164"
                      />
                      <path d={stressPath} className="stress-line" />
                      <circle
                        cx={proofPoint.x}
                        cy={proofPoint.y}
                        r="3.5"
                        className="stress-proof"
                      />
                      <circle
                        cx={uniformPoint.x}
                        cy={uniformPoint.y}
                        r="4.5"
                        className="stress-peak"
                      />
                      <circle
                        cx={fracturePoint.x}
                        cy={fracturePoint.y}
                        r="4"
                        className="stress-fracture"
                      />
                      <g className="curve-labels">
                        <text x="34" y="28" textAnchor="end">
                          σ / MPa
                        </text>
                        {[0, 1, 2, 3, 4].map((index) => (
                          <text
                            key={`stress-label-${index}`}
                            x="34"
                            y={164 - index * 33.5 + 3}
                            textAnchor="end"
                          >
                            {Math.round((stressMax * index) / 4)}
                          </text>
                        ))}
                        <text x="382" y="182" textAnchor="end">
                          ε / %
                        </text>
                        <text
                          x="42"
                          y={164 - (strengthTarget / stressMax) * 134 - 5}
                        >
                          目标 {strengthTarget}
                        </text>
                        <text
                          x={Math.min(proofPoint.x + 6, 92)}
                          y={proofPoint.y - 7}
                        >
                          σy（示意）
                        </text>
                        <text
                          x={Math.min(uniformPoint.x + 6, 330)}
                          y={uniformPoint.y - 8}
                        >
                          UTS {selected.strength}
                        </text>
                        <text
                          x={Math.min(fracturePoint.x + 6, 350)}
                          y={Math.min(fracturePoint.y + 18, 160)}
                        >
                          断裂 {fractureStrain}%
                        </text>
                        <text x="42" y="178">
                          0
                        </text>
                        <text x="124" y="178">
                          {Math.round(strainMax * 0.25)}
                        </text>
                        <text x="210" y="178">
                          {Math.round(strainMax * 0.5)}
                        </text>
                        <text x="296" y="178">
                          {Math.round(strainMax * 0.75)}
                        </text>
                        <text x="374" y="178">
                          {strainMax}
                        </text>
                      </g>
                    </svg>
                    <p className="visual-caption">
                      工程应力–应变示意：弹性 / 连续屈服 → 加工硬化 → 颈缩 →
                      断裂；参数待拉伸试验标定。
                    </p>
                  </div>
                  <div className="visual-card conductivity-visual">
                    <div className="visual-heading">
                      <span>
                        <Zap size={15} /> 导电率–时效时间曲线
                      </span>
                      <small>
                        {aging.temperature}°C 时效 ·{' '}
                        {aging.measurementTemperature}°C 测量 · % IACS
                      </small>
                    </div>
                    <svg
                      className="aging-chart"
                      viewBox={`0 0 ${agingChart.width} ${agingChart.height}`}
                      role="img"
                      aria-label={`${selected.name} 在 ${aging.temperature}°C 时效过程中的导电率示意曲线`}
                    >
                      <rect
                        x={agingChart.left}
                        y={agingChart.top}
                        width={agingPlotWidth}
                        height={agingPlotHeight}
                        className="aging-chart-bg"
                      />
                      <g className="aging-grid">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <line
                            key={`aging-y-grid-${index}`}
                            x1={agingChart.left}
                            x2={agingChart.width - agingChart.right}
                            y1={agingChart.top + (index * agingPlotHeight) / 4}
                            y2={agingChart.top + (index * agingPlotHeight) / 4}
                          />
                        ))}
                        {[0, 1, 2, 3, 4].map((index) => (
                          <line
                            key={`aging-x-grid-${index}`}
                            x1={agingChart.left + (index * agingPlotWidth) / 4}
                            x2={agingChart.left + (index * agingPlotWidth) / 4}
                            y1={agingChart.top}
                            y2={agingChart.height - agingChart.bottom}
                          />
                        ))}
                      </g>
                      <rect
                        x={agingWindowX}
                        y={agingChart.top}
                        width={agingWindowWidth}
                        height={agingPlotHeight}
                        className="aging-window"
                      />
                      <polygon
                        points={agingUncertainty}
                        className="aging-uncertainty"
                      />
                      <line
                        className="aging-target"
                        x1={agingChart.left}
                        x2={agingChart.width - agingChart.right}
                        y1={agingTargetY}
                        y2={agingTargetY}
                      />
                      <line
                        className="aging-marker precipitate"
                        x1={agingScaleX(aging.precipitationStart)}
                        x2={agingScaleX(aging.precipitationStart)}
                        y1={agingChart.top}
                        y2={agingChart.height - agingChart.bottom}
                      />
                      <line
                        className="aging-marker peak"
                        x1={agingScaleX(aging.peakTime)}
                        x2={agingScaleX(aging.peakTime)}
                        y1={agingChart.top}
                        y2={agingChart.height - agingChart.bottom}
                      />
                      <line
                        className="aging-marker overage"
                        x1={agingScaleX(aging.overageStart)}
                        x2={agingScaleX(aging.overageStart)}
                        y1={agingChart.top}
                        y2={agingChart.height - agingChart.bottom}
                      />
                      <path d={agingPath} className="aging-line" />
                      {aging.points.map(([time, value], index) => (
                        <circle
                          key={`aging-point-${index}`}
                          cx={agingScaleX(time)}
                          cy={agingScaleY(value)}
                          r={time === agingPeakPoint[0] ? 4 : 3}
                          className={`aging-point ${time === agingPeakPoint[0] ? 'peak' : ''}`}
                        />
                      ))}
                      <g className="aging-labels">
                        <text
                          x={agingChart.left - 5}
                          y={agingChart.top - 8}
                          textAnchor="end"
                        >
                          % IACS
                        </text>
                        {[0, 1, 2, 3, 4].map((index) => (
                          <text
                            key={`aging-y-label-${index}`}
                            x={agingChart.left - 6}
                            y={
                              agingChart.top + (index * agingPlotHeight) / 4 + 3
                            }
                            textAnchor="end"
                          >
                            {Math.round(
                              agingYMax - ((agingYMax - agingYMin) * index) / 4,
                            )}
                          </text>
                        ))}
                        {[0, 1, 2, 3, 4].map((index) => (
                          <text
                            key={`aging-x-label-${index}`}
                            x={agingChart.left + (index * agingPlotWidth) / 4}
                            y={agingChart.height - agingChart.bottom + 16}
                            textAnchor="middle"
                          >
                            {Math.round((agingTimeMax * index) / 4)}
                          </text>
                        ))}
                        <text
                          x={agingChart.width / 2}
                          y={agingChart.height - 5}
                          textAnchor="middle"
                        >
                          时效时间 / h
                        </text>
                        <text
                          x={agingChart.width - agingChart.right - 3}
                          y={agingTargetY - 5}
                          textAnchor="end"
                          className="aging-target-label"
                        >
                          目标 {conductivityTarget}
                        </text>
                        <text
                          x={agingScaleX(aging.precipitationStart) + 4}
                          y={agingChart.top + 11}
                          className="aging-marker-label"
                        >
                          析出开始
                        </text>
                        <text
                          x={agingScaleX(aging.peakTime) + 4}
                          y={agingChart.top + 24}
                          className="aging-marker-label peak"
                        >
                          峰值
                        </text>
                        <text
                          x={agingScaleX(aging.overageStart) + 4}
                          y={agingChart.top + 37}
                          className="aging-marker-label overage"
                        >
                          过时效起点
                        </text>
                        <text
                          x={agingWindowX + agingWindowWidth / 2}
                          y={agingChart.height - agingChart.bottom - 5}
                          textAnchor="middle"
                          className="aging-window-label"
                        >
                          推荐窗口
                        </text>
                      </g>
                    </svg>
                    <p className="visual-caption">
                      {selected.name}：{aging.temperature}°C
                      时效；导电率随析出消耗固溶原子而恢复。阴影为预测不确定度，曲线、目标线与推荐窗口均为示意，需用{' '}
                      {aging.measurementTemperature}°C 实测数据校准。
                      {aging.note}
                    </p>
                  </div>
                </div>
                <div className="prediction-callout">
                  <Sparkles size={16} />
                  <span>
                    {selected.name}：析出强化 +
                    晶粒/位错强化支撑强度；固溶散射与缺陷回复共同决定导电率和延伸率。
                  </span>
                </div>
              </section>
            </div>

            <div className="detail-grid lower-grid">
              <section
                className="detail-card panel process-card"
                aria-labelledby="process-heading"
              >
                <div className="card-heading">
                  <div>
                    <p className="eyebrow">05 / PROCESS ROUTE</p>
                    <h3 id="process-heading">工艺路线建议 · {selected.id}</h3>
                  </div>
                  <span className="route-pill">独立工艺</span>
                </div>
                <div className="process-timeline">
                  {selected.processSteps.map((step, index) => (
                    <div className="timeline-item" key={step.label}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{step.label}</strong>
                      <small>{step.detail}</small>
                    </div>
                  ))}
                </div>
                <p className="route-note">
                  <FlaskConical size={15} /> {selected.route}
                </p>
              </section>
              <section
                className="detail-card panel reasoning-card"
                aria-labelledby="reasoning-heading"
              >
                <div className="card-heading">
                  <div>
                    <p className="eyebrow">06 / MODEL EXPLANATION</p>
                    <h3 id="reasoning-heading">推荐依据与可解释性</h3>
                  </div>
                  <span className="explanation-badge">
                    <ShieldCheck size={14} /> 可解释
                  </span>
                </div>
                <p className="reasoning-copy">
                  {selected.physics.explanation} 模型将强度拆解为析出强化、晶粒
                  /
                  位错强化，将导电率拆解为固溶原子散射与析出回收，并用高温位错回复解释应力松弛。
                </p>
                <div className="risk-block">
                  <div className="risk-heading">
                    <span className="risk-icon">!</span>
                    <span>设计风险与下一步</span>
                  </div>
                  <p>
                    当前方案的主要验证重点：{selected.physics.precipitate}{' '}
                    相组成、{selected.physics.window}{' '}
                    时效窗口，以及目标延伸率与应力松弛在试样上的一致性。
                  </p>
                </div>
              </section>
            </div>

            <section className="loop-card panel" aria-labelledby="loop-heading">
              <div className="loop-icon">
                <Database size={24} />
              </div>
              <div>
                <p className="eyebrow">EXPERIMENT–MODEL ITERATION</p>
                <h3 id="loop-heading">实验数据回流与候选空间更新</h3>
                <p>
                  将性能、显微组织、工艺与失效数据回流至数据底座，用于更新模型参数、适用域与下一轮验证优先级。
                </p>
              </div>
              <div className="loop-stats">
                <span>
                  <strong>5</strong>
                  <small>套候选路线</small>
                </span>
                <span>
                  <strong>2</strong>
                  <small>套优先验证</small>
                </span>
                <span>
                  <strong>1</strong>
                  <small>个数据回流闭环</small>
                </span>
              </div>
            </section>
            <div className="source-strip">
              <Search size={14} /> 数据底座：历史研发记录 · 文献专利 · CALPHAD /
              DFT · 实验与表征回流 <span>·</span> <ShieldCheck size={14} />{' '}
              示例数据｜未接入生产数据
            </div>
          </section>
        </div>
      </div>
      <footer className="footer-bar">
        <span>COPPER / LAB · 铜合金成分与工艺设计辅助原型</span>
        <span>数据状态：演示数据 · 版本 0.1</span>
      </footer>
    </main>
  );
}
