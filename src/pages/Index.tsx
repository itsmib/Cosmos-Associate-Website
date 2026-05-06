import Navbar from "@/components/cosmos/Navbar";
import Hero from "@/components/cosmos/Hero";
import Ticker from "@/components/cosmos/Ticker";
import About from "@/components/cosmos/About";
import Stats from "@/components/cosmos/Stats";
import Projects from "@/components/cosmos/Projects";
import VideoShowcase from "@/components/cosmos/VideoShowcase";
import WhyUs from "@/components/cosmos/WhyUs";
import Testimonials from "@/components/cosmos/Testimonials";
import GoogleReviewsBoard from "@/components/cosmos/GoogleReviewsBoard";
import BNI from "@/components/cosmos/BNI";
import FAQ from "@/components/cosmos/FAQ";
import Contact from "@/components/cosmos/Contact";
import Footer from "@/components/cosmos/Footer";
import SideRail from "@/components/cosmos/SideRail";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  useScrollReveal();
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    // Wait a tick so the section is mounted before we scroll.
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, [hash]);
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Stats />
      <VideoShowcase />
      <Projects />
      <WhyUs />
      <Testimonials />
      <GoogleReviewsBoard />
      <BNI />
      <FAQ />
      <Contact />
      <Footer />
      <SideRail />
    </main>
  );
};

export default Index;
