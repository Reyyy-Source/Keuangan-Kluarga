import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  Plus,
  Loader2,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Utensils,
  UserCheck,
  Users,
  BarChart3,
  Calculator,
  Download,
  RotateCcw,
  FileText,
  AlertCircle,
  PiggyBank,
  CreditCard,
} from 'lucide-react';
import { formatRupiah, formatNumberIndo } from '../utils/formatters';

interface AiFinanceSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  dailyRemaining: number;
  dailySpent: number;
  dailyLimit: number;
  monthlyRemaining: number;
  foodSavingsBuffer: number;
  unpaidPaylaterCount?: number;
  onOpenAddModal: () => void;
  onOpenSimulator: () => void;
  onOpenReportModal: () => void;
  onExport: () => void;
  onReset: () => void;
  onApplyBasketExpense: (title: string, amount: number, note: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const INDONESIA_REGIONS = [
  'Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi)',
  'Jawa Barat (Bandung, Cirebon, Tasikmalaya)',
  'Jawa Tengah & DIY (Semarang, Solo, Yogyakarta)',
  'Jawa Timur (Surabaya, Malang, Sidoarjo)',
  'Sumatera Utara (Medan & sekitarnya)',
  'Sumatera Barat (Padang & Bukittinggi)',
  'Sumatera Selatan & Lampung (Palembang, B.Lampung)',
  'Bali & Nusa Tenggara (Denpasar, Mataram)',
  'Kalimantan Barat & Timur (Pontianak, Balikpapan)',
  'Sulawesi Selatan (Makassar & sekitarnya)',
];

export const AiFinanceSidebar: React.FC<AiFinanceSidebarProps> = ({
  activeTab,
  onTabChange,
  dailyRemaining,
  dailySpent,
  dailyLimit,
  monthlyRemaining,
  foodSavingsBuffer,
  unpaidPaylaterCount = 0,
  onOpenAddModal,
  onOpenSimulator,
  onOpenReportModal,
  onExport,
  onReset,
  onApplyBasketExpense,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>(INDONESIA_REGIONS[0]);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiData, setAiData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showPriceList, setShowPriceList] = useState<boolean>(false);

  // Auto fetch initial AI guidance on mount or region change with caching
  const fetchMarketAssistant = async (customQuestion?: string) => {
    const cacheKey = `market_ai_cache_${selectedRegion}`;
    
    // Check cache first for standard region view (instant load)
    if (!customQuestion) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.staplePrices) {
            setAiData(parsed);
            setErrorMsg(null);
            return;
          }
        }
      } catch (e) {
        // ignore storage error
      }
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/ai/market-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion,
          dailyBudgetRemaining: Math.max(15000, dailyRemaining),
          monthlyBudgetRemaining: monthlyRemaining,
          userQuestion: customQuestion || userPrompt.trim(),
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Layanan AI sedang sibuk. Silakan coba kembali.');
      }

      setAiData(resJson.data);
      if (!customQuestion && resJson.data) {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(resJson.data));
        } catch (e) {}
      }
      if (customQuestion) setUserPrompt('');
    } catch (err: any) {
      console.warn('Market assistant fetch notice:', err);
      const is503 =
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE');
      
      setErrorMsg(
        is503
          ? 'Model AI sedang mengalami lonjakan trafik sementara. Data pasar lokal tetap aman diakses.'
          : 'Koneksi ke server AI terganggu sejenak. Silakan coba beberapa saat lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMarketAssistant();
  }, [selectedRegion]);

  const handleApplyBasket = () => {
    if (!aiData?.smartBasket) return;
    const { title, totalCost, mealIdea } = aiData.smartBasket;
    onApplyBasketExpense(title, totalCost, `Rekomendasi AI (${selectedRegion}): ${mealIdea}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'makan', label: 'Jatah Makan Rp40rb', icon: Utensils },
    { id: 'suami', label: 'Uang Suami', icon: UserCheck },
    { id: 'arisan-tabungan', label: 'Arisan & Tabungan', icon: Users },
    { id: 'paylater', label: 'Tagihan Paylater', icon: CreditCard, count: unpaidPaylaterCount },
    { id: 'laporan', label: 'Laporan & Grafik', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-700 text-white rounded-lg shadow-xs">
                <Utensils className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  KeuanganKeluarga
                </h1>
                <span className="text-[10px] text-slate-500 font-mono">
                  Gaji Rp3.38jt · Tukin Rp3.82jt
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Center Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Navigation Menu (Left Side, As Requested) */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Menu Navigasi
            </div>
            <nav className="space-y-1 text-xs font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-amber-400 text-amber-950'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Primary Button */}
          <div>
            <button
              onClick={() => {
                onOpenAddModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Belanja Baru</span>
            </button>
          </div>

          {/* Widget: AI Assistant Keuangan & Pasar Terkini */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-3.5">
            {/* Widget Title */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold text-slate-900">
                  AI Assistant Keuangan
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                Gemini Pasar
              </span>
            </div>

            {/* Region Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Pilih Wilayah Domisili:</span>
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                {INDONESIA_REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Budget Context Badge */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span>Sisa Jatah Hari Ini:</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {formatRupiah(dailyRemaining)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Batas Harian:</span>
                <span className="font-mono">{formatRupiah(dailyLimit)}</span>
              </div>
              {foodSavingsBuffer > 0 && (
                <div className="flex justify-between items-center text-[11px] text-emerald-800 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <PiggyBank className="w-3 h-3 text-emerald-600" />
                    <span>Cadangan Hemat:</span>
                  </span>
                  <span className="font-mono font-semibold">+{formatRupiah(foodSavingsBuffer)}</span>
                </div>
              )}
            </div>

            {/* AI Assistant Output Card */}
            {isLoading ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-500">
                <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />
                <span>Mengecek harga pasar {selectedRegion.split(' ')[0]}...</span>
              </div>
            ) : errorMsg ? (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight">
                  <span>{errorMsg}</span>
                  <button
                    onClick={() => fetchMarketAssistant()}
                    className="block mt-1 font-semibold text-rose-900 underline"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            ) : aiData ? (
              <div className="space-y-3">
                {/* Market Insight Note */}
                <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {aiData.marketInsight}
                </p>

                {/* Smart Basket Recommendation */}
                {aiData.smartBasket && (
                  <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-950 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{aiData.smartBasket.title}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-900 tabular-nums">
                        {formatRupiah(aiData.smartBasket.totalCost)}
                      </span>
                    </div>

                    <div className="space-y-1 mb-2">
                      {aiData.smartBasket.items.map((it: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-[11px] text-slate-700"
                        >
                          <span>
                            • {it.name} <span className="text-slate-400">({it.qty})</span>
                          </span>
                          <span className="font-mono text-slate-900">{formatRupiah(it.price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-emerald-900 bg-white/80 p-2 rounded border border-emerald-200/80 mb-2.5">
                      <strong>Ide Masakan:</strong> {aiData.smartBasket.mealIdea}
                    </div>

                    <button
                      onClick={handleApplyBasket}
                      className={`w-full py-1.5 px-2.5 rounded-md text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs ${
                        isCopied
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-800 text-white hover:bg-emerald-900'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Sudah Tercatat ke Belanja!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Catat Paket Ini ({formatRupiah(aiData.smartBasket.totalCost)})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Staple Prices Collapsible */}
                {aiData.staplePrices && (
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
                    <button
                      onClick={() => setShowPriceList(!showPriceList)}
                      className="w-full p-2.5 flex items-center justify-between text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Harga Komoditas Pasar ({aiData.staplePrices.length})</span>
                      </span>
                      {showPriceList ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {showPriceList && (
                      <div className="p-2 pt-0 border-t border-slate-100 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                        {aiData.staplePrices.map((sp: any, i: number) => {
                          const isUp = sp.trend === 'naik';
                          const isDown = sp.trend === 'turun';
                          return (
                            <div key={i} className="py-1.5 flex items-center justify-between text-[11px]">
                              <div>
                                <span className="font-medium text-slate-800">{sp.commodity}</span>
                                <span className="text-slate-400 text-[10px] ml-1">({sp.unit})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-semibold text-slate-900">
                                  {formatRupiah(sp.estimatedPrice)}
                                </span>
                                {isUp && <span title="Harga Naik"><TrendingUp className="w-3 h-3 text-rose-500" /></span>}
                                {isDown && <span title="Harga Turun"><TrendingDown className="w-3 h-3 text-emerald-600" /></span>}
                                {!isUp && !isDown && <span title="Stabil"><Minus className="w-3 h-3 text-slate-300" /></span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Tactical Tips */}
                {aiData.tacticalTips && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Tips Belanja Hemat Lokal:
                    </span>
                    {aiData.tacticalTips.map((tip: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Quick Ask Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (userPrompt.trim()) fetchMarketAssistant(userPrompt.trim());
              }}
              className="relative mt-2"
            >
              <input
                type="text"
                placeholder="Tanya harga atau saran bahan..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || !userPrompt.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Utility Tools */}
          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
            <button
              onClick={() => {
                onOpenSimulator();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Calculator className="w-4 h-4 text-slate-500" />
              <span>Simulasi Belanja Harian</span>
            </button>
            <button
              onClick={() => {
                onOpenReportModal();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Rekap Slip Bulanan</span>
            </button>
            <div className="flex items-center gap-1 px-1 pt-1">
              <button
                onClick={onExport}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Backup JSON</span>
              </button>
              <button
                onClick={onReset}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-600 hover:text-rose-700 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
          <span className="text-[10px] text-slate-400 font-medium">
            Jatah Maksimal Makan: Rp40.000 / Hari
          </span>
        </div>
      </aside>
    </>
  );
};
