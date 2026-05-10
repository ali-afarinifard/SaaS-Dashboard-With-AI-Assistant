import { sleep } from "@/lib/utils";

async function mockRequest<T>(data: T, delay = 800): Promise<T> {
  await sleep(delay);
  return data;
}

export const mockApi = {
  profile: {
    update: (data: Record<string, string>) =>
      mockRequest({ success: true, data }),
  },
  notifications: {
    update: (data: Record<string, boolean>) =>
      mockRequest({ success: true, data }),
  },
  team: {
    invite: (email: string) =>
      mockRequest({ success: true, email }),
    remove: (name: string) =>
      mockRequest({ success: true, name }),
  },
  apiKeys: {
    revoke: (name: string) =>
      mockRequest({ success: true, name }),
    generate: () =>
      mockRequest({
        success: true,
        key: `nx_live_${Math.random().toString(36).slice(2, 18)}`,
      }),
  },
};
