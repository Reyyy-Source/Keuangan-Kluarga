import React from 'react';
import { Plus, Calculator, Download, RotateCcw, Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenSimulator: () => void;
  onExport: () => void;
  onReset: () => void;
  onToggleMobileSidebar: () => void;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Ringkasan Dashboard',
  makan: 'Jatah Makan Rp40.000 / Hari',
  suami: 'Uang Suami (Rp1.388.000)',
  'arisan-tabungan': 'Arisan & Target Tabungan',
  paylater: 'Tagihan Paylater & Cicilan',
  laporan: 'Laporan & Grafik Keuangan',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
  onOpenSimulator,
  onExport,
  onReset,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Mobile Sidebar Toggle + Breadcrumb Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
              title="Buka Menu & AI Assistant"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-slate-900 hidden sm:inline-block">
                KeuanganKeluarga
              </span>
              <span className="text-slate-400 hidden sm:inline-block">/</span>
              <span className="font-semibold text-emerald-800">
                {TAB_TITLES[activeTab] || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Zone 2: Subtitle or Quick Context */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>Pemasukan: Rp7.211.000</span>
            <span aria-hidden="true">·</span>
            <span>Jatah Makan: Rp40.000/hari</span>
          </div>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSimulator}
              title="Buka Simulasi Belanja Makan Harian"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Simulasi</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Belanja</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
