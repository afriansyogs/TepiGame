import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getServerUserProfile } from "@/lib/auth-server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialProfile = await getServerUserProfile();

  return (
    <>
      <Navbar initialProfile={initialProfile} />
      <main className="flex-grow bg-[#FAFCFF] overflow-x-hidden pt-20">{children}</main>
      <Footer />
    </>
  );
}