import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function toDdMMyyyy(dateYYYYMMDD: string, end = false) {
  const [y, m, d] = dateYYYYMMDD.split("-");
  return `${d}-${m}-${y} ${end ? "23:59:59" : "00:00:00"}`;
}

const Stores = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [best, setBest] = useState<any | null>(null);
  const [sold, setSold] = useState<any | null>(null);

  const [mvtStore, setMvtStore] = useState<string>("");
  const [numMvt, setNumMvt] = useState<string>("");
  const [lines, setLines] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getMagasins();
        const list = res.data || [];
        setStores(list);
        if (list.length) {
          const id = list[0].numMagasin ? String(list[0].numMagasin) : list[0].codeMagasin;
          setSelected(id);
          setMvtStore(id);
        }
      } catch (e: any) {
        toast.error(e.message);
      }
    })();
  }, []);

  const getNumMagasin = (): number => {
    const found = stores.find((s) => String(s.numMagasin) === selected || s.codeMagasin === selected);
    return found?.numMagasin ?? parseInt(selected, 10);
  };

  const runBest = async () => {
    if (!from || !to) return toast.error("Select date range");
    try {
      const res = await api.bestSalesPrds(getNumMagasin(), toDdMMyyyy(from, false), toDdMMyyyy(to, true));
      setBest(res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const runSold = async () => {
    if (!from || !to) return toast.error("Select date range");
    try {
      const res = await api.getPrdsVendus(getNumMagasin(), toDdMMyyyy(from, false), toDdMMyyyy(to, true));
      setSold(res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const runLines = async () => {
    try {
      const nmv = parseInt(numMvt, 10);
      const st = stores.find((s) => String(s.numMagasin) === mvtStore || s.codeMagasin === mvtStore);
      const nmag = st?.numMagasin ?? parseInt(mvtStore, 10);
      const res = await api.getLineVentes(nmv, nmag);
      setLines(res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Stores – Stock Weaver" />
      <Navbar />
      <main className="container py-6 space-y-6">
        <section>
          <h1 className="text-2xl font-semibold mb-4">Stores</h1>
          <div className="grid gap-3">
            {stores.map((s, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="font-medium">{s.libelle || s.codeMagasin || s.numMagasin}</div>
                <div className="text-sm text-muted-foreground">Code: {s.codeMagasin || s.numMagasin}</div>
              </div>
            ))}
            {!stores.length && <div className="text-muted-foreground">No stores found.</div>}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">KPIs by Period</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-40">
              <label className="text-sm text-muted-foreground">Store</label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger><SelectValue placeholder="Select a store" /></SelectTrigger>
                <SelectContent>
                  {stores.map((m, i) => (
                    <SelectItem key={i} value={m.numMagasin ? String(m.numMagasin) : m.codeMagasin}>{m.libelle || m.codeMagasin || m.numMagasin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button variant="outline" onClick={runBest}>Best Sales</Button>
            <Button variant="outline" onClick={runSold}>Sold Products</Button>
          </div>
          {(best || sold) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <h3 className="font-medium mb-2">Best Sales Products</h3>
                <pre className="text-xs overflow-auto">{JSON.stringify(best, null, 2)}</pre>
              </div>
              <div className="rounded-lg border p-3">
                <h3 className="font-medium mb-2">Sold Products</h3>
                <pre className="text-xs overflow-auto">{JSON.stringify(sold, null, 2)}</pre>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Movement Lines</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-40">
              <label className="text-sm text-muted-foreground">Store</label>
              <Select value={mvtStore} onValueChange={setMvtStore}>
                <SelectTrigger><SelectValue placeholder="Select a store" /></SelectTrigger>
                <SelectContent>
                  {stores.map((m, i) => (
                    <SelectItem key={i} value={m.numMagasin ? String(m.numMagasin) : m.codeMagasin}>{m.libelle || m.codeMagasin || m.numMagasin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Movement #</label>
              <Input placeholder="numMvt" value={numMvt} onChange={(e) => setNumMvt(e.target.value)} />
            </div>
            <Button variant="hero" onClick={runLines}>Get Lines</Button>
          </div>
          {lines && (
            <div className="rounded-lg border p-3">
              <pre className="text-xs overflow-auto">{JSON.stringify(lines, null, 2)}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Stores;
