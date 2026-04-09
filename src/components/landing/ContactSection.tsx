import { useState } from "react";
import { Check, Lock, ArrowRight, Loader2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  "Sopralluogo e preventivo gratuito",
  "Installazione senza costi",
  "Nessun vincolo contrattuale lungo",
];

const businessTypes = [
  "Ufficio / Azienda",
  "Palestra / Centro Sportivo",
  "Hotel / B&B",
  "Scuola / Università",
  "Ospedale / Clinica",
  "Negozio / Showroom",
  "Altro",
];

export default function ContactSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.businessType) {
      toast({ title: "Compila tutti i campi obbligatori", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        business_type: form.businessType,
        message: form.message || null,
      });

      if (error) throw error;

      // Send push notification to all subscribers (admins)
      const notifPayload = {
        title: "🎯 Nuova Richiesta Preventivo!",
        body: `${form.name} (${form.businessType}) vuole un preventivo`,
        url: "/admin/dashboard"
      };
      
      await supabase.functions.invoke("send-push-notification", {
        body: notifPayload
      }).catch(() => {});

      setIsSuccess(true);
      setForm({ name: "", email: "", phone: "", businessType: "", message: "" });
    } catch (error) {
      toast({ title: "Errore nell'invio", description: "Riprova più tardi", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contatti" className="py-10 md:py-14 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-lines" />
      <div className="absolute top-1/2 left-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-foreground text-xl md:text-2xl">
              Richiedi un <span className="text-gradient">Preventivo Gratuito</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              Compila il form e ti contatteremo entro 24 ore per organizzare un sopralluogo senza impegno.
            </p>


            <ul className="space-y-3 mb-6">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-foreground text-sm">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-primary" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="space-y-2 mb-4">
              <a href="mailto:topquality284@gmail.com" className="flex items-center gap-2 text-foreground text-sm hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail size={14} className="text-primary" />
                </div>
                topquality284@gmail.com
              </a>
              <a href="tel:+393514953432" className="flex items-center gap-2 text-foreground text-sm hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone size={14} className="text-primary" />
                </div>
                +39 351 495 3432
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Lock size={14} />
              I tuoi dati sono al sicuro | GDPR compliant
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {isSuccess ? (
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-white" />
                </div>
                <h3 className="text-lg mb-3 text-foreground">Grazie!</h3>
                <p className="text-muted-foreground text-sm">Ti contatteremo entro 24 ore lavorative per organizzare il sopralluogo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Nome e Cognome *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="Mario Rossi"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="mario@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Telefono</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="+39 333 123 4567"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Tipo di Attività *</label>
                    <select
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm"
                    >
                      <option value="">Seleziona...</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Note aggiuntive</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground resize-none text-sm"
                      placeholder="Numero dipendenti, esigenze particolari..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="default" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Invia Richiesta <ArrowRight size={16} /></>}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Risposta garantita entro 24 ore
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
