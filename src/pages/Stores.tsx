import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Stores = () => {
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getMagasins();
        setStores(res.data || []);
      } catch (e: any) {
        toast.error(e.message);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Seo title="Stores – Stock Weaver" />
      <Navbar />
      <main className="container py-6">
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
      </main>
    </div>
  );
};

export default Stores;
