/**
 * Central Indian Language Registry & Capabilities Model
 * HRKVoice Single Source of Truth for Multilingual Speech & Text
 */

import { SpeechProviderType } from './types';

export interface LanguageDefinition {
  code: string;
  displayName: string;
  nativeName: string;
  script: string;
  scriptCode: string; // ISO 15924
  locales: string[];
  speechProviderCodes: {
    openai?: string;
    groq?: string;
    deepgram?: string;
    google?: string;
    mock?: string;
  };
  supportsSpeechRecognition: boolean;
  supportsTextProcessing: boolean;
  supportsTranslation: boolean;
  supportsCodeSwitching: boolean;
  status: 'fully-supported' | 'partially-supported' | 'provider-dependent';
  samplePhrases: {
    greeting: string;
    business: string;
    tech: string;
    numbers: string;
    codeSwitching?: string;
  };
}

export const INDIAN_LANGUAGE_REGISTRY: Record<string, LanguageDefinition> = {
  en: {
    code: 'en',
    displayName: 'English',
    nativeName: 'English',
    script: 'Latin',
    scriptCode: 'Latn',
    locales: ['en-IN', 'en-US', 'en-GB'],
    speechProviderCodes: {
      openai: 'en',
      groq: 'en',
      deepgram: 'en',
      google: 'en-IN',
      mock: 'en'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'Good morning everyone, welcome to today\'s standup.',
      business: 'Please send Rahul the quarterly invoice before five o\'clock.',
      tech: 'The React component re-renders when the state changes.',
      numbers: 'We finalized 45 units at 1,250 rupees each.',
      codeSwitching: 'Kal client ko presentation send karna hai.'
    }
  },
  hi: {
    code: 'hi',
    displayName: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['hi-IN'],
    speechProviderCodes: {
      openai: 'hi',
      groq: 'hi',
      deepgram: 'hi',
      google: 'hi-IN',
      mock: 'hi'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'नमस्ते, आप सब कैसे हैं?',
      business: 'कृपया राहुल को कल सुबह तक कोटेशन भेज दीजिए।',
      tech: 'हमारा API सर्वर अब Node.js पर सफलतापूर्वक चल रहा है।',
      numbers: 'कुल 150 ऑर्डर्स कल शाम तक डिलीवर करने हैं।',
      codeSwitching: 'Bhai kal client ko website ka demo send kar dena.'
    }
  },
  gu: {
    code: 'gu',
    displayName: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    scriptCode: 'Gujr',
    locales: ['gu-IN'],
    speechProviderCodes: {
      openai: 'gu',
      groq: 'gu',
      deepgram: 'gu',
      google: 'gu-IN',
      mock: 'gu'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'નમસ્તે, કેમ છો બધા?',
      business: 'કાલે ક્લાયન્ટને ફોન કરીને નવી દરખાસ્ત મોકલવાની છે.',
      tech: 'નવા ફીચર માટે React અને TypeScript નો ઉપયોગ કરવામાં આવ્યો છે.',
      numbers: 'અમારી પાસે 250 થી વધુ સક્રિય વપરાશકર્તાઓ છે.',
      codeSwitching: 'કાલે website નું deployment કરવાનું છે.'
    }
  },
  bn: {
    code: 'bn',
    displayName: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    scriptCode: 'Beng',
    locales: ['bn-IN', 'bn-BD'],
    speechProviderCodes: {
      openai: 'bn',
      groq: 'bn',
      deepgram: 'bn',
      google: 'bn-IN',
      mock: 'bn'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'নমস্কার, আপনারা কেমন আছেন?',
      business: 'আগামীকাল বিকালের মধ্যে ক্লায়েন্টকে ইনভয়েসটি পাঠিয়ে দেবেন।',
      tech: 'নতুন ইউজার ইন্টারফেসে Tailwind CSS ব্যবহার করা হয়েছে।',
      numbers: 'মোট ৫০০ টি অর্ডারের ডেলিভারি সম্পন্ন হয়েছে।',
      codeSwitching: 'কালকে website deploy করতে হবে।'
    }
  },
  mr: {
    code: 'mr',
    displayName: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['mr-IN'],
    speechProviderCodes: {
      openai: 'mr',
      groq: 'mr',
      deepgram: 'mr',
      google: 'mr-IN',
      mock: 'mr'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'नमस्कार, तुम्ही कसे आहात?',
      business: 'कृपया उद्या सकाळपर्यंत राहुलला नवीन कोटेशन पाठवा.',
      tech: 'आमचा डेटाबेस PostgreSQL वर उत्तम गतीने चालत आहे.',
      numbers: 'गेल्या महिन्यात 1,200 नवीन सदस्य जोडले गेले.',
      codeSwitching: 'उद्या team meeting मध्ये नवीन project चा demo द्यायचा आहे.'
    }
  },
  ta: {
    code: 'ta',
    displayName: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    scriptCode: 'Taml',
    locales: ['ta-IN', 'ta-LK'],
    speechProviderCodes: {
      openai: 'ta',
      groq: 'ta',
      deepgram: 'ta',
      google: 'ta-IN',
      mock: 'ta'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'வணக்கம், அனைவரும் நலமா?',
      business: 'நாளை காலைக்குள் கிளையண்டிற்கு இன்வாய்ஸ் அனுப்பவும்.',
      tech: 'இந்த செயலியை React மற்றும் Node.js கொண்டு உருவாக்கியுள்ளோம்.',
      numbers: 'மொத்தம் 350 தயாரிப்புகள் அனுப்பப்பட்டுள்ளன.',
      codeSwitching: 'நாளைக்கு client project demo ready பண்ணனும்.'
    }
  },
  te: {
    code: 'te',
    displayName: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    scriptCode: 'Telu',
    locales: ['te-IN'],
    speechProviderCodes: {
      openai: 'te',
      groq: 'te',
      deepgram: 'te',
      google: 'te-IN',
      mock: 'te'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'నమస్కారం, అందరూ ఎలా ఉన్నారు?',
      business: 'రేపు ఉదయానికల్లా క్లయింట్‌కు కొటేషన్ పంపండి.',
      tech: 'మా క్లౌడ్ సర్వర్‌లో API పనితీరు చాలా వేగంగా ఉంది.',
      numbers: 'ఈ నెలలో 450 కొత్త రిజిస్ట్రేషన్లు నమోదయ్యాయి.',
      codeSwitching: 'రేపు client కి new feature demo ఇవ్వాలి.'
    }
  },
  kn: {
    code: 'kn',
    displayName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    scriptCode: 'Knda',
    locales: ['kn-IN'],
    speechProviderCodes: {
      openai: 'kn',
      groq: 'kn',
      deepgram: 'kn',
      google: 'kn-IN',
      mock: 'kn'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'ನಮಸ್ಕಾರ, ಎಲ್ಲರೂ ಹೇಗಿದ್ದೀರಿ?',
      business: 'ದಯವಿಟ್ಟು ನಾಳೆ ಸಂಜೆಯೊಳಗೆ ಕ್ಲೈಂಟ್‌ಗೆ ಬಿಲ್ ಕಳುಹಿಸಿ.',
      tech: 'ವೆಬ್‌ಸೈಟ್ ವಿನ್ಯಾಸಕ್ಕಾಗಿ ನಾವು ఆధునిక ತಂತ್ರಜ್ಞಾನ ಬಳಸುತ್ತಿದ್ದೇವೆ.',
      numbers: 'ಈ ವಾರದಲ್ಲಿ 120 ಹೊಸ ಆರ್ಡರ್‌ಗಳು ಬಂದಿವೆ.',
      codeSwitching: 'ನಾಳೆ client ಜೊತೆ meeting schedule ಮಾಡಿ.'
    }
  },
  ml: {
    code: 'ml',
    displayName: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    scriptCode: 'Mlym',
    locales: ['ml-IN'],
    speechProviderCodes: {
      openai: 'ml',
      groq: 'ml',
      deepgram: 'ml',
      google: 'ml-IN',
      mock: 'ml'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'നമസ്കാരം, എല്ലാവർക്കും സുഖമാണോ?',
      business: 'ദയവായി നാളെ രാവിലെയോടെ പുതിയ ഇൻവോയ്സ് അയക്കുക.',
      tech: 'ഞങ്ങളുടെ മൊബൈൽ ആപ്പ് React Native ഉപയോഗിച്ചാണ് നിർമ്മിച്ചിരിക്കുന്നത്.',
      numbers: 'ഇതുവരെ 2,500 പേർ രജിസ്റ്റർ ചെയ്തു കഴിഞ്ഞു.',
      codeSwitching: 'നാളെ client project review ചെയ്യാൻ call ചെയ്യണം.'
    }
  },
  pa: {
    code: 'pa',
    displayName: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    scriptCode: 'Guru',
    locales: ['pa-IN'],
    speechProviderCodes: {
      openai: 'pa',
      groq: 'pa',
      deepgram: 'pa',
      google: 'pa-IN',
      mock: 'pa'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ?',
      business: 'ਕਿਰਪਾ ਕਰਕੇ ਕੱਲ੍ਹ ਸਵੇਰੇ ਗਾਹਕ ਨੂੰ ਪ੍ਰਪੋਜ਼ਲ ਭੇਜ ਦਿਓ।',
      tech: 'ਸਾਫਟਵੇਅਰ ਵਿੱਚ ਨਵਾਂ ਡੈਸ਼ਬੋਰਡ ਸ਼ਾਮਲ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।',
      numbers: 'ਇਸ ਮਹੀਨੇ 85 ਨਵੇਂ ਸੌਦੇ ਪੂਰੇ ਹੋਏ।',
      codeSwitching: 'ਕੱਲ੍ਹ client ਨੂੰ application ਦਾ demo ਦਿਖਾਉਣਾ ਹੈ।'
    }
  },
  or: {
    code: 'or',
    displayName: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    scriptCode: 'Orya',
    locales: ['or-IN'],
    speechProviderCodes: {
      openai: 'or',
      groq: 'or',
      google: 'or-IN',
      mock: 'or'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'ନମସ୍କାର, ଆପଣ କେମିତି ଅଛନ୍ତି?',
      business: 'ଦୟାକରି ଆସନ୍ତାକାଲି ସୁଦ୍ଧା ଗ୍ରାହକଙ୍କୁ ବିଲ୍ ପଠାନ୍ତୁ।',
      tech: 'ଆମ ୱେବସାଇଟ୍ ସର୍ଭର ବହୁତ ଦ୍ରୁତ ଗତିରେ କାମ କରୁଛି।',
      numbers: 'ଆଜି 75 ଟି ନୂଆ ଅର୍ଡର ମିଳିଛି।',
      codeSwitching: 'କାଲି client ସହିତ project proposal discuss କରିବା।'
    }
  },
  as: {
    code: 'as',
    displayName: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    scriptCode: 'Beng',
    locales: ['as-IN'],
    speechProviderCodes: {
      openai: 'as',
      groq: 'as',
      google: 'as-IN',
      mock: 'as'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'নমস্কাৰ, আপোনালোক কেনে আছে?',
      business: 'অনুগ্ৰহ কৰি কাইলৈ পুৱালৈকে ক্লায়েণ্টক নথি-পত্ৰ প্ৰেৰণ কৰক।',
      tech: 'নতুন ছফ্টৱেৰ আপডেটটোত কেইবাটাও নতুন সুবিধা যোগ কৰা হৈছে।',
      numbers: 'মুঠ ৬০ জন গ্ৰাহকে পঞ্জীয়ন সম্পূৰ্ণ কৰিছে।',
      codeSwitching: 'কাইলৈ client ক website update ৰ বিষয়ে জনাব লাগিব।'
    }
  },
  ur: {
    code: 'ur',
    displayName: 'Urdu',
    nativeName: 'اردو',
    script: 'Arabic-Persian',
    scriptCode: 'Arab',
    locales: ['ur-IN', 'ur-PK'],
    speechProviderCodes: {
      openai: 'ur',
      groq: 'ur',
      deepgram: 'ur',
      google: 'ur-IN',
      mock: 'ur'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'السلام علیکم، آپ سب کیسے ہیں؟',
      business: 'براہ کرم کل صبح تک کلائنٹ کو نیا کوٹیشن بھیج دیں۔',
      tech: 'ہمارا ڈیٹا بیس کلاؤڈ پر محفوظ طریقے سے کام کر رہا ہے۔',
      numbers: 'اس ماہ کل 320 آرڈرز موصول ہوئے۔',
      codeSwitching: 'کل کلائنٹ کو پروجیکٹ کی پروگریس رپورٹ ای میل کرنی ہے۔'
    }
  },
  sa: {
    code: 'sa',
    displayName: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['sa-IN'],
    speechProviderCodes: {
      openai: 'sa',
      google: 'sa-IN',
      mock: 'sa'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: false,
    status: 'partially-supported',
    samplePhrases: {
      greeting: 'नमो नमः, भवन्तः कथम् सन्ति?',
      business: 'कृपया श्वः प्रातःकाले कार्यविवरणं प्रेषयन्तु।',
      tech: 'एतत् सङ्गणक-तन्त्रं सुचारुरूपेण कार्यं करोति।',
      numbers: 'अत्र पञ्चाशत् (५०) छात्राः उपस्थिताः सन्ति।'
    }
  },
  ne: {
    code: 'ne',
    displayName: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['ne-IN', 'ne-NP'],
    speechProviderCodes: {
      openai: 'ne',
      groq: 'ne',
      google: 'ne-NP',
      mock: 'ne'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'fully-supported',
    samplePhrases: {
      greeting: 'नमस्ते, तपाईँलाई कस्तो छ?',
      business: 'कृपया भोलि बिहानसम्म ग्राहकलाई नयाँ प्रस्ताव पठाउनुहोस्।',
      tech: 'हाम्रो एप प्रयोगकर्ता-मैत्री बनाउन नयाँ डिजाइन प्रयोग गरिएको छ।',
      numbers: 'आज ४० जना नयाँ प्रयोगकर्ताहरू थपिएका छन्।',
      codeSwitching: 'भोलि client लाई project demo देखाउनुपर्छ।'
    }
  },
  kok: {
    code: 'kok',
    displayName: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['kok-IN'],
    speechProviderCodes: {
      openai: 'kok',
      google: 'kok-IN',
      mock: 'kok'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'नमस्कार, तुमी कशे आसात?',
      business: 'उपकार करून फाल्यां सकाळ मेरेन ग्राहकक कोटेशन धाडा.',
      tech: 'आमच्या तंत्रज्ञानाक लागून काम बेगीन जाता.',
      numbers: 'आयज ३५ नव्या ग्राहकांनी संपर्क केलो.',
      codeSwitching: 'फाल्यां client कडेन project विषयान चर्चा करुया.'
    }
  },
  mai: {
    code: 'mai',
    displayName: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['mai-IN'],
    speechProviderCodes: {
      openai: 'mai',
      google: 'mai-IN',
      mock: 'mai'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'प्रणाम, अपने सबहक की हाल अछि?',
      business: 'कृपा क\' काल्हि भोर धरि ग्राहककेँ कोटेशन पठाउ।',
      tech: 'नवीन प्रविधि सँ हमर सबहक काज सरल भ\' गेल अछि।',
      numbers: 'एहि मास मे १०० सँ बेसी आवेदन आएल अछि।'
    }
  },
  doi: {
    code: 'doi',
    displayName: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['doi-IN'],
    speechProviderCodes: {
      google: 'doi-IN',
      mock: 'doi'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'नमस्ते, तुंदा केह् हाल ऐ?',
      business: 'कृपया कल तगर ग्राहक गी बिल भेजी देओ।',
      tech: 'कम्प्यूटर दे जरिए साढ़ा कम्म बड़ा आसान होई गेदा ऐ।',
      numbers: 'अज्ज २० नौंए लोकें ने रजिस्ट्रेशन कीता।'
    }
  },
  ks: {
    code: 'ks',
    displayName: 'Kashmiri',
    nativeName: 'کٲشُر / कश्मीरी',
    script: 'Perso-Arabic / Devanagari',
    scriptCode: 'Arab',
    locales: ['ks-IN'],
    speechProviderCodes: {
      google: 'ks-IN',
      mock: 'ks'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'سلام، توہہِ چھِوا ٹھیک؟',
      business: 'مہربٲنی کٔرِتھ سوزِو کلہ پگاہ تام بل۔',
      tech: 'نئے سافٹ ویئر سٟتؠ گژھِ کامہِ مَنٛز آسٲنی۔',
      numbers: 'از آیہِ ۱۵ نٔو آرڈر।'
    }
  },
  sd: {
    code: 'sd',
    displayName: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    script: 'Perso-Arabic / Devanagari',
    scriptCode: 'Arab',
    locales: ['sd-IN'],
    speechProviderCodes: {
      openai: 'sd',
      google: 'sd-IN',
      mock: 'sd'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'سلام، توهان ڪيئن آهيو؟',
      business: 'مهرباني ڪري سڀاڻي صبح جو ڪلائنٽ کي بل موڪليو.',
      tech: 'اسان جي سسٽم ۾ نئون سافٽ ويئر اپڊيٽ شامل ڪيو ويو آهي.',
      numbers: 'هن هفتي 25 نوان گراهڪ شامل ٿيا.'
    }
  },
  mni: {
    code: 'mni',
    displayName: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ',
    script: 'Meetei Mayek / Bengali',
    scriptCode: 'Mtei',
    locales: ['mni-IN'],
    speechProviderCodes: {
      google: 'mni-IN',
      mock: 'mni'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'ꯈꯨꯔꯨꯝꯖꯔꯤ, ꯅꯍꯥꯛ ꯀꯝꯗꯧꯔꯤ?',
      business: 'ꯍꯌꯦꯡ ꯑꯌꯨꯛꯇꯥ ꯀ꯭ꯂꯥꯌꯟꯇꯇꯥ ꯗꯣꯀ꯭ꯌꯨꯃꯦꯟꯇ ꯊꯥꯕꯤꯌꯨ꯫',
      tech: 'ꯅꯧꯕꯥ ꯑꯦꯄꯂꯤꯀꯦꯁꯟ ꯑꯁꯤꯅꯥ ꯊꯕꯛ ꯌꯥꯝꯅꯥ ꯂꯥꯏꯍꯜꯂꯦ꯫',
      numbers: 'ꯉꯁꯤ ꯑꯅꯧꯕꯥ ꯌꯨꯖꯔ ꯱꯰ ꯍꯥꯄꯆꯤꯜꯂꯦ꯫'
    }
  },
  brx: {
    code: 'brx',
    displayName: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    scriptCode: 'Deva',
    locales: ['brx-IN'],
    speechProviderCodes: {
      google: 'brx-IN',
      mock: 'brx'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'खुबुलिया, नोंथाङा माबोरै दं?',
      business: 'अननानै गाबोन फुंआव खास्टमरनो बिलखौ हरदो।',
      tech: 'गोदान कम्प्युटार प्रणालिया जोंनि खामानिखौ गोरलै खालामबाय।',
      numbers: 'दिनै 18 गोदान सोद्रोमाफोर हाबबाय।'
    }
  },
  sat: {
    code: 'sat',
    displayName: 'Santali',
    nativeName: 'संताली / ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki / Devanagari',
    scriptCode: 'Olck',
    locales: ['sat-IN'],
    speechProviderCodes: {
      google: 'sat-IN',
      mock: 'sat'
    },
    supportsSpeechRecognition: true,
    supportsTextProcessing: true,
    supportsTranslation: true,
    supportsCodeSwitching: true,
    status: 'provider-dependent',
    samplePhrases: {
      greeting: 'ᱡᱚᱦᱟᱨ, ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?',
      business: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱜᱟᱯᱟ ᱥᱮᱛᱟᱜ ᱠᱞᱟᱭᱮᱱᱴ ᱴᱷᱮᱱ ᱠᱟᱜᱚᱡᱽ ᱵᱷᱮᱡᱟᱭ ᱢᱮ ᱾',
      tech: 'ᱱᱟᱣᱟ ቴክᱱᱚᱞᱚᱡᱤ ᱛᱮ ᱟᱵᱚᱣᱟᱜ ᱠᱟᱹᱢᱤ ᱟᱞᱜᱟ ᱮᱱᱟ ᱾',
      numbers: 'ᱛᱮᱦᱮᱧ ᱒᱒ ᱦᱚᱲ ᱱᱟᱣᱟ ᱠᱟᱹᱢᱤ ᱨᱮ ᱠᱚ ᱥᱮᱞᱮᱫ ᱮᱱᱟ ᱾'
    }
  }
};

/**
 * Helper Utilities for Central Language Registry
 */
export function getAllLanguages(): LanguageDefinition[] {
  return Object.values(INDIAN_LANGUAGE_REGISTRY);
}

export function getLanguageByCode(code: string): LanguageDefinition | undefined {
  if (!code || code === 'auto') return undefined;
  return INDIAN_LANGUAGE_REGISTRY[code.toLowerCase()];
}

export function getLanguageSupportForProvider(
  languageCode: string,
  provider: SpeechProviderType
): { supported: boolean; providerCode?: string; status: string } {
  const lang = getLanguageByCode(languageCode);
  if (!lang) {
    return { supported: false, status: 'unavailable' };
  }

  const pCode = lang.speechProviderCodes[provider as keyof typeof lang.speechProviderCodes];
  if (pCode) {
    return {
      supported: true,
      providerCode: pCode,
      status: lang.status === 'fully-supported' ? 'Supported' : 'Partially supported'
    };
  }

  return {
    supported: false,
    status: 'Provider-dependent / Unavailable'
  };
}

export function getSamplePhrase(
  languageCode: string,
  type: 'greeting' | 'business' | 'tech' | 'numbers' | 'codeSwitching' = 'business'
): string {
  const lang = getLanguageByCode(languageCode) || INDIAN_LANGUAGE_REGISTRY['en'];
  return lang.samplePhrases[type] || lang.samplePhrases.business || lang.samplePhrases.greeting;
}
