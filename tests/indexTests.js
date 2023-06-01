const {
  WebApplication,
  createSummaryForSession,
  logInfo,
  prepareThrottlingChartDataForSession,
  runAnalysisWithExternalThrottling,
} = require('./index');

describe('index.js', () => {
  describe('WebApplication', () => {
    it('should create an WebApplication object with the correct properties', () => {
      const webApplication = new WebApplication('My App', '1.0.0', 'https://myapp.com');
      expect(webApplication.name).toBe('My App');
      expect(webApplication.version).toBe('1.0.0');
      expect(webApplication.url).toBe('https://myapp.com');
    });
  });

  describe('createSummaryForSession', () => {
    it('should generate data for a throttledAuditGroup with the correct properties', () => {
      const webApplication = new WebApplication('My App', '1.0.0', 'https://myapp.com');
      const data = createSummaryForSession(webApplication);
      expect(data.appName).toBe('My App');
      expect(data.appVersion).toBe('1.0.0');
      expect(data.appUrl).toBe('https://myapp.com');
      expect(data.throttledAuditGroupId).toBeDefined();
    });
  });

  describe('logInfo', () => {
    it('should log a message to the console', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      logInfo('Test message');
      expect(spy).toHaveBeenCalledWith('Test message');
      spy.mockRestore();
    });
  });

  describe('prepareThrottlingChartDataForSession', () => {
    it('should return an object with the correct properties', () => {
      const webApplication = new WebApplication('My App', '1.0.0', 'https://myapp.com');
      const throttledAuditGroupId = '1234';
      const reportFolder = '/path/to/reports';
      const result = prepareThrottlingChartDataForSession(webApplication, throttledAuditGroupId, reportFolder);
      expect(result).toHaveProperty('throttledAuditGroupId', throttledAuditGroupId);
      expect(result).toHaveProperty('reportFolder', reportFolder);
      expect(result).toHaveProperty('results');
    });
  });

  describe('runAnalysisWithExternalThrottling', () => {
    it('should run the analysis with the correct parameters', async () => {
      const webApplication = new WebApplication('My App', '1.0.0', 'https://myapp.com');
      const url = 'https://myapp.com';
      const reportFolder = '/path/to/reports';
      const throttledAuditGroupId = '1234';
      const cpuSlowdownMultiplierArray = [1, 2, 3];
      const networkSpeedArray = [100, 200, 300];
      const spy = jest.spyOn(global, 'uuidv4').mockReturnValue(throttledAuditGroupId);
      const mockFn = jest.fn();
      const mockOrchestrateAnalysis = jest.fn().mockResolvedValue(undefined);
      const originalOrchestrateAnalysis = global.orchestrateAnalysisWithBuiltInThrottling;
      global.orchestrateAnalysisWithBuiltInThrottling = mockOrchestrateAnalysis;
      await runAnalysisWithExternalThrottling(webApplication, url, reportFolder, null, cpuSlowdownMultiplierArray, networkSpeedArray);
      expect(mockFn).not.toHaveBeenCalled();
      expect(mockOrchestrateAnalysis).toHaveBeenCalledTimes(9);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 100, 1, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 100, 2, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 100, 3, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 200, 1, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 200, 2, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 200, 3, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 300, 1, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 300, 2, reportFolder);
      expect(mockOrchestrateAnalysis).toHaveBeenCalledWith(throttledAuditGroupId, webApplication, url, 300, 3, reportFolder);
      global.orchestrateAnalysisWithBuiltInThrottling = originalOrchestrateAnalysis;
      spy.mockRestore();
    });
  });
});