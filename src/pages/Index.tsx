import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import PortfolioSection from "@/components/landing/PortfolioSection";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import VendingMachineAnimation from "@/components/landing/VendingMachineAnimation";
import WhatsAppButton from "@/components/landing/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <VendingMachineAnimation />
      <HeroSection />
      <AboutSection />
      <ProblemSolution />
      <PortfolioSection />
      <Testimonials />
      <FAQSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
