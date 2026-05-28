export function calculateSummary(execution) {
  if (!execution) {
    return {
      totalRequests: 0,
      passedRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      duration: 0,
    };
  }

  return {
    totalRequests: execution.totalRequests || 0,
    passedRequests: execution.passedRequests || 0,
    failedRequests: execution.failedRequests || 0,
    averageResponseTime: execution.averageResponseTime || 0,
    duration: execution.duration || 0,
  };
}

export function getStatusLabel(passed) {
  return passed ? 'Passed' : 'Failed';
}

export function getPerformanceTag(responseTime) {
  if (responseTime > 1000) return 'Slow';
  if (responseTime > 500) return 'Moderate';
  return 'Fast';
}
