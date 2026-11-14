import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { LayoutDashboard, Users, FlaskConical, Database, Sparkles, BookOpen, FileText, Plus, Search, Bell, ChevronRight, Menu, X, Download, Send, ShieldCheck, TrendingUp, Target, Clock3, CheckCircle2 } from "lucide-react";
import "./styles.css";

const initialProjects = [
 {id:1,title:"Функционалдық сауаттылық және информатика",subject:"Информатика",lead:"Зерттеуші педагог",status:"Жүргізілуде",participants:4,question:"Функционалдық сауаттылық тапсырмалары оқушылардың пәнге мотивациясына қалай әсер етеді?",method:"Бақылау, сауалнама, оқушы жұмыстары",published:true,records:18},
 {id:2,title:"Цифрлық құралдар арқылы мәтінмен жұмыс",subject:"Қазақ тілі",lead:"Пән мұғалімі",status:"Жоспарлау",participants:3,question:"Цифрлық тапсырмалар мәтінді түсіну дағдысына қалай ықпал етеді?",method:"Диагностикалық тапсырма",published:true,records:0},
 {id:3,title:"Проблемалық есептер және логикалық ойлау",subject:"Математика",lead:"Пән мұғалімі",status:"Қорытындылау",participants:2,question:"Проблемалық есептерді жүйелі қолдану логикалық ойлауға қалай әсер етеді?",method:"Алдын ала/қорытынды тест",published:false,records:24}
];
const nav = [
 ["Басты панель",LayoutDashboard],["SHARE қауымдастығы",Users],["Зерттеу жобалары",FlaskConical],["Деректер базасы",Database],["AI Research Assistant",Sparkles],["Әдіснама",BookOpen],["Есептер",FileText]
];
function App(){
 const [section,setSection]=useState("Басты панель");
 const [role,setRole]=useState("Негізгі топ мүшесі");
 const [projects,setProjects]=useState(()=>JSON.parse(localStorage.getItem("share-projects")||"null")||initialProjects);
 const [records,setRecords]=useState(()=>JSON.parse(localStorage.getItem("share-records")||"[]"));
 const [query,setQuery]=useState("");
 const [showNew,setShowNew]=useState(false);
 const [newTitle,setNewTitle]=useState("");
 const [newSubject,setNewSubject]=useState("Информатика");
 const [newQuestion,setNewQuestion]=useState("");
 const [selected,setSelected]=useState(1);
 const [recordValue,setRecordValue]=useState("");
 const [recordNote,setRecordNote]=useState("");
 const [analysis,setAnalysis]=useState("");
 const [loading,setLoading]=useState(false);
 const [mobileNav,setMobileNav]=useState(false);
 const [notice,setNotice]=useState("");
 const active=projects.find(p=>p.id===selected)||projects[0];
 const saveProjects=(v)=>{setProjects(v);localStorage.setItem("share-projects",JSON.stringify(v));};
 const saveRecords=(v)=>{setRecords(v);localStorage.setItem("share-records",JSON.stringify(v));};
 const shared=projects.filter(p=>p.published);
 const totalRecords=records.length+projects.reduce((n,p)=>n+(p.records||0),0);
 const filtered=projects.filter(p=>(p.title+" "+p.subject).toLowerCase().includes(query.toLowerCase()));
 const addProject=()=>{
  if(!newTitle.trim())return;
  const p={id:Date.now(),title:newTitle,subject:newSubject,lead:role, status:"Жоспарлау",participants:1,question:newQuestion,method:"Бақылау, сауалнама",published:false,records:0};
  saveProjects([p,...projects]);setSelected(p.id);setNewTitle("");setNewQuestion("");setShowNew(false);setSection("Зерттеу жобалары");
 };
 const addRecord=()=>{
  if(!recordValue.trim())return;
  const item={id:Date.now(),projectId:active.id,value:recordValue,note:recordNote,date:new Date().toLocaleDateString("kk-KZ"),author:role};
  const next=[item,...records];saveRecords(next);
  saveProjects(projects.map(p=>p.id===active.id?{...p,records:(p.records||0)+1}:p));
  setRecordValue("");setRecordNote("");setNotice("Дерек сақталды");setTimeout(()=>setNotice(""),2500);
 };
 const runAnalysis=async()=>{
  setLoading(true);setAnalysis("");
  try{
   const relevant=records.filter(r=>r.projectId===active.id);
   const data={registeredRecords:relevant,projectRecordCount:active.records||0,sharedProjectCount:shared.length};
   const response=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({researchTitle:active.title,researchQuestion:active.question,subject:active.subject,method:active.method,data})});
   const json=await response.json();if(!response.ok)throw new Error(json.error||"Сервер қатесі");setAnalysis(json.analysis);
  }catch(e){setAnalysis("AI сервисіне қосылу мүмкін болмады: "+e.message+"\\n\\nДемо режимінде зерттеу деректерін тіркеп, құрылымдауды жалғастыра аласыз.");}
  finally{setLoading(false);}
 };
 const exportReport=()=>{
  const text=`EDU RESEARCH AI × SHARE\\nЗерттеу: ${active.title}\\nПәні: ${active.subject}\\nСұрағы: ${active.question}\\n\\nДеректер саны: ${active.records||0}\\nAI талдауы:\\n${analysis||"Әзірге талдау жоқ."}`;
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));a.download="share-research-report.txt";a.click();URL.revokeObjectURL(a.href);
 };
 const title=section;
 return <div className="app">
  <aside className={`sidebar ${mobileNav?"open":""}`}>
   <div className="brand"><div className="brandmark">ER<span>×</span>S</div><div><b>EDU RESEARCH AI</b><small>SHARE · 2026–2027</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
   <div className="workspace-label">ЗЕРТТЕУ ОРТАСЫ</div>
   <nav>{nav.map(([name,Icon])=><button key={name} className={section===name?"nav-item active":"nav-item"} onClick={()=>{setSection(name);setMobileNav(false)}}><Icon size={18}/><span>{name}</span>{name==="Зерттеу жобалары"&&<em>{projects.length}</em>}</button>)}</nav>
   <div className="sidebar-bottom"><div className="secure"><ShieldCheck size={17}/><span>Зерттеу деректерін жауапты пайдалану</span></div><small>Авторлық цифрлық платформа</small></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="menu-btn" onClick={()=>setMobileNav(true)}><Menu/></button><div className="crumb">SHARE HUB <ChevronRight size={14}/> <b>{title}</b></div><div className="top-actions"><span className="year-pill">2026–2027</span><button className="icon-btn" title="Хабарламалар"><Bell size={18}/></button><div className="avatar">П</div></div></header>
   <div className="content">
    <div className="welcome-row"><div><div className="eyebrow">БІРЛЕСКЕН ЗЕРТТЕУ · ДЕРЕККЕ НЕГІЗДЕЛГЕН ШЕШІМ</div><h1>{section==="Басты панель"?"Зерттеу арқылы — даму жолы":title}</h1><p className="subhead">Педагогтердің зерттеу қызметін біріктіру, талдау және тәжірибе тарату кеңістігі.</p></div><div className="role-select"><label>Сіздің рөліңіз</label><select value={role} onChange={e=>setRole(e.target.value)}><option>Негізгі топ мүшесі</option><option>Педагог-волонтер</option></select></div></div>
    {notice&&<div className="notice"><CheckCircle2 size={16}/>{notice}</div>}
    {section==="Басты панель"&&<><div className="stats"><Stat icon={Users} label="SHARE қатысушылары" value="18" hint="5 негізгі топ · 13 волонтер"/><Stat icon={FlaskConical} label="Зерттеу жобалары" value={projects.length} hint={`${shared.length} ортақ панельде`}/><Stat icon={Database} label="Жиналған деректер" value={totalRecords} hint="Демо және енгізілген жазбалар"/><Stat icon={TrendingUp} label="Ортақ зерттеу белсенділігі" value="78%" hint="Үлгілік индикатор"/></div>
    <div className="grid-two"><section className="panel"><div className="panel-head"><div><h2>Зерттеу жобалары</h2><p>Қауымдастықтағы белсенді бастамалар</p></div><button className="text-btn" onClick={()=>setSection("Зерттеу жобалары")}>Барлығын көру <ChevronRight size={15}/></button></div>{projects.slice(0,3).map(p=><ProjectRow key={p.id} p={p} onClick={()=>{setSelected(p.id);setSection("Зерттеу жобалары")}}/>)}</section>
    <section className="panel cycle"><div className="panel-head"><div><h2>SHARE зерттеу циклі</h2><p>Ортақ жұмыстың кезеңдері</p></div><span className="live-dot">ЖҮЙЕ</span></div><div className="cycle-list">{[["01","SHARE","Педагогтерді біріктіру"],["02","RESEARCH","Мәселе мен сұрақты анықтау"],["03","COLLECT","Деректерді жинау"],["04","AI ANALYTICS","Деректерді талдау"],["05","REFLECT","Рефлексия және шешім"],["06","SHARE EXPERIENCE","Тәжірибені тарату"]].map(x=><div className="cycle-step" key={x[0]}><b>{x[0]}</b><div><strong>{x[1]}</strong><small>{x[2]}</small></div><CheckCircle2 size={16}/></div>)}</div></section></div>
    <section className="banner"><div className="banner-icon"><Sparkles size={25}/></div><div><h2>AI Research Assistant</h2><p>Анонимделген зерттеу деректерін құрылымдап, үрдістерді анықтауға көмектеседі. Соңғы педагогикалық шешімді мұғалім қабылдайды.</p></div><button className="primary-btn" onClick={()=>setSection("AI Research Assistant")}>AI көмекшіні ашу <ChevronRight size={16}/></button></section></>}
    {section==="SHARE қауымдастығы"&&<section className="panel"><div className="panel-head"><div><h2>SHARE қауымдастығы</h2><p>Негізгі топ мүшелері және педагог-волонтерлер</p></div><span className="tag">18 қатысушы · демо</span></div><div className="member-grid">{["Негізгі топ мүшесі","Педагог-волонтер"].map((r,i)=><div className="member-card"><div className="member-icon"><Users/></div><div><b>{i===0?"5 негізгі топ мүшесі":"13 педагог-волонтер"}</b><small>{r}</small></div><span className="tag">Белсенді</span></div>)}</div><div className="callout"><ShieldCheck size={18}/> Рөлге сәйкес құқықтар көрсетіледі. Бұл бастапқы демонстрацияда рөл ауыстыру интерфейстік деңгейде ғана іске асады; нақты жүйеде серверлік авторизация қажет.</div></section>}
    {section==="Зерттеу жобалары"&&<><div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Жоба немесе пән бойынша іздеу..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="primary-btn" onClick={()=>setShowNew(true)}><Plus size={17}/> Жаңа зерттеу</button></div><div className="project-layout"><section className="panel project-list"><div className="panel-head"><div><h2>Барлық жобалар</h2><p>Жеке және ортақ зерттеулер</p></div></div>{filtered.map(p=><ProjectRow key={p.id} p={p} selected={selected===p.id} onClick={()=>setSelected(p.id)}/>)}</section>{active&&<section className="panel detail"><div className="detail-top"><span className="tag">{active.subject}</span><span className={active.published?"status published":"status"}>{active.published?"Ортақ панельде":"Жеке жоба"}</span></div><h2>{active.title}</h2><p className="question">{active.question||"Зерттеу сұрағы енгізілмеген."}</p><div className="detail-metrics"><div><b>{active.participants}</b><small>Қатысушы</small></div><div><b>{active.records||0}</b><small>Дерек жазбасы</small></div><div><b>{active.status}</b><small>Кезеңі</small></div></div><div className="detail-actions">{role==="Негізгі топ мүшесі"&&<button className="outline-btn" onClick={()=>saveProjects(projects.map(p=>p.id===active.id?{...p,published:!p.published}:p))}>{active.published?"Ортақ панельден алу":"Ортақ панельге жариялау"}</button>}<button className="outline-btn" onClick={()=>setSection("Деректер базасы")}>Дерек енгізу</button><button className="primary-btn" onClick={()=>setSection("AI Research Assistant")}><Sparkles size={16}/> Талдау</button></div></section>}</div>{showNew&&<div className="modal-backdrop"><div className="modal"><div className="panel-head"><h2>Жаңа зерттеу жобасы</h2><button className="icon-btn" onClick={()=>setShowNew(false)}><X/></button></div><label>Зерттеу тақырыбы</label><input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Зерттеу атауын енгізіңіз"/><label>Пән</label><select value={newSubject} onChange={e=>setNewSubject(e.target.value)}>{["Информатика","Математика","Физика","Қазақ тілі","Ағылшын тілі","Жаратылыстану","Басқа"].map(x=><option>{x}</option>)}</select><label>Зерттеу сұрағы</label><textarea value={newQuestion} onChange={e=>setNewQuestion(e.target.value)} placeholder="Қандай педагогикалық мәселені зерттейсіз?"/><div className="modal-actions"><button className="outline-btn" onClick={()=>setShowNew(false)}>Болдырмау</button><button className="primary-btn" onClick={addProject}>Жобаны құру</button></div></div></div>}</>}
    {section==="Деректер базасы"&&<div className="grid-two data-grid"><section className="panel"><h2>Зерттеу дерегін енгізу</h2><p className="muted">Тек анонимделген, зерттеуге қажетті деректерді енгізіңіз.</p><label>Жоба</label><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{projects.map(p=><option value={p.id}>{p.title}</option>)}</select><label>Дерек / көрсеткіш</label><input value={recordValue} onChange={e=>setRecordValue(e.target.value)} placeholder="Мысалы: сауалнама нәтижесі — 72%"/><label>Қысқаша түсініктеме</label><textarea value={recordNote} onChange={e=>setRecordNote(e.target.value)} placeholder="Кезеңі, әдісі немесе контексті..."/><button className="primary-btn full" onClick={addRecord}><Plus size={16}/> Деректі сақтау</button></section><section className="panel"><div className="panel-head"><div><h2>Соңғы жазбалар</h2><p>{records.length} енгізілген жазба</p></div></div>{records.length?records.slice(0,8).map(r=><div className="record"><div><b>{r.value}</b><small>{projects.find(p=>p.id===r.projectId)?.title||"Жоба"} · {r.date}</small>{r.note&&<p>{r.note}</p>}</div></div>):<div className="empty"><Database size={28}/><b>Әзірге дерек енгізілмеген</b><small>Алғашқы зерттеу дерегін сол жақтағы форма арқылы қосыңыз.</small></div>}</section></div>}
    {section==="AI Research Assistant"&&<div className="ai-layout"><section className="panel"><div className="ai-heading"><div className="ai-orb"><Sparkles/></div><div><h2>AI Research Assistant</h2><p>Gemini негізіндегі педагогикалық зерттеу ассистенті</p></div></div><label>Талдауға арналған жоба</label><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{projects.map(p=><option value={p.id}>{p.title}</option>)}</select><div className="selected-research"><b>{active?.title}</b><small>{active?.question}</small><span>{records.filter(r=>r.projectId===active?.id).length} енгізілген дерек · {active?.records||0} жалпы есептегіш</span></div><div className="callout"><ShieldCheck size={18}/> Жеке деректерді енгізбеңіз. AI нәтижесі — көмекші талдау; қорытындыны мұғалім тексеріп, өзі қабылдайды.</div><button className="primary-btn full" disabled={loading||!active} onClick={runAnalysis}>{loading?"Талдау орындалуда...":<><Sparkles size={17}/> Gemini арқылы талдау</>}</button></section><section className="panel result-panel"><div className="panel-head"><div><h2>Талдау нәтижесі</h2><p>Дерекке негізделген алдын ала қорытынды</p></div><button className="icon-btn" onClick={exportReport} title="Есепті жүктеу"><Download size={18}/></button></div>{loading?<div className="empty"><div className="spinner"/><b>Gemini деректерді талдап жатыр...</b></div>:analysis?<div className="analysis-text">{analysis}</div>:<div className="empty"><Sparkles size={32}/><b>Талдау әлі жасалмаған</b><small>Жобаны таңдап, «Gemini арқылы талдау» батырмасын басыңыз.</small></div>}</section></div>}
    {section==="Әдіснама"&&<section className="panel"><h2>Педагогикалық зерттеудің әдіснамалық картасы</h2><p className="muted">Зерттеу жұмысын жоспарлау мен жүргізудің ұсынылатын құрылымы.</p><div className="method-grid">{[["01","Мәселені анықтау","Оқу үдерісіндегі нақты қиындықты немесе даму нүктесін белгілеу."],["02","Зерттеу сұрағы","Өлшенетін, нақты және педагогикалық тәжірибеге қатысты сұрақ құрастыру."],["03","Әдіс пен құрал","Бақылау, сауалнама, сұхбат, тест, оқушы жұмыстары сияқты құралдарды таңдау."],["04","Дерек жинау","Бірдей өлшемдер мен уақыт аралығын сақтап, деректерді анонимдеу."],["05","Талдау және рефлексия","Сандық/сапалық деректерді салыстырып, шектеулерді көрсету."],["06","Тәжірибені тарату","Нәтижені SHARE қауымдастығында талқылап, дәлелді ұсыныс ұсыну."]].map(x=><div className="method-card"><span>{x[0]}</span><b>{x[1]}</b><p>{x[2]}</p></div>)}</div></section>}
    {section==="Есептер"&&<section className="panel"><div className="panel-head"><div><h2>SHARE ортақ нәтижелері</h2><p>Жарияланған зерттеулердің жиынтық көрінісі</p></div><span className="tag">Shared view</span></div><div className="stats compact"><Stat icon={FlaskConical} label="Ортақ жобалар" value={shared.length} hint="Жарияланған"/><Stat icon={Database} label="Деректер" value={totalRecords} hint="Демо мәндер қосылған"/><Stat icon={Users} label="Қатысушылар" value="18" hint="Үлгілік құрам"/></div><div className="table-wrap"><table><thead><tr><th>Зерттеу атауы</th><th>Пән</th><th>Кезең</th><th>Дерек</th><th>Көрінуі</th></tr></thead><tbody>{projects.map(p=><tr><td>{p.title}</td><td>{p.subject}</td><td>{p.status}</td><td>{p.records||0}</td><td><span className={p.published?"status published":"status"}>{p.published?"Ортақ":"Жеке"}</span></td></tr>)}</tbody></table></div></section>}
    <footer>EDU RESEARCH AI × SHARE <span>·</span> Демонстрациялық прототип · 2026–2027</footer>
   </div>
  </main>
 </div>
}
function Stat({icon:Icon,label,value,hint}){return <div className="stat"><div className="stat-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><small>{hint}</small></div>}
function ProjectRow({p,onClick,selected}){return <button className={`project-row ${selected?"chosen":""}`} onClick={onClick}><div className="project-icon"><FlaskConical size={18}/></div><div className="project-info"><b>{p.title}</b><small>{p.subject} · {p.lead}</small></div><div className="project-meta"><span className="status">{p.status}</span><small>{p.records||0} дерек</small></div><ChevronRight size={17}/></button>}
createRoot(document.getElementById("root")).render(<App/>);
