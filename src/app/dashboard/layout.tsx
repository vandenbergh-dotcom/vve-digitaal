import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { VvEProvider } from "@/lib/vve-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VvEProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Header />
        <main className="md:pl-64 pt-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </VvEProvider>
  );
}
