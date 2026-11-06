import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp, WhatsAppFloatProvider } from "@/components/site/WhatsAppFloat";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <WhatsAppFloatProvider>
      <div className="flex min-h-screen flex-col bg-cream">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </WhatsAppFloatProvider>
  );
}