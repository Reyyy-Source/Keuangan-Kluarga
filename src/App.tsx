import React, { useState } from 'react';
import { useFinanceStore } from './context/useFinanceStore';
import { Header } from './components/Header';
import { AiFinanceSidebar } from './components/AiFinanceSidebar';
import { DailyFoodRadar } from './components/DailyFoodRadar';
import { BudgetOverviewCards } from './components/BudgetOverviewCards';
import { FoodExpensesTracker } from './components/FoodExpensesTracker';
import { FinancialCharts } from './components/FinancialCharts';
import { HusbandWalletTracker } from './components/HusbandWalletTracker';
import { ArisanSavingsTracker } from './components/ArisanSavingsTracker';
import { SimulatorModal } from './components/SimulatorModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { BudgetSavingsTips } from './components/BudgetSavingsTips';
import { PaylaterManager } from './components/PaylaterManager';
import {
  formatRupiah,
  formatDateIndo,
  getCurrentMonthKey,
  getTodayDateString,
} from './utils/formatters';
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  PiggyBank,
  Plus,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import { ExpenseCategory, MainPocket } from './types/finance';

export default function App() {
  const {
    budgetConfig,
    transactions,
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
    todayFoodSpent,
    dailyRemaining,
    dailyStatus,
    dailyFoodMap,
    totalFoodSpentThisMonth,
    remainingFoodBudgetThisMonth,
    foodSavingsBuffer,
    totalHusbandSpentThisMonth,
    yearlySavings,
    paylaterBills,
    paylaterMetrics,
    weeklyFoodBreakdown,
    addTransaction,
    deleteTransaction,
    payPaylaterBill,
    addPaylaterBill,
    deletePaylaterBill,
    resetToDefault,
    exportData,
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [addModalPrefillDate, setAddModalPrefillDate] = useState<string | undefined>(undefined);
  const [addModalDefaultPocket, setAddModalDefaultPocket] = useState<MainPocket>('makan_keluarga');

  // Arisan total spent this month
  const totalArisanSpentThisMonth = transactions
    .filter((t) => t.date.startsWith(selectedMonth) && t.pocket === 'arisan')
    .reduce((sum, t) => sum + t.amount, 0);

  // Tabungan saved this month
  const totalSavedThisMonth = transactions
    .filter((t) => t.date.startsWith(selectedMonth) && t.pocket === 'tabungan')
    .reduce((sum, t) => sum + t.amount, 0);

  // Quick add routine payment helper
  const handleQuickAddRoutine = (
    category: 'arisan_istri' | 'arisan_suami' | 'tabungan_siharta' | 'tabungan_tukin',
    amount: number,
    title: string
  ) => {
    let pocket: MainPocket = 'arisan';
    if (category.startsWith('tabungan')) pocket = 'tabungan';

    addTransaction({
      pocket,
      category,
      title,
      amount,
      date: selectedDate,
      time: '09:00',
      note: 'Dicatat dari tombol cepat',
    });
  };

  // Quick add daily food helper
  const handleQuickAddFood = (amount: number, label: string) => {
    addTransaction({
      pocket: 'makan_keluarga',
      category: amount <= 15000 ? 'makan_sayur' : 'makan_lauk',
      title: label,
      amount,
      date: selectedDate,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      note: 'Tambah cepat belanja harian',
    });
  };

  const handleOpenAddModal = (prefillDate?: string, pocket: MainPocket = 'makan_keluarga') => {
    setAddModalPrefillDate(prefillDate || selectedDate);
    setAddModalDefaultPocket(pocket);
    setIsAddModalOpen(true);
  };

  const handleSelectDayFromChart = (day: number) => {
    const dayStr = String(day).padStart(2, '0');
    setSelectedDate(`${selectedMonth}-${dayStr}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Left Sidebar: Navigation & AI Assistant Keuangan */}
      <AiFinanceSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dailyRemaining={dailyRemaining}
        dailySpent={todayFoodSpent}
        dailyLimit={budgetConfig.makanHarianLimit}
        monthlyRemaining={remainingFoodBudgetThisMonth}
        foodSavingsBuffer={foodSavingsBuffer}
        unpaidPaylaterCount={paylaterMetrics.unpaidCount}
        onOpenAddModal={() => handleOpenAddModal(selectedDate, 'makan_keluarga')}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onExport={exportData}
        onReset={resetToDefault}
        onApplyBasketExpense={(title, amount, note) => {
          addTransaction({
            pocket: 'makan_keluarga',
            category: 'makan_lauk',
            title,
            amount,
            date: selectedDate,
            time: '08:00',
            note,
          });
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Right Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddModal={() => handleOpenAddModal(selectedDate, 'makan_keluarga')}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onExport={exportData}
          onReset={resetToDefault}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Month Selector & Report Trigger Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Periode Bulan:</span>
              </span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSelectedDate(`${e.target.value}-01`);
                }}
                className="text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-400 hidden md:inline">
                Total Pemasukan: <strong className="text-slate-800">{formatRupiah(budgetConfig.totalIncome)}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Kalkulator Simulasi
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Rekap Slip Bulanan</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Daily Food Radar (The Core Rp40.000 limit widget) */}
              <DailyFoodRadar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                dailySpent={todayFoodSpent}
                dailyLimit={budgetConfig.makanHarianLimit}
                warningLimit={budgetConfig.makanWarningLimit}
                dailyRemaining={dailyRemaining}
                status={dailyStatus}
                monthlySpent={totalFoodSpentThisMonth}
                monthlyLimit={budgetConfig.makanBulanan}
                monthlyRemaining={remainingFoodBudgetThisMonth}
                savingsBuffer={foodSavingsBuffer}
                onQuickAdd={handleQuickAddFood}
                onOpenFullModal={() => handleOpenAddModal(selectedDate, 'makan_keluarga')}
              />

              {/* Budget Overview Cards (Total Rp7.211.000, Gaji Pokok Rp3.388.000, Tukin Rp3.823.000, Target Rp39.876.000) */}
              <BudgetOverviewCards
                config={budgetConfig}
                totalFoodSpent={totalFoodSpentThisMonth}
                totalHusbandSpent={totalHusbandSpentThisMonth}
                yearlySavingsProgress={yearlySavings}
                onNavigateTab={setActiveTab}
              />

              {/* Paylater Status Alert Widget */}
              {paylaterMetrics.unpaidCount > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
                        <span>Tagihan Paylater Belum Lunas ({paylaterMetrics.unpaidCount} cicilan)</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono font-semibold">
                          Beban {paylaterMetrics.burdenRatio.toFixed(1)}% Gaji
                        </span>
                      </div>
                      <div className="text-xs text-amber-800 mt-0.5">
                        Total tagihan bulan ini: <strong className="font-mono">{formatRupiah(paylaterMetrics.totalUnpaid)}</strong>. Pastikan dibayar sebelum jatuh tempo.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('paylater')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Bayar &amp; Kelola
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Semua tagihan paylater bulan ini sudah lunas atau belum ada cicilan aktif.</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('paylater')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Buka Paylater
                  </button>
                </div>
              )}

              {/* Tips Hemat Belanja & Saran Resep Mingguan Ekonomis */}
              <BudgetSavingsTips
                remainingFoodBudget={remainingFoodBudgetThisMonth}
                totalFoodBudget={budgetConfig.makanBulanan}
                dailyLimit={budgetConfig.makanHarianLimit}
                selectedMonth={selectedMonth}
                onApplyRecipeToExpense={(title, amount) => {
                  addTransaction({
                    pocket: 'makan_keluarga',
                    category: 'makan_lauk',
                    title,
                    amount,
                    date: selectedDate,
                    time: '08:00',
                    note: 'Rekomendasi menu hemat mingguan',
                  });
                }}
              />

              {/* Financial Charts Preview */}
              <FinancialCharts
                dailyFoodMap={dailyFoodMap}
                selectedMonth={selectedMonth}
                config={budgetConfig}
                weeklyBreakdown={weeklyFoodBreakdown}
                totalFoodSpent={totalFoodSpentThisMonth}
                totalHusbandSpent={totalHusbandSpentThisMonth}
                yearlySavings={yearlySavings}
                onSelectDay={handleSelectDayFromChart}
              />
            </div>
          )}

          {/* Tab 2: Jatah Makan Rp40.000 / Hari */}
          {activeTab === 'makan' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <DailyFoodRadar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                dailySpent={todayFoodSpent}
                dailyLimit={budgetConfig.makanHarianLimit}
                warningLimit={budgetConfig.makanWarningLimit}
                dailyRemaining={dailyRemaining}
                status={dailyStatus}
                monthlySpent={totalFoodSpentThisMonth}
                monthlyLimit={budgetConfig.makanBulanan}
                monthlyRemaining={remainingFoodBudgetThisMonth}
                savingsBuffer={foodSavingsBuffer}
                onQuickAdd={handleQuickAddFood}
                onOpenFullModal={() => handleOpenAddModal(selectedDate, 'makan_keluarga')}
              />

              <FoodExpensesTracker
                transactions={transactions}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onDeleteTransaction={deleteTransaction}
                onOpenAddModal={(date) => handleOpenAddModal(date, 'makan_keluarga')}
              />
            </div>
          )}

          {/* Tab 3: Uang Suami (Rp1.388.000) */}
          {activeTab === 'suami' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <HusbandWalletTracker
                totalBudget={budgetConfig.suamiTotal}
                transactions={transactions}
                onDeleteTransaction={deleteTransaction}
                onOpenAddModal={() => handleOpenAddModal(selectedDate, 'uang_suami')}
              />
            </div>
          )}

          {/* Tab 4: Arisan & Tabungan */}
          {activeTab === 'arisan-tabungan' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <ArisanSavingsTracker
                config={budgetConfig}
                transactions={transactions}
                selectedMonth={selectedMonth}
                onDeleteTransaction={deleteTransaction}
                onQuickAddRoutine={handleQuickAddRoutine}
              />
            </div>
          )}

          {/* Tab 5: Tagihan Paylater & Cicilan */}
          {activeTab === 'paylater' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <PaylaterManager
                bills={paylaterBills}
                metrics={paylaterMetrics}
                totalIncome={budgetConfig.totalIncome}
                selectedDate={selectedDate}
                onPayBill={payPaylaterBill}
                onAddBill={addPaylaterBill}
                onDeleteBill={deletePaylaterBill}
              />
            </div>
          )}

          {/* Tab 6: Laporan & Grafik */}
          {activeTab === 'laporan' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <FinancialCharts
                dailyFoodMap={dailyFoodMap}
                selectedMonth={selectedMonth}
                config={budgetConfig}
                weeklyBreakdown={weeklyFoodBreakdown}
                totalFoodSpent={totalFoodSpentThisMonth}
                totalHusbandSpent={totalHusbandSpentThisMonth}
                yearlySavings={yearlySavings}
                onSelectDay={handleSelectDayFromChart}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <strong className="text-slate-800">KeuanganKeluarga</strong> — Sistem Anggaran Bulanan &amp; AI Asisten Belanja Pasar
            </div>
            <div className="flex items-center gap-3">
              <span>Pemasukan: Rp7.211.000/bln</span>
              <span aria-hidden="true">·</span>
              <span>Target Tabungan: Rp39.876.000/thn</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addTransaction}
        prefillDate={addModalPrefillDate}
        defaultPocket={addModalDefaultPocket}
      />

      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        monthlyLimit={budgetConfig.makanBulanan}
        dailyLimit={budgetConfig.makanHarianLimit}
      />

      <MonthlyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedMonth={selectedMonth}
        config={budgetConfig}
        totalFoodSpent={totalFoodSpentThisMonth}
        totalHusbandSpent={totalHusbandSpentThisMonth}
        totalArisanSpent={totalArisanSpentThisMonth}
        totalSavedThisMonth={totalSavedThisMonth}
        yearlySavingsProgress={yearlySavings}
      />
    </div>
  );
}
