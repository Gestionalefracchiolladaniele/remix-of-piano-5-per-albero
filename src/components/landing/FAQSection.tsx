import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "In quali zone della Puglia operate?",
    answer: "Copriamo tutta la Puglia: Bari e provincia, Taranto, Lecce, Foggia, Brindisi e la provincia BAT (Barletta-Andria-Trani). Offriamo sopralluogo gratuito in tutta la regione."
  },
  {
    question: "Come funziona l'installazione?",
    answer: "Effettuiamo un sopralluogo gratuito per valutare le tue esigenze, poi installiamo il distributore senza alcun costo. La procedura richiede generalmente 1-2 giorni lavorativi."
  },
  {
    question: "Quanto costa il servizio?",
    answer: "L'installazione è completamente gratuita! Guadagniamo una piccola percentuale sui prodotti venduti, quindi il costo per te è zero. I prodotti sono venduti a prezzi competitivi."
  },
  {
    question: "Chi si occupa del rifornimento?",
    answer: "Ci occupiamo noi di tutto! I nostri operatori effettuano rifornimenti regolari in base al consumo, garantendo sempre prodotti freschi e disponibilità costante."
  },
  {
    question: "Cosa succede se il distributore si guasta?",
    answer: "Offriamo assistenza tecnica H24. In caso di guasto, interveniamo rapidamente per ripristinare il servizio, senza alcun costo aggiuntivo per te."
  },
  {
    question: "Posso scegliere quali prodotti inserire?",
    answer: "Assolutamente sì! Personalizziamo l'offerta in base alle tue preferenze e a quelle dei tuoi dipendenti o clienti. Possiamo includere anche prodotti specifici su richiesta."
  },
  {
    question: "Qual è il numero minimo di dipendenti/utenti?",
    answer: "Non c'è un minimo obbligatorio, ma il servizio è particolarmente conveniente per realtà con almeno 15-20 persone. Contattaci per una valutazione personalizzata."
  },
];

export default function FAQSection() {
  return (
    <section className="py-10 md:py-14 bg-primary">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="mb-3 text-white text-xl md:text-2xl">Domande <span className="text-white/90">Frequenti</span></h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="bg-white border border-white/20 rounded-xl px-4 hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-3.5 text-foreground text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-3.5 text-xs md:text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
