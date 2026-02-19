import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-top-quality.png";

const zoneServite = [
  "Bari e provincia",
  "Taranto",
  "Lecce", 
  "Foggia",
  "Brindisi",
  "BAT (Barletta-Andria-Trani)"
];

export default function Footer() {
  return (
    <footer className="bg-primary pt-10 pb-6">
      <div className="section-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Brand - Centered */}
          <div className="lg:col-span-1 flex flex-col items-center text-center">
            <div className="mb-3">
              <img src={logo} alt="Top Quality Vending - Distributori Automatici Bari Puglia" className="h-10 w-auto" />
            </div>
            <p className="text-white/60 mb-3 text-sm">Distributori Automatici H24</p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram Top Quality Vending">
                <Instagram size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Zone Servite */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Zone Servite</h4>
            <ul className="space-y-1.5">
              {zoneServite.map((zona) => (
                <li key={zona} className="text-white/60 text-sm flex items-center gap-1.5">
                  <MapPin size={10} className="text-white/40" />
                  {zona}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Link Rapidi</h4>
            <ul className="space-y-1.5">
              <li><a href="#chi-siamo" className="text-white/60 hover:text-white transition-colors text-sm">Chi Siamo</a></li>
              <li><a href="#servizi" className="text-white/60 hover:text-white transition-colors text-sm">Servizi</a></li>
              <li><a href="#distributori" className="text-white/60 hover:text-white transition-colors text-sm">Distributori</a></li>
              <li><a href="#contatti" className="text-white/60 hover:text-white transition-colors text-sm">Contatti</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Contatti</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail size={14} className="text-white" />
                info@topqualityvending.it
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone size={14} className="text-white" />
                +39 XXX XXX XXXX
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={14} className="text-white" />
                Bari, Puglia
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
            <ul className="space-y-1.5">
              <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="text-white/60 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
              <li><Link to="/termini" className="text-white/60 hover:text-white transition-colors text-sm">Termini di Servizio</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-1.5 text-white/40 text-xs">
          <p>© 2025 Top Quality Vending - Distributori Automatici Bari e Puglia. Tutti i diritti riservati.</p>
          <Link 
            to="/admin" 
            className="text-[10px] text-white/30 hover:text-white transition-colors"
          >
            Area Riservata
          </Link>
        </div>
      </div>
    </footer>
  );
}
