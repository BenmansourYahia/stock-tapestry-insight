import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getApiBase } from "@/lib/api";
import { toast } from "sonner";

const Login = () => {
  const { login, loading } = useAuth();
  const [nom, setNom] = useState("");
  const [motPasse, setMotPasse] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getApiBase()) return toast.error("Set API base in Settings first.");
    try {
      await login(nom, motPasse);
      toast.success("Logged in");
      nav("/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Seo title="Login – Stock Weaver" />
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <div className="grid gap-2">
          <Label htmlFor="nom">Username</Label>
          <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mp">Password</Label>
          <Input id="mp" type="password" value={motPasse} onChange={(e) => setMotPasse(e.target.value)} required />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
      </form>
    </div>
  );
};

export default Login;
