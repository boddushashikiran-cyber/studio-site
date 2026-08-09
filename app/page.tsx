import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkPreview from "@/components/WorkPreview";
import ServicesStrip from "@/components/ServicesStrip";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorkPreview />
        <ServicesStrip />
        <TestimonialsCarousel />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
