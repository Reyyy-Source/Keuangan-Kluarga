import React from 'react';
import { X, Printer, CheckCircle2, TrendingUp, Calendar, FileSpreadsheet } from 'lucide-react';
import { formatRupiah, formatNumberIndo } from '../utils/formatters';
import { MonthlyBudgetConfig } from '../types/finance';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  config: MonthlyBudgetConfig;
  totalFoodSpent: number;
  totalHusbandSpent: number;
  totalArisanSpent: number;
  totalSavedThisMonth: number;
  yearlySavingsProgress: {
    totalSaved: number;
    progressPercent: number;
    targetTotal: number;
  };
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  selectedMonth,
  config,
  totalFoodSpent,
  totalHusbandSpent,
  totalArisanSpent,
  totalSavedThisMonth,
  yearlySavingsProgress,
}) => {
  if (!isOpen) return null;

  const totalPengeluaranRutinDanBelanja = totalFoodSpent + totalHusbandSpent + totalArisanSpent;
  const sisaBersihBulanIni = config.totalIncome - totalPengeluaranRutinDanBelanja - totalSavedThisMonth;
  const savingsRate = Math.round((totalSavedThisMonth / config.totalIncome) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable slip header */}
        <div className="text-center pb-5 border-b border-slate-200">
          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
            Laporan Keuangan Keluarga
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Rekap Bulanan Periode {selectedMonth}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dicetak otomatis dari Aplikasi Pengelolaan Keuangan Keluarga
          </p>
        </div>

        {/* Section 1: Pemasukan */}
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Ringkasan Pemasukan Bulanan
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600">Gaji Pokok:</span>
                <span className="font-mono font-medium text-slate-900">{formatRupiah(config.gajiPokok)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tukin (Tunjangan Kinerja):</span>
                <span className="font-mono font-medium text-slate-900">{formatRupiah(config.tukin)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-200 font-bold text-slate-900">
                <span>Total Pemasukan:</span>
                <span className="font-mono text-emerald-800 text-sm">{formatRupiah(config.totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Realisasi Pengeluaran */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Realisasi Pengeluaran & Anggaran
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Pos Pengeluaran</th>
                    <th className="py-2.5 px-3 text-right">Anggaran</th>
                    <th className="py-2.5 px-3 text-right">Realisasi</th>
                    <th className="py-2.5 px-3 text-right">Sisa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-3 font-sans">Makan Keluarga (Rp40rb/hr)</td>
                    <td className="py-2 px-3 text-right">{formatRupiah(config.makanBulanan)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-semibold">{formatRupiah(totalFoodSpent)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-medium">
                      {formatRupiah(config.makanBulanan - totalFoodSpent)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">Uang Suami (Bensin/Rokok)</td>
                    <td className="py-2 px-3 text-right">{formatRupiah(config.suamiTotal)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-semibold">{formatRupiah(totalHusbandSpent)}</td>
                    <td className="py-2 px-3 text-right text-indigo-700 font-medium">
                      {formatRupiah(config.suamiTotal - totalHusbandSpent)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">Arisan Istri & Suami</td>
                    <td className="py-2 px-3 text-right">{formatRupiah(config.arisanIstri + config.arisanSuami)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-semibold">{formatRupiah(totalArisanSpent)}</td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {formatRupiah((config.arisanIstri + config.arisanSuami) - totalArisanSpent)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Tabungan */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Tabungan Terkumpul & Target Setahun
            </h4>
            <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-emerald-900">Tabungan Tukin Bulan Ini:</span>
                <span className="font-mono font-medium text-emerald-950">{formatRupiah(config.tabunganTukin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-900">Tabungan Siharta Bulan Ini:</span>
                <span className="font-mono font-medium text-emerald-950">{formatRupiah(config.tabunganSiharta)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-emerald-200 font-bold text-emerald-950">
                <span>Total Tabungan Masuk Bulan Ini ({savingsRate}% dari Gaji):</span>
                <span className="font-mono text-sm">{formatRupiah(config.tabunganTukin + config.tabunganSiharta)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-700 pt-1">
                <span>Akumulasi Tabungan Menuju Target Setahun ({yearlySavingsProgress.progressPercent}%):</span>
                <span className="font-mono font-bold">
                  {formatRupiah(yearlySavingsProgress.totalSaved)} / {formatRupiah(config.targetTabunganTotalSetahun)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Keluarga Sejahtera &amp; Finansial Disiplin
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
