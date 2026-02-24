import HeroSection from "@/components/HeroSection";
import ImpactCounter from "@/components/ImpactCounter";
import MissionSection from "@/components/MissionSection";
import GallerySection from "@/components/GallerySection";
import DonateCallout from "@/components/DonateCallout";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactCounter />
      <MissionSection />
      <DonateCallout />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
