/**
 * Dashboard & Aggregated Types matching Spring Boot REST & WebSocket schemas
 */

export interface GardenData {
  streak: number;
  bestStreak: number;
  growthStage: number; // 0 (Seed) -> 7 (Golden Bloom)
  freezes: number;
  freezeUsedDates: string[];
  lastPerfectDate: string | null;
}

export interface HabitItem {
  id: number;
  title: string;
  target: string;
  type: string;
  streak: number;
  completed: boolean;
  startDate?: string;
}

export interface MilestoneItem {
  id: number;
  title: string;
  status: "IN_PROGRESS" | "COMPLETED" | "MISSED";
  durationMinutes?: number;
}

export interface GoalItem {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status: "IN_PROGRESS" | "COMPLETED" | "MISSED";
  milestones: MilestoneItem[];
}

export interface SavingGoalItem {
  id: number;
  title: string;
  icon?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: "ACTIVE" | "COMPLETED" | "MISSED";
}

export interface MonthlyExpense {
  month: string; // e.g. "Jan", "Feb"
  amount: number;
}

export interface CategoryExpense {
  category?: string;
  name?: string;
  amount?: number;
  value?: number;
  color?: string;
  icon?: string;
}

export interface FinanceOverview {
  totalAmount: number;
  monthlyData: MonthlyExpense[];
  categoryData: CategoryExpense[];
  recentExpenses?: any[];
}

export interface NotificationItem {
  id: number;
  goalTitle: string;
  warningMessage: string;
  daysLeft: number;
  deadline: string;
  isRead: boolean;
  createdAt?: string;
}

export interface DashboardResponse {
  garden: GardenData;
  habits: HabitItem[];
  activeGoals: GoalItem[];
  totalGoalsCount: number;
  completedGoalsCount: number;
  activeSavingGoals: SavingGoalItem[];
  totalSavedAmount: number;
  totalTargetSavings: number;
  financeOverview: FinanceOverview;
  unreadNotifications: NotificationItem[];
  unreadNotificationsCount: number;
}

