import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const Stock = () => {
  const [mode, setMode] = useState<"barcode" | "code">("barcode");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<any>(null);

  const search = async () => {
    try {
      const res = await api.stockByProduct(mode === "barcode", value);
      setResult(res.data || res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Stock – Stock Weaver" />
      <Navbar />
      <main className="container py-6 space-y-4">
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
      </main>
    </div>
  );
};

export default Stock;
