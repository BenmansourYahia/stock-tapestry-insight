export type ApiBase = string;

export const getApiBase = (): ApiBase => {
  const saved = localStorage.getItem("apiBaseUrl");
  return saved && saved.trim().length > 0 ? saved : "";
};

export const setApiBase = (url: string) => {
  localStorage.setItem("apiBaseUrl", url);
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getApiBase();
  if (!base) throw new Error("API base URL not set. Open Settings and configure it.");
  const url = base.replace(/\/$/, "") + path;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    // Some endpoints may return plain text (e.g., Welcome)
    return (await res.text()) as unknown as T;
  }
}

// Types (minimal based on APIS doc)
export interface Magasin { codeMagasin: string; libelle?: string; numMagasin?: number }
export interface DashboardPoint { date?: string; montantTTC?: number }
export interface DashboardModel { codeMagasin?: string; ca?: number; tickets?: number; quantite?: number }
export interface LoginResponse { success: boolean; data?: any; exception?: any }

// API wrappers
export const api = {
  welcome: () => request<string>("/"),
  login: (nom: string, motPasse: string) =>
    request<LoginResponse>("/Login", { method: "POST", body: JSON.stringify({ nom, motPasse }) }),
  getMagasins: () => request<{ success: boolean; data: Magasin[]; exception?: any }>("/getMagasins", { method: "POST" }),
  dashboardMagasins: (codeMagasin?: string) =>
    request<DashboardModel[]>(`/dashboardMagasins${codeMagasin ? `?codeMagasin=${encodeURIComponent(codeMagasin)}` : ""}`),
  evolutionCA: (dateDebut: string, dateFin: string, codeMagasin?: string) =>
    request<DashboardPoint[]>(`/evolutionCA?dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(dateFin)}${codeMagasin ? `&codeMagasin=${encodeURIComponent(codeMagasin)}` : ""}`),
  getInfosByDate: (debut: string, fin: string) =>
    request<any>("/getInfosByDate", { method: "POST", body: JSON.stringify({ debut, fin }) }),
  getInfosDay: (debut: string, fin: string) =>
    request<any>("/getInfosDay", { method: "POST", body: JSON.stringify({ debut, fin }) }),
  getMagasinsInfoByDate: (withDate: boolean, debut?: string, fin?: string) =>
    request<any>("/getMagasinsInfoByDate", { method: "POST", body: JSON.stringify({ withDate, debut, fin }) }),
  bestSalesPrds: (numMagasin: number, debut: string, fin: string) =>
    request<any>("/bestSalesPrds", { method: "POST", body: JSON.stringify({ numMagasin, debut, fin }) }),
  getPrdsVendus: (numMagasin: number, debut: string, fin: string) =>
    request<any>("/getPrdsVendus", { method: "POST", body: JSON.stringify({ numMagasin, debut, fin }) }),
  getDimsPrdVendus: (numMagasin: number, numProduit: number, debut: string, fin: string) =>
    request<any>("/getDimsPrdVendus", { method: "POST", body: JSON.stringify({ numMagasin, numProduit, debut, fin }) }),
  getLineVentes: (numMvt: number, numMagasin: number) =>
    request<any>("/getLineVentes", { method: "POST", body: JSON.stringify({ numMvt, numMagasin }) }),
  stockByProduct: (isByBarcode: boolean, value: string) =>
    request<any>("/StockByProduct", { method: "POST", body: JSON.stringify(isByBarcode ? { isByBarcode: true, barecode: value } : { isByBarcode: false, codeProduit: value }) }),
  getDims: (barCode: string) =>
    request<any>("/getDims", { method: "POST", body: JSON.stringify({ barCode }) }),
  globalStock: (from = 0, to = 50, stockBy = 1, chaine?: string) =>
    request<any>("/GlobalStock", { method: "POST", body: JSON.stringify({ from, to, stockBy, chaine }) }),
  compareMagasins: (codes: string[]) =>
    request<any>("/compareMagasins", { method: "POST", body: JSON.stringify(codes) }),
  getParam: () => request<any>("/getParam", { method: "POST" }),
};
