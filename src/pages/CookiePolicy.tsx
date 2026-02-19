import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-top-quality.png";

export default function CookiePolicy() {
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 17 Febbraio 2026</p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Cosa sono i Cookie</h2>
            <p>I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell'utente quando visita un sito web. Vengono utilizzati per migliorare l'esperienza di navigazione e per raccogliere informazioni sull'utilizzo del sito.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Cookie Tecnici</h2>
            <p>Il nostro sito utilizza cookie tecnici necessari al corretto funzionamento del sito. Questi cookie non richiedono il consenso dell'utente e includono:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cookie di sessione</strong>: necessari per la navigazione e per mantenere la sessione dell'utente</li>
              <li><strong>Cookie di autenticazione</strong>: utilizzati per riconoscere gli utenti registrati nell'area riservata</li>
              <li><strong>Cookie di preferenza</strong>: memorizzano le preferenze dell'utente (es. tema chiaro/scuro)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Cookie di Terze Parti</h2>
            <p>Il sito potrebbe utilizzare servizi di terze parti che installano cookie propri:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Servizi di hosting</strong>: per garantire la disponibilità e le prestazioni del sito</li>
              <li><strong>Servizi di database</strong>: per la gestione sicura dei dati</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Gestione dei Cookie</h2>
            <p>L'utente può gestire le preferenze sui cookie direttamente dalle impostazioni del proprio browser. Di seguito i link alle guide dei principali browser:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Apple Safari</li>
              <li>Microsoft Edge</li>
            </ul>
            <p>La disabilitazione dei cookie tecnici potrebbe compromettere il corretto funzionamento del sito.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Durata dei Cookie</h2>
            <p>I cookie tecnici hanno una durata limitata alla sessione di navigazione o comunque non superiore a 12 mesi. I cookie di preferenza possono avere una durata massima di 12 mesi.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Maggiori Informazioni</h2>
            <p>Per maggiori informazioni sul trattamento dei dati personali, consultare la nostra <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>. Per qualsiasi domanda, contattarci a: <strong>info@topqualityvending.it</strong>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
