import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  Calendar,
  Utensils,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface DailyFoodRadarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  dailySpent: number;
  dailyLimit: number; // 40.000
  warningLimit: number; // 35.000
  dailyRemaining: number;
  status: 'safe' | 'warning' | 'danger';
  monthlySpent: number;
  monthlyLimit: number; // 1.200.000
  monthlyRemaining: number;
  savingsBuffer: number;
  onQuickAdd: (amount: number, label: string) => void;
  onOpenFullModal: () => void;
}

export const DailyFoodRadar: React.FC<DailyFoodRadarProps> = ({
  selectedDate,
  onSelectDate,
  dailySpent,
  dailyLimit,
  warningLimit,
  dailyRemaining,
  status,
  monthlySpent,
  monthlyLimit,
  monthlyRemaining,
  savingsBuffer,
  onQuickAdd,
  onOpenFullModal,
}) => {
  const percentageToday = Math.min(100, Math.round((dailySpent / dailyLimit) * 100));

  // Determine border and text styling based on strict prompt rules
  let statusBannerBg = 'bg-emerald-50 border-emerald-200 text-emerald-800';
  let statusBadge = 'Aman & Terkendali';
  let statusDescription = 'Belanja hari ini masih dalam batas aman jatah harian (<= Rp35.000).';
  let progressColor = 'bg-emerald-500';

  if (status === 'warning') {
    statusBannerBg = 'bg-amber-50 border-amber-200 text-amber-900';
    statusBadge = 'Peringatan: Mendekati Batas';
    statusDescription = 'Pengeluaran telah mencapai batas waspada (Rp35.000 - Rp40.000). Harap rem belanja.';
    progressColor = 'bg-amber-500';
  } else if (status === 'danger') {
    statusBannerBg = 'bg-rose-50 border-rose-200 text-rose-900';
    statusBadge = 'Peringatan Merah: Overbudget';
    statusDescription = `Pengeluaran hari ini melebihi jatah Rp40.000 sebesar ${formatRupiah(
      dailySpent - dailyLimit
    )}. Gunakan cadangan hemat hari sebelumnya.`;
    progressColor = 'bg-rose-500';
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header / Context Strip */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Utensils className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">
              Anggaran Makan Keluarga Harian
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Batas maksimal Rp40.000/hari untuk makan seluruh keluarga (Jatah 30 hari: Rp1.200.000)
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="dailyDate" className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Pilih Tanggal:</span>
          </label>
          <input
            id="dailyDate"
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="text-xs font-mono font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Status & Radar Meter */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Quota Breakdown */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-xs font-medium text-slate-500">
                Total Belanja Makan: <span className="text-slate-700 font-semibold">{formatDateIndo(selectedDate)}</span>
              </div>
              <div className="text-xs font-mono text-slate-500">
                Batas Jatah: <span className="font-semibold text-slate-800">{formatRupiah(dailyLimit)}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 tabular-nums">
                {formatRupiah(dailySpent)}
              </span>
              <span className="text-xs font-medium text-slate-500">
                dari batas Rp40.000
              </span>
            </div>

            {/* Gauge / Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
                <span>0</span>
                <span className="text-amber-600 font-medium">Batas Waspada Rp35rb</span>
                <span className="text-rose-600 font-medium">Maks Rp40rb</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                {/* 35k marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                  style={{ left: `${(warningLimit / dailyLimit) * 100}%` }}
                  title="Garis Batas Waspada Rp35.000"
                />
                <div
                  className={`h-full transition-all duration-300 rounded-full ${progressColor}`}
                  style={{ width: `${Math.min(100, (dailySpent / dailyLimit) * 100)}%` }}
                />
              </div>
            </div>

            {/* Status Banner */}
            <div className={`mt-4 p-3.5 rounded-lg border flex items-start gap-3 ${statusBannerBg}`}>
              {status === 'safe' && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />}
              {status === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />}
              {status === 'danger' && <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />}
              <div className="text-xs">
                <span className="font-bold tracking-tight block text-sm">{statusBadge}</span>
                <p className="mt-0.5 leading-relaxed">{statusDescription}</p>
              </div>
            </div>
          </div>

          {/* Quick Add Presets */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-600 mb-2 flex items-center justify-between">
              <span>+ Tambah Cepat Belanja Hari Ini:</span>
              <button
                onClick={onOpenFullModal}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>Input Rinci</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onQuickAdd(10000, 'Sayur Mayur Segar')}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+Rp10.000 Sayur</span>
              </button>
              <button
                onClick={() => onQuickAdd(20000, 'Lauk Tempe & Ikan/Ayam')}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+Rp20.000 Lauk</span>
              </button>
              <button
                onClick={() => onQuickAdd(35000, 'Belanja Lengkap Pasar')}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+Rp35.000 Paket</span>
              </button>
              <button
                onClick={() => onQuickAdd(40000, 'Belanja Maksimal Sehari')}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+Rp40.000 Full</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sisa Hari Ini, Sisa Bulanan, & Cadangan Hemat */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-700 tracking-wide mb-3">
              Kalkulasi Sisa Anggaran Makan
            </h3>

            {/* Sisa Hari Ini */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 mb-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Sisa Jatah Hari Ini:</span>
                <span className="font-mono text-slate-400">Rp40.000 - belanja</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-xl font-bold font-mono tabular-nums ${
                    dailyRemaining >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {formatRupiah(dailyRemaining)}
                </span>
                <span className="text-xs text-slate-500">
                  {dailyRemaining >= 0 ? 'bisa dibelanjakan' : 'defisit hari ini'}
                </span>
              </div>
            </div>

            {/* Sisa Anggaran Bulanan */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 mb-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Sisa Anggaran Makan Bulanan:</span>
                <span className="font-mono text-slate-400">dari Rp1.200.000</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {formatRupiah(monthlyRemaining)}
                </span>
                <span className="text-xs text-slate-500">
                  Terpakai: {formatRupiah(monthlySpent)}
                </span>
              </div>
            </div>

            {/* Cadangan Hemat (Savings Buffer) */}
            <div className="bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                <PiggyBank className="w-4 h-4 text-emerald-700" />
                <span>Akumulasi Cadangan Hemat Makan</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-bold font-mono text-emerald-800 tabular-nums">
                  +{formatRupiah(savingsBuffer)}
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  buffer belanja beras/minyak
                </span>
              </div>
              <p className="text-[11px] text-emerald-700/90 mt-1 leading-snug">
                Sisa jatah harian yang tidak terpakai dikumpulkan otomatis sebagai dana cadangan untuk belanja sembako/bahan pokok besar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
