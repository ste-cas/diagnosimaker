# 📋 Summary - DiagnosisMaker

Documento riassuntivo del progetto e delle funzionalità implementate.

## 🎯 Obiettivo del Progetto

Sviluppare un tool web per l'analisi dei dati energetici per diagnosi energetiche, capace di:
- Importare dati di consumo energetico da file CSV mensili
- Visualizzare i dati in modo efficace (heatmap e grafici)
- Combinare variabili per analisi avanzate
- Generare tabelle master con classificazioni normative italiane

---

## ✅ Funzionalità Implementate

### 1. Importazione e Parsing File CSV
- ✅ Lettura di 12 file CSV mensili (ExportData_gennaio.csv → ExportData_dicembre.csv)
- ✅ Parsing automatico con rilevamento delimitatore (punto e virgola)
- ✅ Gestione di campi tra virgolette
- ✅ Supporto formato decimale europeo (virgola come separatore)
- ✅ Stacking cronologico dei dati (gennaio → dicembre)
- ✅ Merge automatico di date duplicate (somma dei valori)
- ✅ Salvataggio come variabili nominate dall'utente

### 2. Visualizzazione Dati
- ✅ **Heatmap**: Matrice colorata date × intervalli orari
  - Scala cromatica (verde → giallo → rosso)
  - Tooltip con valori esatti
  - Visualizzazione subset per performance (30 giorni, intervalli orari)
  
- ✅ **Line Plot**: Grafico temporale continuo
  - Asse X: timestamp (data + ora)
  - Asse Y: valore del consumo
  - Campionamento ogni 10 punti per performance
  - Interattivo con tooltip

- ✅ Toggle tra le due visualizzazioni
- ✅ Selezione variabile da visualizzare

### 3. Combinazione Variabili
- ✅ Interfaccia drag-and-drop intuitiva
- ✅ Due zone di drop: ➕ (addizione) e ➖ (sottrazione)
- ✅ Costruzione formula in tempo reale
- ✅ Rimozione elementi dalla formula
- ✅ Creazione di variabili combinate personalizzate
- ✅ Gestione errori e validazione

### 4. Tabella Master
- ✅ Tabella completa con tutte le variabili allineate
- ✅ Colonne informative:
  - Date (DD/MM/YYYY)
  - Hour (ora di inizio intervallo)
  - Day of Week (1=Lunedì, ..., 7=Domenica)
  - FASCIA (F1/F2/F3) con classificazione automatica
  - PK/OP (Peak/Off-Peak) con classificazione automatica
  - Valori di tutte le variabili create

- ✅ Classificazione FASCIA secondo normativa italiana:
  - **F1**: Feriali (Lun-Ven), non festivi, 08:00-19:00
  - **F2**: Feriali 07:00-08:00 e 19:00-23:00; Sabato 07:00-23:00
  - **F3**: Tutti gli altri orari

- ✅ Classificazione PK/OP:
  - **PK**: Lun-Ven, non festivi, 08:00-20:00
  - **OP**: Tutti gli altri orari

- ✅ Gestione festivi italiani:
  - Festivi fissi (Capodanno, Epifania, Natale, ecc.)
  - Festivi mobili (Pasqua, Lunedì dell'Angelo) calcolati automaticamente
  - Algoritmo di Gauss per calcolo Pasqua

- ✅ Paginazione (100 righe per pagina)
- ✅ Color coding per FASCIA e PK/OP
- ✅ Sticky headers e first column per navigazione facile

### 5. Interfaccia Utente
- ✅ Design responsive (desktop e mobile)
- ✅ Navigazione a tab intuitiva
- ✅ Feedback visivo (loading states, error messages)
- ✅ Tooltips e informazioni contestuali
- ✅ Colori e icone per migliore usabilità

---

## 🏗️ Architettura del Codice

### Struttura Modulare

```
src/
├── components/           # Componenti React UI
│   ├── TabNavigation.tsx         # Navigazione tra tab
│   ├── DirectorySelector.tsx     # Selezione file/cartella
│   ├── VariableList.tsx          # Lista variabili create
│   ├── DataVisualization.tsx     # Heatmap e line plot
│   ├── VariableCombination.tsx   # Drag-and-drop combination
│   ├── MasterTable.tsx           # Tabella master completa
│   ├── DataTable.tsx             # Tabella formato largo
│   └── LongFormatTable.tsx       # Tabella 3 colonne
│
├── utils/                # Logica di business
│   ├── csvParser.ts              # Parsing CSV
│   ├── dataProcessor.ts          # Elaborazione dati (stacking, merge, combine)
│   ├── months.ts                 # Mapping mesi italiani
│   └── timeUtils.ts              # Utility temporali (festivi, FASCIA, PK/OP)
│
├── types.ts              # Definizioni TypeScript
├── App.tsx               # Componente principale
├── main.tsx              # Entry point
└── index.css             # Stili Tailwind
```

### Principi di Design

1. **Separazione delle responsabilità**:
   - Componenti UI puri (presentational)
   - Utility functions per logica di business
   - Types centralizzati

2. **Riusabilità**:
   - Funzioni utility generiche
   - Componenti riutilizzabili
   - Costanti condivise

3. **Manutenibilità**:
   - Codice TypeScript tipizzato
   - Nomi descrittivi
   - Commenti esplicativi
   - Struttura modulare

4. **Performance**:
   - Campionamento dati per visualizzazioni
   - Paginazione per tabelle grandi
   - Lazy loading (futuro)

---

## 📊 Flusso Dati

### 1. Importazione
```
File CSV → Parser → MonthData[] → Processor → ProcessedVariable
```

### 2. Visualizzazione
```
ProcessedVariable → convertToLongFormat() → Heatmap/LinePlot
```

### 3. Combinazione
```
ProcessedVariable[] + Operations → combineVariables() → ProcessedVariable
```

### 4. Tabella Master
```
ProcessedVariable[] → MasterTable → Row[] (con FASCIA, PK/OP)
```

---

## 🔧 Tecnologie Utilizzate

### Frontend
- **React 18**: Framework UI
- **TypeScript**: Type safety
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Styling utility-first

### Librerie
- **Recharts**: Grafici e visualizzazioni
- **File System Access API**: Lettura directory (Chrome/Edge)

### Tooling
- **ESLint**: Linting
- **TypeScript Compiler**: Type checking
- **Vite**: Hot module replacement, bundling

---

## 📁 Formato File CSV

### Specifiche
- **Nome**: `ExportData_{mese_italiano}.csv`
- **Delimitatore**: Punto e virgola (`;`)
- **Prima colonna**: `Giorno` con date `DD/MM/YYYY`
- **Colonne successive**: 96 intervalli orari (15 minuti ciascuno)
- **Valori**: Numerici con virgola decimale (es: `0,025`)
- **Campi**: Tra virgolette

### Esempio
```csv
Giorno;00:00-00:15;00:15-00:30;...;23:45-00:00
"01/01/2024";"0";"0,025";...;"0,15"
"02/01/2024";"0,05";"0,1";...;"0,2"
```

---

## 🎓 Casi d'Uso

### 1. Diagnosi Energetica Annuale
- Importare 12 mesi di dati
- Visualizzare heatmap per identificare pattern
- Analizzare trend stagionali
- Identificare picchi di consumo

### 2. Confronto Anno-su-Anno
- Creare variabili per anni diversi
- Combinare per calcolare differenze
- Valutare efficacia interventi

### 3. Analisi Costi Energetici
- Utilizzare tabella master con FASCIA
- Calcolare consumi per fascia oraria
- Applicare tariffe differenziate
- Ottimizzare costi

### 4. Bilancio Energetico
- Combinare consumi e produzione
- Calcolare consumo netto
- Identificare opportunità di autoconsumo

---

## 🚀 Performance

### Ottimizzazioni Implementate
- ✅ Campionamento dati per visualizzazioni (ogni 10 punti)
- ✅ Subset di dati per heatmap (30 giorni, intervalli orari)
- ✅ Paginazione per tabelle grandi (100 righe/pagina)
- ✅ Memoization (React hooks)
- ✅ Lazy rendering

### Limiti Attuali
- ⚠️ Bundle size: 562 KB (potrebbe essere ottimizzato con code splitting)
- ⚠️ Nessun backend (tutto client-side)
- ⚠️ Nessun persistence (dati persi al refresh)

### Miglioramenti Futuri
- 🔮 Code splitting per ridurre bundle size
- 🔮 LocalStorage per persistenza variabili
- 🔮 Export dati (CSV, Excel)
- 🔮 Backend per dataset grandi
- 🔮 Autenticazione e multi-utenza

---

## 📚 Documentazione

### File Creati
1. **README.md**: Documentazione completa del progetto
   - Descrizione funzionalità
   - Installazione e avvio
   - Tutorial rapido
   - Formato file CSV
   - Struttura progetto

2. **TUTORIAL.md**: Guida dettagliata passo-passo
   - Primi passi
   - Guida per ogni tab
   - Esempi pratici
   - Best practices
   - Risoluzione problemi

3. **SUMMARY.md**: Questo documento
   - Panoramica completa
   - Architettura
   - Casi d'uso
   - Performance

---

## ✅ Testing e Validazione

### Test Effettuati
- ✅ Build produzione (nessun errore)
- ✅ Parsing CSV (formato corretto)
- ✅ Stacking cronologico (ordine mesi)
- ✅ Merge date duplicate (somma valori)
- ✅ Combinazione variabili (addizione/sottrazione)
- ✅ Classificazione FASCIA (normativa italiana)
- ✅ Classificazione PK/OP (peak/off-peak)
- ✅ Calcolo festivi italiani (fissi e mobili)
- ✅ Visualizzazione heatmap (colori, tooltip)
- ✅ Visualizzazione line plot (grafico temporale)
- ✅ Tabella master (tutte le colonne)
- ✅ Paginazione (navigazione)
- ✅ Responsive design (mobile/desktop)

### File di Test
- `samples/input_csv/ExportData_gennaio.csv`
- `samples/input_csv/ExportData_febbraio.csv`

---

## 🎯 Risultati Raggiunti

### Funzionalità Complete
- ✅ Importazione e parsing file CSV
- ✅ Creazione variabili nominate
- ✅ Visualizzazione heatmap
- ✅ Visualizzazione line plot
- ✅ Combinazione variabili (drag-and-drop)
- ✅ Tabella master con classificazioni
- ✅ Gestione festivi italiani
- ✅ Interfaccia responsive

### Qualità del Codice
- ✅ TypeScript tipizzato
- ✅ Struttura modulare
- ✅ Codice pulito e manutenibile
- ✅ Commenti esplicativi
- ✅ Nomi descrittivi
- ✅ Separazione responsabilità

### Documentazione
- ✅ README completo
- ✅ Tutorial dettagliato
- ✅ Esempi pratici
- ✅ Casi d'uso
- ✅ Risoluzione problemi

---

## 🔄 Prossimi Passi (Opzionali)

### Miglioramenti Funzionali
1. **Export dati**: Permettere esportazione in CSV/Excel
2. **Persistenza**: Salvare variabili in LocalStorage
3. **Import variabili**: Caricare variabili da file
4. **Grafici avanzati**: Bar chart, scatter plot, ecc.
5. **Filtri avanzati**: Filtrare per data, FASCIA, PK/OP
6. **Statistiche**: Media, min, max, deviazione standard
7. **Confronto visuale**: Sovrapporre più variabili

### Miglioramenti Tecnici
1. **Code splitting**: Ridurre bundle size
2. **Testing**: Unit test e integration test
3. **Backend**: API per dataset grandi
4. **Autenticazione**: Multi-utenza
5. **CI/CD**: Deploy automatico
6. **PWA**: Installabile come app

### Miglioramenti UX
1. **Wizard guidato**: Tutorial interattivo
2. **Template**: Modelli predefiniti per analisi comuni
3. **Dashboard**: Vista riassuntiva con KPI
4. **Notifiche**: Alert per anomalie
5. **Collaborazione**: Condivisione variabili

---

## 📞 Supporto e Contatti

Per problemi o domande:
1. Consulta [TUTORIAL.md](TUTORIAL.md)
2. Verifica [README.md](README.md)
3. Controlla la console del browser (F12)
4. Apri una issue su GitHub

---

## 🎉 Conclusioni

Il progetto **DiagnosisMaker** è stato completato con successo e include:

- ✅ **4 tab funzionali** per tutte le fasi dell'analisi
- ✅ **Visualizzazioni avanzate** (heatmap e line plot)
- ✅ **Combinazione variabili** con drag-and-drop
- ✅ **Tabella master** con classificazioni normative italiane
- ✅ **Documentazione completa** (README, TUTORIAL, SUMMARY)
- ✅ **Codice pulito e modulare** in TypeScript
- ✅ **Build di produzione** funzionante

Il tool è pronto per essere utilizzato per diagnosi energetiche e analisi dei consumi!

---

**Ultimo aggiornamento**: 2026
**Versione**: 1.0.0
**Stato**: ✅ Completo e funzionante
