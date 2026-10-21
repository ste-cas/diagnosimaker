# 📚 Tutorial Completo - DiagnosisMaker

Guida passo-passo per utilizzare DiagnosisMaker per l'analisi dei dati energetici.

## 🎯 Obiettivo

Imparare a:
1. Importare dati di consumo energetico
2. Visualizzare i dati in modo efficace
3. Combinare variabili per analisi avanzate
4. Utilizzare la tabella master per reportistica

---

## 🚀 Primi Passi

### 1. Installazione (prima volta)

```bash
# Apri il terminale nella cartella del progetto
cd diagnosimaker

# Installa le dipendenze (solo la prima volta)
npm install

# Avvia l'applicazione
npm run dev
```

Apri il browser su `http://localhost:5173`

### 2. Preparazione dei File CSV

Prima di iniziare, assicurati di avere i 12 file CSV mensili:

```
📁 tua_cartella/
  ├── ExportData_gennaio.csv
  ├── ExportData_febbraio.csv
  ├── ExportData_marzo.csv
  ├── ...
  └── ExportData_dicembre.csv
```

**Verifica il formato:**
- Apri uno dei file con un editor di testo o Excel
- Prima riga: `Giorno;00:00-00:15;00:15-00:30;...`
- Prima colonna: date in formato `DD/MM/YYYY`
- Valori: numeri con virgola (es: `0,025`)

---

## 📖 Guida Dettagliata per Tab

### 📁 TAB 1: Import Files

#### Scenario: Creare la variabile "consumi_2024"

**Passo 1: Nome della variabile**
1. Nella casella "Variable Name" scrivi: `consumi_2024`
2. Clicca su **"Create Variable"**
3. Apparirà la sezione di upload

**Passo 2: Caricamento file**
1. Clicca su **"📁 Select Directory"** (Chrome/Edge)
   - Seleziona la cartella contenente i 12 file CSV
   - Attendi il caricamento (può richiedere alcuni secondi)
   
   **OPPURE**
   
   Clicca su **"📄 Select Files"** (tutti i browser)
   - Seleziona tutti e 12 i file CSV
   - Tieni premuto CTRL (o CMD su Mac) per selezione multipla

**Passo 3: Verifica**
- Vedrai apparire la variabile `consumi_2024` nella lista
- Il sistema ha automaticamente:
  - ✅ Letto tutti i 12 file
  - ✅ Ordinato cronologicamente (gennaio → dicembre)
  - ✅ Unitole date duplicate sommando i valori
  - ✅ Salvato come variabile nominata

**Risultato:** Hai creato la variabile `consumi_2024` con tutti i dati dell'anno!

#### Creare più variabili

Puoi creare quante variabili vuoi:
- `consumi_2023` (dati anno precedente)
- `consumi_2024` (dati anno corrente)
- `produzione_fotovoltaico` (dati produzione)
- `consumi_riscaldamento` (dati specifici)

Ogni variabile è indipendente e può essere combinata con le altre.

---

### 📊 TAB 2: Visualization

#### Scenario: Analizzare i consumi del 2024

**Passo 1: Seleziona la variabile**
1. Dalla dropdown "Select Variable" scegli: `consumi_2024`

**Passo 2: Visualizzazione Heatmap**
1. Clicca su **"🗺️ Heatmap (Matrix)"**
2. Osserva la matrice colorata:
   - **Righe**: date (31 gennaio, 1 febbraio, ecc.)
   - **Colonne**: ore del giorno (00:00, 01:00, 02:00, ...)
   - **Colori**:
     - 🟢 Verde chiaro = consumo basso
     - 🟡 Giallo = consumo medio
     - 🔴 Rosso = consumo alto

3. **Interpretazione:**
   - Bande rosse orizzontali = giorni con consumi elevati
   - Bande rosse verticali = ore con picchi di consumo
   - Zone verdi = periodi di basso consumo

4. **Tooltip:** Passa il mouse su una cella per vedere il valore esatto

**Passo 3: Visualizzazione Line Plot**
1. Clicca su **"📈 Line Plot (3-Column)"**
2. Osserva il grafico temporale:
   - **Asse X**: tempo (data + ora)
   - **Asse Y**: valore del consumo
   - La linea mostra l'andamento dei consumi

3. **Cosa cercare:**
   - Picchi giornalieri (tipicamente 08:00-10:00 e 18:00-20:00)
   - Pattern settimanali (differenze tra工作日 e weekend)
   - Trend stagionali (consumi più alti in inverno/estate)

**Passo 4: Confronto tra variabili**
1. Torna alla dropdown
2. Seleziona un'altra variabile (es: `consumi_2023`)
3. Confronta le visualizzazioni per identificare differenze anno-su-anno

#### Esempio pratico di analisi

**Domanda:** "Quali sono i giorni con i consumi più alti?"

**Procedura:**
1. Visualizza la heatmap di `consumi_2024`
2. Cerca le righe con più celle rosse
3. Annota le date (es: 15 gennaio, 22 gennaio)
4. Passa al line plot per vedere l'andamento orario di quei giorni
5. Identifica le ore di picco

---

### 🔀 TAB 3: Combine

#### Scenario: Calcolare il consumo netto

**Contesto:** Hai due variabili:
- `consumi_totali` (consumi totali dell'edificio)
- `produzione_fotovoltaico` (energia prodotta dai pannelli)

**Obiettivo:** Creare `consumo_netto = consumi_totali - produzione_fotovoltaico`

**Passo 1: Prepara la formula**
1. Nella sezione "Available Variables" vedi le tue variabili
2. Pensa alla formula: `consumi_totali - produzione_fotovoltaico`

**Passo 2: Costruisci la formula con drag-and-drop**
1. Trascina `consumi_totali` nella zona **➕ ADD**
   - Apparirà nella formula: `consumi_totali`
   
2. Trascina `produzione_fotovoltaico` nella zona **➖ SUBTRACT**
   - La formula diventa: `consumi_totali - produzione_fotovoltaico`

**Passo 3: Verifica la formula**
- Controlla che la formula visualizzata sia corretta
- Puoi rimuovere elementi cliccando sulla × accanto a ogni variabile
- Puoi aggiungere altre variabili se necessario

**Passo 4: Calcola il risultato**
1. Nella casella "Result Variable Name" scrivi: `consumo_netto`
2. Clicca su **"= Calculate"**
3. La nuova variabile `consumo_netto` viene creata
4. Torna alla tab "Visualization" per analizzarla

#### Scenario avanzato: Combinazione multipla

**Formula:** `totale = var1 + var2 + var3 - var4`

**Procedura:**
1. Trascina `var1` → zona ➕
2. Trascina `var2` → zona ➕
3. Trascina `var3` → zona ➕
4. Trascina `var4` → zona ➖
5. Nome risultato: `totale`
6. Clicca "= Calculate"

**Risultato:** Nuova variabile `totale` con la combinazione calcolata

#### Casi d'uso comuni

**1. Consumo elettrico netto:**
```
consumo_elettrico_netto = consumo_elettrico_totale - produzione_fotovoltaico
```

**2. Consumo riscaldamento:**
```
consumo_riscaldamento = consumo_gas + consumo_elettrico_pompa_calore
```

**3. Bilancio energetico:**
```
bilancio = produzione_totale - consumi_totali
```

**4. Consumo specifico:**
```
consumo_per_mq = consumo_totale / superficie  (richiede combinazione manuale)
```

---

### 📋 TAB 4: Master Table

#### Scenario: Creare un report per la diagnosi energetica

**Passo 1: Naviga nella tabella**
1. La tabella mostra automaticamente tutte le variabili create
2. Usa i pulsanti "← Previous" e "Next →" per navigare
3. Ogni pagina mostra 100 righe

**Passo 2: Comprendi le colonne**

| Colonna | Significato | Esempio |
|---------|-------------|---------|
| **Date** | Data del rilevamento | 15/01/2024 |
| **Hour** | Ora di inizio intervallo | 08:00 |
| **Day of Week** | Giorno (1=Lun, 7=Dom) | 1 (Monday) |
| **FASCIA** | Classificazione tariffaria | F1, F2, o F3 |
| **PK/OP** | Peak/Off-Peak | PK o OP |
| **Variabili** | Valori delle variabili | 12.5, 0.025, ecc. |

**Passo 3: Analizza le classificazioni**

**FASCIA:**
- **F1** (rosso): Ore di punta nei giorni feriali (08:00-19:00)
- **F2** (giallo): Ore intermedie (07:00-08:00, 19:00-23:00 feriali; 07:00-23:00 sabato)
- **F3** (verde): Ore fuori punta (notte, domenica, festivi)

**PK/OP:**
- **PK** (blu): Peak hours (Lun-Ven, 08:00-20:00, non festivi)
- **OP** (grigio): Off-peak (tutti gli altri orari)

**Passo 4: Utilizzo pratico**

**Esempio 1: Calcolo costo energetico**
1. Filtra mentalmente le righe con FASCIA = F1
2. Somma i valori della variabile `consumo_elettrico` per quelle righe
3. Moltiplica per il costo dell'energia in F1
4. Ripeti per F2 e F3
5. Somma i tre costi per ottenere il costo totale

**Esempio 2: Analisi pattern settimanali**
1. Cerca le righe con Day of Week = 1 (Lunedì)
2. Confronta con Day of Week = 7 (Domenica)
3. Identifica le differenze di consumo
4. Calcola la percentuale di riduzione nel weekend

**Esempio 3: Identificazione anomalie**
1. Cerca giorni con valori anomali (molto alti o molto bassi)
2. Verifica se coincidono con festivi o weekend
3. Se no, potrebbe essere un'anomalia da investigare

#### Esportazione dati (futuro)

Attualmente la tabella è visualizzabile ma non esportabile. Per esportare:
1. Seleziona manualmente i dati
2. Copia e incolla in Excel
3. Oppure usa gli strumenti di sviluppo del browser per estrarre i dati

---

## 💡 Suggerimenti e Best Practices

### Organizzazione delle variabili

**Nomenclatura consigliata:**
```
✅ consumi_2023
✅ consumi_2024
✅ produzione_fv_2024
✅ consumo_netto_2024
✅ riscaldamento_2024

❌ var1
❌ dati
❌ test
```

**Principi:**
- Usa nomi descrittivi
- Includi l'anno se rilevante
- Usa underscore per separare le parole
- Sii coerente nella nomenclatura

### Analisi efficace

**1. Inizia con la visualizzazione**
- Usa la heatmap per una panoramica rapida
- Identifica pattern e anomalie
- Poi approfondisci con il line plot

**2. Confronta periodi diversi**
- Crea variabili per anni diversi
- Confrontale nella visualizzazione
- Identifica trend e miglioramenti

**3. Usa le combinazioni**
- Calcola consumi netti
- Isola componenti specifici
- Crea indicatori personalizzati

**4. Sfrutta la tabella master**
- Analizza le classificazioni FASCIA e PK/OP
- Calcola costi differenziati
- Identifica opportunità di ottimizzazione

### Gestione dei dati

**Backup:**
- Tieni una copia dei file CSV originali
- Documenta la provenienza dei dati
- Nota eventuali elaborazioni effettuate

**Validazione:**
- Verifica che tutti i 12 mesi siano presenti
- Controlla che non ci siano date mancanti
- Verifica la coerenza dei valori (no negativie, no valori assurdi)

**Documentazione:**
- Tieni un log delle variabili create
- Documenta le combinazioni effettuate
- Nota le ipotesi e le metodologie utilizzate

---

## 🔧 Risoluzione Problemi

### Problema: "No ExportData_*.csv files found"

**Causa:** I file non corrispondono al formato atteso

**Soluzione:**
1. Verifica i nomi dei file: devono essere `ExportData_gennaio.csv`, ecc.
2. Controlla che l'estensione sia `.csv` (non `.xlsx` o `.txt`)
3. Verifica che il contenuto abbia il formato corretto (vedi sezione "Formato File CSV")

### Problema: "Error processing files"

**Causa:** Errore nel parsing dei file

**Soluzione:**
1. Apri un file CSV con un editor di testo
2. Verifica che il delimitatore sia `;` (punto e virgola)
3. Controlla che le date siano nel formato `DD/MM/YYYY`
4. Verifica che i valori numerici usino la virgola come separatore decimale

### Problema: La heatmap non mostra tutti i dati

**Causa:** Performance (la heatmap mostra solo un subset)

**Soluzione:**
1. La heatmap mostra i primi 30 giorni e intervalli orari
2. Per vedere tutti i dati, usa la tabella master
3. Oppure esporta i dati per analisi esterna

### Problema: I calcoli FASCIA/PK/OP sembrano errati

**Causa:** Festivi non riconosciuti

**Soluzione:**
1. Verifica che l'anno sia corretto nei dati
2. Controlla che i festivi italiani siano calcolati correttamente
3. Ricorda che Pasqua e Lunedì dell'Angelo sono calcolati automaticamente
4. Alcuni festivi locali potrebbero non essere inclusi

---

## 📊 Esempi di Analisi Completa

### Esempio 1: Diagnosi energetica annuale

**Obiettivo:** Analizzare i consumi del 2024 e identificare opportunità di risparmio

**Procedura:**
1. **Importa i dati:**
   - Crea variabile `consumi_2024` dai 12 file CSV
   
2. **Visualizza:**
   - Heatmap: identifica i periodi con consumi più alti
   - Line plot: analizza i trend stagionali
   
3. **Analizza:**
   - Tabella master: filtra per FASCIA F1 e calcola i consumi di punta
   - Confronta工作日 vs weekend
   
4. **Combina:**
   - Se hai dati di produzione, crea `consumo_netto = consumi - produzione`
   
5. **Report:**
   - Documenta i picchi di consumo
   - Identifica le ore più critiche
   - Proponi interventi di efficientamento

### Esempio 2: Confronto anno-su-anno

**Obiettivo:** Valutare l'efficacia di interventi di efficientamento

**Procedura:**
1. **Importa entrambi gli anni:**
   - `consumi_2023` (prima dell'intervento)
   - `consumi_2024` (dopo l'intervento)
   
2. **Visualizza entrambi:**
   - Confronta le heatmap
   - Sovrapponi i line plot (mentalmente)
   
3. **Calcola la differenza:**
   - Crea `risparmio = consumi_2023 - consumi_2024`
   
4. **Analizza:**
   - Tabella master: verifica in quali ore/giorni si è risparmiato
   - Calcola la percentuale di riduzione
   
5. **Report:**
   - Quantifica il risparmio energetico
   - Identifica i periodi con maggior beneficio
   - Calcola il ROI dell'intervento

---

## 🎓 Concetti Chiave

### FASCIA Oraria

Le fasce orarie seguono la normativa italiana per le tariffe energetiche:

- **F1 (Peak):** Lunedì-Venerdì, 08:00-19:00 (esclusi festivi)
  - Tariffa più alta
  - Massima domanda sulla rete
  
- **F2 (Mid-Peak):** 
  - Lunedì-Venerdì: 07:00-08:00 e 19:00-23:00
  - Sabato: 07:00-23:00
  - (esclusi festivi)
  - Tariffa media
  
- **F3 (Off-Peak):** Tutti gli altri orari
  - Notte, domenica, festivi
  - Tariffa più bassa
  - Minima domanda sulla rete

### PK/OP (Peak/Off-Peak)

Classificazione semplificata:

- **PK (Peak):** Lunedì-Venerdì, 08:00-20:00 (esclusi festivi)
- **OP (Off-Peak):** Tutti gli altri orari

### Intervalli Orari

I dati sono registrati ogni 15 minuti:
- 96 intervalli per giorno (24 ore × 4)
- Formato: `HH:MM-HH:MM` (es: `08:00-08:15`)
- Ogni intervallo rappresenta il consumo/produzione in quel quarto d'ora

### Merge di Date Duplicate

Se lo stesso giorno appare più volte nei file CSV:
- I valori vengono sommati automaticamente
- Utile per dati da più contatori o sensori
- Esempio: se `01/01/2024` appare 2 volte con valori `10` e `5`, il risultato è `15`

---

## 📞 Supporto

Per problemi o domande:
1. Controlla la sezione "Risoluzione Problemi"
2. Verifica il formato dei file CSV
3. Controlla la console del browser (F12) per errori
4. Apri una issue su GitHub

---

## 🎉 Conclusioni

Ora sei pronto per utilizzare DiagnosisMaker per le tue analisi energetiche!

**Ricorda:**
- ✅ Organizza bene le variabili con nomi descrittivi
- ✅ Inizia con la visualizzazione per una panoramica rapida
- ✅ Usa le combinazioni per analisi avanzate
- ✅ Sfrutta la tabella master per reportistica dettagliata
- ✅ Documenta le tue analisi e le ipotesi utilizzate

**Buon lavoro!** 🚀
