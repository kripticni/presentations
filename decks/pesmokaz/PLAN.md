# Pesmokaz, plan prezentacije

**Status:** deck generisan (16 slajdova) iz `decks/pesmokaz/deck.js`
**Jezik:** srpski (latinica), termini kao u radu
**Format:** 16:9, 16 slajdova za izlaganje
**Trajanje:** ~13 min (skalira se na 10 min po TALK_PLAN.md)

## Glavna poruka

> Napravili smo jedan lanac obrade i jedan protokol evaluacije, i na istom skupu
> od 776 pesama pokazali: determinističko heširanje je tačnije na zašumljenim
> snimcima (97,56 % prema 81,39 % top-1), CNN je ~20× brži u inferenci, a
> prednost CNN-a na koverima i izvođenjima uživo ostaje neproverena.

Svaki slajd služi ovoj rečenici; ništa što joj ne služi ne ulazi u deck.

## Dizajn

- **Baza:** tamna (`#0E1118`), sadržajni slajdovi na svetloj (`#F4F6FA`), „sendvič“: tamni naslov, svetla sredina, tamni zaključak.
- **Kodiranje metoda kroz ceo deck (preuzeto iz rada):**
  matematička metoda = zelena `#00A878`, CNN = violet `#7C5CFC`.
  Ista boja za metodu na svakom slajdu, u svakom grafikonu, u legendi.
- **Akcenat:** amber `#FFB020` samo za brojeve koji nose poentu (97,56 / 81,39 / 16 ms).
- **Motiv:** tanka traka mel-spektrograma koja se ponavlja (naslov, sekcije, footer), ne ukrasna linija, nego stvarni spektrogram iz domena.
- **Font:** Calibri (Carlito je metrički kompatibilan i instaliran → preview u LibreOffice-u verno izgleda).
- **Grafikoni:** native PowerPoint chartovi (ne slike), da se mogu menjati i da ostanu oštri.
- **Gustina:** jedan zaključak po slajdu; brojevi krupno, objašnjenja kratka; govor nosi detalje (speaker notes).

## Slajdovi

### 1. Naslov, „Pesmokaz“ (20 s)
- Podnaslov: *Razvijanje i poređenje metoda prepoznavanja pesama*
- Autori: Lazar Aleksić, Andrej Vasiljević · Mentori: Andrej Bantulić, Dimitrije Pešić (ETF)
- Vizuel: waveform koji se transformiše u spektrogram preko cele širine; ime „Pesmokaz“ krupno.
- Bez „danas ćemo pričati o...“, odmah ime projekta i jedna rečenica problema u notes.

### 2. Problem (45 s)
- Poruka: **5 sekundi snimka, 776 pesama, signal nikad nije čist.**
- Tri izvora težine: šum/kompresija/reverb; ista pesma u više verzija (kover, uživo); baza raste.
- Vizuel: telefon → talas → baza; tri male ikone za degradacije.
- Notes: Shazam intuicija, ali bez industrijske baze, cilj je kontrolisano poređenje.

### 3. Dve porodice metoda (55 s)
- Levo (zelena): determinističko heširanje, vremensko-frekvencijski pikovi, parovi kao heševi, otporno na šum.
- Desno (violet): duboko učenje, triplet/contrastive, embedding u latentnom prostoru, može strukturne mutacije.
- Poruka: **niko ih ne poredi pod istim uslovima, to je praznina koju rad popunjava.**
- Vizuel: split-screen sa po jednom mikro-šemom; reference Wang 2003, FaceNet, Chang 2021.

### 4. Pitanje i hipoteza (40 s)
- Istraživačko pitanje: *Koja metoda je tačnija/brža na istom skupu i istom protokolu?*
- Hipoteza: matematika tačnija na šumu; CNN niža latencija i potencijalno bolji na mutacijama.
- Tri doprinosa: (1) kompletan lanac sa testovima, (2) zajednički Python interfejs za obe metode, (3) protokol na 776 pesama / 5 nivoa šuma.
- Vizuel: tri numerisana bloka, hipoteza kao citat.

### 5. Grafički apstrakt (30 s), NOVO
- Grafički apstrakt rada u celosti: isti ulaz i normalizacija, grane se razlikuju u reprezentaciji i pretrazi.
- Vizuel: slika `graficki-apstrakt.png` (render iz `graficki-apstrakt.svg`), široka preko slajda.
- Poruka: jedna slika sažima ceo sistem; razlika je samo u reprezentaciji isečka.
- Napomena: GA u SVG-u još piše „INT8“; videti nalaz br. 8 ispod.

### 6. Sistem / lanac obrade (75 s), **ključni slajd**
- Ulaz → isečci 5 s / preklapanje 2,5 s → normalizacija po isečku na −23 LUFS → mel spektrogram (128 filtera) → opcioni U-Net denojzer → dve grane (heševi | embedding) → pretraga → rang lista.
- **Insight koji treba da se zapamti:** prvo isečak, pa normalizacija. Da se normalizuje ceo fajl pa deli, isti segment bi dobio različitu normalizaciju kod različitih snimaka.
- Vizuel: horizontalni flow, zelena/violet grana; mali „zašto“ callout za redosled.
- Notes: 22050 Hz, n_fft 2048 (~93 ms), hop 512 (~23 ms), ~215 frejmova po isečku.

### 7. Skup podataka i protokol (55 s)
- 1000 izabranih → 224 korumpirane (MD5) → **776 upotrebljivih**, 16 žanrova, ~5,5 GB.
- ~71.000 isečaka; podela **po pesmama** (ne po isečcima) → nema curenja.
- 5 nivoa šuma: −5, 0, 5, 10, 20 dB; isti RNG za obe metode; **7281 zašumljeni upit**.
- Metrike: top-1/3/5/10 + MRR; tie-break leksikografski po ID-u pesme.
- Vizuel: 4 stat-tile broja + skala nivoa šuma; žanrovska raspodela kao tanka traka (χ² = 24,21, df = 15, ne odbacuje ravnomernost).

### 8. Keširani spektrogrami (40 s), NOVO
- 776 pesama × ~91 isečak = ~71.000 mel spektrograma, izračunatih jednom i sačuvanih kao `.npy`.
- Bez keša, svaki prolaz: MP3 dekodiranje, isečci + loudnorm, STFT + mel filterbank. Sa kešom: `np.load()` → tenzor → trening.
- Isti keš služi treniranju, evaluaciji i indeksiranju baze (`build_db_from_cache.py`).
- Cena: ~7,8 GB na disku, više od 5,5 GB MP3 dataseta. `--resume` preskače već izračunato.
- Vizuel: veliki „~71.000“ broj levo, „pre/posle“ lista desno, donji red sa cenom i dobitkom.

### 9. Matematička metoda (70 s)
- Mel spektrogram → `scipy` maximum filter 16×16 → pikovi iznad praga 0,25 → **15 heševa po piku**, uz ograničenja pomeraja → heš `(f1, f2, Δt)`.
- Pretraga: **vremensko poravnanje**; ocena = najveći broj poklopljenih heševe na jednom pomaku.
- Poruka: **poravnanje je heroj**, 78 % → 97,56 %.
- Vizuel: spektrogram sa označenim pikom i strelicama ka susedima; mali histogram poklapanja po pomaku.

### 10. CNN metoda (55 s)
- ResNet-18, jednokanalni ulaz (mel), **128-d L2 embedding**, triplet loss sa hard mining.
- ONNX izvoz; pretraga najbližih suseda preko FAISS (L2).
- Vizuel: spektrogram → blokovi CNN → vektor 128 → 3 najbliža suseda.
- Notes: konvergencija na epohi 26, posle toga overfitting.

### 11. Determinizam neuronske grane (45 s), NOVO
- Ulaz se prvo seče pa normalizuje po isečku; mel transformacija ima fiksne parametre (22050 Hz, n_fft 2048, hop 512, 128 mel).
- ONNX Runtime na CPU, `inter_op_num_threads = intra_op_num_threads = 1`.
- Evaluacija koristi seed 42; isti niz šuma za obe metode.
- Embedding je float32, jedinične norme; to je vektor koji ulazi u FAISS.
- Granica: važi za isti ONNX Runtime, isti provajder i isti hardver; float32 nije bit-egzaktan između platformi.
- Vizuel: pet redova sa tick-om levo, blok „granica“ desno.

### 12. Rezultati, tačnost (65 s)
- Tabela + grupisan bar chart, zelena vs violet:
  | | Math | CNN |
  |---|---|---|
  | Top-1 | **97,56 %** | **81,39 %** |
  | Top-3 | 98,68 % | 87,75 % |
  | Top-5 | 98,78 % | 89,75 % |
  | Top-10 | 99,04 % | 91,97 % |
  | MRR | 0,976 | 0,850 |
- Poruka: **razlika od 16 procentnih poena u top-1.**
- Notes: tabela je primarna, chart je za brzinu čitanja; ne tvrditi statističku značajnost (nema CI/testa).

### 13. Brzina i evolucija (65 s)
- Latencija: **16 ms** CNN vs **325 ms** matematika (~20×), na 20-pesmenom benchmarku.
- Evolucija matematike: 25 % → 78 % (tuning heševa/praga/DT) → **97,56 %** (poravnanje).
- Konvergencija: top-1 raste do epohE 26, zatim blagi pad → dodatno treniranje nije put.
- Vizuel: levo dve latencije, desno step chart evolucije; convergence kao mali inset ili rezervni slajd.
- Notes: eksplicitno reći da je benchmark mali; heš pretraga raste sa bazom (ograničenje).

### 14. Zašto heširanje pobeđuje ovde (50 s)
- Upiti su **zašumljeni originali**, ne koveri/uživo → domen u kome heširanje ima prirodnu prednost.
- Poravnanje koristi vremensku strukturu pesme, ne samo prisustvo heševa.
- Prototip na 12 pesama: 98,68 % standardno / 86,03 % stress → pad na 81,39 % sa 776 pesama.
- Vizuel: dve kolone „testirali smo / nismo testirali“; mutacije jasno u drugoj koloni.

### 15. Ograničenja i budući rad (45 s)
- Nisu testirani koveri i izvođenja uživo; nema reverba; nema razlaganja po nivou šuma.
- Baze su lokalne (dict + pickle, FAISS), nisu skalabilne na milione.
- Dalje: test mutacija, ResNet-18 vs MobileNetV3 vs veći modeli, UI, centralna baza.
- Vizuel: mapa puta u 4 koraka, bez novih brojeva.

### 16. Zaključak (20 s)
- Jedna rečenica rezultata + tri doprinosa + jedna rečenica ograničenja.
- „Hvala, pitanja.“ Kontakt.
- Tamna pozadina, veliki brojevi 97,56 / 81,39 / 20×.

## Rezervni slajdovi (za Q&A, ne izlažu se)

Deck ih trenutno ne sadrži; spremni su kao tekst u ovom planu ako zatrebaju.

- **A1, Heš matematika:** formula trojke, fanout 15, opseg Δt, prag 0,25; zašto maximum filter 16×16.
- **A2, Metrike:** MRR formula, tie-break, zašto top-k + MRR.
- **A3, Dataset:** tabela 1 po žanrovima + licencna slika (CC-BY-NC* itd., zašto fingerprinting nije derivat).
- **A4, Hiperparametri:** tabela 2 + zašto 22050 Hz, 5 s/2,5 s, 2048/512, 128 mel.
- **A5, Šta nije urađeno:** reverb, per-noise breakdown, intervali pouzdanosti, ablacija denojzera, skalabilnost.

## Nalazi iz rada koje treba ispraviti/pažljivo tretirati

1. **Top-3 CNN:** tabela 3 kaže **87,75 %**, a slika 3 prikazuje **81,75 %**. U deck ide 87,75 %; sliku ne preuzimati dok se ne ispravi.
2. **Nema intervala pouzdanosti ni testa značajnosti** za razliku od 16 pp, formulacija „16 procentnih poena u ovom protokolu“, bez tvrdnje o značajnosti.
3. **U-Net denojzer** je u lancu, ali nema ablacije; prikazati kao opcioni korak, bez tvrdnje o doprinosu.
4. **„20× brže“** je merено na 20 pesama; heš pretraga je O(N). Ne generalizovati na milionske baze, ide u ograničenja.
5. **Per-noise breakdown** ne postoji u radu (svih 5 nivoa je agregirano), moguće pitanje; pripremiti odgovor da je agregat namerno, a razlaganje budući rad.
6. **Prototip 12 pesama** (98,68 %) i 776 pesama (81,39 %), dobra priča o skaliranju, ali nije isto okruženje; ne porediti direktno kao „pad kvaliteta modela“.
7. **70 % vs 78 %:** stariji planovi i neki izvori su govorili „70 → 97,56“. Rad i grafikon evolucije kažu **25 → 78 → 97,56**. U decku je ispravljeno na 78.
8. **INT8 vs float32:** rad i stariji planovi pišu „ONNX INT8 kvantizacija“, a kod, `docs/design_doc.md` i `docs/formal_overview.md` kažu da je embedding float32 i da `quantize()` nije u runtime-u. Grafički apstrakt (SVG) još piše „INT8“. Treba uskladiti paper/deck/GA sa stvarnim modelom. (Grafikoni ne menjati u ovom PR-u.)

## Priprema za pitanja (kratki odgovori)

- *Zašto ne trenirati duže?* Overfitting posle epohe 26; veći model je verovatniji put, a 20× brža inferenca daje prostor.
- *Zašto je CNN lošiji?* Upiti nisu strukturne mutacije; mali broj isečaka po pesmi (71k / 776 ≈ 91); heširanje je u svom domenu.
- *Zašto 5 s / 2,5 s?* Kompromis između konteksta i broja upita; preklapanje pokriva granice.
- *Zašto 22050 Hz?* Dovoljno za mel do ~11 kHz, duplo manje podataka od 44,1 kHz.
- *Da li je razlika značajna?* Nemamo CI/test; rezultat je deskriptivan na fiksnom protokolu.
- *Šta je MRR?* Prosečna recipročna pozicija tačne pesme; 1,0 = uvek prva.
- *Zašto YouTube?* 481 pesma nije bilo dostupno u FMA ZIP arhivi; istraživačka reprodukcija, bez redistribucije.
- *Skalabilnost?* Pickle dict i lokalni FAISS nisu za milione; centralna baza je budući rad.

## Sledeći korak

Deck je generisan i izvezen (`deck.pptx`, `deck.pdf`). Za izmene:

1. Uredite `deck.js` (ili `deck-graphical.js` za variantu sa GA).
2. `node deck.js` u `decks/pesmokaz/`.
3. `tools/preview.sh decks/pesmokaz/deck.pptx` za PDF + PNG render.
4. Commitujte `.pptx` i `.pdf` zajedno sa `.js`.
