export type Id = number | string;

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyRegistrationOtpRequest {
  email: string;
  otpCode: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface AuthResponse {
  token?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  otpRequired?: boolean;
  message?: string;
}

export interface AuthUser {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface GoalResponse {
  id: Id;
  title: string;
  deadline: string;
  completed?: boolean;
  milestones?: MilestoneResponse[];
}

export interface CreateGoalRequest {
  title: string;
  deadline: string;
}

export interface MilestoneResponse {
  id: Id;
  title: string;
  completed?: boolean;
  totalFocusMinutes?: number;
}

export interface CreateMilestoneRequest {
  title: string;
}

export interface FocusSessionRequest {
  durationMinutes: number;
}

export interface HabitResponse {
  id: Id;
  title: string;
  category: string;
  completedDates?: string[];
  active?: boolean;
}

export interface CreateHabitRequest {
  title: string;
  category: string;
}

export interface ToggleHabitRequest {
  date: string;
}

export interface GardenResponse {
  streak: number;
  bestStreak: number;
  growthStage: number;
  freezes: number;
  freezeUsedDates: string[];
}

export interface GardenFreezeRequest {
  date: string;
}

export interface SavingGoalResponse {
  id: Id;
  title: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
}

export interface CreateSavingGoalRequest {
  title: string;
  targetAmount: number;
  targetDate: string;
}

export interface DepositRequest {
  amount: number;
}

export interface ExpenseResponse {
  id: Id;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface ExpenseQuery {
  category?: string;
  month?: number;
  year?: number;
}

export interface ExpenseOverviewResponse {
  monthlyTotals?: Array<{ month: string; total: number }>;
  categoryBreakdown?: Array<{ category: string; total: number }>;
  [key: string]: unknown;
}

export interface NotificationResponse {
  id?: Id;
  title?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
  [key: string]: unknown;
}
