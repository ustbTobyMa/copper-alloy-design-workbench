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
  composition: string[][];
  processSteps: { label: string; detail: string }[];
  physics: {
    phase: string;
    precipitate: string;
    window: string;
    balance: string;
    driving: string;
    explanation: string;
  };
  color: string;
};

const candidates: Candidate[] = [
  { id: 'CU-01', name: 'Cu-Cr-Zr · 析出强化', family: '高强高导基线', summary: '成熟体系微合金化，优先验证稳定的强度—导电率窗口。', strength: 928, conductivity: 48.6, elongation: 13.5, stressRelaxation: 7.2, cost: '1.08×', novelty: '★★☆', risk: '低', route: '固溶 980°C → 快冷 → 450°C / 2h 时效', composition: [['Cr', '0.15', '0.32', '0.55', '析出强化'], ['Zr', '0.03', '0.08', '0.15', '晶粒细化'], ['Mg', '0.00', '0.05', '0.12', '辅助强化']], processSteps: [{ label: '均匀化 / 固溶', detail: '980°C，释放过饱和固溶体' }, { label: '冷轧 60%', detail: '引入位错与织构' }, { label: '峰值时效', detail: '450°C / 2h，形成细小析出相' }], physics: { phase: 'FCC-Cu', precipitate: 'Cr-rich / Cu₅Zr（候选）', window: '440–465°C', balance: '48.6% IACS', driving: '0.78', explanation: 'Cr 与 Zr 的析出驱动力集中在 440–465°C；细小弥散相钉扎位错，同时保留连续 Cu 基体以维持导电通道。' }, color: 'copper' },
  { id: 'CU-02', name: 'Cu-Ni-Si · 复合析出', family: '平衡性能路线', summary: 'Ni-Si 析出相与微量 Zr 协同，优先改善延伸率与应力松弛。', strength: 914, conductivity: 51.2, elongation: 16.2, stressRelaxation: 6.4, cost: '1.12×', novelty: '★★★', risk: '中', route: '固溶 930°C → 冷轧 60% → 400°C / 4h 时效', composition: [['Ni', '1.00', '1.65', '2.20', 'Ni₂Si 析出'], ['Si', '0.30', '0.55', '0.80', '复合析出'], ['Zr', '0.02', '0.06', '0.12', '抑制粗化'], ['Cr', '0.00', '0.08', '0.20', '协同强化']], processSteps: [{ label: '固溶处理', detail: '930°C，控制初始偏析' }, { label: '冷轧 60%', detail: '调节位错密度与织构' }, { label: '双级时效', detail: '400°C / 4h，稳定 Ni₂Si 析出' }], physics: { phase: 'FCC-Cu', precipitate: 'δ-Ni₂Si', window: '380–420°C', balance: '51.2% IACS', driving: '0.71', explanation: 'Ni₂Si 的析出窗口更宽，可在强度提升后保留较高塑性；Zr 用于抑制析出相粗化，降低长期应力松弛。' }, color: 'teal' },
  { id: 'CU-03', name: 'Cu-Cr-Zr · 梯度组织', family: '组织调控路线', summary: '通过多级变形构建表层细晶与芯部高导的梯度结构。', strength: 956, conductivity: 46.8, elongation: 11.8, stressRelaxation: 7.6, cost: '1.19×', novelty: '★★★★', risk: '中高', route: '固溶 → 多级冷轧 → 短时退火 → 峰值时效', composition: [['Cr', '0.20', '0.40', '0.65', '表层析出'], ['Zr', '0.05', '0.10', '0.18', '细晶稳定'], ['Mg', '0.02', '0.06', '0.15', '位错钉扎']], processSteps: [{ label: '固溶 / 快冷', detail: '970°C，保留过饱和组织' }, { label: '多级冷轧', detail: '30% + 20%，形成梯度应变' }, { label: '短时退火 / 时效', detail: '520°C → 450°C，细化表层晶粒' }], physics: { phase: 'FCC-Cu + 梯度缺陷层', precipitate: 'Cr-rich / Cu₅Zr（候选）', window: '430–460°C', balance: '46.8% IACS', driving: '0.84', explanation: '高缺陷表层提高形核密度，芯部保留较低缺陷以维持导电率；该方案的性能增益来自组织梯度而非单纯提高合金化量。' }, color: 'violet' },
  { id: 'CU-04', name: 'Cu-Co-Si-Ti · 跨体系迁移', family: '非常规元素组合', summary: '迁移 Co-Si 析出机制，探索高温稳定性与抗松弛的组合窗口。', strength: 938, conductivity: 47.6, elongation: 14.2, stressRelaxation: 6.8, cost: '1.24×', novelty: '★★★★', risk: '高', route: '固溶 960°C → 热/冷复合轧制 → 430°C / 3h 时效', composition: [['Co', '0.55', '0.70', '0.90', 'Co₂Si 候选'], ['Si', '0.14', '0.20', '0.26', '析出驱动'], ['Ti', '0.02', '0.04', '0.06', '异质形核'], ['Zr', '0.01', '0.02', '0.04', '抑制粗化']], processSteps: [{ label: '固溶处理', detail: '960°C，均匀化元素分布' }, { label: '热 / 冷复合轧制', detail: '控制织构与残余应力' }, { label: '稳定化时效', detail: '430°C / 3h，验证高温保持率' }], physics: { phase: 'FCC-Cu', precipitate: 'Co–Si 富集相（候选 Co₂Si）', window: '450–500°C', balance: '47.6% IACS', driving: '0.61', explanation: '模型假设 Co–Si 纳米析出相提高粗化温度，Ti 作为异质形核核心；该跨体系组合尚需 DFT / 相场和相组成实验复核。' }, color: 'blue' },
  { id: 'CU-05', name: 'Cu-Mg-Si · 规模化优先', family: '低成本可制造路线', summary: '以低成本元素和连续挤压为主，牺牲部分强度换取延伸率与放大能力。', strength: 882, conductivity: 53.5, elongation: 18.6, stressRelaxation: 8.4, cost: '0.96×', novelty: '★★★', risk: '低', route: '连续挤压 → 70% 冷轧 → 380°C / 2h 时效', composition: [['Mg', '0.10', '0.28', '0.50', 'Mg₂Si 析出'], ['Si', '0.05', '0.12', '0.22', '析出配平'], ['Ti', '0.02', '0.06', '0.12', '晶粒细化']], processSteps: [{ label: '连续挤压', detail: '近净成形，降低制造成本' }, { label: '冷轧 70%', detail: '获得均匀加工硬化' }, { label: '低温时效', detail: '380°C / 2h，平衡塑性与强度' }], physics: { phase: 'FCC-Cu', precipitate: 'β′-Mg₂Si / Ti-rich 细化相', window: '360–400°C', balance: '53.5% IACS', driving: '0.59', explanation: 'Mg-Si 析出消耗部分固溶原子，降低电子散射并保留较高导电率；物理筛选显示其强度不足以满足当前目标，适合作为成本对照路线。' }, color: 'cost' },
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

  const selected = useMemo(() => candidates.find((item) => item.id === selectedId) ?? candidates[0], [selectedId]);
  const relaxationLimit = Number(relaxationTarget.match(/\d+/)?.[0] ?? 8);
  const meetsTargets = selected.strength >= strengthTarget && selected.conductivity >= conductivityTarget && selected.elongation >= elongationTarget && selected.stressRelaxation <= relaxationLimit;

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
        <a className="brand" href="#top" aria-label="回到铜合金工作台首页">
          <span className="brand-mark"><span>Cu</span></span>
          <span><strong>COPPER / LAB</strong><small>铜合金设计工作台</small></span>
        </a>
        <div className="topbar-context"><span className="context-dot" /><span>本地演示模型</span><span className="divider" /><span>设计任务 / {selected.id}</span></div>
        <div className="topbar-actions">
          <button className="icon-button" type="button" onClick={resetDemo} title="恢复演示任务" aria-label="恢复演示任务"><RotateCcw size={17} /></button>
          <button className="ghost-button" type="button"><Download size={15} /> 导出演示</button>
          <div className="avatar" aria-label="当前用户 Materials Engineer">ME</div>
        </div>
      </header>

      <div id="top" className="workspace">
        <section className="intro-row" aria-labelledby="page-title">
          <div><p className="eyebrow">COPPER ALLOY / DESIGN LOOP 04</p><h1 id="page-title">从目标性能，反推铜合金成分与工艺。</h1><p className="intro-copy">输入高强、高导、延伸率、应力松弛与制造边界，快速生成可解释、可验证的铜合金候选方案。</p></div>
          <div className={`model-note ${generated ? 'model-note-ready' : ''}`}><span className="model-note-label">当前状态</span><strong>{generated ? '物理筛选完成 · 5 套独立方案' : '等待一次新的约束匹配'}</strong><span>{generated ? '成分、工艺与物理证据已同步' : '静态演示数据 · 待接入预测模型'}</span></div>
        </section>

        <div className="workspace-grid">
          <aside className="brief-panel panel" aria-labelledby="brief-heading">
            <div className="panel-heading"><div><p className="eyebrow">01 / DESIGN BRIEF</p><h2 id="brief-heading">设计目标</h2></div><span className="step-tag">输入约束</span></div>
            <form className="brief-form" onSubmit={handleGenerate}>
              <label className="field-label" htmlFor="task-name">任务名称</label>
              <input className="text-input" id="task-name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
              <label className="field-label" htmlFor="family">合金体系</label>
              <select className="select-input" id="family" value={family} onChange={(e) => setFamily(e.target.value)}><option>Cu-Cr-Zr</option><option>Cu-Ni-Si</option><option>Cu-Co-Si</option><option>Cu-Mg</option></select>
              <fieldset className="field-group"><legend className="field-label">应用场景</legend><div className="choice-grid">{['高频连接器', '弹性接触件', '新能源汽车导电件', '耐蚀换热件'].map((item, index) => <label key={item} className={`choice-card ${scenario === item ? 'active' : ''}`}><input type="radio" name="scenario" value={item} checked={scenario === item} onChange={() => setScenario(item)} /><span className="choice-code">{['RF', 'EL', 'EV', 'HX'][index]}</span><span>{item}</span><small>{['高频 · 高导', '高强 · 抗松弛', '轻量 · 低损耗', '耐热 · 耐蚀'][index]}</small></label>)}</div></fieldset>
              <div className="form-divider"><span>服役目标</span><span>02</span></div>
              <div className="input-pair"><div><label className="field-label" htmlFor="strength">抗拉强度</label><div className="unit-input"><input id="strength" type="number" value={strengthTarget} onChange={(e) => setStrengthTarget(Number(e.target.value))} /><span>MPa</span></div></div><div><label className="field-label" htmlFor="conductivity">导电率</label><div className="unit-input"><input id="conductivity" type="number" value={conductivityTarget} onChange={(e) => setConductivityTarget(Number(e.target.value))} /><span>% IACS</span></div></div></div>
              <label className="field-label" htmlFor="elongation">延伸率目标</label><div className="unit-input"><input id="elongation" type="number" value={elongationTarget} min={5} max={35} step={0.5} onChange={(e) => setElongationTarget(Number(e.target.value))} /><span>%</span></div>
              <label className="field-label" htmlFor="relaxation">应力松弛目标</label><select className="select-input" id="relaxation" value={relaxationTarget} onChange={(e) => setRelaxationTarget(e.target.value)}><option>≤ 8% / 1000h</option><option>≤ 10% / 1000h</option><option>≤ 12% / 1000h</option></select>
              <div className="form-divider"><span>制造边界</span><span>03</span></div>
              <label className="field-label" htmlFor="process">目标工艺路线</label><select className="select-input" id="process" value={process} onChange={(e) => setProcess(e.target.value)}><option>固溶 + 冷轧 + 时效</option><option>连续挤压 + 峰值时效</option><option>多级变形 + 短时退火</option></select>
              <label className="field-label" htmlFor="cost">成本边界</label><select className="select-input" id="cost" value={cost} onChange={(e) => setCost(e.target.value)}><option>≤ 1.20×基准</option><option>≤ 1.10×基准</option><option>优先规模化成本</option></select>
              <div className="constraint-meter"><span><strong>13</strong> 项约束已锁定</span><span className="meter-track"><i /></span></div>
              <button className="primary-button" type="submit"><span className="button-pulse" /><span>{generated ? '重新生成候选方案' : '生成推荐方案'}</span><ChevronRight size={17} /></button>
            </form>
            <p className="panel-footnote"><Info size={14} /><span>当前结果用于演示工作流，不替代材料试验、标准校核或工程判断。</span></p>
          </aside>

          <section className="results-column" aria-labelledby="results-heading">
            <div className="results-header"><div><p className="eyebrow">02 / RECOMMENDATION OUTPUT</p><h2 id="results-heading">推荐结果</h2></div><div className="result-status" role="status" aria-live="polite"><span className={`status-light ${generated ? 'ready' : ''}`} /><span>{generated ? '约束匹配完成' : '等待约束匹配'}</span></div></div>
            <article className="recommendation-card panel"><div className="recommendation-topline"><span className="recommendation-label">TOP MATCH / {selected.id.replace('CU-', '')}</span><span>基于当前设计边界</span></div><div className="recommendation-main"><div><h3>{selected.name}</h3><p>{selected.summary}</p></div><div className="selection-note"><span>物理筛选结论</span><strong>{meetsTargets ? '目标约束通过' : '存在待验证约束'}</strong><small>{selected.strength} MPa · {selected.conductivity}% IACS · A {selected.elongation}%</small></div></div><div className="recommendation-meta"><span><i className="meta-dot copper" /><strong>{selected.family}</strong></span><span><i className="meta-dot green" /><strong>延伸率 ≥ {elongationTarget}%</strong></span><span><i className="meta-dot yellow" /><strong>应力松弛 {selected.stressRelaxation}% / {relaxationTarget}</strong></span><span>建议优先验证：{selected.risk === '低' ? '低成本小试' : '相组成与窗口'}</span></div></article>

            <section className="physics-card panel" aria-labelledby="physics-heading">
              <div className="card-heading"><div><p className="eyebrow">THERMODYNAMIC + PHYSICS LENS</p><h3 id="physics-heading">热力学与物理约束</h3></div><span className="explanation-badge"><ShieldCheck size={14} /> 当前方案可解释</span></div>
              <p className="card-description">当前选中方案先经过相平衡、析出驱动力和工艺窗口筛选，再输出性能预测；切换候选卡片，下面的物理证据会同步变化。</p>
              <div className="physics-metrics">
                <div className="physics-metric"><span><Atom size={15} /> 稳定基体相</span><strong>{selected.physics.phase}</strong><small>CALPHAD 稳定区 · 演示结果</small></div>
                <div className="physics-metric"><span><Sparkles size={15} /> 主析出相</span><strong>{selected.physics.precipitate}</strong><small>析出相类型 · 需实验确认</small></div>
                <div className="physics-metric"><span><Thermometer size={15} /> 析出窗口</span><strong>{selected.physics.window}</strong><small>动力学推荐温区</small></div>
                <div className="physics-metric"><span><Scale size={15} /> 析出驱动力</span><strong>ΔG {selected.physics.driving}</strong><small>相对指数 · 越高越易形核</small></div>
              </div>
              <div className="physics-chain"><span><b>01</b>目标约束</span><ChevronRight size={15} /><span><b>02</b>CALPHAD 相区</span><ChevronRight size={15} /><span><b>03</b>析出 / 组织模型</span><ChevronRight size={15} /><span><b>04</b>性能与风险</span></div>
              <div className="explain-factor-grid" aria-label="性能可解释分解"><div><strong>强度</strong><span>析出相 + 晶粒 / 位错强化</span></div><div><strong>导电率</strong><span>固溶散射 ↓ + 析出回收</span></div><div><strong>延伸率</strong><span>相界面与缺陷均匀性</span></div><div><strong>松弛</strong><span>析出稳定性 + 位错回复</span></div></div>
              <div className="physics-foot"><Workflow size={15} /><span><strong>物理解释：</strong>{selected.physics.explanation} 所有数值为演示接口，可替换为你们的 CALPHAD、DFT 和实验数据库。</span></div>
            </section>

            <section className="candidate-section" aria-labelledby="candidate-heading"><div className="section-title-row"><div><p className="eyebrow">CANDIDATE SET</p><h3 id="candidate-heading">候选方案 <span>05</span></h3></div><span className="candidate-order-note">每个方案拥有独立成分与工艺 · 点击切换物理证据</span></div><div className="candidate-list">{candidates.map((candidate) => { const pass = candidate.strength >= strengthTarget && candidate.conductivity >= conductivityTarget && candidate.elongation >= elongationTarget && candidate.stressRelaxation <= relaxationLimit; return <button key={candidate.id} type="button" className={`candidate-card panel ${selectedId === candidate.id ? 'selected' : ''}`} onClick={() => setSelectedId(candidate.id)}><span className={`candidate-index ${candidate.color}`}>{candidate.id.replace('CU-', '')}</span><span className="candidate-body"><strong>{candidate.name}</strong><small>{candidate.summary}</small><span className="candidate-spec"><b>成分</b> {candidate.composition.map((row) => `${row[0]} ${row[2]}`).join(' · ')}</span><span className="candidate-spec"><b>工艺</b> {candidate.processSteps.map((step) => step.label).join(' → ')}</span><span className="candidate-tags"><em>{candidate.novelty} 新颖性</em><em>{candidate.risk}风险</em><em>{candidate.cost}</em><em className={pass ? 'pass-tag' : 'hold-tag'}>{pass ? '约束通过' : '待验证'}</em></span></span><span className="candidate-metric"><strong>{candidate.strength}</strong><small>MPa</small><b>{candidate.conductivity}%</b><small>IACS</small><i>A {candidate.elongation}%</i></span><ChevronRight size={18} className="candidate-arrow" /></button>})}</div></section>

            <div className="detail-grid"><section className="detail-card panel" aria-labelledby="composition-heading"><div className="card-heading"><div><p className="eyebrow">03 / COMPOSITION WINDOW</p><h3 id="composition-heading">成分窗口 · {selected.id}</h3></div><span className="unit-label">mass %</span></div><p className="card-description">当前方案的独立成分窗口；点击上方候选卡片，元素组合与目标值会同步切换。</p><div className="composition-table-wrap"><table className="composition-table"><thead><tr><th>元素</th><th>下限</th><th>目标</th><th>上限</th><th>局部响应</th></tr></thead><tbody>{selected.composition.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={index === 2 ? 'target-cell' : ''}>{cell}</td>)}</tr>)}</tbody></table></div><div className="table-note"><span className="range-legend"><i /> 推荐窗口</span><span>余量为 Cu · 演示窗口待实验校准</span></div></section>
              <section className="detail-card panel" aria-labelledby="performance-heading"><div className="card-heading"><div><p className="eyebrow">04 / PERFORMANCE BALANCE</p><h3 id="performance-heading">性能预测</h3></div><span className="unit-label">预测值 / 目标</span></div><div className="prediction-grid"><div className="prediction-metric"><span><Gauge size={17} /> 抗拉强度</span><strong>{selected.strength} <small>/ {strengthTarget} MPa</small></strong><i style={{ width: `${Math.min(100, (selected.strength / 1000) * 100)}%` }} /></div><div className="prediction-metric"><span><Zap size={17} /> 导电率</span><strong>{selected.conductivity} <small>/ {conductivityTarget}% IACS</small></strong><i className="teal-bar" style={{ width: `${Math.min(100, selected.conductivity * 1.5)}%` }} /></div><div className="prediction-metric"><span><Activity size={17} /> 延伸率</span><strong>{selected.elongation} <small>/ ≥ {elongationTarget}%</small></strong><i className="violet-bar" style={{ width: `${Math.min(100, selected.elongation * 5)}%` }} /></div><div className="prediction-metric"><span><RefreshCw size={17} /> 应力松弛</span><strong>{selected.stressRelaxation}% <small>/ 目标 {relaxationTarget}</small></strong><i className="green-bar" style={{ width: `${Math.max(18, 100 - selected.stressRelaxation * 9)}%` }} /></div></div><div className="prediction-callout"><Sparkles size={16} /><span>{selected.name}：析出强化 + 晶粒/位错强化支撑强度；固溶散射与缺陷回复共同决定导电率和延伸率。</span></div></section></div>

            <div className="detail-grid lower-grid"><section className="detail-card panel process-card" aria-labelledby="process-heading"><div className="card-heading"><div><p className="eyebrow">05 / PROCESS ROUTE</p><h3 id="process-heading">工艺路线建议 · {selected.id}</h3></div><span className="route-pill">独立工艺</span></div><div className="process-timeline">{selected.processSteps.map((step, index) => <div className="timeline-item" key={step.label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.label}</strong><small>{step.detail}</small></div>)}</div><p className="route-note"><FlaskConical size={15} /> {selected.route}</p></section>
              <section className="detail-card panel reasoning-card" aria-labelledby="reasoning-heading"><div className="card-heading"><div><p className="eyebrow">06 / MODEL EXPLANATION</p><h3 id="reasoning-heading">为什么推荐它</h3></div><span className="explanation-badge"><ShieldCheck size={14} /> 可解释</span></div><p className="reasoning-copy">{selected.physics.explanation} 模型将强度拆解为析出强化、晶粒 / 位错强化，将导电率拆解为固溶原子散射与析出回收，并用高温位错回复解释应力松弛。</p><div className="risk-block"><div className="risk-heading"><span className="risk-icon">!</span><span>设计风险与下一步</span></div><p>当前方案的主要验证重点：{selected.physics.precipitate} 相组成、{selected.physics.window} 时效窗口，以及目标延伸率与应力松弛在试样上的一致性。</p></div></section></div>

            <section className="loop-card panel" aria-labelledby="loop-heading"><div className="loop-icon"><Database size={24} /></div><div><p className="eyebrow">CLOSED-LOOP LEARNING</p><h3 id="loop-heading">实验结果回流，生成下一轮更有想象力的方案</h3><p>实验数据、显微组织和失效反馈自动回写知识库，持续更新模型的可行性边界。</p></div><div className="loop-stats"><span><strong>5</strong><small>独立方案</small></span><span><strong>2</strong><small>优先验证</small></span><span><strong>1</strong><small>知识闭环</small></span></div></section>
            <div className="source-strip"><Search size={14} /> 数据底座：历史研发记录 · 文献专利 · CALPHAD / DFT · 实验与表征回流 <span>·</span> <ShieldCheck size={14} /> 本地保密演示</div>
          </section>
        </div>
      </div>
      <footer className="footer-bar"><span>COPPER / LAB · 铜合金成分与工艺设计辅助原型</span><span>数据状态：演示数据 · 版本 0.1</span></footer>
    </main>
  );
}
