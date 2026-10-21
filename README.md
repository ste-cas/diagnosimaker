# 📊 DiagnosisMaker

Tool web per l'analisi dei dati energetici per diagnosi energetiche. Permette di importare, visualizzare, combinare e analizzare dati di consumo energetico su base oraria.

## ✨ Funzionalità

### 📁 Importazione File
- Importazione di file CSV mensili (12 file per anno)
- Parsing automatico con gestione di delimitatori multipli
- Stacking cronologico dei dati
- Merge automatico di date duplicate (somma dei valori)
- Salvataggio come variabili nominate dall'utente

### 📊 Visualizzazione Dati
- **Heatmap**: Visualizzazione matriciale colorata (date × intervalli orari)
- **Grafico a linee**: Andamento temporale dei consumi
- Toggle tra le due visualizzazioni

### 🔀 Combinazione Variabili
- Interfaccia drag-and-drop intuitiva
- Operazioni di addizione e sottrazione tra variabili
- Creazione di variabili combinate personalizzate
- Formula visuale in tempo reale

### 📋 Tabella Master
- Tabella completa con tutte le variabili allineate
- Classificazione automatica:
  - **FASCIA** (F1/F2/F3) basata su orari e giorni
  - **PK/OP** (Peak/Off-Peak) per identificazione picchi
- Gestione automatica festivi italiani (inclusi mobili come Pasqua)
- Paginazione per dataset di grandi dimensioni

## 📋 Requisiti

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Browser moderno (Chrome, Firefox, Edge, Safari)

## 🚀 Installazione

```bash
# Clona il repository
git clone https://github.com/ste-cas/diagnosimaker.git
cd diagnosimaker

# Installa le dipendenze
npm install
```

## 💻 Avvio

### Modalità Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Build Produzione

```bash
npm run build
```

I file compilati saranno nella cartella `dist/`

### Preview Build Produzione

```bash
npm run preview
```

## 📖 Quick Start

```bash
# 1. Installa
npm install

# 2. Avvia
npm run dev

# 3. Apri il browser su http://localhost:5173
```

**Primo utilizzo:**
1. Tab "Import Files" → Crea variabile → Carica 12 file CSV
2. Tab "Visualization" → Visualizza heatmap o grafico
3. Tab "Combine" → Combina variabili con drag-and-drop
4. Tab "Master Table" → Analizza dati con classificazioni FASCIA/PK/OP

📚 **Guida completa:** Vedi [TUTORIAL.md](TUTORIAL.md) per istruzioni dettagliate

---

## 📖 Tutorial d'Uso

### 1️⃣ Tab "Import Files" - Creazione Variabili

**Passo 1: Crea una nuova variabile**
- Inserisci il nome della variabile (es: "consumi_2024")
- Clicca su "Create Variable"

**Passo 2: Carica i file CSV**
- Clicca su "📁 Select Directory" (Chrome/Edge) o "📄 Select Files" (tutti i browser)
- Seleziona la cartella contenente i 12 file CSV mensili
- Attendi il caricamento e l'elaborazione automatica

**Passo 3: Verifica**
- La variabile apparirà nella lista in basso
- Puoi eliminarla con il pulsante 🗑️

### 2️⃣ Tab "Visualization" - Analisi Dati

**Passo 1: Seleziona una variabile**
- Scegli dalla dropdown la variabile da visualizzare

**Passo 2: Scegli la visualizzazione**
- **🗺️ Heatmap**: Matrice colorata con date sulle righe e ore sulle colonne
  - Verde = valori bassi
  - Rosso = valori alti
  - Passa il mouse sulle celle per vedere i valori esatti
  
- **📈 Line Plot**: Grafico temporale continuo
  - Asse X: timestamp (data + ora)
  - Asse Y: valore del consumo
  - Ideale per identificare trend e picchi

### 3️⃣ Tab "Combine" - Combinazione Variabili

**Passo 1: Trascina le variabili**
- Trascina le variabili dalla lista "Available Variables"
- Rilascia nella zona ➕ per aggiungere
- Rilascia nella zona ➖ per sottrarre

**Passo 2: Verifica la formula**
- La formula appare in tempo reale (es: `var1 + var2 - var3`)
- Puoi rimuovere singoli elementi con la ×

**Passo 3: Calcola il risultato**
- Inserisci il nome della variabile risultante
- Clicca su "= Calculate"
- La nuova variabile apparirà nella lista

**Esempio pratico:**
```
Totale = Consumo_Elettrico + Consumo_Gas - Autoconsumo
```

### 4️⃣ Tab "Master Table" - Tabella Completa

**Struttura della tabella:**

| Colonna | Descrizione |
|---------|-------------|
| **Date** | Data in formato DD/MM/YYYY |
| **Hour** | Ora di inizio dell'intervallo (es: 08:00) |
| **Day of Week** | Giorno della settimana (1=Lunedì, ..., 7=Domenica) |
| **FASCIA** | Classificazione tariffaria (F1/F2/F3) |
| **PK/OP** | Peak/Off-Peak (PK/OP) |
| **Variabili** | Valori di tutte le variabili create |

**Classificazione FASCIA:**
- **F1** (Peak): Giorni feriali (Lun-Ven), non festivi, 08:00-19:00
- **F2** (Mid-Peak): 
  - Feriali non festivi: 07:00-08:00 e 19:00-23:00
  - Sabato non festivo: 07:00-23:00
- **F3** (Off-Peak): Tutti gli altri orari

**Classificazione PK/OP:**
- **PK** (Peak): Lun-Ven, non festivi, 08:00-20:00
- **OP** (Off-Peak): Tutti gli altri orari

**Navigazione:**
- Usa i pulsanti "← Previous" e "Next →" per navigare tra le pagine
- 100 righe per pagina

## 📁 Formato File CSV

### Struttura attesa

```csv
Giorno;00:00-00:15;00:15-00:30;...;23:45-00:00
"01/01/2024";"0";"0,025";...;"0,15"
"02/01/2024";"0,05";"0,1";...;"0,2"
```

### Specifiche

- **Nome file**: `ExportData_{mese}.csv` dove mese è in italiano:
  - ExportData_gennaio.csv
  - ExportData_febbraio.csv
  - ... fino a ExportData_dicembre.csv

- **Delimitatore**: Punto e virgola (`;`)

- **Prima colonna**: `Giorno` con date in formato `DD/MM/YYYY` (tra virgolette)

- **Colonne successive**: 96 intervalli orari di 15 minuti ciascuno
  - Formato: `HH:MM-HH:MM` (es: `00:00-00:15`)
  - Totale: 96 colonne (24 ore × 4 intervalli)

- **Valori**: Numerici con virgola come separatore decimale (es: `0,025`)

### Esempio completo

```csv
Giorno;00:00-00:15;00:15-00:30;00:30-00:45;00:45-01:00
"01/01/2024";"0";"0";"0,025";"0"
"02/01/2024";"0,05";"0,1";"0,15";"0,2"
```

## 🏗️ Struttura del Progetto

```
diagnosimaker/
├── src/
│   ├── components/           # Componenti React
│   │   ├── DataTable.tsx            # Tabella formato largo
│   │   ├── DataVisualization.tsx    # Heatmap e grafici
│   │   ├── DirectorySelector.tsx    # Selezione file/cartella
│   │   ├── LongFormatTable.tsx      # Tabella 3 colonne
│   │   ├── MasterTable.tsx          # Tabella master completa
│   │   ├── TabNavigation.tsx        # Navigazione tab
│   │   ├── VariableCombination.tsx  # Combinazione variabili
│   │   └── VariableList.tsx         # Lista variabili
│   ├── utils/                # Funzioni utility
│   │   ├── csvParser.ts             # Parsing CSV
│   │   ├── dataProcessor.ts         # Elaborazione dati
│   │   ├── months.ts                # Mapping mesi italiani
│   │   └── timeUtils.ts             # Utility temporali (festivi, FASCIA, PK/OP)
│   ├── types.ts              # Definizioni TypeScript
│   ├── App.tsx               # Componente principale
│   ├── main.tsx              # Entry point
│   └── index.css             # Stili Tailwind
├── samples/                  # File di esempio
│   └── input_csv/
│       ├── ExportData_gennaio.csv
│       └── ExportData_febbraio.csv
├── public/                   # Asset statici
├── index.html               # HTML template
├── package.json             # Dipendenze e script
├── tsconfig.json            # Configurazione TypeScript
├── vite.config.js           # Configurazione Vite
└── README.md                # Questo file
```

## 🛠️ Tecnologie Utilizzate

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Styling
- **Recharts** - Grafici e visualizzazioni
- **File System Access API** - Lettura directory (Chrome/Edge)

## 📝 Script Disponibili

```bash
npm run dev       # Avvia server di sviluppo
npm run build     # Build per produzione
npm run preview   # Preview build produzione
```

## 🌐 Compatibilità Browser

- ✅ Chrome/Edge (consigliato - supporto completo File System Access API)
- ✅ Firefox (con selezione file multipla)
- ✅ Safari (con selezione file multipla)

## 📄 Licenza

Questo progetto è sviluppato per diagnosi energetiche.

## 🤝 Contributi

Contributi, issue e feature requests sono benvenuti!

## 📧 Contatti

Per informazioni o supporto, apri una issue su GitHub.

---

**Nota**: Questo tool è progettato specificamente per l'analisi di dati energetici con struttura oraria a 15 minuti, tipico dei sistemi di monitoraggio dei consumi.
