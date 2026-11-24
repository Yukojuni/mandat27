// ───────── Mandat 27 — V2
const KEYS = Object.keys(CANDS);
const LVL = {2:"Soutien net",1:"Plutôt pour",0:"Nuancé","-1":"Plutôt contre","-2":"Opposition nette"};
const opt = l => l===2?"A":(l===-2?"C":"B");
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const INTROS = ["jt","sms","dossier"];
const VOTES  = ["cartes","swipe","ministres","curseur","bulletin"];
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
const fmtVote = i => VOTES[i%5];
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
 urne:`<svg viewBox="0 0 120 120" class="urne"><rect x="18" y="44" width="84" height="64" rx="14" fill="#fff"/><rect x="18" y="44" width="84" height="16" rx="8" fill="#DDE6FF"/><rect x="40" y="48" width="40" height="7" rx="3.5" fill="#13234B"/><rect x="34" y="72" width="52" height="22" rx="6" fill="#2A5BFF"/><text x="60" y="88" text-anchor="middle" font-family="Lilita One,Nunito,sans-serif" font-size="13" fill="#fff">VOTE</text></svg>`,
 bulletin:`<svg viewBox="0 0 60 80" class="bulletin"><rect x="4" y="4" width="52" height="72" rx="8" fill="#fff"/><rect x="12" y="16" width="36" height="6" rx="3" fill="#C9D4F5"/><rect x="12" y="28" width="28" height="6" rx="3" fill="#C9D4F5"/><circle cx="30" cy="54" r="10" fill="#FFC800"/></svg>`,
 logo:`<svg viewBox="0 0 120 120" class="logo"><rect width="120" height="120" rx="30" fill="#2A5BFF"/><g fill="#fff">${[0,1,2].map(r=>[...Array(5+r*2)].map((_,i,a)=>{const R=26+r*12,t=Math.PI*(i/(a.length-1));return `<circle cx="${(60-R*Math.cos(t)).toFixed(1)}" cy="${(82-R*Math.sin(t)).toFixed(1)}" r="4.2"/>`}).join("")).join("")}</g><rect x="56" y="30" width="8" height="44" rx="3" fill="#FFC800"/><path d="M56 74h8l-4 9z" fill="#FFC800"/></svg>`,
 globe:`<svg viewBox="0 0 80 80" class="globe"><circle cx="40" cy="40" r="34" fill="#43C6FF"/><path d="M20 26 Q30 18 38 26 T50 30 Q46 40 36 38 T22 40Z M46 48 Q56 44 60 52 T54 64 Q46 60 46 48Z" fill="#3DDC84"/><ellipse cx="40" cy="40" rx="34" ry="34" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/></svg>`
};
function hemicycle(sup){
  const seats=[]; [9,13,17,21].forEach((n,r)=>{ const R=40+r*16; for(let i=0;i<n;i++){ const t=Math.PI*i/(n-1); seats.push([110-R*Math.cos(t),116-R*Math.sin(t),t]); } });
  seats.sort((a,b)=>a[2]-b[2]); const yes=Math.round(seats.length*sup/8);
  return `<svg viewBox="0 0 220 124" class="hemi">${seats.map((s,i)=>`<circle cx="${s[0].toFixed(1)}" cy="${s[1].toFixed(1)}" r="5.4" class="seat ${i<yes?"yes":""}" style="--d:${(i*0.022).toFixed(3)}s"/>`).join("")}<rect x="96" y="104" width="28" height="14" rx="4" fill="#13234B"/></svg>`;
}
function gauges(){
  const t=totals(), r=rang();
  // Budget et Climat : jauges à deux sens, zéro au milieu (vert = mieux, rouge = pire)
  const bip=(v,l,sc,words,tip)=>{ const p=Math.max(-50,Math.min(50,v*sc)), col=v>0?"#22B86A":v<0?"#FF4B55":"#AEB9D8", w=v>0?words[0]:v<0?words[1]:words[2];
    return `<div class="g" title="${tip}"><div class="gl">${l}</div><div class="gb bip"><b></b><i style="left:${p<0?50+p:50}%;width:${Math.abs(p)}%;background:${col}"></i></div><div class="gv"><span style="color:${v>0?"#138A4C":v<0?"#E03540":"inherit"}">${v>0?"+":v<0?"−":""}${Math.abs(v)}</span> <small>${w}</small></div></div>`; };
  const sou=t.n?Math.round(t.soutien*100):null;
  return `<div class="gauges">${bip(t.b,"Budget",8,["économies","dépenses","équilibre"],"Tendance de tes choix sur les finances publiques")}${bip(t.c,"Climat",10,["mieux","pire","neutre"],"Tendance de tes choix sur le climat")}
   <div class="g" title="Part moyenne des 8 candidats qui défendent tes choix"><div class="gl">Soutiens</div><div class="gb"><i style="width:${sou==null?0:Math.max(4,sou)}%;background:#8B5CF6"></i></div><div class="gv">${sou==null?"–":sou+" %"} <small>${sou==null?"":sou>=60?"large":sou>=35?"partagé":"isolé"}</small></div></div></div>
  <div class="xpbar" id="xpb">${S.moi?`<span class="me">${perso("moi","happy")}</span>`:""}<b>${r.nom}</b><div class="xpt"><i style="width:${r.next?((S.xp-r.base)/(r.next-r.base)*100):100}%"></i></div><span>${S.xp} XP</span></div>`;
}
function topbar(){ const done=Q.filter(q=>S.ch[q.id]).length, back=S.back==="parcours"&&S.screen==="q";
  return `<header class="hdr"><button class="brand" onclick="go('home')" aria-label="Mandat 27 : retour à l'accueil">${ICON.logo}<span>MANDAT <b>27</b></span></button><button class="btn ghost sm" onclick="${back?"S.back=null;go('parcours')":"go('map')"}">${back?"Parcours":"Carte"}</button></header>
  <div class="top"><div class="prog"><i style="width:${done/NQ()*100}%"></i></div><div class="cnt">${done}/${NQ()}</div></div>${gauges()}`; }
function src(l,u){ return u?`<a class="src" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a>`:`<span class="src off">${esc(l)}</span>`; }

// ───────── écrans
const V={};
V.home=()=>{ const started=Object.keys(S.ch).length;
 return `<div class="screen home">
  <div class="sky"><div class="sun"></div><div class="cloud c1"></div><div class="cloud c2"></div></div>
  <div class="hero pop">${ICON.logo}</div>
  <h1 class="pop d1">MANDAT <span>27</span></h1>
  <p class="lead pop d2">Tu arrives à l'Élysée. 5 ans, jusqu'à 30 décisions réelles de la campagne 2027. Ton équipe t'aide à comprendre, toi tu tranches.</p>
  <div class="cast pop d3">${["lea","karim","helene","sam","yuki"].map((k,i)=>`<div class="cm" style="--i:${i}">${perso(k,"happy","",{t:"wave"})}<b>${CAST[k].nom}</b><small>${CAST[k].role}</small></div>`).join("")}</div>
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
  <div class="portrait pop d1"><div class="flag"><i></i><i></i><i></i></div>${perso("moi","happy","big")}<div class="plaque">${m.g?G("Le Président","La Présidente"):"Président·e"} de la République</div></div>
  <div class="seg pop d2"><button class="${m.g==="f"?"on":""}" onclick="setAv('g','f')">Présidente</button><button class="${m.g==="m"?"on":""}" onclick="setAv('g','m')">Président</button></div>
  ${sw(SKINS,"skin","Peau")}
  <div class="pick"><span>Coiffure</span><div class="chips">${STYLES.map(s=>`<button class="chip ${m.st===s[0]?"on":""}" onclick="setAv('st','${s[0]}')">${s[1]}</button>`).join("")}</div></div>
  ${sw(HAIRS,"hair","Cheveux")}
  <button class="btn big gold" ${m.g?"":"disabled"} onclick="photo()">${m.g?"Prendre la photo officielle":"Choisis président ou présidente"}</button>
  <p class="fine">Ton apparence ne change rien au résultat.</p></div>`; };
V.elect=()=>`<div class="screen elect">
  <div class="rv rvscene" data-ab="ElectionNight" onclick="skipScene(this)" aria-label="Soirée électorale : c'est toi !"><div class="pfb">
  <div class="crowd">${["lea","sam","ines","marc","yuki","helene"].map((k,i)=>`<div class="fan" style="--i:${i}">${perso(k,"wow","",{loop:"cheering"})}</div>`).join("")}</div>
  <div class="tv"><div class="tvin"><div class="bandeau">ÉDITION SPÉCIALE</div><div class="count"><span>20:00</span></div><div class="tvme">${perso("moi","happy")}</div><div class="reveal">C'EST TOI !</div></div></div>
  <div class="confetti">${[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join("")}</div></div></div>
  <div class="esheet">
  <h2 class="pop d5">Dimanche 2 mai 2027, 20&nbsp;h</h2>
  ${say("karim",`Félicitations, ${TITRE()}. On a 5 ans et ${NQ()} dossiers brûlants. Je t'explique chaque fois, et c'est toi qui décides.`,{cls:"pop d5"})}
  <button class="btn big pop d5" onclick="go('map')">Entrer à l'Élysée</button></div></div>`;

V.map=()=>{ const nxt=Q.findIndex(q=>!S.ch[q.id]);
 return `<div class="screen map">${topbar()}<button class="modechip" onclick="go('mode')"><span>Rythme <b>${MODES[S.mode].nom}</b> · ${NQ()} décisions</span><u>Changer</u></button>
  ${nxt>=0?say("karim", nxt===0?`Voilà ta feuille de route, ${TITRE()}. On commence par les retraites : touche la première bulle.`:`Prochain dossier : ${Q[nxt].theme.toLowerCase()}. Format du vote : ${VOTE_NOM[fmtVote(nxt)].toLowerCase()}.`):say("karim","Mandat terminé. Les Français attendent ton bilan.",{mood:"wow"})}
  ${ANNEES.map((y,ai)=>{ const qs=Q.map((q,i)=>({q,i})).filter(o=>o.q.an===ai);
   return `<section class="year y${ai}"><div class="yh"><b>${y.an}</b><div><h3>${y.titre}</h3><p>${y.sous}</p></div></div>
   <div class="path">${qs.map(({q,i},j)=>{ const st=S.ch[q.id]?"done":(i===nxt?"next":(i<nxt||nxt<0?"open":"lock"));
     return `<button class="node ${st}" style="--x:${[0,46,72,46,0,-46][j]}px" ${st==="lock"?"disabled":""} onclick="openQ(${i})">
      <span class="dot">${st==="done"?"✓":j+1}<span class="rv rvnode" data-ab="MapNode" data-state="${{lock:"locked",open:"open",next:"next",done:"done"}[st]}" data-theme="${themeKey(q.theme)}"${S.justDone===q.id?' data-t="complete"':""} aria-hidden="true"></span></span><span class="nt">${esc(q.theme)}</span>${st==="next"?`<span class="here"><span class="rv rvmark" data-ab="PlayerMarker" data-c="${S.moi?"moi":"lea"}"${S.justDone?' data-t="advance"':""} aria-hidden="true"><span class="pfb">${persoSVG(S.moi?"moi":"lea","happy")}</span></span></span>`:""}</button>`; }).join("")}</div></section>`; }).join("")}
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
 if(f==="jt") return `<div class="tvbig pop"><div class="bandeau">ÉDITION SPÉCIALE</div><div class="studio">${perso("sam","happy","talk big")}</div>
   <div class="lower"><b>${esc(q.titre)}</b></div><div class="ticker"><span>${esc(q.theme.toUpperCase())} · ${esc(q.hook)} · ${esc(q.theme.toUpperCase())} · ${esc(q.hook)}</span></div></div>
   ${say("sam",q.hook,{cls:"pop d1"})}${say("lea",q.pourquoi,{right:1,cls:"pop d2",color:"red"})}`;
 if(f==="sms") return `<div class="phone pop"><div class="ph-top">${perso("lea","happy")}<div><b>Léa</b><small>en ligne</small></div></div>
   <div class="ph-body"><div class="msg in" data-seq="0">Hé, t'as vu ? ${esc(q.titre)}</div><div class="msg in" data-seq="1">${esc(q.hook)}</div>
   <div class="msg out" data-seq="2">Et moi, ça me concerne comment ?</div><div class="msg in" data-seq="3">${esc(q.pourquoi)}</div><div class="typing" data-seq="4"><i></i><i></i><i></i></div></div></div>`;
 return `<div class="desk pop">${perso("karim","neutral","talk big")}<div class="folder"><div class="tab">DOSSIER ${S.qi+1}/${NQ()}</div><div class="stampu">URGENT</div><h2>${esc(q.titre)}</h2></div></div>
   ${say("karim",q.hook,{cls:"pop d1"})}<div class="postit pop d2"><b>Post-it de Léa</b><p>${esc(q.pourquoi)}</p></div>`; };
STEP.quiz=q=>{ const z=QUIZ[q.id], a=S.quiz[q.id];
 return `${say("helene",z.q,{mood:"happy"})}
  <div class="quiz">${z.c.map((c,i)=>`<button class="qa ${a!=null?(i===z.ok?"ok":(i===a?"ko":"dim")):""}" ${a!=null?"disabled":""} onclick="answer(${i},this)">${esc(c)}</button>`).join("")}</div>
  ${a!=null?`${say("helene",a===z.ok?"Bien vu ! Et voilà les autres chiffres clés.":"Pas tout à fait. Beaucoup de gens se trompent sur celui-là. Voilà les chiffres clés.",{mood:a===z.ok?"happy":"wow",t:a===z.ok?"cheer":"surprise"})}
   ${q.faits.map((f,i)=>`<div class="card fact pop d${i}"><p>${esc(f[0])}</p>${src(f[1],f[2])}</div>`).join("")}
   <div class="nav"><button class="btn ghost" onclick="step(-1)">Retour</button><button class="btn" onclick="step(1)">Suivant</button></div>`:""}`; };
STEP.faits=q=>`${say("helene","Avant de décider, les chiffres. Touche les cartes pour les retourner.")}
  <div class="flips">${q.faits.map((f,i)=>`<div class="flip pop d${i}" onclick="if(!this.classList.contains('on')){this.classList.add('on');addXP(5,this)}"><div class="fi"><div class="ff"><span>Fait ${i+1}</span><b>?</b></div><div class="fb"><p>${esc(f[0])}</p>${src(f[1],f[2])}</div></div></div>`).join("")}</div>`;
STEP.debat=q=>`<div class="vs pop"><div class="side l">${perso("ines","happy","talk big")}<span class="pl g">POUR</span></div><div class="bolt">VS</div><div class="side r">${perso("marc","neutral","talk big")}<span class="pl r">CONTRE</span></div></div>
  ${say("ines",q.pour[0],{color:"green",extra:`<small class="att">Position défendue par : ${esc(q.pour[1])}</small>`})}
  ${say("marc",q.contre[0],{right:1,color:"red",extra:`<small class="att">Position défendue par : ${esc(q.contre[1])}</small>`})}`;
STEP.ailleurs=q=>`<div class="yukihead pop">${perso("yuki","happy","talk big")}${ICON.globe}</div>
  ${say("yuki","J'ai regardé ce que d'autres pays ont fait, et surtout ce que ça a donné. Aucun modèle n'est parfait, mais ça aide à choisir.")}
  <div class="passport">${q.ailleurs.map((a,i)=>{ const r=(AILLEURS[q.id]||[])[i]; const v=r&&VERDICTS[r[1]];
    return `<div class="stampc" style="--d:${0.5+i*0.45}s;--r:${[-1.5,1.2,-1][i]}deg"><b>${esc(a[0])}</b>
     <p class="did"><span class="pk">Ce qu'ils ont fait</span>${esc(a[1])}</p>
     ${r?`<p class="res"><span class="vd" style="color:${v[1]};background:${v[2]}">${v[0]}</span>${esc(r[0])}</p>${src(r[2],r[3])}`:""}</div>`; }).join("")}</div>`;
STEP.vote=q=>{ const f=fmtVote(S.qi), O=["A","B","C"];
 const det=k=>{ const o=q.opts[k]; return `<p><span class="pl g">Point fort</span>${esc(o.fort)}</p><p><span class="pl r">Point faible</span>${esc(o.faible)}</p><p class="rep"><span class="pl b">Ses défenseurs répondent</span>${esc(o.rep)}</p>`; };
 const extra=`<label class="imp"><input type="checkbox" ${S.imp[q.id]?"checked":""} onchange="S.imp['${q.id}']=this.checked;save()"> Ce sujet compte beaucoup pour moi (compte double)</label><button class="link" onclick="vote('X')">Je ne sais pas, je passe</button>`;
 const head=`<div class="qremind pop"><span class="qr-l">La question</span><b>${esc(q.titre).replace(/ ([?!:;])/g,'\u00a0$1')}</b><p>${esc(q.hook).replace(/ ([?!:;])/g,'\u00a0$1')}</p></div><div class="vfmt pop">${VOTE_NOM[f]}</div>`;
 if(f==="cartes") return `${head}${say("karim","Trois options sur la table. Touche-les pour voir leurs forces et faiblesses.")}
   ${O.map((k,i)=>`<div class="opt pop d${i}" id="o${k}" onclick="peek('${k}')"><div class="oh"><span class="ol">${k}</span><b>${esc(q.opts[k].t)}</b></div><div class="od">${det(k)}<button class="btn" onclick="event.stopPropagation();vote('${k}')">Je signe ce choix</button></div></div>`).join("")}${extra}`;
 if(f==="swipe") return `${head}${say("karim","Glisse la carte : à droite pour l'option A, à gauche pour l'option C. Le bouton du milieu, c'est le compromis.")}
   <div class="deck"><div class="lab l">${esc(q.opts.C.t)}</div><div class="lab r">${esc(q.opts.A.t)}</div>
    <div class="scard" id="sc"><div class="sc-top">${perso("karim","neutral")}<span>Dossier ${S.qi+1}</span></div><h3>${esc(q.titre)}</h3>
     <div class="sides"><span>← C</span><span>A →</span></div></div></div>
   <div class="sbtns"><button class="rb c" onclick="vote('C')" aria-label="Option C">C</button><button class="rb b" onclick="vote('B')">B · ${esc(q.opts.B.t)}</button><button class="rb a" onclick="vote('A')" aria-label="Option A">A</button></div>
   <details class="cmp"><summary>Comparer les 3 options avant de glisser</summary>${O.map(k=>`<div class="card"><b>${k}. ${esc(q.opts[k].t)}</b>${det(k)}</div>`).join("")}</details>${extra}`;
 if(f==="ministres"){ const mins=["helene","karim","yuki"];
   return `${head}${say("karim","Conseil des ministres. Chacun défend une option. Touche un ministre pour l'écouter, puis suis celui qui te convainc.")}
   <div class="table">${O.map((k,i)=>`<button class="min ${S.pick===k?"sel":""}" onclick="pickMin('${k}')">${perso(mins[i],S.pick===k?"happy":"neutral","talk")}<span class="ol">${k}</span></button>`).join("")}</div>
   <div id="minsay">${S.pick?`${say(mins[O.indexOf(S.pick)],q.opts[S.pick].t,{extra:`<div class="dt">${det(S.pick)}</div>`})}<button class="btn" onclick="vote('${S.pick}')">Je suis ce conseil</button>`:`<p class="hint center">Personne n'a encore parlé.</p>`}</div>${extra}`; }
 if(f==="curseur") return `${head}${say("karim","Fais glisser le curseur entre les trois options : A à gauche, C à droite, le compromis au milieu. Le dossier change en direct.")}
   <div class="slider pop"><div class="sl-lab"><span>A</span><span>B · compromis</span><span>C</span></div>
    <input type="range" min="0" max="2" step="1" value="${O.indexOf(S.pick||"B")}" oninput="slide(this.value)" aria-label="Position">
    <div id="sldet" class="card"><b>${esc(q.opts[S.pick||"B"].t)}</b>${det(S.pick||"B")}</div>
    <button class="btn" onclick="vote(S.pick||'B')">Je valide cette position</button></div>${extra}`;
 return `${head}${say("karim","Trois bulletins, une seule urne. Prends un bulletin pour le lire, puis glisse-le dans l'urne.")}
   <div class="ballots">${O.map((k,i)=>`<button class="bal ${S.pick===k?"up":""}" style="--r:${[-5,0,5][i]}deg" onclick="pickBal('${k}')"><span class="ol">${k}</span><b>${esc(q.opts[k].t)}</b></button>`).join("")}</div>
   <div class="mini-urne">${ICON.urne}</div>
   ${S.pick?`<div class="card pop">${det(S.pick)}<button class="btn" onclick="vote('${S.pick}')">Glisser dans l'urne</button></div>`:""}${extra}`; };

V.drop=()=>`<div class="screen elect"><div class="stage rvstage"><div class="rv rvbox" data-ab="BallotDrop" data-stamp="signe" data-t="drop"><div class="pfb"><div class="b-drop">${ICON.bulletin}</div>${ICON.urne}<div class="stamp">SIGNÉ</div></div></div></div></div>`;

const UNES=["LE QUOTIDIEN","L'ÉCHO NATIONAL","LA DÉPÊCHE DU MATIN","LE JOURNAL DU SOIR"];
V.result=()=>{ const q=Q[S.qi], o=S.ch[q.id];
 if(o==="X") return `<div class="screen q">${topbar()}${say("lea","Tu as passé ce sujet. C'est ok de ne pas avoir d'avis, il ne comptera pas dans le verdict.",{mood:"neutral"})}<div class="card lesson"><b>À retenir</b><p>${esc(q.lecon)}</p></div><button class="btn big" onclick="next()">Continuer</button></div>`;
 const op=q.opts[o], sup=supporters(q,o).length;
 const kw=sup>=5?"Large soutien":sup>=3?"Le pays divisé":sup>=1?"Choix minoritaire":"Coup de poker";
 const arrow=v=>v>0?`<span class="up">▲ mieux</span>`:v<0?`<span class="down">▼ pire</span>`:`<span class="eq">= stable</span>`;
 const climat=q.opts.A.c||q.opts.B.c||q.opts.C.c;
 return `<div class="screen q res">${topbar()}
  <div class="journal"><div class="mast">${UNES[S.qi%4]}<small>${esc(ANNEES[q.an].an)} · édition spéciale</small></div><div class="kw">${kw.toUpperCase()}</div><h2>${esc(op.t)}</h2><p>${G("Le président","La présidente")} a tranché sur ${esc(q.theme.toLowerCase())}.</p></div>
  <div class="hemibox pop d2">${hemicycle(sup)}<p><b>${sup} des 8</b> principaux candidats défendent ce choix. Noms cachés jusqu'à la fin.</p></div>
  <div class="grid3 pop d3"><div class="kpi"><small>Budget</small>${arrow(op.b)}</div><div class="kpi"><small>Climat</small>${climat?arrow(op.c):'<span class="eq">sans effet</span>'}</div><div class="kpi"><small>XP</small><b class="big">+20</b></div></div>
  ${say("karim",sup>=5?"Ça devrait passer à l'Assemblée sans trop de casse.":sup>=3?"Ça passera, mais il faudra négocier.":"Accroche-toi : on va devoir convaincre presque tout le monde.",{mood:sup>=5?"happy":sup>=3?"neutral":"wow",cls:"pop d4",t:sup>=5?"nod":sup>=3?null:"surprise"})}
  <div class="card lesson pop d5"><b>À retenir</b><p>${esc(q.lecon)}</p></div>
  <p class="fine">Les flèches sont des tendances indicatives, pas des prévisions chiffrées.</p>
  <button class="btn big" onclick="next()">Continuer</button></div>`; };

V.bilan=()=>{ const an=Q[S.qi].an, y=ANNEES[an], s=yearStats(an), ev=EVENTS.find(e=>e.an===an&&e.si(s));
 return `<div class="screen bilan">${topbar()}<div class="confetti">${[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join("")}</div>
  <div class="tag">Fin de l'année ${y.an}</div><h2 class="pop">Bilan : ${esc(y.titre)}</h2>
  <div class="grid3 pop d1"><div class="kpi"><small>Budget</small><b class="big">${s.b>0?"+":""}${s.b}</b></div><div class="kpi"><small>Climat</small><b class="big">${s.c>0?"+":""}${s.c}</b></div><div class="kpi"><small>Soutiens</small><b class="big">${Math.round(s.soutien*100)} %</b></div></div>
  ${ev?`<div class="tvbig small pop d2"><div class="bandeau">FAIT RÉEL</div><div class="studio">${perso("sam","wow","talk big")}</div><div class="lower"><b>${esc(ev.titre)}</b></div></div>
  ${say("sam",ev.txt,{extra:src(ev.src[0],ev.src[1]),cls:"pop d3"})}`:""}
  <button class="btn big pop d4" onclick="go(${an===4?"'verdict'":"'map'"})">${an===4?"Fin du mandat : le verdict":"Année suivante"}</button></div>`; };

V.verdict=()=>{ const m=match(), n=totals().n;
 if(!n) return `<div class="screen">${topbar()}<h2>Pas encore de choix</h2><button class="btn" onclick="go('map')">Retour à la carte</button></div>`;
 return `<div class="screen verdict"><div class="confetti">${[...Array(24)].map((_,i)=>`<i style="--i:${i}"></i>`).join("")}</div>
  <div class="tag">2 mai 2032</div><h2 class="pop">Ton mandat ressemble à…</h2>
  ${say("karim",`Mode ${MODES[S.mode].nom.toLowerCase()}. Sur tes ${n} décisions, voici les candidats de 2027 qui auraient fait les choix les plus proches. Rang final : ${rang().nom}.`)}
  <div class="panneau">${m.map((r,i)=>`<div class="affiche" style="--d:${i*0.25+0.6}s"><div class="in"><div class="front"><b>?</b></div>
   <div class="back"><div class="rk">${i+1}</div><div class="nm">${esc(CANDS[r.k].nom)}</div><div class="pt">${esc(CANDS[r.k].parti)}</div>
   <div class="meter"><i style="width:${r.pct}%"></i></div><div class="pc">${r.pct} %</div><small>${r.agree}/${r.cnt} choix identiques</small>
   <button class="link" onclick="detail('${r.k}')">Détail et sources</button></div></div></div>`).join("")}</div>
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
   <svg viewBox="0 0 ${W} ${H}" class="spark"><line x1="10" x2="${W-10}" y1="${H/2}" y2="${H/2}" stroke="#DDE4F7" stroke-width="2" stroke-dasharray="4 4"/>${[1,2,3,4].map(y=>`<line x1="${xs(y*6-0.5)}" x2="${xs(y*6-0.5)}" y1="4" y2="${H-4}" stroke="#EEF2FF" stroke-width="2"/>`).join("")}${line(0,"#E0A800")}${line(1,"#22B86A")}</svg>
   <div class="leg"><span><i style="background:#E0A800"></i>Budget (${b>0?"+":""}${b})</span><span><i style="background:#22B86A"></i>Climat (${c>0?"+":""}${c})</span><span class="hint">tendances indicatives</span></div></div>
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
function vote(k){ const first=!S.ch[Q[S.qi].id]; if(first&&k!=="X") S.justDone=Q[S.qi].id; S.ch[Q[S.qi].id]=k; S.pick=null; if(k!=="X"&&first) S.xp+=20; save(); if(k==="X"){ go("result"); return; } go("drop"); setTimeout(()=>go("result"),1300); }
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
function afterRender(){
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
  try{ await Promise.all(['80px "Lilita One"','900 40px Nunito','800 40px Nunito'].map(f=>document.fonts.load(f))); }catch(e){}
  const W=1080,H=1920, cv=document.createElement("canvas"); cv.width=W; cv.height=H; const x=cv.getContext("2d");
  const L='"Lilita One", Nunito, sans-serif', N='Nunito, system-ui, sans-serif';
  const m=match(), t=totals(), r=rang(), sou=Math.round(t.soutien*100);
  // fond
  const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,"#2A5BFF"); g.addColorStop(.55,"#1C3FD1"); g.addColorStop(1,"#13234B"); x.fillStyle=g; x.fillRect(0,0,W,H);
  x.fillStyle="rgba(255,255,255,.07)"; for(let k=0;k<3;k++) for(let i=0;i<9+k*4;i++){ const R=300+k*120, a=Math.PI*i/(8+k*4); x.beginPath(); x.arc(W/2-R*Math.cos(a),700-R*Math.sin(a),16,0,7); x.fill(); }
  // tricolore
  [["#2A5BFF",0],["#fff",360],["#FF4B55",720]].forEach(([c,o])=>{ x.fillStyle=c; x.fillRect(o,0,360,18); });
  // titre
  x.textAlign="center"; x.fillStyle="#fff"; x.font=`120px ${L}`; const w1=x.measureText("MANDAT ").width, w2=x.measureText("27").width, x0=(W-w1-w2)/2; x.textAlign="left"; x.fillText("MANDAT ",x0,190); x.fillStyle="#FFC800"; x.fillText("27",x0+w1,190); x.textAlign="center";
  x.font=`800 40px ${N}`; x.fillStyle="rgba(255,255,255,.85)"; x.fillText(`Mon mandat de ${G("président","présidente")} · 2027-2032`,W/2,255);
  // avatar
  x.fillStyle="rgba(255,255,255,.14)"; x.beginPath(); x.arc(W/2,470,190,0,7); x.fill();
  const av=await svgImg(persoSVG("moi","happy")); if(av){ x.save(); x.beginPath(); x.arc(W/2,470,190,0,7); x.clip(); x.drawImage(av,W/2-165,300,330,409); x.restore(); }
  rr(x,W/2-300,600,600,76,38); x.fillStyle="#FFC800"; x.fill(); x.fillStyle="#13234B"; fitT(x,r.nom,540,46,`#px ${L}`); x.fillText(r.nom,W/2,654);
  // top 3
  x.fillStyle="#fff"; x.font=`64px ${L}`; x.fillText("Mes choix ressemblent à…",W/2,790);
  const cols=["#FFC800","#E6ECFA","#F2A65A"];
  m.slice(0,3).forEach((c,i)=>{ const y=840+i*230; rr(x,70,y,940,200,40); x.fillStyle="#fff"; x.fill();
    x.fillStyle=cols[i]; x.beginPath(); x.arc(160,y+100,58,0,7); x.fill(); x.fillStyle="#13234B"; x.font=`68px ${L}`; x.textAlign="center"; x.fillText(i+1,160,y+124);
    x.textAlign="left"; fitT(x,CANDS[c.k].nom,500,56,`#px ${L}`); x.fillText(CANDS[c.k].nom,250,y+82);
    x.font=`800 30px ${N}`; x.fillStyle="#5B6B94"; fitT(x,CANDS[c.k].parti,480,30,`800 #px ${N}`); x.fillText(CANDS[c.k].parti,250,y+124);
    rr(x,250,y+146,560,22,11); x.fillStyle="#E6ECFA"; x.fill(); rr(x,250,y+146,Math.max(22,5.6*c.pct),22,11); x.fillStyle=i===0?"#2A5BFF":"#8EA6FF"; x.fill();
    x.textAlign="right"; x.fillStyle="#13234B"; x.font=`76px ${L}`; x.fillText(c.pct+"%",975,y+128); x.textAlign="center"; });
  // stats
  const st=[["Décisions",String(t.n)],["Budget",(t.b>0?"+":t.b<0?"−":"")+Math.abs(t.b)],["Climat",(t.c>0?"+":t.c<0?"−":"")+Math.abs(t.c)],["Soutiens",sou+"%"]];
  st.forEach(([l,v],i)=>{ const bx=70+i*240; rr(x,bx,1560,220,150,32); x.fillStyle="rgba(255,255,255,.14)"; x.fill();
    x.fillStyle="#fff"; x.font=`64px ${L}`; x.fillText(v,bx+110,1640); x.font=`800 28px ${N}`; x.fillStyle="rgba(255,255,255,.8)"; x.fillText(l,bx+110,1684); });
  // pied
  x.fillStyle="#FFC800"; x.font=`52px ${L}`; x.fillText("Et toi, tu ferais quoi ?",W/2,1790);
  x.fillStyle="#fff"; x.font=`900 36px ${N}`; x.fillText(SITE+"  ·  Apprenti Politique",W/2,1846);
  x.fillStyle="rgba(255,255,255,.6)"; x.font=`700 24px ${N}`; x.fillText(`Mode ${MODES[S.mode].nom.toLowerCase()} · ni un sondage, ni une consigne de vote`,W/2,1888);
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
