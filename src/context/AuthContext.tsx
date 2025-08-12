import { createContext, useContext, useEffect, useState } from "react";
import { api, Magasin } from "@/lib/api";

interface AuthState {
  user: any | null;
  magasins: Magasin[];
  loading: boolean;
  login: (nom: string, motPasse: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(() => {
    const raw = localStorage.getItem("sw_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [magasins, setMagasins] = useState<Magasin[]>(() => {
    const raw = localStorage.getItem("sw_magasins");
    return raw ? JSON.parse(raw) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("sw_user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("sw_magasins", JSON.stringify(magasins));
  }, [magasins]);

  const login = async (nom: string, motPasse: string) => {
    setLoading(true);
    try {
      const res = await api.login(nom, motPasse);
      if (!res.success) throw new Error("Login failed");
      setUser(res.data?.user || res.data);
      const mags = res.data?.magasins || res.data?.stores || [];
      setMagasins(mags);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setMagasins([]);
    localStorage.removeItem("sw_user");
    localStorage.removeItem("sw_magasins");
  };

  return (
    <AuthContext.Provider value={{ user, magasins, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
