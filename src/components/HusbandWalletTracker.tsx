import React, { useState } from 'react';
import {
  UserCheck,
  Fuel,
  Cigarette,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Transaction } from '../types/finance';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface HusbandWalletTrackerProps {
  totalBudget: number; // 1.388.000
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
}

export const HusbandWalletTracker: React.FC<HusbandWalletTrackerProps> = ({
  totalBudget,
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const husbandTransactions = transactions.filter((t) => t.pocket === 'uang_suami');
  const totalSpent = husbandTransactions.reduce((acc, t) => acc + t.amount, 0);
  const remaining = totalBudget - totalSpent;
  const progressPct = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  // Category breakdown
  const bensinSpent = husbandTransactions
    .filter((t) => t.category === 'suami_bensin')
    .reduce((s, t) => s + t.amount, 0);

  const rokokSpent = husbandTransactions
    .filter((t) => t.category === 'suami_rokok')
    .reduce((s, t) => s + t.amount, 0);

  const pribadiSpent = husbandTransactions
    .filter((t) => t.category === 'suami_pribadi')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <UserCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Pengelolaan Uang Suami (Rp1.388.000)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Alokasi dari gaji pokok untuk bensin motor/mobil, rokok, servis, dan kebutuhan harian suami.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Pengeluaran Suami</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500">Anggaran Bulanan</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {formatRupiah(totalBudget)}
            </div>
            <span className="text-[11px] text-slate-400">Jatah tetap setiap bulan</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500">Total Terpakai Bulan Ini</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {formatRupiah(totalSpent)}
            </div>
            <span className="text-[11px] text-slate-500">{progressPct}% dari kuota bulanan</span>
          </div>

          <div className={`p-4 rounded-lg border ${remaining >= 0 ? 'bg-indigo-50/60 border-indigo-200' : 'bg-rose-50 border-rose-200'}`}>
            <span className="text-xs text-slate-500">Sisa Uang Suami</span>
            <div className={`text-xl font-bold font-mono mt-1 tabular-nums ${remaining >= 0 ? 'text-indigo-900' : 'text-rose-600'}`}>
              {formatRupiah(remaining)}
            </div>
            <span className="text-[11px] font-medium text-slate-600">
              {remaining >= 0 ? 'Masih tersedia untuk sisa bulan' : 'Melebihi anggaran!'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all ${
                totalSpent > totalBudget ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Fuel className="w-3.5 h-3.5 text-indigo-600" />
              <span>Bensin:</span>
            </div>
            <span className="font-mono font-semibold text-slate-800">{formatRupiah(bensinSpent)}</span>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Cigarette className="w-3.5 h-3.5 text-violet-600" />
              <span>Rokok:</span>
            </div>
            <span className="font-mono font-semibold text-slate-800">{formatRupiah(rokokSpent)}</span>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Lain-lain:</span>
            </div>
            <span className="font-mono font-semibold text-slate-800">{formatRupiah(pribadiSpent)}</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">
            Riwayat Pengeluaran Uang Suami
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {husbandTransactions.length} transaksi tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Keperluan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {husbandTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada pengeluaran suami yang dicatat bulan ini.
                  </td>
                </tr>
              ) : (
                husbandTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {formatDateIndo(tx.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{tx.title}</div>
                      {tx.note && <div className="text-[11px] text-slate-400 italic">{tx.note}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {tx.category === 'suami_bensin' && 'Bensin'}
                      {tx.category === 'suami_rokok' && 'Rokok'}
                      {tx.category === 'suami_pribadi' && 'Pribadi / Servis'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatRupiah(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
