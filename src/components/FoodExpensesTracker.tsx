import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Filter,
  Search,
  Info,
  Calendar,
} from 'lucide-react';
import { Transaction, ExpenseCategory } from '../types/finance';
import {
  formatRupiah,
  formatDateIndo,
  CATEGORY_DEFINITIONS,
} from '../utils/formatters';

interface FoodExpensesTrackerProps {
  transactions: Transaction[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: (prefillDate?: string) => void;
}

export const FoodExpensesTracker: React.FC<FoodExpensesTrackerProps> = ({
  transactions,
  selectedDate,
  onSelectDate,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const [filterDateMode, setFilterDateMode] = useState<'all' | 'today'>('today');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter food transactions
  const foodTransactions = transactions.filter(
    (t) => t.pocket === 'makan_keluarga'
  );

  const filtered = foodTransactions.filter((t) => {
    if (filterDateMode === 'today' && t.date !== selectedDate) return false;
    if (selectedCat !== 'all' && t.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNote = t.note?.toLowerCase().includes(q);
      if (!matchTitle && !matchNote) return false;
    }
    return true;
  });

  const totalFiltered = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header and Advice Box */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Utensils className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Pencatatan Belanja Makan Harian Keluarga
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Catat setiap belanja sayur, lauk, beras, telur, minyak, bumbu, dan kebutuhan makan lainnya.
            </p>
          </div>

          <button
            onClick={() => onOpenAddModal(selectedDate)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Belanja Makan</span>
          </button>
        </div>

        {/* Golden Rule Callout Box */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Aturan Pengelolaan Makan:</strong> Batas maksimal Rp40.000/hari berlaku untuk total belanja makan keluarga sehari. Jika hari ini belanja Rp30.000, sisa Rp10.000 otomatis menjadi cadangan anggaran makan untuk belanja bahan pokok (beras, minyak, gas) pada hari berikutnya.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Toggle Mode: Hari Terpilih vs Semua Bulan */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setFilterDateMode('today')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterDateMode === 'today'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tanggal {selectedDate.split('-')[2]} ({formatDateIndo(selectedDate).split(' ')[1]})
          </button>
          <button
            onClick={() => setFilterDateMode('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterDateMode === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Hari Bulan Ini
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Kategori Makan</option>
            <option value="makan_sayur">Sayur & Buah</option>
            <option value="makan_lauk">Lauk (Ikan/Ayam/Telur/Tempe)</option>
            <option value="makan_pokok">Bahan Pokok (Beras/Minyak)</option>
            <option value="makan_bumbu">Bumbu & Gas/Galon</option>
            <option value="makan_jajan">Jajan & Sarapan</option>
            <option value="makan_lainnya">Dapur Lainnya</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari sayur, beras, telur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Tanggal & Waktu</th>
              <th className="py-3 px-4">Kebutuhan / Item Belanja</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-right">Nominal</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <Utensils className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium">Belum ada catatan belanja makan untuk kriteria ini.</p>
                  <button
                    onClick={() => onOpenAddModal(selectedDate)}
                    className="mt-2 text-emerald-700 hover:underline font-semibold"
                  >
                    + Catat belanja makan sekarang
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const meta = CATEGORY_DEFINITIONS[tx.category];
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">
                      <div>{formatDateIndo(tx.date)}</div>
                      <div className="text-[10px] text-slate-400">{tx.time || 'Pagi'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{tx.title}</div>
                      {tx.note && <div className="text-[11px] text-slate-400 italic mt-0.5">{tx.note}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 font-medium">
                        {meta ? meta.label : tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatRupiah(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        title="Hapus transaksi ini"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-900">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right">
                  Total Belanja Terpilih:
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-800 font-bold tabular-nums">
                  {formatRupiah(totalFiltered)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
