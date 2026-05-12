import React from 'react';

export type VizType =
  | 'vein' | 'excavation' | 'grade' | 'beneficiation' | 'tailings'
  | 'ventilation' | 'hauling' | 'environment' | 'raremetal' | 'geology'
  | 'blast' | 'drainage' | 'reserves' | 'iot' | 'dust'
  | 'price' | 'closure' | 'seabed' | 'recycle' | 'safety' | 'supply';

const VIZ_MAP: Record<string, VizType> = {
  'vein': 'vein', 'survey': 'vein',
  'excavation': 'excavation', 'mining-plan': 'excavation',
  'grade': 'grade', 'ore-grade': 'grade',
  'beneficiation': 'beneficiation', 'mineral-processing': 'beneficiation',
  'tailings': 'tailings', 'dam': 'tailings',
  'ventilation': 'ventilation',
  'hauling': 'hauling', 'fleet': 'hauling', 'truck': 'hauling',
  'environment': 'environment', 'monitoring': 'environment',
  'raremetal': 'raremetal', 'rare': 'raremetal',
  'geological-model': 'geology', 'geological': 'geology', 'geology': 'geology',
  'blast': 'blast', 'blasting': 'blast',
  'drainage': 'drainage', 'water': 'drainage',
  'reserve': 'reserves', 'reserves': 'reserves', 'resource-estimation': 'reserves',
  'iot': 'iot', 'sensor': 'iot',
  'dust': 'dust',
  'price': 'price', 'commodity': 'price',
  'closure': 'closure',
  'seabed': 'seabed', 'deep-sea': 'seabed',
  'recycle': 'recycle', 'recycling': 'recycle',
  'safety': 'safety', 'labor': 'safety',
  'supply': 'supply', 'supplychain': 'supply',
};

export function getVizType(id: string): VizType {
  for (const key of Object.keys(VIZ_MAP)) {
    if (id.includes(key)) return VIZ_MAP[key];
  }
  return 'vein';
}

type VizProps = {
  running: boolean;
  optimized: boolean;
  progress: number;
  optLevel: number;
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
};

const C1 = '#A16207';
const C2 = '#D97706';
const BG = '#0a1628';
const TX = '#f8f9fa';
const MU = '#8e9aaf';

/* ---- vein: ore vein network ---- */
const VeinViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const veins = [[60,80],[120,50],[200,90],[280,60],[340,100],[100,150],[220,160],[310,140]];
  const links: [number,number][] = [[0,1],[1,2],[2,3],[3,4],[0,5],[2,6],[4,7],[5,6],[6,7]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱脈探査AIネットワーク</text>
      {links.map(([a,b],i) => (
        <line key={i} x1={veins[a][0]} y1={veins[a][1]} x2={veins[b][0]} y2={veins[b][1]}
          stroke={optimized ? C2 : MU} strokeWidth={optimized ? 2 : 0.8} opacity={optimized ? 0.6 : 0.2}>
          {running && <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${1.5+i*0.15}s`} repeatCount="indefinite"/>}
        </line>
      ))}
      {veins.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={optimized ? 6 : 4} fill={optimized ? C1 : MU} opacity={optimized ? 0.8 : 0.4}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="r" values="3;7;3" dur={`${1+i*0.12}s`} repeatCount="indefinite"/>}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '有望鉱脈 5箇所特定' : '鉱脈探査待機'}</text>
    </g>
  );
};

/* ---- excavation: pit cross section ---- */
const ExcavationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const benches = [0,1,2,3,4];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">採掘計画最適化</text>
      {benches.map(i => {
        const y = 50+i*30; const w = 300-i*40; const x = 50+i*20;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={x} y={y} width={w} height="25" fill={optimized ? C1 : MU} opacity={optimized ? 0.4-i*0.05 : 0.15} rx="2">
              {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>}
            </rect>
            {optimized && <text x={x+w/2} y={y+16} fill={TX} fontSize="7" textAnchor="middle">{`Bench ${i+1}`}</text>}
          </g>
        );
      })}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '採掘効率 +28%' : '採掘計画待機'}</text>
    </g>
  );
};

/* ---- grade: ore grade prediction curve ---- */
const GradeViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({length:14},(_,i) => {
    const x = 40+i*24;
    const base = optimized ? 120-Math.sin(i*0.6)*40 : 130-i*2;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱石品位予測</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5"/>
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5"/>
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized ? 2 : 1.2} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>}
      </polyline>
      {optimized && <polyline points={pts.map((p,i) => {const [x]=p.split(',');return `${x},${110-Math.cos(i*0.5)*25}`;}).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6"/>}
      <circle cx="40" cy={130} r="3" fill={C1} onClick={() => onNodeClick('0')} style={{cursor:'pointer'}}/>
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '品位予測精度 96.2%' : '品位データ'}</text>
    </g>
  );
};

/* ---- beneficiation: process flow ---- */
const BeneficiationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const stages = [{x:40,label:'破砕'},{x:120,label:'磨鉱'},{x:200,label:'浮選'},{x:280,label:'脱水'},{x:350,label:'精鉱'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">選鉱プロセス最適化</text>
      {stages.map((s,i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <rect x={s.x-20} y="80" width="40" height="60" rx="4" fill={optimized ? C1 : MU} opacity={optimized ? 0.5 : 0.2}>
            {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.3+i*0.2}s`} repeatCount="indefinite"/>}
          </rect>
          <text x={s.x} y="115" fill={TX} fontSize="7" textAnchor="middle">{s.label}</text>
          {i < stages.length-1 && <line x1={s.x+20} y1="110" x2={stages[i+1].x-20} y2="110" stroke={optimized ? '#2dd4bf' : MU} strokeWidth="1.5" markerEnd="url(#arrow)"/>}
        </g>
      ))}
      <defs><marker id="arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4" fill={optimized ? '#2dd4bf' : MU}/></marker></defs>
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '回収率 +15%' : '選鉱待機'}</text>
    </g>
  );
};

/* ---- tailings: dam monitoring ---- */
const TailingsViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">尾鉱ダム安全監視</text>
      <path d="M60,170 L160,80 L240,80 L340,170" fill="none" stroke={optimized ? '#2dd4bf' : MU} strokeWidth="2" opacity={optimized ? 0.7 : 0.4}/>
      <path d="M160,80 L160,170 L240,170 L240,80" fill={optimized ? 'rgba(45,212,191,0.1)' : 'rgba(142,154,175,0.05)'} stroke="none"/>
      {[{x:110,y:125},{x:200,y:100},{x:290,y:125},{x:160,y:150},{x:240,y:150}].map(({x,y},i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={optimized ? (i===3||i===4 ? '#ff4444' : C1) : MU} opacity={optimized ? 0.8 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1+i*0.2}s`} repeatCount="indefinite"/>}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '安全指数 98.5%' : 'ダム監視待機'}</text>
    </g>
  );
};

/* ---- ventilation: airflow paths ---- */
const VentilationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const tunnels = [[60,70,180,70],[60,130,180,130],[180,70,180,130],[180,100,340,100],[340,70,340,130]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">坑内換気最適化</text>
      {tunnels.map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={optimized ? C2 : MU} strokeWidth={optimized ? 3 : 1.5} opacity={optimized ? 0.6 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1.5+i*0.15}s`} repeatCount="indefinite"/>}
        </line>
      ))}
      {optimized && <path d="M70,70 C120,60 150,80 170,70" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6"/>}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '換気効率 +32%' : '換気待機'}</text>
    </g>
  );
};

/* ---- hauling: truck dispatch network ---- */
const HaulingViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const nodes = [[80,60],[200,50],[320,70],[100,140],[260,150]];
  const roads: [number,number][] = [[0,1],[1,2],[0,3],[1,4],[3,4],[2,4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">重機配車計画最適化</text>
      {roads.map(([a,b],i) => {
        const active = optimized && (i===0||i===3||i===4);
        return <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={active ? '#2dd4bf' : MU} strokeWidth={active ? 2.5 : 1} opacity={active ? 0.7 : 0.2}>
          {running && <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" repeatCount="indefinite"/>}
        </line>;
      })}
      {nodes.map(([x,y],i) => (
        <rect key={i} x={x-8} y={y-6} width="16" height="12" rx="2"
          fill={selectedNode===String(i) ? '#eab308' : C1} opacity="0.8"
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1+i*0.2}s`} repeatCount="indefinite"/>}
        </rect>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '輸送コスト -28%' : '配車計算中'}</text>
    </g>
  );
};

/* ---- environment: monitoring grid ---- */
const EnvironmentViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const sensors = [[80,60],[200,50],[320,70],[100,130],[220,140],[340,125]];
  const links: [number,number][] = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱山環境モニタリング</text>
      <rect x="50" y="30" width="310" height="140" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2"/>
      {links.map(([a,b],i) => (
        <line key={i} x1={sensors[a][0]} y1={sensors[a][1]} x2={sensors[b][0]} y2={sensors[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.2 : 0.5} opacity={optimized ? 0.4 : 0.15}>
          {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite"/>}
        </line>
      ))}
      {sensors.map(([x,y],i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <circle cx={x} cy={y} r={5} fill={optimized ? C1 : C2} opacity="0.8">
            {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1+i*0.15}s`} repeatCount="indefinite"/>}
          </circle>
          {optimized && <text x={x} y={y-10} fill={C1} fontSize="6" textAnchor="middle">{`S${i+1}`}</text>}
        </g>
      ))}
      <text x="200" y="190" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '環境基準 全項目クリア' : 'センサー待機'}</text>
    </g>
  );
};

/* ---- raremetal: recovery process ---- */
const RaremetalViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const elements = [{x:60,label:'Nd'},{x:120,label:'Dy'},{x:180,label:'Co'},{x:240,label:'Li'},{x:300,label:'In'},{x:360,label:'Ga'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">レアメタル回収最適化</text>
      {elements.map((e,i) => {
        const h = optimized ? 40+i*8 : 25;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={e.x-15} y={160-h} width="30" height={h} rx="3" fill={optimized ? C1 : MU} opacity={optimized ? 0.6 : 0.25}>
              {running && <animate attributeName="height" values={`${h*0.5};${h};${h*0.5}`} dur={`${1.5+i*0.15}s`} repeatCount="indefinite"/>}
            </rect>
            <text x={e.x} y="175" fill={MU} fontSize="7" textAnchor="middle">{e.label}</text>
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '回収率 +42%' : 'レアメタル分析待機'}</text>
    </g>
  );
};

/* ---- geology: layer model ---- */
const GeologyViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const layers = [
    {y:40,h:30,label:'表土',col:'#8B7355'},
    {y:75,h:35,label:'砂岩',col:'#A09060'},
    {y:115,h:30,label:'鉱化帯',col:C1},
    {y:150,h:30,label:'基盤岩',col:'#555555'},
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">3D地質モデリング</text>
      {layers.map((l,i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <rect x="40" y={l.y} width="320" height={l.h} fill={l.col} opacity={optimized ? 0.4 : 0.2}>
            {running && <animate attributeName="opacity" values="0.15;0.4;0.15" dur={`${2+i*0.3}s`} repeatCount="indefinite"/>}
          </rect>
          <text x="370" y={l.y+l.h/2+4} fill={MU} fontSize="7">{l.label}</text>
        </g>
      ))}
      {optimized && [100,200,300].map((x,i) => (
        <line key={i} x1={x} y1="40" x2={x} y2="180" stroke="#2dd4bf" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 2"/>
      ))}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'モデル精度 94.8%' : '地質データ待機'}</text>
    </g>
  );
};

/* ---- blast: blast pattern ---- */
const BlastViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const holes = [[80,60],[140,60],[200,60],[260,60],[320,60],[80,120],[140,120],[200,120],[260,120],[320,120]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">発破パターン最適化</text>
      {holes.map(([x,y],i) => {
        const col = optimized ? (i<5 ? C1 : '#2dd4bf') : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <circle cx={x} cy={y} r={optimized ? 12 : 8} fill={col} opacity={optimized ? 0.3 : 0.12}>
              {running && <animate attributeName="r" values="6;14;6" dur={`${0.8+i*0.1}s`} repeatCount="indefinite"/>}
            </circle>
            <circle cx={x} cy={y} r="3" fill={col} opacity="0.7"/>
            {optimized && <text x={x} y={y+25} fill={MU} fontSize="6" textAnchor="middle">{`${(i+1)*50}ms`}</text>}
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '破砕効率 +35%' : '発破計算待機'}</text>
    </g>
  );
};

/* ---- drainage: water treatment flow ---- */
const DrainageViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const tanks = [{x:60,y:80,label:'集水'},{x:160,y:80,label:'中和'},{x:260,y:80,label:'沈殿'},{x:360,y:80,label:'放流'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱山排水処理最適化</text>
      {tanks.map((t,i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <rect x={t.x-25} y={t.y} width="50" height="70" rx="5" fill={optimized ? C2 : MU} opacity={optimized ? 0.35 : 0.15} stroke={optimized ? C2 : MU} strokeWidth="1">
            {running && <animate attributeName="opacity" values="0.1;0.35;0.1" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>}
          </rect>
          <text x={t.x} y={t.y+40} fill={TX} fontSize="7" textAnchor="middle">{t.label}</text>
          {i<tanks.length-1 && <line x1={t.x+25} y1={t.y+35} x2={tanks[i+1].x-25} y2={tanks[i+1].x-25 > t.x+25 ? t.y+35 : t.y+35} stroke={optimized ? '#2dd4bf' : MU} strokeWidth="1.5"/>}
        </g>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'pH基準値達成 処理コスト-25%' : '排水処理待機'}</text>
    </g>
  );
};

/* ---- reserves: resource estimation blocks ---- */
const ReservesViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 4;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">資源埋蔵量推定</text>
      {Array.from({length:grid}).flatMap((_,r) =>
        Array.from({length:grid*2}).map((_,c) => {
          const idx = r*grid*2+c;
          const x = 40+c*40; const y = 40+r*40;
          const val = optimized ? (idx%5===0 ? 0.9 : 0.3+Math.random()*0.5) : 0;
          const col = val > 0.7 ? C1 : (val > 0.4 ? C2 : MU);
          return (
            <rect key={idx} x={x} y={y} width="35" height="35" rx="3"
              fill={optimized ? col : MU} opacity={optimized ? val*0.6 : 0.08}
              stroke={optimized ? col : 'none'} strokeWidth="0.5"
              onClick={() => onNodeClick(String(idx))} style={{cursor:'pointer'}}>
              {running && <animate attributeName="opacity" values="0.05;0.3;0.05" dur={`${1.5+idx*0.03}s`} repeatCount="indefinite"/>}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '推定精度 ±8.2%' : '推定データ待機'}</text>
    </g>
  );
};

/* ---- iot: underground tunnel cross-section with sensor nodes ---- */
const IotViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  /* Draw a tunnel cross-section (arch shape) with IoT sensor nodes at walls/ceiling/floor */
  const tunnelY = 60;
  const tunnelH = 120;
  const tunnelW = 260;
  const cx = 200;
  const sensorPos = [
    {x:cx-110, y:tunnelY+40, label:'壁面左'},
    {x:cx,     y:tunnelY+5,  label:'天井'},
    {x:cx+110, y:tunnelY+40, label:'壁面右'},
    {x:cx-70,  y:tunnelY+tunnelH-10, label:'床左'},
    {x:cx,     y:tunnelY+tunnelH/2,  label:'中央'},
    {x:cx+70,  y:tunnelY+tunnelH-10, label:'床右'},
  ];
  /* wireless links: each sensor talks to its neighbors */
  const links: [number,number][] = [[0,1],[1,2],[0,3],[3,4],[4,5],[2,5],[1,4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱山IoTセンサーネットワーク</text>
      {/* tunnel arch outline */}
      <path d={`M${cx-tunnelW/2},${tunnelY+tunnelH} L${cx-tunnelW/2},${tunnelY+40} Q${cx},${tunnelY-20} ${cx+tunnelW/2},${tunnelY+40} L${cx+tunnelW/2},${tunnelY+tunnelH} Z`}
        fill="none" stroke={optimized ? C2 : MU} strokeWidth={optimized ? 2 : 1} opacity={optimized ? 0.5 : 0.2}/>
      {/* rock strata texture lines */}
      {[30,55,80,105].map((dy,i) => (
        <line key={`st${i}`} x1={cx-tunnelW/2-15} y1={tunnelY+dy} x2={cx-tunnelW/2-5} y2={tunnelY+dy}
          stroke={MU} strokeWidth="0.5" opacity="0.15"/>
      ))}
      {/* wireless links (dashed when not optimized) */}
      {links.map(([a,b],i) => (
        <line key={i} x1={sensorPos[a].x} y1={sensorPos[a].y} x2={sensorPos[b].x} y2={sensorPos[b].y}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.5 : 0.6}
          strokeDasharray={optimized ? 'none' : '3 2'} opacity={optimized ? 0.5 : 0.15}>
          {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.8+i*0.15}s`} repeatCount="indefinite"/>}
        </line>
      ))}
      {/* sensor nodes (diamonds for IoT) */}
      {sensorPos.map((s,i) => {
        const sel = selectedNode===String(i);
        const r = sel ? 9 : 6;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={s.x-r} y={s.y-r} width={r*2} height={r*2} rx="2"
              fill={sel ? '#eab308' : (optimized ? C1 : C2)} opacity={optimized ? 0.85 : 0.4}
              transform={`rotate(45,${s.x},${s.y})`}>
              {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1+i*0.15}s`} repeatCount="indefinite"/>}
            </rect>
            {optimized && <text x={s.x} y={s.y-r-4} fill={C1} fontSize="5" textAnchor="middle">{s.label}</text>}
          </g>
        );
      })}
      {/* signal wave arcs from central sensor */}
      {optimized && [14,22,30].map((r,i) => (
        <circle key={`w${i}`} cx={cx} cy={tunnelY+tunnelH/2} r={r} fill="none"
          stroke="#2dd4bf" strokeWidth="0.6" opacity={0.25-i*0.06} strokeDasharray="2 3"/>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'IoT 6/6 稼働中 遅延<5ms' : 'センサー待機'}</text>
    </g>
  );
};

/* ---- dust: particle concentration map ---- */
const DustViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const zones = [[100,80],[200,120],[300,70],[150,160],[280,150]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">粉じん制御最適化</text>
      <rect x="50" y="35" width="300" height="155" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3"/>
      {zones.map(([x,y],i) => {
        const col = optimized ? (i%2===0 ? '#2dd4bf' : '#ff4444') : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <circle cx={x} cy={y} r={optimized ? 18 : 12} fill={col} opacity={optimized ? 0.2 : 0.08}>
              {running && <animate attributeName="r" values="8;20;8" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>}
            </circle>
            {optimized && <text x={x} y={y+4} fill={TX} fontSize="8" textAnchor="middle">{i%2===0 ? '✓' : '!'}</text>}
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '粉じん濃度 基準値以下' : '粉じん監視待機'}</text>
    </g>
  );
};

/* ---- price: commodity price chart ---- */
const PriceViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({length:16},(_,i) => {
    const x = 30+i*22;
    const y = optimized ? 100+Math.sin(i*0.8)*30-i*1.5 : 120-Math.cos(i*0.3)*15;
    return `${x},${y}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱物価格予測AI</text>
      <line x1="30" y1="180" x2="380" y2="180" stroke={MU} strokeWidth="0.5"/>
      <line x1="30" y1="30" x2="30" y2="180" stroke={MU} strokeWidth="0.5"/>
      <polyline points={pts.join(' ')} fill="none" stroke={C2} strokeWidth={optimized ? 2 : 1} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/>}
      </polyline>
      {optimized && <polyline points={pts.map((p,i)=>{const[x]=p.split(',');return`${x},${90+Math.sin(i*0.5)*20}`;}).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5"/>}
      <circle cx="30" cy={120} r="3" fill={C2} onClick={() => onNodeClick('0')} style={{cursor:'pointer'}}/>
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '予測精度 MAPE 4.2%' : '価格データ待機'}</text>
    </g>
  );
};

/* ---- closure: mine closure plan ---- */
const ClosureViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const phases = [{label:'汚染除去',x:40,w:80},{label:'地形復元',x:100,w:100},{label:'植生回復',x:160,w:70},{label:'水質管理',x:200,w:90},{label:'モニタリング',x:280,w:60}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">鉱山閉山計画最適化</text>
      {phases.map((t,i) => {
        const y = 40+i*32; const w = optimized ? t.w*0.78 : t.w;
        const col = optimized ? '#2dd4bf' : C1;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <text x="30" y={y+14} fill={MU} fontSize="7" textAnchor="end">{t.label}</text>
            <rect x={t.x} y={y} width={w} height="20" rx="3" fill={col} opacity={optimized ? 0.6 : 0.3}>
              {running && <animate attributeName="width" values={`${w*0.5};${w};${w*0.5}`} dur="2s" repeatCount="indefinite"/>}
            </rect>
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '閉山コスト -22%' : '閉山計画待機'}</text>
    </g>
  );
};

/* ---- seabed: deep sea exploration ---- */
const SeabedViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const depths = [1,2,3,4,5];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">海底鉱物探査</text>
      {depths.map(i => (
        <ellipse key={i} cx="200" cy={80+i*18} rx={160-i*15} ry={10+i*2} fill="none"
          stroke={optimized ? C2 : MU} strokeWidth={optimized ? 1.5 : 0.8} opacity={optimized ? 0.5-i*0.06 : 0.2}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${2+i*0.3}s`} repeatCount="indefinite"/>}
        </ellipse>
      ))}
      <circle cx="200" cy="80" r="6" fill={C1} opacity="0.7">
        {running && <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite"/>}
      </circle>
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '海底資源 3箇所特定' : '海底探査待機'}</text>
    </g>
  );
};

/* ---- recycle: circular flow ---- */
const RecycleViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const nodes = [{x:200,y:50,label:'収集'},{x:320,y:110,label:'分解'},{x:280,y:170,label:'精錬'},{x:120,y:170,label:'再生'},{x:80,y:110,label:'製品'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">リサイクル最適化</text>
      {nodes.map((n,i) => {
        const next = nodes[(i+1)%nodes.length];
        return (
          <g key={i}>
            <line x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke={optimized ? '#2dd4bf' : MU} strokeWidth="1" opacity={optimized ? 0.5 : 0.2} strokeDasharray={optimized ? 'none' : '3 2'}/>
            <circle cx={n.x} cy={n.y} r={optimized ? 18 : 14} fill={optimized ? C1 : MU} opacity={optimized ? 0.35 : 0.15}
              onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
              {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>}
            </circle>
            <text x={n.x} y={n.y+4} fill={TX} fontSize="7" textAnchor="middle">{n.label}</text>
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '資源回収率 +38%' : 'リサイクル待機'}</text>
    </g>
  );
};

/* ---- safety: worker risk matrix with zone-based indicators ---- */
const SafetyViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  /* 4x3 risk matrix: rows=severity (Low/Med/High/Critical), cols=likelihood (Low/Med/High) */
  const cols = 3; const rows = 4;
  const cellW = 70; const cellH = 30;
  const ox = 80; const oy = 38;
  const riskColor = (r: number, c: number): string => {
    const score = r + c;
    if (score >= 4) return '#ff4444';
    if (score >= 3) return C2;
    if (score >= 2) return '#eab308';
    return '#2dd4bf';
  };
  /* Worker count per cell (optimized shows redistribution) */
  const baseCounts = [[12,4,1],[8,6,2],[3,5,3],[1,2,1]];
  const optCounts  = [[18,6,0],[10,4,0],[4,2,0],[2,1,0]];
  const sevLabels = ['低','中','高','危'];
  const likLabels = ['低','中','高'];
  return (
    <g>
      <text x="200" y="16" fill={TX} fontSize="10" textAnchor="middle">鉱山労働安全AI</text>
      {/* axis labels */}
      <text x={ox+cols*cellW/2} y={oy-4} fill={MU} fontSize="6" textAnchor="middle">発生頻度 →</text>
      <text x={ox-18} y={oy+rows*cellH/2} fill={MU} fontSize="6" textAnchor="middle"
        transform={`rotate(-90,${ox-18},${oy+rows*cellH/2})`}>重大度 →</text>
      {/* column headers */}
      {likLabels.map((l,c) => (
        <text key={`ch${c}`} x={ox+c*cellW+cellW/2} y={oy+8} fill={MU} fontSize="6" textAnchor="middle">{l}</text>
      ))}
      {/* row headers */}
      {sevLabels.map((s,r) => (
        <text key={`rh${r}`} x={ox-8} y={oy+14+r*cellH+cellH/2} fill={MU} fontSize="6" textAnchor="middle">{s}</text>
      ))}
      {/* matrix cells */}
      {Array.from({length:rows}).flatMap((_,r) =>
        Array.from({length:cols}).map((_,c) => {
          const x = ox+c*cellW; const y = oy+14+r*cellH;
          const col = riskColor(r,c);
          const cnt = optimized ? optCounts[r][c] : baseCounts[r][c];
          return (
            <g key={`${r}-${c}`} onClick={() => onNodeClick(`${r}-${c}`)} style={{cursor:'pointer'}}>
              <rect x={x} y={y} width={cellW-2} height={cellH-2} rx="3"
                fill={col} opacity={optimized ? 0.35 : 0.12} stroke={col} strokeWidth="0.5">
                {running && <animate attributeName="opacity"
                  values={`${optimized?0.2:0.06};${optimized?0.4:0.15};${optimized?0.2:0.06}`}
                  dur={`${1.5+r*0.2+c*0.15}s`} repeatCount="indefinite"/>}
              </rect>
              <text x={x+cellW/2-1} y={y+cellH/2+2} fill={TX} fontSize="9" fontWeight="bold" textAnchor="middle">
                {cnt}
              </text>
            </g>
          );
        })
      )}
      {/* arrow showing risk reduction */}
      {optimized && (
        <g>
          <line x1={ox+cols*cellW+8} y1={oy+14+rows*cellH-5} x2={ox+cols*cellW+8} y2={oy+20}
            stroke="#2dd4bf" strokeWidth="1.5" markerEnd="url(#safeArrow)"/>
          <text x={ox+cols*cellW+16} y={oy+rows*cellH/2+14} fill="#2dd4bf" fontSize="5"
            transform={`rotate(-90,${ox+cols*cellW+16},${oy+rows*cellH/2+14})`}>リスク低減</text>
        </g>
      )}
      <defs><marker id="safeArrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
        <path d="M0,0 L5,2 L0,4" fill="#2dd4bf"/></marker></defs>
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">
        {optimized ? '高リスク作業者 0名 達成' : '安全監視待機'}
      </text>
    </g>
  );
};

/* ---- supply: supply chain network ---- */
const SupplyViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const nodes = [[60,100],[140,60],[140,140],[260,60],[260,140],[340,100]];
  const edges: [number,number][] = [[0,1],[0,2],[1,3],[2,4],[1,4],[2,3],[3,5],[4,5]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">サプライチェーン鉱物最適化</text>
      {edges.map(([a,b],i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.5 : 0.6} opacity={optimized ? 0.5 : 0.2}>
          {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.5+i*0.1}s`} repeatCount="indefinite"/>}
        </line>
      ))}
      {nodes.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={selectedNode===String(i) ? 8 : 5}
          fill={selectedNode===String(i) ? '#eab308' : (optimized ? C1 : MU)} opacity={optimized ? 0.7 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="r" values="3;6;3" dur={`${1+i*0.1}s`} repeatCount="indefinite"/>}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'SC効率 +31%' : 'サプライチェーン待機'}</text>
    </g>
  );
};

/* ---- registry & main component ---- */
const VIZ_COMPONENTS: Record<VizType, React.FC<VizProps>> = {
  vein: VeinViz, excavation: ExcavationViz, grade: GradeViz,
  beneficiation: BeneficiationViz, tailings: TailingsViz, ventilation: VentilationViz,
  hauling: HaulingViz, environment: EnvironmentViz, raremetal: RaremetalViz,
  geology: GeologyViz, blast: BlastViz, drainage: DrainageViz,
  reserves: ReservesViz, iot: IotViz, dust: DustViz,
  price: PriceViz, closure: ClosureViz, seabed: SeabedViz,
  recycle: RecycleViz, safety: SafetyViz, supply: SupplyViz,
};

export default function VizCanvas({
  vizType, running, optimized, progress, optLevel, selectedNode, onNodeClick,
}: VizProps & { vizType: VizType }) {
  const Comp = VIZ_COMPONENTS[vizType];
  return (
    <svg viewBox="0 0 400 220" width="100%" style={{ display: 'block' }}>
      <rect width="400" height="220" fill={BG} rx="8" />
      <Comp running={running} optimized={optimized} progress={progress}
        optLevel={optLevel} selectedNode={selectedNode} onNodeClick={onNodeClick} />
      {running && (
        <g>
          <rect x="10" y="212" width="380" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="10" y="212" width={380 * (progress / 100)} height="4" rx="2" fill={C1} opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
