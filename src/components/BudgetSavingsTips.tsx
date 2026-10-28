import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ChefHat,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingDown,
  Calendar,
  UtensilsCrossed,
  RotateCcw,
  Loader2,
  SlidersHorizontal,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { formatRupiah, formatNumberIndo } from '../utils/formatters';

interface BudgetSavingsTipsProps {
  remainingFoodBudget: number; // e.g. 850.000
  totalFoodBudget: number; // 1.200.000
  dailyLimit: number; // 40.000
  selectedMonth: string;
  onApplyRecipeToExpense?: (title: string, amount: number) => void;
}

export interface RecipeItem {
  day: string;
  menuName: string;
  estCost: number;
  ingredients: Array<{ name: string; cost: number }>;
  category: 'tempe_tahu' | 'telur' | 'ikan' | 'ayam' | 'sayur' | string;
  tip: string;
}

interface AiRecommendationResult {
  summaryAdvice: string;
  averageDailyCost: number;
  totalWeeklyCost: number;
  savingsComparedToLimit: number;
  recipes: RecipeItem[];
}

export const BudgetSavingsTips: React.FC<BudgetSavingsTipsProps> = ({
  remainingFoodBudget,
  totalFoodBudget,
  dailyLimit,
  selectedMonth,
  onApplyRecipeToExpense,
}) => {
  const [copiedDay, setCopiedDay] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>('Senin');

  // AI Generation States
  const [showAiCustomizer, setShowAiCustomizer] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiRecommendationResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // AI Prompt Customization inputs
  const [pantryInput, setPantryInput] = useState<string>('');
  const [preferencesInput, setPreferencesInput] = useState<string>('');
  const [targetDays, setTargetDays] = useState<number>(7);

  // Calculate days remaining in current month
  const [year, month] = selectedMonth.split('-').map(Number);
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const currentDayNum = selectedMonth === currentMonthKey ? today.getDate() : 1;
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDayNum + 1);

  // Dynamic average daily budget available
  const avgDailyRemaining = Math.max(0, Math.round(remainingFoodBudget / daysRemaining));

  // Determine budget situation tier
  const budgetTier = useMemo<'tight' | 'moderate' | 'comfortable'>(() => {
    if (avgDailyRemaining < 28000 || remainingFoodBudget < 250000) return 'tight';
    if (avgDailyRemaining < 36000) return 'moderate';
    return 'comfortable';
  }, [avgDailyRemaining, remainingFoodBudget]);

  // Curated Indonesian weekly meal plans matching budget tiers
  const curatedPlans: Record<'tight' | 'moderate' | 'comfortable', RecipeItem[]> = {
    // Mode Super Hemat: rata-rata Rp18.000 - Rp25.000 / hari
    tight: [
      {
        day: 'Senin',
        menuName: 'Sayur Asem Labu & Tempe Goreng Lengkuas',
        estCost: 19000,
        category: 'tempe_tahu',
        tip: 'Beli paket sayur asem di tukang sayur pagi hari, lebih murah daripada beli eceran.',
        ingredients: [
          { name: 'Paket sayur asem komplit (labu, jagung, kacang panjang)', cost: 6000 },
          { name: 'Tempe 1 papan sedang', cost: 5000 },
          { name: 'Minyak goreng & bumbu dasar', cost: 4000 },
          { name: 'Sambal terasi & tomat', cost: 4000 },
        ],
      },
      {
        day: 'Selasa',
        menuName: 'Tumis Kangkung Belacan & Telur Dadar Daun Bawang',
        estCost: 21000,
        category: 'telur',
        tip: 'Telur dadar dikocok bersama sedikit tepung terigu atau tahu agar lebih tebal mengembang.',
        ingredients: [
          { name: 'Kangkung 2 ikat segar', cost: 5000 },
          { name: 'Telur ayam 3 butir (1/4 kg)', cost: 8000 },
          { name: 'Tahu putih 4 potong', cost: 4000 },
          { name: 'Bawang, cabai & terasi', cost: 4000 },
        ],
      },
      {
        day: 'Rabu',
        menuName: 'Sayur Bening Bayam Jagung & Bakwan Jagung Renyah',
        estCost: 18500,
        category: 'sayur',
        tip: 'Bayam hanya butuh direbus sebentar, jagung manis memberi rasa gurih alami tanpa banyak MSG.',
        ingredients: [
          { name: 'Bayam 2 ikat', cost: 5000 },
          { name: 'Jagung manis 2 buah', cost: 6000 },
          { name: 'Tepung terigu & bumbu halus', cost: 3500 },
          { name: 'Tempe 1/2 papan goreng', cost: 4000 },
        ],
      },
      {
        day: 'Kamis',
        menuName: 'Tahu Tempe Bacem Legit & Sayur Sop Buncis',
        estCost: 22000,
        category: 'tempe_tahu',
        tip: 'Bacem bisa dimasak sore hari sebelumnya agar bumbu meresap sempurna sampai ke dalam.',
        ingredients: [
          { name: 'Paket sayur sop (wortel, kol, buncis)', cost: 5000 },
          { name: 'Tahu & tempe (1 papan masing-masing)', cost: 9000 },
          { name: 'Gula merah, ketumbar & kecap', cost: 4000 },
          { name: 'Bawang goreng tabur', cost: 4000 },
        ],
      },
      {
        day: 'Jumat',
        menuName: 'Ikan Tongkol Suwir Balado & Lalap Timun Rebus',
        estCost: 24500,
        category: 'ikan',
        tip: 'Ikan tongkol keranjang (cue) sudah matang, tinggal disuwir dan dimasak bumbu balado pedas manis.',
        ingredients: [
          { name: 'Ikan tongkol cue 2 keranjang', cost: 12000 },
          { name: 'Cabai merah, tomat & bawang', cost: 5000 },
          { name: 'Timun 1/2 kg & terong lalap', cost: 4500 },
          { name: 'Bumbu pelengkap & minyak', cost: 3000 },
        ],
      },
      {
        day: 'Sabtu',
        menuName: 'Oreg Tempe Kering Manis & Telur Ceplok Masak Kecap',
        estCost: 21500,
        category: 'telur',
        tip: 'Oreg tempe kering tahan 3-4 hari, sangat praktis untuk cadangan lauk keluarga.',
        ingredients: [
          { name: 'Tempe 1 papan besar', cost: 6000 },
          { name: 'Telur 3 butir', cost: 8000 },
          { name: 'Kecap manis & bawang bombay/merah', cost: 4500 },
          { name: 'Cabai hijau iris', cost: 3000 },
        ],
      },
      {
        day: 'Minggu',
        menuName: 'Soto Tahu Kol Gurih & Perkedel Tahu',
        estCost: 20000,
        category: 'sayur',
        tip: 'Kuah soto bening rempah (serai, daun salam, kunyit) sangat segar dinikmati bersama keluarga.',
        ingredients: [
          { name: 'Tahu putih 1 bungkus isi 8', cost: 6000 },
          { name: 'Kol & tauge soto', cost: 4000 },
          { name: 'Bumbu soto rempah & jeruk nipis', cost: 5000 },
          { name: 'Kerupuk bawang eceran', cost: 5000 },
        ],
      },
    ],

    // Mode Hemat Terkendali: rata-rata Rp27.000 - Rp34.000 / hari
    moderate: [
      {
        day: 'Senin',
        menuName: 'Sayur Lodeh Labu Siam & Ikan Kembung Goreng Sambal',
        estCost: 32000,
        category: 'ikan',
        tip: 'Ikan kembung kaya omega-3 dan harganya sangat terjangkau dibanding ikan kakap atau gurame.',
        ingredients: [
          { name: 'Ikan kembung segar 3 ekor (1/3 kg)', cost: 14000 },
          { name: 'Paket sayur lodeh + santan kara kecil', cost: 8000 },
          { name: 'Tempe goreng tepung', cost: 5000 },
          { name: 'Cabai & bumbu marinasi', cost: 5000 },
        ],
      },
      {
        day: 'Selasa',
        menuName: 'Ayam Kecap Bumbu Gurih & Tumis Buncis Jagung',
        estCost: 34000,
        category: 'ayam',
        tip: 'Beli sayap atau paha bawah ayam 1/2 kg, potong ukuran sedang agar porsi pas untuk sekeluarga.',
        ingredients: [
          { name: 'Ayam potong segar 1/2 kg', cost: 18000 },
          { name: 'Buncis 1/4 kg & jagung manis', cost: 6000 },
          { name: 'Bawang bombay, kecap & merica', cost: 5000 },
          { name: 'Tahu goreng pendamping', cost: 5000 },
        ],
      },
      {
        day: 'Rabu',
        menuName: 'Sayur Sop Bakso Sosis & Telur Balado Padang',
        estCost: 29000,
        category: 'telur',
        tip: 'Gunakan 4 butir telur rebus yang digoreng berkulit, disiram cabai balado khas warteg.',
        ingredients: [
          { name: 'Telur 4 butir (rebus balado)', cost: 11000 },
          { name: 'Paket sop komplit + daun seledri', cost: 5000 },
          { name: 'Bakso sapi curah 5 butir & sosis 2 pcs', cost: 7000 },
          { name: 'Cabai merah kriting & bumbu sop', cost: 6000 },
        ],
      },
      {
        day: 'Kamis',
        menuName: 'Pepes Ikan Mas/Tongkol Kemangi & Sayur Asem Segar',
        estCost: 31000,
        category: 'ikan',
        tip: 'Kukus pepes bersama daun pisang dan kemangi, aromanya sedap dan sangat hemat minyak goreng.',
        ingredients: [
          { name: 'Ikan tongkol/mas 2 potong', cost: 14000 },
          { name: 'Paket sayur asem & bumbu kuah', cost: 6000 },
          { name: 'Daun pisang, kemangi & cabai rawit', cost: 6000 },
          { name: 'Tempe mendoan 1/2 papan', cost: 5000 },
        ],
      },
      {
        day: 'Jumat',
        menuName: 'Gulai Tahu Telur Puyuh & Tumis Tauge Ikan Asin',
        estCost: 28500,
        category: 'telur',
        tip: 'Telur puyuh rebus 10 butir + tahu putih memberi tekstur mewah dengan harga hemat.',
        ingredients: [
          { name: 'Telur puyuh 10 butir', cost: 8000 },
          { name: 'Tahu putih kotak 1 bungkus', cost: 5000 },
          { name: 'Tauge 1/4 kg & ikan asin jambal sedikit', cost: 6500 },
          { name: 'Bumbu gulai instan/giling & santan', cost: 9000 },
        ],
      },
      {
        day: 'Sabtu',
        menuName: 'Capcay Kuah Telur Puyuh & Ayam Suwir Serundeng',
        estCost: 33000,
        category: 'ayam',
        tip: 'Sayuran capcay kaya serat: wortel, kembang kol, sawi putih, dan bakso iris.',
        ingredients: [
          { name: 'Dada ayam 250 gram (suwir)', cost: 12000 },
          { name: 'Paket sayuran capcay lengkap', cost: 8000 },
          { name: 'Telur 2 butir kocok kuah', cost: 5000 },
          { name: 'Bumbu saus tiram & bawang putih', cost: 8000 },
        ],
      },
      {
        day: 'Minggu',
        menuName: 'Ikan Lele Goreng Kremes & Sayur Bening Oyong Bihun',
        estCost: 30000,
        category: 'ikan',
        tip: 'Lele 3 ekor cukup untuk lauk makan siang dan malam bersama sambal terasi matang.',
        ingredients: [
          { name: 'Ikan lele segar 3 ekor', cost: 15000 },
          { name: 'Oyong/gambas 2 buah & bihun', cost: 6000 },
          { name: 'Tepung bumbu kremes kriuk', cost: 4000 },
          { name: 'Lalapan kubis, kemangi & timun', cost: 5000 },
        ],
      },
    ],

    // Mode Seimbang: rata-rata Rp34.000 - Rp39.000 / hari (Maksimal batas harian Rp40.000)
    comfortable: [
      {
        day: 'Senin',
        menuName: 'Ayam Goreng Lengkuas, Sayur Asem & Sambal Terasi',
        estCost: 37000,
        category: 'ayam',
        tip: 'Ungkep ayam 1/2 kg bersama parutan lengkuas banyak untuk lauk seharian penuh.',
        ingredients: [
          { name: 'Ayam segar 1/2 kg', cost: 18000 },
          { name: 'Paket sayur asem komplit', cost: 6000 },
          { name: 'Tahu putih & tempe goreng', cost: 6000 },
          { name: 'Lengkuas, bumbu rempah & sambal', cost: 7000 },
        ],
      },
      {
        day: 'Selasa',
        menuName: 'Ikan Nila Bakar Bumbu Padang & Cah Kangkung Udang Rebon',
        estCost: 38000,
        category: 'ikan',
        tip: 'Gunakan teflon anti lengket beralas daun pisang untuk membakar ikan nila tanpa arang.',
        ingredients: [
          { name: 'Ikan nila segar 2 ekor ukuran sedang', cost: 20000 },
          { name: 'Kangkung 2 ikat & rebon gurih', cost: 6500 },
          { name: 'Bumbu olesan bakar manis pedas', cost: 6000 },
          { name: 'Lalapan selada & tomat', cost: 5500 },
        ],
      },
      {
        day: 'Rabu',
        menuName: 'Sop Daging Sandung Lamur & Perkedel Kentang',
        estCost: 39000,
        category: 'sayur',
        tip: 'Beli tetelan daging atau sandung lamur 150 gram, kaldu sapi gurih pekat untuk sup sekeluarga.',
        ingredients: [
          { name: 'Tetelan daging sapi 150 gram', cost: 18000 },
          { name: 'Paket sayur sop (wortel, kentang, seledri)', cost: 7000 },
          { name: 'Kentang 2 butir (perkedel)', cost: 6000 },
          { name: 'Bawang goreng & rempah pala', cost: 8000 },
        ],
      },
      {
        day: 'Kamis',
        menuName: 'Rica-Rica Ikan Tongkol & Tumis Labu Siam Telur Orak-Arik',
        estCost: 35000,
        category: 'ikan',
        tip: 'Kemangi dimasukkan di menit terakhir agar aromanya harum dan daun tidak layu hitam.',
        ingredients: [
          { name: 'Tongkol segar 300 gram potong dadu', cost: 15000 },
          { name: 'Labu siam iris korek api 2 buah', cost: 5000 },
          { name: 'Telur ayam 2 butir', cost: 5500 },
          { name: 'Bumbu rica pedas & kemangi', cost: 9500 },
        ],
      },
      {
        day: 'Jumat',
        menuName: 'Opor Ayam Putih Kentang & Sambal Goreng Tempe Kering',
        estCost: 38000,
        category: 'ayam',
        tip: 'Opor kuah putih gurih disukai anak-anak dan awet dihangatkan sampai malam.',
        ingredients: [
          { name: 'Ayam potong 1/2 kg', cost: 18000 },
          { name: 'Kentang potong 2 buah & santan', cost: 8000 },
          { name: 'Tempe 1 papan (kering balado)', cost: 5500 },
          { name: 'Bumbu opor & serai salam', cost: 6500 },
        ],
      },
      {
        day: 'Sabtu',
        menuName: 'Tongseng Jamur Tiram Telur Puyuh & Bakwan Sayur Renyah',
        estCost: 33000,
        category: 'telur',
        tip: 'Jamur tiram memiliki tekstur mirip daging ayam, sangat gurih saat dimasak kuah tongseng.',
        ingredients: [
          { name: 'Jamur tiram suwir 250 gram', cost: 7000 },
          { name: 'Telur puyuh 10 butir', cost: 8000 },
          { name: 'Kol & tomat merah segar', cost: 5000 },
          { name: 'Bumbu tongseng, santan & terigu bakwan', cost: 13000 },
        ],
      },
      {
        day: 'Minggu',
        menuName: 'Soto Ayam Lamongan Komplit & Koya Kerupuk Udang',
        estCost: 37500,
        category: 'ayam',
        tip: 'Haluskan kerupuk udang bersama bawang putih goreng untuk taburan koya khas soto Jawa.',
        ingredients: [
          { name: 'Ayam 300 gram (rebus kaldu & suwir)', cost: 12000 },
          { name: 'Bihun, kol, tauge soto', cost: 6000 },
          { name: 'Telur rebus 2 butir dibelah', cost: 5500 },
          { name: 'Bumbu soto kuning lengkap, seledri & jeruk', cost: 14000 },
        ],
      },
    ],
  };

  // Determine active recipes: use AI generated if available, otherwise curated plans
  const activeRecipes = aiResult ? aiResult.recipes : curatedPlans[budgetTier];

  const handleApply = (recipe: RecipeItem) => {
    if (onApplyRecipeToExpense) {
      onApplyRecipeToExpense(recipe.menuName, recipe.estCost);
      setCopiedDay(recipe.day);
      setTimeout(() => setCopiedDay(null), 3000);
    }
  };

  // Call Server-side Gemini API
  const handleGenerateAiMenu = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const response = await fetch('/api/ai/recommend-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remainingBudget: remainingFoodBudget,
          daysRemaining,
          dailyLimit,
          pantryIngredients: pantryInput.trim(),
          preferences: preferencesInput.trim(),
          targetDays,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal memproses rekomendasi AI');
      }

      setAiResult(resJson.data);
      if (resJson.data?.recipes?.length > 0) {
        setExpandedDay(resJson.data.recipes[0].day);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Gagal terhubung dengan server AI Gemini. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetToCurated = () => {
    setAiResult(null);
    setAiError(null);
    setExpandedDay('Senin');
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Banner & Context */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <ChefHat className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span>Tips Hemat Belanja &amp; Rekomendasi Menu</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>AI Gemini</span>
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Saran menu masakan keluarga disesuaikan otomatis dengan sisa jatah makan bulan ini ({formatRupiah(remainingFoodBudget)}) agar tidak melebihi pagu Rp1.200.000.
          </p>
        </div>

        {/* Action Buttons: AI Generator trigger + Budget Tier */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAiCustomizer(!showAiCustomizer)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showAiCustomizer ? 'Tutup Pengaturan AI' : 'Rekomendasi AI Baru'}</span>
          </button>

          {/* Dynamic Budget Diagnosis Badge */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 block">Jatah Harian Sisa Bulan:</span>
            <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
              {formatRupiah(avgDailyRemaining)} <span className="text-[10px] text-slate-500 font-normal">/hari</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Generator Panel (Customizer Card) */}
      {showAiCustomizer && (
        <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-emerald-50/30 border-b border-emerald-200/80 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Bot className="w-4 h-4 text-emerald-700" />
              <span>Personalisasi Menu Hemat Cerdas (Gemini AI)</span>
            </div>
            {aiResult && (
              <button
                onClick={handleResetToCurated}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Kembali ke Menu Bawaan</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
            {/* Input 1: Bahan di Dapur */}
            <div className="md:col-span-5">
              <label className="block font-semibold text-slate-700 mb-1">
                Bahan yang Ada di Kulkas / Dapur (Opsional):
              </label>
              <input
                type="text"
                value={pantryInput}
                onChange={(e) => setPantryInput(e.target.value)}
                placeholder="Contoh: telur 4 butir, tempe sisa kemarin, wortel"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                AI akan memprioritaskan bahan ini agar belanja pasar semakin hemat.
              </span>
            </div>

            {/* Input 2: Preferensi Masakan */}
            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">
                Preferensi Khusus / Pantangan:
              </label>
              <input
                type="text"
                value={preferencesInput}
                onChange={(e) => setPreferencesInput(e.target.value)}
                placeholder="Contoh: tidak pedas untuk anak, hemat minyak goreng"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Bisa diisi selera keluarga atau metode masak (kukus/rebus).
              </span>
            </div>

            {/* Input 3: Jumlah Hari & Action */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Durasi Menu:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTargetDays(3)}
                    className={`py-1.5 px-2 rounded-md font-medium text-xs transition-colors ${
                      targetDays === 3
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    3 Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetDays(7)}
                    className={`py-1.5 px-2 rounded-md font-medium text-xs transition-colors ${
                      targetDays === 7
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    7 Hari (1 Mgg)
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateAiMenu}
                className="mt-3 w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghitung Menu AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buat Rekomendasi Menu AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {aiError && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}
        </div>
      )}

      {/* AI Result Header Pill (when AI recommendations are active) */}
      {aiResult && (
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Hasil Analisis AI Gemini untuk Keluarga Anda</span>
            </div>
            <p className="text-emerald-800/90 mt-0.5 leading-relaxed">
              {aiResult.summaryAdvice}
            </p>
          </div>

          <div className="flex items-center gap-4 text-right shrink-0">
            <div>
              <span className="text-[10px] text-emerald-700 block">Rata-rata Biaya AI:</span>
              <span className="font-mono font-bold text-emerald-950 text-sm">
                {formatRupiah(aiResult.averageDailyCost)}/hari
              </span>
            </div>
            <div className="border-l border-emerald-300 pl-4">
              <span className="text-[10px] text-emerald-700 block">Estimasi Hemat:</span>
              <span className="font-mono font-bold text-emerald-900 text-sm">
                +{formatRupiah(aiResult.savingsComparedToLimit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Smart Budgeting Advice Pillars (Only on curated mode or as background wisdom) */}
      {!aiResult && (
        <div className="p-5 bg-slate-50/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>1. Belanja Pasar Pagi Hari</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Beli sayuran &amp; bumbu di pasar tradisional sebelum jam 08.00 pagi. Harganya 30-40% lebih murah dibanding minimarket.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Trik Bumbu Dasar Siap Pakai</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Haluskan bumbu putih (bawang), merah (cabai), dan kuning (kunyit) untuk seminggu, simpan di wadah tertutup dalam kulkas.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <UtensilsCrossed className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Maksimalkan Tempe, Tahu &amp; Telur</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Protein nabati kaya gizi dan hemat. Variasikan dengan bacem, lodeh, mendoan, balado telur, atau orak-arik tauge.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-teal-600" />
              <span>4. Kunci Cadangan Hemat</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Bila hari ini belanja Rp22.000, simpan sisa Rp18.000 di cadangan untuk membeli beras 5kg atau minyak goreng 2L.
            </p>
          </div>
        </div>
      )}

      {/* Weekly Menu Accordion List */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-800">
              {aiResult ? 'Daftar Resep Rekomendasi Gemini AI' : 'Rencana Menu Masakan 7 Hari (Senin – Minggu)'}
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Rata-rata: {formatRupiah(Math.round(activeRecipes.reduce((s, r) => s + r.estCost, 0) / Math.max(1, activeRecipes.length)))} / hari
          </span>
        </div>

        {/* Loading Skeleton */}
        {isGenerating ? (
          <div className="space-y-3 py-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center gap-3 text-xs text-slate-600">
              <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />
              <span>
                Gemini AI sedang menyusun menu resep ekonomis dan menghitung taksiran harga pasar...
              </span>
            </div>
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-3">
            {activeRecipes.map((recipe) => {
              const isExpanded = expandedDay === recipe.day;
              const isJustCopied = copiedDay === recipe.day;

              return (
                <div
                  key={recipe.day}
                  className="rounded-xl border border-slate-200 bg-white transition-all overflow-hidden"
                >
                  {/* Header row */}
                  <div
                    onClick={() => setExpandedDay(isExpanded ? null : recipe.day)}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-xs font-bold text-slate-800 font-mono">
                        {recipe.day}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {recipe.menuName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs font-bold text-emerald-800 tabular-nums bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {formatRupiah(recipe.estCost)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded ingredients breakdown */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 text-xs">
                      <div className="mt-2 mb-3 p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2 text-[11px]">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{recipe.tip}</span>
                      </div>

                      <div className="font-semibold text-slate-700 mb-2">
                        Rincian Estimasi Belanja Bahan Pasar:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {recipe.ingredients.map((ing, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-[11px]"
                          >
                            <span className="text-slate-700">{ing.name}</span>
                            <span className="font-mono font-medium text-slate-900">
                              {formatRupiah(ing.cost)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <div className="text-[11px] text-slate-500">
                          Total Anggaran Sehari: <strong className="text-slate-800">{formatRupiah(recipe.estCost)}</strong>{' '}
                          <span className="text-emerald-700 font-medium">
                            (Hemat {formatRupiah(dailyLimit - recipe.estCost)} dari batas Rp40rb)
                          </span>
                        </div>

                        {onApplyRecipeToExpense && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(recipe);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              isJustCopied
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isJustCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Tercatat ke Belanja!</span>
                              </>
                            ) : (
                              <>
                                <span>Catat Menu Ini</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
