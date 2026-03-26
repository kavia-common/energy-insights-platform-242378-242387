import { sampleAlerts, sampleAnomalies, sampleReports, sampleSites } from "../mocks/sampleData";

describe("backend_api/adapter", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("createMockAdapter returns sample data", async () => {
    const { createMockAdapter } = await import("./adapter");
    const adapter = createMockAdapter();

    expect(adapter.kind).toBe("mock");
    await expect(adapter.listSites()).resolves.toEqual(sampleSites);
    await expect(adapter.listAlerts()).resolves.toEqual(sampleAlerts);
    await expect(adapter.listAnomalies()).resolves.toEqual(sampleAnomalies);
    await expect(adapter.listReports()).resolves.toEqual(sampleReports);
  });

  test("createRestAdapter calls expected endpoints", async () => {
    const getMock = jest.fn(async () => [{ ok: true }]);

    jest.doMock("./restClient", () => ({
      createRestClient: () => ({
        get: getMock,
      }),
    }));

    const { createRestAdapter } = await import("./adapter");
    const adapter = createRestAdapter({ baseUrl: "https://api.example.com" });

    expect(adapter.kind).toBe("rest");

    await adapter.listSites();
    await adapter.listAlerts();
    await adapter.listAnomalies();
    await adapter.listReports();

    expect(getMock).toHaveBeenNthCalledWith(1, "/sites");
    expect(getMock).toHaveBeenNthCalledWith(2, "/alerts");
    expect(getMock).toHaveBeenNthCalledWith(3, "/anomalies");
    expect(getMock).toHaveBeenNthCalledWith(4, "/reports");
  });

  test("createBackendAdapter selects mock when config.useMock is true", async () => {
    jest.doMock("./config", () => ({
      getBackendConfig: () => ({
        useMock: true,
        apiBase: "",
      }),
    }));

    const { createBackendAdapter } = await import("./adapter");
    const adapter = createBackendAdapter();
    expect(adapter.kind).toBe("mock");
  });

  test("createBackendAdapter selects rest when config.useMock is false", async () => {
    jest.doMock("./config", () => ({
      getBackendConfig: () => ({
        useMock: false,
        apiBase: "https://api.example.com",
      }),
    }));

    const getMock = jest.fn(async () => []);
    jest.doMock("./restClient", () => ({
      createRestClient: () => ({
        get: getMock,
      }),
    }));

    const { createBackendAdapter } = await import("./adapter");
    const adapter = createBackendAdapter();
    expect(adapter.kind).toBe("rest");

    await adapter.listSites();
    expect(getMock).toHaveBeenCalledWith("/sites");
  });
});
