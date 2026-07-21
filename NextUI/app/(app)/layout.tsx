import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
