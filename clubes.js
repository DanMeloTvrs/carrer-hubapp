// Clubes do EA Sports FC 26 (futebol masculino)
// Para adicionar um clube, é só colocar o nome dentro da liga certa.
// A ordem alfabética é feita automaticamente no final deste arquivo.

const CLUBES = {
  "Primera División (Argentina)": [
    "Aldosivi", "Argentinos Jrs", "Atlético Tucumán", "Banfield",
    "Barracas Central", "Belgrano", "Boca Juniors", "Central Córdoba",
    "Defensa y Justicia", "Deportivo Riestra", "Estudiantes", "Gimnasia",
    "Godoy Cruz", "Huracán", "Independiente", "Independiente Rivadavia",
    "Instituto Córdoba", "Lanús", "Newell's", "Platense", "Racing Club",
    "River Plate", "Rosario Central", "San Lorenzo", "San Martín",
    "Sarmiento", "Talleres", "Tigre", "Unión", "Vélez Sarsfield"
  ],

  "A-League (Austrália)": [
    "Adelaide United", "Auckland FC", "Brisbane Roar", "Central Coast Mariners",
    "Macarthur FC", "Melbourne City", "Melbourne Victory", "Newcastle Jets",
    "Perth Glory", "Sydney FC", "Wellington Phoenix",
    "Western Sydney Wanderers", "Western United"
  ],

  "Bundesliga (Áustria)": [
    "Blau-Weiß Linz", "FC Red Bull Salzburg", "FK Austria Wien", "Grazer AK",
    "LASK", "SCR Altach", "SK Rapid Wien", "SK Sturm Graz", "SV Ried",
    "TSV Hartberg", "Wolfsberger AC", "WSG Tirol"
  ],

  "Pro League (Bélgica)": [
    "Cercle Brugge", "Charleroi", "Club Brugge", "Dender EH", "Genk", "Gent",
    "La Louvière", "Leuven", "Mechelen", "Royal Antwerp FC", "R.S.C Anderlecht",
    "Sint-Truiden", "Standard Liège", "Union SG", "Westerlo", "Zulte Waregem"
  ],

  "Super League (China)": [
    "Beijing Sinobo Guoan", "Changchun Yatai", "Chengdu Rongcheng",
    "Dalian Yingbo", "Henan Jianye", "Meizhou Hakka", "Qingdao Hainiu",
    "Qingdao West Coast", "Shandong Luneng Taishan",
    "Shanghai Greenland Shenhua", "Shanghai Port", "Shenzhen Peng City",
    "Tianjin TEDA", "Wuhan Three Towns", "Yunnan Yukun", "Zhejiang"
  ],

  "Superliga (Dinamarca)": [
    "Aarhus", "Brøndby IF", "FC København", "FC Midtjylland",
    "FC Nordsjælland", "Fredericia", "OB Odense", "Randers FC",
    "Silkeborg IF", "SønderjyskE", "Vejle Boldklub", "Viborg FF"
  ],

  "Championship (Inglaterra)": [
    "Birmingham City", "Blackburn Rovers", "Bristol City", "Charlton Athletic",
    "Coventry City", "Derby County", "Hull City", "Ipswich Town",
    "Leicester City", "Middlesbrough", "Millwall", "Norwich City",
    "Oxford United", "Portsmouth", "Preston North End", "Queens Park Rangers",
    "Sheffield United", "Sheffield Wednesday", "Southampton", "Stoke City",
    "Swansea City", "Watford", "West Bromwich Albion", "Wrexham"
  ],

  "League One (Inglaterra)": [
    "AFC Wimbledon", "Barnsley", "Blackpool", "Bolton Wanderers",
    "Bradford City", "Burton Albion", "Cardiff City", "Doncaster Rovers",
    "Exeter City", "Huddersfield Town", "Leyton Orient", "Lincoln City",
    "Luton Town", "Mansfield Town", "Northampton Town", "Peterborough United",
    "Plymouth Argyle", "Port Vale", "Reading", "Rotherham United",
    "Stevenage", "Stockport County", "Wigan Athletic", "Wycombe Wanderers"
  ],

  "League Two (Inglaterra)": [
    "Accrington Stanley", "Barnet", "Barrow", "Bristol Rovers", "Bromley",
    "Cambridge United", "Cheltenham Town", "Chesterfield", "Colchester United",
    "Crawley Town", "Crewe Alexandra", "Fleetwood Town", "Gillingham",
    "Grimsby Town", "Harrogate Town", "Milton Keynes Dons", "Newport County",
    "Notts County", "Oldham Athletic", "Salford City", "Shrewsbury Town",
    "Swindon Town", "Tranmere Rovers", "Walsall"
  ],

  "Premier League (Inglaterra)": [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford",
    "Brighton & Hove Albion", "Burnley", "Chelsea", "Crystal Palace",
    "Everton", "Fulham", "Leeds United", "Liverpool", "Manchester City",
    "Manchester United", "Newcastle United", "Nottingham Forest",
    "Sunderland", "Tottenham", "West Ham", "Wolverhampton"
  ],

  "Ligue 1 (França)": [
    "Angers SCO", "AS Monaco", "Auxerre", "FC Lorient", "FC Metz",
    "FC Nantes", "Havre AC", "LOSC Lille", "OGC Nice", "Olympique de Marseille",
    "Olympique Lyonnais", "Paris FC", "Paris Saint-Germain (PSG)",
    "Racing Club de Lens", "RC Strasbourg Alsace", "Stade Brestois 29",
    "Stade Rennais FC", "Toulouse FC"
  ],

  "Ligue 2 (França)": [
    "Amiens SC", "AS Saint-Étienne", "Beauleroix FC", "Clermont Foot",
    "Dunkerque", "En Avant Guingamp", "FC Annecy", "Grenoble Foot 38", "Laval",
    "Le Mans", "Montpellier HSC", "Nancy", "Pau FC", "Red Star FC",
    "Rodez Aveyron", "SC Bastia", "Stade de Reims", "Troyes"
  ],

  "Bundesliga (Alemanha)": [
    "1. FC Heidenheim", "1. FC Köln", "1899 Hoffenheim", "Bayer Leverkusen",
    "Bayern Munich (Bayern de Munique)", "Borussia Dortmund",
    "Borussia Mönchengladbach", "Eintracht Frankfurt", "FC Augsburg",
    "FC St. Pauli", "Hamburger SV", "Mainz 05", "RB Leipzig", "SC Freiburg",
    "Union Berlin", "VfB Stuttgart", "VfL Wolfsburg", "Werder Bremen"
  ],

  "2. Bundesliga (Alemanha)": [
    "1. FC Kaiserslautern", "1. FC Magdeburg", "1. FC Nürnberg",
    "Arminia Bielefeld", "Darmstadt 98", "Dynamo Dresden",
    "Eintracht Braunschweig", "Fortuna Düsseldorf", "Greuther Fürth",
    "Hannover 96", "Hertha BSC", "Holstein Kiel", "Karlsruher SC",
    "Preußen Münster", "SC Paderborn", "Schalke 04", "SV Elversberg",
    "VfL Bochum"
  ],

  "3. Liga (Alemanha)": [
    "1. FC Saarbrücken", "1. FC Schweinfurt", "Alemannia Aachen",
    "Energie Cottbus", "Erzgebirge Aue", "FC Ingolstadt 04",
    "FC Viktoria Köln", "Hansa Rostock", "Jahn Regensburg", "MSV Duisburg",
    "Rot-Weiss Essen", "SC Verl", "SSV Ulm", "SV Waldhof Mannheim",
    "TSG Hoffenheim II", "TSV 1860 München", "TSV Havelse", "VfB Stuttgart II",
    "VfL Osnabrück", "Wehen Wiesbaden"
  ],

  "Eredivisie (Países Baixos)": [
    "Ajax", "AZ Alkmaar", "Excelsior", "FC Utrecht", "FC Volendam",
    "Feyenoord", "Fortuna Sittard", "Go Ahead Eagles", "Groningen",
    "Heracles Almelo", "NAC Breda", "NEC Nijmegen", "PEC Zwolle",
    "PSV Eindhoven", "SC Heerenveen", "Sparta Rotterdam", "Telstar", "Twente"
  ],

  "Indian Super League (Índia)": [
    "ATK Mohun Bagan", "Bengaluru", "Chennaiyin", "East Bengal", "Goa",
    "Hyderabad", "Jamshedpur", "Kerala Blasters", "Mohammedan", "Mumbai City",
    "NorthEast United", "Odisha", "RoundGlass Punjab", "United Tigers"
  ],

  "Serie A (Itália)": [
    "AS Roma", "Bergamo Calcio (Atalanta)", "Bologna", "Cagliari", "Como",
    "Cremonese", "Fiorentina", "Genoa", "Hellas Verona", "Juventus",
    "Latium (Lazio)", "Lecce", "Lombardia FC (Inter de Milão)",
    "Milano FC (Milan)", "Napoli", "Parma", "Pisa", "Sassuolo", "Torino",
    "Udinese"
  ],

  "Serie B (Itália)": [
    "Avellino", "Bari", "Brianza Calcio (Monza)", "Carrarese", "Catanzaro",
    "Cesena", "Empoli", "Frosinone", "Juve Stabia", "Mantova", "Modena",
    "Padova", "Palermo", "Pescara", "Reggiana", "Sampdoria", "Spezia",
    "Südtirol", "Venezia", "Virtus Entella"
  ],

  "K League 1 (Coreia do Sul)": [
    "Daegu FC", "Daejeon Hana Citizen", "FC Anyang", "FC Seoul", "Gangwon FC",
    "Gimcheon Sangmu", "Gwangju FC", "Jeju United", "Jeonbuk Hyundai Motors",
    "Pohang Steelers", "Suwon FC", "Ulsan Hyundai"
  ],

  "Eliteserien (Noruega)": [
    "Bodø/Glimt", "Bryne", "Fredrikstad", "Hamarkameratene", "Haugesund",
    "KFUM Oslo", "Kristiansund", "Molde", "Rosenborg", "Sandefjord",
    "Sarpsborg 08", "SK Brann", "Strømsgodset", "Tromsø", "Vålerenga", "Viking"
  ],

  "Ekstraklasa (Polônia)": [
    "Arka Gdynia", "Bruk-Bet Termalica", "Cracovia", "GKS Katowice",
    "Górnik Zabrze", "Jagiellonia Białystok", "Korona Kielce", "Lechia Gdańsk",
    "Lech Poznań", "Legia Warszawa", "Motor Lublin", "Piast Gliwice",
    "Pogoń Szczecin", "Radomiak Radom", "Raków Częstochowa", "Widzew Łódź",
    "Wisła Płock", "Zagłębie Lubin"
  ],

  "Primeira Liga (Portugal)": [
    "Alverca", "Arouca", "AVS", "Casa Pia", "CD Nacional", "Estoril",
    "Estrela Amadora", "Famalicão", "FC Porto", "Gil Vicente", "Moreirense",
    "Rio Ave", "Santa Clara", "SL Benfica", "Sporting CP",
    "Sporting de Braga", "Tondela", "Vitória de Guimarães"
  ],

  "Premier Division (Irlanda)": [
    "Bohemians", "Cork City", "Derry City", "Drogheda", "Galway United",
    "Shamrock Rovers", "Shelbourne", "Sligo Rovers", "St Patrick’s Athletic",
    "Waterford"
  ],

  "Liga I (Romênia)": [
    "Argeș Pitești", "Botoșani", "CFR Cluj", "Csíkszereda Ciuc",
    "Dinamo București", "Farul Constanța", "FCSB", "Hermannstadt",
    "Metaloglobus București", "Oțelul Galați", "Petrolul", "Rapid București",
    "Unirea Slobozia", "Universitatea Cluj", "Universitatea Craiova", "UTA Arad"
  ],

  "Saudi Pro League (Arábia Saudita)": [
    "Al Ahli", "Al-Fateh", "Al Fayha", "Al Hazem", "Al Hilal", "Al Ittihad",
    "Al Khaleej", "Al Kholood", "Al Najma", "Al Nassr", "Al Okhdood",
    "Al Qadsiah", "Al Riyadh SC", "Al Shabab", "Al Taawoun", "Damac",
    "Ettifaq FC", "Neom"
  ],

  "Premiership (Escócia)": [
    "Aberdeen", "Celtic", "Dundee", "Dundee United", "Falkirk",
    "Heart of Midlothian", "Hibernian", "Kilmarnock", "Livingston",
    "Motherwell", "Rangers", "St Mirren"
  ],

  "La Liga (Espanha)": [
    "Alavés", "Athletic Bilbao", "Atlético Madrid (Atlético de Madrid)",
    "Celta Vigo", "Elche", "Espanyol", "FC Barcelona", "Getafe", "Girona",
    "Levante", "Mallorca", "Osasuna", "Rayo Vallecano", "Real Betis",
    "Real Madrid", "Real Oviedo", "Real Sociedad", "Sevilla", "Valencia",
    "Villarreal"
  ],

  "Segunda División (Espanha)": [
    "Albacete", "Almería", "Andorra", "Burgos", "Cádiz", "Castellón", "Ceuta",
    "Córdoba CF", "Cultural Leonesa", "Deportivo La Coruña", "Eibar",
    "Granada", "Huesca", "Las Palmas", "Leganés", "Málaga", "Mirandés",
    "Racing Santander", "Real Sociedad B", "Sporting de Gijón", "Valladolid",
    "Zaragoza"
  ],

  "Allsvenskan (Suécia)": [
    "AIK", "BK Häcken", "Degerfors IF", "Djurgårdens IF", "GAIS",
    "Halmstads BK", "Hammarby IF", "IF Brommapojkarna", "IF Elfsborg",
    "IFK Göteborg", "IFK Norrköping", "IFK Värnamo", "IK Sirius", "Malmö FF",
    "Mjällby AI", "Östers IF"
  ],

  "Super League (Suíça)": [
    "BSC Young Boys", "FC Basel", "FC Lausanne-Sport", "FC Lugano",
    "FC Luzern", "FC Sion", "FC St. Gallen", "FC Zürich", "Grasshopper",
    "Servette FC", "Thun", "Winterthur"
  ],

  "Süper Lig (Turquia)": [
    "Alanyaspor", "Antalyaspor", "Beşiktaş Istanbul", "Eyüpspor",
    "Fatih Karagümrük", "Fenerbahçe Istanbul", "Galatasaray Istanbul",
    "Gazişehir Gaziantep FK", "Gençlerbirliği", "Göztepe",
    "Istanbul Başakşehir FK", "Kasımpaşa Istanbul", "Kayserispor",
    "Kocaelispor", "Konyaspor", "Rizespor", "Samsunspor", "Trabzonspor"
  ],

  "MLS (Estados Unidos / Canadá)": [
    "Atlanta United", "Austin FC", "CF Montreal", "Charlotte FC",
    "Chicago Fire", "Colorado Rapids", "Columbus Crew SC", "D.C. United",
    "FC Cincinnati", "FC Dallas", "Houston Dynamo", "Inter Miami CF",
    "LA Galaxy", "Los Angeles FC (LAFC)", "Minnesota United FC", "Nashville SC",
    "New England Revolution", "New York City FC", "New York Red Bulls",
    "Orlando City", "Philadelphia Union", "Portland Timbers", "Real Salt Lake",
    "San Diego", "San Jose Earthquakes", "Seattle Sounders FC",
    "Sporting Kansas City", "St Louis City", "Toronto FC",
    "Vancouver Whitecaps FC"
  ]
};

// Deixa os clubes de cada liga em ordem alfabética
for (const liga in CLUBES) {
  CLUBES[liga].sort(function (a, b) {
    return a.localeCompare(b, "pt");
  });
}