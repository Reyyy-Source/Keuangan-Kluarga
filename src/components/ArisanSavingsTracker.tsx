import React from 'react';
import {
  Users,
  PiggyBank,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { Transaction, MonthlyBudgetConfig } from '../types/finance';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface ArisanSavingsTrackerProps {
  config: MonthlyBudgetConfig;
  transactions: Transaction[];
  selectedMonth: string;
  onDeleteTransaction: (id: string) => void;
  onQuickAddRoutine: (
    category: 'arisan_istri' | 'arisan_suami' | 'tabungan_siharta' | 'tabungan_tukin',
    amount: number,
    title: string
  ) => void;
}

export const ArisanSavingsTracker: React.FC<ArisanSavingsTrackerProps> = ({
  config,
  transactions,
  selectedMonth,
  onDeleteTransaction,
  onQuickAddRoutine,
}) => {
  // Current month routine transactions
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));

  const arisanIstriTx = monthTransactions.find((t) => t.category === 'arisan_istri');
  const arisanSuamiTx = monthTransactions.find((t) => t.category === 'arisan_suami');
  const sihartaTx = monthTransactions.find((t) => t.category === 'tabungan_siharta');
  const tukinTx = monthTransactions.find((t) => t.category === 'tabungan_tukin');

  // Yearly cumulative calculations
  const allSiharta = transactions.filter((t) => t.category === 'tabungan_siharta');
  const allTukin = transactions.filter((t) => t.category === 'tabungan_tukin');

  const totalSihartaSaved = allSiharta.reduce((acc, t) => acc + t.amount, 0);
  const totalTukinSaved = allTukin.reduce((acc, t) => acc + t.amount, 0);
  const totalSavingsSoFar = totalSihartaSaved + totalTukinSaved;

  return (
    <div className="space-y-6">
      {/* 1. Arisan Tracker (Istri & Suami Terpisah) */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Pemantauan Arisan Keluarga (Total Rp1.300.000 / bulan)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Arisan istri Rp500.000 (dari gaji pokok) dan arisan suami Rp800.000 (dari tukin) dicatat terpisah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Arisan Istri Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Arisan Istri</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {formatRupiah(config.arisanIstri)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Sumber dana: Alokasi gaji pokok uang istri
              </p>

              {/* Status */}
              <div className="mt-3 flex items-center gap-2">
                {arisanIstriTx ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lunas Bulan Ini ({formatDateIndo(arisanIstriTx.date)})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                    <Clock className="w-4 h-4" />
                    <span>Belum Dicatat Bulan Ini</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              {!arisanIstriTx ? (
                <button
                  onClick={() =>
                    onQuickAddRoutine('arisan_istri', config.arisanIstri, 'Setoran Arisan Istri')
                  }
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Setor Rp500rb</span>
                </button>
              ) : (
                <button
                  onClick={() => onDeleteTransaction(arisanIstriTx.id)}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Batalkan / Hapus</span>
                </button>
              )}
            </div>
          </div>

          {/* Arisan Suami Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Arisan Suami</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {formatRupiah(config.arisanSuami)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Sumber dana: Dipotong langsung dari Tukin
              </p>

              {/* Status */}
              <div className="mt-3 flex items-center gap-2">
                {arisanSuamiTx ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lunas Bulan Ini ({formatDateIndo(arisanSuamiTx.date)})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                    <Clock className="w-4 h-4" />
                    <span>Belum Dicatat Bulan Ini</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              {!arisanSuamiTx ? (
                <button
                  onClick={() =>
                    onQuickAddRoutine('arisan_suami', config.arisanSuami, 'Setoran Arisan Suami (Tukin)')
                  }
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Setor Rp800rb</span>
                </button>
              ) : (
                <button
                  onClick={() => onDeleteTransaction(arisanSuamiTx.id)}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Batalkan / Hapus</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Target Tabungan Tahunan (Rp39.876.000) Breakdown */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <PiggyBank className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Target Tabungan Setahun (Rp39.876.000)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rencana akumulasi tabungan disiplin setiap bulan selama 12 bulan (belum termasuk bunga atau hasil investasi).
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">Terkumpul Keseluruhan</span>
            <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              {formatRupiah(totalSavingsSoFar)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Tabungan Tukin Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700">1. Tabungan dari Tukin</span>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {formatRupiah(config.tabunganTukin)}{' '}
                    <span className="text-xs font-normal text-slate-500">/ bulan</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  Target: {formatRupiah(config.targetTabunganTukinSetahun)}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Rp3.023.000 × 12 bulan = Rp36.276.000 setahun.
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <span>Setoran Bulan Ini:</span>
                {tukinTx ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Disimpan ({formatDateIndo(tukinTx.date)})</span>
                  </span>
                ) : (
                  <span className="text-amber-800 font-medium">Belum disimpan</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              {!tukinTx ? (
                <button
                  onClick={() =>
                    onQuickAddRoutine('tabungan_tukin', config.tabunganTukin, 'Setoran Tabungan Tukin Bulanan')
                  }
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simpan Rp3.023.000</span>
                </button>
              ) : (
                <button
                  onClick={() => onDeleteTransaction(tukinTx.id)}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Setoran</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabungan Siharta Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-700">2. Tabungan Siharta</span>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {formatRupiah(config.tabunganSiharta)}{' '}
                    <span className="text-xs font-normal text-slate-500">/ bulan</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  Target: {formatRupiah(config.targetTabunganSihartaSetahun)}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Rp300.000 × 12 bulan = Rp3.600.000 setahun (dari pos anggaran uang istri).
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <span>Setoran Bulan Ini:</span>
                {sihartaTx ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Disimpan ({formatDateIndo(sihartaTx.date)})</span>
                  </span>
                ) : (
                  <span className="text-amber-800 font-medium">Belum disimpan</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              {!sihartaTx ? (
                <button
                  onClick={() =>
                    onQuickAddRoutine('tabungan_siharta', config.tabunganSiharta, 'Setoran Tabungan Siharta')
                  }
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simpan Rp300.000</span>
                </button>
              ) : (
                <button
                  onClick={() => onDeleteTransaction(sihartaTx.id)}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Setoran</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
