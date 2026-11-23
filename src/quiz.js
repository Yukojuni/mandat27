// Quiz « Devine le chiffre » : uniquement sur des faits sourcés dans questions.js (index du fait = f).
const QUIZ = {
 retraite:{q:"Les retraites, ça représente quelle part de toute la richesse produite en France (PIB) ?", c:["4,1 %","14,1 %","31 %"], ok:1, f:0},
 smic:{q:"Combien de salariés du privé sont payés au SMIC ?", c:["1 sur 50","1 sur 8","1 sur 2"], ok:1, f:1},
 isf:{q:"Depuis la suppression de l'ISF en 2018, l'évaluation officielle a-t-elle prouvé un effet sur l'investissement ?", c:["Oui, un gros effet","Non, aucun effet démontré","Oui, un effet négatif"], ok:1, f:1},
 rsa:{q:"Dans l'expérimentation du RSA avec accompagnement renforcé, de combien a augmenté le taux d'emploi salarié des participants ?", c:["+0,3 point","+3,6 points","+36 points"], ok:1, f:1},
 nucleaire:{q:"L'EPR de Flamanville devait coûter 3,3 milliards d'euros. Il a finalement coûté…", c:["4 milliards","11 milliards","23,7 milliards"], ok:2, f:2},
 planchers:{q:"Entre 2007 et 2011, avec les peines planchers, le taux de condamnations en récidive…", c:["a baissé","est resté stable","a augmenté"], ok:2, f:0},
 prive:{q:"Combien coûte au total l'enseignement privé sous contrat, financé surtout par l'argent public (2022) ?", c:["1,4 milliard €","13,8 milliards €","40 milliards €"], ok:1, f:0},
 sol:{q:"Un enfant né en France de parents étrangers devient français…", c:["dès sa naissance","à 18 ans, s'il a vécu en France","jamais automatiquement"], ok:1, f:0},
 cannabis:{q:"Depuis 2020, l'amende forfaitaire pour usage de cannabis est de…", c:["35 €","200 €","1 500 €"], ok:1, f:0},
 pesticides:{q:"Les plans Écophyto visent -50 % de pesticides depuis 2008. L'objectif a-t-il été atteint ?", c:["Oui, dès 2018","À moitié","Jamais"], ok:2, f:0},
 otan:{q:"De Gaulle avait quitté le commandement intégré de l'OTAN en 1966. La France y est revenue en…", c:["1995","2009","2022"], ok:1, f:0},
 defense:{q:"La loi de programmation militaire 2024-2030 prévoit combien pour les armées ?", c:["41 milliards €","413 milliards €","4 130 milliards €"], ok:1, f:0},
 h32:{q:"Au Royaume-Uni en 2022, 61 entreprises ont testé la semaine de 4 jours. Combien ont voulu continuer ?", c:["30 %","60 %","92 %"], ok:2, f:1},
 finvie:{q:"En février 2026, qu'a fait l'Assemblée nationale du texte sur l'aide à mourir ?", c:["Elle l'a adopté","Elle l'a rejeté","Elle ne l'a pas voté"], ok:0, f:0},
 vierep:{q:"Combien de fois le gouvernement d'Élisabeth Borne a-t-il utilisé le 49.3 entre 2022 et 2024 ?", c:["3 fois","11 fois","23 fois"], ok:2, f:0}
};
