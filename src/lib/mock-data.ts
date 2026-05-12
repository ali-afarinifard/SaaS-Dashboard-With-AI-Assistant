import type {
  ICustomer,
  IRevenueDataPoint,
  IUserGrowthDataPoint,
  IPlanDistribution,
  ITrafficSource,
  IFeatureUsage,
  IReport,
} from "@/types";

export const revenueData: IRevenueDataPoint[] = [
  { month: "Jan", revenue: 42000, mrr: 42000, arr: 504000 },
  { month: "Feb", revenue: 47500, mrr: 47500, arr: 570000 },
  { month: "Mar", revenue: 51200, mrr: 51200, arr: 614400 },
  { month: "Apr", revenue: 49800, mrr: 49800, arr: 597600 },
  { month: "May", revenue: 58900, mrr: 58900, arr: 706800 },
  { month: "Jun", revenue: 63400, mrr: 63400, arr: 760800 },
  { month: "Jul", revenue: 71200, mrr: 71200, arr: 854400 },
  { month: "Aug", revenue: 68900, mrr: 68900, arr: 826800 },
  { month: "Sep", revenue: 79500, mrr: 79500, arr: 954000 },
  { month: "Oct", revenue: 84200, mrr: 84200, arr: 1010400 },
  { month: "Nov", revenue: 91800, mrr: 91800, arr: 1101600 },
  { month: "Dec", revenue: 98400, mrr: 98400, arr: 1180800 },
];

export const userGrowthData: IUserGrowthDataPoint[] = [
  { month: "Jan", total: 1240, new: 180, churned: 32 },
  { month: "Feb", total: 1388, new: 210, churned: 42 },
  { month: "Mar", total: 1551, new: 230, churned: 47 },
  { month: "Apr", total: 1690, new: 195, churned: 56 },
  { month: "May", total: 1871, new: 248, churned: 67 },
  { month: "Jun", total: 2044, new: 263, churned: 90 },
  { month: "Jul", total: 2240, new: 290, churned: 94 },
  { month: "Aug", total: 2380, new: 210, churned: 70 },
  { month: "Sep", total: 2590, new: 285, churned: 75 },
  { month: "Oct", total: 2821, new: 310, churned: 79 },
  { month: "Nov", total: 3060, new: 325, churned: 86 },
  { month: "Dec", total: 3280, new: 340, churned: 120 },
];

export const planDistribution: IPlanDistribution[] = [
  { name: "Starter", value: 38, color: "hsl(215, 70%, 60%)" },
  { name: "Pro", value: 31, color: "hsl(262, 70%, 60%)" },
  { name: "Business", value: 21, color: "hsl(142, 70%, 45%)" },
  { name: "Enterprise", value: 10, color: "hsl(38, 90%, 55%)" },
];

export const trafficSources: ITrafficSource[] = [
  { source: "Organic Search", visitors: 12840, conversion: 3.2 },
  { source: "Direct", visitors: 8920, conversion: 5.1 },
  { source: "Referral", visitors: 6340, conversion: 4.7 },
  { source: "Social Media", visitors: 5120, conversion: 2.8 },
  { source: "Email", visitors: 3890, conversion: 6.4 },
  { source: "Paid Ads", visitors: 2940, conversion: 4.1 },
];

export const featureUsage: IFeatureUsage[] = [
  { feature: "analytics", usage: 89, trend: 12 },
  { feature: "reports", usage: 76, trend: 8 },
  { feature: "apiAccess", usage: 64, trend: -3 },
  { feature: "teamCollab", usage: 58, trend: 21 },
  { feature: "integrations", usage: 47, trend: 15 },
  { feature: "aiAssistant", usage: 43, trend: 34 },
];

export const customers: ICustomer[] = [
  {
    id: "c1",
    name: "Sarah Rezaei",
    email: "sarah@techcorp.io",
    plan: "enterprise",
    status: "active",
    joinedAt: "2023-03-15",
    revenue: 2400,
    lastActive: "2026-05-06",
    country: "US",
  },
  {
    id: "c2",
    name: "Ali Miramir",
    email: "ali@startupx.com",
    plan: "business",
    status: "active",
    joinedAt: "2023-06-22",
    revenue: 890,
    lastActive: "2026-05-07",
    country: "SG",
  },
  {
    id: "c3",
    name: "Sohrab Miri",
    email: "sohrab@designhub.co",
    plan: "pro",
    status: "trial",
    joinedAt: "2026-04-28",
    revenue: 0,
    lastActive: "2026-05-05",
    country: "IN",
  },
  {
    id: "c4",
    name: "Reza Moradi",
    email: "lars@euroventures.de",
    plan: "business",
    status: "active",
    joinedAt: "2023-09-10",
    revenue: 1200,
    lastActive: "2026-05-04",
    country: "DE",
  },
  {
    id: "c5",
    name: "Zaynab Amani",
    email: "z.amani@menatec.ae",
    plan: "enterprise",
    status: "active",
    joinedAt: "2022-11-18",
    revenue: 3600,
    lastActive: "2026-05-07",
    country: "AE",
  },
  {
    id: "c6",
    name: "James O'Brien",
    email: "james@fintech.io",
    plan: "pro",
    status: "inactive",
    joinedAt: "2023-01-05",
    revenue: 490,
    lastActive: "2026-03-12",
    country: "IE",
  },
  {
    id: "c7",
    name: "Sina Mohammadi",
    email: "sina@nextstep.jp",
    plan: "starter",
    status: "active",
    joinedAt: "2024-02-14",
    revenue: 99,
    lastActive: "2026-05-06",
    country: "JP",
  },
  {
    id: "c8",
    name: "Elina Shahmoradi",
    email: "e.shamoradi@me.it",
    plan: "pro",
    status: "churned",
    joinedAt: "2023-05-30",
    revenue: 490,
    lastActive: "2026-01-20",
    country: "IT",
  },
  {
    id: "c9",
    name: "Carlos Mendoza",
    email: "carlos@me.mx",
    plan: "business",
    status: "active",
    joinedAt: "2024-01-08",
    revenue: 890,
    lastActive: "2026-05-07",
    country: "MX",
  },
  {
    id: "c10",
    name: "Faezeh Alimardani",
    email: "faezeh@me.pl",
    plan: "starter",
    status: "active",
    joinedAt: "2024-04-19",
    revenue: 99,
    lastActive: "2026-05-03",
    country: "PL",
  },
];

export const reports: IReport[] = [
  {
    id: "r1",
    title: "Q1 2026 Revenue Analysis",
    description: "Comprehensive revenue breakdown with YoY comparison",
    createdAt: "2026-04-01",
    type: "revenue",
    status: "ready",
  },
  {
    id: "r2",
    title: "User Acquisition Report",
    description: "Channel performance and CAC analysis",
    createdAt: "2026-04-15",
    type: "users",
    status: "ready",
  },
  {
    id: "r3",
    title: "Churn Analysis - April",
    description: "Detailed churn investigation and risk factors",
    createdAt: "2026-05-01",
    type: "churn",
    status: "ready",
  },
  {
    id: "r4",
    title: "Performance Benchmark",
    description: "System performance vs industry benchmarks",
    createdAt: "2026-05-05",
    type: "performance",
    status: "generating",
  },
];

export const dashboardMetrics = {
  totalRevenue: { value: 98400, change: 7.2, prefix: "$" },
  activeUsers: { value: 3280, change: 11.1 },
  newSignups: { value: 340, change: 4.6 },
  churnRate: { value: 3.7, change: -0.4, suffix: "%" },
  mrr: { value: 98400, change: 7.2, prefix: "$" },
  arr: { value: 1180800, change: 7.2, prefix: "$" },
  conversionRate: { value: 4.2, change: 0.8, suffix: "%" },
  avgSessionTime: { value: "8m 42s", change: 12.3 },
};

// ─── Date-range filtered data
export type DateRange = "7d" | "30d" | "90d";

export function getRevenueByRange(range: DateRange) {
  const slices: Record<DateRange, number> = { "7d": 2, "30d": 4, "90d": 8 };
  return revenueData.slice(-slices[range]);
}

export function getUserGrowthByRange(range: DateRange) {
  const slices: Record<DateRange, number> = { "7d": 2, "30d": 4, "90d": 8 };
  return userGrowthData.slice(-slices[range]);
}

export function getMetricsByRange(range: DateRange) {
  const multiplier: Record<DateRange, number> = {
    "7d": 0.23,
    "30d": 1,
    "90d": 3.1,
  };
  const m = multiplier[range];
  return {
    totalRevenue: {
      value: Math.round(98400 * m),
      change: range === "7d" ? 2.1 : range === "30d" ? 7.2 : 24.8,
      prefix: "$",
    },
    activeUsers: {
      value: Math.round(
        3280 * (range === "7d" ? 0.95 : range === "30d" ? 1 : 0.72),
      ),
      change: range === "7d" ? 3.1 : range === "30d" ? 11.1 : 32.4,
    },
    newSignups: {
      value: Math.round(340 * m),
      change: range === "7d" ? 1.2 : range === "30d" ? 4.6 : 18.9,
    },
    churnRate: {
      value: range === "7d" ? 0.9 : range === "30d" ? 3.7 : 11.2,
      change: range === "7d" ? -0.1 : range === "30d" ? -0.4 : -1.8,
      suffix: "%",
    },
    mrr: {
      value: Math.round(98400 * m),
      change: range === "7d" ? 2.1 : range === "30d" ? 7.2 : 24.8,
      prefix: "$",
    },
    arr: {
      value: Math.round(
        1180800 * (range === "7d" ? 1 : range === "30d" ? 1 : 0.88),
      ),
      change: range === "7d" ? 7.2 : range === "30d" ? 7.2 : 22.1,
      prefix: "$",
    },
    conversionRate: {
      value: range === "7d" ? 4.8 : range === "30d" ? 4.2 : 3.9,
      change: range === "7d" ? 1.2 : range === "30d" ? 0.8 : -0.3,
      suffix: "%",
    },
    avgSessionTime: {
      value: range === "7d" ? "9m 12s" : range === "30d" ? "8m 42s" : "7m 58s",
      change: range === "7d" ? 18.2 : range === "30d" ? 12.3 : 8.1,
    },
  };
}
