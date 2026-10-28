import React, { useState } from 'react';
import {
  Calculator,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  ArrowRight,
} from 'lucide-react';
import { formatRupiah, formatNumberIndo } from '../utils/formatters';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyLimit?: number; // 1.200.000
  dailyLimit?: number; // 40.000
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  monthlyLimit = 1200000,
  dailyLimit = 40000,
}) => {
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [todaySpend, setTodaySpend] = useState<number>(35000);
  const [priorSpend, setPriorSpend] = useState<number>(35000);

  if (!isOpen) return null;

  const totalPriorDays = Math.max(0, dayOfMonth - 1);
  const totalPriorLimit = totalPriorDays * dailyLimit;
  const priorSavingsBuffer = Math.max(0, totalPriorLimit - priorSpend);

  const sisaJatahHariIni = dailyLimit - todaySpend;
  const totalBelanjaSampaiHariIni = priorSpend + todaySpend;
  const sisaAnggaranBulanan = monthlyLimit - totalBelanjaSampaiHariIni;

  // Status
  let statusText = 'Pengeluaran masih dalam batas aman jatah harian (<= Rp35.000).';
  let statusBadge = 'Aman';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let Icon = CheckCircle2;

  if (todaySpend > dailyLimit) {
    statusText = `Pengeluaran melebihi jatah Rp40.000 sebesar ${formatRupiah(
      todaySpend - dailyLimit
    )}. Gunakan cadangan hemat hari sebelumnya.`;
    statusBadge = 'Peringatan Merah: Overbudget';
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    Icon = AlertCircle;
  } else if (todaySpend > 35000) {
    statusText = 'Pengeluaran mendekati batas maksimal (Rp35.000 - Rp40.000). Waspada!';
    statusBadge = 'Peringatan: Mendekati Batas';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = AlertTriangle;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            <Calculator className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Simulasi Pencatatan Belanja Makan Harian
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Uji simulasi kalkulator belanja harian untuk memastikan jatah bulanan Rp1.200.000 tetap aman terkendali.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hari ke berapa dalam bulan ini? (1 – 30)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={31}
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
                className="w-24 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-500 font-mono">
                Tanggal {dayOfMonth}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total belanja makan hari ini (Rp)
            </label>
            <input
              type="number"
              step={1000}
              value={todaySpend}
              onChange={(e) => setTodaySpend(Number(e.target.value) || 0)}
              className="w-full text-sm font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Contoh: 35000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total belanja makan sebelum hari ini (Rp)
            </label>
            <input
              type="number"
              step={1000}
              value={priorSpend}
              onChange={(e) => setPriorSpend(Number(e.target.value) || 0)}
              className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Contoh: 70000"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Jatah kuota sebelum hari ini: {formatRupiah(totalPriorLimit)}
            </span>
          </div>
        </div>

        {/* Results Card */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Sisa Jatah Hari Ini</span>
              <span
                className={`text-lg font-bold font-mono tabular-nums ${
                  sisaJatahHariIni >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatRupiah(sisaJatahHariIni)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Sisa Anggaran Bulanan</span>
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {formatRupiah(sisaAnggaranBulanan)}
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${badgeColor}`}>
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block">{statusBadge}</span>
              <p className="mt-0.5">{statusText}</p>
            </div>
          </div>

          {/* Savings buffer remark */}
          {sisaJatahHariIni > 0 && (
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Sisa {formatRupiah(sisaJatahHariIni)} menjadi cadangan belanja bahan pokok hari berikutnya.
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup Simulasi
          </button>
        </div>
      </div>
    </div>
  );
};
