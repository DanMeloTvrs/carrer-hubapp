// Seleções masculinas da FIFA (211 federações), agrupadas por confederação
const SELECOES = {
  "UEFA (Europa)": [
    "Albânia", "Alemanha", "Andorra", "Armênia", "Áustria", "Azerbaijão", "Bélgica", "Bielorrússia",
    "Bósnia e Herzegovina", "Bulgária", "Cazaquistão", "Chipre", "Croácia", "Dinamarca", "Escócia",
    "Eslováquia", "Eslovênia", "Espanha", "Estônia", "Finlândia", "França", "Gales", "Geórgia",
    "Gibraltar", "Grécia", "Holanda", "Hungria", "Ilhas Faroé", "Inglaterra", "Irlanda",
    "Irlanda do Norte", "Islândia", "Israel", "Itália", "Kosovo", "Letônia", "Liechtenstein",
    "Lituânia", "Luxemburgo", "Macedônia do Norte", "Malta", "Moldávia", "Montenegro", "Noruega",
    "Polônia", "Portugal", "República Tcheca", "Romênia", "Rússia", "San Marino", "Sérvia", "Suécia",
    "Suíça", "Turquia", "Ucrânia"
  ],
  "CONMEBOL (América do Sul)": [
    "Argentina", "Bolívia", "Brasil", "Chile", "Colômbia", "Equador", "Paraguai", "Peru", "Uruguai",
    "Venezuela"
  ],
  "CONCACAF (América do Norte e Central)": [
    "Anguilla", "Antígua e Barbuda", "Aruba", "Bahamas", "Barbados", "Belize", "Bermudas", "Canadá",
    "Costa Rica", "Cuba", "Curaçao", "Dominica", "El Salvador", "Estados Unidos", "Granada",
    "Guatemala", "Guiana", "Haiti", "Honduras", "Ilhas Cayman", "Ilhas Turks e Caicos",
    "Ilhas Virgens Americanas", "Ilhas Virgens Britânicas", "Jamaica", "México", "Montserrat",
    "Nicarágua", "Panamá", "Porto Rico", "República Dominicana", "Santa Lúcia",
    "São Cristóvão e Nevis", "São Vicente e Granadinas", "Suriname", "Trinidad e Tobago"
  ],
  "CAF (África)": [
    "África do Sul", "Angola", "Argélia", "Benin", "Botsuana", "Burkina Faso", "Burundi",
    "Cabo Verde", "Camarões", "Chade", "Comores", "Congo", "Costa do Marfim", "Djibuti", "Egito",
    "Eritreia", "Essuatíni", "Etiópia", "Gabão", "Gâmbia", "Gana", "Guiné", "Guiné Equatorial",
    "Guiné-Bissau", "Lesoto", "Libéria", "Líbia", "Madagascar", "Malawi", "Mali", "Marrocos",
    "Maurício", "Mauritânia", "Moçambique", "Namíbia", "Níger", "Nigéria", "Quênia",
    "RD Congo", "República Centro-Africana", "Ruanda", "São Tomé e Príncipe", "Senegal",
    "Serra Leoa", "Seicheles", "Somália", "Sudão", "Sudão do Sul", "Tanzânia", "Togo", "Tunísia",
    "Uganda", "Zâmbia", "Zimbábue"
  ],
  "AFC (Ásia e Austrália)": [
    "Afeganistão", "Arábia Saudita", "Austrália", "Bahrein", "Bangladesh", "Brunei", "Butão",
    "Camboja", "Catar", "China", "Coreia do Norte", "Coreia do Sul", "Emirados Árabes Unidos",
    "Filipinas", "Guam", "Hong Kong", "Iêmen", "Índia", "Indonésia", "Irã", "Iraque", "Japão",
    "Jordânia", "Kuwait", "Laos", "Líbano", "Macau", "Malásia", "Maldivas", "Mianmar", "Mongólia",
    "Nepal", "Omã", "Palestina", "Paquistão", "Quirguistão", "Singapura", "Síria", "Sri Lanka",
    "Tadjiquistão", "Taipé Chinesa", "Tailândia", "Timor-Leste", "Turcomenistão", "Uzbequistão",
    "Vietnã"
  ],
  "OFC (Oceania)": [
    "Fiji", "Ilhas Cook", "Ilhas Salomão", "Nova Caledônia", "Nova Zelândia", "Papua-Nova Guiné",
    "Samoa", "Samoa Americana", "Taiti", "Tonga", "Vanuatu"
  ]
};