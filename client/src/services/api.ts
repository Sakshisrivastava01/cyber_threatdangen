const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchGeoThreats() {
  const response = await fetch(`${API_BASE_URL}/api/threats/geo`);

  if (!response.ok) {
    throw new Error("Failed to fetch geo threats");
  }

  return response.json();
}

export async function fetchRiskAnalysis() {
  const response = await fetch(`${API_BASE_URL}/api/risk-analysis`);

  if (!response.ok) {
    throw new Error("Failed to fetch risk analysis");
  }

  return response.json();
}

export async function fetchCopilotChat(query: string, history: Array<{ user: string; assistant: string }> = []) {
  const response = await fetch(`${API_BASE_URL}/api/copilot/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, history }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch copilot chat response");
  }

  return response.json();
}

export async function fetchThreatIntel(ip: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/threat-intel/ip/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Threat intel request failed");
    }

    return response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}
