import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
}

export const Seo = ({ title, description = "Stock Weaver Dashboard – real-time KPIs, stock, and store analytics.", canonical = "/" }: SeoProps) => {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = description;
      document.head.appendChild(m);
    }
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [title, description, canonical]);
  return null;
};
