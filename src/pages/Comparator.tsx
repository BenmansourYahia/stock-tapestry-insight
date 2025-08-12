import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const Comparator = () => {
  const [codes, setCodes] = useState("");
  const [data, setData] = useState<any | null>(null);

  const run = async () => {
    try {
      const list = codes.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await api.compareMagasins(list);
      setData(res);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Compare – Stock Weaver" />
      <Navbar />
      <main className="container py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Compare Stores</h1>
        <div className="flex flex-wrap items-end gap-3">
          <Input placeholder="Enter store codes separated by commas" value={codes} onChange={(e) => setCodes(e.target.value)} className="max-w-lg" />
          <Button variant="hero" onClick={run}>Compare</Button>
        </div>
        {data && <pre className="rounded-lg border p-4 overflow-auto text-sm bg-card">{JSON.stringify(data, null, 2)}</pre>}
      </main>
    </div>
  );
};

export default Comparator;
