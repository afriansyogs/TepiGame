import HeroBanner from "@/components/features/HeroBanner";
import FlashSale from "@/components/features/FlashSale";
import TopupSteps from "@/components/features/TopupSteps";

export default function HomePage() {
  return (
    <div className="flex flex-col pb-16">
      <HeroBanner />
      <FlashSale />
      <TopupSteps />
    </div>
  );
}


