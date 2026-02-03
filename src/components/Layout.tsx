import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Header />
        <NavigationTabs />
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
