import Navbar from "@/components/cosmos/Navbar";
import Hero from "@/components/cosmos/Hero";
import Ticker from "@/components/cosmos/Ticker";
import About from "@/components/cosmos/About";
import Stats from "@/components/cosmos/Stats";
import Projects from "@/components/cosmos/Projects";
import WhyUs from "@/components/cosmos/WhyUs";
import Testimonials from "@/components/cosmos/Testimonials";
import BNI from "@/components/cosmos/BNI";
import FAQ from "@/components/cosmos/FAQ";
import Contact from "@/components/cosmos/Contact";
import Footer from "@/components/cosmos/Footer";
import FloatingActions from "@/components/cosmos/FloatingActions";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  useScrollReveal();
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Stats />
      <Projects />
      <WhyUs />
      <Testimonials />
      <BNI />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Index;
