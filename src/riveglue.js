// ───────── Rive : personnages et urne animés (fichier rive/mandat27.riv)
// Les SVG de perso.js restent affichés en secours : tant que Rive n'est pas prêt,
// ou si le fichier ne charge pas, le jeu reste complet.
// Chaque instance Rive est gardée dans un « pool » et déplacée d'un écran à l'autre :
// on évite de recréer des canvas à chaque rendu (et l'écran de démarrage Rive
// du plan gratuit ne s'affiche que hors champ, pendant le préchauffage).
const RV = { buf:null, ok:false, pool:[], rm:false, SPLASH:1900 };
function hexARGB(h){ return (0xFF000000 | parseInt(h.slice(1),16)) >>> 0; }
function rvApplyChar(inst, c, mood){
  const col=(k,v)=>{ const p=inst.color(k); if(p&&v) p.value=hexARGB(v); };
  col("skinColor",c.skin); col("skinShade",c.sh); col("hairColor",c.hair);
  col("outfitColor",c.suit); col("outfitShade",c.suit2); col("tieColor",c.tie||"#FFC800");
  const e=(k,v)=>{ const p=inst.enum(k); if(p&&v) try{ p.value=v; }catch(_){} };
  e("kind",c.kind); e("hairStyle",c.st); e("mood",mood||"happy");
  const b=(k,v)=>{ const p=inst.boolean(k); if(p) p.value=!!v; };
  b("tie",!!c.tie); b("glasses",!!c.glasses); b("reducedMotion",RV.rm); b("talking",false); b("cheering",false);
}
function rvPark(){ let p=document.getElementById("rvpark"); if(!p){ p=document.createElement("div"); p.id="rvpark"; p.setAttribute("aria-hidden","true"); document.body.appendChild(p); } return p; }
function rvCreate(artboard, vmName){
  const canvas=document.createElement("canvas"); canvas.className="rvc"; canvas.width=100; canvas.height=124; rvPark().appendChild(canvas);
  const slot={artboard, canvas, r:null, inst:null, ready:false, used:false, born:performance.now()};
  slot.r=new rive.Rive({ riveFile:RV.file, canvas, artboard, stateMachines:artboard, autoplay:true, autoBind:false,
    layout:new rive.Layout({fit:rive.Fit.Contain}),
    onLoad:()=>{ try{ const vm=slot.r.viewModelByName(vmName); slot.inst=vm.instance(); slot.r.bindViewModelInstance(slot.inst);
        rvWaitSplash(slot); if(slot.pending) slot.pending(slot); }catch(e){ slot.dead=true; } },
    onLoadError:()=>{ slot.dead=true; } });
  RV.pool.push(slot); return slot;
}
// l'écran de démarrage Rive (plan gratuit) est noir : on attend qu'il ait disparu avant d'afficher
const RVPROBE=document.createElement("canvas"); RVPROBE.width=RVPROBE.height=6;
function rvWaitSplash(slot){ const t0=performance.now();
  const iv=setInterval(()=>{ let dark=1; try{ const x=RVPROBE.getContext("2d",{willReadFrequently:true}); x.clearRect(0,0,6,6); x.drawImage(slot.canvas,0,0,6,6);
      const d=x.getImageData(0,0,6,6).data; let n=0; for(let i=0;i<d.length;i+=4) if(d[i]<30&&d[i+1]<30&&d[i+2]<30&&d[i+3]>200) n++; dark=n/36; }catch(_){ dark=0; }
    if(dark<0.5&&performance.now()-t0>400 || performance.now()-t0>5000){ clearInterval(iv); if(!slot.host&&slot.artboard!=="Character") try{ slot.r.pause(); }catch(_){}
      setTimeout(()=>{ slot.ready=true; rvShow(slot); }, slot.artboard==="ElectionNight"?0:120); } },60); }
function rvShow(slot){ if(!slot.host){ try{ slot.r.pause(); }catch(_){} } if(slot.host&&slot.ready&&!slot.dead){ slot.host.classList.add("rv-on"); if(slot.onReady){ const f=slot.onReady; slot.onReady=null; f(slot); } } }
function rvSize(slot){ const w=slot.host.clientWidth||68, h=slot.host.clientHeight||84, d=Math.min(2,window.devicePixelRatio||1);
  if(slot.canvas.width!==Math.round(w*d)){ slot.canvas.width=Math.round(w*d); slot.canvas.height=Math.round(h*d); try{ slot.r.resizeDrawingSurfaceToCanvas(); }catch(_){} } }
function rvTake(artboard, vmName){ let s=RV.pool.find(p=>!p.used&&!p.dead&&p.artboard===artboard); if(!s) s=rvCreate(artboard,vmName); s.used=true; return s; }
function rvMount(){
  if(!RV.ok) return;
  RV.pool.forEach(p=>{ p.used=false; });
  // on réattribue d'abord les instances encore affichées à leur même hôte
  const sceneReady=RV.pool.some(p=>p.artboard==="ElectionNight"&&p.ready&&!p.dead&&!p.fired);
  const hosts=[...document.querySelectorAll(".rv")].filter(h=>!(sceneReady&&h.closest(".rvscene")&&!h.classList.contains("rvscene")));
  RV.pool.forEach(p=>{ p.host=null; });
  hosts.forEach(h=>{
    const ab=h.dataset.ab||"Character", vm=ab;
    const s=rvTake(ab,vm); s.host=h; h._rv=s;
    if(s.canvas.parentNode!==h) h.appendChild(s.canvas);
    h.classList.toggle("rv-on", s.ready&&!s.dead);
    const setup=sl=>{
      if(ab==="ElectionNight"){ const pl=sl.inst.viewModel&&sl.inst.viewModel("player"); if(pl&&CAST.moi) rvApplyChar(pl,CAST.moi,"happy");
        const b=sl.inst.boolean("reducedMotion"); if(b) b.value=RV.rm; sl.fired=true; sl.r.play(); rvSize(sl);
        if(RV.rm){ const t=sl.inst.trigger("skip"); if(t) t.trigger(); } return; }
      if(ab==="MapNode"||ab==="PlayerMarker"){
        const b=sl.inst.boolean("reducedMotion"); if(b) b.value=RV.rm;
        if(ab==="MapNode"){ ["state","theme"].forEach(k=>{ const e=sl.inst.enum(k); if(e&&h.dataset[k]) try{ e.value=h.dataset[k]; }catch(_){} }); }
        else { const pl=sl.inst.viewModel&&sl.inst.viewModel("player"); const c=CAST[h.dataset.c]; if(pl&&c) rvApplyChar(pl,c,"happy"); }
        sl.r.play(); rvSize(sl);
        if(h.dataset.t){ const t=h.dataset.t; sl.onReady=x=>{ const tr=x.inst&&x.inst.trigger(t); if(tr) tr.trigger(); }; if(sl.ready) rvShow(sl); }
        return; }
      if(ab==="BallotDrop"){ const e=sl.inst.enum("stampText"); if(e) try{ e.value=h.dataset.stamp||"signe"; }catch(_){} const b=sl.inst.boolean("reducedMotion"); if(b) b.value=RV.rm; }
      else { const c=CAST[h.dataset.c]; if(c) rvApplyChar(sl.inst,c,h.dataset.m); if(h.dataset.loop){ const b=sl.inst.boolean(h.dataset.loop); if(b) b.value=!RV.rm; } }
      sl.r.play(); rvSize(sl);
      if(h.dataset.t){ const t=h.dataset.t; sl.onReady=x=>{ const tr=x.inst&&x.inst.trigger(t); if(tr){ tr.trigger(); if(ab==="BallotDrop") x.fired=true; } }; if(sl.ready) rvShow(sl); }
    };
    if(s.inst) setup(s); else s.pending=setup;
  });
  const park=rvPark(); RV.pool.forEach(p=>{ if(!p.used&&p.canvas.parentNode!==park){ park.appendChild(p.canvas); if(p.ready) try{ p.r.pause(); }catch(_){} } });
  // l'urne est une animation à usage unique : on jette l'instance jouée et on en prépare une neuve hors champ
  RV.pool.filter(p=>!p.used&&p.fired).forEach(p=>{ try{ p.r.cleanup(); }catch(_){} p.canvas.remove(); RV.pool.splice(RV.pool.indexOf(p),1); rvCreate(p.artboard,p.artboard); });
}
function rvTalk(sayEl,on){ const h=sayEl&&sayEl.querySelector(".rv"); const s=h&&h._rv; if(s&&s.inst){ const b=s.inst.boolean("talking"); if(b) b.value=on; } }
function rvPrewarm(){ // instances préparées hors champ pendant l'accueil
  const started=S.modePicked||Object.keys(S.ch).length;
  const want=[["Character",9],["BallotDrop",1],["MapNode",started?NQ():0],["PlayerMarker",started?1:0]];
  if(!Object.keys(S.ch).length) want.push(["ElectionNight",1]); // seulement si la soirée électorale est encore à venir
  want.forEach(([ab,n])=>{ const have=RV.pool.filter(p=>p.artboard===ab).length; for(let i=have;i<n;i++) rvCreate(ab, ab); });
}
function rvInit(){
  RV.rm=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
  if(typeof rive==="undefined") return;
  // Les animations Rive actuelles sont dans l'ancien style : coupées par défaut, ?rive=1 pour les tester.
  if(!/[?&]rive=1/.test(location.search)) return;
  try{ rive.RuntimeLoader.setWasmUrl("rive/rive.wasm"); rive.Rive.suppressDeprecationWarn=true; }catch(_){}
  const go=b=>{ RV.buf=b; RV.file=new rive.RiveFile({buffer:b}); RV.file.init().then(()=>{ RV.ok=true; rvPrewarm(); rvMount(); }).catch(()=>{}); };
  if(window.MANDAT27_RIV){ try{ const s=atob(window.MANDAT27_RIV), u=new Uint8Array(s.length); for(let i=0;i<s.length;i++) u[i]=s.charCodeAt(i); go(u.buffer); return; }catch(_){} }
  fetch("rive/mandat27.riv").then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); }).then(go).catch(()=>{});
}
