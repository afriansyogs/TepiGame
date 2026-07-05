import Navbar from "@/components/common/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-[#FAFCFF]">{children}</main>
    </>
  );
}