import React from 'react';
import {
  Wallet,
  Coins,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { MonthlyBudgetConfig } from '../types/finance';

interface BudgetOverviewCardsProps {
  config: MonthlyBudgetConfig;
  totalFoodSpent: number;
  totalHusbandSpent: number;
  yearlySavingsProgress: {
    totalSaved: number;
    progressPercent: number;
    targetTotal: number;
  };
  onNavigateTab: (tab: string) => void;
}

export const BudgetOverviewCards: React.FC<BudgetOverviewCardsProps> = ({
  config,
  totalFoodSpent,
  totalHusbandSpent,
  yearlySavingsProgress,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-4">
      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pemasukan Bulanan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Total Pemasukan Bulanan</span>
              <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {formatRupiah(config.totalIncome)}
              </h3>
            </div>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Gaji Pokok: {formatRupiah(config.gajiPokok)}</span>
            <span>Tukin: {formatRupiah(config.tukin)}</span>
          </div>
        </div>

        {/* Card 2: Uang Istri (Terbagi Habis) */}
        <div
          onClick={() => onNavigateTab('makan')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span>Alokasi Uang Istri</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {formatRupiah(config.istriTotal)}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-0.5">
            <div className="flex justify-between">
              <span>Makan (Rp40rb/hr):</span>
              <span className="font-mono font-medium text-slate-800">{formatRupiah(config.makanBulanan)}</span>
            </div>
            <div className="flex justify-between">
              <span>Arisan & Siharta:</span>
              <span className="font-mono font-medium text-slate-800">
                {formatRupiah(config.arisanIstri + config.tabunganSiharta)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Uang Suami */}
        <div
          onClick={() => onNavigateTab('suami')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span>Uang Suami (Bensin/Rokok)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {formatRupiah(config.suamiTotal)}
              </h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Terpakai: {formatRupiah(totalHusbandSpent)}</span>
            <span className="font-medium text-indigo-700">
              Sisa: {formatRupiah(config.suamiTotal - totalHusbandSpent)}
            </span>
          </div>
        </div>

        {/* Card 4: Target Tabungan Setahun */}
        <div
          onClick={() => onNavigateTab('arisan-tabungan')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span>Target Tabungan Setahun</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
                {formatRupiah(config.targetTabunganTotalSetahun)}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Terkumpul {yearlySavingsProgress.progressPercent}%</span>
              <span className="font-mono font-medium text-slate-900">
                {formatRupiah(yearlySavingsProgress.totalSaved)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${yearlySavingsProgress.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Structured Budget Breakdown Strip (Gaji Pokok vs Tukin) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Box: Gaji Pokok Rp3.388.000 */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Pos Gaji Pokok (Terbagi Habis)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Dialokasikan tuntas untuk jatah istri dan suami
              </p>
            </div>
            <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
              {formatRupiah(config.gajiPokok)}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-medium text-slate-800">Uang Istri</span>
                <span className="text-slate-400">· Makan Rp1.2jt, Arisan Rp500rb, Siharta Rp300rb</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{formatRupiah(config.istriTotal)}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="font-medium text-slate-800">Uang Suami</span>
                <span className="text-slate-400">· Bensin, rokok, kebutuhan pribadi</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{formatRupiah(config.suamiTotal)}</span>
            </div>
          </div>
        </div>

        {/* Right Box: Tukin Rp3.823.000 */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Pos Tukin (Tunjangan Kinerja)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Rp800.000 arisan suami, sisanya ditabung Rp3.023.000
              </p>
            </div>
            <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
              {formatRupiah(config.tukin)}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="font-medium text-slate-800">Arisan Suami</span>
                <span className="text-slate-400">· Pengeluaran rutin bulanan</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{formatRupiah(config.arisanSuami)}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-800">Tabungan Tukin</span>
                <span className="text-slate-400">· Sisa tukin (Target setahun Rp36.276.000)</span>
              </div>
              <span className="font-mono font-semibold text-emerald-800">{formatRupiah(config.tabunganTukin)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
