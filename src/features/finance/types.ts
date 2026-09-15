export type WalletType = 'PERSONAL' | 'GROUP' | 'SAVINGS' | 'CASH' | 'BANK';
export type BudgetPeriod = 'MONTHLY' | 'WEEKLY' | 'CUSTOM';

export interface Wallet {
  id: number;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  name: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverbudget: boolean;
  period: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  icon?: string;
  color?: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  icon?: string;
  date: string;
  note?: string;
  walletId?: number;
  walletName?: string;
  budgetId?: number;
  budgetName?: string;
}

export interface FinanceOverview {
  totalAmount: number;
  monthlyData: Array<{ month: string; amount: number }>;
  categoryData: Array<{ name: string; amount: number; color: string; icon: string }>;
}

