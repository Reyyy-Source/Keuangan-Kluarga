import { ExpenseCategory, MainPocket } from '../types/finance';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, '');
}

export function formatNumberIndo(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export interface CategoryMeta {
  label: string;
  pocket: MainPocket;
  pocketLabel: string;
  tagColor: string;
}

export const CATEGORY_DEFINITIONS: Record<ExpenseCategory, CategoryMeta> = {
  makan_sayur: {
    label: 'Sayur-Mayur & Buah',
    pocket: 'makan_keluarga',
    pocketLabel: 'Makan Keluarga',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  makan_lauk: {
    label: 'Lauk (Ikan/Ayam/Telur/Tahu)',
    pocket: 'makan_keluarga',
    pocketLabel: 'Makan Keluarga',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  makan_pokok: {
    label: 'Bahan Pokok (Beras/Minyak)',
    pocket: 'makan_keluarga',
    pocketLabel: 'Makan Keluarga',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  makan_bumbu: {
    label: 'Bumbu Dapur & Gas/Galon',
    pocket: 'makan_keluarga',
    pocketLabel: 'Makan Keluarga',
    tagColor: 'text-stone-700 bg-stone-100 border-stone-200',
  },
  makan_jajan: {
    label: 'Jajan & Sarapan Luar',
    pocket: 'makan_keluarga',
    pocketLabel: 'Makan Keluarga',
    tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
  },
  makan_lainnya: {
    label: 'Kebutuhan Dapur Lainnya',
    pocket: 'makan_keluarga',
    pocketLabel: 'Makan Keluarga',
    tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  suami_bensin: {
    label: 'Bensin Motor / Mobil',
    pocket: 'uang_suami',
    pocketLabel: 'Uang Suami',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  suami_rokok: {
    label: 'Rokok Suami',
    pocket: 'uang_suami',
    pocketLabel: 'Uang Suami',
    tagColor: 'text-violet-700 bg-violet-50 border-violet-200',
  },
  suami_pribadi: {
    label: 'Kebutuhan Pribadi Suami',
    pocket: 'uang_suami',
    pocketLabel: 'Uang Suami',
    tagColor: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  arisan_istri: {
    label: 'Setoran Arisan Istri',
    pocket: 'arisan',
    pocketLabel: 'Arisan',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  arisan_suami: {
    label: 'Setoran Arisan Suami (Tukin)',
    pocket: 'arisan',
    pocketLabel: 'Arisan',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  tabungan_siharta: {
    label: 'Setoran Tabungan Siharta',
    pocket: 'tabungan',
    pocketLabel: 'Tabungan',
    tagColor: 'text-emerald-800 bg-emerald-100 border-emerald-300',
  },
  tabungan_tukin: {
    label: 'Setoran Tabungan Tukin',
    pocket: 'tabungan',
    pocketLabel: 'Tabungan',
    tagColor: 'text-cyan-800 bg-cyan-100 border-cyan-300',
  },
  pengeluaran_lain: {
    label: 'Pengeluaran Tak Terduga',
    pocket: 'makan_keluarga',
    pocketLabel: 'Lain-lain',
    tagColor: 'text-gray-700 bg-gray-100 border-gray-200',
  },
  bayar_paylater: {
    label: 'Cicilan / Tagihan Paylater',
    pocket: 'paylater',
    pocketLabel: 'Paylater',
    tagColor: 'text-orange-800 bg-orange-100 border-orange-300',
  },
};
