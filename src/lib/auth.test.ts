import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types/user";

const { cookiesMock, redirectMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  redirectMock: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const mockUser: User = {
  id: 1,
  name: "テスト太郎",
  email: "test@example.com",
  icon_path: null,
  profile: null,
  is_admin: false,
  created_at: "2025-06-01T00:00:00Z",
  updated_at: "2025-06-01T00:00:00Z",
  icon_url: "https://example.com/icon.png",
};

function mockCookieToken(token: string | undefined) {
  cookiesMock.mockResolvedValue({
    get: (name: string) =>
      name === "token" && token !== undefined ? { value: token } : undefined,
  });
}

describe("auth", () => {
  beforeEach(() => {
    vi.stubEnv("LARAVEL_API_URL", "http://localhost:8000");
    vi.stubGlobal("fetch", vi.fn());
    redirectMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("getCurrentUserOrNull", () => {
    it("tokenが無い場合はfetchを呼ばずnullを返す", async () => {
      mockCookieToken(undefined);
      const { getCurrentUserOrNull } = await import("./auth");

      const result = await getCurrentUserOrNull();

      expect(result).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("tokenがありAPIが成功した場合はユーザー情報を返す", async () => {
      mockCookieToken("valid-token");
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      } as Response);
      const { getCurrentUserOrNull } = await import("./auth");

      const result = await getCurrentUserOrNull();

      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/user",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token",
          }),
        }),
      );
    });

    it("tokenがあってもAPIが失敗した場合はnullを返す", async () => {
      mockCookieToken("expired-token");
      vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
      const { getCurrentUserOrNull } = await import("./auth");

      const result = await getCurrentUserOrNull();

      expect(result).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("ユーザーが存在する場合はユーザー情報を返す", async () => {
      mockCookieToken("valid-token");
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      } as Response);
      const { getCurrentUser } = await import("./auth");

      const result = await getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(redirectMock).not.toHaveBeenCalled();
    });

    it("ユーザーが存在しない場合は/loginへリダイレクトする", async () => {
      mockCookieToken(undefined);
      const { getCurrentUser } = await import("./auth");

      await expect(getCurrentUser()).rejects.toThrow("NEXT_REDIRECT:/login");
      expect(redirectMock).toHaveBeenCalledWith("/login");
    });
  });
});
