import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, autoGenerate } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Argomenti di valore per il target - PMI e professionisti italiani
    const autoTopics = [
      "Come gestire il tempo in modo efficace: tecniche pratiche per professionisti",
      "5 errori comuni nella gestione clienti e come evitarli",
      "Guida completa alla produttività aziendale nel 2025",
      "Come migliorare la comunicazione con i clienti",
      "Strategie per aumentare la fidelizzazione dei clienti",
      "Come organizzare al meglio la giornata lavorativa",
      "Tecniche di marketing locale che funzionano davvero",
      "Come gestire le recensioni online della tua attività",
      "Guida pratica al customer service eccellente",
      "Come creare un'esperienza cliente memorabile",
      "Strategie per differenziarsi dalla concorrenza locale",
      "Come gestire lo stress lavorativo: consigli pratici",
      "L'importanza del passaparola e come stimolarlo",
      "Come fissare i prezzi giusti per i tuoi servizi",
      "Tecniche di vendita efficaci per attività locali",
      "Come gestire i reclami dei clienti in modo professionale",
      "Strategie per attrarre nuovi clienti nella tua zona",
      "Come creare promozioni efficaci senza svendere",
      "L'arte della prima impressione: conquistare il cliente al primo contatto",
      "Come costruire relazioni durature con i clienti"
    ];

    let selectedTopic: string;
    
    if (autoGenerate) {
      // Seleziona un argomento casuale
      const randomIndex = Math.floor(Math.random() * autoTopics.length);
      selectedTopic = autoTopics[randomIndex];
      console.log("Auto-generated topic:", selectedTopic);
    } else if (topic && typeof topic === "string") {
      selectedTopic = topic;
    } else {
      throw new Error("Topic is required");
    }

    const systemPrompt = `Sei un esperto copywriter SEO italiano specializzato in contenuti di valore per imprenditori e professionisti.
Scrivi articoli informativi, professionali e ottimizzati per i motori di ricerca.
Il tuo stile è chiaro, coinvolgente e orientato al valore pratico per il lettore.
Usa un tono professionale ma accessibile, adatto a imprenditori e professionisti italiani.
NON menzionare mai nomi di aziende, brand o servizi specifici. Scrivi contenuti puramente informativi e utili.
Ogni articolo deve essere unico, originale e fornire valore reale al lettore.`;

    const userPrompt = `Genera un articolo blog completo basato su questo argomento: "${selectedTopic}"

IMPORTANTE: Rispondi SOLO con un oggetto JSON valido, senza markdown o altro testo. Il formato deve essere esattamente questo:

{
  "title": "Titolo accattivante e SEO-friendly (max 60 caratteri)",
  "slug": "slug-url-ottimizzato-${Date.now()}",
  "excerpt": "Estratto coinvolgente di 2-3 frasi che riassume l'articolo",
  "content": "<h2>Sottotitolo</h2><p>Contenuto in HTML con paragrafi, liste, sottotitoli h2/h3, testo in <strong>grassetto</strong> per evidenziare concetti chiave...</p>",
  "meta_title": "Meta title per Google (max 60 caratteri)",
  "meta_description": "Meta description per Google (max 160 caratteri)",
  "keywords": ["parola-chiave-1", "parola-chiave-2", "parola-chiave-3"]
}

REGOLE IMPORTANTI:
- L'articolo deve essere di almeno 800 parole, ben strutturato con sottotitoli H2 e H3
- Usa elenchi puntati e numerati dove appropriato
- Usa il tag <strong> per evidenziare concetti chiave e parole importanti
- Contenuto 100% informativo e pratico, con consigli applicabili subito
- NON menzionare mai nomi di aziende, brand, prodotti o servizi specifici
- NON includere call-to-action commerciali o inviti a contattare qualcuno
- Concludi con un riassunto dei punti chiave o un pensiero finale motivazionale`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite richieste superato. Riprova tra qualche minuto." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crediti AI esauriti. Aggiungi crediti al workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Errore nella generazione del contenuto");
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error("Nessun contenuto generato");
    }

    // Parse the JSON response
    let blogPost;
    try {
      // Remove markdown code blocks if present
      let cleanedText = generatedText.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      blogPost = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", generatedText);
      throw new Error("Errore nel parsing della risposta AI");
    }

    return new Response(JSON.stringify(blogPost), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-blog-post:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Errore sconosciuto" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
