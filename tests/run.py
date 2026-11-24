"""Série de tests Mandat 27 : parties complètes par clics réels, plusieurs écrans."""
import json, random, sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "file://" + str(Path(__file__).resolve().parent.parent / "index.html")
OUT = Path("/tmp/m27tests"); OUT.mkdir(exist_ok=True)
VIEWS = [("se",320,568),("s8",375,667),("i14",390,844),("max",430,932),("desk",1280,800)]
issues = []
def issue(v, where, what): issues.append(f"[{v}] {where}: {what}")

CHECK_JS = """() => {
  const W = innerWidth, out = [];
  if (document.documentElement.scrollWidth > W + 1) {
    const bad = [...document.querySelectorAll('#app *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > W + 2 && getComputedStyle(e).position!=='fixed'; })
      .slice(0,4).map(e => e.tagName + '.' + [...e.classList].join('.') + ' r=' + Math.round(e.getBoundingClientRect().right));
    out.push('débordement horizontal ' + document.documentElement.scrollWidth + '>' + W + ' ' + bad.join(' | '));
  }
  document.querySelectorAll('#app button, #app a, #app input').forEach(e => { const r = e.getBoundingClientRect();
    if (r.width && r.height && (r.height < 30 || r.width < 30) && !e.closest('.src') && !e.closest('label') && !e.closest('.card p') && e.offsetParent)
      out.push('cible tactile petite ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' «' + (e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30) + '»'); });
  document.querySelectorAll('#app .btn, #app .nm, #app .qa, #app .chip, #app .rb, #app h1, #app h2').forEach(e => {
    if (e.scrollWidth > e.clientWidth + 2) out.push('texte coupé «' + e.textContent.trim().slice(0,30) + '»'); });
  return out; }"""

def check(page, v, where):
    for m in page.evaluate(CHECK_JS): issue(v, where, m)

def click_text(page, txt, sel="button"):
    page.locator(sel, has_text=txt).first.click()

def play(v, w, h, reduced, shots=False, gender="f", mode="complet"):
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--allow-file-access-from-files"])
        ctx = b.new_context(viewport={"width":w,"height":h}, device_scale_factor=1, reduced_motion="reduce" if reduced else "no-preference",
                            has_touch=w<500, permissions=["clipboard-read","clipboard-write"])
        page = ctx.new_page(); page.set_default_timeout(8000); page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: m.type=="error" and errs.append(m.text))
        page.goto(URL); page.wait_for_timeout(300)
        page.evaluate("localStorage.clear()"); page.reload(); page.wait_for_timeout(300)
        snap = lambda n: shots and page.screenshot(path=str(OUT/f"{v}_{n}.png"), full_page=True)
        check(page, v, "accueil"); snap("00_home")
        click_text(page, "Commencer"); page.wait_for_timeout(200)
        check(page, v, "modes"); snap("005_modes")
        page.locator(".mode").nth(["rapide","trimestriel","complet"].index(mode)).click(); page.wait_for_timeout(200)
        NQ = page.evaluate("NQ()")
        if NQ != {"rapide":5,"trimestriel":15,"complet":30}[mode]: issue(v,"modes",f"{NQ} décisions en mode {mode}")
        check(page, v, "avatar"); snap("01_avatar_vide")
        if page.locator("button.btn.gold").is_enabled(): issue(v,"avatar","bouton photo actif sans genre choisi")
        page.get_by_role("button", name="Présidente" if gender=="f" else "Président", exact=True).click()
        page.locator(".sw").nth(3).click(); page.locator(".chip", has_text="Bouclés").click(); page.locator(".sws").nth(1).locator(".sw").nth(3).click()
        check(page, v, "avatar rempli"); snap("02_avatar")
        click_text(page, "photo officielle"); page.wait_for_timeout(700 if not reduced else 600)
        if not page.locator(".screen.elect").count(): issue(v,"avatar","pas d'écran élection après la photo")
        page.wait_for_timeout(0 if reduced else 2200); check(page, v, "élection"); snap("03_elect")
        txt = page.inner_text("#app")
        want = "Madame la Présidente" if gender=="f" else "Monsieur le Président"
        if not reduced: page.wait_for_timeout(2500)
        if want not in page.inner_text("#app") and want not in (page.locator("[data-type]").first.get_attribute("aria-label") or ""): issue(v,"élection",f"titre «{want}» absent")
        click_text(page, "Entrer à l'Élysée"); page.wait_for_timeout(200)
        check(page, v, "carte"); snap("04_map")
        fmts_seen = set()
        for n in range(NQ):
          try:
            nxt = page.locator(".node.next")
            if not nxt.count(): issue(v, f"décision {n+1}", "pas de bulle suivante sur la carte"); break
            nxt.click(); page.wait_for_timeout(120)
            guard = 0
            while page.locator(".screen.q").count() and not page.locator(".s-vote").count() and guard < 12:
                guard += 1
                st = page.get_attribute(".screen.q", "class")
                if "s-quiz" in st and page.locator(".qa:not([disabled])").count():
                    page.locator(".qa").nth(random.randrange(3)).click(); page.wait_for_timeout(150)
                if "s-faits" in st:
                    for f in page.locator(".flip").all(): f.click()
                if shots and n < 6: snap(f"1{n}_{st.split('s-')[1].split()[0]}")
                check(page, v, f"décision {n+1} étape {st.split('s-')[1].split()[0]}")
                page.locator(".nav .btn:not(.ghost)", has_text="Suivant").first.click(); page.wait_for_timeout(120)
            fmt = page.evaluate("fmtVote(S.qi)"); fmts_seen.add(fmt)
            if shots and n < 6: page.wait_for_timeout(1800); snap(f"2{n}_vote_{fmt}")
            check(page, v, f"décision {n+1} vote {fmt}")
            choice = random.choice("ABC")
            if fmt=="cartes":
                page.locator(f"#o{choice}").click(); page.wait_for_timeout(350); page.locator(f"#o{choice} .btn").click()
            elif fmt=="swipe":
                if choice=="B": page.locator(".rb.b").click()
                else:
                    page.locator("#sc").scroll_into_view_if_needed(); box = page.locator("#sc").bounding_box(); x, y = box["x"]+box["width"]/2, box["y"]+box["height"]/2
                    page.mouse.move(x,y); page.mouse.down(); page.mouse.move(x+(140 if choice=="A" else -140), y, steps=8); page.mouse.up()
            elif fmt=="ministres":
                page.locator(".min").nth("ABC".index(choice)).click(); page.wait_for_timeout(250)
                if shots and n<6: page.wait_for_timeout(1200); snap(f"2{n}_vote_ministres_pick")
                check(page, v, f"décision {n+1} ministre choisi")
                click_text(page, "Je suis ce conseil")
            elif fmt=="curseur":
                r = page.locator("input[type=range]"); r.focus()
                r.press("ArrowLeft" if choice=="A" else ("ArrowRight" if choice=="C" else "Home")); 
                if choice=="B": r.press("ArrowRight")
                click_text(page, "Je valide")
            else:
                page.locator(".bal").nth("ABC".index(choice)).click(); page.wait_for_timeout(200)
                check(page, v, f"décision {n+1} bulletin choisi"); click_text(page, "Glisser dans l'urne")
            page.wait_for_timeout(2100)
            got = page.evaluate("S.ch[Q[S.qi].id]")
            if got != choice: issue(v, f"décision {n+1} ({fmt})", f"vote enregistré {got} au lieu de {choice}")
            if not page.locator(".res").count(): issue(v, f"décision {n+1}", "écran résultat absent"); 
            if shots and n<2: page.wait_for_timeout(1500); snap(f"3{n}_result")
            check(page, v, f"décision {n+1} résultat")
            click_text(page, "Continuer"); page.wait_for_timeout(200)
            if page.locator(".screen.bilan").count():
                if shots: page.wait_for_timeout(2500); snap(f"4{n}_bilan")
                check(page, v, f"bilan après {n+1}")
                page.locator(".screen.bilan .btn.big").click(); page.wait_for_timeout(200)
            if n == min(13, NQ-2):  # reprise après rechargement
                page.reload(); page.wait_for_timeout(300)
                if page.evaluate("Object.keys(S.ch).length") != n+1 or page.evaluate("NQ()") != NQ: issue(v,"reprise","choix perdus au rechargement")
          except Exception as e:
            issue(v, f"décision {n+1}", "EXCEPTION " + str(e).split(chr(10))[0]); page.screenshot(path=str(OUT/f"{v}_fail_{n}.png"), full_page=True)
            page.evaluate("go('map')")
        if fmts_seen != {"cartes","swipe","ministres","curseur","bulletin"}: issue(v,"formats",f"vus: {fmts_seen}")
        if not page.locator(".screen.verdict").count(): issue(v,"fin","verdict non atteint")
        else:
            page.wait_for_timeout(0 if reduced else 3500); check(page, v, "verdict"); snap("50_verdict")
            page.locator(".affiche .link").first.click(); page.wait_for_timeout(500); check(page, v, "détail"); snap("51_detail")
            rows = page.locator(".detail tr").count()
            if rows != NQ+1: issue(v,"détail",f"{rows-1} lignes au lieu de {NQ}")
            click_text(page, "Revoir mon parcours"); page.wait_for_timeout(300); check(page, v, "parcours"); snap("53_parcours")
            n_items = page.locator("details.pc-item").count()
            if n_items != NQ: issue(v,"parcours",f"{n_items} décisions au lieu de {NQ}")
            page.locator("details.pc-item summary").nth(4).click(); page.wait_for_timeout(200); check(page, v, "parcours ouvert"); snap("54_parcours_ouvert")
            if page.locator("details.pc-item[open] .pc-opt.mine").count()!=1: issue(v,"parcours","choix du joueur non surligné")
            page.locator("details.pc-item[open] .btn").click(); page.wait_for_timeout(200)
            if page.locator(".hdr .btn", has_text="Parcours").count()!=1: issue(v,"parcours","pas de retour au parcours depuis un dossier rouvert")
            page.locator(".hdr .btn", has_text="Parcours").click(); page.wait_for_timeout(200)
            if not page.locator(".screen.parcours").count(): issue(v,"parcours","retour au parcours KO")
            page.locator(".parcours > .btn.big").click(); page.wait_for_timeout(200)
            click_text(page, "Copier mon résultat"); page.wait_for_timeout(300)
            if gender=="f" and "présidente" not in page.evaluate("document.querySelector('.toast')?.textContent || navigator.clipboard && ''") and w<500:
                pass
            if mode != "complet" and not page.locator(".deeper").count(): issue(v,"verdict","pas de proposition d'approfondir")
            if mode == "complet" and page.locator(".deeper").count(): issue(v,"verdict","approfondir affiché en complet")
            click_text(page, "Méthode et sources"); page.wait_for_timeout(200); check(page, v, "méthode"); snap("52_method")
            click_text(page, "Retour"); page.wait_for_timeout(200)
            if not page.locator(".screen.verdict").count(): issue(v,"méthode","Retour ne ramène pas au verdict")
        rv = page.evaluate("[RV.ok, RV.pool.length, RV.pool.filter(p=>p.ready).length, RV.pool.filter(p=>p.dead).length]")
        if not rv[0] or rv[3]: issue(v,"rive",f"Rive non chargé ou instances en échec {rv}")
        if rv[1] > 30: issue(v,"rive",f"trop d'instances Rive créées: {rv[1]}")
        if mode == "rapide" and page.locator(".screen.verdict").count():
            click_text(page, "Passer en Trimestriel"); page.wait_for_timeout(300)
            st = page.evaluate("[NQ(), Q.filter(q=>S.ch[q.id]).length, document.querySelectorAll('.node.done').length]")
            if st != [15,5,5]: issue(v,"approfondir",f"après passage en trimestriel: {st}")
            check(page, v, "carte après approfondir")
        rk = page.evaluate("rang().nom"); 
        if gender=="f" and "Présidente" not in rk: issue(v,"rang",rk)
        for e in errs: issue(v,"console",e)
        b.close()

def content():
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--allow-file-access-from-files"]); pg = b.new_page(); pg.goto(URL); pg.wait_for_timeout(300)
        r = pg.evaluate("""()=>{ const o=[];
          Q.forEach((q,i)=>{ ['A','B','C'].forEach(k=>{ const t=q.opts[k].t; if(t.length>75) o.push(`${q.id} option ${k} longue (${t.length})`); });
            if(q.hook.length>170) o.push(`${q.id} accroche longue (${q.hook.length})`);
            if(q.titre.length>55) o.push(`${q.id} titre long (${q.titre.length})`);
            q.faits.forEach(f=>{ if(!/^https:\\/\\//.test(f[2])) o.push(`${q.id} fait sans lien https`); });
            if(!POS[q.id]) o.push(q.id+' sans positions'); else KEYS.forEach(k=>{ if(!POS[q.id][k]) o.push(q.id+' sans '+k); });
            const used=['A','B','C'].filter(x=>supporters(q,x).length); if(used.length<2) o.push(q.id+' une seule option défendue');
            if(QUIZ[q.id]&&!q.faits[QUIZ[q.id].f]) o.push(q.id+' quiz sans fait'); });
          const words=Q.map(q=>[q.hook,q.pourquoi,...q.faits.map(f=>f[0]),q.pour[0],q.contre[0],...q.ailleurs.map(a=>a[1]),...['A','B','C'].flatMap(k=>[q.opts[k].t,q.opts[k].fort,q.opts[k].faible,q.opts[k].rep]),q.lecon].join(' ').split(/\\s+/).length);
          const tot=words.reduce((a,b)=>a+b,0);
          const unsourced=Q.reduce((a,q)=>a+KEYS.filter(k=>!POS[q.id][k][2]).length,0);
          return {o, minutes: Math.round(tot/200), maxWords: Math.max(...words), unsourced, perCand: Object.fromEntries(KEYS.map(k=>[k,Q.filter(q=>!POS[q.id][k][2]).length]))}; }""")
        b.close(); return r

if __name__ == "__main__":
    random.seed(27)
    c = content(); print("CONTENU", json.dumps(c, ensure_ascii=False, indent=1))
    mode = sys.argv[1] if len(sys.argv)>1 else "all"
    t0=time.time()
    if mode in ("all","fast"):
        for i,(v,w,h) in enumerate(VIEWS): play(v,w,h,reduced=True, gender="mf"[i%2], mode=["rapide","trimestriel","complet","complet","trimestriel"][i]); print("ok", v, round(time.time()-t0))
    if mode in ("all","anim"):
        play("anim390",390,844,reduced=False,shots=True,gender="f"); print("ok anim", round(time.time()-t0))
    seen=set(); uniq=[i for i in issues if not (i in seen or seen.add(i))]
    print(f"\n{len(uniq)} PROBLÈMES"); print("\n".join(uniq[:200]))
