import { useQuery } from "@tanstack/react-query";
import {
  planDistribution,
  trafficSources,
  featureUsage,
  customers,
  reports,
  getRevenueByRange,
  getUserGrowthByRange,
  getMetricsByRange,
  type DateRange,
} from "@/lib/mock-data";
import { sleep } from "@/lib/utils";

const DELAY = 600;

export function useDashboardMetrics(range: DateRange = "30d") {
  return useQuery({
    queryKey: ["dashboard", "metrics", range],
    queryFn: async () => {
      await sleep(DELAY);
      return getMetricsByRange(range);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueData(range: DateRange = "30d") {
  return useQuery({
    queryKey: ["dashboard", "revenue", range],
    queryFn: async () => {
      await sleep(DELAY);
      return getRevenueByRange(range);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserGrowthData(range: DateRange = "30d") {
  return useQuery({
    queryKey: ["dashboard", "user-growth", range],
    queryFn: async () => {
      await sleep(DELAY);
      return getUserGrowthByRange(range);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlanDistribution() {
  return useQuery({
    queryKey: ["dashboard", "plan-distribution"],
    queryFn: async () => { await sleep(DELAY); return planDistribution; },
    staleTime: 10 * 60 * 1000,
  });
}

export function useTrafficSources() {
  return useQuery({
    queryKey: ["dashboard", "traffic"],
    queryFn: async () => { await sleep(DELAY); return trafficSources; },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeatureUsage() {
  return useQuery({
    queryKey: ["dashboard", "features"],
    queryFn: async () => { await sleep(DELAY); return featureUsage; },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomers(search = "", statusFilter = "") {
  return useQuery({
    queryKey: ["customers", search, statusFilter],
    queryFn: async () => {
      await sleep(DELAY);
      let result = [...customers];
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
        );
      }
      if (statusFilter && statusFilter !== "all") {
        result = result.filter((c) => c.status === statusFilter);
      }
      return result;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => { await sleep(DELAY); return reports; },
    staleTime: 5 * 60 * 1000,
  });
}

export type { DateRange };
