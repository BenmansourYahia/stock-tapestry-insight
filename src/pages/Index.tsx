import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Seo title="Stock Weaver Dashboard" />
      <Navbar />
      <main className="container py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Real-time Retail Analytics</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Connect your backend and unlock dashboards for store KPIs, sales evolution, stock insights, and multi-store comparison.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/login"><Button variant="hero" size="lg">Get Started</Button></Link>
          <Link to="/dashboard"><Button variant="outline" size="lg">View Dashboard</Button></Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
