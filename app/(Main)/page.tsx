import HeroBanner from "@/components/features/HeroBanner";
import FlashSale from "@/components/features/FlashSale";
import PopularGames from "@/components/features/PopularGames";
import TopupSteps from "@/components/features/TopupSteps";
import Reviews from "@/components/features/Reviews";

export default function HomePage() {
  return (
    <div className="flex flex-col pb-16">
      <HeroBanner />
      <FlashSale />
      <PopularGames />
      <TopupSteps />
      <Reviews />
    </div>
  );
}
