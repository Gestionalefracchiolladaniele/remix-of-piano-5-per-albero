import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-top-quality.png";

const navLinks = [
  { name: "Chi Siamo", href: "#chi-siamo" },
  { name: "Servizi", href: "#servizi" },
  { name: "Distributori", href: "#distributori" },
  { name: "Contatti", href: "#contatti" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-primary border-b border-white/30 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo - positioned more to the left */}
            <Link to="/" className="flex-shrink-0 -ml-2 md:-ml-4">
              <img src={logo} alt="Top Quality Vending" className="h-8 md:h-10 w-auto" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white/80 hover:text-white transition-colors font-medium text-sm"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleNavClick("#contatti")}
                className="hidden sm:flex border-white text-white hover:bg-white hover:text-primary text-xs"
              >
                Preventivo Gratuito
              </Button>
              <button
                className="lg:hidden p-1.5 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-primary pt-14 lg:hidden"
          >
            <div className="section-container flex flex-col gap-3 py-6">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-lg font-semibold text-white py-2.5 border-b border-white/20"
                >
                  {link.name}
                </motion.button>
              ))}
              <Button
                size="default"
                variant="outline"
                onClick={() => handleNavClick("#contatti")}
                className="mt-3 border-white text-white hover:bg-white hover:text-primary"
              >
                Preventivo Gratuito
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
