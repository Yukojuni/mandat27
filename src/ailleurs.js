// « Et ailleurs ? » : pour chaque exemple étranger de questions.js (même ordre),
// ce que ça a donné. Verdict mesuré par rapport à l'objectif de la mesure :
// ok = a plutôt marché · mixte = bilan mitigé · ko = effets décevants · tot = trop tôt pour juger · constat = ce qu'on observe
// Format : [bilan, verdict, "source", "url"] (url vide = pas de lien direct vérifié)
const VERDICTS = { ok:["A plutôt marché","#138A4C","#EAFBF2"], mixte:["Bilan mitigé","#9A6B00","#FFF6D6"], ko:["Effets décevants","#C0222C","#FFF0F1"],
  tot:["Trop tôt pour juger","#4B5675","#EEF2FF"], constat:["Ce qu'on observe","#2A5BFF","#EEF2FF"] };
const AILLEURS = {
 retraite:[
  ["Le taux d'emploi des 55-64 ans a fortement progressé depuis les années 2000. Mais le niveau des pensions reste bas et la pauvreté des retraités a augmenté.","mixte","OCDE, Panorama des pensions",""],
  ["Le système reste équilibré grâce à un mécanisme qui baisse automatiquement les pensions en cas de déficit (activé après 2008). Revers : les pensions ont baissé par rapport aux salaires.","mixte","Agence suédoise des pensions, OCDE",""]],
 smic:[
  ["Depuis sa création en 2015, les études allemandes n'ont pas observé de destruction d'emplois massive. Les bas salaires ont augmenté ; une partie des « mini-jobs » a disparu.","ok","Commission allemande du salaire minimum, rapports",""],
  ["La part des salariés très mal payés a nettement baissé, sans effet négatif marqué sur l'emploi selon l'organisme chargé du suivi.","ok","Low Pay Commission","https://www.gov.uk/government/organisations/low-pay-commission"]],
 isf:[
  ["Recettes modestes, et plusieurs régions comme Madrid exonèrent presque totalement les contribuables. C'est ce qui a poussé le gouvernement à créer un impôt national en plus.","mixte","Ministère espagnol des Finances",""],
  ["Au moins 30 grandes fortunes sont parties pour la Suisse en 2022. Mais les recettes ont nettement augmenté : les départs ont coûté de l'argent sans annuler le gain. Le bilan reste très débattu.","mixte","Swissinfo ; Bloomberg/Reuters, nov. 2025","https://www.bnnbloomberg.ca/business/2025/11/24/norways-lesson-for-europe-on-wealth-taxes-let-some-millionaires-go/"]],
 prod:[
  ["L'industrie pèse environ deux fois plus qu'en France dans l'économie. Mais depuis 2023 elle traverse une crise (énergie chère, concurrence chinoise) : des impôts bas ne suffisent pas à eux seuls.","constat","Eurostat",""]],
 quotas:[
  ["Le système marche tant que les objectifs suivent la capacité d'accueil. Après une forte hausse, la crise du logement a obligé le gouvernement à réduire ses objectifs pour 2025-2027.","mixte","Immigration, Réfugiés et Citoyenneté Canada",""],
  ["Une grande partie des autorisations n'aboutit pas à un vrai contrat de travail. En 2024, le gouvernement Meloni a lui-même dénoncé des fraudes massives dans ce système.","ko","Gouvernement italien, juin 2024",""]],
 ukraine:[
  ["Depuis le retrait américain, ce sont les Européens qui portent l'essentiel de l'aide, y compris en achetant des armes américaines pour l'Ukraine.","constat","Kiel Institute, Ukraine Support Tracker","https://www.ifw-kiel.de/topics/war-against-ukraine/ukraine-support-tracker/"]],
 rsa:[
  ["Une étude du ministère britannique a montré que les sanctions font sortir plus vite des aides, mais vers des emplois moins bien payés, avec des revenus plus faibles ensuite.","mixte","Ministère britannique du Travail (DWP), 2023",""]],
 hopital:[
  ["Malgré des hausses de budget, plus de 7 millions d'actes restent en attente. Les experts pointent le manque de personnel et de lits, après des années de sous-investissement.","ko","NHS England, statistiques des listes d'attente",""]],
 deserts:[
  ["La planification a freiné les installations dans les zones déjà bien dotées, mais n'a pas suffi à attirer des médecins à la campagne, où des postes restent vacants.","mixte","Ordre des médecins allemand (Bundesärztekammer)",""]],
 nucleaire:[
  ["Les pénuries redoutées n'ont pas eu lieu et les renouvelables atteignent 59 % de l'électricité en 2025. Mais l'Allemagne importe de l'électricité (notamment de France) et ses prix restent parmi les plus élevés d'Europe.","mixte","Opéra Énergie ; Euronews, 2026","https://opera-energie.com/media/electricite-en-europe-des-renouvelables-en-hausse-mais-des-trajectoires-contrastees-en-allemagne-et-au-royaume-uni/"],
  ["Après avoir fermé des réacteurs jusqu'en 2020, l'État a pris en 2026 60 % d'une société qui prépare trois petits réacteurs à Ringhals. Aucun n'est encore en construction.","tot","World Nuclear Association, 2026","https://world-nuclear.org/information-library/country-profiles/countries-o-s/sweden"]],
 enr:[
  ["Le solaire fait baisser les prix aux heures ensoleillées. La panne de 2025 a eu plusieurs causes, surtout un mauvais contrôle de la tension du réseau, pas une technologie unique.","mixte","ENTSO-E, rapport final, mars 2026","https://www.entsoe.eu/publications/blackout/28-april-2025-iberian-blackout/"]],
 planchers:[
  ["Le nombre de détenus a explosé, sans baisse claire de la récidive : plusieurs États et le Congrès ont depuis assoupli ces peines.","ko","Commission américaine des peines (USSC)",""]],
 uniforme:[
  ["L'organisme britannique qui évalue les politiques éducatives ne trouve pas de preuve solide d'un effet de l'uniforme sur les résultats scolaires.","constat","Education Endowment Foundation","https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/school-uniform"]],
 college:[
  ["Les enquêtes PISA montrent en Allemagne un lien très fort entre origine sociale et résultats, souvent attribué à ce tri précoce.","ko","OCDE, PISA",""],
  ["Longtemps en tête de PISA avec peu d'inégalités. Ses résultats baissent depuis 2012, comme dans beaucoup de pays.","mixte","OCDE, PISA 2022",""]],
 prive:[
  ["Le libre choix est garanti, mais la séparation sociale entre écoles reste forte dans les grandes villes ; certaines ont mis en place des règles d'admission communes.","mixte","Inspection néerlandaise de l'éducation",""]],
 sol:[
  ["Pas d'effet mesurable sur l'immigration. Des enfants nés et élevés au Royaume-Uni doivent demander, et payer, leur nationalité ; ces frais ont été contestés jusqu'à la Cour suprême.","mixte","Cour suprême britannique, 2022",""],
  ["Le 30 juin 2026, la Cour suprême a annulé le décret de Trump (6 voix contre 3) : le droit du sol reste garanti par la Constitution.","constat","SCOTUSblog, 30 juin 2026","https://scotusblog.com/2026/06/supreme-court-strikes-down-trumps-order-ending-birthright-citizenship"]],
 regul:[
  ["Pas d'« appel d'air » mesuré, plus d'emploi déclaré et environ 4 000 € de recettes en plus par an et par personne régularisée, sans baisse des salaires des Espagnols.","ok","Elias, Monras et Vázquez-Grenno ; EsadeEcPol, 2026","https://www.esade.edu/ecpol/en/blog/la-nueva-regularizacion-de-inmigrantes-en-espana-que-nos-dice-la-evidencia/"],
  ["La régularisation de 2020 a été très lente : des années après, une partie des dossiers n'était toujours pas traitée.","mixte","Campagne « Ero Straniero », rapports de suivi",""]],
 cannabis:[
  ["Premiers bilans : consommation des mineurs stable ou en légère baisse, mais en hausse chez les 18-25 ans. Le gouvernement actuel juge la loi « une erreur » et veut la durcir.","mixte","Ministère fédéral de la Santé, évaluation EKOCAN, avril 2026","https://www.bundesgesundheitsministerium.de/presse/pressemitteilungen/zweite-evaluation-zur-cannabis-teillegalisierung-01-04-26"],
  ["Le marché légal domine désormais les ventes et la consommation des ados n'a pas nettement augmenté ; les intoxications de jeunes enfants par des produits comestibles ont progressé.","mixte","Santé Canada",""],
  ["Forte baisse des overdoses et des infections au VIH chez les usagers. Depuis quelques années, des villes comme Porto signalent un retour de la consommation de rue, faute de moyens.","ok","Agence de l'UE sur les drogues (EUDA)",""]],
 climat:[
  ["Émissions divisées par deux environ depuis 1990, surtout grâce à la fin du charbon (dernière centrale fermée en 2024). Les transports et le chauffage baissent bien moins vite.","ok","Climate Change Committee (Royaume-Uni)",""]],
 pesticides:[
  ["La taxe a orienté les agriculteurs vers des produits moins nocifs : la charge toxique a baissé d'environ 16 %, loin de l'objectif initial de -40 %.","mixte","Université d'Aarhus, évaluation publiée en 2023","https://pure.au.dk/ws/files/338611847/1-s2.0-S0264837723000157-main.pdf"]],
 douane:[
  ["Les prix ont augmenté pour les acheteurs américains, et les représailles ont touché les agriculteurs, que l'État a dû indemniser.","ko","Amiti, Redding et Weinstein, 2019",""]],
 europe:[
  ["Le Danemark a gardé sa couronne, mais a renoncé par référendum en 2022 à sa dérogation sur la défense européenne, après l'invasion de l'Ukraine.","constat","Référendum danois du 1er juin 2022",""]],
 otan:[
  ["Fin de décennies de neutralité, votée par de larges majorités ; les deux pays augmentent fortement leurs budgets militaires.","constat","OTAN",""]],
 defense:[
  ["L'armée polonaise est devenue l'une des plus grandes de l'UE ; en contrepartie, la dette publique augmente vite.","constat","OTAN, dépenses de défense",""],
  ["Les commandes ont mis du temps à arriver. En 2025, l'Allemagne a sorti une partie des dépenses militaires de sa règle de dette pour accélérer.","tot","Bundestag, mars 2025",""]],
 h32:[
  ["Selon les chercheurs, la productivité s'est maintenue et le bien-être des salariés a progressé ; la grande majorité des salariés a ensuite obtenu des horaires réduits ou le droit de les demander.","ok","Autonomy et Alda, rapport 2021",""],
  ["Très peu utilisée : seule une petite minorité de salariés a choisi de travailler sur 4 jours, notamment parce que les journées deviennent plus longues.","ko","Service public fédéral Emploi (Belgique)",""]],
 prionat:[
  ["Réduire les aides des nouveaux arrivants a un peu augmenté leur emploi, mais aussi fortement la pauvreté et la délinquance chez leurs enfants.","mixte","Andersen, Dustmann et Landersø, Rockwool Foundation, 2019",""]],
 police:[
  ["Les affaires graves sont confiées à un organisme extérieur, mais l'IOPC est critiqué pour la lenteur de ses enquêtes et le petit nombre de sanctions.","mixte","Commission des affaires intérieures, Chambre des communes",""],
  ["Le contrôle dépend du Parlement, mais beaucoup d'enquêteurs sont d'anciens policiers, ce qui fait débat sur son indépendance.","mixte","Comité P, rapports annuels",""]],
 finvie:[
  ["Environ 3 % des décès ; la loi reste soutenue par une large majorité, mais les demandes pour souffrance psychique continuent de faire débat.","constat","Commission fédérale belge de contrôle de l'euthanasie",""],
  ["Pratiquée surtout via des associations ; le débat porte notamment sur les personnes venues de l'étranger pour mourir en Suisse.","constat","Office fédéral de la statistique (Suisse)",""],
  ["Quelques centaines de cas par an ; les associations dénoncent des délais longs et des refus fréquents.","constat","Ministère espagnol de la Santé",""]],
 propor:[
  ["Coalitions en général stables, mais négociations longues et Bundestag devenu très grand : une réforme de 2023 le plafonne à 630 députés.","constat","Bundestag",""],
  ["Record de 299 jours pour former un gouvernement en 2021-2022, et plusieurs coalitions tombées avant terme, dont en 2025.","constat","Parlement néerlandais",""]],
 vierep:[
  ["Près de 70 gouvernements depuis 1946 ; une réforme pour élire directement le chef du gouvernement est en discussion.","constat","Gouvernement italien",""],
  ["Le chancelier ne peut être renversé que si les députés élisent aussitôt un successeur : c'est arrivé une seule fois depuis 1949.","constat","Loi fondamentale allemande, art. 67",""]]
};
