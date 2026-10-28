import { MonthlyBudgetConfig, Transaction, RoutinePaymentStatus, PaylaterBill } from '../types/finance';

export const DEFAULT_BUDGET_CONFIG: MonthlyBudgetConfig = {
  totalIncome: 7211000,
  gajiPokok: 3388000,
  tukin: 3823000,

  // Uang Istri
  istriTotal: 2000000,
  makanBulanan: 1200000,
  makanHarianLimit: 40000,
  makanWarningLimit: 35000,
  arisanIstri: 500000,
  tabunganSiharta: 300000,

  // Uang Suami
  suamiTotal: 1388000,

  // Tukin
  arisanSuami: 800000,
  tabunganTukin: 3023000,

  // Target Setahun (12 bulan)
  targetTabunganTukinSetahun: 36276000,
  targetTabunganSihartaSetahun: 3600000,
  targetTabunganTotalSetahun: 39876000,
};

// Generates sample transactions for the current month so user sees real charts immediately
export function generateInitialTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = Math.min(now.getDate(), 26);

  const transactions: Transaction[] = [];

  // Routine payments
  transactions.push({
    id: 'init-arisan-istri',
    date: `${year}-${monthStr}-05`,
    time: '09:00',
    title: 'Setor Arisan Istri (Ibu-Ibu RT)',
    amount: 500000,
    category: 'arisan_istri',
    pocket: 'arisan',
    note: 'Arisan bulanan putaran ke-4',
    createdAt: Date.now() - 20 * 86400000,
  });

  transactions.push({
    id: 'init-arisan-suami',
    date: `${year}-${monthStr}-05`,
    time: '10:30',
    title: 'Setor Arisan Suami (Kantor)',
    amount: 800000,
    category: 'arisan_suami',
    pocket: 'arisan',
    note: 'Dipotong langsung dari jatah Tukin',
    createdAt: Date.now() - 20 * 86400000,
  });

  transactions.push({
    id: 'init-tabungan-siharta',
    date: `${year}-${monthStr}-03`,
    time: '08:15',
    title: 'Transfer Tabungan Siharta',
    amount: 300000,
    category: 'tabungan_siharta',
    pocket: 'tabungan',
    note: 'Tabungan rencana masa depan keluarga',
    createdAt: Date.now() - 22 * 86400000,
  });

  transactions.push({
    id: 'init-tabungan-tukin',
    date: `${year}-${monthStr}-04`,
    time: '14:20',
    title: 'Simpan Tabungan Tukin Utama',
    amount: 3023000,
    category: 'tabungan_tukin',
    pocket: 'tabungan',
    note: 'Komitmen tabungan target tahunan Rp36.276.000',
    createdAt: Date.now() - 21 * 86400000,
  });

  // Sample husband expenses
  transactions.push({
    id: 'init-suami-bensin-1',
    date: `${year}-${monthStr}-02`,
    time: '07:30',
    title: 'Isi Pertalite Full Tank Motor',
    amount: 50000,
    category: 'suami_bensin',
    pocket: 'uang_suami',
    note: 'Untuk transport kerja minggu ke-1',
    createdAt: Date.now() - 23 * 86400000,
  });

  transactions.push({
    id: 'init-suami-rokok-1',
    date: `${year}-${monthStr}-04`,
    time: '17:00',
    title: 'Rokok Suami (2 Bungkus)',
    amount: 60000,
    category: 'suami_rokok',
    pocket: 'uang_suami',
    note: 'Jatah rokok mingguan',
    createdAt: Date.now() - 21 * 86400000,
  });

  transactions.push({
    id: 'init-suami-bensin-2',
    date: `${year}-${monthStr}-11`,
    time: '08:00',
    title: 'Isi Pertalite Motor',
    amount: 45000,
    category: 'suami_bensin',
    pocket: 'uang_suami',
    note: 'Minggu ke-2',
    createdAt: Date.now() - 14 * 86400000,
  });

  transactions.push({
    id: 'init-suami-rokok-2',
    date: `${year}-${monthStr}-12`,
    time: '18:10',
    title: 'Rokok Suami',
    amount: 65000,
    category: 'suami_rokok',
    pocket: 'uang_suami',
    note: 'Minimarket dekat rumah',
    createdAt: Date.now() - 13 * 86400000,
  });

  transactions.push({
    id: 'init-suami-pribadi',
    date: `${year}-${monthStr}-15`,
    time: '13:00',
    title: 'Ganti Oli Motor',
    amount: 75000,
    category: 'suami_pribadi',
    pocket: 'uang_suami',
    note: 'Perawatan rutin motor',
    createdAt: Date.now() - 10 * 86400000,
  });

  // Daily food expenses across earlier days
  const foodSampleItems = [
    { title: 'Kangkung, Tahu, Tempe & Ikan Asin', amount: 28000, cat: 'makan_lauk' as const },
    { title: 'Ayam 1/2 kg & Bumbu Kuning', amount: 34000, cat: 'makan_lauk' as const },
    { title: 'Sayur Sop & Telur 1/2 kg', amount: 31000, cat: 'makan_lauk' as const },
    { title: 'Sayur Asem & Ikan Tongkol', amount: 37000, cat: 'makan_sayur' as const }, // mendekati batas Rp35.000
    { title: 'Beras 2.5 kg & Minyak 1L', amount: 48000, cat: 'makan_pokok' as const }, // overbudget hari ini, tapi diambil dari cadangan hemat
    { title: 'Sayur Bayam, Jagung & Tahu', amount: 22000, cat: 'makan_sayur' as const },
    { title: 'Ikan Nila 2 Ekor & Tomat', amount: 35000, cat: 'makan_lauk' as const },
    { title: 'Telur Dadar & Sayur Lodeh', amount: 26000, cat: 'makan_lauk' as const },
    { title: 'Isi Ulang Galon & Bumbu Dapur', amount: 25000, cat: 'makan_bumbu' as const },
    { title: 'Kacang Panjang & Tempe Orek', amount: 20000, cat: 'makan_sayur' as const },
  ];

  for (let day = 1; day <= currentDay; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateFormatted = `${year}-${monthStr}-${dayStr}`;

    const sample = foodSampleItems[(day - 1) % foodSampleItems.length];
    transactions.push({
      id: `init-food-${day}`,
      date: dateFormatted,
      time: '07:' + String(15 + (day % 30)).padStart(2, '0'),
      title: sample.title,
      amount: sample.amount,
      category: sample.cat,
      pocket: 'makan_keluarga',
      note: day === 5 ? 'Pakai cadangan hemat hari sebelumnya' : 'Belanja pagi pasar',
      createdAt: Date.now() - (currentDay - day) * 86400000,
    });
  }

  return transactions;
}

export const DEFAULT_ROUTINE_PAYMENTS: RoutinePaymentStatus[] = [
  {
    monthKey: '2026-10',
    arisanIstriPaid: true,
    arisanIstriDate: '2026-10-05',
    arisanSuamiPaid: true,
    arisanSuamiDate: '2026-10-05',
    sihartaSaved: true,
    sihartaDate: '2026-10-03',
    tukinSaved: true,
    tukinDate: '2026-10-04',
  },
];

export const DEFAULT_PAYLATER_BILLS: PaylaterBill[] = [
  {
    id: 'paylater-1',
    platform: 'SPayLater',
    itemName: 'Kipas Angin Dinding & Rak Piring',
    monthlyAmount: 125000,
    totalTenor: 6,
    paidTenor: 4,
    dueDay: 5,
    sourcePocket: 'uang_suami',
    isPaidThisMonth: true,
    paidDate: '2026-10-05',
    notes: 'Jatuh tempo tanggal 5 setiap bulan',
    createdAt: Date.now() - 60 * 86400000,
  },
  {
    id: 'paylater-2',
    platform: 'GoPay Later',
    itemName: 'Blender & Wajan Dapur',
    monthlyAmount: 95000,
    totalTenor: 3,
    paidTenor: 1,
    dueDay: 15,
    sourcePocket: 'makan_keluarga',
    isPaidThisMonth: false,
    notes: 'Jatuh tempo tanggal 15 setiap bulan',
    createdAt: Date.now() - 30 * 86400000,
  },
];
