import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#FAFCFF] overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}