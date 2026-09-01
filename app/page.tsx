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
  Layers,
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
  relaxation: number;
  cost: string;
  novelty: string;
  risk: string;
  route: string;
  color: string;
};

const candidates: Candidate[] = [
  { id: 'CU-01', name: 'Cu-Cr-Zr · 析出强化', family: '高强高导基线', summary: '在成熟 Cu-Cr-Zr 体系上优化 Cr/Zr 比例与双级时效窗口。', strength: 928, conductivity: 48.6, elongation: 13.5, relaxation: 86, cost: '1.08×', novelty: '★★☆', risk: '低', route: '固溶 980°C → 快冷 → 450°C / 2h 时效', color: 'copper' },
  { id: 'CU-02', name: 'Cu-Ni-Si · 复合析出', family: '平衡性能路线', summary: '利用 Ni-Si 析出相与微量 Zr 协同，兼顾导电率和应力松弛。', strength: 914, conductivity: 51.2, elongation: 16.2, relaxation: 91, cost: '1.12×', novelty: '★★★', risk: '中', route: '固溶 930°C → 冷轧 60% → 400°C / 4h 时效', color: 'teal' },
  { id: 'CU-03', name: 'Cu-Cr-Zr + 梯度组织', family: '发散探索路线', summary: '用多级变形构建表层细晶与芯部高导的梯度组织，探索新窗口。', strength: 956, conductivity: 46.8, elongation: 11.8, relaxation: 88, cost: '1.19×', novelty: '★★★★', risk: '中高', route: '固溶 → 多级冷轧 → 短时退火 → 峰值时效', color: 'violet' },
];

const compositionRows = [
  ['Cr', '0.15', '0.32', '0.55', '析出强化'],
  ['Zr', '0.03', '0.08', '0.15', '晶粒细化'],
  ['Ni', '0.20', '0.65', '1.10', '导电率平衡'],
  ['Si', '0.15', '0.45', '0.80', '复合析出'],
  ['Mg', '0.00', '0.08', '0.20', '成本/强度'],
];

const routes = [
  ['01', 'Cu-Cr-Zr 微合金化', '成熟基线', '可制造性高'],
  ['02', '析出相与热处理窗口重构', '强度↑↑', '风险可控'],
  ['03', '组织梯度 + 多级变形', '新颖性高', '验证成本中'],
  ['04', '跨体系元素迁移（Ni-Si / Co）', '探索性强', '需机理复核'],
  ['05', '成本与规模化优先', '成本↓', '适合放大'],
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
        <div className="topbar-context"><span className="context-dot" /><span>本地演示模型</span><span className="divider" /><span>设计任务 / CU-04</span></div>
        <div className="topbar-actions">
          <button className="icon-button" type="button" onClick={resetDemo} title="恢复演示任务" aria-label="恢复演示任务"><RotateCcw size={17} /></button>
          <button className="ghost-button" type="button"><Download size={15} /> 导出演示</button>
          <div className="avatar" aria-label="当前用户 Materials Engineer">ME</div>
        </div>
      </header>

      <div id="top" className="workspace">
        <section className="intro-row" aria-labelledby="page-title">
          <div><p className="eyebrow">COPPER ALLOY / DESIGN LOOP 04</p><h1 id="page-title">从目标性能，反推铜合金成分与工艺。</h1><p className="intro-copy">输入高强、高导、延伸率、应力松弛与制造边界，快速生成可解释、可验证的铜合金候选方案。</p></div>
          <div className={`model-note ${generated ? 'model-note-ready' : ''}`}><span className="model-note-label">当前状态</span><strong>{generated ? '已生成 10 条候选路线' : '等待一次新的约束匹配'}</strong><span>{generated ? '演示结果已更新 · 可继续调整约束' : '静态演示数据 · 待接入预测模型'}</span></div>
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
            <article className="recommendation-card panel"><div className="recommendation-topline"><span className="recommendation-label">TOP MATCH / 01</span><span>基于当前设计边界</span></div><div className="recommendation-main"><div><h3>{selected.name}</h3><p>{selected.summary}</p></div><div className="selection-note"><span>当前方案</span><strong>满足 {strengthTarget} MPa / {conductivityTarget}% IACS</strong><small>延伸率 ≥ {elongationTarget}% · 可继续校核</small></div></div><div className="recommendation-meta"><span><i className="meta-dot copper" /><strong>{selected.family}</strong></span><span><i className="meta-dot green" /><strong>延伸率 ≥ {elongationTarget}%</strong></span><span><i className="meta-dot yellow" /><strong>应力松弛 {relaxationTarget}</strong></span><span>建议优先验证 3 项</span></div></article>

            <section className="candidate-section" aria-labelledby="candidate-heading"><div className="section-title-row"><div><p className="eyebrow">CANDIDATE SET</p><h3 id="candidate-heading">候选方案 <span>03</span></h3></div><span className="candidate-order-note">点击卡片查看细节</span></div><div className="candidate-list">{candidates.map((candidate) => <button key={candidate.id} type="button" className={`candidate-card panel ${selectedId === candidate.id ? 'selected' : ''}`} onClick={() => setSelectedId(candidate.id)}><span className={`candidate-index ${candidate.color}`}>{candidate.id.replace('CU-', '')}</span><span className="candidate-body"><strong>{candidate.name}</strong><small>{candidate.summary}</small><span className="candidate-tags"><em>{candidate.novelty} 新颖性</em><em>{candidate.risk}风险</em><em>{candidate.cost}</em></span></span><span className="candidate-metric"><strong>{candidate.strength}</strong><small>MPa</small><b>{candidate.conductivity}%</b><small>IACS</small><i>A {candidate.elongation}%</i></span><ChevronRight size={18} className="candidate-arrow" /></button>)}</div></section>

            <section className="divergence-card panel" aria-labelledby="divergence-heading"><div className="card-heading"><div><p className="eyebrow">DIVERGENT DESIGN SPACE</p><h3 id="divergence-heading">发散式路线生成</h3></div><span className="explanation-badge"><Sparkles size={14} /> 10 条候选</span></div><p className="card-description">同一研发目标下，模型从成分、组织、工艺和成本四个方向展开探索，再交给物理模型收敛。</p><div className="route-grid">{routes.map(([number, title, tag, note]) => <div className="route-chip" key={number}><span>{number}</span><strong>{title}</strong><small>{tag} · {note}</small></div>)}</div><div className="divergence-footer"><span><Layers size={15} /> 差异性：成分｜组织｜工艺｜成本</span><span><Activity size={15} /> 输出：新颖性、性能、机理、风险、验证成本</span></div></section>

            <section className="physics-card panel" aria-labelledby="physics-heading">
              <div className="card-heading"><div><p className="eyebrow">THERMODYNAMIC + PHYSICS LENS</p><h3 id="physics-heading">热力学与物理约束</h3></div><span className="explanation-badge"><ShieldCheck size={14} /> 可解释预测</span></div>
              <p className="card-description">候选方案先经过相平衡、析出驱动力和工艺窗口筛选，再输出强度、导电率与应力松弛预测，避免只给出“黑箱最优解”。</p>
              <div className="physics-metrics">
                <div className="physics-metric"><span><Atom size={15} /> 稳定基体相</span><strong>FCC-Cu</strong><small>α-Cu 基体 · 单相稳定区</small></div>
                <div className="physics-metric"><span><Sparkles size={15} /> 析出驱动力</span><strong>0.78</strong><small>相对驱动力指数 · 450°C</small></div>
                <div className="physics-metric"><span><Thermometer size={15} /> 时效窗口</span><strong>420–480°C</strong><small>细小弥散析出相形成区间</small></div>
                <div className="physics-metric"><span><Scale size={15} /> 性能权衡</span><strong>强度 / 导电率</strong><small>Pareto 前沿 · 3 个可制造解</small></div>
              </div>
              <div className="physics-chain"><span><b>01</b>CALPHAD 相区计算</span><ChevronRight size={15} /><span><b>02</b>析出动力学筛选</span><ChevronRight size={15} /><span><b>03</b>有限元 / 经验模型</span><ChevronRight size={15} /><span><b>04</b>实验结果回流</span></div>
              <div className="physics-foot"><Workflow size={15} /><span>物理筛选将 10 条发散路线收敛为 3 条优先验证路线；参数为演示接口，可替换为你们的 CALPHAD、DFT 和实验数据库。</span></div>
            </section>

            <div className="detail-grid"><section className="detail-card panel" aria-labelledby="composition-heading"><div className="card-heading"><div><p className="eyebrow">03 / COMPOSITION WINDOW</p><h3 id="composition-heading">成分窗口</h3></div><span className="unit-label">mass %</span></div><p className="card-description">目标值用于当前候选方案的推荐点，上下限代表模型建议的可探索区间。</p><div className="composition-table-wrap"><table className="composition-table"><thead><tr><th>元素</th><th>下限</th><th>目标</th><th>上限</th><th>局部响应</th></tr></thead><tbody>{compositionRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={index === 2 ? 'target-cell' : ''}>{cell}</td>)}</tr>)}</tbody></table></div><div className="table-note"><span className="range-legend"><i /> 推荐窗口</span><span>其他元素与工艺条件保持不变</span></div></section>
              <section className="detail-card panel" aria-labelledby="performance-heading"><div className="card-heading"><div><p className="eyebrow">04 / PERFORMANCE BALANCE</p><h3 id="performance-heading">性能预测</h3></div><span className="unit-label">预测值 / 目标</span></div><div className="prediction-grid"><div className="prediction-metric"><span><Gauge size={17} /> 抗拉强度</span><strong>{selected.strength} <small>/ {strengthTarget} MPa</small></strong><i style={{ width: `${Math.min(100, (selected.strength / 1000) * 100)}%` }} /></div><div className="prediction-metric"><span><Zap size={17} /> 导电率</span><strong>{selected.conductivity} <small>/ {conductivityTarget}% IACS</small></strong><i className="teal-bar" style={{ width: `${Math.min(100, selected.conductivity * 1.5)}%` }} /></div><div className="prediction-metric"><span><Activity size={17} /> 延伸率</span><strong>{selected.elongation} <small>/ ≥ {elongationTarget}%</small></strong><i className="violet-bar" style={{ width: `${Math.min(100, selected.elongation * 5)}%` }} /></div><div className="prediction-metric"><span><RefreshCw size={17} /> 应力松弛</span><strong>{100 - selected.relaxation}% <small>/ 目标 ≤ 8%</small></strong><i className="green-bar" style={{ width: `${selected.relaxation}%` }} /></div></div><div className="prediction-callout"><Sparkles size={16} /><span>Cu 基体与 {family} 析出相协同，预计在强度、导电率和延伸率之间取得平衡。</span></div></section></div>

            <div className="detail-grid lower-grid"><section className="detail-card panel process-card" aria-labelledby="process-heading"><div className="card-heading"><div><p className="eyebrow">05 / PROCESS ROUTE</p><h3 id="process-heading">工艺路线建议</h3></div><span className="route-pill">{process.split(' + ')[0]}</span></div><div className="process-timeline"><div className="timeline-item"><span>01</span><strong>均匀化 / 固溶</strong><small>释放过饱和固溶体</small></div><div className="timeline-item"><span>02</span><strong>冷轧 / 变形</strong><small>调控位错与织构</small></div><div className="timeline-item"><span>03</span><strong>峰值时效</strong><small>形成细小弥散析出相</small></div></div><p className="route-note"><FlaskConical size={15} /> {selected.route}</p></section>
              <section className="detail-card panel reasoning-card" aria-labelledby="reasoning-heading"><div className="card-heading"><div><p className="eyebrow">06 / MODEL EXPLANATION</p><h3 id="reasoning-heading">为什么推荐它</h3></div><span className="explanation-badge"><ShieldCheck size={14} /> 可解释</span></div><p className="reasoning-copy">模型优先保留成熟的铜合金工艺窗口，再利用 Ni-Si / Cr-Zr 析出机制调节强度、导电率和应力松弛的平衡点。</p><div className="risk-block"><div className="risk-heading"><span className="risk-icon">!</span><span>设计风险与下一步</span></div><p>建议先验证时效温度对析出相尺寸、导电率和连接件应力松弛的敏感性，再决定是否进入梯度组织路线。</p></div></section></div>

            <section className="loop-card panel" aria-labelledby="loop-heading"><div className="loop-icon"><Database size={24} /></div><div><p className="eyebrow">CLOSED-LOOP LEARNING</p><h3 id="loop-heading">实验结果回流，生成下一轮更有想象力的方案</h3><p>实验数据、显微组织和失效反馈自动回写知识库，持续更新模型的可行性边界。</p></div><div className="loop-stats"><span><strong>10</strong><small>候选路线</small></span><span><strong>3</strong><small>优先验证</small></span><span><strong>1</strong><small>知识闭环</small></span></div></section>
            <div className="source-strip"><Search size={14} /> 数据底座：历史研发记录 · 文献专利 · CALPHAD / DFT · 实验与表征回流 <span>·</span> <ShieldCheck size={14} /> 本地保密演示</div>
          </section>
        </div>
      </div>
      <footer className="footer-bar"><span>COPPER / LAB · 铜合金成分与工艺设计辅助原型</span><span>数据状态：演示数据 · 版本 0.1</span></footer>
    </main>
  );
}
