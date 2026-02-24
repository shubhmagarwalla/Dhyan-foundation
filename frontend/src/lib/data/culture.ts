export type MythologyStory = {
  id: string;
  title: string;
  titleHindi: string;
  category: "ramayana" | "mahabharata" | "krishna" | "ganesha" | "hanuman" | "shiva" | "puranic" | "panchatantra";
  ageGroup: "3-6" | "6-10" | "10-14" | "all";
  summary: string;
  summaryHindi: string;
  moralHindi: string;
  moral: string;
};

export type RegionalTradition = {
  id: string;
  name: string;
  nameHindi: string;
  region: string;
  category: "festival" | "art" | "dance" | "music" | "game" | "craft" | "food" | "language";
  description: string;
  descriptionHindi: string;
  howToTeach: string;
  howToTeachHindi: string;
  icon: string;
};

export const MYTHOLOGY_STORIES: MythologyStory[] = [
  // ─── GANESHA ──────────────────────────────────────────────────────────────
  {
    id: "ganesha-birth",
    title: "The Birth of Ganesha",
    titleHindi: "गणेश जी का जन्म",
    category: "ganesha",
    ageGroup: "3-6",
    summary: "Parvati created Ganesha from turmeric paste to guard her door. When Shiva returned and Ganesha blocked his entry, Shiva replaced his head with an elephant's. Ganesha became the first-worshipped god.",
    summaryHindi: "माँ पार्वती ने हल्दी से गणेश जी को बनाया और द्वार का पहरेदार बनाया। जब शिव जी लौटे और गणेश जी ने रोका, तो शिव जी ने उनका सिर हाथी के सिर से बदल दिया। गणेश जी सबसे पहले पूजे जाने वाले देवता बने।",
    moral: "Loyalty and duty are sacred. Ganesha's devotion to his mother made him the most revered deity.",
    moralHindi: "वफ़ादारी और कर्तव्य पवित्र हैं। माँ के प्रति गणेश जी की भक्ति ने उन्हें सबसे पूजनीय देवता बनाया।",
  },
  {
    id: "ganesha-moon",
    title: "Ganesha and the Moon",
    titleHindi: "गणेश जी और चंद्रमा",
    category: "ganesha",
    ageGroup: "3-6",
    summary: "After eating too many laddoos, Ganesha fell from his mouse. The moon laughed. Ganesha cursed the moon to fade, and restored him with the lesson that pride leads to downfall.",
    summaryHindi: "बहुत सारे लड्डू खाने के बाद गणेश जी अपने मूषक से गिर गए। चंद्रमा ने हँसी उड़ाई। गणेश जी ने चंद्रमा को श्राप दिया कि वह मद्धिम हो जाए, और सिखाया कि घमंड पतन की ओर ले जाता है।",
    moral: "Never mock others' misfortunes. Pride always leads to downfall.",
    moralHindi: "कभी किसी की मुसीबत पर मत हँसो। घमंड हमेशा पतन की ओर ले जाता है।",
  },
  // ─── KRISHNA ──────────────────────────────────────────────────────────────
  {
    id: "krishna-makhan",
    title: "Krishna the Butter Thief",
    titleHindi: "माखन चोर कृष्ण",
    category: "krishna",
    ageGroup: "3-6",
    summary: "Little Krishna loved butter so much he would steal it from neighbours' pots with his friends. Mother Yashoda would scold him but his mischief and charm melted everyone's heart.",
    summaryHindi: "नन्हे कृष्ण को माखन बहुत प्रिय था। वे अपने दोस्तों के साथ पड़ोसियों की मटकियों से माखन चुराते थे। माँ यशोदा डाँटती थीं, लेकिन उनकी शरारत और मुस्कान सबका दिल जीत लेती थी।",
    moral: "Pure love and innocence are irresistible. Krishna's playfulness teaches us to find joy in simple things.",
    moralHindi: "शुद्ध प्रेम और मासूमियत अनूठे होते हैं। कृष्ण की शरारत सिखाती है कि छोटी चीज़ों में खुशी ढूंढें।",
  },
  {
    id: "krishna-govardhan",
    title: "Krishna Lifts Govardhan",
    titleHindi: "कृष्ण ने गोवर्धन पर्वत उठाया",
    category: "krishna",
    ageGroup: "6-10",
    summary: "Indra sent terrible rains to punish Vrindavan. Krishna lifted Govardhan mountain on his little finger and sheltered all the villagers, animals and cows for seven days until Indra surrendered.",
    summaryHindi: "इंद्र देव ने वृंदावन को दंड देने के लिए भयंकर वर्षा भेजी। कृष्ण ने अपनी छोटी उँगली पर गोवर्धन पर्वत उठा लिया और सात दिनों तक सभी गाँव वालों, पशुओं और गायों की रक्षा की, जब तक इंद्र ने हार नहीं मान ली।",
    moral: "God protects those who love and serve him faithfully. Humility overcomes arrogance.",
    moralHindi: "भगवान उनकी रक्षा करते हैं जो उनसे प्रेम करते हैं। विनम्रता अहंकार को जीत लेती है।",
  },
  {
    id: "krishna-gita",
    title: "Bhagavad Gita — Do Your Duty",
    titleHindi: "भगवद्गीता — अपना कर्म करो",
    category: "krishna",
    ageGroup: "10-14",
    summary: "On the battlefield of Kurukshetra, Arjuna was confused and afraid. Krishna taught him the Bhagavad Gita — the eternal wisdom of duty, devotion and detachment. 'Do your duty without attachment to results.'",
    summaryHindi: "कुरुक्षेत्र के रणक्षेत्र में अर्जुन भ्रमित और भयभीत था। कृष्ण ने उसे भगवद्गीता का ज्ञान दिया — कर्तव्य, भक्ति और वैराग्य का शाश्वत ज्ञान। 'फल की चिंता किए बिना अपना कर्म करो।'",
    moral: "Do your duty without worrying about results. Act with righteousness.",
    moralHindi: "फल की चिंता किए बिना अपना कर्म करो। धर्म के साथ काम करो।",
  },
  // ─── HANUMAN ──────────────────────────────────────────────────────────────
  {
    id: "hanuman-sundar-kand",
    title: "Hanuman Crosses the Ocean",
    titleHindi: "हनुमान जी ने समुद्र पार किया",
    category: "hanuman",
    ageGroup: "6-10",
    summary: "When the monkey army stood helpless before the vast ocean, Hanuman remembered his divine powers. He leapt across the ocean, found Sita in Lanka and delivered Rama's message, giving her hope.",
    summaryHindi: "जब वानर सेना विशाल समुद्र के सामने असहाय खड़ी थी, हनुमान जी को अपनी दिव्य शक्ति याद आई। उन्होंने समुद्र लाँघा, लंका में सीता माता को ढूँढा और राम जी का संदेश देकर उन्हें उम्मीद दी।",
    moral: "Self-belief can move mountains. Remember your inner strength.",
    moralHindi: "आत्मविश्वास पहाड़ भी हिला सकता है। अपनी अंदरूनी शक्ति को याद करो।",
  },
  // ─── RAMAYANA ─────────────────────────────────────────────────────────────
  {
    id: "ram-birth",
    title: "Birth of Lord Rama",
    titleHindi: "भगवान राम का जन्म",
    category: "ramayana",
    ageGroup: "6-10",
    summary: "King Dasharatha of Ayodhya performed the Putrakameshti Yagna. The divine kheer was given to his three queens. Rama, Bharata, Lakshmana and Shatrughna were born to bring dharma to the world.",
    summaryHindi: "अयोध्या के राजा दशरथ ने पुत्रकामेष्टि यज्ञ किया। दिव्य खीर उनकी तीन रानियों को दी गई। राम, भरत, लक्ष्मण और शत्रुघ्न का जन्म हुआ — धर्म को संसार में स्थापित करने के लिए।",
    moral: "Faith and devotion are always rewarded. Every soul has a divine purpose.",
    moralHindi: "श्रद्धा और भक्ति का फल ज़रूर मिलता है। हर आत्मा का एक दिव्य उद्देश्य होता है।",
  },
  {
    id: "sita-swayamvar",
    title: "Rama Breaks Shiva's Bow",
    titleHindi: "राम ने शिव धनुष तोड़ा",
    category: "ramayana",
    ageGroup: "6-10",
    summary: "King Janaka announced that whoever could lift and string Shiva's divine bow would marry his daughter Sita. Countless princes failed. Young Rama not only lifted it but broke it — winning Sita's hand.",
    summaryHindi: "राजा जनक ने घोषणा की कि जो शिव का दिव्य धनुष उठाकर उस पर प्रत्यंचा चढ़ाएगा, वह सीता से विवाह करेगा। अनेक राजकुमार असफल रहे। युवा राम ने न केवल धनुष उठाया बल्कि उसे तोड़ दिया — और सीता माता का वरण हुआ।",
    moral: "True strength comes from righteousness, not just muscle.",
    moralHindi: "सच्ची शक्ति धर्म से आती है, केवल बाहुबल से नहीं।",
  },
  // ─── SHIVA ────────────────────────────────────────────────────────────────
  {
    id: "shiva-neelkanth",
    title: "Shiva Drinks the Poison",
    titleHindi: "शिव ने विष पान किया — नीलकण्ठ",
    category: "shiva",
    ageGroup: "6-10",
    summary: "When gods and demons churned the ocean, deadly poison (Halahala) emerged that would have destroyed the world. Shiva drank it to save creation. Parvati held his throat so the poison stayed there, turning it blue.",
    summaryHindi: "जब देवताओं और असुरों ने समुद्र मंथन किया, तो हलाहल विष निकला जो सृष्टि को नष्ट कर देता। शिव जी ने सृष्टि की रक्षा के लिए इसे पी लिया। पार्वती ने उनका गला पकड़ लिया ताकि विष वहीं रुके — और उनका गला नीला पड़ गया।",
    moral: "Self-sacrifice for the welfare of others is the highest virtue.",
    moralHindi: "दूसरों की भलाई के लिए बलिदान सबसे बड़ा गुण है।",
  },
  // ─── PANCHATANTRA ─────────────────────────────────────────────────────────
  {
    id: "crow-pitcher",
    title: "The Clever Crow and the Pitcher",
    titleHindi: "चालाक कौआ और घड़ा",
    category: "panchatantra",
    ageGroup: "3-6",
    summary: "A thirsty crow found a pitcher with a little water at the bottom. His beak could not reach it. He dropped pebbles one by one until the water rose to the top and he could drink.",
    summaryHindi: "एक प्यासे कौए को एक घड़ा मिला जिसमें थोड़ा पानी था पर उसकी चोंच नहीं पहुँच पाती थी। उसने एक-एक करके कंकड़ डाले जब तक पानी ऊपर नहीं आ गया और वह पी सका।",
    moral: "Patience and intelligence solve problems that strength cannot.",
    moralHindi: "धैर्य और बुद्धि उन समस्याओं को सुलझाती हैं जो शक्ति नहीं सुलझा पाती।",
  },
  {
    id: "lion-mouse",
    title: "The Lion and the Mouse",
    titleHindi: "शेर और चूहा",
    category: "panchatantra",
    ageGroup: "3-6",
    summary: "A mouse disturbed a sleeping lion but begged for mercy. The lion laughed and let him go. Later, hunters trapped the lion in a net. The tiny mouse chewed through the ropes and freed the mighty lion.",
    summaryHindi: "एक चूहे ने सोते हुए शेर को परेशान किया, लेकिन माफी माँगी। शेर ने हँसकर उसे जाने दिया। बाद में शिकारियों ने शेर को जाल में फँसाया। उस छोटे चूहे ने रस्सियाँ कुतरकर शक्तिशाली शेर को आज़ाद कराया।",
    moral: "Even the smallest can help the greatest. Never underestimate anyone.",
    moralHindi: "सबसे छोटा भी सबसे बड़े की मदद कर सकता है। किसी को कमज़ोर मत समझो।",
  },
];

export const REGIONAL_TRADITIONS: RegionalTradition[] = [
  {
    id: "rangoli",
    name: "Rangoli",
    nameHindi: "रंगोली",
    region: "All India (esp. Maharashtra, Rajasthan, Gujarat, Karnataka)",
    category: "art",
    description: "Geometric and floral patterns made with coloured powder on floors during festivals.",
    descriptionHindi: "त्योहारों पर रंगीन पाउडर से फर्श पर बनाई जाने वाली ज्यामितीय और पुष्प आकृतियाँ।",
    howToTeach: "Start with simple dots (kolam style), connect them into patterns. Use rice flour or chalk. Celebrate Diwali/Onam together.",
    howToTeachHindi: "सरल बिंदुओं से शुरुआत करें (कोलम शैली), उन्हें आकृतियों में जोड़ें। चावल के आटे या चॉक का उपयोग करें। दीवाली/ओणम एक साथ मनाएँ।",
    icon: "🎨",
  },
  {
    id: "kathak",
    name: "Kathak Dance",
    nameHindi: "कथक नृत्य",
    region: "North India (UP, Rajasthan)",
    category: "dance",
    description: "Classical dance form telling stories of gods through footwork (tatkar), spins (chakkar) and expressive gestures (mudras).",
    descriptionHindi: "पैरों की थाप (तत्कार), चक्कर और भाव-भंगिमाओं (मुद्राओं) के माध्यम से देवताओं की कथाएँ सुनाने वाला शास्त्रीय नृत्य।",
    howToTeach: "Start with simple tatkar (footwork rhythms), basic 'namaskar' position, and teach one mudra per week. Connect to songs they know.",
    howToTeachHindi: "सरल तत्कार (पैरों की लय) से शुरू करें, बुनियादी 'नमस्कार' मुद्रा, और प्रति सप्ताह एक नई मुद्रा सिखाएँ। उनके जाने-पहचाने गानों से जोड़ें।",
    icon: "💃",
  },
  {
    id: "bharatanatyam",
    name: "Bharatanatyam",
    nameHindi: "भरतनाट्यम",
    region: "Tamil Nadu / South India",
    category: "dance",
    description: "Ancient classical dance from Tamil Nadu, performed in temple traditions, combining rhythm, expression and devotion.",
    descriptionHindi: "तमिलनाडु का प्राचीन शास्त्रीय नृत्य, मंदिर परंपराओं में प्रस्तुत, लय, भाव और भक्ति का संगम।",
    howToTeach: "Teach 'Aramandi' (demi-plié) as the basic stance. Show temple sculptures that match dance poses. Watch classical performances together.",
    howToTeachHindi: "बुनियादी मुद्रा के रूप में 'अरमंडी' (अर्ध-झुकाव) सिखाएँ। नृत्य मुद्राओं से मेल खाती मंदिर की मूर्तियाँ दिखाएँ। साथ में शास्त्रीय प्रदर्शन देखें।",
    icon: "🙏",
  },
  {
    id: "kabaddi",
    name: "Kabaddi",
    nameHindi: "कबड्डी",
    region: "Pan-India",
    category: "game",
    description: "Traditional contact sport where a raider chants 'kabaddi' while tagging opponents and returning without breathing.",
    descriptionHindi: "पारंपरिक खेल जिसमें रेडर 'कबड्डी' बोलते हुए विरोधियों को छूकर बिना साँस लिए वापस आता है।",
    howToTeach: "Play in garden. Explain rules simply: two teams, one raider at a time, hold your breath. Start with 4v4.",
    howToTeachHindi: "बगीचे में खेलें। सरल नियम बताएँ: दो टीम, एक समय में एक रेडर, साँस रोको। 4v4 से शुरू करें।",
    icon: "🤸",
  },
  {
    id: "gilli-danda",
    name: "Gilli-Danda",
    nameHindi: "गिल्ली-डंडा",
    region: "North India, Rural India",
    category: "game",
    description: "Ancient game where a small piece of wood (gilli) is struck with a larger stick (danda) — the predecessor of cricket and baseball.",
    descriptionHindi: "प्राचीन खेल जिसमें छोटी लकड़ी (गिल्ली) को बड़ी छड़ी (डंडे) से मारा जाता है — क्रिकेट और बेसबॉल का पूर्वज।",
    howToTeach: "Carve a simple gilli from wood (15cm). Use any straight stick as danda. Play in open ground. Score by distance.",
    howToTeachHindi: "लकड़ी से एक सरल गिल्ली बनाएँ (15 सेमी)। कोई भी सीधी छड़ी डंडे के रूप में उपयोग करें। खुले मैदान में खेलें। दूरी से स्कोर करें।",
    icon: "🏏",
  },
  {
    id: "mehendi",
    name: "Mehendi (Henna Art)",
    nameHindi: "मेंहदी",
    region: "Rajasthan, UP, Punjab, all India",
    category: "art",
    description: "Traditional art of applying henna paste in intricate patterns on hands and feet during weddings and festivals.",
    descriptionHindi: "शादियों और त्योहारों में हाथ और पैरों पर मेंहदी की जटिल आकृतियाँ बनाने की परंपरागत कला।",
    howToTeach: "Buy ready mehendi cones. Start with simple flowers and dots. Progress to peacocks and paisleys. Celebrate Teej/Eid/Diwali with it.",
    howToTeachHindi: "तैयार मेंहदी के कोन खरीदें। सरल फूल और बिंदुओं से शुरू करें। मोर और पेसले की ओर बढ़ें। तीज/ईद/दीवाली पर उत्सव मनाएँ।",
    icon: "✋",
  },
  {
    id: "classical-music",
    name: "Hindustani Classical Music",
    nameHindi: "हिंदुस्तानी शास्त्रीय संगीत",
    region: "North India",
    category: "music",
    description: "Ancient musical system based on ragas (melodic frameworks) and talas (rhythmic cycles). Associated with devotional music (bhajans, kirtans).",
    descriptionHindi: "राग (सुर की संरचना) और ताल (लयबद्ध चक्र) पर आधारित प्राचीन संगीत प्रणाली। भजन और कीर्तन से जुड़ी।",
    howToTeach: "Start with 'Sa Re Ga Ma' (solfège). Teach Raag Yaman (evening raga) as first raga. Introduce tabla beats on table-tapping.",
    howToTeachHindi: "'सा रे ग म' से शुरू करें। पहले राग के रूप में राग यमन (शाम का राग) सिखाएँ। मेज थपथपाकर तबले की थाप से परिचय कराएँ।",
    icon: "🎵",
  },
  {
    id: "yoga-surya-namaskar",
    name: "Surya Namaskar (Sun Salutation)",
    nameHindi: "सूर्य नमस्कार",
    region: "All India",
    category: "art",
    description: "12-step yoga sequence performed at sunrise as a salutation to the sun god, combining breath, movement and meditation.",
    descriptionHindi: "सूर्योदय के समय सूर्य देव को नमस्कार के रूप में 12 चरणों का योग अनुक्रम — श्वास, गति और ध्यान का संयोजन।",
    howToTeach: "Teach each pose with its name (Pranamasana, Hasta Uttanasana, etc.) and which god it honours. Make it a daily morning routine.",
    howToTeachHindi: "प्रत्येक मुद्रा को उसके नाम (प्रणामासन, हस्त उत्तानासन आदि) और किस देव को समर्पित है, के साथ सिखाएँ। इसे दैनिक सुबह की दिनचर्या बनाएँ।",
    icon: "🌅",
  },
  {
    id: "tulsi-puja",
    name: "Tulsi Puja",
    nameHindi: "तुलसी पूजा",
    region: "All India",
    category: "festival",
    description: "Daily ritual of watering and worshipping the sacred Tulsi (holy basil) plant, considered an incarnation of Lakshmi.",
    descriptionHindi: "पवित्र तुलसी (तुलसी का पौधा) को पानी देने और पूजन करने की दैनिक परंपरा — लक्ष्मी का अवतार मानी जाती है।",
    howToTeach: "Grow a Tulsi plant together. Teach the simple Tulsi Aarti. Explain its medicinal properties (immunity booster, sacred plant).",
    howToTeachHindi: "साथ में तुलसी का पौधा लगाएँ। सरल तुलसी आरती सिखाएँ। इसके औषधीय गुण (रोग प्रतिरोधक, पवित्र पौधा) समझाएँ।",
    icon: "🌿",
  },
  {
    id: "bihu",
    name: "Bihu Festival (Assam)",
    nameHindi: "बिहू (असम)",
    region: "Assam, Northeast India",
    category: "festival",
    description: "Assam's most important festival celebrating the harvest, love and nature — three Bihus: Rongali (spring), Kongali (autumn), Bhogali (winter).",
    descriptionHindi: "असम का सबसे महत्वपूर्ण त्योहार — फसल, प्रेम और प्रकृति का उत्सव। तीन बिहू: रोंगाली (वसंत), कोंगाली (शरद), भोगाली (शीत)।",
    howToTeach: "Learn Bihu dance's basic 'dhemali' hand movement. Cook pitha (rice cake) together. Wear white-red Assamese gamocha (gamosa cloth).",
    howToTeachHindi: "बिहू नृत्य की मूल 'धेमाली' हस्त गति सीखें। साथ में पिठा (चावल केक) पकाएँ। सफेद-लाल असमी गमोसा पहनें।",
    icon: "🌾",
  },
];

export const MYTHOLOGY_CATEGORIES = [
  { id: "all", label: "सभी कथाएँ", labelEn: "All Stories" },
  { id: "ganesha", label: "गणेश", labelEn: "Ganesha", icon: "🐘" },
  { id: "krishna", label: "कृष्ण", labelEn: "Krishna", icon: "🦚" },
  { id: "hanuman", label: "हनुमान", labelEn: "Hanuman", icon: "🙏" },
  { id: "ramayana", label: "रामायण", labelEn: "Ramayana", icon: "🏹" },
  { id: "shiva", label: "शिव", labelEn: "Shiva", icon: "🔱" },
  { id: "panchatantra", label: "पंचतंत्र", labelEn: "Panchatantra", icon: "📖" },
];

export const TRADITION_CATEGORIES = [
  { id: "all", label: "सभी", labelEn: "All" },
  { id: "festival", label: "त्योहार", labelEn: "Festivals" },
  { id: "art", label: "कला", labelEn: "Arts & Crafts" },
  { id: "dance", label: "नृत्य", labelEn: "Dance" },
  { id: "music", label: "संगीत", labelEn: "Music" },
  { id: "game", label: "खेल", labelEn: "Traditional Games" },
];
