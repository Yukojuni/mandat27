// Positions des 8 principaux candidats déclarés (sondages nov. 2026) sur 30 thèses.
// Base : lecture éditoriale de France-Vote (france-vote.fr, données au 23/11/2026),
// avec la source primaire citée par France-Vote quand elle existe.
// Niveaux : 2 soutien net, 1 plutôt favorable, 0 nuancée, -1 plutôt opposé, -2 opposition nette.
// Format : [niveau, "libellé source", "url"] ; url vide = France-Vote ne cite pas de source.
const CANDS = {
  lepen:      {nom:"Marine Le Pen",       parti:"Rassemblement national", fv:"marine-le-pen"},
  melenchon:  {nom:"Jean-Luc Mélenchon",  parti:"La France insoumise",    fv:"jean-luc-melenchon"},
  philippe:   {nom:"Édouard Philippe",    parti:"Horizons",               fv:"edouard-philippe"},
  glucksmann: {nom:"Raphaël Glucksmann",  parti:"Place publique (soutenu par le PS)", fv:"raphael-glucksmann"},
  lisnard:    {nom:"David Lisnard",       parti:"Nouvelle Énergie",       fv:"david-lisnard"},
  attal:      {nom:"Gabriel Attal",       parti:"Renaissance",            fv:"gabriel-attal"},
  retailleau: {nom:"Bruno Retailleau",    parti:"Les Républicains",       fv:"bruno-retailleau"},
  zemmour:    {nom:"Éric Zemmour",        parti:"Reconquête",             fv:"eric-zemmour"}
};
const AEC = "https://melenchon2027.fr/programme/livre/";
const EP = "https://www.edouardphilippe.fr/programme/";
const NE = "https://www.unenouvelleenergie.fr/questions/";
const AN = "https://www.assemblee-nationale.fr/dyn/";
const PSN = "https://www.publicsenat.fr/actualites/";
const RN22 = ["Rassemblement national, « 22 mesures »","https://rassemblementnational.fr/22-mesures"];
const EZ22 = ["Reconquête, programme 2022","https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf"];
const EZPS = ["Public Sénat, 23 mars 2022",PSN+"politique/presidentielle-2022-eric-zemmour-detaille-son-programme-et-assume-le-terme"];
const N = ["",""]; // pas de source citée

const POS = {
 isf:{
  lepen:[0,...N], melenchon:[2,"L'Avenir en commun, partie 2 ch. 2",AEC+"une-economie-au-service-des-besoins/chapitre2/"],
  philippe:[-2,"Site de campagne, comptes publics",EP+"comptes-publics"], glucksmann:[2,"Public Sénat, 15 mai 2024",PSN+"politique/europeennes-2024-raphael-glucksmann-prone-dans-son-programme-une-revolution-ecologique"],
  lisnard:[-2,...N], attal:[-2,...N], retailleau:[-2,"Public Sénat, 24 sept. 2025",PSN+"economie/50-nuances-de-taxe-zucman-quelles-autres-options-sont-sur-la-table-pour-taxer-les-ultra-riches"], zemmour:[-2,...N]},
 prod:{
  lepen:[2,"Assemblée nationale, scrutin n° 3154 (2025)",AN+"17/scrutins/3154"], melenchon:[-2,"Contre-budget LFI, 14 oct. 2026","https://melenchon2027.fr/wp-content/uploads/2026/10/Comment-nous-allons-remettre-de-l-ordre-dans-les-comptes-publics.pdf"],
  philippe:[2,"Public Sénat, 6 nov. 2025",PSN+"economie/entreprises-un-deal-a-250-milliards-deuros-sur-un-quinquennat-que-represente-la-proposition-dedouard-philippe"], glucksmann:[-1,...N],
  lisnard:[2,"Nouvelle Énergie, 16 oct. 2026",NE+"que-ferait-david-lisnard-des-200-milliards-d-economies/"], attal:[2,"Assemblée nationale, scrutin n° 199 (2024)",AN+"17/scrutins/199"],
  retailleau:[2,"Les Républicains, 16 sept. 2026","https://republicains.fr/actualites/2026/09/16/produire-en-france-la-meilleure-des-solutions-ecologiques/"], zemmour:[2,...EZPS]},
 douane:{
  lepen:[2,"Public Sénat, 13 avr. 2017",PSN+"politique/marine-le-pen-entend-pratiquer-un-protectionnisme-de-microchirurgie-58755"], melenchon:[2,"L'Avenir en commun, partie 1 ch. 2",AEC+"pour-une-bifurcation-ecologique-et-sociale/chapitre2/"],
  philippe:[-1,"Site de campagne, entreprises",EP+"entreprises"], glucksmann:[0,"Public Sénat, 15 mai 2024",PSN+"politique/europeennes-2024-raphael-glucksmann-prone-dans-son-programme-une-revolution-ecologique"],
  lisnard:[-1,"Nouvelle Énergie, 16 oct. 2026",NE+"quel-candidat-defend-la-liberte-economique/"], attal:[-1,"Europe 1, 17 sept. 2026","https://www.europe1.fr/politique/le-projet-dune-generation-gabriel-attal-appelle-a-creer-les-etats-unis-deurope-1085021"],
  retailleau:[1,"Les Républicains, 7 juil. 2026","https://republicains.fr/actualites/2026/07/07/sur-lia-nous-avons-une-fenetre-de-tir-de-deux-ans/"], zemmour:[2,...N]},
 retraite:{
  lepen:[2,"Assemblée nationale, scrutin n° 2257 (2025)",AN+"17/scrutins/2257"], melenchon:[2,"L'Avenir en commun, partie 3 ch. 1",AEC+"mettre-en-securite-sociale/chapitre1/"],
  philippe:[-2,"Site de campagne, retraites",EP+"retraites"], glucksmann:[1,"Brut, 17 nov. 2025","https://www.brut.media/fr/articles/la-suspension-de-la-reforme-des-retraites-devient-possible-dit-glucksmann-apres-avoir-rencontre-sebastien-lecornu"],
  lisnard:[-2,...N], attal:[-2,...N], retailleau:[-2,"Public Sénat, 14 déc. 2022",PSN+"politique/reforme-des-retraites-a-matignon-retailleau-defend-la-ligne-des-senateurs"], zemmour:[-2,...N]},
 smic:{
  lepen:[-1,"Assemblée nationale, scrutin n° 43 (2022)",AN+"16/scrutins/43"], melenchon:[2,"L'Avenir en commun, partie 2 ch. 2",AEC+"une-economie-au-service-des-besoins/chapitre2/"],
  philippe:[-2,"Public Sénat, 28 nov. 2018",PSN+"politique/smic-revalorisation-legale-au-1er-janvier-mais-pas-de-coup-de-pouce-135932"], glucksmann:[1,"Public Sénat, 23 juin 2025",PSN+"politique/presidentielle-pas-candidat-pour-le-moment-raphael-glucksmann-trace-son-chemin-et-defend-sa-vision-pour-le-pays"],
  lisnard:[-2,"Nouvelle Énergie, 16 oct. 2026",NE+"comment-david-lisnard-veut-il-augmenter-les-salaires-sans-augmenter-le-cout-du-travail/"], attal:[-2,...N],
  retailleau:[-2,"Public Sénat, 21 juin 2018",PSN+"politique/pecresse-lr-en-faveur-d-une-augmentation-du-smic-net-de-20-87354"], zemmour:[-1,...EZPS]},
 rsa:{
  lepen:[-1,"Assemblée nationale, scrutin n° 2717 (2023)",AN+"16/scrutins/2717"], melenchon:[-2,"L'Avenir en commun, partie 3 ch. 1",AEC+"mettre-en-securite-sociale/chapitre1/"],
  philippe:[2,"Public Sénat, 19 févr. 2019",PSN+"politique/philippe-defend-sa-proposition-controversee-de-contreparties-aux-aides-sociales"], glucksmann:[-2,...N],
  lisnard:[2,...N], attal:[2,"LCP, 30 janv. 2024","https://lcp.fr/actualites/desmicardiser-debureaucratiser-deverrouiller-les-principales-annonces-de-gabriel-attal-a"],
  retailleau:[2,"Sénat, scrutin du 9 nov. 2023","https://www.senat.fr/scrutin-public/2023/scr2023-29.html"], zemmour:[2,...N]},
 h32:{
  lepen:[-1,"Public Sénat, 24 août 2017",PSN+"politique/35-heures-retraite-a-60-ans-menard-compare-le-pen-a-un-leader-de-la-cgt-76707"], melenchon:[2,"L'Avenir en commun, partie 3 ch. 1",AEC+"mettre-en-securite-sociale/chapitre1/"],
  philippe:[-2,"Site de campagne, 8 oct. 2026","https://www.edouardphilippe.fr/actualites/trois-principales-annonces-dedouard-philippe-a-lheure-de-verite"], glucksmann:[0,...N],
  lisnard:[-2,"Nouvelle Énergie, 16 oct. 2026",NE+"quel-candidat-veut-assouplir-les-35-heures/"], attal:[-2,"CNews, 30 avr. 2026","https://www.cnews.fr/france/2026-04-30/quotas-dimmigration-13e-mois-pour-tous-nouveau-code-du-travail-cooperation-avec"],
  retailleau:[-2,"Public Sénat, 7 janv. 2026",PSN+"politique/la-fete-est-finie-bruno-retailleau-veut-supprimer-les-35-heures-inciter-a-la-reprise-dactivite-et-plafonner-les-aides-sociales-pour-relancer-lemploi"], zemmour:[-2,...EZPS]},
 quotas:{
  lepen:[2,...RN22], melenchon:[-2,"L'Avenir en commun, partie 6 ch. 3",AEC+"un-monde-ordonne/chapitre3/"],
  philippe:[2,"Site de campagne, immigration",EP+"immigration"], glucksmann:[-1,"Le Figaro, 29 mars 2024","https://www.lefigaro.fr/elections/europeennes/raphael-glucksmann-veut-developper-des-voies-d-immigration-legales-en-europe-20240329"],
  lisnard:[2,...N], attal:[1,"Europe 1, 27 avr. 2026","https://www.europe1.fr/societe/aujourdhui-on-ne-choisit-pas-notre-immigration-estime-gabriel-attal-928691"],
  retailleau:[2,"Sénat, séance du 6 nov. 2023","https://www.senat.fr/seances/s202311/s20231106/s20231106_mono.html"], zemmour:[2,...N]},
 sol:{
  lepen:[2,...RN22], melenchon:[-2,"BFMTV, 12 févr. 2025","https://www.bfmtv.com/politique/la-france-insoumise/il-faut-faciliter-l-acces-a-la-nationalite-francaise-melenchon-veut-inscrire-le-droit-du-sol-dans-la-constitution_AN-202502120629.html"],
  philippe:[1,...N], glucksmann:[-2,...N], lisnard:[1,...N], attal:[0,...N],
  retailleau:[2,"Sénat, proposition de loi, 1er juin 2023","https://www.senat.fr/leg/exposes-des-motifs/ppl22-677-expose.html"], zemmour:[2,...N]},
 regul:{
  lepen:[-2,"franceinfo, 1er févr. 2023","https://www.franceinfo.fr/societe/immigration/video-projet-de-loi-immigration-creer-un-titre-de-sejour-metiers-en-tension-revient-a-creer-un-appel-d-air-selon-marine-le-pen_5634023.html"], melenchon:[2,"L'Avenir en commun, partie 6 ch. 3",AEC+"un-monde-ordonne/chapitre3/"],
  philippe:[1,"Le Monde, 10 déc. 2023","https://www.lemonde.fr/politique/article/2023/12/10/projet-de-loi-immigration-edouard-philippe-se-dit-favorable-a-des-quotas-de-regularisation_6205015_823448.html"], glucksmann:[2,"LCP, 5 oct. 2026","https://lcp.fr/actualites/glucksmann-face-a-royal-divisions-sur-lfi-lycees-ce-qu-il-faut-retenir-du-dernier-debat"],
  lisnard:[-2,"Nouvelle Énergie, programme","https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/"], attal:[1,"CNews, 1er févr. 2023","https://www.cnews.fr/france/2023-02-01/immigration-quels-sont-les-metiers-en-tension-qui-pourront-valoir-un-titre-de"],
  retailleau:[-2,...N], zemmour:[-2,"Reconquête, L'hebdo n° 36 (2023)","https://assets.ericzemmour.fr/ressources/hebdo/Hebdo%20n%C2%B036.pdf"]},
 prionat:{
  lepen:[2,...RN22], melenchon:[-2,"L'Avenir en commun, partie 4 ch. 2",AEC+"le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2/"],
  philippe:[-1,"Site de campagne, immigration",EP+"immigration"], glucksmann:[-2,...N], lisnard:[0,...N], attal:[-1,...N],
  retailleau:[1,"Sénat, proposition de loi, 1er juin 2023","https://www.senat.fr/leg/ppl22-677.html"], zemmour:[2,...EZ22]},
 planchers:{
  lepen:[2,"Assemblée nationale, PPL n° 262 (2024)",AN+"17/textes/l17b0262_proposition-loi.pdf"], melenchon:[-2,"Blog de J.-L. Mélenchon, 16 nov. 2024","https://melenchon.fr/2024/11/16/est-ce-que-ca-va-mieux-en-lexpliquant/"],
  philippe:[1,"Site de campagne, sécurité",EP+"securite"], glucksmann:[-1,...N], lisnard:[2,...N], attal:[0,...N],
  retailleau:[2,"Les Républicains (entretien JDD), 31 mai 2026","https://republicains.fr/actualites/2026/05/31/ma-candidature-ira-jusquau-bout/"], zemmour:[2,"Europe 1, 19 mai 2026","https://www.europe1.fr/politique/en-direct-immigration-pouvoir-dachat-narcotrafic-ce-quil-faut-retenir-de-linterview-deric-zemmour-dans-la-france-en-face-936419"]},
 cannabis:{
  lepen:[-2,...N], melenchon:[2,"Proposition de loi LFI (2022)","https://lafranceinsoumise.fr/niche-parlementaire-2022-de-la-france-insoumise/ppl-legaliser-cannabis/"],
  philippe:[0,...N], glucksmann:[1,"Public Sénat, 19 juin 2019",PSN+"non-classe/cannabis-70-personnalites-appellent-a-legaliser-au-nom-du-pragmatisme-142235"],
  lisnard:[-2,...N], attal:[1,...N], retailleau:[-2,"Ouest-France, 18 févr. 2025","https://www.ouest-france.fr/societe/drogue/legalisation-du-cannabis-proposee-par-deux-deputes-bruno-retailleau-se-dit-totalement-contre-3f784e08-edc2-11ef-ab5f-86b228b95af6"], zemmour:[-2,...N]},
 police:{
  lepen:[-2,...N], melenchon:[2,"L'Avenir en commun, partie 5 ch. 2",AEC+"fonder-la-6e-republique/chapitre2/"],
  philippe:[-1,...N], glucksmann:[1,...N], lisnard:[-1,...N], attal:[-2,...N], retailleau:[-2,...N], zemmour:[-2,...N]},
 nucleaire:{
  lepen:[2,...RN22], melenchon:[-2,"L'Avenir en commun, partie 1 ch. 3",AEC+"pour-une-bifurcation-ecologique-et-sociale/chapitre3/"],
  philippe:[2,"Site de campagne, énergie",EP+"energie"], glucksmann:[1,...N], lisnard:[2,...N], attal:[2,...N],
  retailleau:[2,"Les Républicains, propositions","https://republicains.fr/nos-propositions/"], zemmour:[2,...N]},
 enr:{
  lepen:[-2,...RN22], melenchon:[2,"L'Avenir en commun, partie 1 ch. 3",AEC+"pour-une-bifurcation-ecologique-et-sociale/chapitre3/"],
  philippe:[1,...N], glucksmann:[1,...N], lisnard:[-1,...N], attal:[1,"L'Info Durable (AFP), 2 juil. 2025","https://www.linfodurable.fr/passe-darmes-retailleau-attal-sur-les-energies-renouvelables-51902"],
  retailleau:[-2,...N], zemmour:[-2,...EZ22]},
 climat:{
  lepen:[-2,"L'Info Durable (AFP), 26 sept. 2023","https://www.linfodurable.fr/ecologie-pour-le-pen-le-plan-de-macron-nest-pas-une-transition-mais-une-destruction-41246"], melenchon:[2,"L'Avenir en commun, partie 1 ch. 1",AEC+"pour-une-bifurcation-ecologique-et-sociale/chapitre1/"],
  philippe:[0,"L'Info Durable (AFP), 17 sept. 2026","https://www.linfodurable.fr/entre-le-deni-du-rn-et-le-dogme-de-lfi-le-plan-dedouard-philippe-pour-une-politique-de-securite"], glucksmann:[1,"LCP, 25 août 2026","https://lcp.fr/actualites/presidentielle-2027-s-il-gagne-raphael-glucksmann-engagera-les-100-jours-de-la"],
  lisnard:[-1,...N], attal:[0,"Public Sénat, 21 juil. 2025",PSN+"politique/gabriel-attal-denonce-la-grande-regression-climatique-y-compris-au-sein-meme-du-gouvernement-tout-en-assumant-son-vote-sur-la-loi-duplomb"],
  retailleau:[-1,"L'Info Durable (AFP), 17 sept. 2026","https://www.linfodurable.fr/agriculture-retailleau-denonce-lecologie-dogmatique-59011"], zemmour:[-2,"L'Info Durable, 29 mars 2022","https://www.linfodurable.fr/politique/le-programme-ecolo-deric-zemmour-31380"]},
 pesticides:{
  lepen:[-2,"Assemblée nationale, amendement n° 5 (PPL 2117)",AN+"17/amendements/2117/AN/5.pdf"], melenchon:[2,"L'Avenir en commun, partie 4 ch. 1",AEC+"le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre1/"],
  philippe:[-1,"Site de campagne, adaptation climatique",EP+"adaptation-climatique"], glucksmann:[1,...N],
  lisnard:[-1,"Nouvelle Énergie, 16 oct. 2026",NE+"quel-candidat-defend-les-agriculteurs/"], attal:[-1,"Assemblée nationale, scrutin n° 2957 (loi Duplomb)",AN+"17/scrutins/2957"],
  retailleau:[-2,"Terre-net (AFP), 17 sept. 2026","https://www.terre-net.fr/election-presidentielle/article/903597/retailleau-denonce-l-ecologie-dogmatique"], zemmour:[-2,...N]},
 europe:{
  lepen:[-2,...N], melenchon:[-2,"L'Avenir en commun, partie 6 ch. 1",AEC+"un-monde-ordonne/chapitre1/"],
  philippe:[2,...N], glucksmann:[2,"Public Sénat, 15 mai 2024",PSN+"politique/europeennes-2024-raphael-glucksmann-prone-dans-son-programme-une-revolution-ecologique"],
  lisnard:[-1,...N], attal:[2,...N], retailleau:[-1,"Public Sénat, 13 févr. 2026",PSN+"politique/referendum-sur-limmigration-primaute-du-droit-national-le-projet-de-bruno-retailleau-est-il-faisable"], zemmour:[-2,...N]},
 otan:{
  lepen:[1,"Assemblée nationale, amendement n° 1731 (2023)",AN+"16/amendements/1234/AN/1731.pdf"], melenchon:[2,"L'Avenir en commun, partie 6 ch. 2",AEC+"un-monde-ordonne/chapitre2/"],
  philippe:[-2,...N], glucksmann:[-2,...N], lisnard:[0,...N], attal:[-2,...N], retailleau:[-1,...N], zemmour:[2,...EZ22]},
 ukraine:{
  lepen:[0,"Assemblée nationale, scrutin n° 3461 (2024)",AN+"16/scrutins/3461"], melenchon:[-1,"France 24, 1er mars 2022","https://www.france24.com/fr/europe/20220301-jean-luc-m%C3%A9lenchon-regrette-la-fourniture-d-armes-%C3%A0-l-ukraine-par-l-ue"],
  philippe:[2,...N], glucksmann:[2,"Public Sénat, 15 mai 2024",PSN+"politique/europeennes-2024-raphael-glucksmann-prone-dans-son-programme-une-revolution-ecologique"],
  lisnard:[1,...N], attal:[2,...N], retailleau:[1,"Public Sénat, 13 mars 2024",PSN+"international/direct-guerre-en-ukraine-suivez-le-debat-et-le-vote-au-senat-sur-laccord-de-securite"],
  zemmour:[-1,"franceinfo, 17 nov. 2025","https://www.franceinfo.fr/politique/eric-zemmour/cela-fait-a-30-ans-que-je-dis-qu-il-faut-un-grand-rassemblement-des-droites-assure-eric-zemmour-president-du-parti-reconquete_7621697.html"]},
 defense:{
  lepen:[1,"Assemblée nationale, scrutin n° 7905 (2026)",AN+"17/scrutins/7905"], melenchon:[-1,"L'Avenir en commun, partie 6 ch. 2",AEC+"un-monde-ordonne/chapitre2/"],
  philippe:[2,"Site de campagne, défense",EP+"defense"], glucksmann:[2,...N],
  lisnard:[1,"Nouvelle Énergie, 16 oct. 2026",NE+"quel-candidat-veut-renforcer-l-armee/"], attal:[2,...N], retailleau:[2,...N], zemmour:[2,...EZPS]},
 propor:{
  lepen:[2,"Public Sénat, 30 avr. 2025",PSN+"politique/legislatives-marine-le-pen-prete-a-defendre-le-retour-la-proportionnelle-integrale-de-1986-0"], melenchon:[2,"L'Avenir en commun, partie 5 ch. 1",AEC+"fonder-la-6e-republique/chapitre1/"],
  philippe:[-1,"franceinfo, 26 mai 2025","https://www.franceinfo.fr/politique/proportionnelle-aux-elections-legislatives-qu-en-pensent-les-differents-partis-politiques_7271859.html"], glucksmann:[2,"franceinfo, 26 mai 2025","https://www.franceinfo.fr/politique/proportionnelle-aux-elections-legislatives-qu-en-pensent-les-differents-partis-politiques_7271859.html"],
  lisnard:[-1,...N], attal:[0,...N], retailleau:[-2,"Public Sénat, 2 juin 2025",PSN+"politique/hostile-a-la-proportionnelle-bruno-retailleau-necarte-pas-une-demission-du-gouvernement"], zemmour:[2,...N]},
 vierep:{
  lepen:[-1,"Public Sénat, 12 avr. 2022",PSN+"politique/marine-le-pen-detaille-sa-revolution-referendaire-202358"], melenchon:[2,"L'Avenir en commun, partie 5 ch. 1",AEC+"fonder-la-6e-republique/chapitre1/"],
  philippe:[-2,"Public Sénat, 4 avr. 2018",PSN+"politique/reforme-constitutionnelle-les-annonces-d-edouard-philippe-84367"], glucksmann:[0,...N],
  lisnard:[-1,"Discours de Bayeux, 17 juin 2026","https://nouvelle-energie-media-prod.s3.fr-par.scw.cloud/media/legacy/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf"], attal:[-1,"CNews, 2 août 2026","https://www.cnews.fr/france/2026-08-02/decentralisation-justice-immigration-gabriel-attal-promet-la-plus-grande-reforme"],
  retailleau:[-2,"Public Sénat, 3 sept. 2026",PSN+"politique/presidentielle-2027-bruno-retailleau-propose-une-revolution-copernicienne-dans-laquelle-la-constitution-ne-serait-plus-le-bouclier-qui-prote"], zemmour:[-2,...N]},
 hopital:{
  lepen:[2,"Public Sénat, 13 avr. 2022",PSN+"politique/duel-macron-le-pen-quelles-sont-les-propositions-des-candidats-en-matiere-de-sante"], melenchon:[2,"L'Avenir en commun, partie 4 ch. 4",AEC+"le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4/"],
  philippe:[-1,...N], glucksmann:[2,...N], lisnard:[-1,"Nouvelle Énergie, programme santé","https://www.unenouvelleenergie.fr/notre-programme/sante/"], attal:[0,...N],
  retailleau:[-1,"Public Sénat, 12 oct. 2026",PSN+"economie/presidentielle-2027-bruno-retailleau-sengage-sur-un-plan-deconomies-de-pres-de-200-milliards-deuros-sil-est-elu"], zemmour:[2,...EZ22]},
 deserts:{
  lepen:[0,"LCP, 25 mars 2022","https://lcp.fr/actualites/presidentielle-quelle-reforme-de-la-sante-pour-les-candidats-107247"], melenchon:[2,"L'Avenir en commun, partie 4 ch. 4",AEC+"le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre4/"],
  philippe:[-1,"Egora, 16 févr. 2024","https://www.egora.fr/actus-pro/acces-aux-soins/regulation-linstallation-edouard-philippe-lance-un-ultimatum-aux-medecins"], glucksmann:[1,...N],
  lisnard:[-1,"Nouvelle Énergie, 16 oct. 2026",NE+"comment-david-lisnard-compte-t-il-lutter-contre-les-deserts-medicaux/"], attal:[-1,"Assemblée nationale, QAG n° 1791 (2024)",AN+"16/questions/QANR5L16QG1791"],
  retailleau:[-2,"Sénat, séance du 18 oct. 2022","https://www.senat.fr/cra/s20221018/s20221018_2.html"], zemmour:[-1,...N]},
 finvie:{
  lepen:[-2,"Assemblée nationale, scrutin n° 2107 (2025)",AN+"17/scrutins/2107"], melenchon:[2,"L'Avenir en commun, partie 3 ch. 2",AEC+"mettre-en-securite-sociale/chapitre2/"],
  philippe:[0,...N], glucksmann:[2,...N], lisnard:[0,...N], attal:[2,"Assemblée nationale, scrutin n° 2107 (2025)",AN+"17/scrutins/2107"],
  retailleau:[-2,"Public Sénat, 12 mai 2026",PSN+"parlementaire/le-senat-supprime-laide-a-mourir-cle-de-voute-de-la-proposition-de-loi-sur-la-fin-de-vie"], zemmour:[-2,...N]},
 uniforme:{
  lepen:[2,"Assemblée nationale, scrutin n° 830 (2023)",AN+"16/scrutins/830"], melenchon:[-2,"Blog de J.-L. Mélenchon, 29 août 2023","https://melenchon.fr/2023/08/29/abaya-la-prise-de-tete-de-trop/"],
  philippe:[1,"Site de campagne, école",EP+"ecole"], glucksmann:[-1,...N],
  lisnard:[1,"Nouvelle Énergie, 16 oct. 2026",NE+"quel-candidat-veut-donner-leur-autonomie-aux-etablissements-scolaires/"], attal:[2,"LCP, 30 janv. 2024","https://lcp.fr/actualites/desmicardiser-debureaucratiser-deverrouiller-les-principales-annonces-de-gabriel-attal-a"],
  retailleau:[2,"Sénat, proposition de loi, 13 déc. 2022","https://www.senat.fr/leg/ppl22-202.html"], zemmour:[2,"Public Sénat, 10 janv. 2022",PSN+"politique/presidentielle-eric-zemmour-egratigne-les-journalistes-et-promet-une-revolution"]},
 college:{
  lepen:[2,"L'Étudiant, 16 mars 2022","https://www.letudiant.fr/lifestyle/presidentielle-2022-marine-le-pen-j-abrogerais-la-reforme-du-bac-qui-serait-remplacee-par-un-examen-terminal-national.html"], melenchon:[-2,"L'Avenir en commun, partie 4 ch. 2",AEC+"le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2/"],
  philippe:[1,...N], glucksmann:[-1,...N], lisnard:[2,...N], attal:[1,"LCP, 25 août 2026","https://lcp.fr/actualites/presidentielle-retour-du-certificat-d-etudes-revalorisation-des-salaires-ce-que-propose"],
  retailleau:[2,"LCP, 4 nov. 2026","https://lcp.fr/actualites/presidentielle-bruno-retailleau-veut-un-examen-pour-entrer-en-sixieme-et-des-groupes-de"], zemmour:[2,...EZ22]},
 prive:{
  lepen:[-1,...N], melenchon:[2,"L'Avenir en commun, partie 4 ch. 2",AEC+"le-gout-du-futur-aux-nouvelles-frontieres-de-l-humanite/chapitre2/"],
  philippe:[-1,...N], glucksmann:[0,"LCP, 26 mai 2026","https://lcp.fr/actualites/presidentielle-raphael-glucksmann-devoile-les-premieres-lignes-de-son-possible-programme"],
  lisnard:[-2,"Nouvelle Énergie, 16 oct. 2026",NE+"quel-candidat-propose-le-cheque-education/"], attal:[-1,"Sénat, audition du 11 oct. 2023","https://www.senat.fr/compte-rendu-commissions/20231009/cult.html"],
  retailleau:[-2,...N], zemmour:[-2,...N]}
};
