import { BasketProvider } from "@/lib/basket";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { CupBuilder } from "@/components/sections/cup-builder";
import { Boxes } from "@/components/sections/boxes";
import { Desserts } from "@/components/sections/desserts";
import { OrderPolicy } from "@/components/sections/order-policy";
import { Footer } from "@/components/sections/footer";
import { BasketDrawer } from "@/components/sections/basket-drawer";
import { ScrollReveals } from "@/components/scroll-reveals";

export default function Home() {
  return (
    <BasketProvider>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <CupBuilder />
        <Boxes />
        <Desserts />
        <OrderPolicy />
      </main>
      <Footer />
      <BasketDrawer />
      <ScrollReveals />
    </BasketProvider>
  );
}
