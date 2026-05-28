import apiClient from './client';

export async function validateUpload(collectionFile, environmentFile) {
  const formData = new FormData();
  formData.append('collection', collectionFile);
  if (environmentFile) {
    formData.append('environment', environmentFile);
  }

  const { data } = await apiClient.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function runCollection({ collectionFile, environmentFile, environmentVariables }) {
  const formData = new FormData();
  formData.append('collection', collectionFile);
  if (environmentFile) {
    formData.append('environment', environmentFile);
  }
  formData.append('environmentVariables', JSON.stringify(environmentVariables || {}));

  const { data } = await apiClient.post('/api/run-collection', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function fetchExecutionHistory() {
  const { data } = await apiClient.get('/api/execution-history');
  return data;
}

export async function fetchExecutionById(id) {
  const { data } = await apiClient.get(`/api/execution/${id}`);
  return data;
}

export async function deleteExecution(id) {
  const { data } = await apiClient.delete(`/api/execution/${id}`);
  return data;
}

export function getReportDownloadUrl(id, format) {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiBase}/api/execution/${id}/report/${format}`;
}
