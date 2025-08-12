import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { toast } from "sonner";

const Dashboard = () => {
  const { magasins } = useAuth();
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState<string>(format(today, "yyyy-MM-dd"));
  const [to, setTo] = useState<string>(format(today, "yyyy-MM-dd"));
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (magasins?.length && !selected) setSelected(magasins[0].codeMagasin || String(magasins[0].numMagasin));
  }, [magasins, selected]);

  const load = async () => {
    try {
      const evo = await api.evolutionCA(from, to, selected);
      setData(evo || []);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (from && to) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, selected]);

  return (
    <div className="min-h-screen">
      <Seo title="Dashboard – Stock Weaver" />
      <Navbar />
      <main className="container py-6 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-40">
            <label className="text-sm text-muted-foreground">Store</label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger><SelectValue placeholder="Select a store" /></SelectTrigger>
              <SelectContent>
                {magasins?.map((m, i) => (
                  <SelectItem key={i} value={m.codeMagasin || String(m.numMagasin)}>{m.libelle || m.codeMagasin || m.numMagasin}</SelectItem>
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
          <Button variant="outline" onClick={load}>Refresh</Button>
        </div>

        <section className="rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-2">CA Evolution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="montantTTC" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
