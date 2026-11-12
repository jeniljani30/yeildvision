import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { 
  Sparkles, 
  X, 
  ArrowUp, 
  ChevronRight, 
  RotateCcw,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { speakFarmerGuidance, stopFarmerGuidance } from '../../i18n';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  actions?: Array<{ label: string; page: string }>;
}

export const YieldAI: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    crop, 
    location, 
    district, 
    season, 
    currentPrediction,
    language,
    farmerMode,
    t
  } = useApp();

  // Strict Dashboard-only guard: Never render on any other page
  if (currentPage !== 'dashboard') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const getGreeting = (): string => {
    switch (language) {
      case 'mr':
        return `नमस्कार शेतकरी मित्रांनो! मी यील्डएआय (YieldAI) आहे.\n\nतुमच्या सध्याच्या ${location} (${district || 'कोल्हापूर'}) मधील डेटानुसार उसाचे अंदाजे उत्पादन ${currentPrediction.predicted_yield} टन प्रति हेक्टर आहे. मी तुम्हाला खतांचे योग्य प्रमाण, पाणी नियोजन आणि हवामान धोक्यांविषयी मार्गदर्शन करू शकतो.`;
      case 'hi':
        return `नमस्ते किसान भाइयों! मैं यील्डएआई (YieldAI) हूँ।\n\nआपके वर्तमान ${location} (${district || 'मुजफ्फरनगर'}) डेटा के अनुसार गन्ने की अनुमानित पैदावार ${currentPrediction.predicted_yield} टन प्रति हेक्टेयर है। मैं आपको खाद की मात्रा, सिंचाई और मौसम की सलाह देने के लिए तैयार हूँ।`;
      case 'gu':
        return `નમસ્તે ખેડૂત મિત્રો! હું YieldAI છું.\n\nતમારા ${location} વિસ્તારના ડેટા અનુસાર શેરડીનું અંદાજિત ઉત્પાદન ${currentPrediction.predicted_yield} ટન પ્રતિ હેક્ટર છે. હું તમને ખાતર, પાણી અને હવામાન અંગે મદદ કરી શકું છું.`;
      case 'pa':
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ YieldAI ਹਾਂ।\n\nਤੁਹਾਡੇ ${location} ਡੇਟਾ ਅਨੁਸਾਰ ਗੰਨੇ ਦਾ ਸੰਭਾਵੀ ਝਾੜ ${currentPrediction.predicted_yield} ਟਨ ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਹੈ। ਮੈਂ ਤੁਹਾਨੂੰ ਖਾਦਾਂ, ਪਾਣੀ ਅਤੇ ਮੌਸਮ ਬਾਰੇ ਸਲਾਹ ਦੇ ਸਕਦਾ ਹਾਂ।`;
      case 'bn':
        return `নমস্কার কৃষক ভাই ও বোনেরা! আমি YieldAI.\n\nআপনার ${location} খামারের তথ্য অনুসারে আখের আনুমানিক ফলন ${currentPrediction.predicted_yield} টন প্রতি হেক্টর। আমি আপনাকে সার, সেচ ও আবহাওয়া সংক্রান্ত পরামর্শে সাহায্য করতে পারি।`;
      case 'ta':
        return `வணக்கம் விவசாய நண்பர்களே! நான் YieldAI.\n\nஉங்கள் ${location} பண்ணைத் தரவுகளின்படி கரும்பு உத்தேச விளைச்சல் ஹெக்டேருக்கு ${currentPrediction.predicted_yield} டன்கள் ஆகும். உரம், பாசனம் மற்றும் வானிலை குறித்த கேள்விகளைக் கேட்கலாம்.`;
      case 'te':
        return `నమస్కారం రైతు సోదరులారా! నేను YieldAI.\n\nమీ ${location} పొలం డేటా ప్రకారం చెరకు అంచనా దిగుబడి హెక్టారుకు ${currentPrediction.predicted_yield} టన్నులు. ఎరువులు, నీటి తడులు మరియు వాతావరణంపై ప్రశ్నలు అడగవచ్చు.`;
      case 'kn':
        return `ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು YieldAI.\n\nನಿಮ್ಮ ${location} ಜಮೀನಿನ ಡೇಟಾದ ಪ್ರಕಾರ ಕಬ್ಬಿನ ಅಂದಾಜು ಇಳುವರಿ ಹೆಕ್ಟೇರ್‌ಗೆ ${currentPrediction.predicted_yield} ಟನ್ ಆಗಿದೆ. ರಸಗೊಬ್ಬರ, ನೀರಾವರಿ ಮತ್ತು ಹವಾಮಾನ ಸಲಹೆಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.`;
      case 'ml':
        return `നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ! ഞാൻ YieldAI.\n\nനിങ്ങളുടെ ${location} ഡാറ്റ അനുസരിച്ച് കരിമ്പിന്റെ പ്രതീക്ഷിക്കുന്ന വിളവ് ഹെക്ടറിന് ${currentPrediction.predicted_yield} ടൺ ആണ്. വളപ്രയോഗം, നനയ്ക്കൽ, കാലാവസ്ഥ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.`;
      case 'or':
        return `ନମସ୍କାର ଚାଷୀ ଭାଇମାନେ! ମୁଁ YieldAI.\n\nଆପଣଙ୍କ ${location} ତଥ୍ୟ ଅନୁସାରେ ଆଖୁର ସମ୍ଭାବ୍ୟ ଅମଳ ହେକ୍ଟର ପିଛା ${currentPrediction.predicted_yield} ଟନ୍ ଅଟେ। ଖତ, ଜଳସେଚନ ଓ ପାଣିପାଗ ବିଷୟରେ ପଚାରନ୍ତୁ।`;
      case 'as':
        return `নমস্কাৰ খেতিয়ক ভাইসকল! মই YieldAI.\n\nআপোনাৰ ${location} খেতিৰ তথ্য অনুসৰি কুঁহিয়াৰৰ সম্ভাৱ্য উৎপাদন প্ৰতি হেক্টৰত ${currentPrediction.predicted_yield} টন। সাৰ, জলসিঞ্চন আৰু বতৰৰ বিষয়ে মোক সুধিব পাৰে।`;
      case 'en':
      default:
        return `Hello! I'm YieldAI, your sugarcane intelligence assistant.\n\nBased on your current ${location} (${district || 'Kolhapur'}) farm data, your predicted yield is ${currentPrediction.predicted_yield} tonnes / hectare (${currentPrediction.confidence}% confidence). How can I assist you today?`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: getGreeting(),
      timestamp: new Date()
    }
  ]);

  // Update greeting when language or prediction changes
  useEffect(() => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: getGreeting(),
        timestamp: new Date()
      }
    ]);
  }, [language, currentPrediction.predicted_yield, location]);

  // Quick Action suggestion chips tailored in the farmer's regional language
  const getQuickActions = (): string[] => {
    switch (language) {
      case 'mr':
        return [
          'माझा ऊस उत्पादन अंदाज समजावून सांगा',
          'खतांचे योग्य प्रमाण (पोती) काय द्यावे?',
          'हवामान व पावसाचा काय धोका आहे?',
          'उसाची जाडी व वजन कसे वाढवावे?',
          'खोडकीड नियंत्रण कसे करावे?',
          'पाण्याचे नियोजन कसे करावे?'
        ];
      case 'hi':
        return [
          'गन्ना पैदावार का अनुमान समझाएं',
          'खाद की सही मात्रा (बोरी) क्या डालें?',
          'मौसम और बारिश का क्या असर है?',
          'गन्ने का वजन और मोटाई कैसे बढ़ाएं?',
          'कंसुआ कीट की रोकथाम कैसे करें?',
          'सिंचाई का सही समय क्या है?'
        ];
      case 'gu':
        return [
          'શેરડી ઉત્પાદન અંદાજ સમજાવો',
          'ખાતરની થેલીઓનું યોગ્ય પ્રમાણ',
          'હવામાન અને વરસાદનું જોખમ શું છે?',
          'શેરડીનું વજન અને જાડાઈ કેવી રીતે વધારવી?'
        ];
      case 'pa':
        return [
          'ਮੇਰੇ ਗੰਨੇ ਦਾ ਝਾੜ ਅਨੁਮਾਨ ਸਮਝਾਓ',
          'ਖਾਦ ਦੇ ਗੱਟਿਆਂ ਦੀ ਸਹੀ ਮਾਤਰਾ',
          'ਮੌਸਮ ਦਾ ਕੀ ਖ਼ਤਰਾ ਹੈ?',
          'ਗੰਨੇ ਦੀ ਮੋਟਾਈ ਤੇ ਵਜ਼ਨ ਕਿਵੇਂ ਵਧਾਈਏ?'
        ];
      case 'bn':
        return [
          'আখের ফলন পূর্বাভাস বুঝিয়ে বলুন',
          'সারের বস্তার পরিমাণ কত দেব?',
          'আবহাওয়ার ঝুঁকি কী আছে?',
          'আখের ওজন ও মিষ্টতা বৃদ্ধির উপায়'
        ];
      case 'ta':
        return [
          'கரும்பு விளைச்சல் கணிப்பை விளக்குங்கள்',
          'உர அளவு (மூட்டைகளில்) பரிந்துரை',
          'வானிலை ஆபத்து என்ன?',
          'கரும்பு எடையை அதிகரிப்பது எப்படி?'
        ];
      case 'te':
        return [
          'నా చెరకు దిగుబడి అంచనాను వివరించండి',
          'ఎరువుల మోతాదు (బస్తాల్లో) చెప్పండి',
          'వాతావరణ ప్రభావం ఏమిటి?',
          'చెరకు బరువును ఎలా పెంచాలి?'
        ];
      case 'kn':
        return [
          'ನನ್ನ ಕಬ್ಬಿನ ಇಳುವರಿ ಅಂದಾಜನ್ನು ವಿವರಿಸಿ',
          'ರಸಗொಬ್ಬರ ಪ್ರಮಾಣ ತಿಳಿಸಿ (ಚೀಲಗಳು)',
          'ಹವಾಮಾನ ಅಪಾಯವೇನು?',
          'ಕಬ್ಬಿನ ದಪ್ಪ ಮತ್ತು ತೂಕ ಹೆಚ್ಚಿಸುವುದು ಹೇಗೆ?'
        ];
      case 'ml':
        return [
          'കരിമ്പ് വിളവ് പ്രവചനം വിശദീകരിക്കുക',
          'ചാക്ക് കണക്കിൽ വളപ്രയോഗം എത്ര?',
          'കാലാവസ്ഥാ സാധ്യതകൾ എന്തൊക്കെ?',
          'കരിമ്പിന്റെ തൂക്കവും കട്ടിയും കൂട്ടാൻ എന്തുചെയ്യണം?'
        ];
      case 'or':
        return [
          'ମୋର ଆଖୁ ଅମଳ ଆକଳନ ବୁଝାଇ ଦିଅନ୍ତୁ',
          'ଖତ ବସ୍ତା ପରିମାଣ କେତେ ଦେବି?',
          'ପାଣିପାଗର କି ପ୍ରଭାବ ପଡ଼ିବ?',
          'ଆଖୁର ମୋଟା ଓ ଓଜନ କିପରି ବଢ଼ାଇବି?'
        ];
      case 'as':
        return [
          'কুঁহিয়াৰ উৎপাদন অনুমান বুজাই দিয়ক',
          'সাৰৰ বস্তাৰ হিচাপ কিমান?',
          'বতৰৰ কিবা বিপদাশংকা আছে নেকি?',
          'কুঁহিয়াৰৰ ওজন কেনেকৈ বঢ়াম?'
        ];
      case 'en':
      default:
        return [
          'Explain my yield prediction',
          'Recommended fertilizer in 50kg bags',
          'Check weather & monsoon risk',
          'How can I increase cane weight?',
          'Early shoot borer prevention',
          'Irrigation schedule'
        ];
    }
  };

  // Generate localized fallback answer if backend is unavailable
  const generateRegionalFallback = (query: string, ctx: any): string => {
    const qLower = query.toLowerCase();
    const yieldVal = ctx.prediction || '7.82';
    const loc = ctx.state || 'Maharashtra';
    const dist = ctx.district || 'Kolhapur';

    // Cotton check
    if (qLower.includes('cotton') || qLower.includes('कापूस') || qLower.includes('कपास')) {
      switch (language) {
        case 'mr':
          return "यील्डव्हिजन हे फक्त भारतीय ऊस शेतीसाठी बनवलेले आहे. मी कापूस पिकाविषयी अंदाज देत नाही. उसाच्या पिकाविषयी काहीही विचारा.";
        case 'hi':
          return "यील्डविजन केवल भारतीय गन्ना किसानों के लिए है। मैं कपास फसल के आंकड़े नहीं देता। आप गन्ने से जुड़ा कोई भी प्रश्न पूछ सकते हैं।";
        default:
          return "YieldVision is calibrated exclusively for Indian Sugarcane Yield Intelligence. I do not provide predictions or analytics for cotton.";
      }
    }

    // Fertilizer questions
    if (
      qLower.includes('fertilizer') ||
      qLower.includes('खत') ||
      qLower.includes('खाद') ||
      qLower.includes('உரம்') ||
      qLower.includes('ఎరువు') ||
      qLower.includes('ಗೊಬ್ಬರ') ||
      qLower.includes('সার') ||
      qLower.includes('വളം')
    ) {
      switch (language) {
        case 'mr':
          return `तुमच्या ${loc} शेतासाठी ५० किलो पोत्यांनुसार रासायनिक खतांचा डोस:\n• युरिया: ३ ते ४ पोती प्रति एकर (लागवड, फुटवे आणि बांधणीवेळी विभागून)\n• डीएपी: १.५ पोती प्रति एकर (लागवडीच्या वेळी संपूर्ण)\n• पोटॅश (MOP): १.५ ते २ पोती प्रति एकर (उसाच्या जाडी व वजनासाठी)`;
        case 'hi':
          return `आपके ${loc} खेत के लिए 50 किलो बोरी के हिसाब से खाद की मात्रा:\n• यूरिया: 3 से 4 बोरी प्रति एकड़ (बुवाई, कल्ले और मिट्टी चढ़ाते समय)\n• डीएपी: 1.5 बोरी प्रति एकड़ (बुवाई के समय पूरी)\n• पोटाश: 1.5 से 2 बोरी प्रति एकड़ (गन्ने की मोटाई और वजन बढ़ाने के लिए)`;
        case 'gu':
          return `તમારા ${loc} ખેતર માટે 50 કિલો થેલી મુજબ ખાતરનું પ્રમાણ:\n• યુરિયા: 3 થી 4 થેલી પ્રતિ એકર\n• ડીએપી: 1.5 થેલી પ્રતિ એકર\n• પોટાશ: 1.5 થી 2 થેલી પ્રતિ એકર`;
        case 'ta':
          return `உங்கள் ${loc} பண்ணைக்கான உர பரிந்துரை (50 கிலோ மூட்டை / ஏக்கர்):\n• யூரியா: 3-4 மூட்டைகள்\n• டிஏபி: 1.5 மூட்டைகள்\n• பொட்டாஷ்: 1.5-2 மூட்டைகள்`;
        case 'te':
          return `మీ ${loc} పొలానికి 50 కిలోల బస్తాల ఎరువుల మోతాదు:\n• యూరియా: 3-4 బస్తాలు প্রতি ఎకరానికి\n• డిఎపి: 1.5 బస్తాలు\n• పొటాష్: 1.5-2 బస్తాలు`;
        case 'kn':
          return `ನಿಮ್ಮ ${loc} ಜಮೀನಿಗೆ 50 ಕೆಜಿ ಚೀಲಗಳ ಗೊಬ್ಬರ ಪ್ರಮಾಣ:\n• ಯೂರಿಯಾ: ಎಕರೆಗೆ 3-4 ಚೀಲಗಳು\n• ಡಿಎಪಿ: 1.5 ಚೀಲಗಳು\n• ಪೊಟ್ಯಾಶ್: 1.5-2 ಚೀಲಗಳು`;
        default:
          return `Recommended fertilizer split for your ${loc} farm (in 50kg bags / acre):\n• Urea: 3.5 to 4 bags (split across planting, tillering, earthing up)\n• DAP: 1.5 bags (apply at planting)\n• Potash (MOP): 1.5 to 2 bags (critical for cane diameter & sucrose)`;
      }
    }

    // Default regional yield summary
    switch (language) {
      case 'mr':
        return `तुमच्या सध्याच्या ${loc} (${dist}) डेटानुसार उसाचे अंदाजे उत्पादन ${yieldVal} टन प्रति हेक्टर आहे. सध्या मातीतील ओलावा आणि पाऊस ऊस वाढीसाठी अनुकूल आहे. दुपारच्या उन्हात पाण्याचे योग्य नियोजन करा.`;
      case 'hi':
        return `आपके वर्तमान ${loc} (${dist}) डेटा के अनुसार गन्ने की अनुमानित पैदावार ${yieldVal} टन प्रति हेक्टेयर है। मिट्टी की नमी अनुकूल है। गर्मियों में समय पर सिंचाई का ध्यान रखें।`;
      case 'gu':
        return `તમારા ${loc} ડેટા મુજબ શેરડીનું અંદાજિત ઉત્પાદન ${yieldVal} ટન પ્રતિ હેક્ટર છે. હાલમાં જમીનનો ભેજ અને હવામાન અનુકૂળ છે.`;
      case 'pa':
        return `ਤੁਹਾਡੇ ${loc} ਡੇਟਾ ਅਨੁਸਾਰ ਗੰਨੇ ਦਾ ਸੰਭਾਵੀ ਝਾੜ ${yieldVal} ਟਨ ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਹੈ। ਮੌਸਮ ਅਤੇ ਨਮੀ ਫ਼ਸਲ ਲਈ ਵਧੀਆ ਹੈ।`;
      case 'bn':
        return `আপনার ${loc} তথ্য অনুসারে আখের আনুমানিক ফলন ${yieldVal} টন প্রতি হেক্টর। মাটি ও আবহাওয়া বৃদ্ধির জন্য অনুকূল।`;
      case 'ta':
        return `உங்கள் ${loc} தரவுகளின்படி கரும்பு உத்தேச விளைச்சல் ஹெக்டேருக்கு ${yieldVal} டன்கள். பருவமழை மற்றும் மண் ஈரப்பதம் சாதகமாக உள்ளது.`;
      case 'te':
        return `మీ ${loc} డేటా ప్రకారం చెరకు అంచనా దిగుబడి హెక్టారుకు ${yieldVal} టన్నులు. ప్రస్తుతం తేమ మరియు వాతావరణం అనుకూలంగా ఉన్నాయి.`;
      case 'kn':
        return `ನಿಮ್ಮ ${loc} ಡೇಟಾದ ಪ್ರಕಾರ ಕಬ್ಬಿನ ಅಂದಾಜು ಇಳುವರಿ ಹೆಕ್ಟೇರ್‌ಗೆ ${yieldVal} ಟನ್ ಆಗಿದೆ. ಮಣ್ಣಿನ ತೇವಾಂಶ ಬೆಳವಣಿಗೆಗೆ ಪೂರಕವಾಗಿದೆ.`;
      case 'ml':
        return `നിങ്ങളുടെ ${loc} വിവരങ്ങൾ അനുസരിച്ച് കരിമ്പിന്റെ പ്രതീക്ഷിക്കുന്ന വിളവ് ഹെക്ടറിന് ${yieldVal} ടൺ ആണ്. കാലാവസ്ഥ അനുകൂലമാണ്.`;
      case 'or':
        return `ଆପଣଙ୍କ ${loc} ତଥ୍ୟ ଅନୁସାରେ ଆଖୁର ସମ୍ଭାବ୍ୟ ଅମଳ ହେକ୍ଟର ପିଛା ${yieldVal} ଟନ୍। ପାଣିପାଗ ଅନୁକୂଳ ରହିଛି।`;
      case 'as':
        return `আপোনাৰ ${loc} তথ্য অনুসৰি কুঁহিয়াৰৰ সম্ভাৱ্য উৎপাদন প্ৰতি হেক্টৰত ${yieldVal} টন। বতৰ আৰু আৰ্দ্ৰতা অনুকূল।`;
      case 'en':
      default:
        return `Based on your current ${loc} (${dist}) dataset, your expected sugarcane yield is approximately ${yieldVal} tonnes per hectare. Soil moisture and climate conditions are currently favorable.`;
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Voice speech-to-text handling
  const handleToggleVoice = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your question.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Select BCP-47 regional language tag
      const langMap: Record<string, string> = {
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
      recognition.lang = langMap[language] || 'hi-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Live Dashboard context extraction
    const context = {
      crop: 'Sugarcane',
      state: location,
      district: district || 'Kolhapur',
      year: season,
      season: season,
      prediction: currentPrediction.predicted_yield,
      confidence: currentPrediction.confidence,
      risk_level: currentPrediction.risk_level,
      climate: `${currentPrediction.climate_state} (${currentPrediction.inputs?.oni_index ?? -0.35} ONI)`,
      soil: `${currentPrediction.inputs?.soil_moisture ?? 36.5}% Moisture`,
      model: currentPrediction.model_used || 'Voting Regressor',
      language: language,
      inputs: currentPrediction.inputs
    };

    try {
      const result = await apiService.chatWithYieldAI(query, context);
      const aiResponseText =
        result?.response || generateRegionalFallback(query, context);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date(),
        actions: result?.actions || [
          { label: `${t('nav.predict')} →`, page: 'predict' },
          { label: `${t('nav.climate')} →`, page: 'climate' }
        ]
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackText = generateRegionalFallback(query, context);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date(),
        actions: [{ label: `${t('nav.predict')} →`, page: 'predict' }]
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (page: string) => {
    setIsOpen(false);
    setCurrentPage(page);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: getGreeting(),
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* 1. Collapsed Floating Pill Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#064E3B] text-white hover:bg-[#073B2A] border border-emerald-400/30 backdrop-blur-md shadow-[0_8px_24px_rgba(6,78,59,0.32)] hover:shadow-[0_12px_28px_rgba(6,78,59,0.4)] transition-all duration-200 hover:scale-[1.03] cursor-pointer"
            title="Open YieldAI Sugarcane Intelligence Assistant"
            aria-label="Open YieldAI Assistant"
          >
            <span className="text-emerald-300 font-bold text-base leading-none">✦</span>
            <span className="font-semibold text-sm tracking-tight">YieldAI</span>
            <span className="hidden group-hover:inline-block max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap text-xs text-emerald-200/90 pl-1 font-medium">
              • {t('yieldai.title')}
            </span>
          </button>
        </div>
      )}

      {/* 2. Open Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[560px] max-h-[78vh] sm:max-h-[600px] flex flex-col bg-white/95 dark:bg-[#07241A]/95 backdrop-blur-2xl border border-emerald-500/25 dark:border-emerald-400/20 rounded-3xl shadow-[0_20px_50px_rgba(6,78,59,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#064E3B] to-[#0A5C46] text-white border-b border-emerald-600/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300">
                <span className="text-sm font-bold">✦</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm tracking-tight text-white leading-tight">
                    YieldAI
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-none mt-0.5">
                  {t('yieldai.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-emerald-600/30 transition-colors cursor-pointer"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-emerald-600/30 transition-colors cursor-pointer"
                title="Close YieldAI"
                aria-label="Close YieldAI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          <div className="px-4 py-2 bg-[#DDF5EA]/60 dark:bg-[#063F2F]/60 border-b border-emerald-500/10 text-[11px] text-[#064E3B] dark:text-emerald-200 flex items-center justify-between font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold">📍</span>
              <span className="truncate">
                {location} ({district || 'Kolhapur'}) • {season}
              </span>
            </div>
            <span className="shrink-0 font-bold bg-[#064E3B] text-white px-2 py-0.5 rounded-full text-[10px]">
              {currentPrediction.predicted_yield} T/Ha
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } animate-in fade-in duration-150`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-sm whitespace-pre-wrap
                    ${
                      msg.sender === 'user'
                        ? 'bg-[#064E3B] text-white rounded-tr-xs shadow-sm font-sans'
                        : 'bg-[#E8F8F0] dark:bg-[#073B2A] text-[#064E3B] dark:text-emerald-100 border border-emerald-500/20 rounded-tl-xs shadow-sm'
                    }
                  `}
                >
                  {msg.text}
                </div>

                {/* Optional Action Shortcuts */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                    {msg.actions.map((act) => (
                      <button
                        key={act.label}
                        onClick={() => handleActionClick(act.page)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-[#064E3B] text-[#064E3B] dark:text-emerald-200 border border-emerald-500/30 hover:bg-[#DDF5EA] dark:hover:bg-[#0A5C46] transition-all cursor-pointer shadow-xs"
                      >
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs font-medium text-[#064E3B] dark:text-emerald-300 bg-[#E8F8F0] dark:bg-[#073B2A] border border-emerald-500/20 px-3.5 py-2 rounded-2xl rounded-tl-xs w-fit">
                <span>YieldAI...</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Scrollable Row */}
          <div className="px-3 py-2 border-t border-emerald-500/10 bg-slate-50/60 dark:bg-[#041F16]/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {getQuickActions().map((action) => (
              <button
                key={action}
                onClick={() => handleSendMessage(action)}
                disabled={loading}
                className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-[#073B2A] text-slate-700 dark:text-emerald-200 border border-emerald-500/25 hover:border-emerald-500 hover:bg-[#DDF5EA]/50 transition-all cursor-pointer disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-white dark:bg-[#07241A] border-t border-emerald-500/15">
            <div className="flex items-end gap-2 bg-[#FAFCF9] dark:bg-[#041F16] border border-emerald-500/25 rounded-2xl p-1.5 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600/30 transition-all">
              {/* Voice Input Microphone Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-500 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-forest-900'
                }`}
                title={isListening ? 'Listening... Speak now' : 'Voice Input (बोलून विचारा)'}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('yieldai.input_placeholder')}
                rows={1}
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-800 dark:text-emerald-100 placeholder-slate-400 dark:placeholder-emerald-400/50 resize-none focus:outline-none max-h-24 font-sans"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-[#064E3B] text-white hover:bg-[#073B2A] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-medium truncate px-1">
              {t('yieldai.disclaimer')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
