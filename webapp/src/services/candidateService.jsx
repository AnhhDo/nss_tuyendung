import { apiClient } from "./apiClient";

const baseUrl = "/api/candidates";

const getAll = () => {
  return apiClient.get(baseUrl);
};

const forwardCandidates = (candidateIds) => {
  return apiClient.post(`/api/forward-candidates`, { candidateIds });
};

const getCandidate = (name) => {
  return apiClient.get(`${baseUrl}/${encodeURIComponent(name)}`);
};

const updateCandidate = (candidate_id, updates) => {
  return apiClient.patch(
    `${baseUrl}/${encodeURIComponent(candidate_id)}`,
    updates,
  );
};

export default {
  getAll,
  getCandidate,
  updateCandidate,
  forwardCandidates
};