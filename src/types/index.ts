// types
// Metric types
export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  suffix?: string;
  prefix?: string;
  description?: string;
}

// Chart data types
export interface RevenueDataPoint {
  month: string;
  revenue: number;
  mrr: number;
  arr: number;
}

export interface UserGrowthDataPoint {
  month: string;
  total: number;
  new: number;
  churned: number;
}

export interface PlanDistribution {
  name: string;
  value: number;
  color: string;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  conversion: number;
}

export type FeatureKey =
  | "analytics"
  | "reports"
  | "apiAccess"
  | "teamCollab"
  | "integrations"
  | "aiAssistant";

export interface FeatureUsage {
  feature: FeatureKey;
  usage: number;
  trend: number;
}

// Customer types
export type CustomerStatus = "active" | "inactive" | "churned" | "trial";
export type PlanType = "starter" | "pro" | "business" | "enterprise";

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: PlanType;
  status: CustomerStatus;
  joinedAt: string;
  revenue: number;
  lastActive: string;
  country: string;
}

// AI Chat types
export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

// Report types
export type DateRange = "7d" | "30d" | "90d" | "custom";

export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: "revenue" | "users" | "churn" | "performance";
  status: "ready" | "generating" | "failed";
}

// Settings types
export type Theme = "light" | "dark" | "system";
export type Locale = "en" | "fa";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
}

export interface UserSettings {
  theme: Theme;
  locale: Locale;
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
    monthly: boolean;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
