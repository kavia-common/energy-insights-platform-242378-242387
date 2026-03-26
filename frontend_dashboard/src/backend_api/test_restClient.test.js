import { ApiError } from "./errors";

function mockFetchOnce(impl) {
  global.fetch = jest.fn(impl);
}

function createMockResponse({ ok, status, bodyText }) {
  return {
    ok,
    status,
    text: jest.fn(async () => bodyText ?? ""),
  };
}

describe("backend_api/restClient", () => {
  beforeEach(() => {
    jest.resetModules();
    delete global.fetch;
  });

  test("GET builds URL with query params and parses JSON", async () => {
    mockFetchOnce(async (url, init) => {
      expect(init.method).toBe("GET");
      // Ensure query params present
      expect(url).toContain("https://api.example.com/sites");
      expect(url).toContain("limit=10");
      expect(url).toContain("q=harbor");

      return createMockResponse({
        ok: true,
        status: 200,
        bodyText: JSON.stringify([{ id: "site_1" }]),
      });
    });

    const { createRestClient } = await import("./restClient");
    const client = createRestClient({ baseUrl: "https://api.example.com/" });

    const data = await client.get("/sites", { query: { limit: 10, q: "harbor" } });
    expect(data).toEqual([{ id: "site_1" }]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("non-JSON response body returns raw text", async () => {
    mockFetchOnce(async () =>
      createMockResponse({
        ok: true,
        status: 200,
        bodyText: "plain text",
      })
    );

    const { createRestClient } = await import("./restClient");
    const client = createRestClient({ baseUrl: "https://api.example.com" });

    const data = await client.get("/health");
    expect(data).toBe("plain text");
  });

  test("non-2xx response throws ApiError with status and parsed details when JSON", async () => {
    mockFetchOnce(async () =>
      createMockResponse({
        ok: false,
        status: 500,
        bodyText: JSON.stringify({ message: "boom" }),
      })
    );

    const { createRestClient } = await import("./restClient");
    const client = createRestClient({ baseUrl: "https://api.example.com" });

    await expect(client.get("/sites")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      details: { message: "boom" },
    });
  });

  test("when baseUrl is empty, throws ApiError(NO_API_BASE)", async () => {
    const { createRestClient } = await import("./restClient");
    const client = createRestClient({ baseUrl: "" });

    await expect(client.get("/sites")).rejects.toBeInstanceOf(ApiError);
    await expect(client.get("/sites")).rejects.toMatchObject({
      code: "NO_API_BASE",
    });
  });
});
