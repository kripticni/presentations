# Pesmokaz, plan pričanja

**Dek:** 16 slajdova · cilj **13:00** · Andrej ≈ **6:15**, Lazar ≈ **6:40**

- **Andrej:** dve metode, matematičko heširanje i CNN, i njihovo uklapanje u arhitekturu.
- **Lazar:** arhitektura, baza, keš, optimizacije, determinizam, demo aplikacija.

Cilj podele: svako priča svoj deo, ali ukupno vreme bude skoro izjednačeno. Zajednički su slajdovi 6 i 12, gde se vidi spoj arhitekture i metoda.

## Podela po temama

| Tema | Govori |
| --- | --- |
| Uvod, problem, istraživačko pitanje | Lazar |
| Grafički apstrakt (ceo sistem) | Lazar |
| Dve porodice metoda | Andrej |
| Arhitektura lanca obrade | Lazar, pa Andrej za grane |
| Skup podataka i baza | Lazar |
| Keširanje spektrograma | Lazar |
| Matematička metoda | Andrej |
| CNN metoda | Andrej |
| Determinizam neuronske grane | Andrej |
| Rezultati tačnosti | Andrej, Lazar za protokol |
| Brzina i optimizacije | Lazar |
| Zašto heširanje pobeđuje ovde | Andrej |
| Ograničenja, dalji rad, demo | Lazar |
| Zaključak | Andrej |

## Plan po slajdovima

| # | Slajd | Govori | Vreme | Šta kaže / prelaz |
| --- | --- | --- | --- | --- |
| 1 | Cover | **Andrej** | 0:20 | „Dobar dan, ja sam Andrej Vasiljević; ovo je Pesmokaz, projekat Lazar Aleksić i ja, uz mentore sa ETF-a.” Najava: za 13 minuta jedna metoda poređenja, ne još jedan Šazam. → „Lazar, problem.” |
| 2 | Zašto je prepoznavanje teško | **Lazar** | 0:45 | Snimak od 5 s u kafiću; tri prepreke: prljav signal, ista pesma u više verzija, velika baza. Cilj: pošteno poređenje pod istim uslovima. → „Andrej, dve porodice.” |
| 3 | Dve porodice metoda | **Andrej** | 0:55 | Levo heširanje: pikovi → parovi → heševi; otporno na šum, ali ne razume strukturu. Desno CNN: embedding; obećava koveri i uživo, ali zavisi od podataka. Praznina: retko se porede na istom skupu. → „Lazar, kako smo merili.” |
| 4 | Koja metoda je tačnija i brža | **Lazar** | 0:40 | Isti skup, isti protokol; hipoteza: matematika tačnija pod šumom, CNN brži i možda bolji na mutacijama. Tri doprinosa: ceo lanac, zajednički interfejs, protokol evaluacije. → „Slika.” |
| 5 | Ceo rad na jednoj slici | **Lazar** | 0:30 | Grafički apstrakt: isti ulaz i normalizacija, grane se razlikuju u reprezentaciji i pretrazi; jedna slika sažima ceo sistem. → „Sledi arhitektura.” |
| 6 | Prvo isečak, pa normalizacija | **Lazar 0:45 + Andrej 0:30** | 1:15 | Lazar: ulaz 22050 Hz mono → isečci 5 s / 2,5 s → −23 LUFS po isečku → mel 128; zašto prvo isečak pa normalizacija; hash baza i FAISS. Andrej: kako se obe grane kače na isti interfejs; iz istog mela heševi i embedding; ista baza, ista evaluacija. → „Lazar, dataset.” |
| 7 | 776 pesama, 16 žanrova | **Lazar** | 0:55 | 776 iz FMA, 16 žanrova; 1000 → 776 zbog 224 korumpirana fajla (MD5); podela po pesmama, ne po isečcima; pet nivoa šuma; 7.281 upit. → „Keš.” |
| 8 | Dataset se prekomputuje jednom | **Lazar** | 0:40 | 71.000 mel spektrograma u .npy; 7,8 GB na disku; dekodiranje i STFT jednom umesto po epohi; isti keš za treniranje, evaluaciju i indeksiranje; --resume preskače gotovo. → „Andrej, matematička grana.” |
| 9 | Poravnanje: sa 78 na 97,56 | **Andrej** | 1:10 | Pikovi: filter 16×16, prag 0,25; 15 parova po piku; heš `(f₁, f₂, Δt)`; ključno je vremensko poravnanje; 78 → 97,56. → „CNN grana.” |
| 10 | Embedding umesto heša | **Andrej** | 0:55 | ResNet-18 na jednokanalnom melu; izlaz 128-d, L2; triplet loss + hard mining; ONNX; FAISS L2. Isti podaci kao matematička grana, razlika je samo reprezentacija. → „Rezultati.” |
| 11 | Ista pesma, isti vektor, svaki put | **Andrej** | 0:45 | Ulaz prvo isečak pa normalizacija; fiksni librosa parametri; ONNX na jednom thread-u; seed 42; float32. Granica: isti runtime i hardver. → „Rezultati.” |
| 12 | Tačnost | **Andrej 0:30 + Lazar 0:35** | 1:05 | Andrej: 97,56 % prema 81,39 % na top-1; 16,17 procentnih poena; heširanje vodi na svakoj metrici u ovom protokolu. Lazar: MRR 0,976 prema 0,850; isti upiti i isti nivoi šuma za obe metode; bez intervala pouzdanosti i testa značajnosti, pa ne tvrdimo više od protokola. → „Lazar, brzina.” |
| 13 | Prostor za veći model | **Lazar** | 1:05 | CNN ~20× brži: 16 ms prema 325 ms; benchmark je 20 pesama, ne generalizovati; heš pretraga raste sa bazom, FAISS ne linearno; epoha 26, posle opada, dodatno treniranje nije put, veći model jeste. → „Andrej, zašto heširanje.” |
| 14 | Zašto heširanje pobeđuje ovde | **Andrej** | 0:50 | Testirano na zašumljenim originalima, ne na koverima; poravnanje koristi vremensku strukturu; CNN prednost na strukturnim mutacijama ostaje neproverena. → „Lazar, dalji rad.” |
| 15 | Šta sledi | **Lazar** | 0:45 | Ograničenja: nema kovera i uživo, nema reverba, lokalne baze nisu za milione. Prvo test mutacija, jedino što može da promeni zaključak; onda veći model, interfejs, skalabilna baza. → „Andrej, zaključak.” |
| 16 | Zaključak | **Andrej** | 0:20 | Heširanje tačnije, CNN znatno brži, prednost na koverima otvorena. Glavni doprinos je protokol koji se može ponoviti. „Hvala, spremni smo za pitanja.” |

**Ukupno:** Andrej **6:15** · Lazar **6:40** · svega **12:55**.

## Vremenske provere

| Trenutak | Treba da bude gotovo |
| --- | --- |
| 2:40 | slajd 4 |
| 3:10 | slajd 5 |
| 4:50 | slajd 7 |
| 6:00 | slajd 9 |
| 7:30 | slajd 11 |
| 8:35 | slajd 12 |
| 9:40 | slajd 13 |
| 10:30 | slajd 14 |
| 11:15 | slajd 15 |
| 12:55 | kraj |

Ako kasnite, skratite detalje na slajdovima 9 i 11, ne preskačite cele slajdove, jer se tako gubi veza između metode i rezultata.

## Ako je strog limit 10:00

Skratite tako što ćete:

- slajd 6: 1:15 → 0:55 (Lazar 0:35, Andrej 0:20),
- slajd 5: 0:30 → 0:20,
- slajd 8: 0:40 → 0:25,
- slajd 9: 1:10 → 0:55,
- slajd 11: 0:45 → 0:30,
- slajd 12: 1:05 → 0:50 (Andrej 0:20, Lazar 0:30),
- slajd 13: 1:05 → 0:50,
- slajd 14: 0:50 → 0:40.

Novi odnos: Andrej ≈ **5:05**, Lazar ≈ **4:55**, ukupno **10:00**.

## Pitanja publike, ko odgovara

| Tema pitanja | Prvi odgovara |
| --- | --- |
| Heširanje, pikovi, poravnanje | **Andrej** |
| CNN, ResNet, triplet loss, embedding | **Andrej** |
| Determinizam, ONNX, thread-ovi, seed | **Andrej** |
| Tačnost, MRR, top-k, tumačenje rezultata | **Andrej** |
| Arhitektura, interfejs, baza, pickle/FAISS | **Lazar** |
| Keširanje spektrograma, disk, resume | **Lazar** |
| ONNX, INT8, optimizacije, latencija | **Lazar** |
| Demo aplikacija, korisnički tok | **Lazar** |
| Grafički apstrakt, celokupni sistem | **Lazar** |
| Protokol, ograničenja, sledeći koraci | **Zajedno**, počinje onaj koji je vodio tu temu |

Ako pitanje preseca obe strane (npr. „zašto ResNet-18, a ne veći model?”), Andrej odgovara o modelu, Lazar o latenciji i optimizaciji.

## Dogovor pre nastupa

- **Kliker drži Lazar.** Andrej ne dira tastaturu; prelaz se najavljuje rečenicom, ne klikom u tišini.
- Kada jedan govori, drugi ne potvrđuje „da, da”, samo kratak znak rukom za prelaz.
- Na slajdovima 6 i 12 unapred znati tačnu rečenicu prelaza; tu se najlakše preklopite.
- Ne čitati slajd. Slajd nosi broj ili sliku, a priča nosi vezu: zašto je to važno i šta sledi.
- Probati jednom sa štopericom; ako neko pređe svoj deo za više od 30 s, skratiti sledeći put.
