# Mandat 27

Jeu web neutre : tu es président·e de 2027 à 2032, 30 décisions réelles et sourcées. À la fin, tu découvres quels candidats déclarés ont fait les mêmes choix.

Par Apprenti Politique. Ni un sondage, ni une consigne de vote. Aucune donnée envoyée : tout reste dans le navigateur.

## Structure
- `index.html` : le site complet (un seul fichier, publié tel quel par Netlify).
- `src/` : sources. `positions.js` (positions des candidats et sources), `questions.js` (30 décisions), `quiz.js`, `perso.js` (personnages), `app.js` (moteur), `shell.html` (styles).

## Modifier
Édite les fichiers de `src/`, puis régénère `index.html` :

```
python3 src/build.py
```

## Sources des positions
Lecture éditoriale de France-Vote (23/11/2026) avec la source primaire quand elle existe. Les positions non sourcées comptent pour moitié.

## Tests
`python3 tests/run.py` joue 6 parties complètes par vrais clics (écrans de 320 px à 1280 px, animations réduites ou non) et vérifie : débordements, textes coupés, cibles tactiles, erreurs console, enregistrement des votes dans les 5 formats, reprise après rechargement, verdict, et cohérence du contenu. Nécessite Playwright et Chrome.

## Animations Rive
- `rive/mandat27.riv` : animations compilées depuis le projet Rive local (`C:\Users\lucas\Projects\politics`, fichier `build/politics.riv`). Pour mettre à jour : recopier ce fichier ici sous le nom `mandat27.riv`.
- `rive/rive.js` + `rive/rive.wasm` : runtime web `@rive-app/canvas` 2.55.1, servi localement.
- `src/riveglue.js` : branchement. Les personnages SVG restent affichés en secours si Rive ne charge pas. Les instances Rive sont réutilisées d'un écran à l'autre et préparées hors champ pour masquer l'écran de démarrage Rive du plan gratuit.
- Déjà branchés : `Character` (tous les personnages, joueur compris, parole, humeurs, réactions), `BallotDrop` (urne après chaque vote) et `ElectionNight` (soirée électorale plein écran, joueur sur la télé, toucher pour passer).
