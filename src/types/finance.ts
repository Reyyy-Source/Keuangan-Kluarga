export type ExpenseCategory =
  | 'makan_sayur'
  | 'makan_lauk'
  | 'makan_pokok'
  | 'makan_bumbu'
  | 'makan_jajan'
  | 'makan_lainnya'
  | 'suami_bensin'
  | 'suami_rokok'
  | 'suami_pribadi'
  | 'arisan_istri'
  | 'arisan_suami'
  | 'tabungan_siharta'
  | 'tabungan_tukin'
  | 'bayar_paylater'
  | 'pengeluaran_lain';

export type MainPocket = 'makan_keluarga' | 'uang_suami' | 'arisan' | 'tabungan' | 'paylater';

export interface PaylaterBill {
  id: string;
  platform: string; // e.g. 'SPayLater', 'GoPay Later', 'Kredivo', 'Akulaku', 'Indodana', 'Lainnya'
  itemName: string; // e.g. 'Mesin Cuci Mini / Kebutuhan Rumah'
  monthlyAmount: number; // e.g. 175.000
  totalTenor: number; // e.g. 6 (bulan)
  paidTenor: number; // e.g. 3 (bulan terbayar)
  dueDay: number; // tanggal jatuh tempo per bulan (1 - 31)
  sourcePocket: 'uang_suami' | 'makan_keluarga' | 'cadangan_khusus';
  isPaidThisMonth: boolean;
  paidDate?: string;
  notes?: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  amount: number;
  category: ExpenseCategory;
  pocket: MainPocket;
  note?: string;
  createdAt: number;
}

export interface MonthlyBudgetConfig {
  totalIncome: number; // 7.211.000
  gajiPokok: number; // 3.388.000
  tukin: number; // 3.823.000
  
  // Pos Uang Istri (Total Rp2.000.000)
  istriTotal: number; // 2.000.000
  makanBulanan: number; // 1.200.000
  makanHarianLimit: number; // 40.000
  makanWarningLimit: number; // 35.000
  arisanIstri: number; // 500.000
  tabunganSiharta: number; // 300.000

  // Pos Uang Suami (Total Rp1.388.000)
  suamiTotal: number; // 1.388.000 (bensin, rokok, pribadi)

  // Pos Tukin
  arisanSuami: number; // 800.000
  tabunganTukin: number; // 3.023.000

  // Target Tabungan Setahun (12 bulan)
  targetTabunganTukinSetahun: number; // 36.276.000
  targetTabunganSihartaSetahun: number; // 3.600.000
  targetTabunganTotalSetahun: number; // 39.876.000
}

export interface RoutinePaymentStatus {
  monthKey: string; // YYYY-MM
  arisanIstriPaid: boolean;
  arisanIstriDate?: string;
  arisanSuamiPaid: boolean;
  arisanSuamiDate?: string;
  sihartaSaved: boolean;
  sihartaDate?: string;
  tukinSaved: boolean;
  tukinDate?: string;
}
