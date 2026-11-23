// 30 décisions fixes, 6 par année. Option A = soutien net à la thèse,
// B = position intermédiaire (plutôt pour, nuancé ou plutôt contre), C = opposition nette.
// b = effet sur les finances publiques (-1 coûte, +1 rapporte ou économise, 0 neutre / incertain)
// c = effet climat (-1 défavorable, +1 favorable, 0 sans effet direct). Tendances, pas des prévisions.
const ANNEES = [
 {an:2027, titre:"Les 100 premiers jours", sous:"Argent, travail, monde : on attaque fort."},
 {an:2028, titre:"Soigner et produire", sous:"Santé, énergie, justice."},
 {an:2029, titre:"École et nation", sous:"Qui apprend quoi, qui devient français."},
 {an:2030, titre:"La planète et le monde", sous:"Climat, agriculture, Europe, défense."},
 {an:2031, titre:"Changer les règles", sous:"Travail, droits, institutions."}
];

const Q = [
// ───────── 2027
{id:"retraite", an:0, theme:"Retraites",
 titre:"À quel âge part-on à la retraite ?",
 hook:"La réforme de 2023 a fixé l'âge légal à 64 ans. Tu gardes, tu reviens en arrière ou tu vas plus loin ?",
 pourquoi:"Tes cotisations paient les pensions d'aujourd'hui. L'âge de départ et le niveau des pensions décideront de ta propre retraite, vers 2070.",
 faits:[
  ["En 2025, les retraites coûtent 422 milliards d'euros, soit 14,1 % du PIB.","COR, rapport annuel juin 2026","https://www.cor-retraites.fr/rapports-du-cor/rapport-annuel-cor-juin-2026-evolutions-perspectives-retraites-france"],
  ["Le COR prévoit un déficit de 0,2 point de PIB en 2030 et de 2,4 points en 2070 (contre 1,4 point prévu un an plus tôt).","COR, juin 2026","https://www.cor-retraites.fr/rapports-du-cor/rapport-annuel-cor-juin-2026-evolutions-perspectives-retraites-france"],
  ["Pour équilibrer, il n'existe que trois leviers : l'âge, les cotisations ou le niveau des pensions.","COR, partie 2 ch. 6","https://www.cor-retraites.fr/sites/default/files/2026-06/RA_Part2_Chap6.pdf"]],
 pour:["Reculer l'âge rapporte vite et évite de baisser les pensions ou d'augmenter les cotisations.","Arguments des défenseurs de la réforme"],
 contre:["Les métiers pénibles et les carrières longues paient le plus ; une partie du coût se reporte sur le chômage et l'invalidité.","Le COR note que reculer l'âge augmente aussi d'autres dépenses sociales"],
 ailleurs:[["Allemagne","Âge légal porté progressivement à 67 ans d'ici 2031."],["Suède","Départ flexible : plus tu pars tard, plus ta pension est élevée."]],
 opts:{
  A:{t:"Revenir à 62 ans (voire 60)",fort:"Plus de temps en bonne santé à la retraite.",faible:"Coûte plusieurs milliards par an à financer.",rep:"« On finance par les cotisations patronales et la taxation des revenus du capital. »",b:-1,c:0},
  B:{t:"Un âge selon la carrière (entre 62 et 64 ans)",fort:"Protège les carrières longues et pénibles.",faible:"Plus complexe, rapporte moins que 64 ans pour tous.",rep:"« L'âge unique est injuste : on doit compter les années travaillées. »",b:0,c:0},
  C:{t:"Garder 64 ans, voire aller vers 65, et ajouter de la capitalisation",fort:"Améliore les comptes rapidement.",faible:"Impopulaire, et la capitalisation dépend des marchés.",rep:"« On vit plus longtemps : sans travailler plus, ce sont tes pensions qui baisseront. »",b:1,c:0}},
 lecon:"Aucune option n'est gratuite : chacune choisit qui paie, entre actifs, retraités et contribuables."},

{id:"smic", an:0, theme:"Salaires",
 titre:"Faut-il augmenter fortement le SMIC ?",
 hook:"Le SMIC est à 1 823 € brut par mois. Tu donnes un gros coup de pouce ou tu laisses la règle automatique ?",
 pourquoi:"Ton premier job sera souvent payé au SMIC ou juste au-dessus. Un salarié du privé sur huit est concerné directement.",
 faits:[
  ["Au 1er janvier 2026, le SMIC a augmenté de 1,18 % : 12,02 € brut de l'heure, 1 823,03 € brut par mois.","info.gouv.fr, déc. 2025","https://www.info.gouv.fr/actualite/le-smic-revalorise-au-1er-janvier-2026"],
  ["Environ 2,2 millions de salariés du privé étaient payés au SMIC fin 2024, soit 12,4 %.","Dares, cité par Moneyvox","https://www.moneyvox.fr/votre-argent/actualites/110844/smic-qui-sont-les-salaries-qui-touchent-le-salaire-minimum-en-2026-les-resultats-de-etude-de-la-dares"],
  ["Sans « coup de pouce », le SMIC suit l'inflation et la moitié des gains de pouvoir d'achat des ouvriers et employés.","info.gouv.fr","https://www.info.gouv.fr/actualite/le-smic-revalorise-au-1er-janvier-2026"]],
 pour:["Les bas salaires ont été rattrapés par le SMIC : beaucoup de salariés restent bloqués au minimum toute leur carrière.","Syndicats, partisans d'une hausse"],
 contre:["Une forte hausse peut freiner l'embauche des moins qualifiés et coûte cher en allègements de charges.","Groupe d'experts sur le SMIC, qui déconseille le coup de pouce depuis des années"],
 ailleurs:[["Allemagne","Le salaire minimum horaire a été relevé à 13,90 € en 2026, décidé par une commission indépendante."],["Royaume-Uni","Hausse forte et planifiée du salaire minimum depuis 2016, sans hausse marquée du chômage selon la Low Pay Commission."]],
 opts:{
  A:{t:"SMIC à 1 600 € net et hausses de salaires imposées",fort:"Gain immédiat pour des millions de personnes.",faible:"Risque pour les petites entreprises aux marges faibles.",rep:"« Les profits et les dividendes peuvent absorber la hausse. »",b:0,c:0},
  B:{t:"Augmenter le net autrement (baisse de cotisations, coup de pouce modéré)",fort:"Plus de net sans tout faire peser sur l'employeur.",faible:"Moins de recettes pour la Sécu, à compenser ailleurs.",rep:"« C'est l'écart entre brut et net qu'il faut réduire. »",b:-1,c:0},
  C:{t:"Pas de hausse imposée, on garde la règle automatique",fort:"Protège l'emploi et la compétitivité.",faible:"Le pouvoir d'achat des bas salaires stagne.",rep:"« Les salaires montent avec la croissance et la productivité, pas par décret. »",b:0,c:0}},
 lecon:"Le SMIC touche directement le pouvoir d'achat, mais aussi l'emploi et les comptes publics à cause des allègements de charges."},

{id:"isf", an:0, theme:"Impôts",
 titre:"Taxer les très grandes fortunes ?",
 hook:"En 2018, l'ISF a été remplacé par un impôt sur l'immobilier seulement. On le rétablit ?",
 pourquoi:"C'est une question de justice fiscale et de recettes : l'argent récolté (ou pas) finance l'école, l'hôpital, ou réduit la dette que ta génération remboursera.",
 faits:[
  ["Depuis 2018, l'ISF est devenu l'IFI (immobilier seulement), et les revenus du capital sont taxés à un taux unique de 30 %.","vie-publique.fr","https://www.vie-publique.fr/en-bref/281993-suppression-de-lisf-bilan-2021-sur-la-fiscalite-du-capital"],
  ["L'évaluation officielle n'a pas pu démontrer d'effet de cette réforme sur l'investissement dans les entreprises.","France Stratégie, rapport final 2023","https://www.strategie.gouv.fr/sites/strategie.gouv.fr/files/atoms/files/fs-2023-rapport-isf-quatrieme_rapport_complet_17octobre.pdf"],
  ["En 2025, la « taxe Zucman » (2 % minimum sur les patrimoines de plus de 100 M€) a relancé le débat au Parlement.","Public Sénat, sept. 2025","https://www.publicsenat.fr/actualites/economie/50-nuances-de-taxe-zucman-quelles-autres-options-sont-sur-la-table-pour-taxer-les-ultra-riches"]],
 pour:["Les ultra-riches paient proportionnellement moins d'impôts que la classe moyenne, car leurs revenus restent dans des holdings.","Gabriel Zucman, économiste"],
 contre:["Taxer le patrimoine peut pousser à l'exil et oblige à valoriser des parts d'entreprises non cotées.","Opposants à la taxe, organisations patronales"],
 ailleurs:[["Espagne","Impôt sur la fortune maintenu, complété en 2022 par un impôt de solidarité sur les grandes fortunes."],["Norvège","Hausse de l'impôt sur la fortune en 2022, suivie du départ de plusieurs riches vers la Suisse."]],
 opts:{
  A:{t:"Rétablir un ISF ou une taxe plancher sur les ultra-riches",fort:"Nouvelles recettes, sentiment de justice.",faible:"Risque d'exil et de contournement.",rep:"« Une taxe liée à la nationalité ou une exit tax limite l'exil. »",b:1,c:0},
  B:{t:"Mieux taxer certains revenus du capital, ou agir au niveau européen",fort:"Moins de risque de fuite.",faible:"Rapporte moins, prend plus de temps.",rep:"« Seule une règle commune européenne évite la concurrence fiscale. »",b:1,c:0},
  C:{t:"Aucun nouvel impôt sur le patrimoine",fort:"Stabilité pour les investisseurs.",faible:"Pas de recettes nouvelles, inégalités inchangées.",rep:"« La France a déjà l'un des taux de prélèvements les plus élevés d'Europe. »",b:0,c:0}},
 lecon:"Le débat porte moins sur le principe que sur l'efficacité : combien ça rapporte vraiment, et combien partent."},

{id:"prod", an:0, theme:"Entreprises",
 titre:"Baisser encore les impôts des entreprises ?",
 hook:"Les impôts de production (payés avant même tout bénéfice) pèsent sur les usines. Tu baisses ?",
 pourquoi:"Ça décide où les usines s'installent, et donc où tu trouveras du travail, mais aussi combien l'État récolte pour les services publics.",
 faits:[
  ["Édouard Philippe propose 50 milliards d'euros de baisse des impôts de production sur le quinquennat.","Public Sénat, 6 nov. 2025","https://www.publicsenat.fr/actualites/economie/entreprises-un-deal-a-250-milliards-deuros-sur-un-quinquennat-que-represente-la-proposition-dedouard-philippe"],
  ["LFI propose à l'inverse de rétablir la CVAE (un impôt de production supprimé progressivement depuis 2023).","Contre-budget LFI, oct. 2026","https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf"]],
 pour:["Les impôts de production frappent même les entreprises en perte et pénalisent surtout l'industrie.","Conseil d'analyse économique (2019), organisations patronales"],
 contre:["Les baisses déjà faites ont coûté cher sans contrepartie exigée en emplois ou en investissements.","Économistes critiques, syndicats"],
 ailleurs:[["Allemagne","Fiscalité de production bien plus faible qu'en France, avec une industrie plus importante."]],
 opts:{
  A:{t:"Baisser fortement les impôts de production et les charges",fort:"Rend la France plus attractive pour l'industrie.",faible:"Des dizaines de milliards de recettes en moins.",rep:"« Plus d'usines, c'est plus d'emplois et donc plus de recettes plus tard. »",b:-1,c:0},
  B:{t:"Baisser, mais en échange d'engagements (emplois, investissements)",fort:"Chaque euro est conditionné.",faible:"Lourd à contrôler.",rep:"« Pas d'argent public sans contreparties. »",b:-1,c:0},
  C:{t:"Rétablir la CVAE et revoir les aides aux entreprises",fort:"Plus de recettes pour l'État et les collectivités.",faible:"Risque de délocalisation.",rep:"« Les aides aux entreprises dépassent 200 milliards par an : on peut en reprendre une partie. »",b:1,c:0}},
 lecon:"Baisser un impôt n'est pas gratuit : il faut savoir ce qu'on obtient en retour et qui compense."},

{id:"quotas", an:0, theme:"Immigration",
 titre:"Fixer des quotas d'immigration ?",
 hook:"Chaque année, l'État délivre des centaines de milliers de premiers titres de séjour. Tu fixes un plafond voté ?",
 pourquoi:"L'immigration concerne l'économie (métiers en tension), les études (étudiants étrangers) et la cohésion du pays.",
 faits:[
  ["Les premiers titres de séjour dépassent 300 000 par an ; les études et la famille sont les premiers motifs.","Ministère de l'Intérieur (DGEF), chiffres annuels","https://www.immigration.interieur.gouv.fr/Info-ressources/Etudes-et-statistiques"],
  ["Édouard Philippe propose un débat annuel au Parlement sur des objectifs chiffrés ; le RN veut des quotas soumis à référendum.","France-Vote, thème immigration","https://www.france-vote.fr/theme/immigration"]],
 pour:["Fixer un chiffre permet de choisir qui vient selon les besoins et la capacité d'accueil.","Partisans de quotas"],
 contre:["Une grande partie de l'immigration relève de droits (famille, asile) protégés par la Constitution et les traités européens : un quota ne peut pas tout couvrir.","Juristes, opposants aux quotas"],
 ailleurs:[["Canada","Objectifs d'immigration annuels publiés et votés, revus à la baisse en 2025."],["Italie","Décret annuel de quotas de travailleurs étrangers."]],
 opts:{
  A:{t:"Quotas annuels contraignants et forte baisse",fort:"Objectif clair et contrôlable.",faible:"Se heurte au droit d'asile et au regroupement familial.",rep:"« On révise la Constitution par référendum pour le permettre. »",b:0,c:0},
  B:{t:"Objectifs indicatifs débattus au Parlement, immigration de travail ciblée",fort:"Pilotage sans casser les droits existants.",faible:"Moins lisible, moins contraignant.",rep:"« On peut maîtriser sans renier l'État de droit. »",b:0,c:0},
  C:{t:"Pas de quotas, faciliter les voies légales",fort:"Moins de clandestinité, réponse aux besoins de main-d'œuvre.",faible:"Peut être perçu comme un appel d'air.",rep:"« Les voies légales réduisent les filières clandestines. »",b:0,c:0}},
 lecon:"En immigration, le droit (Constitution, traités, asile) limite ce qu'un président peut décider seul."},

{id:"ukraine", an:0, theme:"International",
 titre:"Continuer l'aide militaire à l'Ukraine ?",
 hook:"La guerre dure depuis 2022. Tu continues d'envoyer des armes, tu réduis, tu arrêtes ?",
 pourquoi:"La sécurité de l'Europe, le prix de l'énergie et le budget de la défense en dépendent.",
 faits:[
  ["La France est parmi les soutiens militaires de l'Ukraine, derrière d'autres pays européens comme l'Allemagne et le Royaume-Uni.","Kiel Institute, Ukraine Support Tracker","https://www.ifw-kiel.de/topics/war-against-ukraine/ukraine-support-tracker/"],
  ["En mars 2024, l'Assemblée a voté sur l'accord de sécurité France-Ukraine : le RN s'est abstenu, LFI a voté contre.","Assemblée nationale, scrutin n° 3461","https://www.assemblee-nationale.fr/dyn/16/scrutins/3461"]],
 pour:["Si la Russie gagne, d'autres pays européens pourraient être menacés ; aider coûte moins qu'une guerre plus large.","Partisans du soutien"],
 contre:["Les livraisons d'armes prolongent la guerre et risquent l'escalade ; il faut pousser la négociation.","Partisans d'une priorité diplomatique"],
 ailleurs:[["États-Unis","Aide fortement réduite depuis 2025, ce qui reporte l'effort sur les Européens."]],
 opts:{
  A:{t:"Soutien militaire durable et saisie des avoirs russes gelés",fort:"Message de fermeté face à la Russie.",faible:"Coût élevé, risque d'escalade.",rep:"« La paix durable passe par une Ukraine capable de se défendre. »",b:-1,c:0},
  B:{t:"Aide limitée, sans cobelligérance, priorité à la négociation",fort:"Moins de risque d'escalade.",faible:"L'Ukraine pourrait perdre du terrain.",rep:"« La France doit parler à tout le monde pour obtenir un cessez-le-feu. »",b:0,c:0},
  C:{t:"Arrêter l'aide militaire",fort:"Économies, aucune implication.",faible:"Isole la France de ses alliés européens.",rep:"« Ce n'est pas notre guerre. »",b:1,c:0}},
 lecon:"Ici, aucun des 8 candidats ne propose d'arrêter totalement : le vrai clivage oppose soutien maximal et soutien prudent."},

// ───────── 2028
{id:"rsa", an:1, theme:"Social",
 titre:"Conditionner le RSA à des heures d'activité ?",
 hook:"Depuis 2025, les allocataires du RSA doivent faire 15 heures d'activité par semaine. Tu durcis, tu adoucis ?",
 pourquoi:"Le RSA est le filet de sécurité des plus pauvres, y compris des jeunes de 25 ans et plus sans emploi.",
 faits:[
  ["La loi plein emploi (2023) prévoit 15 heures d'activité hebdomadaires pour les allocataires, généralisées en 2025.","CNCDH, 2024","https://www.cncdh.fr/sites/default/files/2024-12/D%20-%202024%20-%207%20-%20D%C3%A9claration%20Loi%20Plein%20Emploi%20RSA%20Conditionn%C3%A9_0.pdf"],
  ["L'expérimentation a augmenté le taux d'emploi salarié des participants de 3,6 points, mais une partie de l'effet est compensée par des effets sur les autres allocataires.","Dares / IPP, 2026","https://www.ipp.eu/wp-content/uploads/2026/06/Synthese_dares_ipp_brsa.pdf"]],
 pour:["L'accompagnement intensif ramène vers l'emploi des personnes jusque-là laissées seules.","Départements expérimentateurs, gouvernement"],
 contre:["L'obligation peut faire renoncer des personnes à leurs droits : plus d'un tiers des ayants droit ne demandent déjà pas le RSA.","Secours catholique, ATD Quart Monde, CNCDH"],
 ailleurs:[["Royaume-Uni","Universal Credit avec obligations et sanctions fortes, critiquées pour leurs effets sur la pauvreté."]],
 opts:{
  A:{t:"15 heures obligatoires avec sanctions",fort:"Contrepartie claire, retour vers l'emploi.",faible:"Risque de non-recours et de sanctions injustes.",rep:"« La solidarité, c'est des droits et des devoirs. »",b:1,c:0},
  B:{t:"Accompagnement renforcé, sans automatisme de sanction",fort:"Garde l'effet positif de l'accompagnement.",faible:"Moins dissuasif selon ses critiques.",rep:"« Ce qui marche, c'est le conseiller, pas la menace. »",b:0,c:0},
  C:{t:"RSA sans condition, et le revaloriser",fort:"Personne ne tombe sous le seuil de survie.",faible:"Coûte plus cher.",rep:"« Le RSA est un droit, pas une récompense. »",b:-1,c:0}},
 lecon:"Les évaluations montrent un effet réel mais modeste : le débat porte surtout sur la place des sanctions."},

{id:"hopital", an:1, theme:"Santé",
 titre:"Un grand plan pour l'hôpital public ?",
 hook:"Urgences saturées, soignants épuisés. Tu embauches massivement ou tu réorganises à budget serré ?",
 pourquoi:"Un jour tu iras aux urgences, ou tes proches. Le délai d'attente dépend de ce choix.",
 faits:[
  ["Le nombre de lits d'hospitalisation complète baisse depuis plus de vingt ans, tandis que l'hospitalisation de jour augmente.","DREES, Les établissements de santé","https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/panoramas-de-la-drees/les-etablissements-de-sante"],
  ["Éric Zemmour propose 40 000 soignants ; Bruno Retailleau refuse les embauches publiques massives dans son plan de 200 Md€ d'économies.","France-Vote, thème santé","https://www.france-vote.fr/theme/sante"]],
 pour:["Le manque de personnel ferme des lits ; sans recrutements et meilleurs salaires, rien ne change.","Syndicats de soignants, fédérations hospitalières"],
 contre:["La France dépense déjà beaucoup pour la santé ; le problème est l'organisation et l'excès de bureaucratie.","Partisans de la maîtrise des dépenses"],
 ailleurs:[["Royaume-Uni","Le NHS, sous-financé pendant des années, connaît des listes d'attente record malgré des plans de rattrapage."]],
 opts:{
  A:{t:"Plan massif : budget en forte hausse et recrutements",fort:"Réponse directe à la pénurie.",faible:"Coûte cher, et former des soignants prend des années.",rep:"« La santé n'est pas une dépense, c'est un investissement. »",b:-1,c:0},
  B:{t:"Investissements ciblés et réorganisation, sans embauches massives",fort:"Coût maîtrisé.",faible:"Effet plus lent sur le terrain.",rep:"« Mieux dépenser avant de dépenser plus. »",b:0,c:0},
  C:{t:"Maîtrise des dépenses et gestion décentralisée",fort:"Aide à réduire le déficit.",faible:"Risque d'aggraver la saturation.",rep:"« L'argent existe : il est mal réparti. »",b:1,c:0}},
 lecon:"Même avec plus d'argent, il faut des années pour former des soignants : les effets se jugent sur le long terme."},

{id:"deserts", an:1, theme:"Santé",
 titre:"Obliger les médecins à s'installer où on manque ?",
 hook:"Des millions de Français n'ont pas de médecin traitant. Tu régules l'installation ?",
 pourquoi:"Si tu vis loin d'une grande ville, trouver un médecin peut prendre des mois.",
 faits:[
  ["En 2025, l'Assemblée a adopté en première lecture la proposition de loi transpartisane « Garot » qui régule l'installation des médecins.","Assemblée nationale","https://www.assemblee-nationale.fr/dyn/17/dossiers/lutte_contre_deserts_medicaux"],
  ["Les médecins libéraux choisissent librement leur lieu d'installation ; infirmiers et kinés sont déjà régulés dans les zones bien dotées.","Assurance maladie","https://www.ameli.fr/"]],
 pour:["Les incitations financières n'ont pas suffi depuis 20 ans ; la régulation existe déjà pour d'autres professions.","Élus des territoires ruraux, associations de patients"],
 contre:["Contraindre risque de décourager les jeunes médecins de s'installer en libéral.","Syndicats de médecins, ordre des médecins"],
 ailleurs:[["Allemagne","Planification des installations par zone depuis les années 1990."]],
 opts:{
  A:{t:"Réguler : pas de nouvelle installation là où il y a déjà assez de médecins",fort:"Répartition plus juste.",faible:"Risque de fuite vers le salariat ou l'étranger.",rep:"« Les études sont payées par la collectivité : un engagement est normal. »",b:0,c:0},
  B:{t:"Incitations plus quelques obligations (stages, années en zone sous-dotée)",fort:"Compromis acceptable par la profession.",faible:"Effet plus lent.",rep:"« On convainc d'abord, on contraint en dernier recours. »",b:-1,c:0},
  C:{t:"Liberté d'installation totale, former plus de médecins",fort:"Respecte la profession.",faible:"Les effets n'arriveront pas avant dix ans.",rep:"« La seule vraie solution, c'est le nombre. »",b:-1,c:0}},
 lecon:"Le problème est autant le nombre de médecins que leur répartition."},

{id:"nucleaire", an:1, theme:"Énergie",
 titre:"Construire de nouveaux réacteurs nucléaires ?",
 hook:"EDF chiffre six EPR2 à 72,8 milliards d'euros. Tu signes ?",
 pourquoi:"Ta facture d'électricité et le climat des prochaines décennies en dépendent : un réacteur décidé aujourd'hui produira jusqu'en 2100.",
 faits:[
  ["EDF a présenté fin 2025 un devis de 72,8 milliards d'euros pour six EPR2, hors coûts de financement.","Opéra Énergie, déc. 2025","https://opera-energie.com/media/nucleaire-le-cout-des-six-epr2-envole/"],
  ["La Cour des comptes juge que la conception, le devis et le financement du programme comportent encore de fortes incertitudes.","vie-publique.fr, janv. 2025","https://www.vie-publique.fr/en-bref/296850-nucleaire-la-filiere-epr-face-des-risques-persistants"],
  ["L'EPR de Flamanville a coûté 23,7 milliards d'euros avec douze ans de retard, contre 3,3 milliards prévus.","Cour des comptes, via vie-publique.fr","https://www.vie-publique.fr/en-bref/296850-nucleaire-la-filiere-epr-face-des-risques-persistants"]],
 pour:["Le nucléaire produit une électricité pilotable et bas carbone, utile pour remplacer le pétrole et le gaz.","RTE, Futurs énergétiques 2050 (scénarios avec nouveau nucléaire)"],
 contre:["Coûts et délais dérapent, les déchets restent un problème, et les renouvelables se déploient plus vite.","Opposants au nucléaire"],
 ailleurs:[["Allemagne","Sortie du nucléaire achevée en 2023."],["Suède","Relance du nucléaire décidée après des années de débat."]],
 opts:{
  A:{t:"Six EPR2 et plus, relance massive",fort:"Électricité bas carbone et pilotable.",faible:"Coûts et délais incertains, premier réacteur vers 2038.",rep:"« L'énergie nucléaire a fait de la France l'un des pays les moins carbonés d'Europe. »",b:-1,c:1},
  B:{t:"Prolonger le parc et construire quelques réacteurs, avec beaucoup de renouvelables",fort:"Diversifie les risques.",faible:"Demande les deux investissements à la fois.",rep:"« Il ne faut pas tout miser sur une seule technologie. »",b:-1,c:1},
  C:{t:"Sortie progressive du nucléaire, 100 % renouvelables",fort:"Fin des déchets et des risques d'accident.",faible:"Défi immense de stockage et de flexibilité.",rep:"« Les renouvelables sont moins chers et plus rapides à construire. »",b:0,c:0}},
 lecon:"Presque tous les candidats veulent du nouveau nucléaire ; LFI est la seule à défendre une sortie."},

{id:"enr", an:1, theme:"Énergie",
 titre:"Accélérer l'éolien et le solaire ?",
 hook:"Éoliennes et panneaux solaires : tu fonces, tu continues tranquillement, ou tu arrêtes ?",
 pourquoi:"Pour sortir du pétrole et du gaz, il faudra beaucoup plus d'électricité. La question est : produite comment ?",
 faits:[
  ["Selon RTE, tous les scénarios qui atteignent la neutralité carbone en 2050 demandent un fort développement des renouvelables, même avec du nouveau nucléaire.","RTE, Futurs énergétiques 2050","https://www.rte-france.com/analyses-tendances-et-prospectives/bilan-previsionnel-2050-futurs-energetiques"],
  ["Le RN propose un moratoire sur l'éolien et le solaire ; Bruno Retailleau veut arrêter leur financement public.","France-Vote, thème écologie","https://www.france-vote.fr/theme/ecologie"]],
 pour:["Ce sont les moyens de production les moins chers à construire aujourd'hui, et les plus rapides.","RTE, Agence internationale de l'énergie"],
 contre:["Production intermittente, impact sur les paysages, subventions élevées.","Opposants à l'éolien"],
 ailleurs:[["Espagne","Très forte croissance du solaire ; une grande panne en avril 2025 a relancé le débat sur la stabilité du réseau."]],
 opts:{
  A:{t:"Accélérer massivement (solaire, éolien en mer et sur terre)",fort:"Électricité nouvelle rapidement.",faible:"Contestations locales, besoin de réseau.",rep:"« Chaque année perdue, c'est du gaz importé. »",b:-1,c:1},
  B:{t:"Continuer au rythme prévu, en privilégiant le solaire et l'éolien en mer",fort:"Moins de conflits locaux.",faible:"Peut être trop lent pour les objectifs climat.",rep:"« Développer, oui, mais pas n'importe où. »",b:0,c:1},
  C:{t:"Moratoire sur l'éolien, fin des subventions",fort:"Économies, paysages préservés.",faible:"Moins d'électricité bas carbone avant 2040.",rep:"« Le nucléaire suffit, l'éolien coûte cher et ne produit pas sans vent. »",b:1,c:-1}},
 lecon:"Nucléaire et renouvelables ne s'opposent pas forcément : la plupart des scénarios d'experts combinent les deux."},

{id:"planchers", an:1, theme:"Justice",
 titre:"Rétablir les peines planchers pour les récidivistes ?",
 hook:"Une peine minimale automatique pour qui récidive : tu l'imposes aux juges ?",
 pourquoi:"Le sentiment d'impunité et la surpopulation des prisons touchent tout le monde : victimes, détenus, surveillants.",
 faits:[
  ["Des peines planchers ont existé de 2007 à 2014. Sur cette période, le taux de condamnations en récidive est passé de 10 % à 12,1 % (2007-2011).","Ministère de la Justice, réponse à une question écrite","https://questions.assemblee-nationale.fr/dyn/14/questions/QANR5L14QE830.pdf"],
  ["Une étude indépendante de 2024 a évalué sur le long terme les effets dissuasifs de ces peines.","Ouss & Philippe, 2024","https://ideas.repec.org/p/hal/wpaper/halshs-04563087.html"]],
 pour:["La certitude d'une peine sévère dissuade et protège la société des multirécidivistes.","Partisans des peines planchers"],
 contre:["Selon le ministère en 2015, c'est la certitude d'être sanctionné qui dissuade, plus que la sévérité ; les prisons sont déjà surpeuplées.","Ministère de la Justice (2015), syndicats de magistrats"],
 ailleurs:[["États-Unis","Les peines minimales obligatoires ont fait exploser la population carcérale, sans baisse claire de la récidive."]],
 opts:{
  A:{t:"Peines planchers automatiques",fort:"Message de fermeté clair.",faible:"Prisons encore plus pleines, moins de liberté pour le juge.",rep:"« Les juges seront toujours libres de motiver une exception. »",b:-1,c:0},
  B:{t:"Plus de fermeté sur la récidive, mais le juge décide",fort:"Garde l'individualisation des peines.",faible:"Moins lisible pour l'opinion.",rep:"« Ferme, mais au cas par cas. »",b:0,c:0},
  C:{t:"Pas de peine automatique, plus de moyens pour la justice et la réinsertion",fort:"S'attaque aux causes de la récidive.",faible:"Peut sembler laxiste.",rep:"« La prison sans réinsertion fabrique des récidivistes. »",b:-1,c:0}},
 lecon:"La recherche distingue la sévérité d'une peine et la certitude d'être puni : c'est souvent la seconde qui compte le plus."},

// ───────── 2029
{id:"uniforme", an:2, theme:"École",
 titre:"Généraliser l'uniforme à l'école ?",
 hook:"La tenue unique est testée dans des établissements volontaires. Tu l'imposes partout ?",
 pourquoi:"Tu l'as peut-être vécu : marques, harcèlement, tenues. C'est une question de quotidien, et de coût pour les familles.",
 faits:[
  ["Une expérimentation de la tenue unique a été lancée en 2024 dans des établissements volontaires.","Ministère de l'Éducation nationale","https://www.education.gouv.fr/"],
  ["Gabriel Attal l'a annoncée comme Premier ministre en janvier 2024 ; Bruno Retailleau a déposé une proposition de loi au Sénat en 2022.","LCP, 30 janv. 2024","https://lcp.fr/actualites/desmicardiser-debureaucratiser-deverrouiller-les-principales-annonces-de-gabriel-attal-a"]],
 pour:["Moins de comparaison sociale, plus de sentiment d'appartenance.","Partisans de l'uniforme"],
 contre:["Aucune étude solide ne montre d'effet net sur les résultats ou le climat scolaire ; le coût est à la charge de quelqu'un.","Chercheurs en éducation, syndicats enseignants"],
 ailleurs:[["Royaume-Uni","L'uniforme est la norme dans la plupart des écoles ; une loi de 2021 vise à en limiter le coût."]],
 opts:{
  A:{t:"Uniforme obligatoire partout",fort:"Égalité visible entre élèves.",faible:"Coût, effet incertain.",rep:"« L'école doit être un lieu à part, protégé des marques. »",b:-1,c:0},
  B:{t:"Chaque établissement décide",fort:"Respecte les choix locaux.",faible:"Inégalité entre écoles.",rep:"« Laissons les équipes juger de ce qui marche chez elles. »",b:0,c:0},
  C:{t:"Pas d'uniforme, d'autres priorités",fort:"Évite une dépense jugée symbolique.",faible:"Ne répond pas au harcèlement lié aux tenues.",rep:"« Le problème de l'école, c'est le manque de profs, pas les vêtements. »",b:0,c:0}},
 lecon:"Sur l'uniforme, les preuves scientifiques sont minces : c'est surtout un choix de valeurs."},

{id:"college", an:2, theme:"École",
 titre:"En finir avec le collège unique ?",
 hook:"Depuis 1975, tous les élèves suivent le même collège. Tu orientes plus tôt vers le pro ?",
 pourquoi:"C'est l'âge auquel ton orientation se joue : à 14 ans, ou plus tard.",
 faits:[
  ["Le collège unique existe depuis la loi Haby de 1975.","vie-publique.fr","https://www.vie-publique.fr/"],
  ["Le RN propose l'apprentissage dès 14 ans ; Bruno Retailleau, un examen d'entrée en sixième et des groupes de niveau.","LCP, 4 nov. 2026","https://lcp.fr/actualites/presidentielle-bruno-retailleau-veut-un-examen-pour-entrer-en-sixieme-et-des-groupes-de"]],
 pour:["Des élèves en échec s'ennuient au collège et réussiraient mieux dans une voie concrète plus tôt.","Partisans d'une orientation précoce"],
 contre:["Les études internationales montrent que trier tôt renforce les inégalités sociales sans améliorer le niveau moyen.","OCDE (PISA), chercheurs en sociologie de l'éducation"],
 ailleurs:[["Allemagne","Orientation dès 10 ans entre plusieurs filières, critiquée pour son effet sur les inégalités."],["Finlande","Tronc commun jusqu'à 16 ans."]],
 opts:{
  A:{t:"Fin du collège unique, orientation professionnelle dès 14 ans",fort:"Voies concrètes pour les élèves en difficulté.",faible:"Risque d'orientation subie selon le milieu social.",rep:"« L'apprentissage n'est pas un échec, c'est une voie d'excellence. »",b:0,c:0},
  B:{t:"Garder le collège unique, avec des groupes de niveau",fort:"Aide ciblée sans trier définitivement.",faible:"Organisation lourde, effets débattus.",rep:"« Tous ensemble, mais pas tous au même rythme. »",b:-1,c:0},
  C:{t:"Collège unique renforcé : petits effectifs, mixité sociale",fort:"Réduit les inégalités selon les études.",faible:"Demande beaucoup plus de profs.",rep:"« Ce n'est pas le collège unique qui échoue, c'est le manque de moyens. »",b:-1,c:0}},
 lecon:"L'âge de l'orientation est l'un des choix éducatifs les plus étudiés : trier tôt favorise souvent les élèves déjà favorisés."},

{id:"prive", an:2, theme:"École",
 titre:"Moins financer l'école privée sous contrat ?",
 hook:"Le privé sous contrat est financé surtout par l'État, mais accueille des élèves plus favorisés. Tu changes les règles ?",
 pourquoi:"Environ un élève sur six va dans le privé. Le financement décide de la mixité sociale de ton école.",
 faits:[
  ["Environ 13,8 milliards d'euros de dépenses totales pour le privé sous contrat en 2022, dont 8,5 milliards pris en charge par l'État.","Mission d'information Vannier-Weissberg, Assemblée nationale (2024)","https://www.assemblee-nationale.fr/dyn/contenu/visualisation/824787/file/Dossier%20de%20presse%20-%20MI%20financement%20public%20enseignement%20priv%C3%A9.pdf"],
  ["Le même rapport (LFI et Renaissance) juge le financement peu transparent et les contrôles très rares.","LCP, 2 avr. 2024","https://lcp.fr/actualites/financement-de-l-enseignement-prive-sous-contrat-un-rapport-parlementaire-preconise-de"]],
 pour:["L'argent public devrait être conditionné à la mixité sociale : le privé contribue fortement à la ségrégation scolaire.","Paul Vannier (LFI), chercheurs sur la mixité"],
 contre:["Le privé coûte moins cher par élève à l'État et répond à une demande des familles : la liberté de choix doit être protégée.","Enseignement catholique, Fondation iFRAP"],
 ailleurs:[["Pays-Bas","Écoles publiques et privées financées à égalité, avec des règles d'admission communes."]],
 opts:{
  A:{t:"Moduler les financements selon la mixité sociale",fort:"Plus de mixité dans les écoles.",faible:"Conflit avec les familles et l'enseignement catholique.",rep:"« Argent public, obligations publiques. »",b:1,c:0},
  B:{t:"Plus de contrôles et de transparence, sans baisse du financement",fort:"Corrige l'opacité sans guerre scolaire.",faible:"Ne change pas vraiment la mixité.",rep:"« Contrôler, oui ; punir les familles, non. »",b:0,c:0},
  C:{t:"Maintenir ou étendre (chèque éducation, libre choix)",fort:"Liberté pour les familles.",faible:"Risque d'accentuer la séparation sociale.",rep:"« La concurrence pousse toutes les écoles à s'améliorer. »",b:-1,c:0}},
 lecon:"Ce débat oppose deux valeurs : la liberté de choix des familles et la mixité sociale."},

{id:"sol", an:2, theme:"Nationalité",
 titre:"Restreindre le droit du sol ?",
 hook:"Un enfant né en France de parents étrangers peut devenir français à sa majorité. Tu supprimes, tu restreins, tu gardes ?",
 pourquoi:"Ça touche à ce que veut dire « être français », et à la situation de milliers d'enfants nés et scolarisés ici.",
 faits:[
  ["Aujourd'hui, un enfant né en France de parents étrangers devient français à 18 ans s'il y a vécu au moins cinq ans depuis ses 11 ans.","Service-public.fr","https://www.service-public.fr/particuliers/vosdroits/F270"],
  ["À Mayotte, le droit du sol a déjà été restreint (2018, puis 2025).","vie-publique.fr","https://www.vie-publique.fr/"],
  ["Jean-Luc Mélenchon veut au contraire inscrire le droit du sol dans la Constitution.","BFMTV, 12 févr. 2025","https://www.bfmtv.com/politique/la-france-insoumise/il-faut-faciliter-l-acces-a-la-nationalite-francaise-melenchon-veut-inscrire-le-droit-du-sol-dans-la-constitution_AN-202502120629.html"]],
 pour:["La nationalité doit être demandée et méritée, pas automatique.","RN, LR, Reconquête"],
 contre:["Le droit du sol existe en France depuis des siècles et favorise l'intégration d'enfants qui n'ont connu que la France.","Historiens, juristes, gauche"],
 ailleurs:[["Royaume-Uni","Fin du droit du sol automatique en 1983."],["États-Unis","Droit du sol intégral inscrit dans la Constitution, contesté par l'administration Trump en 2025."]],
 opts:{
  A:{t:"Supprimer le droit du sol",fort:"Nationalité uniquement par filiation ou naturalisation.",faible:"Des enfants nés et élevés en France resteraient étrangers.",rep:"« Être français, ça s'hérite ou ça se demande. »",b:0,c:0},
  B:{t:"Le restreindre (conditions sur la situation des parents)",fort:"Compromis plus ciblé.",faible:"Mesure complexe, efficacité discutée.",rep:"« On garde le principe, on évite les abus. »",b:0,c:0},
  C:{t:"Le garder, voire l'inscrire dans la Constitution",fort:"Stabilité et intégration.",faible:"Ne répond pas à ceux qui veulent durcir.",rep:"« Un enfant qui a grandi ici est d'ici. »",b:0,c:0}},
 lecon:"Le droit du sol est surtout un symbole : il concerne un nombre limité de personnes, mais divise profondément."},

{id:"regul", an:2, theme:"Immigration",
 titre:"Régulariser les sans-papiers qui travaillent ?",
 hook:"Des milliers de sans-papiers travaillent dans le BTP, la restauration, l'aide à la personne. Tu les régularises ?",
 pourquoi:"Ces métiers manquent de bras, et des travailleurs sans droits tirent les conditions de travail vers le bas.",
 faits:[
  ["La loi immigration de 2024 a créé un titre de séjour pour les métiers en tension, à titre expérimental.","vie-publique.fr","https://www.vie-publique.fr/loi/287993-loi-immigration-integration-asile-du-26-janvier-2024"],
  ["Marine Le Pen y voyait « un appel d'air » ; Édouard Philippe s'était dit favorable à des quotas de régularisation.","franceinfo / Le Monde, 2023","https://www.lemonde.fr/politique/article/2023/12/10/projet-de-loi-immigration-edouard-philippe-se-dit-favorable-a-des-quotas-de-regularisation_6205015_823448.html"]],
 pour:["Régulariser ceux qui travaillent déjà fait rentrer des cotisations et protège contre l'exploitation.","Patronat de certains secteurs, syndicats, associations"],
 contre:["Régulariser encourage de nouvelles arrivées irrégulières.","Partisans d'une ligne ferme"],
 ailleurs:[["Espagne","Grande régularisation en 2005, puis réforme en 2024 pour régulariser des centaines de milliers de travailleurs."],["Italie","Régularisations ponctuelles malgré des gouvernements de droite."]],
 opts:{
  A:{t:"Régulariser largement les travailleurs sans papiers",fort:"Droits et cotisations pour des milliers de personnes.",faible:"Accusé de créer un appel d'air.",rep:"« Ils travaillent déjà ici : les laisser sans droits ne sert personne. »",b:1,c:0},
  B:{t:"Au cas par cas, pour les métiers en tension",fort:"Répond aux besoins des entreprises.",faible:"Arbitraire selon les préfectures.",rep:"« Ni régularisation massive, ni aveuglement. »",b:0,c:0},
  C:{t:"Aucune régularisation, plus d'expulsions",fort:"Message de fermeté.",faible:"Pénuries de main-d'œuvre, expulsions difficiles à exécuter.",rep:"« Entrer illégalement ne doit pas ouvrir de droits. »",b:0,c:0}},
 lecon:"Même des gouvernements très différents ont fini par régulariser : l'économie pèse autant que les principes."},

{id:"cannabis", an:2, theme:"Société",
 titre:"Légaliser le cannabis ?",
 hook:"La France est l'un des pays d'Europe où l'on en consomme le plus, malgré une loi parmi les plus dures. Tu changes ?",
 pourquoi:"Ça touche la santé des jeunes, le trafic dans les quartiers et le travail de la police.",
 faits:[
  ["Depuis 2020, l'usage peut être sanctionné par une amende forfaitaire de 200 €.","Service-public.fr","https://www.service-public.fr/particuliers/vosdroits/F34825"],
  ["LFI a déposé une proposition de loi pour une légalisation encadrée sous monopole public.","La France insoumise, 2022","https://lafranceinsoumise.fr/niche-parlementaire-2022-de-la-france-insoumise/ppl-legaliser-cannabis/"]],
 pour:["La répression n'a pas fait baisser la consommation ; légaliser permet de contrôler les produits et d'affaiblir les trafiquants.","Tribune de 70 personnalités (2019), économistes"],
 contre:["Banaliser une drogue nocive pour le cerveau des jeunes, sans garantie que le trafic disparaisse.","Médecins addictologues prudents, partisans de la fermeté"],
 ailleurs:[["Allemagne","Légalisation partielle (usage personnel et clubs) en avril 2024."],["Canada","Légalisation en 2018 ; marché légal majoritaire mais marché noir persistant."],["Portugal","Dépénalisation de l'usage de toutes les drogues en 2001, avec priorité aux soins."]],
 opts:{
  A:{t:"Légaliser avec un monopole public",fort:"Contrôle des produits, recettes fiscales.",faible:"Risque de banalisation.",rep:"« Mieux vaut un produit contrôlé qu'un trafic incontrôlé. »",b:1,c:0},
  B:{t:"Dépénaliser l'usage, développer le cannabis médical",fort:"Moins de répression pour les consommateurs.",faible:"Laisse la vente aux trafiquants.",rep:"« Soigner plutôt que punir. »",b:0,c:0},
  C:{t:"Tolérance zéro et guerre au trafic",fort:"Message clair contre la drogue.",faible:"Coûteux pour la police et la justice.",rep:"« On ne lutte pas contre les trafiquants en légalisant leur produit. »",b:-1,c:0}},
 lecon:"Les pays qui ont légalisé montrent des résultats mitigés : moins de répression, mais le marché noir ne disparaît pas tout seul."},

// ───────── 2030
{id:"climat", an:3, theme:"Climat",
 titre:"Le climat d'abord, même si ça contraint ?",
 hook:"Zones à faibles émissions, rénovation obligatoire, fin des voitures thermiques neuves en 2035… Tu tiens bon ou tu lèves le pied ?",
 pourquoi:"Ta génération vivra les effets du réchauffement, mais aussi le coût des mesures pour l'éviter.",
 faits:[
  ["L'État a été condamné en 2021 pour inaction climatique (« L'Affaire du siècle »).","Tribunal administratif de Paris, 2021","https://paris.tribunal-administratif.fr/"],
  ["Le Haut Conseil pour le climat suit chaque année le rythme de baisse des émissions de la France.","Haut Conseil pour le climat","https://www.hautconseilclimat.fr/"]],
 pour:["Plus on attend, plus l'adaptation coûtera cher et plus les efforts devront être brutaux.","GIEC, Haut Conseil pour le climat"],
 contre:["Des contraintes trop rapides frappent d'abord les ménages modestes et les ruraux (voir les Gilets jaunes).","Opposants à l'« écologie punitive »"],
 ailleurs:[["Royaume-Uni","Baisse des émissions parmi les plus fortes d'Europe, surtout grâce à la sortie du charbon."]],
 opts:{
  A:{t:"Règle verte : le climat prime, planification écologique",fort:"Respecte les engagements climatiques.",faible:"Contraintes fortes pour ménages et entreprises.",rep:"« L'État doit financer la transition pour qu'elle soit juste. »",b:-1,c:1},
  B:{t:"Transition avec accompagnement, pause sur certaines normes",fort:"Plus acceptable socialement.",faible:"Risque de manquer les objectifs.",rep:"« Une écologie qui n'est pas acceptée ne marche pas. »",b:0,c:0},
  C:{t:"Supprimer les contraintes (ZFE, interdictions), priorité au pouvoir d'achat",fort:"Soulagement immédiat pour les ménages.",faible:"Émissions qui repartent, sanctions possibles de l'UE.",rep:"« La France ne pèse que 1 % des émissions mondiales. »",b:0,c:-1}},
 lecon:"La France émet peu par rapport au monde, mais ses engagements européens et ses tribunaux l'obligent à agir."},

{id:"pesticides", an:3, theme:"Agriculture",
 titre:"Réduire fortement les pesticides ?",
 hook:"Agriculteurs en colère d'un côté, santé et biodiversité de l'autre. Tu tranches comment ?",
 pourquoi:"Ce que tu manges, l'eau que tu bois et le revenu des agriculteurs sont en jeu.",
 faits:[
  ["Les plans Écophyto visent depuis 2008 une baisse de 50 % des pesticides, objectif jamais atteint.","Ministère de l'Agriculture","https://agriculture.gouv.fr/le-plan-ecophyto-quest-ce-que-cest"],
  ["En 2025, la loi Duplomb a réintroduit un pesticide interdit ; le Conseil constitutionnel a censuré cette disposition, après une pétition de plus de 2 millions de signatures.","Conseil constitutionnel, août 2025","https://www.conseil-constitutionnel.fr/"]],
 pour:["Les pesticides de synthèse menacent la santé des agriculteurs eux-mêmes et la biodiversité.","Inserm (expertise collective), associations"],
 contre:["Sans alternative, interdire fait perdre des récoltes et favorise les importations produites avec ces mêmes produits.","Syndicats agricoles majoritaires"],
 ailleurs:[["Danemark","Taxe sur les pesticides selon leur toxicité depuis 2013."]],
 opts:{
  A:{t:"Réduction drastique et interdictions",fort:"Santé et biodiversité protégées.",faible:"Pertes pour certaines filières.",rep:"« On accompagne financièrement la sortie. »",b:-1,c:1},
  B:{t:"Réduire en finançant les alternatives, sans interdire sans solution",fort:"Plus acceptable par les agriculteurs.",faible:"Plus lent.",rep:"« Pas d'interdiction sans solution. »",b:-1,c:1},
  C:{t:"Pas de nouvelles contraintes, s'aligner sur les autres pays européens",fort:"Compétitivité des agriculteurs.",faible:"Impact sanitaire et environnemental.",rep:"« Nos agriculteurs ne doivent pas avoir plus de règles que leurs voisins. »",b:0,c:-1}},
 lecon:"La clé du débat est l'existence d'alternatives et de prix qui permettent aux agriculteurs d'en vivre."},

{id:"douane", an:3, theme:"Industrie",
 titre:"Protéger l'industrie par des droits de douane ?",
 hook:"Voitures chinoises, acier, panneaux solaires : tu taxes les importations et réserves les achats publics aux produits français ?",
 pourquoi:"Ça décide du prix de ce que tu achètes et des usines qui restent en France.",
 faits:[
  ["L'UE a imposé en 2024 des droits de douane supplémentaires sur les voitures électriques chinoises.","Commission européenne","https://policy.trade.ec.europa.eu/"],
  ["La politique commerciale est une compétence de l'Union européenne : la France ne peut pas fixer seule ses droits de douane.","Traité sur le fonctionnement de l'UE, art. 207","https://eur-lex.europa.eu/"]],
 pour:["Les autres puissances (Chine, États-Unis) protègent leur industrie : l'Europe est naïve.","RN, LFI, Reconquête"],
 contre:["Les droits de douane font payer les consommateurs et entraînent des représailles.","Économistes du commerce ; études sur les droits de douane américains de 2018"],
 ailleurs:[["États-Unis","Les droits de douane de 2018 ont été en grande partie payés par les consommateurs américains, selon plusieurs études."]],
 opts:{
  A:{t:"Droits de douane et préférence nationale dans les achats publics",fort:"Protège les emplois industriels.",faible:"Prix plus élevés, conflit avec les règles de l'UE.",rep:"« Acheter français avec l'argent des Français est du bon sens. »",b:0,c:0},
  B:{t:"Préférence européenne ciblée sur les secteurs stratégiques",fort:"Protection sans guerre commerciale.",faible:"Négociation longue à 27.",rep:"« C'est à l'échelle européenne qu'on a du poids. »",b:0,c:0},
  C:{t:"Ouverture commerciale, miser sur la compétitivité",fort:"Prix bas, exportations.",faible:"Industrie exposée à une concurrence subventionnée.",rep:"« Le protectionnisme appauvrit tout le monde. »",b:0,c:0}},
 lecon:"Sur le commerce, un président français dépend des 26 autres pays de l'UE."},

{id:"europe", an:3, theme:"Europe",
 titre:"Plus d'Europe, ou plus de France ?",
 hook:"Budget européen commun, fin du droit de veto, défense intégrée. Tu fais un saut fédéral ?",
 pourquoi:"Une grande partie des lois qui te concernent (numérique, climat, commerce) se décident à Bruxelles.",
 faits:[
  ["En 2020, l'UE a emprunté en commun pour la première fois, à grande échelle, pour le plan de relance.","Commission européenne, NextGenerationEU","https://next-generation-eu.europa.eu/"],
  ["Le rapport Draghi (2024) estime à 750-800 milliards d'euros par an les investissements supplémentaires nécessaires à l'Europe.","Commission européenne, rapport Draghi","https://commission.europa.eu/topics/eu-competitiveness/draghi-report_en"]],
 pour:["Face à la Chine et aux États-Unis, seuls des moyens communs donnent du poids à l'Europe.","Partisans de l'intégration"],
 contre:["Plus d'Europe, c'est moins de contrôle démocratique national.","Souverainistes de droite et de gauche"],
 ailleurs:[["Danemark","Membre de l'UE avec plusieurs dérogations négociées (euro notamment)."]],
 opts:{
  A:{t:"Saut fédéral : budget commun, vote à la majorité, défense intégrée",fort:"Europe capable d'agir vite.",faible:"Perte de souveraineté nationale.",rep:"« Ensemble, on pèse ; seuls, on subit. »",b:0,c:0},
  B:{t:"Coopérations renforcées secteur par secteur",fort:"Avancer avec ceux qui veulent.",faible:"Europe à plusieurs vitesses.",rep:"« Une Europe de projets plutôt que de traités. »",b:0,c:0},
  C:{t:"Europe des nations, primauté du droit national",fort:"Décisions gardées à Paris.",faible:"Conflits juridiques avec l'UE.",rep:"« Le peuple français doit avoir le dernier mot. »",b:0,c:0}},
 lecon:"Aucun des 8 candidats ne propose de sortir de l'UE : le clivage porte sur le degré d'intégration."},

{id:"otan", an:3, theme:"Défense",
 titre:"Quitter le commandement intégré de l'OTAN ?",
 hook:"La France a réintégré le commandement de l'OTAN en 2009. Tu en ressors ?",
 pourquoi:"Ça définit qui défendrait la France et l'Europe en cas d'attaque.",
 faits:[
  ["De Gaulle avait quitté le commandement intégré en 1966 ; Nicolas Sarkozy l'a réintégré en 2009.","vie-publique.fr","https://www.vie-publique.fr/"],
  ["En 2025, les alliés de l'OTAN se sont engagés à consacrer 5 % de leur PIB à la défense et à la sécurité d'ici 2035.","OTAN, sommet de La Haye 2025","https://www.nato.int/"]],
 pour:["L'OTAN arrime la France aux choix américains ; il faut une défense indépendante.","LFI, Reconquête, une partie du RN"],
 contre:["Quitter affaiblirait la solidarité entre alliés au pire moment.","Majorité des spécialistes de défense"],
 ailleurs:[["Suède et Finlande","Ont rejoint l'OTAN en 2023-2024 après l'invasion de l'Ukraine."]],
 opts:{
  A:{t:"Quitter le commandement intégré",fort:"Indépendance stratégique.",faible:"Isolement vis-à-vis des alliés.",rep:"« La France doit rester non alignée. »",b:0,c:0},
  B:{t:"Rester, mais construire une défense européenne autonome",fort:"Moins de dépendance aux États-Unis.",faible:"Long et coûteux.",rep:"« L'OTAN, oui, mais avec un pilier européen fort. »",b:0,c:0},
  C:{t:"Rester pleinement dans l'OTAN",fort:"Sécurité collective maximale.",faible:"Dépendance aux choix américains.",rep:"« L'alliance est notre assurance-vie. »",b:0,c:0}},
 lecon:"La question est plus symbolique que militaire : la France est dans l'OTAN quoi qu'il arrive, seul le commandement est en jeu."},

{id:"defense", an:3, theme:"Défense",
 titre:"Augmenter fortement le budget des armées ?",
 hook:"Guerre en Europe, engagements de l'OTAN. Tu réarmes, quitte à couper ailleurs ?",
 pourquoi:"Chaque milliard pour la défense est un milliard en moins pour autre chose, ou en dette.",
 faits:[
  ["La loi de programmation militaire 2024-2030 prévoit 413 milliards d'euros.","Ministère des Armées","https://www.defense.gouv.fr/"],
  ["L'objectif de l'OTAN fixé en 2025 : 3,5 % du PIB pour la défense, plus 1,5 % pour la sécurité, d'ici 2035.","OTAN, 2025","https://www.nato.int/"]],
 pour:["La menace russe et le retrait américain obligent l'Europe à se défendre elle-même.","Spécialistes de défense, état-major"],
 contre:["L'économie de guerre détourne l'argent des besoins sociaux et écologiques.","LFI, pacifistes"],
 ailleurs:[["Pologne","Plus de 4 % du PIB consacré à la défense."],["Allemagne","Fonds spécial de 100 milliards d'euros en 2022, puis assouplissement de sa règle de dette pour la défense."]],
 opts:{
  A:{t:"Forte hausse, quitte à réduire d'autres dépenses",fort:"Armée prête face aux menaces.",faible:"Moins d'argent pour le reste.",rep:"« Sans sécurité, il n'y a pas de modèle social. »",b:-1,c:0},
  B:{t:"Hausse progressive selon la programmation",fort:"Effort soutenable.",faible:"Peut-être trop lent.",rep:"« Réarmer, oui, mais sans casser le budget. »",b:-1,c:0},
  C:{t:"Pas de hausse, priorité au social",fort:"Préserve les autres dépenses.",faible:"Armée sous-équipée.",rep:"« La paix se construit par la diplomatie. »",b:0,c:0}},
 lecon:"Ici aussi, presque tous les candidats veulent augmenter : la différence est le rythme et ce qu'on coupe en échange."},

// ───────── 2031
{id:"h32", an:4, theme:"Travail",
 titre:"Passer à la semaine de 32 heures ?",
 hook:"Moins travailler pour le même salaire, ou travailler plus pour gagner plus ?",
 pourquoi:"C'est ton temps de vie : combien d'heures par semaine pendant 40 ans.",
 faits:[
  ["La durée légale est de 35 heures depuis 2000 ; Bruno Retailleau veut la supprimer, LFI veut passer à 32 heures.","Public Sénat, janv. 2026","https://www.publicsenat.fr/actualites/politique/la-fete-est-finie-bruno-retailleau-veut-supprimer-les-35-heures-inciter-a-la-reprise-dactivite-et-plafonner-les-aides-sociales-pour-relancer-lemploi"],
  ["Lors d'un test au Royaume-Uni en 2022, 92 % des 61 entreprises ont voulu garder la semaine de quatre jours.","Le Petit Journal, févr. 2023","https://lepetitjournal.com/londres/emploi/semaine-quatre-jours-tests-concluants-royaume-uni-356517"]],
 pour:["Moins d'épuisement, productivité maintenue dans les tests, partage du travail.","Chercheurs du test britannique (Nature Human Behaviour, 2025)"],
 contre:["Les tests portent sur des entreprises volontaires ; généraliser par la loi coûterait cher aux PME et aux services publics.","Organisations patronales, économistes libéraux"],
 ailleurs:[["Islande","Tests à grande échelle dans le secteur public (2015-2019), puis réduction négociée du temps de travail."],["Belgique","Semaine de quatre jours possible depuis 2022, mais sans baisse des heures."]],
 opts:{
  A:{t:"32 heures légales, sans baisse de salaire",fort:"Plus de temps libre pour tous.",faible:"Coût élevé pour les entreprises et l'État employeur.",rep:"« Les 35 heures ont créé des centaines de milliers d'emplois. »",b:-1,c:0},
  B:{t:"Semaine de 4 jours négociée par entreprise ou par branche",fort:"Souple, adaptée à chaque métier.",faible:"Inégale selon les secteurs.",rep:"« Laissons patrons et syndicats inventer. »",b:0,c:0},
  C:{t:"Assouplir, voire supprimer les 35 heures",fort:"Plus de production et de revenus possibles.",faible:"Risque de surmenage.",rep:"« La France travaille moins que ses voisins sur une vie. »",b:1,c:0}},
 lecon:"Les tests sont encourageants mais faits avec des volontaires : on ne sait pas tout de l'effet d'une loi générale."},

{id:"prionat", an:4, theme:"Social",
 titre:"Réserver certaines aides aux Français ?",
 hook:"La « priorité nationale » : réserver allocations familiales ou logement social aux Français. Tu l'inscris ?",
 pourquoi:"Ça touche à l'égalité devant la loi, un principe de la Constitution, et à la vie de millions d'étrangers en règle.",
 faits:[
  ["En avril 2024, le Conseil constitutionnel a rejeté un projet de référendum (LR) qui conditionnait certaines aides à 5 ans de résidence.","Conseil constitutionnel, décision 2024-6 RIP","https://www.conseil-constitutionnel.fr/decision/2024/20246RIP.htm"],
  ["Le RN prévoit une révision de la Constitution par référendum pour appliquer la priorité nationale.","Rassemblement national","https://rassemblementnational.fr/22-mesures"]],
 pour:["La solidarité nationale doit d'abord bénéficier aux nationaux ; cela réduirait l'attractivité des aides.","RN, Reconquête"],
 contre:["Discrimination contraire à la Constitution et au droit européen ; les étrangers en règle cotisent et paient des impôts.","Juristes, Défenseur des droits"],
 ailleurs:[["Danemark","Certaines prestations exigent plusieurs années de résidence, pour tous."]],
 opts:{
  A:{t:"Priorité nationale, par référendum constitutionnel",fort:"Réponse directe à la demande d'une partie des électeurs.",faible:"Rupture avec l'égalité, conflits avec l'UE.",rep:"« Le peuple souverain peut changer la Constitution. »",b:1,c:0},
  B:{t:"Durée de résidence minimale pour certaines aides, pour tous",fort:"Ne distingue pas selon la nationalité.",faible:"Déjà jugé disproportionné à 5 ans.",rep:"« Il faut avoir vécu ici avant de toucher certaines aides. »",b:1,c:0},
  C:{t:"Égalité d'accès pour tous les résidents en règle",fort:"Respecte la Constitution.",faible:"Ne répond pas à ceux qui veulent restreindre.",rep:"« Qui cotise a droit. »",b:0,c:0}},
 lecon:"Certaines promesses exigent de changer la Constitution : un président seul ne peut pas les appliquer."},

{id:"police", an:4, theme:"Sécurité",
 titre:"Contrôler la police par une autorité indépendante ?",
 hook:"Aujourd'hui, l'IGPN (la « police des polices ») dépend du ministère de l'Intérieur. Tu la rends indépendante ?",
 pourquoi:"La confiance entre jeunes et police est l'une des plus basses d'Europe ; elle conditionne aussi la sécurité de tous.",
 faits:[
  ["L'IGPN est rattachée à la Direction générale de la police nationale, sous l'autorité du ministre de l'Intérieur.","Ministère de l'Intérieur","https://www.police-nationale.interieur.gouv.fr/"],
  ["Le Défenseur des droits, autorité indépendante, peut déjà être saisi sur la déontologie des forces de l'ordre.","Défenseur des droits","https://www.defenseurdesdroits.fr/"]],
 pour:["Une autorité qui enquête sur ses propres collègues n'est pas perçue comme impartiale.","LFI, ONG de défense des droits"],
 contre:["Les policiers se sentiraient suspectés en permanence ; l'IGPN sanctionne déjà.","Syndicats de police, droite"],
 ailleurs:[["Royaume-Uni","L'IOPC, organisme indépendant, enquête sur les plaintes graves contre la police."],["Belgique","Le Comité P dépend du Parlement."]],
 opts:{
  A:{t:"Créer une autorité indépendante du ministère",fort:"Impartialité garantie.",faible:"Tensions avec les policiers.",rep:"« Une police contrôlée est une police respectée. »",b:0,c:0},
  B:{t:"Renforcer l'IGPN avec des membres extérieurs",fort:"Compromis.",faible:"Indépendance partielle.",rep:"« Améliorer l'existant plutôt que tout casser. »",b:0,c:0},
  C:{t:"Garder le système actuel, soutenir les forces de l'ordre",fort:"Confiance des policiers.",faible:"Défiance d'une partie de la population.",rep:"« La police a besoin de soutien, pas de soupçon. »",b:0,c:0}},
 lecon:"Plusieurs démocraties voisines ont choisi un contrôle externe ; le débat français reste très polarisé."},

{id:"finvie", an:4, theme:"Société",
 titre:"Légaliser l'aide à mourir ?",
 hook:"Le texte a été adopté deux fois à l'Assemblée mais bloqué par le Sénat. Tu le fais aboutir ?",
 pourquoi:"Ça touche à la fin de vie de tes proches, et un jour à la tienne.",
 faits:[
  ["L'Assemblée a adopté le droit à l'aide à mourir en deuxième lecture le 25 février 2026 (299 voix contre 226).","LCP, 25 févr. 2026","https://lcp.fr/actualites/aide-a-mourir-qui-a-vote-quoi-a-l-assemblee-nationale-431842"],
  ["Le Sénat a rejeté ou vidé le texte ; la commission mixte paritaire de juin 2026 n'a pas trouvé d'accord.","Assemblée nationale, rapport CMP","https://www.assemblee-nationale.fr/dyn/17/rapports/1100/l17b2861_rapport-fond.pdf"]],
 pour:["Liberté de choisir sa fin quand la souffrance est insupportable et la maladie incurable.","ADMD, Convention citoyenne sur la fin de vie (2023)"],
 contre:["Risque de pression sur les personnes vulnérables ; il faut d'abord rendre les soins palliatifs accessibles à tous.","Soignants en soins palliatifs, responsables religieux"],
 ailleurs:[["Belgique","Euthanasie légale depuis 2002."],["Suisse","Assistance au suicide tolérée depuis des décennies."],["Espagne","Loi votée en 2021."]],
 opts:{
  A:{t:"Légaliser une aide à mourir strictement encadrée",fort:"Liberté et dignité des malades.",faible:"Crainte de dérives pour les plus fragiles.",rep:"« Des garde-fous stricts existent dans le texte. »",b:0,c:0},
  B:{t:"D'abord les soins palliatifs partout, puis trancher (débat ou référendum)",fort:"Évite de choisir par défaut de soins.",faible:"Repousse encore la décision.",rep:"« On ne peut pas choisir librement sans accès aux soins. »",b:-1,c:0},
  C:{t:"Refuser, développer uniquement les soins palliatifs",fort:"Protège les plus vulnérables.",faible:"Des malades continueront d'aller à l'étranger.",rep:"« Soigner, ce n'est pas donner la mort. »",b:-1,c:0}},
 lecon:"Sur la fin de vie, les clivages traversent les partis : c'est souvent un vote de conscience."},

{id:"propor", an:4, theme:"Institutions",
 titre:"Élire les députés à la proportionnelle ?",
 hook:"Aujourd'hui, un député par circonscription, élu à deux tours. Tu passes au vote proportionnel ?",
 pourquoi:"Ça change le poids réel de ton vote : avec la proportionnelle, chaque voix compte pour le score national d'un parti.",
 faits:[
  ["Les législatives se font au scrutin majoritaire à deux tours, sauf en 1986 (proportionnelle).","franceinfo, mai 2025","https://www.franceinfo.fr/politique/proportionnelle-aux-elections-legislatives-qu-en-pensent-les-differents-partis-politiques_7271859.html"],
  ["Changer le mode de scrutin des députés ne demande qu'une loi, pas une révision de la Constitution.","Constitution, art. 34","https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur"]],
 pour:["L'Assemblée refléterait mieux les votes des Français ; les partis devraient négocier des coalitions.","RN, LFI, PS, Reconquête"],
 contre:["Risque d'Assemblée éclatée et de gouvernements instables ; le lien député-territoire disparaît.","LR, Horizons"],
 ailleurs:[["Allemagne","Système mixte : une partie des députés en circonscription, le total réparti à la proportionnelle."],["Pays-Bas","Proportionnelle intégrale, coalitions longues à former."]],
 opts:{
  A:{t:"Proportionnelle intégrale",fort:"Représentation fidèle des votes.",faible:"Coalitions nécessaires.",rep:"« Les coalitions sont la norme en Europe. »",b:0,c:0},
  B:{t:"Une dose de proportionnelle ou un système mixte",fort:"Garde des députés de terrain.",faible:"Représentation encore imparfaite.",rep:"« Le meilleur des deux systèmes. »",b:0,c:0},
  C:{t:"Garder le scrutin majoritaire",fort:"Majorités plus claires, élu local identifié.",faible:"Une partie des électeurs n'est pas représentée.",rep:"« Il faut une majorité pour gouverner. »",b:0,c:0}},
 lecon:"Depuis 2022, même le scrutin majoritaire n'a pas donné de majorité absolue : l'argument de la stabilité est discuté."},

{id:"vierep", an:4, theme:"Institutions",
 titre:"Passer à une VIe République ?",
 hook:"49.3, président très puissant, Assemblée sans majorité. Tu changes de Constitution ?",
 pourquoi:"Les règles du jeu politique décident de ce que ton vote peut réellement changer.",
 faits:[
  ["Le gouvernement d'Élisabeth Borne a utilisé le 49.3 vingt-trois fois entre 2022 et 2024.","vie-publique.fr","https://www.vie-publique.fr/"],
  ["En décembre 2024, le gouvernement Barnier a été renversé par une motion de censure, une première depuis 1962.","Assemblée nationale","https://www.assemblee-nationale.fr/"]],
 pour:["Le président concentre trop de pouvoirs ; une assemblée constituante redonnerait la parole au peuple.","LFI"],
 contre:["La Ve République a permis la stabilité ; une refonte complète ouvrirait des années d'incertitude.","Droite, centre"],
 ailleurs:[["Italie","Régime parlementaire, gouvernements souvent courts."],["Allemagne","Régime parlementaire avec un chancelier élu par les députés."]],
 opts:{
  A:{t:"Assemblée constituante et VIe République parlementaire",fort:"Rééquilibre les pouvoirs.",faible:"Processus long et incertain.",rep:"« C'est au peuple d'écrire ses règles. »",b:0,c:0},
  B:{t:"Moderniser la Ve (limiter le 49.3, plus de référendums)",fort:"Réformes ciblées.",faible:"Ne change pas l'équilibre général.",rep:"« Réparer plutôt que démolir. »",b:0,c:0},
  C:{t:"Garder la Ve République et un exécutif fort",fort:"Stabilité des institutions.",faible:"Frustration démocratique persistante.",rep:"« La Ve a survécu à toutes les crises. »",b:0,c:0}},
 lecon:"Changer de Constitution demande soit le Parlement réuni en Congrès, soit un référendum : jamais le président seul."}
];

// Faits institutionnels réels proposés en fin d'année, selon les choix.
const EVENTS = [
 {an:0, si:s=>s.b<0, titre:"Bruxelles surveille", txt:"La France est sous procédure européenne pour déficit excessif depuis juillet 2024. Tes choix creusent le budget : la Commission demandera des économies ailleurs.", src:["Conseil de l'UE, juillet 2024","https://www.consilium.europa.eu/"]},
 {an:0, si:s=>s.b>=0, titre:"Les marchés regardent", txt:"La France est sous procédure pour déficit excessif depuis juillet 2024. Tes choix ne creusent pas le budget cette année : bon point auprès de Bruxelles.", src:["Conseil de l'UE, juillet 2024","https://www.consilium.europa.eu/"]},
 {an:1, si:s=>s.soutien<0.45, titre:"Motion de censure !", txt:"Tes choix ont réuni peu de soutiens. En décembre 2024, le gouvernement Barnier a été renversé ainsi, une première depuis 1962. Sans majorité, chaque réforme se négocie.", src:["Assemblée nationale","https://www.assemblee-nationale.fr/"]},
 {an:1, si:s=>s.soutien>=0.45, titre:"Une majorité de circonstance", txt:"Tes choix rassemblent plusieurs camps. Depuis 2022, aucun parti n'a de majorité absolue : c'est la seule façon de faire passer des lois sans 49.3.", src:["Assemblée nationale","https://www.assemblee-nationale.fr/"]},
 {an:2, si:()=>true, titre:"Le Conseil constitutionnel veille", txt:"En janvier 2024, il a censuré tout ou partie de 35 articles de la loi immigration. Sur la nationalité et l'immigration, chaque loi passe par lui.", src:["Conseil constitutionnel, décision 2023-863 DC","https://www.conseil-constitutionnel.fr/decision/2024/2023863DC.htm"]},
 {an:3, si:s=>s.c<0, titre:"L'Affaire du siècle", txt:"En 2021, la justice a condamné l'État pour inaction climatique. Reculer sur le climat expose à de nouveaux recours et aux règles européennes.", src:["Tribunal administratif de Paris, 2021","https://paris.tribunal-administratif.fr/"]},
 {an:3, si:s=>s.c>=0, titre:"Cap sur 2030", txt:"L'UE s'est engagée à réduire ses émissions de 55 % d'ici 2030 par rapport à 1990. Tes choix vont dans ce sens, mais la facture doit être partagée.", src:["Commission européenne, Fit for 55","https://www.consilium.europa.eu/fr/policies/fit-for-55/"]},
 {an:4, si:()=>true, titre:"Et si on demandait au peuple ?", txt:"Le dernier référendum national date de 2005 (traité européen, rejeté à 54,7 %). Plusieurs de tes choix pourraient en exiger un.", src:["Conseil constitutionnel, résultats 2005","https://www.conseil-constitutionnel.fr/"]}
];
