import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, FileText, Wallet } from 'lucide-react';
import { ExpenseCategory, MainPocket, Transaction } from '../types/finance';
import { CATEGORY_DEFINITIONS, formatRupiah, getTodayDateString } from '../utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  prefillDate?: string;
  defaultPocket?: MainPocket;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  prefillDate,
  defaultPocket = 'makan_keluarga',
}) => {
  const [pocket, setPocket] = useState<MainPocket>(defaultPocket);
  const [category, setCategory] = useState<ExpenseCategory>('makan_sayur');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(prefillDate || getTodayDateString());
  const [time, setTime] = useState<string>('08:00');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handlePocketChange = (newPocket: MainPocket) => {
    setPocket(newPocket);
    if (newPocket === 'makan_keluarga') setCategory('makan_sayur');
    else if (newPocket === 'uang_suami') setCategory('suami_bensin');
    else if (newPocket === 'arisan') setCategory('arisan_istri');
    else if (newPocket === 'tabungan') setCategory('tabungan_tukin');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!num || num <= 0) return;
    if (!title.trim()) return;

    onSave({
      pocket,
      category,
      title: title.trim(),
      amount: num,
      date,
      time,
      note: note.trim() || undefined,
    });

    // Reset and close
    setTitle('');
    setAmount('');
    setNote('');
    onClose();
  };

  const quickAmounts =
    pocket === 'makan_keluarga'
      ? [10000, 20000, 35000, 40000]
      : pocket === 'uang_suami'
      ? [20000, 50000, 100000]
      : pocket === 'arisan'
      ? [500000, 800000]
      : [300000, 3023000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            <Plus className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Catat Pengeluaran Baru
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Catat belanja makan harian, bensin suami, arisan, atau setoran tabungan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pos Selector (Segmented buttons) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pos Anggaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => handlePocketChange('makan_keluarga')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  pocket === 'makan_keluarga'
                    ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Makan Harian
              </button>
              <button
                type="button"
                onClick={() => handlePocketChange('uang_suami')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  pocket === 'uang_suami'
                    ? 'bg-white text-indigo-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Uang Suami
              </button>
              <button
                type="button"
                onClick={() => handlePocketChange('arisan')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  pocket === 'arisan'
                    ? 'bg-white text-purple-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Arisan
              </button>
              <button
                type="button"
                onClick={() => handlePocketChange('tabungan')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  pocket === 'tabungan'
                    ? 'bg-white text-teal-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabungan
              </button>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori Spesifik
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {pocket === 'makan_keluarga' && (
                <>
                  <option value="makan_sayur">Sayur-Mayur & Buah</option>
                  <option value="makan_lauk">Lauk (Ikan/Ayam/Telur/Tempe/Tahu)</option>
                  <option value="makan_pokok">Bahan Pokok (Beras/Minyak/Tepung)</option>
                  <option value="makan_bumbu">Bumbu Dapur & Gas/Galon</option>
                  <option value="makan_jajan">Jajan & Sarapan Siap Saji</option>
                  <option value="makan_lainnya">Kebutuhan Dapur Lainnya</option>
                </>
              )}
              {pocket === 'uang_suami' && (
                <>
                  <option value="suami_bensin">Bensin Motor / Mobil</option>
                  <option value="suami_rokok">Rokok Suami</option>
                  <option value="suami_pribadi">Kebutuhan Pribadi / Servis</option>
                </>
              )}
              {pocket === 'arisan' && (
                <>
                  <option value="arisan_istri">Arisan Istri (Rp500.000)</option>
                  <option value="arisan_suami">Arisan Suami dari Tukin (Rp800.000)</option>
                </>
              )}
              {pocket === 'tabungan' && (
                <>
                  <option value="tabungan_tukin">Tabungan Tukin (Rp3.023.000/bln)</option>
                  <option value="tabungan_siharta">Tabungan Siharta (Rp300.000/bln)</option>
                </>
              )}
            </select>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Item / Keperluan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                pocket === 'makan_keluarga'
                  ? 'Contoh: Sayur bayam, jagung, tempe & ikan tongkol'
                  : pocket === 'uang_suami'
                  ? 'Contoh: Isi bensin pertalite'
                  : 'Contoh: Setoran rutin bulanan'
              }
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              required
              min={1}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 35000"
              className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded border border-slate-200"
                >
                  {formatRupiah(q)}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Waktu (Opsional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Tambahan (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Belanja di pasar pagi, stok untuk 2 hari"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
