import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

function toDdMMyyyy(dateYYYYMMDD: string, end = false) {
  const [y, m, d] = dateYYYYMMDD.split("-");
  return `${d}-${m}-${y} ${end ? "23:59:59" : "00:00:00"}`;
}

const Stock = () => {
  const [mode, setMode] = useState<"barcode" | "code">("barcode");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<any>(null);

  const [barcode, setBarcode] = useState("");
  const [dims, setDims] = useState<any | null>(null);

  const [numMagasin, setNumMagasin] = useState("");
  const [numProduit, setNumProduit] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dimsSold, setDimsSold] = useState<any | null>(null);

  const search = async () => {
    try {
      const res = await api.stockByProduct(mode === "barcode", value);
      setResult(res.data || res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const searchDims = async () => {
    try {
      const res = await api.getDims(barcode);
      setDims(res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const searchDimsVendus = async () => {
    if (!numMagasin || !numProduit || !from || !to) return toast.error("Fill all fields");
    try {
      const res = await api.getDimsPrdVendus(parseInt(numMagasin, 10), parseInt(numProduit, 10), toDdMMyyyy(from, false), toDdMMyyyy(to, true));
      setDimsSold(res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Stock – Stock Weaver" />
      <Navbar />
      <main className="container py-6 space-y-6">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">Stock by Product</h1>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-2">
              <Button variant={mode === "barcode" ? "default" : "outline"} onClick={() => setMode("barcode")}>Barcode</Button>
              <Button variant={mode === "code" ? "default" : "outline"} onClick={() => setMode("code")}>Code</Button>
            </div>
            <Input placeholder={mode === "barcode" ? "Enter barcode" : "Enter product code"} value={value} onChange={(e) => setValue(e.target.value)} className="max-w-sm" />
            <Button variant="hero" onClick={search}>Search</Button>
          </div>
          {result && (
            <pre className="rounded-lg border p-4 overflow-auto text-sm bg-card">{JSON.stringify(result, null, 2)}</pre>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Dimensions by Barcode</h2>
          <div className="flex flex-wrap items-end gap-3">
            <Input placeholder="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="max-w-sm" />
            <Button variant="outline" onClick={searchDims}>Get Dimensions</Button>
          </div>
          {dims && <pre className="rounded-lg border p-4 overflow-auto text-sm bg-card">{JSON.stringify(dims, null, 2)}</pre>}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Sold Product Dimensions (by period)</h2>
          <div className="flex flex-wrap items-end gap-3">
            <Input placeholder="Store ID (numMagasin)" value={numMagasin} onChange={(e) => setNumMagasin(e.target.value)} className="max-w-[200px]" />
            <Input placeholder="Product ID (numProduit)" value={numProduit} onChange={(e) => setNumProduit(e.target.value)} className="max-w-[200px]" />
            <div>
              <label className="text-sm text-muted-foreground">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button variant="outline" onClick={searchDimsVendus}>Fetch</Button>
          </div>
          {dimsSold && <pre className="rounded-lg border p-4 overflow-auto text-sm bg-card">{JSON.stringify(dimsSold, null, 2)}</pre>}
        </section>
      </main>
    </div>
  );
};

export default Stock;
