import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Droplets, 
  ShieldAlert, 
  Package, 
  CheckCircle, 
  TrendingUp,
  Banknote,
  Clock,
  Sparkle
} from 'lucide-react';
import { speakFarmerGuidance, stopFarmerGuidance } from '../../lib/i18n';

interface FarmerAdviceCardProps {
  onAskYieldAI?: (question: string) => void;
}

export const FarmerAdviceCard: React.FC<FarmerAdviceCardProps> = ({ onAskYieldAI }) => {
  const { currentPrediction, settings, t, language, crop, location } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Extract prediction inputs and outputs
  const inputs = typeof currentPrediction.inputs === 'string' 
    ? JSON.parse(currentPrediction.inputs || '{}') 
    : (currentPrediction.inputs || {});

  const qYield = currentPrediction.predicted_yield || 485.3;
  // Sugarcane: 1 Ton = 10 Quintals -> 485 Q/Acre = ~48.5 T/Acre
  const tYield = (qYield / 10).toFixed(1);

  // FRP in India is ~₹315 per quintal baseline
  const estimatedRevenue = Math.round(qYield * 315).toLocaleString('en-IN');

  // Fertilizer titrations in 50kg bags
  const nVal = inputs.nitrogen_n_kg_per_acre || inputs.nitrogen || 180;
  const pVal = inputs.phosphorus_p_kg_per_acre || inputs.phosphorus || 65;
  const kVal = inputs.potassium_k_kg_per_acre || inputs.potassium || 80;

  // Approximate 50kg bag calculations for practical farmer application
  const ureaBags = Math.max(1, parseFloat((nVal * 0.022).toFixed(1))); // Approx Urea bags
  const dapBags = Math.max(1, parseFloat((pVal * 0.043).toFixed(1)));  // Approx DAP bags
  const mopBags = Math.max(1, parseFloat((kVal * 0.033).toFixed(1)));  // Approx MOP Potash bags

  const variety = inputs.seed_variety || 'Co86032';
  const soil = inputs.soil_type || 'Alluvial';

  // Build audio text based on regional language
  const getAudioText = () => {
    switch (language) {
      case 'mr':
        return `शेतकरी मित्रांनो, नमस्कार. यील्डव्हिजन कृषी मॉडेलनुसार, आपल्या ${variety} उसाचे अपेक्षित उत्पादन प्रति एकर ${qYield} क्विंटल, म्हणजेच सुमारे ${tYield} टन निघण्याचा अंदाज आहे. यातून अंदाजे ₹${estimatedRevenue} उत्पन्न अपेक्षित आहे. खतांसाठी युरिया अंदाजे ${ureaBags} पोती, डीएपी ${dapBags} पोती आणि पोटॅश ${mopBags} पोती प्रति एकर विभागून द्या. उन्हाळ्यात १० ते १२ दिवसांनी पाणी द्या. खोडकिडीपासून संरक्षणासाठी लागवडीनंतर योग्य कीटकनाशकाची फवारणी करा.`;
      case 'hi':
        return `किसान भाइयों, नमस्कार। यील्डविजन मॉडल के अनुसार, आपके ${variety} गन्ने की अनुमानित पैदावार प्रति एकड़ ${qYield} क्विंटल, यानी लगभग ${tYield} टन रहने की संभावना है। इससे लगभग ₹${estimatedRevenue} सकल आय संभव है। रासायनिक खाद में यूरिया लगभग ${ureaBags} बोरी, डीएपी ${dapBags} बोरी और पोटाश ${mopBags} बोरी प्रति एकड़ दें। गर्मी में हर 10 से 12 दिन में सिंचाई करें। कंसुआ कीट से बचाव के लिए समय पर स्प्रे करें।`;
      case 'kn':
        return `ರೈತ ಬಾಂಧವರಿಗೆ ನಮಸ್ಕಾರ. ನಿಮ್ಮ ${variety} ಕಬ್ಬಿನ ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ಎಕರೆಗೆ ${qYield} ಕ್ವಿಂಟಾಲ್ ಅಥವಾ ${tYield} ಟನ್ ಬರಲಿದೆ. ರಸಗೊಬ್ಬರದಲ್ಲಿ ಯೂರಿಯಾ ${ureaBags} ಚೀಲ, ಡಿಎಪಿ ${dapBags} ಚೀಲ ಮತ್ತು ಪೊಟ್ಯಾಶ್ ${mopBags} ಚೀಲ ಬಳಸಿ. ಬೇಸಿಗೆಯಲ್ಲಿ ಪ್ರತಿ 10-12 ದಿನಗಳಿಗೊಮ್ಮೆ ನೀರು ಹಾಯಿಸಿ.`;
      case 'ta':
        return `வணக்கம் விவசாய நண்பர்களே. உங்கள் ${variety} கரும்பு விளைச்சல் ஏக்கருக்கு ${qYield} குவிண்டால் அல்லது ${tYield} டன் என கணிக்கப்பட்டுள்ளது. உர பரிந்துரை: யூரியா ${ureaBags} மூட்டைகள், டிஏபி ${dapBags} மூட்டைகள், பொட்டாஷ் ${mopBags} மூட்டைகள். 10-12 நாட்களுக்கு ஒருமுறை நீர் பாய்ச்சவும்.`;
      case 'te':
        return `రైతు సోదరులకు నమస్కారం. మీ ${variety} చెరకు దిగుబడి ఎకరానికి ${qYield} క్వింటాళ్లు അല്ലെങ്കിൽ ${tYield} టన్నులుగా అంచనా వేయబడింది. ఎరువుల మోతాదు: యూరియా ${ureaBags} బస్తాలు, డిఎపి ${dapBags} బస్తాలు, పొటాష్ ${mopBags} బస్తాలు వాడండి.`;
      case 'gu':
        return `ખેડૂત મિત્રો, નમસ્તે. તમારી ${variety} શેરડીનું અંદાજિત ઉત્પાદન પ્રતિ એકર ${qYield} ક્વિન્ટલ એટલે કે ${tYield} ટન રહેવાનો અંદાજ છે. ખાતરમાં યુરિયા ${ureaBags} થેલી, ડીએપી ${dapBags} થેલી અને પોટાશ ${mopBags} થેલી આપવી.`;
      case 'pa':
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਤੁਹਾਡੇ ${variety} ਗੰਨੇ ਦਾ ਝਾੜ ਪ੍ਰਤੀ ਏਕੜ ${qYield} ਕੁਇੰਟਲ ਜਾਂ ਲਗਭਗ ${tYield} ਟਨ ਰਹਿਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਖਾਦਾਂ ਵਿੱਚ ਯੂਰੀਆ ${ureaBags} ਗੱਟੇ, ਡੀਏਪੀ ${dapBags} ਗੱਟੇ ਅਤੇ ਪੋਟਾਸ਼ ${mopBags} ਗੱਟੇ ਪਾਓ।`;
      case 'bn':
        return `নমস্কার কৃষক ভাইয়েরা। আপনার ${variety} আখের ফলন প্রতি একরে ${qYield} কুইন্টাল বা ${tYield} টন হতে পারে। সারের পরিমাণ: ইউরিয়া ${ureaBags} বস্তা, ডিএপি ${dapBags} বস্তা এবং পটাশ ${mopBags} বস্তা দিন।`;
      case 'ml':
        return `നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ. നിങ്ങളുടെ ${variety} കരിമ്പിന്റെ വിളവ് ഏക്കറിന് ${qYield} ക്വിന്റൽ അല്ലെങ്കിൽ ${tYield} ടൺ പ്രതീക്ഷിക്കുന്നു. യൂറിയ ${ureaBags} ചാക്ക്, ഡിഎപി ${dapBags} ചാക്ക്, പൊട്ടാഷ് ${mopBags} ചാക്ക് നൽകുക.`;
      case 'or':
        return `ନମସ୍କାର ଚାଷୀ ଭାଇମାନେ। ଆପଣଙ୍କ ${variety} ଆଖୁ ଅମଳ ଏକର ପ୍ରତି ${qYield} କ୍ୱିଣ୍ଟାଲ ବା ${tYield} ଟନ୍ ହେବାର ସମ୍ଭାବନା ଅଛି। ୟୁରିଆ ${ureaBags} ବସ୍ତା, ଡିଏପି ${dapBags} ବସ୍ତା ଏବଂ ପଟାସ ${mopBags} ବସ୍ତା ଦିଅନ୍ତୁ।`;
      default:
        return `Hello Farmer. According to YieldVision, your projected ${variety} sugarcane harvest is ${qYield} Quintals per acre, which is approximately ${tYield} Tonnes per acre. Estimated gross value is ₹${estimatedRevenue}. Recommended fertilizer per acre: Urea ${ureaBags} bags, DAP ${dapBags} bags, and Potash ${mopBags} bags. Maintain irrigation every 10 to 12 days.`;
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopFarmerGuidance();
      setIsPlayingAudio(false);
    } else {
      const text = getAudioText();
      const started = speakFarmerGuidance(text, language);
      if (started) {
        setIsPlayingAudio(true);
        // Reset state when speech ends (fallback timer)
        setTimeout(() => setIsPlayingAudio(false), 24000);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-[#064E3B] to-[#043327] text-white p-5 sm:p-7 shadow-xl border border-emerald-500/25">
      {/* Decorative leaf/watermark background pattern */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-6 top-6 opacity-10 pointer-events-none text-8xl font-serif">🌾</div>

      {/* TOP BAR: Badge, Language Tag, Audio Speak Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t('farmer.title')}</span>
          </span>
          <span className="text-[11px] text-emerald-200/80 hidden sm:inline-block">
            {location} • {crop} ({variety})
          </span>
        </div>

        {/* Audio Listen Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAudio}
            className={`
              flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer
              ${isPlayingAudio 
                ? 'bg-amber-400 text-amber-950 animate-pulse ring-2 ring-amber-300' 
                : 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 border border-emerald-400/30'
              }
            `}
            title="Listen to this guidance in your language"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-950" />
                <span>{t('farmer.stop_audio')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-300" />
                <span>{t('farmer.listen_audio')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN SECTION: 2 COLUMNS (Production Numbers & Bag-wise Fertilizer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN (5 cols): Expected Yield Numbers & Market Value */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-200/90 font-medium mb-1">
              <span>{t('farmer.expected_yield')}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                {currentPrediction.confidence}% {t('farmer.reliability')}
              </span>
            </div>

            {/* Quintal/Acre & Ton/Acre */}
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {qYield}
              </span>
              <div>
                <span className="text-sm sm:text-base font-bold text-emerald-300 block">
                  {t('farmer.quintals')} / {t('farmer.per_acre')}
                </span>
                <span className="text-xs text-emerald-100/70 font-medium">
                  ≈ {tYield} {t('farmer.tonnes')} / {t('farmer.per_acre')}
                </span>
              </div>
            </div>

            {/* Gross Value Calculation based on FRP ₹315/Quintal */}
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-400/25 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-200">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>{t('farmer.estimated_income')}</span>
              </span>
              <span className="font-bold text-emerald-300 text-sm">
                ₹{estimatedRevenue}
              </span>
            </div>

            <p className="text-xs text-emerald-100/80 mt-3 leading-relaxed">
              {currentPrediction.insights?.summary || `${variety} उसासाठी योग्य निविष्ठा दिल्यास अपेक्षित विक्रमी उत्पादन मिळेल.`}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{variety} • {soil}</span>
            </span>
            <span className="text-emerald-300 font-bold">
              +12% {t('kpi.regional_normal')}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): Fertilizer Bags Prescription & Irrigation Guidance */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Fertilizer in 50kg Bags */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-emerald-200">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>{t('farmer.fertilizer_split')}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              {/* Urea */}
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-400/20">
                <span className="text-[11px] font-bold text-emerald-200 block truncate">
                  {t('farmer.urea_bags')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                  {ureaBags}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold">
                  {t('farmer.bags_unit')} (50kg)
                </span>
              </div>

              {/* DAP */}
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-400/20">
                <span className="text-[11px] font-bold text-emerald-200 block truncate">
                  {t('farmer.dap_bags')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                  {dapBags}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold">
                  {t('farmer.bags_unit')} (50kg)
                </span>
              </div>

              {/* Potash */}
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-400/20">
                <span className="text-[11px] font-bold text-emerald-200 block truncate">
                  {t('farmer.potash_bags')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                  {mopBags}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold">
                  {t('farmer.bags_unit')} (50kg)
                </span>
              </div>
            </div>

            {/* Split Timing Badges */}
            <div className="mt-3 pt-2.5 border-t border-emerald-500/20 space-y-1 text-[11px] text-emerald-200/90">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{t('farmer.timing_planting')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{t('farmer.timing_tillering')}</span>
              </div>
            </div>
          </div>

          {/* TWO QUICK ADVICE PILLS: Water & Pest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Irrigation Advice */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-200 block mb-0.5">{t('farmer.irrigation_schedule')}</strong>
                <p className="text-[11px] text-emerald-100/75 leading-tight">
                  {t('farmer.irrigation_text')}
                </p>
              </div>
            </div>

            {/* Pest Control Advice */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-200 block mb-0.5">{t('farmer.pest_warning')}</strong>
                <p className="text-[11px] text-emerald-100/75 leading-tight">
                  {t('farmer.pest_text')}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
