// Casting original (personnages inventés, aucun politique réel). Style flat : tête carrée arrondie, sans contour.
const CAST = {
 lea:   {nom:"Léa",   role:"ta pote, 19 ans",        skin:"#C68B5E", sh:"#B07650", hair:"#6B34A8", st:"bun",   suit:"#FF4B55", suit2:"#E03540"},
 karim: {nom:"Karim", role:"ton chef de cabinet",    skin:"#A86B45", sh:"#93593A", hair:"#1B1B2F", st:"short", suit:"#13234B", suit2:"#0B1736"},
 helene:{nom:"Hélène",role:"économiste",             skin:"#F2C9A5", sh:"#E2B38D", hair:"#C9CEDD", st:"bob",   suit:"#2A5BFF", suit2:"#1E46D6", glasses:1},
 sam:   {nom:"Sam",   role:"journaliste",            skin:"#E8B48F", sh:"#D69F79", hair:"#E07A2E", st:"curly", suit:"#8B5CF6", suit2:"#6D3FE0"},
 yuki:  {nom:"Yuki",  role:"diplomate",              skin:"#F0C8A0", sh:"#DDB289", hair:"#15151F", st:"long",  suit:"#43C6FF", suit2:"#1E8BFF"},
 ines:  {nom:"Inès",  role:"chercheuse",             skin:"#D9A27A", sh:"#C68D66", hair:"#2B1A12", st:"long",  suit:"#2F5BEA", suit2:"#2448C0"},
 marc:  {nom:"Marc",  role:"chercheur",              skin:"#8D5A3B", sh:"#7A4B30", hair:"#2B1A12", st:"short", suit:"#E5392B", suit2:"#C22D21", glasses:1}
};
Object.keys(CAST).forEach(k=>CAST[k].kind=k);
Object.assign(CAST.lea,{fn:"Citoyenne"}); Object.assign(CAST.karim,{fn:"Chef de cabinet"}); Object.assign(CAST.helene,{fn:"Économiste"}); Object.assign(CAST.sam,{fn:"Journaliste"}); Object.assign(CAST.yuki,{fn:"Diplomate"});
function mouth(m){
  const s='stroke="#1C2554" stroke-width="3" fill="none" stroke-linecap="round"';
  if(m==="joy") return `<path class="mo" d="M41 57 Q50 68 59 57" ${s}/>`;
  if(m==="sad") return `<path d="M44 63 Q50 57 56 63" ${s}/>`;
  if(m==="wow") return `<circle cx="50" cy="61" r="3.6" ${s}/>`;
  if(m==="neutral") return `<path d="M44 61 H56" ${s}/>`;
  return `<path class="mo" d="M43 58 Q50 64 57 58" ${s}/>`;
}
// Cheveux : une seule forme lisse par coiffure (courbes de Bézier), pas d'empilement de ronds.
function hair(c){
  const h=c.hair, f=d=>`<path d="${d}" fill="${h}"/>`;
  if(c.st==="short") return f("M21 46 C20 26 32 13 50 13 C68 13 80 26 79 46 C76 36 70 31 62 30 C55 33 44 34 36 31 C29 33 24 38 21 46Z");
  if(c.st==="curly") return f("M20.5 48 C17 40 19 30 24 27 C24 18 33 12 42 14 C47 9 58 9 63 14 C72 12 80 19 79 28 C83 33 82.5 42 79.5 48 C77 39 71 34 64 34 C58 37 46 37 40 34 C33 36 26 39 20.5 48Z");
  if(c.st==="bob") return f("M20 68 C17 40 26 13 50 13 C74 13 83 40 80 68 C79.5 73 72.5 73 72 68 L72.5 42 C69 34 61 30 50 31 C42 34 33 34 28 40 L28 68 C27.5 73 20.5 73 20 68Z");
  if(c.st==="bun") return f("M41 16 C39 8 44 4 50 4 C56 4 61 8 59 16 C70 19 78 28 79 42 C73 33 63 29 50 30 C38 29 28 33 21 42 C22.5 28 31 19 41 16Z");
  return f("M18.5 90 C14 58 18 14 50 13 C82 14 86 58 81.5 90 C80 95 73 94 73.5 86 L75 50 C71 37 61 31 50 32 C39 31 29 37 25 50 L26.5 86 C27 94 20 95 18.5 90Z");
}
function perso(id, mood="happy", cls="", o={}){
  return `<span class="perso rv ${cls}" data-c="${id}" data-m="${mood}"${o.t?` data-t="${o.t}"`:""}${o.loop?` data-loop="${o.loop}"`:""} role="img" aria-label="${CAST[id].nom}">${persoSVG(id,mood,/\bfull\b/.test(cls)&&!!OBJSVG[id])}</span>`;
}
function persoSVG(id, mood="happy", full=false){
  if(OBJSVG[id]) return `<svg class="pfb" viewBox="0 0 100 ${full?172:124}" aria-hidden="true"><g class="bob">${OBJSVG[id][mood]||OBJSVG[id].happy}</g></svg>`;
  const c=CAST[id];
  return `<svg class="pfb" viewBox="0 0 100 124" aria-hidden="true">
   <g class="bob">
    <path d="M14 124 V104 Q14 84 34 84 H66 Q86 84 86 104 V124Z" fill="${c.suit}"/>
    <path d="M50 84 V124 H86 V104 Q86 84 66 84Z" fill="${c.suit2}" opacity=".35"/>
    ${c.tie?`<path d="M45 85 H55 L52 92 L56 112 L50 118 L44 112 L48 92Z" fill="${c.tie}"/>`:`<path d="M40 84 L50 96 L60 84Z" fill="#fff" opacity=".9"/>`}
    <rect x="43" y="72" width="14" height="14" rx="5" fill="${c.sh}"/>
    ${c.st==="long"?hair(c):""}
    <rect x="22" y="18" width="56" height="58" rx="20" fill="${c.skin}"/>
    <path d="M50 18 H58 Q78 18 78 38 V56 Q78 76 58 76 H50Z" fill="${c.sh}" opacity=".45"/>
    ${c.st!=="long"?hair(c):`<path d="M21.5 44 C21 25 33 13 50 13 C67 13 79 25 78.5 44 C74 34 66 29 57 29 C49 33 38 34 30 31 C26 35 23 39 21.5 44Z" fill="${c.hair}"/>`}
    <g class="eyes"><circle cx="41" cy="46" r="3.8" fill="#1C2554"/><circle cx="59" cy="46" r="3.8" fill="#1C2554"/></g>
    ${c.glasses?`<g fill="none" stroke="#13234B" stroke-width="2.4"><rect x="31" y="38" width="17" height="15" rx="6"/><rect x="52" y="38" width="17" height="15" rx="6"/><path d="M48 45 H52"/></g>`:""}
        ${mouth(mood)}
   </g></svg>`;
}
// bulle de dialogue avec effet machine à écrire (data-type)
function say(id, text, opt={}){
  const c=CAST[id], kick=`<span class="kick">${opt.kick||c.nom+" · "+c.role}</span>`;
  if(opt.noav) return `<div class="say noav ${opt.cls||""}"><div class="bub ${opt.color||""}">${kick}<p data-type>${esc(text)}</p>${opt.extra||""}</div></div>`;
  return `<div class="say ${opt.right?"right":""} ${opt.cls||""}">
    <div class="av">${perso(id, opt.mood||"happy", "talk", {t:opt.t})}</div>
    <div class="bub ${opt.color||""}">${kick}<p data-type>${esc(text)}</p>${opt.extra||""}</div></div>`;
}

// Personnage du joueur
const SKINS=[["#F5D0B0","#E5B994"],["#E8B48F","#D69F79"],["#C68B5E","#B07650"],["#A86B45","#93593A"],["#7A4B30","#653C25"]];
const HAIRS=["#15151F","#5A3A22","#C98A3B","#E07A2E","#C9CEDD","#6B34A8"];
const STYLES=[["short","Courts"],["curly","Bouclés"],["bob","Carré"],["long","Longs"],["bun","Chignon"]];
function setMoi(m){ const s=SKINS[m.skin]||SKINS[1];
  CAST.moi={kind:"player", nom:"Toi", role:m.g==="m"?"le président":"la présidente", skin:s[0], sh:s[1], hair:HAIRS[m.hair]||HAIRS[0], st:m.st||"short", suit:"#13234B", suit2:"#0B1736", tie:"#E5392B"}; }
