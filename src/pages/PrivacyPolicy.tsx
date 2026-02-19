import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-top-quality.png";

export default function PrivacyPolicy() {
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Informativa sulla Privacy</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 17 Febbraio 2026</p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Titolare del Trattamento</h2>
            <p>Il titolare del trattamento dei dati personali è <strong>Top Quality Vending</strong>, con sede a Bari, Puglia. Per qualsiasi richiesta relativa alla privacy, è possibile contattarci all'indirizzo email: <strong>info@topqualityvending.it</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Dati Raccolti</h2>
            <p>Raccogliamo i seguenti dati personali attraverso il modulo di contatto presente sul nostro sito:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome e cognome</li>
              <li>Indirizzo email</li>
              <li>Numero di telefono (opzionale)</li>
              <li>Tipologia di attività</li>
              <li>Messaggio (opzionale)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Finalità del Trattamento</h2>
            <p>I dati personali raccolti vengono utilizzati per le seguenti finalità:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rispondere alle richieste di contatto e informazioni</li>
              <li>Fornire preventivi e consulenze sui nostri servizi di distribuzione automatica</li>
              <li>Gestire la relazione commerciale con i clienti</li>
              <li>Adempiere ad obblighi di legge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Base Giuridica</h2>
            <p>Il trattamento dei dati si basa sul consenso dell'interessato, espresso al momento dell'invio del modulo di contatto, e sull'esecuzione di misure precontrattuali adottate su richiesta dell'interessato (art. 6, par. 1, lett. a) e b) del GDPR).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Conservazione dei Dati</h2>
            <p>I dati personali vengono conservati per il tempo strettamente necessario al raggiungimento delle finalità per cui sono stati raccolti, e comunque non oltre 24 mesi dalla raccolta, salvo obblighi di legge.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Condivisione dei Dati</h2>
            <p>I dati personali non vengono venduti, ceduti o comunicati a terzi, se non nei seguenti casi:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornitori di servizi tecnici necessari al funzionamento del sito (hosting, database)</li>
              <li>Autorità competenti, quando richiesto dalla legge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Diritti dell'Interessato</h2>
            <p>Ai sensi degli artt. 15-22 del GDPR, l'utente ha il diritto di:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accedere ai propri dati personali</li>
              <li>Richiedere la rettifica o la cancellazione dei dati</li>
              <li>Limitare il trattamento</li>
              <li>Opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso in qualsiasi momento</li>
            </ul>
            <p>Per esercitare i propri diritti, è possibile inviare una richiesta a: <strong>info@topqualityvending.it</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Cookie</h2>
            <p>Per informazioni sull'utilizzo dei cookie, si prega di consultare la nostra <Link to="/cookie-policy" className="text-primary underline">Cookie Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Modifiche all'Informativa</h2>
            <p>Il Titolare si riserva il diritto di apportare modifiche alla presente informativa in qualsiasi momento. La versione aggiornata sarà sempre disponibile su questa pagina.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
