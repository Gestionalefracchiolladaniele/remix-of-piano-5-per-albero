
# Piano: Pagine Legal + Riorganizzazione Tab Gestione Distributori

## Parte 1: Pagine Legal

Creazione di 3 pagine legali professionali e coerenti con il brand Top Quality Vending:

- **Privacy Policy** (`/privacy`) - Informativa sul trattamento dati personali conforme GDPR, con dettagli su raccolta dati dal form contatti, cookie, e diritti dell'utente
- **Cookie Policy** (`/cookie-policy`) - Dettagli sui cookie tecnici e analitici utilizzati dal sito
- **Termini di Servizio** (`/termini`) - Condizioni generali di utilizzo del sito e dei servizi

I link nel Footer verranno aggiornati per puntare alle nuove pagine reali invece che a `#`.

## Parte 2: Riorganizzazione Admin - Tab Gestione con Distributori come Priorita

Il tab "Distributori" separato viene eliminato e il suo contenuto viene integrato direttamente nel tab "Gestione", rendendolo il focus principale.

### Nuovo flusso del tab Gestione

Il tab "Gestione" diventa un sistema completo organizzato in sotto-sezioni:

**1. Sezione Distributori (prioritaria, in cima)**
- Aggiunta/gestione distributori con nome e posizione
- Per ogni distributore:
  - Inserimento rapido di **Entrate** e **Uscite** (cifra semplice o con dettaglio prodotti)
  - Tabella transazioni con data, tipo, importo, descrizione
  - **Riepilogo finanziario**: Spese totali (rosso), Guadagni totali (verde), Profitto/Perdita netto
  - **Grafico a barre** per distributore: confronto entrate vs uscite per periodo
  - **Grafico a torta** ripartizione spese per distributore
- Dashboard riepilogativa globale: totale distributori, spese, guadagni, profitto netto
- Filtri periodo (7g, 30g, 3m, Anno, Tutto)
- Export CSV

**2. Sezione Prodotti/Inventario (opzionale, sotto)**
- Rimane come e ora ma in posizione secondaria
- Budget mensile, spese per categoria, inventario articoli
- Grafici per categoria/articolo

### Struttura UI

Il componente `InventoryExpenseManager` viene ristrutturato con sotto-tab interni:
- **"Distributori"** (default, primo tab) - il nuovo DistributorManager integrato con grafici
- **"Prodotti & Spese"** - l'attuale gestione inventario/spese

---

## Dettaglio Tecnico

### File da creare
| File | Descrizione |
|------|-------------|
| `src/pages/PrivacyPolicy.tsx` | Pagina Privacy Policy |
| `src/pages/CookiePolicy.tsx` | Pagina Cookie Policy |
| `src/pages/TermsOfService.tsx` | Pagina Termini di Servizio |

### File da modificare
| File | Modifica |
|------|----------|
| `src/App.tsx` | Aggiungere rotte `/privacy`, `/cookie-policy`, `/termini`; rimuovere rotte `/blog` e `/blog/:slug` |
| `src/components/landing/Footer.tsx` | Aggiornare link legal con `Link` di react-router |
| `src/pages/admin/AdminDashboard.tsx` | Rimuovere tab "Distributori" separato; integrare tutto nel tab "Gestione" |
| `src/components/admin/DistributorManager.tsx` | Aggiungere grafici (BarChart entrate/uscite per distributore, PieChart distribuzione spese) con recharts |
| `src/components/admin/InventoryExpenseManager.tsx` | Aggiungere sotto-tab "Distributori" e "Prodotti & Spese", con Distributori come default |

### File da eliminare
| File | Motivo |
|------|--------|
| `src/pages/Blog.tsx` | Blog rimosso |
| `src/pages/BlogPost.tsx` | Blog rimosso |
| `src/components/admin/BlogEditor.tsx` | Blog rimosso |
| `src/components/landing/BlogSection.tsx` | Blog rimosso |

### Grafici Distributori (recharts, gia installato)
- **BarChart**: Per ogni distributore, barre rosse (spese) e verdi (guadagni) affiancate
- **PieChart**: Distribuzione del profitto/spese tra i vari distributori
- Toggle tra vista "per distributore" e "nel tempo" (andamento mensile)
