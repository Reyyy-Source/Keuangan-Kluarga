import { useState, useEffect, useMemo } from 'react';
import {
  MonthlyBudgetConfig,
  Transaction,
  RoutinePaymentStatus,
  PaylaterBill,
} from '../types/finance';
import {
  DEFAULT_BUDGET_CONFIG,
  generateInitialTransactions,
  DEFAULT_ROUTINE_PAYMENTS,
  DEFAULT_PAYLATER_BILLS,
} from '../data/initialData';
import { getCurrentMonthKey, getTodayDateString } from '../utils/formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'keuangan_keluarga_transactions_v1',
  CONFIG: 'keuangan_keluarga_config_v1',
  ROUTINES: 'keuangan_keluarga_routines_v1',
  PAYLATER: 'keuangan_keluarga_paylater_v1',
};

export function useFinanceStore() {
  const [budgetConfig, setBudgetConfig] = useState<MonthlyBudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET_CONFIG;
    } catch {
      return DEFAULT_BUDGET_CONFIG;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return generateInitialTransactions();
    } catch {
      return generateInitialTransactions();
    }
  });

  const [routinePayments, setRoutinePayments] = useState<RoutinePaymentStatus[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (saved) return JSON.parse(saved);
      return DEFAULT_ROUTINE_PAYMENTS;
    } catch {
      return DEFAULT_ROUTINE_PAYMENTS;
    }
  });

  const [paylaterBills, setPaylaterBills] = useState<PaylaterBill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYLATER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_PAYLATER_BILLS;
    } catch {
      return DEFAULT_PAYLATER_BILLS;
    }
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthKey());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(budgetConfig));
    } catch (e) {
      console.error(e);
    }
  }, [budgetConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routinePayments));
    } catch (e) {
      console.error(e);
    }
  }, [routinePayments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYLATER, JSON.stringify(paylaterBills));
    } catch (e) {
      console.error(e);
    }
  }, [paylaterBills]);

  // Filter transactions for current selected month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Filter transactions for current selected date
  const dateTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === selectedDate);
  }, [transactions, selectedDate]);

  // Food transactions today
  const todayFoodTransactions = useMemo(() => {
    return dateTransactions.filter((t) => t.pocket === 'makan_keluarga');
  }, [dateTransactions]);

  const todayFoodSpent = useMemo(() => {
    return todayFoodTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [todayFoodTransactions]);

  const dailyRemaining = budgetConfig.makanHarianLimit - todayFoodSpent;

  // Daily status logic:
  // Green: <= 35.000
  // Yellow: 35.001 - 40.000
  // Red: > 40.000
  const dailyStatus: 'safe' | 'warning' | 'danger' = useMemo(() => {
    if (todayFoodSpent <= budgetConfig.makanWarningLimit) return 'safe';
    if (todayFoodSpent <= budgetConfig.makanHarianLimit) return 'warning';
    return 'danger';
  }, [todayFoodSpent, budgetConfig.makanWarningLimit, budgetConfig.makanHarianLimit]);

  // Calculate Food expenses by days in current month
  const dailyFoodMap = useMemo(() => {
    const map = new Map<number, number>();
    monthTransactions.forEach((t) => {
      if (t.pocket === 'makan_keluarga') {
        const day = parseInt(t.date.split('-')[2], 10);
        map.set(day, (map.get(day) || 0) + t.amount);
      }
    });
    return map;
  }, [monthTransactions]);

  // Total food spent this month
  const totalFoodSpentThisMonth = useMemo(() => {
    return monthTransactions
      .filter((t) => t.pocket === 'makan_keluarga')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const remainingFoodBudgetThisMonth = budgetConfig.makanBulanan - totalFoodSpentThisMonth;

  // Calculate accumulated savings buffer (cadangan hemat makan)
  const foodSavingsBuffer = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const isCurrentViewMonth = `${y}-${String(m).padStart(2, '0')}` === selectedMonth;
    if (!isCurrentViewMonth) return 0;

    let buffer = 0;
    for (let day = 1; day < d; day++) {
      const spent = dailyFoodMap.get(day) || 0;
      if (spent < budgetConfig.makanHarianLimit) {
        buffer += budgetConfig.makanHarianLimit - spent;
      } else {
        buffer -= (spent - budgetConfig.makanHarianLimit);
      }
    }
    return Math.max(0, buffer);
  }, [selectedDate, selectedMonth, dailyFoodMap, budgetConfig.makanHarianLimit]);

  // Husband spending
  const totalHusbandSpentThisMonth = useMemo(() => {
    return monthTransactions
      .filter((t) => t.pocket === 'uang_suami')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const remainingHusbandBudget = budgetConfig.suamiTotal - totalHusbandSpentThisMonth;

  // Routine check
  const currentMonthRoutine = useMemo(() => {
    const existing = routinePayments.find((r) => r.monthKey === selectedMonth);
    return (
      existing || {
        monthKey: selectedMonth,
        arisanIstriPaid: false,
        arisanSuamiPaid: false,
        sihartaSaved: false,
        tukinSaved: false,
      }
    );
  }, [routinePayments, selectedMonth]);

  // Yearly cumulative savings (across all recorded months)
  const yearlySavings = useMemo(() => {
    let tukinSavedTotal = 0;
    let sihartaSavedTotal = 0;

    transactions.forEach((t) => {
      if (t.category === 'tabungan_tukin') {
        tukinSavedTotal += t.amount;
      }
      if (t.category === 'tabungan_siharta') {
        sihartaSavedTotal += t.amount;
      }
    });

    const totalSaved = tukinSavedTotal + sihartaSavedTotal;
    const progressPercent = Math.min(
      100,
      Math.round((totalSaved / budgetConfig.targetTabunganTotalSetahun) * 100)
    );

    return {
      tukinSavedTotal,
      sihartaSavedTotal,
      totalSaved,
      progressPercent,
      targetTukin: budgetConfig.targetTabunganTukinSetahun,
      targetSiharta: budgetConfig.targetTabunganSihartaSetahun,
      targetTotal: budgetConfig.targetTabunganTotalSetahun,
    };
  }, [transactions, budgetConfig]);

  // Paylater Metrics
  const paylaterMetrics = useMemo(() => {
    let totalDue = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    paylaterBills.forEach((bill) => {
      totalDue += bill.monthlyAmount;
      if (bill.isPaidThisMonth) {
        totalPaid += bill.monthlyAmount;
      } else {
        totalUnpaid += bill.monthlyAmount;
      }
    });

    const burdenRatio = Math.round((totalDue / budgetConfig.totalIncome) * 100);

    return {
      totalDue,
      totalPaid,
      totalUnpaid,
      burdenRatio,
      count: paylaterBills.length,
      unpaidCount: paylaterBills.filter((b) => !b.isPaidThisMonth).length,
    };
  }, [paylaterBills, budgetConfig.totalIncome]);

  // Weekly breakdown of food expenses for current month
  const weeklyFoodBreakdown = useMemo(() => {
    const weeks = [
      { weekNum: 1, range: 'Tgl 1 - 7', total: 0, budget: 7 * budgetConfig.makanHarianLimit },
      { weekNum: 2, range: 'Tgl 8 - 14', total: 0, budget: 7 * budgetConfig.makanHarianLimit },
      { weekNum: 3, range: 'Tgl 15 - 21', total: 0, budget: 7 * budgetConfig.makanHarianLimit },
      { weekNum: 4, range: 'Tgl 22 - 28', total: 0, budget: 7 * budgetConfig.makanHarianLimit },
      { weekNum: 5, range: 'Tgl 29 - 31', total: 0, budget: 2 * budgetConfig.makanHarianLimit },
    ];

    dailyFoodMap.forEach((spent, day) => {
      if (day <= 7) weeks[0].total += spent;
      else if (day <= 14) weeks[1].total += spent;
      else if (day <= 21) weeks[2].total += spent;
      else if (day <= 28) weeks[3].total += spent;
      else weeks[4].total += spent;
    });

    return weeks;
  }, [dailyFoodMap, budgetConfig.makanHarianLimit]);

  // Add transaction
  const addTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tx: Transaction = {
      ...newTx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  // Delete transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Paylater Actions
  const payPaylaterBill = (billId: string, payDate?: string) => {
    const dateToUse = payDate || selectedDate;
    setPaylaterBills((prev) =>
      prev.map((bill) => {
        if (bill.id === billId) {
          const nextTenor = Math.min(bill.totalTenor, bill.paidTenor + 1);
          return {
            ...bill,
            isPaidThisMonth: true,
            paidTenor: nextTenor,
            paidDate: dateToUse,
          };
        }
        return bill;
      })
    );

    const targetBill = paylaterBills.find((b) => b.id === billId);
    if (targetBill) {
      addTransaction({
        pocket: targetBill.sourcePocket === 'uang_suami' ? 'uang_suami' : 'paylater',
        category: 'bayar_paylater',
        title: `Bayar Cicilan ${targetBill.platform} (${targetBill.itemName})`,
        amount: targetBill.monthlyAmount,
        date: dateToUse,
        time: '10:00',
        note: `Cicilan ke-${Math.min(targetBill.totalTenor, targetBill.paidTenor + 1)} dari ${targetBill.totalTenor} bulan`,
      });
    }
  };

  const addPaylaterBill = (newBill: Omit<PaylaterBill, 'id' | 'createdAt'>) => {
    const bill: PaylaterBill = {
      ...newBill,
      id: 'paylater-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
    };
    setPaylaterBills((prev) => [bill, ...prev]);
  };

  const deletePaylaterBill = (id: string) => {
    setPaylaterBills((prev) => prev.filter((b) => b.id !== id));
  };

  // Reset to default
  const resetToDefault = () => {
    setBudgetConfig(DEFAULT_BUDGET_CONFIG);
    setTransactions(generateInitialTransactions());
    setRoutinePayments(DEFAULT_ROUTINE_PAYMENTS);
    setPaylaterBills(DEFAULT_PAYLATER_BILLS);
  };

  // Export JSON
  const exportData = () => {
    const data = {
      budgetConfig,
      transactions,
      routinePayments,
      paylaterBills,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keuangan_keluarga_backup_${selectedMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    budgetConfig,
    setBudgetConfig,
    transactions,
    monthTransactions,
    dateTransactions,
    todayFoodTransactions,
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
    remainingHusbandBudget,
    currentMonthRoutine,
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
  };
}
