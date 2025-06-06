Ești un inginer software expert, specializat în dezvoltarea de aplicații web și mobile cu suport offline și real-time, cu o expertiză particulară în utilizarea SQLite pentru persistența datelor pe client.

Am nevoie de ajutorul tău pentru a detalia arhitectura și implementarea aspectelor legate de managementul datelor și comportamentul offline/online al unei aplicații multi-tenant (hotel, gym, clinică dentară). Aplicația va rula atât pe web (folosind o implementare SQLite WASM/WebSQL), cât și pe mobil (folosind SQLite nativ).

Te rog să generezi un plan detaliat care să acopere următoarele puncte, cu accent pe SQLite ca singura bază de date client:

Arhitectura de Date Locală (Offline Persistence cu SQLite):

Cum se va inițializa și gestiona SQLite pe ambele platforme (web și mobil)? Specifică bibliotecile/tehnologiile recomandate pentru fiecare (ex: wa-sqlite sau sql.js pentru web, react-native-sqlite-storage sau sqflite pentru mobil).
Cum va fi asigurată compatibilitatea schemei bazei de date între web și mobil?
Definește schema detaliată a tabelelor SQLite de care vom avea nevoie. Pentru fiecare tabel, specifică cel puțin 3-5 câmpuri relevante, incluzând tenantId (ca index), ID-uri, status (pentru UI optimist) și timestamp-uri. Include tabele pentru:
calendar_events
customers
stock_items
employees
history_activities
offline_queue
Explică strategia pentru migrările de schemă ale bazei de date locale pe măsură ce aplicația evoluează.
Descrie fluxul de sincronizare inițială a datelor (primul fetch) și cum sunt ele stocate în SQLite.
State Management Global cu Zustand (Distribuție Date):

Explică rolul unui store global Zustand ca sursă unică de adevăr.
Detaliază cum acțiunile Zustand vor interacționa direct cu API-ul SQLite definit la punctul 1.
Cum se va asigura că starea din RAM (în Zustand) este întotdeauna sincronizată cu starea din SQLite?
Coada de Acțiuni Offline (Offline Queue în SQLite):

Detaliază structura tabelului offline_queue (specifică câmpurile, tipurile de date SQLite, și scopul fiecărui câmp, incluzând payload ca TEXT/JSON).
Descrie fluxul unei acțiuni (de la inițiere la trimitere/eșec) cu accent pe persistența și manipularea în offline_queue folosind interacțiuni SQLite.
Cum se va implementa UI-ul optimist, cu referințe la starea status și optimisticId stocate atât în Zustand, cât și în SQLite?
Explică mecanismul de sincronizare la reconectare, cu detaliarea interogărilor SQLite pentru a prelua și actualiza acțiuni din coadă.
Gestionarea Endpoint-urilor și Actualizărilor Live:

Preluarea Datelor la Nivel de Componentă (Mod Producție): Explică cum fiecare componentă va declanșa o acțiune Zustand care:
Va citi rapid datele relevante din SQLite pentru afișare imediată.
Va iniția un fetch API către endpoint-ul specific categoriei (ex: /api/v1/calendar, /api/v1/customers) pentru a aduce cele mai recente date.
Va actualiza Zustand și SQLite cu datele proaspete de la API.
Actualizări Live prin WebSocket-uri:
Descrie cum mesajele primite prin WebSocket vor fi procesate și cum vor declanșa actualizări în Zustand și, ulterior, în SQLite, asigurând consistența real-time.
Cum se vor gestiona conflictele între datele primite prin WebSocket și acțiunile locale aflate în coada offline?
Modul Demo (Complet Izolat cu SQLite):

Preluare Inițială: Cum se va face un singur request API (/api/v1/demo-data) și cum vor fi popopulate tabelele SQLite specifice modului demo?
Acțiuni Client în Demo: Explică cum acțiunile utilizatorului vor fi interceptate și nu vor genera apeluri API, dar vor modifica starea în Zustand ȘI în SQLite pentru a simula persistența locală pe durata sesiunii demo.
Cum se va asigura că aceste modificări în SQLite sunt izolate și nu interferează cu datele reale din modul de producție (de exemplu, prin utilizarea unui tenantId dedicat demo sau prin o bază de date SQLite separată pentru demo, dacă e fezabil)?
Cum va fi marcat vizual statusul "în procesare" în UI și în SQLite pentru elementele modificate în demo?
Managementul Memoriei și Curățarea Datelor (SQLite):

Strategii de Curățare: Detaliază procesele de background (sau rulate periodic) pentru a șterge datele vechi din tabelele SQLite (ex: history_activities, offline_queue), bazate pe politici de retenție (ex: vârstă, număr maxim de înregistrări).
Cum se va monitoriza dimensiunea bazei de date SQLite pe dispozitiv și cum se va reacționa la atingerea unor limite (ex: notificări către utilizator, curățare agresivă)?
Cum se vor optimiza interogările și structura tabelelor SQLite pentru a asigura performanța pe termen lung?