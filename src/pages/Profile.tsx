import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, logout } = useAuth();
  const [params, setParams] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getParam();
        setParams(res.dataObject || res.data || res);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Seo title="Profile – Stock Weaver" />
      <Navbar />
      <main className="container py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <section className="grid gap-2">
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-2">User</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-2">Parameters</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(params, null, 2)}</pre>
          </div>
        </section>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </main>
    </div>
  );
};

export default Profile;
