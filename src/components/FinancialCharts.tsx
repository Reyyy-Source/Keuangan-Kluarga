import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatRupiah, formatNumberIndo } from '../utils/formatters';
import { MonthlyBudgetConfig } from '../types/finance';

interface FinancialChartsProps {
  dailyFoodMap: Map<number, number>;
  selectedMonth: string;
  config: MonthlyBudgetConfig;
  weeklyBreakdown: Array<{
    weekNum: number;
    range: string;
    total: number;
    budget: number;
  }>;
  totalFoodSpent: number;
  totalHusbandSpent: number;
  yearlySavings: {
    tukinSavedTotal: number;
    sihartaSavedTotal: number;
    totalSaved: number;
    progressPercent: number;
    targetTukin: number;
    targetSiharta: number;
    targetTotal: number;
  };
  onSelectDay: (day: number) => void;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  dailyFoodMap,
  selectedMonth,
  config,
  weeklyBreakdown,
  totalFoodSpent,
  totalHusbandSpent,
  yearlySavings,
  onSelectDay,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Month days count
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Max scale for daily chart (at least 60.000 to leave breathing room for the 40.000 line)
  let maxDaily = 50000;
  dailyFoodMap.forEach((spent) => {
    if (spent > maxDaily) maxDaily = spent + 10000;
  });

  return (
    <div className="space-y-6">
      {/* 1. Daily Food Spending Chart with Rp40.000 Ceiling Line */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Grafik Pengeluaran Makan Harian (Batas Rp40.000)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Garis putus-putus merah menandakan batas maksimal Rp40.000/hari. Kuning menandakan ambang waspada Rp35.000.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <span className="text-slate-600">Aman (≤ 35rb)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              <span className="text-slate-600">Waspada (35-40rb)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
              <span className="text-slate-600">Overbudget (&gt; 40rb)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="mt-6 relative">
          {/* Reference Lines */}
          <div className="h-64 sm:h-72 w-full flex items-end gap-1 sm:gap-1.5 pt-8 pb-6 px-1 relative">
            {/* Limit Line: Rp40.000 */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-rose-400 z-10 pointer-events-none flex justify-end"
              style={{
                bottom: `${(config.makanHarianLimit / maxDaily) * 100}%`,
              }}
            >
              <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded -translate-y-3.5 border border-rose-200">
                Batas Maks: Rp40.000
              </span>
            </div>

            {/* Warning Line: Rp35.000 */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-amber-300 z-10 pointer-events-none flex justify-end"
              style={{
                bottom: `${(config.makanWarningLimit / maxDaily) * 100}%`,
              }}
            >
              <span className="text-[10px] font-mono font-medium text-amber-700 bg-amber-50 px-1 py-0.2 rounded -translate-y-3 border border-amber-200 mr-28 sm:mr-32">
                Waspada: Rp35.000
              </span>
            </div>

            {/* Bars */}
            {daysArray.map((day) => {
              const spent = dailyFoodMap.get(day) || 0;
              const heightPct = Math.min(100, Math.max(3, (spent / maxDaily) * 100));

              let barColor = 'bg-emerald-500 hover:bg-emerald-600';
              if (spent > config.makanHarianLimit) {
                barColor = 'bg-rose-500 hover:bg-rose-600';
              } else if (spent > config.makanWarningLimit) {
                barColor = 'bg-amber-500 hover:bg-amber-600';
              } else if (spent === 0) {
                barColor = 'bg-slate-200 hover:bg-slate-300';
              }

              return (
                <div
                  key={day}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => onSelectDay(day)}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                >
                  {/* The Bar */}
                  <div
                    className={`w-full rounded-t-xs transition-all duration-200 ${barColor}`}
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Day Label */}
                  <span className="absolute -bottom-5 text-[10px] font-mono text-slate-500 group-hover:text-slate-900 group-hover:font-bold">
                    {day % 2 === 1 || daysInMonth <= 15 ? day : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Tooltip Card */}
          {hoveredDay !== null && (
            <div className="mt-4 p-3 bg-slate-900 text-white rounded-lg text-xs flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <span className="font-semibold">Tanggal {hoveredDay} {selectedMonth}:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {formatRupiah(dailyFoodMap.get(hoveredDay) || 0)}
                </span>
                <span className="text-slate-400">
                  {((dailyFoodMap.get(hoveredDay) || 0) <= config.makanWarningLimit)
                    ? '(Aman di bawah Rp35rb)'
                    : ((dailyFoodMap.get(hoveredDay) || 0) <= config.makanHarianLimit)
                    ? '(Mendekati jatah Rp40rb)'
                    : `(Overbudget ${formatRupiah((dailyFoodMap.get(hoveredDay) || 0) - config.makanHarianLimit)})`}
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">Klik bar untuk pilih tanggal</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Weekly Recap Table & Allocation Realization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rekap Mingguan Pengeluaran Makan */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Rekap Mingguan Jatah Makan</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              Total: {formatRupiah(totalFoodSpent)}
            </span>
          </div>

          <div className="space-y-3">
            {weeklyBreakdown.map((w) => {
              const diff = w.budget - w.total;
              const isSurplus = diff >= 0;
              const progressPct = Math.min(100, (w.total / (w.budget || 1)) * 100);

              return (
                <div key={w.weekNum} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-800 mb-1.5">
                    <span>
                      Minggu {w.weekNum} ({w.range})
                    </span>
                    <span className="font-mono font-semibold">
                      {formatRupiah(w.total)}{' '}
                      <span className="text-slate-400 font-normal">/ {formatRupiah(w.budget)}</span>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        w.total > w.budget
                          ? 'bg-rose-500'
                          : w.total > w.budget * 0.85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Status Jatah:</span>
                    <span
                      className={`font-mono font-semibold ${
                        isSurplus ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isSurplus
                        ? `Hemat +${formatRupiah(diff)}`
                        : `Overbudget -${formatRupiah(Math.abs(diff))}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Komposisi Alokasi Rp7.211.000 vs Realisasi */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-700" />
                <span>Alokasi Keuangan Keluarga (Rp7.211.000)</span>
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              {/* Pos Makan Keluarga */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
                    <span className="font-semibold text-slate-800">Makan Keluarga (Istri)</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatRupiah(config.makanBulanan)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Realisasi belanja: {formatRupiah(totalFoodSpent)}</span>
                  <span className="text-emerald-700 font-medium">
                    Sisa: {formatRupiah(config.makanBulanan - totalFoodSpent)}
                  </span>
                </div>
              </div>

              {/* Pos Uang Suami */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                    <span className="font-semibold text-slate-800">Uang Suami (Bensin/Rokok)</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatRupiah(config.suamiTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Realisasi terpakai: {formatRupiah(totalHusbandSpent)}</span>
                  <span className="text-indigo-700 font-medium">
                    Sisa: {formatRupiah(config.suamiTotal - totalHusbandSpent)}
                  </span>
                </div>
              </div>

              {/* Pos Arisan (Istri Rp500rb + Suami Rp800rb) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-purple-600" />
                    <span className="font-semibold text-slate-800">Arisan Keluarga (Istri + Suami)</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatRupiah(config.arisanIstri + config.arisanSuami)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Istri Rp500rb · Suami Rp800rb</span>
                  <span className="text-purple-700 font-medium">Rutin Bulanan</span>
                </div>
              </div>

              {/* Pos Tabungan Bersih (Tukin Rp3.023.000 + Siharta Rp300.000) */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-800" />
                    <span className="font-semibold text-emerald-900">Total Tabungan Bersih Bulanan</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-900">
                    {formatRupiah(config.tabunganTukin + config.tabunganSiharta)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700">
                  <span>Tukin Rp3.023.000 · Siharta Rp300.000</span>
                  <span className="font-medium">46% dari pemasukan total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Target Tabungan Setahun (Rp39.876.000) Milestone */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Progres Target Tabungan Setahun (12 Bulan)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target tahunan bersih: Tukin Rp36.276.000 + Siharta Rp3.600.000 = Rp39.876.000
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">Terkumpul Sejauh Ini</span>
            <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              {formatRupiah(yearlySavings.totalSaved)}
            </div>
          </div>
        </div>

        {/* 12-Month Timeline Badges */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>
              Progres Pencapaian: <strong className="text-slate-900">{yearlySavings.progressPercent}%</strong>
            </span>
            <span className="font-mono text-slate-500">
              Target: {formatRupiah(yearlySavings.targetTotal)}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${yearlySavings.progressPercent}%` }}
            />
          </div>

          {/* Month Step Indicators */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mt-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const isPastOrCurrent = m <= Math.max(1, Math.round(yearlySavings.progressPercent / 8.33));
              return (
                <div
                  key={m}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    isPastOrCurrent
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="block text-[10px] font-medium">Bulan {m}</span>
                  <span className="block text-[11px] font-mono font-semibold mt-0.5">
                    {isPastOrCurrent ? '✓' : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
