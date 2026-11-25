// ───────── Mandat 27 — V2
const KEYS = Object.keys(CANDS);
const LVL = {2:"Soutien net",1:"Plutôt pour",0:"Nuancé","-1":"Plutôt contre","-2":"Opposition nette"};
const opt = l => l===2?"A":(l===-2?"C":"B");
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const INTROS = ["jt","sms","dossier"];
const VOTES  = ["cartes","ministres","curseur","bulletin"];
const VOTE_NOM = {cartes:"Les 3 options",swipe:"Glisse la carte",ministres:"Conseil des ministres",curseur:"Le curseur",bulletin:"Le bulletin"};
const RANGS = [[0,["Président stagiaire","Présidente stagiaire"]],[120,["Président à l'écoute","Présidente à l'écoute"]],[300,["Président informé","Présidente informée"]],[520,["Président expert","Présidente experte"]],[760,["Président chevronné","Présidente chevronnée"]]];
const G = (m,f) => (S.moi&&S.moi.g==="m")?m:f;
const TITRE = () => G("Monsieur le Président","Madame la Présidente");

let Q = QALL;
function setMode(m){ S.mode=MODES[m]?m:"complet"; const ids=MODES[S.mode].ids; Q = ids?QALL.filter(q=>ids.includes(q.id)):QALL; }
const NQ = () => Q.length;
let S = load() || fresh();
setMode(S.mode||"complet");
if(S.screen==="drop") S.screen="result";
function fresh(){ return {mode:null, screen:"home", qi:0, step:0, ch:{}, imp:{}, seenYear:-1, xp:0, quiz:{}, pick:null, moi:null, vu:{}}; }
function save(){ try{ localStorage.setItem("mandat27v2", JSON.stringify(S)); }catch(e){} }
function load(){ try{ return JSON.parse(localStorage.getItem("mandat27v2")); }catch(e){ return null; } }
const qIndex = id => Q.findIndex(q=>q.id===id);
const fmtIntro = i => INTROS[i%3];
const fmtVote = i => VOTES[i%VOTES.length];
function stepsOf(q){ return ["intro", QUIZ[q.id]?"quiz":"faits", "debat", "ailleurs", "vote"]; }
const STEP_NOM = {intro:"L'alerte",quiz:"Devine le chiffre",faits:"Les chiffres",debat:"Le débat",ailleurs:"Ailleurs",vote:"Ta décision"};

// ───────── calculs
function supporters(q,o){ return KEYS.filter(k=>opt(POS[q.id][k][0])===o); }
function agg(filter){ let b=0,c=0,s=0,n=0; Q.forEach(q=>{ if(filter&&!filter(q)) return; const o=S.ch[q.id]; if(!o||o==="X") return;
  b+=q.opts[o].b; c+=q.opts[o].c; s+=supporters(q,o).length/8; n++; }); return {b,c,soutien:n?s/n:.5,n}; }
const yearStats = an => agg(q=>q.an===an);
const totals = () => agg();
function match(){
  const D={A:{A:1,B:.5,C:0},B:{A:.5,B:1,C:.5},C:{A:0,B:.5,C:1}};
  return KEYS.map(k=>{ let num=0,den=0,agree=0,cnt=0;
    Q.forEach(q=>{ const o=S.ch[q.id]; if(!o||o==="X") return; const p=POS[q.id][k];
      const w=(p[2]?1:.5)*(S.imp[q.id]?2:1), a=D[o][opt(p[0])]; num+=a*w; den+=w; cnt++; if(a===1) agree++; });
    return {k,pct:den?Math.round(100*num/den):0,agree,cnt}; }).sort((x,y)=>y.pct-x.pct);
}
function rang(){ let r=RANGS[0]; RANGS.forEach(x=>{ if(S.xp>=x[0]) r=x; }); const nx=RANGS.find(x=>x[0]>S.xp); return {nom:G(r[1][0],r[1][1]), next:nx?nx[0]:null, base:r[0]}; }
function addXP(n,el){ S.xp+=n; save(); const t=document.createElement("div"); t.className="xpfly"; t.textContent="+"+n+" XP";
  const r=(el||document.body).getBoundingClientRect(); t.style.left=(r.left+r.width/2)+"px"; t.style.top=(r.top+window.scrollY)+"px"; document.body.appendChild(t); setTimeout(()=>t.remove(),1200); updXP(); }
function updXP(){ const e=$("#xpb"); if(!e) return; const r=rang(); e.querySelector("b").textContent=r.nom; e.querySelector("i").style.width=(r.next?((S.xp-r.base)/(r.next-r.base)*100):100)+"%"; e.querySelector("span").textContent=S.xp+" XP"; }

// ───────── décor
const ICON = {
 urne:`<svg viewBox="0 0 120 120" class="urne"><rect x="20" y="40" width="80" height="72" rx="6" fill="#BFD3F2" stroke="#1C2554" stroke-width="3"/><rect x="20" y="40" width="80" height="72" rx="6" fill="none" stroke="#9A5B32" stroke-width="6"/><rect x="14" y="32" width="92" height="12" rx="4" fill="#9A5B32" stroke="#1C2554" stroke-width="3"/><rect x="42" y="35" width="36" height="5" rx="2" fill="#1C2554"/><rect x="34" y="88" width="20" height="14" rx="2" fill="#F1E3B8" stroke="#1C2554" stroke-width="1.5" transform="rotate(-10 44 95)"/><rect x="58" y="90" width="20" height="14" rx="2" fill="#F1E3B8" stroke="#1C2554" stroke-width="1.5" transform="rotate(8 68 97)"/><rect x="42" y="114" width="36" height="6" rx="2" fill="#1C2554"/></svg>`,
 bulletin:`<svg viewBox="0 0 60 80" class="bulletin"><rect x="4" y="16" width="52" height="40" rx="4" fill="#F1E3B8" stroke="#1C2554" stroke-width="3"/><path d="M4 20 L30 40 L56 20" fill="none" stroke="#1C2554" stroke-width="3"/></svg>`,
 logo:`<svg viewBox="0 0 120 120" class="logo"><rect width="120" height="120" rx="30" fill="#2A5BFF"/><g fill="#fff">${[0,1,2].map(r=>[...Array(5+r*2)].map((_,i,a)=>{const R=26+r*12,t=Math.PI*(i/(a.length-1));return `<circle cx="${(60-R*Math.cos(t)).toFixed(1)}" cy="${(82-R*Math.sin(t)).toFixed(1)}" r="4.2"/>`}).join("")).join("")}</g><rect x="56" y="30" width="8" height="44" rx="3" fill="#FFC800"/><path d="M56 74h8l-4 9z" fill="#FFC800"/></svg>`,
 globe:`<svg viewBox="0 0 80 80" class="globe"><circle cx="40" cy="40" r="34" fill="#2F5BEA" stroke="#1C2554" stroke-width="3"/><path d="M20 26 Q30 18 38 26 T50 30 Q46 40 36 38 T22 40Z M46 48 Q56 44 60 52 T54 64 Q46 60 46 48Z" fill="#F5C431"/></svg>`
};
function hemicycle(sup){
  const seats=[]; [9,13,17,21].forEach((n,r)=>{ const R=40+r*16; for(let i=0;i<n;i++){ const t=Math.PI*i/(n-1); seats.push([110-R*Math.cos(t),116-R*Math.sin(t),t]); } });
  seats.sort((a,b)=>a[2]-b[2]); const yes=Math.round(seats.length*sup/8);
  return `<svg viewBox="0 0 220 124" class="hemi">${seats.map((s,i)=>`<circle cx="${s[0].toFixed(1)}" cy="${s[1].toFixed(1)}" r="5.4" class="seat ${i<yes?"yes":""}" style="--d:${(i*0.022).toFixed(3)}s"/>`).join("")}<rect x="96" y="104" width="28" height="14" rx="4" fill="#13234B"/></svg>`;
}
function gauges(){
  const t=totals(), r=rang();
  // Budget et Climat : jauges à deux sens, zéro au milieu (vert = mieux, rouge = pire)
  const bip=(v,l,sc,words,tip)=>{ const p=Math.max(-50,Math.min(50,v*sc)), col=v>0?"#2F5BEA":v<0?"#E5392B":"#AEB9D8", w=v>0?words[0]:v<0?words[1]:words[2];
    return `<div class="g" title="${tip}"><div class="gl">${l}</div><div class="gb bip"><b></b><i style="left:${p<0?50+p:50}%;width:${Math.abs(p)}%;background:${col}"></i></div><div class="gv"><span style="color:${v>0?"#2F5BEA":v<0?"#E5392B":"inherit"}">${v>0?"+":v<0?"−":""}${Math.abs(v)}</span> <small>${w}</small></div></div>`; };
  const sou=t.n?Math.round(t.soutien*100):null;
  return `<div class="gauges">${bip(t.b,"Budget",8,["économies","dépenses","équilibre"],"Tendance de tes choix sur les finances publiques")}${bip(t.c,"Climat",10,["mieux","pire","neutre"],"Tendance de tes choix sur le climat")}
   <div class="g" title="Part moyenne des 8 candidats qui défendent tes choix"><div class="gl">Soutiens</div><div class="gb"><i style="width:${sou==null?0:Math.max(4,sou)}%;background:#F5C431"></i></div><div class="gv">${sou==null?"–":sou+" %"} <small>${sou==null?"":sou>=60?"large":sou>=35?"partagé":"isolé"}</small></div></div></div>
  <div class="xpbar" id="xpb">${S.moi?`<span class="me">${perso("moi","happy")}</span>`:""}<b>${r.nom}</b><div class="xpt"><i style="width:${r.next?((S.xp-r.base)/(r.next-r.base)*100):100}%"></i></div><span>${S.xp} XP</span></div>`;
}
function topbar(){ const done=Q.filter(q=>S.ch[q.id]).length, back=S.back==="parcours"&&S.screen==="q";
  return `<header class="hdr"><button class="brand" onclick="go('home')" aria-label="Mandat 27 : retour à l'accueil"><span>MANDAT <b>27</b></span></button><span class="hdr-r"><span class="hdec">Décision ${Math.min(done+(S.screen==="q"&&!S.ch[Q[S.qi].id]?1:0),NQ())}/${NQ()}</span><button class="gtog ${S.showG?"on":""}" onclick="S.showG=!S.showG;save();document.querySelector('.gwrap').classList.toggle('on');this.classList.toggle('on')" aria-label="Voir mes jauges" aria-expanded="${!!S.showG}"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 16V9M10 16V4M17 16v-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/></svg></button>${S.screen==="map"?"":`<button class="btn ghost sm" onclick="${back?"S.back=null;go('parcours')":"go('map')"}">${back?"Parcours":"Carte"}</button>`}</span><i class="hprog" style="width:${done/NQ()*100}%" aria-hidden="true"></i></header><div class="gwrap ${S.showG?"on":""}">${gauges()}</div>`; }
function src(l,u){ return u?`<a class="src" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a>`:`<span class="src off">${esc(l)}</span>`; }

// ───────── écrans
const V={};
V.home=()=>{ const started=Object.keys(S.ch).length;
 return `<div class="screen home">
  <div class="poster">${DECOR.rays}
   <h1 class="pop d1">MANDAT<br><span>27</span></h1>
   <p class="lead pop d2">5 ans à l'Élysée.<br>Jusqu'à 30 décisions réelles de la campagne 2027.</p>
   <div class="pfac">${DECOR.facade}</div>
   <div class="cast pop d3">${["karim","yuki","lea","helene","sam"].map((k,i)=>`<div class="cm${k==="lea"?" mid":""}" style="--i:${i}">${perso(k,"happy","",{t:"wave"})}<b>${CAST[k].nom}</b><small>${CAST[k].role}</small></div>`).join("")}</div></div>
  <p class="intro pop d3">Ton équipe t'aide à comprendre. Toi, tu tranches. À la fin, découvre quels candidats ont fait les mêmes choix que toi.</p>
  <div class="stack pop d4">
   <button class="btn big" onclick="${started&&S.moi?"go('map')":"go('mode')"}">${started?"Reprendre mon mandat":"Commencer"}</button>
   <button class="btn ghost" onclick="go('method')">Comment c'est calculé ?</button>
   ${started?`<div class="homeopts"><button class="btn ghost" onclick="go('mode')"><small>Rythme</small>${MODES[S.mode].nom} · ${Q.filter(q=>S.ch[q.id]).length}/${NQ()}</button><button class="btn ghost" onclick="go('avatar')"><small>Mon perso</small>${S.moi&&S.moi.g?G("Président","Présidente"):"À créer"}</button></div>`:""}
   ${started?`<button class="link" onclick="reset()">Tout recommencer</button>`:""}
  </div>
  <p class="fine">Ni un sondage, ni une consigne de vote. Aucun compte, rien n'est envoyé : tout reste sur ton téléphone. Personnages inventés.</p></div>`; };

V.mode=()=>{ const card=(k,ico,t)=>{ const m=MODES[k], n=m.ids?m.ids.length:QALL.length;
   return `<button class="mode ${S.mode===k&&S.modePicked?"on":""}" onclick="pickMode('${k}')"><span class="mi">${ico}</span><span class="mt"><b>${m.nom}</b><small>${m.par} · ${t}</small></span><span class="mn">${n}</span></button>`; };
 return `<div class="screen modes"><div class="tag">Ton mandat</div><h2 class="pop">Quel rythme pour tes 5 ans ?</h2>
  ${say("karim","Tu peux gouverner vite ou en profondeur. Plus tu prends de décisions, plus le portrait final sera fiable.")}
  <div class="stack pop d2">${card("rapide",'<svg viewBox="0 0 24 24" width="26" height="26"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#13234B"/></svg>',"environ 5 min")}${card("trimestriel",'<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="9" fill="#fff"/><path d="M12 12V3a9 9 0 0 1 9 9z" fill="#13234B"/></svg>',"environ 15 min")}${card("complet",'<svg viewBox="0 0 24 24" width="26" height="26"><path d="m12 2.5 2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z" fill="#fff"/></svg>',"environ 30 min")}</div>
  ${Object.keys(S.ch).length?`<p class="fine"><b>Tes ${Object.keys(S.ch).length} réponses sont gardées</b> quel que soit le rythme : tu reprends là où tu en es. Celles qui ne font pas partie du mode choisi sont mises de côté et reviennent si tu passes en Complet.</p><button class="link" onclick="go(S.prevMode||'map')">Garder mon rythme actuel</button>`:`<p class="fine">Tu pourras toujours changer de rythme en route : tes réponses sont gardées.</p>`}</div>`; };
V.avatar=()=>{ const m=S.moi||{g:null,skin:1,hair:0,st:"short"}; if(!S.moi) S.moi=m; setMoi(m);
 const sw=(arr,key,lab)=>`<div class="pick"><span>${lab}</span><div class="sws">${arr.map((c,i)=>`<button class="sw ${m[key]===i?"on":""}" style="background:${Array.isArray(c)?c[0]:c}" onclick="setAv('${key}',${i})" aria-label="${lab} ${i+1}"></button>`).join("")}</div></div>`;
 return `<div class="screen avatar">
  <div class="tag">Avant la photo officielle</div><h2 class="pop">Qui entre à l'Élysée ?</h2>
  <div class="portrait pop d1">${DECOR.shelves}${perso("moi","happy","big")}<div class="plaque">${m.g?G("Le Président","La Présidente"):"Président·e"} de la République</div></div>
  <div class="seg pop d2"><button class="${m.g==="f"?"on":""}" onclick="setAv('g','f')">Présidente</button><button class="${m.g==="m"?"on":""}" onclick="setAv('g','m')">Président</button></div>
  ${sw(SKINS,"skin","Peau")}
  <div class="pick"><span>Coiffure</span><div class="chips">${STYLES.map(s=>`<button class="chip ${m.st===s[0]?"on":""}" onclick="setAv('st','${s[0]}')">${s[1]}</button>`).join("")}</div></div>
  ${sw(HAIRS,"hair","Cheveux")}
  <button class="btn big gold" ${m.g?"":"disabled"} onclick="photo()">${m.g?"Prendre la photo officielle":"Choisis président ou présidente"}</button>
  <p class="fine">Ton apparence ne change rien au résultat.</p></div>`; };
V.elect=()=>`<div class="screen elect">
  <div class="rv rvscene" data-ab="ElectionNight" onclick="skipScene(this)" aria-label="Soirée électorale : c'est toi !"><div class="pfb">${DECOR.redrays}
  <div class="crowd">${["lea","sam","ines","marc","yuki","helene"].map((k,i)=>`<div class="fan" style="--i:${i}">${perso(k,"wow","",{loop:"cheering"})}</div>`).join("")}</div>
  <div class="tv"><div class="tvin"><div class="bandeau">ÉDITION SPÉCIALE</div><div class="count"><span>20:00</span></div><div class="tvme">${perso("moi","happy")}</div><div class="reveal">C'EST TOI !</div></div></div>
  <div class="confetti">${[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join("")}</div></div></div>
  <div class="esheet">
  <h2 class="pop d5">Dimanche 2 mai 2027, 20&nbsp;h</h2>
  ${say("karim",`Félicitations, ${TITRE()}. On a 5 ans et ${NQ()} dossiers brûlants. Je t'explique chaque fois, et c'est toi qui décides.`,{cls:"pop d5"})}
  <button class="btn big pop d5" onclick="go('map')">Entrer à l'Élysée</button></div></div>`;

V.map=()=>{ const nxt=Q.findIndex(q=>!S.ch[q.id]);
 return `<div class="screen map">${topbar()}<button class="modechip" onclick="go('mode')"><span>Rythme <b>${MODES[S.mode].nom}</b> · ${NQ()} décisions</span><u>Changer</u></button>
  ${ANNEES.map((y,ai)=>{ const qs=Q.map((q,i)=>({q,i})).filter(o=>o.q.an===ai);
   return `<section class="year y${ai}">${landSVG(ai)}<div class="yh"><b>${y.an}</b><div><h3>${y.titre}</h3><p>${y.sous}</p></div></div>
   <div class="path">${qs.map(({q,i},j)=>{ const st=S.ch[q.id]?"done":(i===nxt?"next":(i<nxt||nxt<0?"open":"lock"));
     return `<button class="node ${st}" style="--x:${[0,46,72,46,0,-46][j]}px" ${st==="lock"?"disabled":""} onclick="openQ(${i})">
      <span class="dot">${st==="done"?"✓":j+1}<span class="rv rvnode" data-ab="MapNode" data-state="${{lock:"locked",open:"open",next:"next",done:"done"}[st]}" data-theme="${themeKey(q.theme)}"${S.justDone===q.id?' data-t="complete"':""} aria-hidden="true"></span></span><span class="nt">${esc(q.theme)}</span>${st==="next"?`<span class="here"><span class="rv rvmark" data-ab="PlayerMarker" data-c="${S.moi?"moi":"lea"}"${S.justDone?' data-t="advance"':""} aria-hidden="true"><span class="pfb">${persoSVG(S.moi?"moi":"lea","happy")}</span></span></span>`:""}</button>`; }).join("")}</div></section>`; }).join("")}
  <div class="mapfoot">${nxt>=0?say("karim", nxt===0?`Voilà ta feuille de route, ${TITRE()}. On commence par les retraites : touche la première bulle.`:`Prochain dossier : ${Q[nxt].theme.toLowerCase()}. Format du vote : ${VOTE_NOM[fmtVote(nxt)].toLowerCase()}.`):say("karim","Mandat terminé. Les Français attendent ton bilan.",{mood:"wow"})}</div>
  ${nxt<0?`<button class="btn big gold" onclick="go('verdict')">Voir le verdict</button><button class="btn ghost" style="margin-top:12px" onclick="go('parcours')">Revoir mon parcours</button>`:""}</div>`; };

V.q=()=>{ const q=Q[S.qi], steps=stepsOf(q), st=steps[S.step];
  const dots=steps.map((s,i)=>`<i class="${i<S.step?"on":i===S.step?"cur":""}"></i>`).join("");
  const body=STEP[st](q); const last=st==="vote";
  return `<div class="screen q s-${st}">${topbar()}<div class="steps">${dots}</div><div class="slabel">${STEP_NOM[st]} · ${esc(ANNEES[q.an].an)} · ${esc(q.theme)}</div>
   <div class="qbody">${body}</div>
   ${!last&&st!=="quiz"?`<div class="nav"><button class="btn ghost" onclick="${S.step?"step(-1)":"go('map')"}">Retour</button><button class="btn" onclick="step(1)">Suivant</button></div>`:""}
   ${S.step<steps.length-1?`<button class="link skip" onclick="toVote()">Je connais le sujet : direct au vote</button>`:`<div class="nav"><button class="btn ghost" onclick="step(-1)">Revoir les infos</button></div>`}</div>`; };

const STEP={};
STEP.intro=q=>{ const f=fmtIntro(S.qi);
 if(f==="jt") return `<article class="une pop"><div class="une-mast"><b>${UNES[S.qi%4]}</b><small>${esc(ANNEES[q.an].an)} · N° ${S.qi+1} · 2,50 €</small></div>
   <span class="une-kick">Édition spéciale · ${esc(q.theme)}</span><h2>${esc(q.titre).replace(/ ([?!:;])/g,'\u00a0$1')}</h2>
   <div class="une-photo">${DECOR.facade}<span class="une-sam">${perso("sam","happy","talk")}</span></div><small class="une-leg">Notre envoyé spécial Sam, devant l'Élysée.</small>
   <div class="une-cols"><div><b class="r">La situation</b><p>${esc(q.hook)}</p><i></i><i></i></div><div><b class="b">Pourquoi ça te concerne</b><p>${esc(q.pourquoi)}</p><i></i></div></div></article>`;
 if(f==="sms") return `<div class="phone pop"><div class="ph-top">${perso("lea","happy")}<div><b>Léa</b><small>en ligne</small></div></div>
   <div class="ph-body"><div class="msg in" data-seq="0">Hé, t'as vu ? ${esc(q.titre)}</div><div class="msg in" data-seq="1">${esc(q.hook)}</div>
   <div class="msg out" data-seq="2">Et moi, ça me concerne comment ?</div><div class="msg in" data-seq="3">${esc(q.pourquoi)}</div><div class="typing" data-seq="4"><i></i><i></i><i></i></div></div></div>`;
 return `<div class="desk pop">${perso("karim","neutral","talk big")}<div class="folder"><div class="tab">DOSSIER ${S.qi+1}/${NQ()}</div><div class="stampu">URGENT</div><h2>${esc(q.titre)}</h2></div></div>
   ${say("karim",q.hook,{cls:"pop d1",noav:1})}<div class="postit pop d2"><b>Post-it de Léa</b><p>${esc(q.pourquoi)}</p></div>`; };
STEP.quiz=q=>{ const z=QUIZ[q.id], a=S.quiz[q.id], ok=a===z.ok;
 return `<div class="qhead2 pop"><h2>${esc(z.q).replace(/ ([?!:;])/g,'\u00a0$1')}</h2><div class="qboard">${DECOR.board}${perso("helene",a==null?"happy":ok?"happy":"wow","talk",{t:a==null?null:ok?"cheer":"surprise"})}</div></div>
  <div class="quiz">${z.c.map((c,i)=>`<button class="qa ${a!=null?(i===z.ok?"ok":(i===a?"ko":"dim")):""}" ${a!=null?"disabled":""} onclick="answer(${i},this)">${esc(c)}${a!=null&&i===z.ok?'<span class="juste">Juste&nbsp;!</span>':""}</button>`).join("")}</div>
  ${a!=null?`<div class="card qexp pop"><span class="kick">Hélène · économiste</span><b class="qv">${ok?"Bien vu !":"Pas tout à fait : beaucoup de gens se trompent sur celui-là."}${ok?' <span class="xpw">+15 XP</span>':""}</b>
   ${q.faits.map(f=>`<div class="qf"><p>${esc(f[0])}</p>${src(f[1],f[2])}</div>`).join("")}</div>
   <div class="nav"><button class="btn ghost" onclick="step(-1)">Retour</button><button class="btn" onclick="step(1)">Suivant</button></div>`:""}`; };
function bigNum(t){ const m=t.match(/(\d[\d\s ]*(?:[,.]\d+)?)\s*(%|milliards?|millions?|€|euros?|ans?|points?|fois|heures?|jours?|km|tonnes?|°C)?/i);
  if(!m) return null; let u=(m[2]||"").toLowerCase(); u=u.startsWith("milliard")?" Md":u.startsWith("million")?" M":u.startsWith("euro")||u==="€"?" €":u==="%"?" %":u?" "+u:"";
  return (m[1].trim()+u).replace(/\s+/g," ").toUpperCase(); }
STEP.faits=q=>`<h2 class="ftitle pop">Ce qu'il faut savoir</h2>
  <div class="stats">${q.faits.map((f,i)=>{ const n=bigNum(f[0]); return `<div class="stat pop d${i}"><b>${n||"N°"+(i+1)}</b><div><p>${esc(f[0])}</p>${src(f[1],f[2])}</div></div>`; }).join("")}</div>
  ${say("helene","Garde ces chiffres en tête : chaque option du vote en tire un.",{cls:"pop d3"})}`;
STEP.debat=q=>`<div class="vs pop"><div class="side l">${perso("ines","happy","talk big")}<span class="pl g">Pour · Inès</span></div><div class="bolt">VS</div><div class="side r">${perso("marc","neutral","talk big")}<span class="pl r">Contre · Marc</span></div></div>
  ${say("ines",q.pour[0],{noav:1,kick:"Inès · pour",extra:`<small class="att">Position défendue par : ${esc(q.pour[1])}</small>`})}
  ${say("marc",q.contre[0],{noav:1,kick:"Marc · contre",extra:`<small class="att">Position défendue par : ${esc(q.contre[1])}</small>`})}`;
const FLAGS={
 "Allemagne":'<rect width="34" height="8" fill="#111"/><rect y="8" width="34" height="7" fill="#E5392B"/><rect y="15" width="34" height="7" fill="#F5C431"/>',
 "Suède":'<rect width="34" height="22" fill="#2E6BC6"/><rect x="10" width="6" height="22" fill="#F5C431"/><rect y="8" width="34" height="6" fill="#F5C431"/>',
 "Finlande":'<rect width="34" height="22" fill="#FBF6EA"/><rect x="10" width="6" height="22" fill="#2F5BEA"/><rect y="8" width="34" height="6" fill="#2F5BEA"/>',
 "Norvège":'<rect width="34" height="22" fill="#E5392B"/><rect x="8" width="10" height="22" fill="#FBF6EA"/><rect y="6" width="34" height="10" fill="#FBF6EA"/><rect x="11" width="4" height="22" fill="#1C2554"/><rect y="9" width="34" height="4" fill="#1C2554"/>',
 "Danemark":'<rect width="34" height="22" fill="#E5392B"/><rect x="10" width="5" height="22" fill="#FBF6EA"/><rect y="8.5" width="34" height="5" fill="#FBF6EA"/>',
 "Islande":'<rect width="34" height="22" fill="#2F5BEA"/><rect x="8" width="10" height="22" fill="#FBF6EA"/><rect y="6" width="34" height="10" fill="#FBF6EA"/><rect x="11" width="4" height="22" fill="#E5392B"/><rect y="9" width="34" height="4" fill="#E5392B"/>',
 "Royaume-Uni":'<rect width="34" height="22" fill="#1C2554"/><path d="M0 0L34 22M34 0L0 22" stroke="#FBF6EA" stroke-width="4"/><rect x="13" width="8" height="22" fill="#FBF6EA"/><rect y="7" width="34" height="8" fill="#FBF6EA"/><rect x="15" width="4" height="22" fill="#E5392B"/><rect y="9" width="34" height="4" fill="#E5392B"/>',
 "Espagne":'<rect width="34" height="22" fill="#E5392B"/><rect y="5.5" width="34" height="11" fill="#F5C431"/>',
 "Italie":'<rect width="12" height="22" fill="#2E9B5E"/><rect x="11" width="12" height="22" fill="#FBF6EA"/><rect x="22" width="12" height="22" fill="#E5392B"/>',
 "Belgique":'<rect width="12" height="22" fill="#111"/><rect x="11" width="12" height="22" fill="#F5C431"/><rect x="22" width="12" height="22" fill="#E5392B"/>',
 "Canada":'<rect width="34" height="22" fill="#FBF6EA"/><rect width="8" height="22" fill="#E5392B"/><rect x="26" width="8" height="22" fill="#E5392B"/><path d="M17 5 L20 11 L17 9.5 L14 11Z M17 9 V17" stroke="#E5392B" stroke-width="2" fill="#E5392B"/>',
 "États-Unis":'<rect width="34" height="22" fill="#FBF6EA"/>'+[0,1,2,3,4,5].map(i=>`<rect y="${i*3.7}" width="34" height="1.9" fill="#E5392B"/>`).join("")+'<rect width="15" height="11" fill="#1C2554"/>',
 "Pays-Bas":'<rect width="34" height="8" fill="#E5392B"/><rect y="7" width="34" height="8" fill="#FBF6EA"/><rect y="15" width="34" height="7" fill="#2F5BEA"/>',
 "Pologne":'<rect width="34" height="11" fill="#FBF6EA"/><rect y="11" width="34" height="11" fill="#E5392B"/>',
 "Portugal":'<rect width="34" height="22" fill="#E5392B"/><rect width="13" height="22" fill="#2E9B5E"/><circle cx="13" cy="11" r="4.5" fill="#F5C431"/>',
 "Suisse":'<rect width="34" height="22" fill="#E5392B"/><rect x="14.5" y="4" width="5" height="14" fill="#FBF6EA"/><rect x="10" y="8.5" width="14" height="5" fill="#FBF6EA"/>'};
const flag=n=>n.split(/ et /).filter(x=>FLAGS[x]).map(x=>`<svg class="flag" viewBox="0 0 34 22" aria-hidden="true">${FLAGS[x]}</svg>`).join("");
STEP.ailleurs=q=>`<div class="ahead pop"><h2>Ce qu'ils ont fait</h2>${perso("yuki","happy","talk")}</div>
  <p class="alead">Yuki, notre diplomate, a regardé ce que d'autres pays ont tenté, et surtout ce que ça a donné. Aucun modèle n'est parfait.</p>
  <div class="passport">${q.ailleurs.map((a,i)=>{ const r=(AILLEURS[q.id]||[])[i]; const v=r&&VERDICTS[r[1]];
    return `<div class="stampc" style="--d:${0.3+i*0.3}s"><div class="sh">${flag(a[0])}<b>${esc(a[0])}</b>${r?`<span class="vd">${v[0].replace(/^Bilan\s*/i,"")}</span>`:""}</div>
     <p class="did">${esc(a[1])}</p>
     ${r?`<p class="res"><b>Le bilan :</b> ${esc(r[0])}</p>${src(r[2],r[3])}`:""}</div>`; }).join("")}</div>`;
STEP.vote=q=>{ const f=fmtVote(S.qi), O=["A","B","C"];
 const det=k=>{ const o=q.opts[k]; return `<p><span class="pl g">Point fort</span>${esc(o.fort)}</p><p><span class="pl r">Point faible</span>${esc(o.faible)}</p><p class="rep"><span class="pl b">Ses défenseurs répondent</span>${esc(o.rep)}</p>`; };
 const extra=`<label class="imp"><input type="checkbox" class="vh" ${S.imp[q.id]?"checked":""} onchange="S.imp['${q.id}']=this.checked;save()"><svg class="heart" viewBox="0 0 32 30" aria-hidden="true"><path d="M16 28 C6 20 2 15 2 9.5 A7 7 0 0 1 16 6 A7 7 0 0 1 30 9.5 C30 15 26 20 16 28Z"/></svg><span>Ce sujet me tient à cœur<small>il compte double dans le verdict</small></span></label><button class="link" onclick="vote('X')">Je ne sais pas, je passe</button>`;
 const head=`<div class="vhemi pop">${DECOR.hemiback}${hemicycle(0)}${f!=="ministres"?`<span class="vkarim">${perso("karim","neutral")}</span>`:""}</div><div class="vtitle pop"><h2>${esc(q.titre).replace(/ ([?!:;])/g,'\u00a0$1')}</h2><p>${esc(q.hook).replace(/ ([?!:;])/g,'\u00a0$1')}</p></div>`;
 const hint=t=>`<p class="vhint"><span class="vfmt">${VOTE_NOM[f]}</span>${t}</p>`;
 if(f==="cartes") return `${head}${hint("Touche une option pour voir ses forces et ses faiblesses.")}
   ${O.map((k,i)=>`<div class="opt pop d${i}" id="o${k}" onclick="peek('${k}')"><div class="oh"><span class="ol">${k}</span><b>${esc(q.opts[k].t)}</b></div><div class="od">${det(k)}<button class="btn" onclick="event.stopPropagation();vote('${k}')">Signer la loi</button></div></div>`).join("")}${extra}`;
 if(f==="ministres"){ const mins=["helene","karim","yuki"];
   return `${head}${hint("Chaque ministre défend une option. Écoute-les, puis suis celui qui te convainc.")}
   <div class="table">${O.map((k,i)=>`<button class="min ${S.pick===k?"sel":""}" onclick="pickMin('${k}')">${perso(mins[i],S.pick===k?"happy":"neutral","talk")}<span class="ol">${k}</span></button>`).join("")}</div>
   <div id="minsay">${S.pick?`${say(mins[O.indexOf(S.pick)],q.opts[S.pick].t,{noav:1,extra:`<div class="dt">${det(S.pick)}</div>`})}<button class="btn" onclick="vote('${S.pick}')">Je suis ce conseil</button>`:`<p class="hint center">Personne n'a encore parlé.</p>`}</div>${extra}`; }
 if(f==="curseur") return `${head}${hint("Fais glisser le curseur : A à gauche, C à droite, le compromis au milieu.")}
   <div class="slider pop"><div class="sl-lab"><span>A</span><span>B · compromis</span><span>C</span></div>
    <input type="range" min="0" max="2" step="1" value="${O.indexOf(S.pick||"B")}" oninput="slide(this.value)" aria-label="Position">
    <div id="sldet" class="card"><b>${esc(q.opts[S.pick||"B"].t)}</b>${det(S.pick||"B")}</div>
    <button class="btn" onclick="vote(S.pick||'B')">Je valide cette position</button></div>${extra}`;
 return `${head}${hint("Prends un bulletin pour le lire, puis glisse-le dans l'urne.")}
   <div class="ballots">${O.map((k,i)=>`<button class="bal ${S.pick===k?"up":""}" style="--r:${[-5,0,5][i]}deg" onclick="pickBal('${k}')"><span class="ol">${k}</span><b>${esc(q.opts[k].t)}</b></button>`).join("")}</div>
   <div class="mini-urne">${ICON.urne}</div>
   ${S.pick?`<div class="card pop">${det(S.pick)}<button class="btn" onclick="vote('${S.pick}')">Glisser dans l'urne</button></div>`:""}${extra}`; };

V.drop=()=>{ const n=Object.keys(S.ch).filter(k=>S.ch[k]!=="X").length, o=S.ch[Q[S.qi].id]||"";
 return `<div class="screen drop" onclick="dropSkip()">${DECOR.bluerays}<div class="dz">
  <p class="dz-k">Assemblée nationale · scrutin n° ${S.qi+1}</p>
  <div class="dz-urne"><div class="dz-env"><svg viewBox="0 0 120 84" aria-hidden="true"><rect x="4" y="4" width="112" height="76" rx="6" fill="#F1E3B8" stroke="#1C2554" stroke-width="5"/><path d="M4 10 L60 48 L116 10" fill="none" stroke="#1C2554" stroke-width="5"/><text x="60" y="74" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="22" fill="#E5392B">${o}</text></svg></div>
   <div class="dz-box"><span class="dz-lid"><i></i></span><span class="dz-glass">${[...Array(Math.min(n-1,9))].map((_,i)=>`<b style="--x:${(i*37)%70}%;--r:${(i*29)%40-20}deg;--y:${Math.floor(i/3)*14}px"></b>`).join("")}<b class="dz-new"></b></span><span class="dz-cnt">N° <em id="dzn">${String(Math.max(n-1,0)).padStart(5,"0")}</em></span></div></div>
  <h1 class="dz-stamp">A voté&nbsp;!</h1><p class="dz-sub">Ta loi part à l'Assemblée…</p></div></div>`; };
function dropSkip(){ clearTimeout(window._dz); go("result"); }

const UNES=["LE QUOTIDIEN","L'ÉCHO NATIONAL","LA DÉPÊCHE DU MATIN","LE JOURNAL DU SOIR"];
V.result=()=>{ const q=Q[S.qi], o=S.ch[q.id];
 if(o==="X") return `<div class="screen q">${topbar()}${say("lea","Tu as passé ce sujet. C'est ok de ne pas avoir d'avis, il ne comptera pas dans le verdict.",{mood:"neutral"})}<div class="card lesson"><b>À retenir</b><p>${esc(q.lecon)}</p></div><button class="btn big" onclick="next()">Continuer</button></div>`;
 const op=q.opts[o], sup=supporters(q,o).length;
 const climat=q.opts.A.c||q.opts.B.c||q.opts.C.c;
 const k=(lab,v,none)=>none?`<div class="kpi"><small>${lab}</small><b class="big eq">–</b><span>sans effet</span></div>`:`<div class="kpi"><small>${lab}</small><b class="big ${v>0?"up":v<0?"down":"eq"}">${v>0?"▲":v<0?"▼":"="}</b><span>${v>0?"mieux":v<0?"pire":"stable"}</span></div>`;
 return `<div class="screen q res">${topbar()}
  <span class="tag">Ton choix · ${o}</span><h1 class="restitle pop">${esc(op.t)}</h1>
  <div class="vhemi big pop d1">${DECOR.hemiback}${hemicycle(sup)}</div>
  <p class="supline pop d2">Candidats qui défendent ce choix&nbsp;: <b>${sup} sur 8</b><small>Leurs noms restent cachés jusqu'au verdict.</small></p>
  <div class="grid3 pop d3">${k("Budget",op.b)}${k("Climat",op.c,!climat)}<div class="kpi"><small>XP</small><b class="big">+20</b><span>décision</span></div></div>
  ${say("karim",sup>=5?"Ça devrait passer à l'Assemblée sans trop de casse.":sup>=3?"Ça passera, mais il faudra négocier.":"Accroche-toi : on va devoir convaincre presque tout le monde.",{mood:sup>=5?"happy":sup>=3?"neutral":"wow",cls:"pop d4",t:sup>=5?"nod":sup>=3?null:"surprise"})}
  <div class="card lesson pop d5"><b>À retenir</b><p>${esc(q.lecon)}</p></div>
  <p class="fine">Les flèches sont des tendances indicatives, pas des prévisions chiffrées.</p>
  <button class="btn big" onclick="next()">Continuer</button></div>`; };

V.bilan=()=>{ const an=Q[S.qi].an, y=ANNEES[an], s=yearStats(an), ev=EVENTS.find(e=>e.an===an&&e.si(s));
 return `<div class="screen bilan">${topbar()}<div class="confetti">${[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join("")}</div>
  <div class="calwrap">${DECOR.yrays}<div class="cal pop"><span class="cal-d">31 décembre</span><b>${y.an}</b></div></div><h2 class="pop">Bilan : ${esc(y.titre)}</h2>
  <div class="grid3 pop d1"><div class="kpi"><small>Budget</small><b class="big">${s.b>0?"+":""}${s.b}</b></div><div class="kpi"><small>Climat</small><b class="big">${s.c>0?"+":""}${s.c}</b></div><div class="kpi"><small>Soutiens</small><b class="big">${Math.round(s.soutien*100)} %</b></div></div>
  ${ev?`<span class="tag red pop d2">Fait réel</span><h2 class="evt pop d2">${esc(ev.titre)}</h2>
  ${say("sam",ev.txt,{extra:src(ev.src[0],ev.src[1]),cls:"pop d3"})}`:""}
  <button class="btn big pop d4" onclick="go(${an===4?"'verdict'":"'map'"})">${an===4?"Fin du mandat : le verdict":"Année suivante"}</button></div>`; };

V.verdict=()=>{ const m=match(), n=totals().n;
 if(!n) return `<div class="screen">${topbar()}<h2>Pas encore de choix</h2><button class="btn" onclick="go('map')">Retour à la carte</button></div>`;
 return `<div class="screen verdict"><div class="confetti">${[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join("")}</div>
  <div class="vhead">${DECOR.redrays}${DECOR.city}<div class="tag">2 mai 2032 · 20 h</div><h2 class="pop">Ton mandat ressemble à…</h2>
   <div class="podium">${[1,0,2].filter(i=>m[i]).map(i=>{ const r=m[i]; return `<div class="affiche ${i===0?"first":""}" style="--d:${[0.2,0.35,0.5][i]}s"><div class="in"><div class="back"><div class="rk">${i+1}</div><div class="nm">${esc(CANDS[r.k].nom)}</div><div class="pt">${esc(CANDS[r.k].parti)}</div><div class="pc">${r.pct} %</div><small>${r.agree}/${r.cnt} choix identiques</small><button class="link" onclick="detail('${r.k}')">Détail et sources</button></div></div></div>`; }).join("")}</div></div>
  ${say("karim",`Mode ${MODES[S.mode].nom.toLowerCase()}. Sur tes ${n} décisions, voici les candidats de 2027 qui auraient fait les choix les plus proches. Rang final : ${rang().nom}.`)}
  <div class="others">${m.slice(3).map((r,i)=>`<div class="vrow"><span class="rk">${i+4}</span><div class="vn"><b>${esc(CANDS[r.k].nom)}</b><small>${esc(CANDS[r.k].parti)} · ${r.agree}/${r.cnt} choix identiques</small></div><span class="pc">${r.pct} %</span><button class="link" onclick="detail('${r.k}')" aria-label="Détail pour ${esc(CANDS[r.k].nom)}">Détail</button></div>`).join("")}</div>
  ${say("lea","Ce n'est ni un sondage ni une consigne de vote : ça compare tes choix aux positions publiques au 23 novembre 2026. Va lire leurs programmes !",{right:1,color:"red"})}
  ${S.mode!=="complet"?`<div class="card deeper"><b>${S.mode==="rapide"?"Avec 5 décisions, ce résultat reste très indicatif.":"Envie d'un portrait plus précis ?"}</b><p>Tes réponses sont gardées : il te reste seulement les nouvelles décisions.</p>
   ${S.mode==="rapide"?`<button class="btn" onclick="upgrade('trimestriel')">Passer en Trimestriel (+10 décisions)</button>`:""}<button class="btn ghost" onclick="upgrade('complet')">Passer en Complet (+${30-NQ()} décisions)</button></div>`:""}
  <div class="nav col"><button class="btn gold" onclick="go('parcours')">Revoir mon parcours</button><button class="btn" onclick="share()">Partager mon résultat</button><button class="btn ghost" onclick="go('method')">Méthode et sources</button><button class="link" onclick="reset()">Refaire un mandat</button></div>
  <div id="det"></div></div>`; };

V.parcours=()=>{
 const done=Q.filter(q=>S.ch[q.id]), voted=done.filter(q=>S.ch[q.id]!=="X");
 const cons=voted.filter(q=>supporters(q,S.ch[q.id]).length>=5).length, solo=voted.filter(q=>supporters(q,S.ch[q.id]).length<=2).length;
 const qz=Object.keys(S.quiz||{}), ok=qz.filter(k=>QUIZ[k]&&S.quiz[k]===QUIZ[k].ok).length;
 let b=0,c=0; const pts=Q.map(q=>{ const o=S.ch[q.id]; if(o&&o!=="X"){ b+=q.opts[o].b; c+=q.opts[o].c; } return [b,c]; });
 const W=300,H=80, xs=i=>10+i*(W-20)/29, ys=v=>H/2-v*3.2;
 const line=(k,col)=>`<polyline fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" points="${pts.map((p,i)=>xs(i).toFixed(1)+","+ys(p[k]).toFixed(1)).join(" ")}"/>`;
 const arrow=v=>v>0?`<span class="up">▲</span>`:v<0?`<span class="down">▼</span>`:`<span class="eq">=</span>`;
 return `<div class="screen parcours"><button class="btn ghost sm" onclick="go('verdict')">Retour au verdict</button>
  <h2 class="pop">Mon parcours</h2>
  ${say("karim",`Cinq ans résumés en un coup d'œil, ${TITRE()}. Touche une décision pour revoir les options et ce qu'il fallait retenir.`)}
  <div class="grid3 pop d1"><div class="kpi"><small>Larges soutiens</small><b class="big">${cons}</b></div><div class="kpi"><small>Choix minoritaires</small><b class="big">${solo}</b></div><div class="kpi"><small>Quiz réussis</small><b class="big">${ok}/${qz.length}</b></div></div>
  <div class="card trend pop d2"><b>Ton budget et ton climat, décision après décision</b>
   <svg viewBox="0 0 ${W} ${H}" class="spark"><line x1="10" x2="${W-10}" y1="${H/2}" y2="${H/2}" stroke="#DDE4F7" stroke-width="2" stroke-dasharray="4 4"/>${[1,2,3,4].map(y=>`<line x1="${xs(y*6-0.5)}" x2="${xs(y*6-0.5)}" y1="4" y2="${H-4}" stroke="#EEF2FF" stroke-width="2"/>`).join("")}${line(0,"#E5392B")}${line(1,"#2F5BEA")}</svg>
   <div class="leg"><span><i style="background:#E5392B"></i>Budget (${b>0?"+":""}${b})</span><span><i style="background:#2F5BEA"></i>Climat (${c>0?"+":""}${c})</span><span class="hint">tendances indicatives</span></div></div>
  ${ANNEES.map((y,ai)=>`<div class="pyear"><b>${y.an}</b> ${esc(y.titre)}</div>
   ${Q.map((q,i)=>({q,i})).filter(o=>o.q.an===ai).map(({q,i})=>{ const o=S.ch[q.id];
     if(!o) return `<div class="pc-item off"><span class="ol">?</span><div><small>${esc(q.theme)}</small><b>${esc(q.titre)}</b><p>Pas encore décidé</p></div></div>`;
     const sup=o==="X"?null:supporters(q,o).length, op=o==="X"?null:q.opts[o];
     return `<details class="pc-item ${o==="X"?"skip":""}"><summary><span class="ol ${o!=="X"?"on":""}">${o==="X"?"–":o}</span><div><small>${esc(q.theme)}${S.imp[q.id]?' · <span class="star">compte double</span>':""}</small><b>${esc(q.titre)}</b>
      <p>${o==="X"?"Sujet passé":esc(op.t)}</p>${o==="X"?"":`<div class="mini">Soutiens ${sup}/8 · Budget ${arrow(op.b)} · Climat ${q.opts.A.c||q.opts.B.c||q.opts.C.c?arrow(op.c):"–"}${QUIZ[q.id]&&S.quiz[q.id]!=null?` · Quiz ${S.quiz[q.id]===QUIZ[q.id].ok?"✓":"✗"}`:""}</div>`}</div></summary>
      <div class="pc-det">${["A","B","C"].map(k=>`<div class="pc-opt ${k===o?"mine":""}"><span class="ol">${k}</span><div><b>${esc(q.opts[k].t)}</b><small>${supporters(q,k).length}/8 candidats</small></div></div>`).join("")}
       <div class="card lesson"><b>À retenir</b><p>${esc(q.lecon)}</p></div>
       <button class="btn ghost" onclick="S.back='parcours';openQ(${i})">Rouvrir le dossier</button></div></details>`; }).join("")}`).join("")}
  <button class="btn big" onclick="go('verdict')">Retour au verdict</button></div>`; };
V.method=()=>`<div class="screen method"><button class="btn ghost sm" onclick="go(S.prev||'home')">Retour</button>
 <h2>Comment c'est calculé</h2>
 <div class="card"><b>Les candidats</b><p>Les 8 candidats déclarés les mieux placés dans les sondages de novembre 2026 : ${KEYS.map(k=>esc(CANDS[k].nom)).join(", ")}. Leurs noms sont cachés pendant le jeu.</p></div>
 <div class="card"><b>Les positions</b><p>Elles viennent de la lecture éditoriale de <a href="https://www.france-vote.fr/comparateur" target="_blank" rel="noopener">France-Vote</a> (23 novembre 2026), fondée sur les programmes, les votes et les déclarations. Quand une source est citée, elle est affichée. Sinon la position est marquée « non sourcée » et compte pour moitié.</p></div>
 <div class="card"><b>Les options</b><p>A = soutien net, B = position intermédiaire, C = opposition nette. Quel que soit le format de vote (cartes, carte à glisser, ministres, curseur, bulletin), ce sont toujours ces trois options. Jouer exactement le programme d'un candidat donne 100 % avec lui.</p></div>
 <div class="card"><b>Les modes</b><p>Rapide (5 décisions), Trimestriel (15) ou Complet (30). Les décisions des modes courts ont été choisies pour couvrir des thèmes variés et pour que les 8 candidats gardent des profils tous différents. Moins il y a de décisions, plus le résultat est indicatif.</p></div>
 <div class="card"><b>Le score</b><p>Même option : 1 point. Options voisines : ½. Opposées : 0. « Compte beaucoup » double le poids. Les sujets passés ne comptent pas. Les XP et les quiz ne changent rien au résultat.</p></div>
 <div class="card"><b>Les personnages</b><p>Léa, Karim, Hélène, Sam, Yuki, Inès et Marc sont inventés. Ils ne représentent aucun parti et présentent toujours les arguments des deux côtés.</p></div>
 <div class="card"><b>Ton personnage</b><p>Président ou présidente, apparence : c'est toi qui choisis. Ça ne change rien au calcul.</p></div>
 <div class="card"><b>Tes données</b><p>Aucun compte, aucun envoi. Tout reste dans ton navigateur.</p></div>
 <button class="link" onclick="reset()">Effacer mes réponses</button></div>`;

// ───────── moteur
function render(){ const jd=S.screen==="map"&&S.justDone; if(S.moi) setMoi(S.moi); if(!S.modePicked&&!Object.keys(S.ch).length&&!["home","method","mode"].includes(S.screen)) S.screen="mode";
  else if((S.screen!=="home"&&S.screen!=="avatar"&&S.screen!=="method"&&S.screen!=="mode")&&(!S.moi||!S.moi.g)) S.screen="avatar"; $("#app").innerHTML=V[S.screen](); window.scrollTo(0,0); save(); afterRender(); if(jd) S.justDone=null; }
function go(s){ if(s==="method") S.prev=S.screen; if(s==="mode"&&S.screen!=="mode") S.prevMode=S.screen==="home"?"home":"map"; S.screen=s; render(); }
function openQ(i){ S.qi=i; S.step=0; S.pick=null; go("q"); }
function step(d){ const n=stepsOf(Q[S.qi]).length, key=Q[S.qi].id+":"+S.step; S.vu=S.vu||{}; if(d>0&&!S.vu[key]){ S.vu[key]=1; addXP(5); } S.step=Math.max(0,Math.min(n-1,S.step+d)); S.pick=null; render(); }
function toVote(){ S.step=stepsOf(Q[S.qi]).length-1; S.pick=null; render(); }
function peek(k){ document.querySelectorAll(".opt").forEach(e=>e.classList.toggle("open",e.id==="o"+k&&!e.classList.contains("open"))); }
function pickMin(k){ S.pick=k; render(); setTimeout(()=>$("#minsay")&&$("#minsay").scrollIntoView({behavior:"smooth",block:"center"}),80); }
function pickBal(k){ S.pick=k; render(); }
function slide(v){ const k=["A","B","C"][+v], q=Q[S.qi]; S.pick=k; const o=q.opts[k];
  $("#sldet").innerHTML=`<b>${esc(o.t)}</b><p><span class="pl g">Point fort</span>${esc(o.fort)}</p><p><span class="pl r">Point faible</span>${esc(o.faible)}</p><p class="rep"><span class="pl b">Ses défenseurs répondent</span>${esc(o.rep)}</p>`; $("#sldet").classList.remove("pulse"); void $("#sldet").offsetWidth; $("#sldet").classList.add("pulse"); }
function answer(i,el){ const z=QUIZ[Q[S.qi].id]; S.quiz[Q[S.qi].id]=i; if(i===z.ok){ addXP(15,el); } render(); if(i===z.ok) burst(); else { const b=document.querySelectorAll(".qa")[i]; b&&b.classList.add("shake"); } }
const themeKey = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function vote(k){ const first=!S.ch[Q[S.qi].id]; if(first&&k!=="X") S.justDone=Q[S.qi].id; S.ch[Q[S.qi].id]=k; S.pick=null; if(k!=="X"&&first) S.xp+=20; save(); if(k==="X"){ go("result"); return; } go("drop");
  const n=Object.keys(S.ch).filter(x=>S.ch[x]!=="X").length, rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(()=>{ const e=document.getElementById("dzn"); if(e) e.textContent=String(n).padStart(5,"0"); }, rm?0:1150);
  clearTimeout(window._dz); window._dz=setTimeout(()=>{ if(S.screen==="drop") go("result"); }, rm?900:2700); }
function next(){ if(S.back==="parcours"){ S.back=null; go("parcours"); return; } const q=Q[S.qi], yd=Q.filter(x=>x.an===q.an).every(x=>S.ch[x.id]);
  if(yd&&S.seenYear<q.an){ S.seenYear=q.an; go("bilan"); return; } if(Q.findIndex(x=>!S.ch[x.id])<0){ go("verdict"); return; } go("map"); }
function skipScene(el){ el.classList.add("skipped"); const s=el._rv; const t=s&&s.inst&&s.inst.trigger("skip"); if(t) t.trigger(); }
function pickMode(m){ setMode(m); S.modePicked=1; save(); if(RV.ok) rvPrewarm(); go(S.moi&&S.moi.g?(Object.keys(S.ch).length?"map":"elect"):"avatar"); }
function upgrade(m){ setMode(m); if(RV.ok) rvPrewarm(); S.seenYear=-1; save(); go("map"); }
function setAv(k,v){ S.moi[k]=v; if(k==="g"&&!S.moi.stTouched) S.moi.st=(v==="f"?"long":"short"); if(k==="st") S.moi.stTouched=1; setMoi(S.moi); const y=window.scrollY; render(); window.scrollTo(0,y); }
function photo(){ const f=document.createElement("div"); f.className="flash"; document.body.appendChild(f); setTimeout(()=>{ f.remove(); go(Object.keys(S.ch).length?"map":"elect"); },450); }
function reset(){ S=fresh(); setMode("complet"); if(RV.ok) rvPrewarm(); try{localStorage.removeItem("mandat27v2");}catch(e){} render(); }
function burst(){ const c=document.createElement("div"); c.className="confetti fixed"; c.innerHTML=[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join(""); document.body.appendChild(c); setTimeout(()=>c.remove(),2600); }

let typers=[]; let typed=new Set(), typedKey="";
// ───────── carte : un monument de Paris par année, chemin qui relie vraiment les étapes
const INK="#1C2554", PAP="#FBF6EA", STN="#D9CDB4";
const tree=(x,y,r=13)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#3E9B5C" stroke="${INK}" stroke-width="2.5"/><circle cx="${x-4}" cy="${y-4}" r="${r*.4}" fill="#5CB877"/><rect x="${x-2}" y="${y+r-2}" width="4" height="9" fill="${INK}"/>`;
const flagS=(x,y)=>`<rect x="${x-1}" y="${y}" width="2.5" height="26" fill="${INK}"/><rect x="${x+1}" y="${y}" width="6" height="12" fill="#2F5BEA"/><rect x="${x+7}" y="${y}" width="6" height="12" fill="${PAP}"/><rect x="${x+13}" y="${y}" width="6" height="12" fill="#E5392B"/>`;
const LANDS=[
 // 2027 · l'Élysée
 `<path d="M8 92 L20 70 H120 L132 92Z" fill="#2F5BEA" stroke="${INK}" stroke-width="3"/><rect x="14" y="90" width="112" height="56" fill="${PAP}" stroke="${INK}" stroke-width="3"/><path d="M44 92 L70 74 L96 92Z" fill="${PAP}" stroke="${INK}" stroke-width="3"/>${[50,62,74,86].map(x=>`<rect x="${x}" y="96" width="5" height="50" fill="${INK}"/>`).join("")}${[20,32,102,114].map(x=>`<path d="M${x} 130 V110 a4 4 0 0 1 8 0 V130Z" fill="#F5C431" stroke="${INK}" stroke-width="2"/>`).join("")}${flagS(70,46)}${tree(10,150,12)}${tree(132,150,12)}`,
 // 2028 · la Seine et un pont
 `<path d="M0 104 Q70 92 140 104 V140 Q70 128 0 140Z" fill="#2F5BEA" stroke="${INK}" stroke-width="3"/><path d="M14 118 Q70 108 126 118" stroke="${PAP}" stroke-width="2" fill="none" opacity=".6"/><rect x="22" y="94" width="96" height="12" rx="3" fill="${STN}" stroke="${INK}" stroke-width="2.5"/>${[28,58,88].map(x=>`<path d="M${x} 106 v20 a12 9 0 0 1 24 0 v-20" fill="${STN}" stroke="${INK}" stroke-width="2.5"/>`).join("")}<path d="M88 146 h32 l-6 8 h-20Z" fill="${PAP}" stroke="${INK}" stroke-width="2"/>${tree(20,72)}${tree(116,70)}`,
 // 2029 · le Palais Bourbon
 `<rect x="10" y="96" width="120" height="52" fill="${PAP}" stroke="${INK}" stroke-width="3"/><path d="M30 98 L70 70 L110 98Z" fill="${PAP}" stroke="${INK}" stroke-width="3"/>${[34,46,58,70,82,94,106].map(x=>`<rect x="${x}" y="102" width="5" height="46" fill="${INK}"/>`).join("")}<rect x="4" y="146" width="132" height="8" fill="${STN}" stroke="${INK}" stroke-width="2.5"/>${flagS(68,44)}`,
 // 2030 · la tour Eiffel
 `<path d="M70 16 L78 60 L96 150 H82 Q70 118 58 150 H44 L62 60Z" fill="#E5392B" stroke="${INK}" stroke-width="3"/><path d="M60 72 H80 M54 104 H86" stroke="${INK}" stroke-width="3"/><rect x="66" y="6" width="8" height="12" fill="${INK}"/>${tree(20,140)}${tree(120,140)}`,
 // 2031 · l'Arc de triomphe
 `<rect x="24" y="66" width="92" height="84" fill="${PAP}" stroke="${INK}" stroke-width="3"/><rect x="18" y="56" width="104" height="14" fill="${STN}" stroke="${INK}" stroke-width="3"/><path d="M52 150 V108 a18 18 0 0 1 36 0 V150Z" fill="#2F5BEA" stroke="${INK}" stroke-width="3"/><rect x="30" y="76" width="80" height="6" fill="${INK}" opacity=".3"/>${flagS(68,62+40)}`];
function landSVG(ai){ return `<svg class="land" viewBox="0 0 140 160" aria-hidden="true">${LANDS[ai%LANDS.length]}</svg>`; }
function drawPaths(){
  document.querySelectorAll(".map .path").forEach(p=>{
    p.querySelector(".route")&&p.querySelector(".route").remove();
    const pr=p.getBoundingClientRect(), pts=[...p.querySelectorAll(".node .dot")].map(d=>{ const r=d.getBoundingClientRect(); return [r.left+r.width/2-pr.left, r.top+r.height/2-pr.top]; });
    if(pts.length<2) return;
    const nDone=p.querySelectorAll(".node.done").length;
    const seg=(a,b)=>{ let d=`M${a[0]} ${a[1]}`; for(let i=a[2];i<b;i++){ const p0=pts[Math.max(i-1,0)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(i+2,pts.length-1)];
      d+=` C${p1[0]+(p2[0]-p0[0])/6} ${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6} ${p2[1]-(p3[1]-p1[1])/6} ${p2[0]} ${p2[1]}`; } return d; };
    const cut=Math.min(nDone,pts.length-1);
    const done=cut>0?`<path d="${seg([...pts[0],0],cut)}" stroke="#1C2554" stroke-width="5" fill="none" stroke-linecap="round"/>`:"";
    const rest=cut<pts.length-1?`<path d="${seg([...pts[cut],cut],pts.length-1)}" stroke="#1C2554" stroke-width="4" stroke-dasharray="2 11" fill="none" stroke-linecap="round"/>`:"";
    p.insertAdjacentHTML("afterbegin",`<svg class="route" width="${pr.width}" height="${pr.height}" aria-hidden="true">${done}${rest}</svg>`);
  });
}
addEventListener("resize",()=>{ if(S.screen==="map") drawPaths(); });

function afterRender(){ if(S.screen==="map") requestAnimationFrame(drawPaths);
  typers.forEach(clearInterval); typers=[]; rvMount();
  // messages SMS séquentiels
  const seq=[...document.querySelectorAll("[data-seq]")]; const rm0=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches; if(!rm0) seq.forEach((e,i)=>{ e.style.display="none"; setTimeout(()=>{ e.style.display=""; e.classList.add("pop"); if(e.classList.contains("typing")) setTimeout(()=>e.remove(),900); }, 300+i*900); });
  // machine à écrire dans les bulles, l'une après l'autre
  const els=[...document.querySelectorAll("[data-type]")]; let delay=250;
  const rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(rm){ seq.forEach(e=>{ e.style.display=""; if(e.classList.contains("typing")) e.remove(); }); }
  els.forEach(el=>el.setAttribute("aria-label",el.textContent));
  const key=S.screen+":"+S.qi+":"+S.step; if(key!==typedKey){ typed=new Set(); typedKey=key; }
  if(!rm) els.forEach(el=>{ const full=el.textContent; if(typed.has(full)) return; typed.add(full); el.textContent=""; el.closest(".say").classList.add("wait");
    const dur=Math.min(1600,full.length*14); const say=el.closest(".say");
    setTimeout(()=>{ say.classList.remove("wait"); say.classList.add("speaking"); rvTalk(say,true); let i=0;
      const t=setInterval(()=>{ i+=2; el.textContent=full.slice(0,i); if(i>=full.length){ clearInterval(t); el.textContent=full; say.classList.remove("speaking"); rvTalk(say,false); } },14); typers.push(t);
      say.onclick=()=>{ clearInterval(t); el.textContent=full; say.classList.remove("speaking"); rvTalk(say,false); }; }, delay);
    delay+=dur+250; });
  // carte à glisser
  const sc=$("#sc"); if(sc){ let x0=null,dx=0; const deck=sc.parentElement;
    const mv=e=>{ if(x0===null) return; dx=(e.touches?e.touches[0].clientX:e.clientX)-x0; sc.style.transform=`translateX(${dx}px) rotate(${dx/14}deg)`; deck.classList.toggle("goR",dx>40); deck.classList.toggle("goL",dx<-40); };
    const up=()=>{ if(x0===null) return; x0=null; if(dx>90){ sc.style.transform="translateX(140%) rotate(25deg)"; setTimeout(()=>vote("A"),250); } else if(dx<-90){ sc.style.transform="translateX(-140%) rotate(-25deg)"; setTimeout(()=>vote("C"),250); } else { sc.style.transform=""; deck.classList.remove("goR","goL"); } dx=0; };
    sc.addEventListener("pointerdown",e=>{ x0=e.clientX; sc.setPointerCapture(e.pointerId); sc.style.transition="none"; });
    sc.addEventListener("pointermove",mv); sc.addEventListener("pointerup",()=>{ sc.style.transition=""; up(); }); sc.addEventListener("pointercancel",()=>{ sc.style.transition=""; up(); }); }
}
function detail(k){
  const rows=Q.filter(q=>S.ch[q.id]&&S.ch[q.id]!=="X").map(q=>{ const p=POS[q.id][k], me=S.ch[q.id], his=opt(p[0]);
    return `<tr class="${me===his?"same":""}"><td>${esc(q.titre)}</td><td><b>${me}</b></td><td><b>${his}</b> <small>${LVL[p[0]]}</small><br>${p[2]?src(p[1],p[2]):`<a class="src off" href="https://www.france-vote.fr/candidats/${CANDS[k].fv}" target="_blank" rel="noopener">non sourcée (France-Vote) ↗</a>`}</td></tr>`; }).join("");
  $("#det").innerHTML=`<div class="card detail"><h3>${esc(CANDS[k].nom)} et toi</h3><table><tr><th>Décision</th><th>Toi</th><th>Candidat</th></tr>${rows}</table></div>`;
  $("#det").scrollIntoView({behavior:"smooth"}); }
// ───────── carte de partage (image 1080×1920)
const SITE="mandat27.netlify.app";
function rr(x,X,Y,w,h,r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+w,Y,X+w,Y+h,r); x.arcTo(X+w,Y+h,X,Y+h,r); x.arcTo(X,Y+h,X,Y,r); x.arcTo(X,Y,X+w,Y,r); x.closePath(); }
function fitT(x,t,max,size,font){ let s=size; do{ x.font=`${font.replace("#",s)}`; s-=2; } while(x.measureText(t).width>max&&s>14); return t; }
function svgImg(svg){ return new Promise(ok=>{ const s=svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace(/class="[^"]*"/g,""); const im=new Image(); im.onload=()=>ok(im); im.onerror=()=>ok(null); im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s); }); }
async function shareCard(){
  try{ await Promise.all(['80px Anton','700 40px Archivo','800 40px Archivo'].map(f=>document.fonts.load(f))); }catch(e){}
  const W=1080,H=1920, cv=document.createElement("canvas"); cv.width=W; cv.height=H; const x=cv.getContext("2d");
  const L='Anton, Impact, sans-serif', N='Archivo, system-ui, sans-serif', INK="#1C2554", PAP="#F2EADB", RED="#E5392B", YEL="#F5C431", BLU="#2F5BEA";
  const m=match(), t=totals(), r=rang(), sou=Math.round(t.soutien*100);
  const box=(X,Y,w,h,fill,sh=14)=>{ rr(x,X+sh,Y+sh,w,h,30); x.fillStyle=INK; x.fill(); rr(x,X,Y,w,h,30); x.fillStyle=fill; x.fill(); x.lineWidth=8; x.strokeStyle=INK; x.stroke(); };
  // papier + rayons jaunes (double impression décalée)
  x.fillStyle=PAP; x.fillRect(0,0,W,H);
  const rays=(dx,dy,col)=>{ x.fillStyle=col; for(let k=0;k<13;k++){ const a=Math.PI+k*.26; x.beginPath(); x.moveTo(W/2+dx,900+dy); x.lineTo(W/2+dx+2000*Math.cos(a),900+dy+2000*Math.sin(a)); x.lineTo(W/2+dx+2000*Math.cos(a+.13),900+dy+2000*Math.sin(a+.13)); x.fill(); } };
  x.globalAlpha=.3; rays(8,6,BLU); x.globalAlpha=1; rays(0,0,YEL);
  [[BLU,0],[PAP,360],[RED,720]].forEach(([c,o])=>{ x.fillStyle=c; x.fillRect(o,0,360,26); });
  // titre d'affiche
  x.textAlign="left"; x.fillStyle=INK; x.font=`200px ${L}`; x.fillText("MANDAT",44,250); const w1=x.measureText("MANDAT ").width; x.fillStyle=RED; x.fillText("27",44+w1,250);
  x.fillStyle=INK; x.font=`700 40px ${N}`; x.fillText(`Mon mandat de ${G("président","présidente")} · 2027-2032`,48,320);
  // portrait
  const av=await svgImg(persoSVG("moi","happy")); if(av){ x.drawImage(av,W/2-210,350,420,521); }
  x.fillStyle=PAP; x.fillRect(0,840,W,H-840); x.fillStyle=INK; x.fillRect(0,836,W,8);
  box(W/2-330,790,660,96,RED,10); x.fillStyle=PAP; x.textAlign="center"; fitT(x,r.nom.toUpperCase(),600,58,`#px ${L}`); x.fillText(r.nom.toUpperCase(),W/2,860);
  // top 3
  x.fillStyle=INK; x.textAlign="left"; x.font=`84px ${L}`; x.fillText("MES CHOIX RESSEMBLENT À…",48,1000);
  m.slice(0,3).forEach((c,i)=>{ const y=1040+i*190; box(48,y,960,160,i===0?YEL:PAP);
    x.fillStyle=INK; x.textAlign="left"; x.font=`104px ${L}`; x.fillText(i+1,84,y+118);
    fitT(x,CANDS[c.k].nom.toUpperCase(),560,60,`#px ${L}`); x.fillText(CANDS[c.k].nom.toUpperCase(),190,y+82);
    fitT(x,CANDS[c.k].parti,560,30,`600 #px ${N}`); x.fillText(CANDS[c.k].parti,190,y+124);
    x.textAlign="right"; x.fillStyle=RED; x.font=`100px ${L}`; x.fillText(c.pct+" %",975,y+118); });
  // stats
  const st=[["DÉCISIONS",String(t.n)],["BUDGET",(t.b>0?"+":t.b<0?"−":"")+Math.abs(t.b)],["CLIMAT",(t.c>0?"+":t.c<0?"−":"")+Math.abs(t.c)],["SOUTIENS",sou+" %"]];
  box(48,1630,984,130,PAP,10); st.forEach(([l,v],i)=>{ const bx=48+i*246; if(i){ x.fillStyle=INK; x.fillRect(bx-4,1630,8,130); }
    x.textAlign="center"; x.fillStyle=INK; x.font=`72px ${L}`; x.fillText(v,bx+123,1712); x.font=`700 24px ${N}`; x.fillText(l,bx+123,1745); });
  // pied
  x.textAlign="left"; x.fillStyle=RED; x.font=`76px ${L}`; x.fillText("ET TOI, TU FERAIS QUOI ?",48,1850);
  x.fillStyle=INK; const ft=`${SITE} · Apprenti Politique · ni un sondage, ni une consigne de vote`; fitT(x,ft,984,30,`700 #px ${N}`); x.fillText(ft,48,1896);
  return new Promise(ok=>cv.toBlob(ok,"image/png"));
}
function shareText(){ const m=match().slice(0,3).map((r,i)=>`${i+1}. ${CANDS[r.k].nom} ${r.pct} %`).join("\n");
  return `Mon mandat de ${G("président","présidente")} 2027-2032 ressemble à :\n${m}\nRang : ${rang().nom}\nEt toi ? https://${SITE}\n(Ni un sondage, ni une consigne de vote.)`; }
async function share(){
  const ov=document.createElement("div"); ov.className="shov"; ov.innerHTML=`<div class="shbox pop"><div class="shimg"><div class="spin"></div></div><div class="stack" id="shbtn"></div><button class="link" onclick="this.closest('.shov').remove()">Fermer</button></div>`;
  ov.onclick=e=>{ if(e.target===ov) ov.remove(); }; document.body.appendChild(ov);
  const blob=await shareCard(), url=URL.createObjectURL(blob), file=new File([blob],"mandat27.png",{type:"image/png"});
  ov.querySelector(".shimg").innerHTML=`<img src="${url}" alt="Ma carte Mandat 27 : mes 3 candidats les plus proches et mes stats">`;
  const canFile=navigator.canShare&&navigator.canShare({files:[file]});
  const b=ov.querySelector("#shbtn");
  b.innerHTML=`${canFile?`<button class="btn gold" id="shgo">Partager l'image</button>`:""}<a class="btn ${canFile?"ghost":"gold"}" download="mandat27.png" href="${url}">Télécharger l'image</a><button class="btn ghost" id="shtx">Copier le texte</button>`;
  if(canFile) b.querySelector("#shgo").onclick=()=>navigator.share({files:[file],text:shareText()}).catch(()=>{});
  b.querySelector("#shtx").onclick=()=>{ const t=shareText(); try{ navigator.clipboard.writeText(t).then(()=>toast("Texte copié !"),()=>toast(t)); }catch(e){ toast(t); } };
}
function toast(t){ const d=document.createElement("div"); d.className="toast"; d.textContent=t; document.body.appendChild(d); setTimeout(()=>d.remove(),2600); }
rvInit();
render();
