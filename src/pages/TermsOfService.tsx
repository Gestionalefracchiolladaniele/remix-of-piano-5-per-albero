import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-top-quality.png";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="section-container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Top Quality Vending" className="h-8 w-auto" />
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Torna al sito
          </Link>
        </div>
      </header>

      <main className="section-container py-10 md:py-16 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Termini di Servizio</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 17 Febbraio 2026</p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Accettazione dei Termini</h2>
            <p>Utilizzando il sito web di Top Quality Vending, l'utente accetta integralmente i presenti Termini di Servizio. Se non si accettano questi termini, si prega di non utilizzare il sito.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Descrizione del Servizio</h2>
            <p>Top Quality Vending offre servizi di distribuzione automatica in comodato d'uso gratuito per aziende e attività commerciali in Puglia. Il sito web fornisce informazioni sui nostri servizi, sul catalogo dei distributori e permette di richiedere un contatto commerciale.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Servizi Offerti</h2>
            <p>I nostri servizi principali comprendono:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Installazione gratuita di distributori automatici</li>
              <li>Rifornimento regolare dei prodotti</li>
              <li>Manutenzione completa delle macchine</li>
              <li>Assistenza tecnica H24</li>
            </ul>
            <p>Le condizioni specifiche del servizio vengono definite nel contratto stipulato tra Top Quality Vending e il cliente.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Utilizzo del Sito</h2>
            <p>L'utente si impegna a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Utilizzare il sito in modo lecito e conforme alle leggi vigenti</li>
              <li>Non tentare di accedere ad aree riservate del sito senza autorizzazione</li>
              <li>Non utilizzare il modulo di contatto per finalità di spam o comunicazioni illecite</li>
              <li>Fornire informazioni veritiere nel modulo di contatto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Proprietà Intellettuale</h2>
            <p>Tutti i contenuti del sito, inclusi testi, immagini, loghi, grafica e software, sono di proprietà di Top Quality Vending o dei rispettivi titolari e sono protetti dalle leggi sul diritto d'autore e sulla proprietà intellettuale.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Limitazione di Responsabilità</h2>
            <p>Top Quality Vending non è responsabile per:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interruzioni temporanee del servizio web</li>
              <li>Eventuali errori o imprecisioni nei contenuti informativi del sito</li>
              <li>Danni derivanti dall'utilizzo improprio del sito da parte dell'utente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Modifiche ai Termini</h2>
            <p>Top Quality Vending si riserva il diritto di modificare i presenti Termini di Servizio in qualsiasi momento. Le modifiche saranno effettive dalla data di pubblicazione su questa pagina.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Legge Applicabile</h2>
            <p>I presenti Termini di Servizio sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il Foro di Bari.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Contatti</h2>
            <p>Per qualsiasi domanda relativa ai presenti Termini di Servizio, contattare: <strong>info@topqualityvending.it</strong>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
