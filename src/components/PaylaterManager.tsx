import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  X,
  Wallet,
} from 'lucide-react';
import { PaylaterBill } from '../types/finance';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface PaylaterManagerProps {
  bills: PaylaterBill[];
  metrics: {
    totalDue: number;
    totalPaid: number;
    totalUnpaid: number;
    burdenRatio: number;
    count: number;
    unpaidCount: number;
  };
  totalIncome: number;
  selectedDate: string;
  onPayBill: (billId: string, payDate?: string) => void;
  onAddBill: (newBill: Omit<PaylaterBill, 'id' | 'createdAt'>) => void;
  onDeleteBill: (id: string) => void;
}

const PLATFORMS = [
  'SPayLater (Shopee)',
  'GoPay Later (Gojek / Tokopedia)',
  'Kredivo',
  'Akulaku',
  'Indodana',
  'Traveloka Paylater',
  'Cicilan Kartu Kredit',
  'Lainnya',
];

export const PaylaterManager: React.FC<PaylaterManagerProps> = ({
  bills,
  metrics,
  totalIncome,
  selectedDate,
  onPayBill,
  onAddBill,
  onDeleteBill,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [itemName, setItemName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [totalTenor, setTotalTenor] = useState(6);
  const [paidTenor, setPaidTenor] = useState(0);
  const [dueDay, setDueDay] = useState(10);
  const [sourcePocket, setSourcePocket] = useState<'uang_suami' | 'makan_keluarga' | 'cadangan_khusus'>('uang_suami');
  const [notes, setNotes] = useState('');

  const todayDay = new Date().getDate();

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(monthlyAmount.replace(/[^0-9]/g, ''));
    if (!amountNum || amountNum <= 0 || !itemName.trim()) return;

    onAddBill({
      platform: platform.split(' ')[0],
      itemName: itemName.trim(),
      monthlyAmount: amountNum,
      totalTenor: Number(totalTenor) || 1,
      paidTenor: Number(paidTenor) || 0,
      dueDay: Number(dueDay) || 10,
      sourcePocket,
      isPaidThisMonth: false,
      notes: notes.trim() || undefined,
    });

    setItemName('');
    setMonthlyAmount('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Financial Health Metrics */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-orange-100 text-orange-800 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Pengelolaan &amp; Pembayaran Tagihan Paylater
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pantau jadwal jatuh tempo dan bayar cicilan paylater (SPayLater, GoPay Later, Kredivo, dll.) agar tidak terkena denda.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg shadow-xs transition-colors shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Tagihan Paylater</span>
          </button>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total Kewajiban Bulan Ini</span>
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums block mt-1">
              {formatRupiah(metrics.totalDue)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              {metrics.count} pos cicilan aktif
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200">
            <span className="text-[11px] text-emerald-800 block">Sudah Dibayar Bulan Ini</span>
            <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums block mt-1">
              {formatRupiah(metrics.totalPaid)}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
              {metrics.count - metrics.unpaidCount} tagihan lunas
            </span>
          </div>

          <div className={`p-3.5 rounded-lg border ${metrics.totalUnpaid > 0 ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[11px] text-slate-500 block">Sisa Tagihan Belum Lunas</span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-1 ${metrics.totalUnpaid > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
              {formatRupiah(metrics.totalUnpaid)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {metrics.unpaidCount > 0 ? `${metrics.unpaidCount} tagihan menanti bayar` : 'Semua tagihan lunas'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Rasio Beban Cicilan</span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-1 ${metrics.burdenRatio > 15 ? 'text-rose-600' : 'text-slate-900'}`}>
              {metrics.burdenRatio}% <span className="text-xs font-normal text-slate-400">dari gaji</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {metrics.burdenRatio <= 10 ? 'Sangat Aman (<10%)' : 'Waspada (>10%)'}
            </span>
          </div>
        </div>

        {/* Advice Callout */}
        <div className="mt-4 p-3 bg-orange-50/60 border border-orange-200 rounded-lg text-xs text-orange-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Disiplin Keuangan Keluarga:</strong> Pembayaran cicilan paylater sebaiknya diselesaikan di awal bulan segera setelah gaji pokok &amp; tukin cair agar tidak menumpuk dengan jatah belanja makan harian Rp40.000 atau mengurangi target tabungan setahun Rp39.876.000.
          </p>
        </div>
      </div>

      {/* 2. Daftar Tagihan Paylater */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">
            Daftar Tagihan &amp; Cicilan Berjalan
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {bills.length} tagihan terdaftar
          </span>
        </div>

        {bills.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Tidak ada tagihan paylater aktif.</p>
            <p className="mt-0.5">Keluarga bebas dari beban cicilan paylater!</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 text-orange-700 hover:underline font-semibold"
            >
              + Catat tagihan paylater jika ada
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bills.map((bill) => {
              const tenorPct = Math.min(100, Math.round((bill.paidTenor / bill.totalTenor) * 100));
              const daysUntilDue = bill.dueDay - todayDay;
              const isDueSoon = !bill.isPaidThisMonth && daysUntilDue >= 0 && daysUntilDue <= 3;
              const isOverdue = !bill.isPaidThisMonth && daysUntilDue < 0;

              return (
                <div key={bill.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Bill Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-orange-100 text-orange-800 border border-orange-200">
                          {bill.platform}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{bill.itemName}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Jatuh tempo: <strong>Tgl {bill.dueDay}</strong> tiap bulan</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Sumber dana:{' '}
                          <strong className="text-slate-700">
                            {bill.sourcePocket === 'uang_suami'
                              ? 'Uang Suami'
                              : bill.sourcePocket === 'makan_keluarga'
                              ? 'Jatah Istri'
                              : 'Cadangan Khusus'}
                          </strong>
                        </span>
                      </div>

                      {bill.notes && (
                        <p className="text-[11px] text-slate-400 italic">{bill.notes}</p>
                      )}
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block text-right">Cicilan per bulan:</span>
                        <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                          {formatRupiah(bill.monthlyAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {bill.isPaidThisMonth ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Lunas ({bill.paidDate ? formatDateIndo(bill.paidDate).split(' ')[0] + ' ' + formatDateIndo(bill.paidDate).split(' ')[1] : 'Bulan Ini'})</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onPayBill(bill.id, selectedDate)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg shadow-2xs transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Bayar Sekarang</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteBill(bill.id)}
                          title="Hapus tagihan ini"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tenor Progress Bar */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span>
                          Tenor: <strong className="text-slate-800">{bill.paidTenor}</strong> dari {bill.totalTenor} Bulan
                        </span>
                        <span className="text-slate-400">{tenorPct}% lunas</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-orange-600 rounded-full transition-all"
                          style={{ width: `${tenorPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Due warning tag */}
                    {!bill.isPaidThisMonth && (
                      <div className="shrink-0 text-right">
                        {isOverdue && (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Lewat Jatuh Tempo!
                          </span>
                        )}
                        {isDueSoon && (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Jatuh tempo {daysUntilDue === 0 ? 'hari ini' : `${daysUntilDue} hari lagi`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Modal Form: Tambah Tagihan Paylater Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-orange-100 text-orange-800 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Tambah Tagihan Paylater / Cicilan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Masukkan rincian cicilan bulanan agar selalu terpantau dan terbayar tepat waktu.
            </p>

            <form onSubmit={handleCreateBill} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penyedia / Platform Paylater
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Barang / Keperluan yang Dicicil
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Contoh: Kulkas 2 Pintu, Sembako Bulanan, HP Kerja"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cicilan per Bulan (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    placeholder="150000"
                    className="w-full font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dueDay}
                    onChange={(e) => setDueDay(Number(e.target.value))}
                    className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Tiap tgl {dueDay}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Tenor (Bulan)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    value={totalTenor}
                    onChange={(e) => setTotalTenor(Number(e.target.value))}
                    className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sudah Berjalan (Bulan)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={totalTenor}
                    value={paidTenor}
                    onChange={(e) => setPaidTenor(Number(e.target.value))}
                    className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sumber Dana Pembayaran
                </label>
                <select
                  value={sourcePocket}
                  onChange={(e) => setSourcePocket(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="uang_suami">Uang Suami (Rp1.388.000)</option>
                  <option value="makan_keluarga">Alokasi Uang Istri (Rp2.000.000)</option>
                  <option value="cadangan_khusus">Cadangan / Dana Lain</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Cicilan akun Shopee suami"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg shadow-2xs"
                >
                  Simpan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
