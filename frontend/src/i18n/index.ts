// YieldVision Central Internationalization (i18n) Architecture
// Farmer-First Localization across 12 Major Indian Regional Languages + English

import { en } from './translations/en';
import { hi } from './translations/hi';
import { mr } from './translations/mr';
import { gu } from './translations/gu';
import { pa } from './translations/pa';
import { bn } from './translations/bn';
import { ta } from './translations/ta';
import { te } from './translations/te';
import { kn } from './translations/kn';
import { ml } from './translations/ml';
import { or } from './translations/or';
import { as } from './translations/as';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'or'
  | 'as';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  displayText: string; // e.g. "हिन्दी — Hindi"
  region: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    displayText: 'English — Global / Pan-India',
    region: 'English (National & Global Research)',
    flag: '🌐'
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    displayText: 'हिन्दी — Hindi',
    region: 'उत्तर प्रदेश / बिहार / हरियाणा',
    flag: '🇮🇳'
  },
  {
    code: 'mr',
    label: 'Marathi',
    nativeLabel: 'मराठी',
    displayText: 'मराठी — Marathi',
    region: 'महाराष्ट्र (Maharashtra)',
    flag: '🚩'
  },
  {
    code: 'gu',
    label: 'Gujarati',
    nativeLabel: 'ગુજરાતી',
    displayText: 'ગુજરાતી — Gujarati',
    region: 'ગુજરાત (Gujarat)',
    flag: '🚜'
  },
  {
    code: 'pa',
    label: 'Punjabi',
    nativeLabel: 'ਪੰਜਾਬੀ',
    displayText: 'ਪੰਜਾਬੀ — Punjabi',
    region: 'ਪੰਜਾਬ / ਹਰਿਆਣਾ (Punjab & Haryana)',
    flag: '🌾'
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    displayText: 'বাংলা — Bengali',
    region: 'পশ্চিমবঙ্গ / পূর্বাঞ্চল',
    flag: '🍃'
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    displayText: 'தமிழ் — Tamil',
    region: 'தமிழ்நாடு (Tamil Nadu)',
    flag: '🌱'
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    displayText: 'తెలుగు — Telugu',
    region: 'ఆంధ్రప్రదేశ్ / తెలంగాణ',
    flag: '🌿'
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    displayText: 'ಕನ್ನಡ — Kannada',
    region: 'ಕರ್ನಾಟಕ (Karnataka)',
    flag: '🌾'
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    displayText: 'മലയാളം — Malayalam',
    region: 'കേരളം (Kerala)',
    flag: '🌴'
  },
  {
    code: 'or',
    label: 'Odia',
    nativeLabel: 'ଓଡ଼ିଆ',
    displayText: 'ଓଡ଼ିଆ — Odia',
    region: 'ଓଡ଼ିଶା (Odisha)',
    flag: '🌾'
  },
  {
    code: 'as',
    label: 'Assamese',
    nativeLabel: 'অসমীয়া',
    displayText: 'অসমীয়া — Assamese',
    region: 'অসম (Assam)',
    flag: '🍃'
  }
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  hi,
  mr,
  gu,
  pa,
  bn,
  ta,
  te,
  kn,
  ml,
  or,
  as
};

/**
 * State names localized across Indian languages for authentic regional display
 */
export const STATE_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Maharashtra': {
    en: 'Maharashtra',
    mr: 'महाराष्ट्र',
    hi: 'महाराष्ट्र',
    gu: 'મહારાષ્ટ્ર',
    pa: 'ਮਹਾਰਾਸ਼ਟਰ',
    bn: 'মহারাষ্ট্র',
    ta: 'மகாராஷ்டிரா',
    te: 'మహారాష్ట్ర',
    kn: 'ಮಹಾರಾಷ್ಟ್ರ',
    ml: 'മഹാരാഷ്ട്ര',
    or: 'ମହାରାଷ୍ଟ୍ର',
    as: 'মহাৰাষ্ট্ৰ'
  },
  'Uttar Pradesh': {
    en: 'Uttar Pradesh',
    mr: 'उत्तर प्रदेश',
    hi: 'उत्तर प्रदेश',
    gu: 'ઉત્તર પ્રદેશ',
    pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼',
    bn: 'উত্তর প্রদেশ',
    ta: 'உத்தரப் பிரதேசம்',
    te: 'ఉత్తర ప్రదేశ్',
    kn: 'ಉತ್ತರ ಪ್ರದೇಶ',
    ml: 'ഉത്തർപ്രദേശ്',
    or: 'ଉତ୍ତର ପ୍ରଦେଶ',
    as: 'উত্তৰ প্ৰদেশ'
  },
  'Karnataka': {
    en: 'Karnataka',
    mr: 'कर्नाटक',
    hi: 'कर्नाटक',
    gu: 'કર્ણાટક',
    pa: 'ਕਰਨਾਟਕ',
    bn: 'কর্ণাটক',
    ta: 'கர்நாடகா',
    te: 'కర్ణాటక',
    kn: 'ಕರ್ನಾಟಕ',
    ml: 'കർണാടക',
    or: 'କର୍ଣ୍ଣାଟକ',
    as: 'কৰ্ণাটক'
  },
  'Tamil Nadu': {
    en: 'Tamil Nadu',
    mr: 'तामिळनाडू',
    hi: 'तमिलनाडु',
    gu: 'તમિલનાડુ',
    pa: 'ਤਾਮਿਲਨਾਡੂ',
    bn: 'তামিলনাড়ু',
    ta: 'தமிழ்நாடு',
    te: 'తమిళనాడు',
    kn: 'ತಮಿಳುನಾಡು',
    ml: 'തമിഴ്നാട്',
    or: 'ତାମିଲନାଡୁ',
    as: 'তামিলনাডু'
  },
  'Gujarat': {
    en: 'Gujarat',
    mr: 'गुजरात',
    hi: 'गुजरात',
    gu: 'ગુજરાત',
    pa: 'ਗੁਜਰਾਤ',
    bn: 'গুজরাট',
    ta: 'குஜராத்',
    te: 'గుజరాత్',
    kn: 'ಗುಜರಾತ್',
    ml: 'ഗുജറാത്ത്',
    or: 'ଗୁଜରାଟ',
    as: 'গুজৰাট'
  },
  'Punjab': {
    en: 'Punjab',
    mr: 'पंजाब',
    hi: 'पंजाब',
    gu: 'પંજાબ',
    pa: 'ਪੰਜਾਬ',
    bn: 'পাঞ্জাব',
    ta: 'பஞ்சாப்',
    te: 'పంజాబ్',
    kn: 'ಪಂಜಾಬ್',
    ml: 'പഞ്ചാബ്',
    or: 'ପଞ୍ଜାବ',
    as: 'পঞ্জাৱ'
  },
  'Andhra Pradesh': {
    en: 'Andhra Pradesh',
    mr: 'आंध्र प्रदेश',
    hi: 'आंध्र प्रदेश',
    gu: 'આંધ્ર પ્રદેશ',
    pa: 'ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼',
    bn: 'অন্ধ্রপ্রদেশ',
    ta: 'ஆந்திரப் பிரதேசம்',
    te: 'ఆంధ్రప్రదేశ్',
    kn: 'ಆಂಧ್ರಪ್ರದೇಶ',
    ml: 'ആന്ധ്രാപ്രദേശ്',
    or: 'ଆନ୍ଧ୍ର ପ୍ରଦେଶ',
    as: 'অন্ধ্ৰ প্ৰদেশ'
  },
  'Bihar': {
    en: 'Bihar',
    mr: 'बिहार',
    hi: 'बिहार',
    gu: 'બિહાર',
    pa: 'ਬਿਹਾਰ',
    bn: 'বিহার',
    ta: 'பீகார்',
    te: 'బీహార్',
    kn: 'ಬಿಹಾರ',
    ml: 'ബിഹാർ',
    or: 'ବିହାର',
    as: 'বিহাৰ'
  },
  'Haryana': {
    en: 'Haryana',
    mr: 'हरियाणा',
    hi: 'हरियाणा',
    gu: 'હરિયાણા',
    pa: 'ਹਰਿਆਣਾ',
    bn: 'হরিয়ানা',
    ta: 'ஹரியானா',
    te: 'హర్యానా',
    kn: 'ಹರಿಯಾಣ',
    ml: 'ഹരിയാന',
    or: 'ହରିୟାଣା',
    as: 'হাৰিয়ানা'
  },
  'West Bengal': {
    en: 'West Bengal',
    mr: 'पश्चिम बंगाल',
    hi: 'पश्चिम बंगाल',
    gu: 'પશ્ચિમ બંગાળ',
    pa: 'ਪੱਛਮੀ ਬੰਗਾਲ',
    bn: 'পশ্চিমবঙ্গ',
    ta: 'மேற்கு வங்காளம்',
    te: 'పశ్ಚಿమ బెంగాల్',
    kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ',
    ml: 'പശ്ചിമ ബംഗാൾ',
    or: 'ପଶ୍ଚିମ ବଙ୍ଗ',
    as: 'পশ্চিমবংগ'
  },
  'Assam': {
    en: 'Assam',
    mr: 'असम',
    hi: 'असम',
    gu: 'આસામ',
    pa: 'ਅਸਾਮ',
    bn: 'আসাম',
    ta: 'அசாம்',
    te: 'అస్సాం',
    kn: 'ಅಸ್ಸಾಂ',
    ml: 'അസം',
    or: 'ଆସାମ',
    as: 'অসম'
  },
  'Odisha': {
    en: 'Odisha',
    mr: 'ओडिशा',
    hi: 'ओडिशा',
    gu: 'ઓડિશા',
    pa: 'ਓਡੀਸ਼ਾ',
    bn: 'ওড়িশা',
    ta: 'ஒடிசா',
    te: 'ఒడిశా',
    kn: 'ಒಡಿಶಾ',
    ml: 'ഒഡീഷ',
    or: 'ଓଡ଼ିଶା',
    as: 'ওড়িশା'
  },
  'Kerala': {
    en: 'Kerala',
    mr: 'केरळ',
    hi: 'केरल',
    gu: 'કેરળ',
    pa: 'ਕੇਰਲ',
    bn: 'কেরল',
    ta: 'கேரளா',
    te: 'కేరళ',
    kn: 'ಕೇರಳ',
    ml: 'കേരളം',
    or: 'କେରଳ',
    as: 'কেৰালা'
  }
};

/**
 * Gets localized Indian State name
 */
export function getLocalizedState(stateName: string, lang: LanguageCode = 'mr'): string {
  if (STATE_TRANSLATIONS[stateName] && STATE_TRANSLATIONS[stateName][lang]) {
    return STATE_TRANSLATIONS[stateName][lang]!;
  }
  return stateName;
}

/**
 * Translates a key according to the selected language code.
 * Falls back to English, then Marathi, then the raw key.
 * Supports template parameter replacement e.g. {yield}
 */
export function t(key: string, lang: LanguageCode = 'mr', params?: Record<string, string | number>): string {
  const langDict = translations[lang] || translations['mr'] || translations['en'];
  let text = langDict?.[key] || translations['en']?.[key] || translations['mr']?.[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }

  return text;
}

/**
 * Text-to-Speech function for Indian Farmer Voice Guidance.
 * Speaks the text using browser's native SpeechSynthesis in local Indian accent.
 */
export function speakFarmerGuidance(text: string, lang: LanguageCode = 'mr'): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);

    // Select appropriate BCP-47 language tag for Indian regional accents
    const langMap: Record<LanguageCode, string> = {
      mr: 'mr-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
      as: 'as-IN',
      en: 'en-IN'
    };

    utterance.lang = langMap[lang] || 'hi-IN';
    utterance.rate = 0.92; // Measured cadence for easy comprehension by farmers
    utterance.pitch = 1.0;

    // Search for matching regional Indian voice if available in the client browser
    const voices = window.speechSynthesis.getVoices();
    const prefix = utterance.lang.substring(0, 2);
    const matchedVoice = voices.find(
      v => v.lang.toLowerCase().startsWith(prefix) || v.lang.includes('IN')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.error('Error in speakFarmerGuidance:', e);
    return false;
  }
}

export function stopFarmerGuidance(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
