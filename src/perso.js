// Casting original (personnages inventés, aucun politique réel). Style flat : tête carrée arrondie, sans contour.
const CAST = {
 lea:   {nom:"Léa",   role:"ta pote, 19 ans",        skin:"#C68B5E", sh:"#B07650", hair:"#6B34A8", st:"bun",   suit:"#FF4B55", suit2:"#E03540"},
 karim: {nom:"Karim", role:"ton chef de cabinet",    skin:"#A86B45", sh:"#93593A", hair:"#1B1B2F", st:"short", suit:"#13234B", suit2:"#0B1736", tie:"#FFC800"},
 helene:{nom:"Hélène",role:"économiste",             skin:"#F2C9A5", sh:"#E2B38D", hair:"#C9CEDD", st:"bob",   suit:"#2A5BFF", suit2:"#1E46D6", glasses:1},
 sam:   {nom:"Sam",   role:"journaliste",            skin:"#E8B48F", sh:"#D69F79", hair:"#E07A2E", st:"curly", suit:"#8B5CF6", suit2:"#6D3FE0"},
 yuki:  {nom:"Yuki",  role:"diplomate",              skin:"#F0C8A0", sh:"#DDB289", hair:"#15151F", st:"long",  suit:"#43C6FF", suit2:"#1E8BFF"},
 ines:  {nom:"Inès",  role:"chercheuse",             skin:"#D9A27A", sh:"#C68D66", hair:"#2B1A12", st:"long",  suit:"#2F5BEA", suit2:"#2448C0"},
 marc:  {nom:"Marc",  role:"chercheur",              skin:"#8D5A3B", sh:"#7A4B30", hair:"#2B1A12", st:"short", suit:"#E5392B", suit2:"#C22D21", glasses:1}
};
Object.keys(CAST).forEach(k=>CAST[k].kind=k);
function mouth(m){
  if(m==="sad") return `<path d="M42 64 Q50 58 58 64" stroke="#13234B" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if(m==="wow") return `<ellipse cx="50" cy="63" rx="5" ry="6" fill="#13234B"/>`;
  if(m==="neutral") return `<path d="M43 62 H57" stroke="#13234B" stroke-width="3.2" stroke-linecap="round"/>`;
  return `<g class="mo"><path d="M41 59 Q50 69 59 59 Z" fill="#13234B"/><path d="M45 63 Q50 66 55 63" fill="#FF7A85"/></g>`;
}
function hair(c){
  const h=c.hair;
  if(c.st==="bun")   return `<circle cx="50" cy="8" r="11" fill="${h}"/><path d="M20 40 Q20 12 50 12 Q80 12 80 40 L80 30 Q70 22 50 24 Q30 22 20 30Z" fill="${h}"/>`;
  if(c.st==="short") return `<path d="M20 38 Q18 10 50 10 Q82 10 80 38 Q74 22 50 22 Q28 22 20 38Z" fill="${h}"/>`;
  if(c.st==="bob")   return `<path d="M16 56 Q12 10 50 10 Q88 10 84 56 L78 56 Q78 26 50 24 Q22 26 22 56Z" fill="${h}"/>`;
  if(c.st==="curly") return `${[22,34,46,58,70,80].map((x,i)=>`<circle cx="${x}" cy="${18+(i%2)*4}" r="11" fill="${h}"/>`).join("")}<circle cx="18" cy="34" r="8" fill="${h}"/><circle cx="82" cy="34" r="8" fill="${h}"/>`;
  return `<path d="M14 80 Q10 10 50 10 Q90 10 86 80 L78 80 Q80 28 50 24 Q20 28 22 80Z" fill="${h}"/>`;
}
function perso(id, mood="happy", cls="", o={}){
  return `<span class="perso rv ${cls}" data-c="${id}" data-m="${mood}"${o.t?` data-t="${o.t}"`:""}${o.loop?` data-loop="${o.loop}"`:""} role="img" aria-label="${CAST[id].nom}">${persoSVG(id,mood)}</span>`;
}
function persoSVG(id, mood="happy"){
  if(OBJSVG[id]) return `<svg class="pfb" viewBox="0 0 100 124" aria-hidden="true"><g class="bob">${OBJSVG[id]}</g></svg>`;
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
    ${c.st!=="long"?hair(c):`<path d="M22 40 Q22 16 50 16 Q78 16 78 40 Q66 28 50 28 Q34 28 22 40Z" fill="${c.hair}"/>`}
    <g class="eyes"><ellipse cx="40" cy="46" rx="3.8" ry="4.6" fill="#13234B"/><ellipse cx="60" cy="46" rx="3.8" ry="4.6" fill="#13234B"/>
     <circle cx="41.3" cy="44.4" r="1.3" fill="#fff"/><circle cx="61.3" cy="44.4" r="1.3" fill="#fff"/></g>
    ${c.glasses?`<g fill="none" stroke="#13234B" stroke-width="2.4"><rect x="31" y="38" width="17" height="15" rx="6"/><rect x="52" y="38" width="17" height="15" rx="6"/><path d="M48 45 H52"/></g>`:""}
    <circle cx="33" cy="57" r="4" fill="#FF7A85" opacity=".45"/><circle cx="67" cy="57" r="4" fill="#FF7A85" opacity=".45"/>
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
  CAST.moi={kind:"player", nom:"Toi", role:m.g==="m"?"le président":"la présidente", skin:s[0], sh:s[1], hair:HAIRS[m.hair]||HAIRS[0], st:m.st||"short", suit:"#13234B", suit2:"#0B1736", tie:m.g==="m"?"#FF4B55":null}; }
