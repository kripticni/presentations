/* Hallmark · v2.0.0
   genre: technical, conference talk · job: defend a study · output: pptx (pptxgenjs)
   theme: pesmokaz-teal (by request: #099999 + black) · one accent: teal · secondary data: neutral grey
   signature: the song's own spectrogram, computed from a synthetic 6-second clip, used as the deck's material
   critique: the old deck said every idea in a rounded card; this one says it with scale, one accent, hairlines and the audio itself.
   waive: F6/F7 (a slide deck has no interactive states and no motion: no transitions or animations are written) ·
          F12 (the hero test is a 1280x800 rule; the cover is judged at projector distance instead) ·
          58 (the two method slides run past 80 words; the parameter names are the content of a defense) ·
          82 (the four figure row on the dataset slide is the dataset itself, not a decorative count)
   dropped: A1–A5 backup slides (user approved; the talk now runs 13 slides) · the invented
            neighbour distances 0,12 / 0,31 / 0,58
   graphical: 14-slide copy with a graphical abstract after the research question, plus the
            database cache and precomputed-index facts on the pipeline slide
   reworded: "Lanac obrade: prvo isečak, pa normalizacija" to "Prvo isečak, pa normalizacija" · 19 names the label
   reworded: "Heširanje i duboko učenje rešavaju isti problem drugačije" to "Dve porodice metoda" · 58 names the length
*/
// Pesmokaz, generator for the PFE presentation deck.
// Run: node deck-graphical.js   (validate with the pptx skill's scripts/office/validate.py)
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("../../lib/apply_theme.js");

const A = path.join(__dirname, "assets");
const LOGO = path.join(A, "pfe-logo.png");
const SPEC_BAND = path.join(A, "spectrogram-band.png");
const SPEC_GA = path.join(A, "spectrogram-ga.png");
const WAVE = path.join(A, "waveform.png");

const LANG = "sr-Latn-RS";

// ---------------------------------------------------------------- tokens
const F = { display: "Montserrat", body: "Calibri" };

const T = {
  ink: "0C0F10",
  ink2: "171C1D",
  paper: "F4F5F2",
  white: "FFFFFF",
  teal: "099999",
  tealDeep: "06706F",
  tealOnInk: "57C9C6",
  tealWash: "DDEDEA",
  grey: "8B9294",
  greyDeep: "5B6263",
  muted: "626967",
  mutedOnInk: "9AA3A3",
  rule: "D6D9D4",
  ruleOnInk: "2C3838",
};

const THEME = {
  name: "Pesmokaz 2026",
  headFontFace: F.display,
  bodyFontFace: F.body,
  colors: {
    dk1: T.ink,
    lt1: T.paper,
    dk2: T.greyDeep,
    lt2: T.rule,
    accent1: T.teal,
    accent2: T.grey,
    accent3: T.tealDeep,
    accent4: T.muted,
    accent5: T.tealOnInk,
    accent6: T.tealWash,
    hlink: T.teal,
    folHlink: T.tealDeep,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Pesmokaz, Razvijanje i poređenje metoda prepoznavanja pesama";
pres.subject = "PFE u Galeriji nauke i tehnike SANU";
pres.author = "Lazar Aleksić, Andrej Vasiljević";
pres.company = "Naučno-inženjerski centar PFE";
pres.theme = { headFontFace: F.display, bodyFontFace: F.body };

// ---------------------------------------------------------------- helpers
const S = pres.ShapeType;

// One container: every slide shares this measure and this left edge.
const M = 0.78;
const CW = 11.773;
const FOOT = 7.02;

let currentSection = "Uvod";
let activeSlide = null;

function setSection(title) {
  currentSection = title;
  pres.addSection({ title });
}

function tx(slide, text, o = {}) {
  const opts = {
    x: o.x,
    y: o.y,
    w: o.w,
    h: o.h,
    fontFace: o.face || F.body,
    fontSize: o.size || 16,
    color: o.color || T.ink,
    bold: !!o.bold,
    align: o.align || "left",
    valign: o.valign || "top",
    margin: 0,
    isTextBox: true,
    lang: LANG,
  };
  if (o.italic) opts.italic = true;
  if (o.lsm !== undefined) opts.lineSpacingMultiple = o.lsm;
  slide.addText(text, opts);
}

function heading(slide, text, o = {}) {
  tx(slide, text, {
    x: M,
    y: 0.56,
    w: o.w || CW,
    h: o.h || 1.05,
    face: F.display,
    size: o.size || 36,
    bold: true,
    color: o.dark ? T.white : T.ink,
    lsm: 0.95,
  });
}

function hline(slide, x, y, w, color = T.rule, width = 1) {
  slide.addShape(S.line, { x, y, w, h: 0, line: { color, width } });
}

function vline(slide, x, y, h, color = T.rule, width = 1) {
  slide.addShape(S.line, { x, y, w: 0, h, line: { color, width } });
}

function tick(slide, x, y, h = 0.14, color = T.teal, width = 1.5) {
  slide.addShape(S.line, { x, y, w: 0, h, line: { color, width } });
}

function dot(slide, cx, cy, d = 0.1, color = T.teal) {
  slide.addShape(S.ellipse, {
    x: cx - d / 2,
    y: cy - d / 2,
    w: d,
    h: d,
    fill: { color },
    line: { color, width: 0 },
  });
}

function notes(text) {
  if (!activeSlide) throw new Error("notes() before a slide");
  activeSlide.addNotes(text);
}

function newSlide(master = "light", section = currentSection) {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  activeSlide = s;
  return s;
}

function caption(slide, text, o = {}) {
  tx(slide, text, {
    x: o.x ?? M,
    y: o.y ?? 6.55,
    w: o.w ?? CW,
    h: 0.24,
    size: 10.5,
    color: T.muted,
  });
}

// ---------------------------------------------------------------- layouts
pres.defineSlideMaster({
  title: "light",
  background: { color: T.paper },
  slideNumber: {
    x: 12.4,
    y: FOOT,
    w: 0.35,
    h: 0.22,
    color: T.muted,
    fontSize: 9.5,
    fontFace: F.body,
    align: "r",
  },
  objects: [
    { image: { path: LOGO, x: M, y: FOOT + 0.01, w: 0.2, h: 0.2 } },
    {
      text: {
        text: "Pesmokaz",
        options: {
          x: 1.04,
          y: FOOT,
          w: 3,
          h: 0.22,
          fontSize: 9.5,
          color: T.muted,
          fontFace: F.body,
          lang: LANG,
          margin: 0,
          valign: "mid",
        },
      },
    },
  ],
});

pres.defineSlideMaster({
  title: "dark",
  background: { color: T.ink },
  slideNumber: {
    x: 12.4,
    y: FOOT,
    w: 0.35,
    h: 0.22,
    color: T.mutedOnInk,
    fontSize: 9.5,
    fontFace: F.body,
    align: "r",
  },
  objects: [
    { image: { path: LOGO, x: M, y: FOOT + 0.01, w: 0.2, h: 0.2 } },
    {
      text: {
        text: "Pesmokaz",
        options: {
          x: 1.04,
          y: FOOT,
          w: 3,
          h: 0.22,
          fontSize: 9.5,
          color: T.mutedOnInk,
          fontFace: F.body,
          lang: LANG,
          margin: 0,
          valign: "mid",
        },
      },
    },
  ],
});

pres.defineSlideMaster({
  title: "cover",
  background: { color: T.ink },
});

pres.defineSlideMaster({
  title: "close",
  background: { color: T.ink },
});

// ---------------------------------------------------------------- 1 cover
pres.addSection({ title: "Uvod" });
{
  const s = newSlide("cover", "Uvod");

  s.addImage({ path: LOGO, x: M, y: 0.52, w: 0.5, h: 0.5, altText: "PFE logo" });
  tx(s, "Naučno-inženjerski centar PFE", {
    x: 1.42,
    y: 0.64,
    w: 5.2,
    h: 0.28,
    size: 11.5,
    color: T.mutedOnInk,
  });
  tx(s, "PFE u Galeriji nauke i tehnike SANU", {
    x: 7.3,
    y: 0.58,
    w: 5.25,
    h: 0.26,
    size: 11.5,
    color: T.mutedOnInk,
    align: "right",
  });
  tx(s, "24–25. novembar 2026.", {
    x: 7.3,
    y: 0.84,
    w: 5.25,
    h: 0.26,
    size: 11.5,
    color: T.mutedOnInk,
    align: "right",
  });

  tx(s, "Pesmokaz", {
    x: M - 0.02,
    y: 1.62,
    w: 9,
    h: 1.6,
    face: F.display,
    size: 108,
    bold: true,
    color: T.white,
  });
  tx(s, "Razvijanje i poređenje metoda prepoznavanja pesama", {
    x: M,
    y: 3.4,
    w: 9.6,
    h: 0.5,
    size: 24,
    color: T.tealOnInk,
  });

  tx(s, "Lazar Aleksić i Andrej Vasiljević", {
    x: M,
    y: 4.66,
    w: 8,
    h: 0.34,
    size: 18,
    bold: true,
    color: T.white,
  });
  tx(s, "Mentori: Andrej Bantulić i Dimitrije Pešić", {
    x: M,
    y: 5.06,
    w: 8,
    h: 0.28,
    size: 13,
    color: T.mutedOnInk,
  });
  tx(s, "Gimnazija „Bora Stanković“, Vranje. Prva kragujevačka gimnazija.", {
    x: M,
    y: 5.42,
    w: 9,
    h: 0.28,
    size: 11.5,
    color: T.mutedOnInk,
  });

  s.addImage({
    path: SPEC_BAND,
    x: 0,
    y: 6.3,
    w: 13.333,
    h: 1.2,
    altText: "Spektrogram sintetičkog audio primera",
  });

  notes(
    "Dobar dan. Ja sam Andrej Vasiljević, a ovo je Pesmokaz, projekat koji smo Lazar i ja radili uz mentore sa ETF-a. " +
      "Za deset minuta pokazaćemo kako smo napravili jedan sistem koji prepoznaje pesmu iz kratkog snimka i, važnije, kako smo pošteno poredili dve potpuno različite metode na istom skupu podataka. (20 s)",
  );
}

// ---------------------------------------------------------------- 2 problem
{
  const s = newSlide("light", "Uvod");
  heading(s, "Zašto je prepoznavanje pesme teško");

  tx(s, "5 s", {
    x: M - 0.06,
    y: 1.6,
    w: 4.2,
    h: 2.05,
    face: F.display,
    size: 140,
    bold: true,
    color: T.teal,
  });
  tx(s, "tipičan upit sa telefona", {
    x: M,
    y: 3.64,
    w: 4.4,
    h: 0.26,
    size: 14,
    color: T.muted,
  });

  s.addImage({ path: WAVE, x: M, y: 4.06, w: 4.7, h: 0.78, altText: "Talasni oblik audio signala" });
  tx(s, "Snimak retko stiže čist, i to je prva prepreka.", {
    x: M,
    y: 5.08,
    w: 4.75,
    h: 0.6,
    size: 16,
    color: T.ink,
  });

  const items = [
    ["Prljav snimak", "Zvuk koji je snimljen nikada nije isti kao original: šum, kompresija, reverb."],
    ["Ista pesma, druga verzija", "Kover ili snimak uživo menja frekvencijsku sliku."],
    ["Milion pesama u bazi", "Pretraga mora da ostane tačna i brza."],
  ];
  items.forEach(([head, body], i) => {
    const y = 1.78 + i * 1.42;
    tx(s, head, { x: 6.35, y, w: 6.2, h: 0.32, size: 21, bold: true, color: T.ink });
    tx(s, body, { x: 6.35, y: y + 0.4, w: 6.0, h: 0.62, size: 15.5, color: T.muted });
    if (i < 2) hline(s, 6.35, y + 1.2, 6.2, T.rule, 0.75);
  });

  tx(s, "Cilj: pronaći tačnu pesmu i izmeriti koliko je to teško.", {
    x: M,
    y: 5.95,
    w: CW,
    h: 0.42,
    size: 20,
    bold: true,
    color: T.ink,
  });

  notes(
    "Krenimo od svakodnevnog primera: snimite pet sekundi pesme u kafiću i očekujete da telefon pogodi tačnu pesmu. " +
      "Tri stvari to otežavaju: signal je prljav, ista pesma postoji u više verzija, a baza je ogromna. " +
      "Naš cilj nije bio da napravimo još jedan Šazam, nego da izmerimo dve ideje pod istim uslovima. (45 s)",
  );
}

// ---------------------------------------------------------------- 3 two families
{
  const s = newSlide("light", "Uvod");
  heading(s, "Dve porodice metoda");

  // left
  tx(s, "Determinističko heširanje", {
    x: M,
    y: 1.72,
    w: 5.5,
    h: 0.36,
    size: 25,
    bold: true,
    color: T.ink,
  });
  tx(s, "Wang, 2003", { x: M, y: 2.14, w: 5.2, h: 0.24, size: 12, color: T.muted });
  [
    "Pikovi spektrograma → parovi → heševi",
    "Otporno na šum: najjači pikovi prežive",
    "Brzo, ali ne razume strukturu pesme",
  ].forEach((line, i) => {
    tx(s, line, { x: M, y: 2.52 + i * 0.38, w: 5.3, h: 0.28, size: 15, color: T.ink });
  });

  // peak map: every mark is a peak; one peak pair is labelled
  const ix = M;
  const iy = 3.86;
  const iw = 5.0;
  const ih = 1.44;
  const gx = (f) => ix + f * iw;
  const gy = (f) => iy + (1 - f) * ih;

  hline(s, ix, iy + ih, iw, T.rule, 1);
  vline(s, ix, iy, ih, T.rule, 1);
  [1 / 3, 2 / 3].forEach((f) => hline(s, ix, gy(f), iw, T.rule, 0.5));

  const peaks = [
    [0.08, 0.62], [0.30, 0.30], [0.38, 0.66], [0.50, 0.46],
    [0.55, 0.82], [0.72, 0.34], [0.82, 0.58], [0.92, 0.42],
  ];
  peaks.forEach(([t, f]) => dot(s, gx(t), gy(f), 0.085, T.teal));

  const a = [0.18, 0.40];
  const b = [0.62, 0.72];
  s.addShape(S.line, {
    x: gx(a[0]),
    y: gy(a[1]),
    w: gx(b[0]) - gx(a[0]),
    h: 0,
    line: { color: T.greyDeep, width: 0.75, dashType: "sysDot" },
  });
  s.addShape(S.line, {
    x: gx(b[0]),
    y: gy(a[1]),
    w: 0,
    h: gy(b[1]) - gy(a[1]),
    line: { color: T.greyDeep, width: 0.75, dashType: "sysDot" },
  });
  s.addShape(S.line, {
    x: gx(a[0]),
    y: gy(a[1]),
    w: gx(b[0]) - gx(a[0]),
    h: gy(b[1]) - gy(a[1]),
    line: { color: T.ink, width: 1.25 },
  });
  [a, b].forEach(([t, f]) => {
    s.addShape(S.ellipse, {
      x: gx(t) - 0.06,
      y: gy(f) - 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color: T.ink },
      line: { color: T.paper, width: 1.25 },
    });
  });

  tx(s, "f₁", {
    x: gx(a[0]) - 0.04,
    y: gy(a[1]) - 0.3,
    w: 0.32,
    h: 0.22,
    size: 11,
    bold: true,
    color: T.ink,
    align: "center",
  });
  tx(s, "f₂", {
    x: gx(b[0]) + 0.08,
    y: gy(b[1]) - 0.3,
    w: 0.32,
    h: 0.22,
    size: 11,
    bold: true,
    color: T.ink,
  });
  tx(s, "Δt", {
    x: (gx(a[0]) + gx(b[0])) / 2 - 0.18,
    y: gy(a[1]) + 0.05,
    w: 0.36,
    h: 0.2,
    size: 10.5,
    color: T.greyDeep,
    align: "center",
  });
  tx(s, "Δf", {
    x: gx(b[0]) - 0.46,
    y: (gy(a[1]) + gy(b[1])) / 2 - 0.1,
    w: 0.4,
    h: 0.2,
    size: 10.5,
    color: T.greyDeep,
    align: "right",
  });
  tx(s, "frekvencija ↑", {
    x: ix + 0.06,
    y: iy + 0.02,
    w: 1.0,
    h: 0.18,
    size: 9.5,
    color: T.greyDeep,
  });
  tx(s, "vreme →", {
    x: ix + iw - 0.85,
    y: iy + ih - 0.22,
    w: 0.85,
    h: 0.18,
    size: 9.5,
    color: T.greyDeep,
    align: "right",
  });
  caption(s, "pikovi, jedan par i pomeraj Δt, šema", { y: 5.38, w: 5.2 });

  // right
  tx(s, "Duboko učenje", {
    x: 7.0,
    y: 1.72,
    w: 5.5,
    h: 0.36,
    size: 25,
    bold: true,
    color: T.ink,
  });
  tx(s, "Schroff, 2015. Chang, 2021.", {
    x: 7.0,
    y: 2.14,
    w: 5.2,
    h: 0.24,
    size: 12,
    color: T.muted,
  });
  [
    "Triplet loss uči rastojanje u latentnom prostoru",
    "Može da prepozna kover i izvođenje uživo",
    "Zavisi od podataka i kvaliteta treniranja",
  ].forEach((line, i) => {
    tx(s, line, { x: 7.0, y: 2.52 + i * 0.38, w: 5.4, h: 0.28, size: 15, color: T.ink });
  });

  // latent space, sketch: one query, the cluster it belongs to, two other songs
  const px0 = 7.0;
  const py0 = 3.94;
  const pw = 5.2;
  const ph = 0.8;
  hline(s, px0, py0 + ph, pw, T.rule, 0.75);
  vline(s, px0, py0, ph, T.rule, 0.75);

  const clusterA = [[0.15, 0.5], [0.21, 0.34], [0.26, 0.55], [0.31, 0.4], [0.19, 0.66], [0.28, 0.68]];
  const clusterB = [[0.55, 0.42], [0.6, 0.55], [0.64, 0.32], [0.58, 0.2], [0.67, 0.5]];
  const clusterC = [[0.82, 0.62], [0.86, 0.45], [0.9, 0.66], [0.84, 0.3]];
  clusterB.concat(clusterC).forEach(([fx, fy]) => dot(s, px0 + fx * pw, py0 + fy * ph, 0.09, T.grey));
  clusterA.forEach(([fx, fy]) => dot(s, px0 + fx * pw, py0 + fy * ph, 0.09, T.teal));
  s.addShape(S.ellipse, {
    x: px0 + 0.12 * pw,
    y: py0 + 0.26 * ph,
    w: 0.24 * pw,
    h: 0.52 * ph,
    fill: { color: T.paper, transparency: 100 },
    line: { color: T.teal, width: 1 },
  });
  // the query itself
  s.addShape(S.ellipse, {
    x: px0 + 0.21 * pw - 0.1,
    y: py0 + 0.34 * ph - 0.1,
    w: 0.2,
    h: 0.2,
    fill: { color: T.paper },
    line: { color: T.tealDeep, width: 1.5 },
  });
  caption(s, "embedding: ista pesma blizu, različite daleko, šema", { x: 7.0, y: 4.88, w: 5.3 });

  tx(s, "Retko se porede na istom skupu i istom protokolu.", {
    x: M,
    y: 6.05,
    w: CW,
    h: 0.42,
    size: 20,
    bold: true,
    color: T.ink,
  });

  notes(
    "Dve porodice metoda. Sa leve strane je klasično heširanje: iz spektrograma se uzimaju najjači pikovi i prave parovi. " +
      "Sa desne strane je duboko učenje: mreža uči da istu pesmu smesti blizu, a različite daleko. " +
      "Prva je otporna na šum, druga obećava koveri i snimke uživo. Ono što retko vidimo je pošteno poređenje, to je praznina koju smo popunili. (55 s)",
  );
}

// ---------------------------------------------------------------- 4 question
{
  const s = newSlide("dark", "Uvod");
  tx(s, "Koja metoda je tačnija\ni brža na istom skupu?", {
    x: M,
    y: 1.34,
    w: 11.4,
    h: 1.62,
    face: F.display,
    size: 52,
    bold: true,
    color: T.white,
    lsm: 1.02,
  });
  tx(s, "Hipoteza: matematika je tačnija na šumu; CNN je brži i možda bolji na strukturnim mutacijama.", {
    x: M,
    y: 3.42,
    w: 10.6,
    h: 0.72,
    size: 18,
    color: T.mutedOnInk,
  });

  hline(s, M, 4.98, CW, T.ruleOnInk, 1);

  const contrib = [
    ["Kompletan lanac obrade", "od audio ulaza do rang liste, sa testovima"],
    ["Zajednički interfejs", "dve metode iza istog Python API-ja"],
    ["Protokol evaluacije", "776 pesama, pet nivoa šuma, iste metrike"],
  ];
  contrib.forEach(([head, body], i) => {
    const x = M + i * 3.95;
    tx(s, head, { x, y: 5.24, w: 3.6, h: 0.32, size: 16.5, bold: true, color: T.white });
    tx(s, body, { x, y: 5.64, w: 3.55, h: 0.62, size: 13, color: T.mutedOnInk });
  });

  notes(
    "Naše pitanje je jednostavno: ako obe metode pustimo na isti skup i isti protokol, koja je tačnija i koja je brža? " +
      "Hipoteza je bila da je matematika tačnija pod šumom, a da je CNN brži i da bi mogao biti bolji na mutacijama. " +
      "Da bismo to izmerili, napravili smo tri stvari: ceo lanac, zajednički interfejs i protokol koji se ne menja između metoda. (40 s)",
  );
}

// ---------------------------------------------------------------- 5 graphical abstract
{
  const s = newSlide("light", "Uvod");
  heading(s, "Od pet sekundi do rang liste");
  tx(s, "jedan lanac obrade, dve metode, isti protokol", {
    x: M,
    y: 1.26,
    w: CW,
    h: 0.26,
    size: 14,
    color: T.muted,
  });

  const stage = (text, x, w = 2.4) =>
    tx(s, text, { x, y: 1.78, w, h: 0.2, size: 10, bold: true, color: T.muted });
  stage("ULAZ", M);
  stage("MEL SPEKTROGRAM", 3.55);
  stage("DVE GRANE", 6.72);
  stage("REZULTAT", 10.15, 2.05);

  // input: five seconds of audio
  tx(s, "5 s snimak", { x: M, y: 1.98, w: 2.4, h: 0.34, size: 20, bold: true, color: T.ink });
  s.addImage({
    path: WAVE,
    x: M,
    y: 2.43,
    w: 2.3,
    h: 0.383,
    altText: "Talasni oblik snimka od pet sekundi",
  });
  tx(s, "22050 Hz, mono", { x: M, y: 2.94, w: 2.3, h: 0.24, size: 11.5, color: T.muted });
  tx(s, "−23 LUFS po isečku", { x: M, y: 3.2, w: 2.3, h: 0.24, size: 11.5, color: T.muted });

  s.addShape(S.line, {
    x: 3.12,
    y: 2.62,
    w: 0.33,
    h: 0,
    line: { color: T.teal, width: 1.25, endArrowType: "triangle" },
  });

  // mel spectrogram: the shared representation
  s.addImage({
    path: SPEC_GA,
    x: 3.55,
    y: 2.15,
    w: 2.6,
    h: 0.936,
    altText: "Mel spektrogram isečka",
  });
  tx(s, "128 filtera, jedan kanal", {
    x: 3.55,
    y: 3.18,
    w: 2.6,
    h: 0.24,
    size: 11.5,
    color: T.muted,
  });

  // fork into the two branches
  s.addShape(S.line, {
    x: 6.15,
    y: 2.62,
    w: 0.35,
    h: 0,
    line: { color: T.greyDeep, width: 1 },
  });
  s.addShape(S.line, {
    x: 6.5,
    y: 2.16,
    w: 0,
    h: 1.22,
    line: { color: T.greyDeep, width: 1 },
  });
  [2.16, 3.38].forEach((y) => {
    s.addShape(S.line, {
      x: 6.5,
      y,
      w: 0.14,
      h: 0,
      line: { color: T.greyDeep, width: 1, endArrowType: "triangle" },
    });
  });

  const branches = [
    {
      y: 2.0,
      head: "Matematička grana",
      body: "pikovi → heševi → vremensko poravnanje",
      score: "97,56 %",
      scoreColor: T.teal,
      speed: null,
    },
    {
      y: 3.22,
      head: "CNN grana",
      body: "ResNet-18 → 128-d embedding",
      score: "81,39 %",
      scoreColor: T.ink,
      speed: "20× brža inferenca",
    },
  ];
  branches.forEach(({ y, head, body, score, scoreColor, speed }) => {
    tx(s, head, { x: 6.72, y, w: 3.2, h: 0.32, size: 17, bold: true, color: T.ink });
    tx(s, body, { x: 6.72, y: y + 0.36, w: 3.25, h: 0.28, size: 12.5, color: T.muted });
    tx(s, score, {
      x: 10.15,
      y: y - 0.02,
      w: 2.05,
      h: 0.5,
      face: F.display,
      size: 26,
      bold: true,
      color: scoreColor,
      align: "right",
    });
    tx(s, "top-1 tačnost", {
      x: 10.15,
      y: y + 0.5,
      w: 2.05,
      h: 0.2,
      size: 9.5,
      color: T.muted,
      align: "right",
    });
    if (speed) {
      tx(s, speed, {
        x: 10.15,
        y: y + 0.7,
        w: 2.05,
        h: 0.2,
        size: 9.5,
        bold: true,
        color: T.tealDeep,
        align: "right",
      });
    }
  });

  hline(s, 6.72, 2.96, 5.48, T.rule, 0.75);
  vline(s, 10.03, 1.94, 2.2, T.rule, 0.75);

  tx(s, "→ rang lista pesama", {
    x: 6.72,
    y: 4.18,
    w: 3.4,
    h: 0.3,
    size: 15,
    bold: true,
    color: T.tealDeep,
  });
  tx(s, "ista baza, iste metrike", {
    x: 9.1,
    y: 4.2,
    w: 3.1,
    h: 0.26,
    size: 11.5,
    color: T.muted,
    align: "right",
  });

  // shared protocol strip
  hline(s, M, 5.12, CW, T.rule, 1);
  tx(s, "PROTOKOL", { x: M, y: 5.24, w: 3.0, h: 0.22, size: 10, bold: true, color: T.muted });
  tx(s, "isti upiti i iste metrike za obe metode", {
    x: 6.6,
    y: 5.22,
    w: 5.93,
    h: 0.24,
    size: 12,
    color: T.muted,
    align: "right",
  });

  const facts = [
    ["776", "pesama"],
    ["16", "žanrova"],
    ["5", "nivoa šuma"],
    ["7.281", "zašumljenih upita"],
  ];
  facts.forEach(([num, label], i) => {
    const x = M + i * 2.95;
    tx(s, num, { x, y: 5.5, w: 2.6, h: 0.48, face: F.display, size: 24, bold: true, color: T.ink });
    tx(s, label, { x, y: 5.98, w: 2.6, h: 0.24, size: 11.5, color: T.muted });
  });

  caption(s, "šema: ulaz → mel → dve grane → rang lista; brojevi su sa istog protokola", {
    y: 6.55,
  });

  notes(
    "Ovo je cela priča u jednoj slici, i na nju se vraćamo kad god izgubimo nit. " +
      "Sa leve strane je pet sekundi snimka; iz njega se pravi mel spektrogram. " +
      "Iz istog spektrograma idu dve grane, matematička sa pikova i heševa, i CNN sa embeddingom. " +
      "Ispod svega stoji isti protokol: 776 pesama, 16 žanrova, pet nivoa šuma i 7.281 upit. " +
      "Rezultati su 97,56 prema 81,39 odsto, a CNN je oko dvadeset puta brži. (30 s)",
  );
}

setSection("Metoda");

// ---------------------------------------------------------------- 5 pipeline
{
  const s = newSlide("light", "Metoda");
  heading(s, "Prvo isečak, pa normalizacija");

  const stops = [
    ["Ulaz", "22050 Hz, mono"],
    ["Isečci", "5 s, preklapanje 2,5 s"],
    ["Normalizacija", "−23 LUFS, po isečku"],
    ["Mel spektrogram", "128 filtera, opciono U-Net"],
  ];
  const railY = 2.34;
  hline(s, M, railY, CW, T.rule, 1);
  stops.forEach(([head, sub], i) => {
    const x = M + i * 3.0;
    tick(s, x, railY - 0.13);
    tx(s, head, { x, y: 1.8, w: 2.8, h: 0.32, size: 18, bold: true, color: T.ink });
    tx(s, sub, { x, y: 2.5, w: 2.75, h: 0.3, size: 12.5, color: T.muted });
  });

  tx(s, "iz istog mel spektrograma, dve grane", {
    x: M,
    y: 3.16,
    w: CW,
    h: 0.26,
    size: 12,
    color: T.muted,
  });

  const lanes = [
    ["Matematička grana", "pikovi → heševi → vremensko poravnanje", 3.56],
    ["CNN grana", "mel → ResNet-18 → 128-d embedding", 4.18],
  ];
  lanes.forEach(([head, body, y]) => {
    tx(s, head, { x: M, y, w: 3.2, h: 0.32, size: 17, bold: true, color: T.ink });
    tx(s, body, { x: 4.3, y: y + 0.02, w: 7.0, h: 0.3, size: 14.5, color: T.ink });
  });

  hline(s, M, 4.86, CW, T.rule, 0.75);

  tx(s, "Pretraga u bazi, pa rang lista pesama", {
    x: M,
    y: 4.98,
    w: 7.6,
    h: 0.32,
    size: 19,
    bold: true,
    color: T.ink,
  });
  tx(s, "heš baza (dict, pickle), vektorska baza (FAISS, L2)", {
    x: M,
    y: 5.38,
    w: 7.6,
    h: 0.28,
    size: 12.5,
    color: T.muted,
  });
  tx(
    s,
    [
      { text: "Keširano u bazi: ", options: { bold: true, color: T.ink } },
      {
        text: "mel spektrogrami za trening · unapred izračunati heševi i CNN vektori za brzu pretragu",
        options: { color: T.muted },
      },
    ],
    { x: M, y: 5.78, w: 11.6, h: 0.28, size: 12 },
  );
  tx(s, "najbliža pesma i ocena", {
    x: 9.3,
    y: 5.02,
    w: 3.25,
    h: 0.3,
    size: 14,
    bold: true,
    color: T.teal,
    align: "right",
  });

  tx(
    s,
    [
      { text: "Da se normalizuje ceo fajl pa deli, ", options: { bold: true } },
      {
        text: "isti segment bi dobio različitu glasnoću kod svakog snimka.",
        options: { bold: false },
      },
    ],
    { x: M, y: 6.26, w: 11.2, h: 0.6, size: 17, color: T.ink },
  );

  notes(
    "Ovo je ceo sistem u jednoj slici. Audio se deli na isečke od pet sekundi sa preklapanjem od 2,5, svaki isečak se posebno normalizuje na −23 LUFS, " +
      "pa se računa mel spektrogram sa 128 filtera. Iz njega idu dve grane: heševi i embedding. " +
      "Spektrogrami za trening su keširani u bazi, a heševi i CNN vektori su unapred izračunati, pa pretraga ne računa ništa ponovo. " +
      "Jedan detalj je važniji nego što izgleda: prvo isečak, pa normalizacija. Da radimo obrnuto, isti segment bi dobio različitu glasnoću kod svakog snimka, i poređenje bi pucalo. (80 s)",
  );
}

// ---------------------------------------------------------------- 6 dataset
{
  const s = newSlide("light", "Metoda");
  heading(s, "776 pesama, 16 žanrova, pet nivoa šuma");

  tx(s, "776", {
    x: M - 0.08,
    y: 1.55,
    w: 4.4,
    h: 1.8,
    face: F.display,
    size: 120,
    bold: true,
    color: T.teal,
  });
  tx(s, "upotrebljivih pesama", { x: M, y: 3.4, w: 4.2, h: 0.28, size: 15, color: T.ink });
  tx(s, "od 1000, 224 korumpirane uklonjene MD5 proverom", {
    x: M,
    y: 3.76,
    w: 4.7,
    h: 0.5,
    size: 13,
    color: T.muted,
  });

  tx(s, "Nivoi šuma u evaluaciji", {
    x: 6.6,
    y: 1.8,
    w: 5.9,
    h: 0.26,
    size: 12,
    color: T.muted,
  });
  hline(s, 6.6, 2.56, 5.75, T.rule, 1);
  ["−5 dB", "0 dB", "5 dB", "10 dB", "20 dB"].forEach((label, i) => {
    const x = 6.6 + (i * 5.75) / 4;
    tick(s, x, 2.5, 0.12, T.teal, 1.25);
    tx(s, label, {
      x: x - 0.45,
      y: 2.72,
      w: 0.9,
      h: 0.26,
      size: 13,
      color: T.ink,
      align: "center",
    });
  });
  tx(s, "isti niz slučajnih brojeva za obe metode", {
    x: 6.6,
    y: 3.06,
    w: 5.9,
    h: 0.26,
    size: 12,
    color: T.muted,
  });

  const facts = [
    ["~71.000", "isečaka od 5 s"],
    ["16", "žanrova, ravnomerno"],
    ["7.281", "zašumljenih upita"],
  ];
  facts.forEach(([num, label], i) => {
    const x = M + i * 3.1;
    tx(s, num, { x, y: 4.56, w: 2.8, h: 0.55, face: F.display, size: 26, bold: true, color: T.ink });
    tx(s, label, { x, y: 5.1, w: 2.8, h: 0.26, size: 12.5, color: T.muted });
  });

  tx(s, "Podela po pesmama, ne po isečcima, pa nema curenja između treninga i testa.", {
    x: M,
    y: 5.54,
    w: 11.6,
    h: 0.3,
    size: 15,
    color: T.ink,
  });
  tx(s, "χ² = 24,21 (df = 15): raspodela po žanrovima je ravnomerna.", {
    x: M,
    y: 5.96,
    w: 11.6,
    h: 0.3,
    size: 15,
    color: T.ink,
  });

  caption(s, "FMA, 5,5 GB, CC licence. Šum: pink i govor u pozadini, kada postoji. Bez reverba.", {
    y: 6.6,
  });

  notes(
    "Skup je 776 pesama iz FMA kolekcije, stratifikovano po 16 žanrova. Krenuli smo od 1000, ali 224 fajla su bila korumpirana, to smo uhvatili MD5 proverom. " +
      "Podela je po pesmama, ne po isečcima, da model ne bi video deo iste pesme u treningu i testu. " +
      "Evaluacija ide na pet nivoa šuma, od −5 do 20 dB, sa istim slučajnim nizom za obe metode, ukupno 7.281 upit. (55 s)",
  );
}

// ---------------------------------------------------------------- 7 hashing
{
  const s = newSlide("light", "Metoda");
  heading(s, "Poravnanje: sa 78 na 97,56");

  const steps = [
    ["1", "Pikovi", "Maximum filter 16×16 na mel spektrogramu; zadržavamo pikove iznad praga 0,25."],
    ["2", "Heševi", "Za svaki pik 15 parova sa susedima: heš je (f₁, f₂, Δt), uz ograničen pomeraj."],
    ["3", "Poravnanje", "Ocena pesme je najviše poklapanja na jednom vremenskom pomaku."],
  ];
  steps.forEach(([n, head, body], i) => {
    const y = 1.68 + i * 1.0;
    tx(s, n, { x: M, y: y - 0.02, w: 0.42, h: 0.4, face: F.display, size: 20, bold: true, color: T.teal });
    tx(s, head, { x: 1.34, y, w: 2.05, h: 0.3, size: 16.5, bold: true, color: T.ink });
    tx(s, body, { x: 3.55, y, w: 3.2, h: 0.86, size: 13.5, color: T.muted });
  });

  // alignment histogram, schematic
  caption(s, "poklapanja heševa po vremenskom pomaku, šema", { y: 4.55, w: 5.6 });
  const hx = M;
  const hy = 5.6;
  hline(s, hx, hy, 5.4, T.rule, 0.75);
  const heights = [0.16, 0.24, 0.13, 0.3, 0.2, 0.35, 0.26, 0.18, 0.7, 0.24, 0.15, 0.2, 0.12];
  heights.forEach((h, i) => {
    s.addShape(S.rect, {
      x: hx + i * 0.42,
      y: hy - h,
      w: 0.3,
      h,
      fill: { color: h > 0.6 ? T.teal : "C3C9C6" },
      line: { color: h > 0.6 ? T.teal : "C3C9C6", width: 0 },
    });
  });
  tx(s, "prava pesma", {
    x: hx + 8 * 0.42 + 0.15 - 0.6,
    y: hy + 0.05,
    w: 1.2,
    h: 0.22,
    size: 10.5,
    color: T.tealDeep,
    align: "center",
  });

  // evolution: three measured points on one scale, no connecting curve
  const cx = 7.95;
  const cy = 4.55;
  const ch = 2.05;
  const cw = 3.75;
  const yOf = (v) => cy - (v / 100) * ch;
  [0, 50, 100].forEach((v) => {
    hline(s, cx - 0.45, yOf(v), cw + 0.5, T.rule, 0.75);
    tx(s, `${v}`, {
      x: cx - 0.9,
      y: yOf(v) - 0.1,
      w: 0.38,
      h: 0.2,
      size: 9,
      color: T.muted,
      align: "right",
    });
  });
  const pts = [
    [0, 25, "original", T.grey],
    [1, 78, "tuning", T.grey],
    [2, 97.56, "poravnanje", T.teal],
  ];
  const px = (i) => cx + (i * cw) / 2;
  pts.forEach(([i, v, label, color]) => {
    s.addShape(S.line, {
      x: px(i),
      y: yOf(v),
      w: 0,
      h: cy - yOf(v),
      line: { color, width: 2 },
    });
    dot(s, px(i), yOf(v), 0.15, color);
    tx(s, `${String(v).replace(".", ",")} %`, {
      x: px(i) - 0.75,
      y: yOf(v) - 0.36,
      w: 1.5,
      h: 0.3,
      size: 18,
      bold: true,
      color: i === 2 ? T.tealDeep : T.ink,
      align: "center",
    });
    tx(s, label, {
      x: px(i) - 0.75,
      y: cy + 0.12,
      w: 1.5,
      h: 0.24,
      size: 10.5,
      color: T.muted,
      align: "center",
    });
  });
  tx(s, "Top-1 tačnost kroz iteracije", {
    x: cx - 0.62,
    y: 1.55,
    w: cw + 1.1,
    h: 0.26,
    size: 12,
    color: T.muted,
  });

  tx(s, "Bez poravnanja heševi pogađaju, ali ne znaju koji su u istom trenutku pesme.", {
    x: M,
    y: 6.3,
    w: CW,
    h: 0.34,
    size: 17,
    color: T.ink,
  });

  notes(
    "Matematička metoda radi na mel spektrogramu. Prvo izvučemo lokalne maksimume, filter 16 puta 16, prag 0,25. " +
      "Za svaki pik napravimo 15 heševa sa susedima: frekvencija pika, frekvencija cilja i vremenski pomeraj. " +
      "Ključni korak je pretraga: ne brojimo samo poklapanja, nego tražimo pomak na kome se najviše poklapaju. " +
      "To je podiglo tačnost sa 78 na 97,56 odsto, najveći pojedinačni doprinos u celom radu. (70 s)",
  );
}

// ---------------------------------------------------------------- 8 CNN
{
  const s = newSlide("light", "Metoda");
  heading(s, "Embedding umesto heša");

  const steps = [
    ["Mel", "128 × ~215 frejmova"],
    ["ResNet-18", "1 kanal, modifikovan"],
    ["128-d vektor", "L2 normalizovan"],
    ["FAISS", "najbliži susedi, L2"],
  ];
  const railY = 2.56;
  hline(s, M, railY, CW, T.rule, 1);
  steps.forEach(([head, sub], i) => {
    const x = M + i * 3.0;
    tick(s, x, railY - 0.13, 0.13, i === 2 ? T.teal : T.rule);
    tx(s, head, {
      x,
      y: 1.78,
      w: 2.8,
      h: 0.34,
      size: 18,
      bold: true,
      color: i === 2 ? T.tealDeep : T.ink,
    });
    tx(s, sub, { x, y: 2.18, w: 2.8, h: 0.26, size: 12, color: T.muted });
  });

  tx(s, "Treniranje: triplet loss i hard triplet mining. Inferenca: ONNX, INT8 kvantizacija.", {
    x: M,
    y: 3.02,
    w: CW,
    h: 0.28,
    size: 13.5,
    color: T.muted,
  });

  tx(s, "Embedding, 128 dimenzija", {
    x: M,
    y: 3.56,
    w: 5.0,
    h: 0.26,
    size: 12,
    color: T.muted,
  });
  for (let i = 0; i < 13; i++) {
    const inkBar = [2, 7, 11].includes(i);
    s.addShape(S.rect, {
      x: M + i * 0.39,
      y: 3.96,
      w: 0.22,
      h: 0.8,
      fill: { color: inkBar ? T.ink : "C9CDCB" },
      line: { color: inkBar ? T.ink : "C9CDCB", width: 0 },
    });
  }
  caption(s, "ilustracija vektora: tri dimenzije istaknute", { y: 4.86, w: 5.0 });

  tx(s, "Najbliži susedi u bazi", {
    x: 6.3,
    y: 3.44,
    w: 6.2,
    h: 0.26,
    size: 12,
    color: T.muted,
  });
  [
    ["1", "Pesma A", true],
    ["2", "Pesma B", false],
    ["3", "Pesma C", false],
  ].forEach(([rank, name, first], i) => {
    const y = 3.84 + i * 0.52;
    tx(s, rank, {
      x: 6.3,
      y,
      w: 0.35,
      h: 0.3,
      size: 14,
      bold: true,
      color: first ? T.teal : T.grey,
    });
    tx(s, name, {
      x: 6.8,
      y,
      w: 4.0,
      h: 0.3,
      size: 16,
      bold: !!first,
      color: first ? T.ink : T.greyDeep,
    });
    if (i < 2) hline(s, 6.3, y + 0.4, 6.2, T.rule, 0.75);
  });

  tx(s, "Isti podaci, ista arhitektura. Razlika je šta se poredi: heševi ili vektori.", {
    x: M,
    y: 5.98,
    w: CW,
    h: 0.4,
    size: 20,
    bold: true,
    color: T.ink,
  });

  notes(
    "CNN grana koristi ResNet-18 prilagođen jednokanalnom mel spektrogramu. Izlaz je vektor od 128 dimenzija, normalizovan na jediničnu dužinu. " +
      "Trenira se triplet loss-om sa teškim tripletima, a za inferencu se izvozi u ONNX i kvantizuje na INT8. " +
      "Pretraga je najbliži sused po L2 rastojanju preko FAISS-a. Bitno je da su podaci isti kao u matematičkoj grani, razlika je samo u reprezentaciji. (55 s)",
  );
}

setSection("Rezultati");

// ---------------------------------------------------------------- 9 accuracy
{
  const s = newSlide("light", "Rezultati");
  heading(s, "Tačnost: heširanje vodi na svakoj metriki");

  const pair = [
    ["97,56 %", "heširanje, top-1", T.teal, M, 5.3],
    ["81,39 %", "CNN, top-1", T.ink, 6.75, 5.3],
  ];
  pair.forEach(([num, label, color, x, w]) => {
    tx(s, num, { x: x - 0.04, y: 1.6, w, h: 1.12, face: F.display, size: 76, bold: true, color });
    tx(s, label, { x, y: 2.82, w, h: 0.26, size: 13.5, color: T.muted });
  });
  vline(s, 6.42, 1.74, 1.1, T.rule, 0.75);
  tx(s, "16,17 procentnih poena razlike", {
    x: M,
    y: 3.28,
    w: 6.0,
    h: 0.3,
    size: 17,
    bold: true,
    color: T.tealDeep,
  });
  tx(s, "MRR 0,976 prema 0,850", {
    x: 6.75,
    y: 3.28,
    w: 5.5,
    h: 0.3,
    size: 14,
    color: T.muted,
  });

  // dumbbell chart
  const rows = [
    ["Top-1", 97.56, 81.39],
    ["Top-3", 98.68, 87.75],
    ["Top-5", 98.78, 89.75],
    ["Top-10", 99.04, 91.97],
  ];
  const ax = 2.45;
  const aw = 8.1;
  const lo = 78;
  const hi = 100;
  const xOf = (v) => ax + ((v - lo) / (hi - lo)) * aw;
  rows.forEach(([label, math, cnn], i) => {
    const y = 4.32 + i * 0.48;
    tx(s, label, { x: M, y: y - 0.1, w: 1.5, h: 0.26, size: 13, color: T.ink });
    s.addShape(S.line, {
      x: xOf(cnn),
      y,
      w: xOf(math) - xOf(cnn),
      h: 0,
      line: { color: "C3C9C6", width: 1.25 },
    });
    dot(s, xOf(math), y, 0.13, T.teal);
    dot(s, xOf(cnn), y, 0.13, T.greyDeep);
    tx(s, `${String(math).replace(".", ",")}`, {
      x: xOf(math) + 0.12,
      y: y - 0.13,
      w: 0.9,
      h: 0.26,
      size: 11.5,
      bold: true,
      color: T.tealDeep,
    });
    tx(s, `${String(cnn).replace(".", ",")}`, {
      x: xOf(cnn) - 0.82,
      y: y - 0.13,
      w: 0.7,
      h: 0.26,
      size: 11.5,
      color: T.greyDeep,
      align: "right",
    });
  });
  hline(s, ax, 6.02, aw, T.rule, 0.75);
  [80, 90, 100].forEach((v) => {
    tx(s, `${v}`, {
      x: xOf(v) - 0.2,
      y: 6.08,
      w: 0.4,
      h: 0.24,
      size: 9.5,
      color: T.muted,
      align: "center",
    });
  });
  tx(s, "Top-k tačnost, %. Više je bolje.", {
    x: ax,
    y: 6.4,
    w: 4.0,
    h: 0.24,
    size: 10.5,
    color: T.muted,
  });
  tx(s, "7.281 zašumljeni upit, 776 pesama, pet nivoa šuma.", {
    x: 7.9,
    y: 6.4,
    w: 4.6,
    h: 0.24,
    size: 10.5,
    color: T.muted,
    align: "right",
  });

  notes(
    "Glavni rezultat: 97,56 prema 81,39 odsto na top-1. Matematika vodi na svakoj metriki, a razlika je 16,17 procentnih poena. " +
      "MRR je 0,976 prema 0,850, kad promaši prvo mesto, heširanje je i dalje mnogo bliže vrhu. " +
      "Namerno kažem „na svakoj metriki u ovom protokolu“; nemamo intervale pouzdanosti ni test značajnosti, pa ne tvrdimo da je razlika statistički značajna. (65 s)",
  );
}

// ---------------------------------------------------------------- 10 speed
{
  const s = newSlide("light", "Rezultati");
  heading(s, "Prostor za veći model");

  tx(s, "Vreme inferencije", { x: M, y: 1.78, w: 4.0, h: 0.26, size: 12, color: T.muted });
  const rows = [
    ["CNN", 16, T.greyDeep, "16 ms"],
    ["Matematička", 325, T.teal, "325 ms"],
  ];
  rows.forEach(([label, ms, color, value], i) => {
    const y = 2.24 + i * 0.86;
    tx(s, label, { x: M, y: y + 0.04, w: 1.75, h: 0.3, size: 15, bold: true, color: T.ink });
    const w = Math.max(0.09, (ms / 350) * 2.6);
    s.addShape(S.rect, {
      x: 2.72,
      y,
      w,
      h: 0.38,
      fill: { color },
      line: { color, width: 0 },
    });
    tx(s, value, {
      x: 2.72 + w + 0.12,
      y: y + 0.02,
      w: 1.1,
      h: 0.32,
      size: 14,
      bold: true,
      color: T.ink,
    });
  });
  tx(s, "20-pesmeni benchmark. Heš pretraga raste sa bazom, FAISS ne raste linearno.", {
    x: M,
    y: 4.05,
    w: 6.1,
    h: 0.5,
    size: 11.5,
    color: T.muted,
  });

  tx(s, "20×", {
    x: 7.55,
    y: 1.62,
    w: 5.0,
    h: 1.85,
    face: F.display,
    size: 120,
    bold: true,
    color: T.teal,
  });
  tx(s, "brža CNN inferenca", {
    x: 7.62,
    y: 3.5,
    w: 5.0,
    h: 0.3,
    size: 17,
    bold: true,
    color: T.ink,
  });
  tx(s, "16 ms prema 325 ms", {
    x: 7.62,
    y: 3.86,
    w: 4.5,
    h: 0.26,
    size: 12.5,
    color: T.muted,
  });

  hline(s, M, 4.96, CW, T.rule, 0.75);
  tx(s, "epoha 26", {
    x: M,
    y: 5.12,
    w: 4.4,
    h: 0.8,
    face: F.display,
    size: 44,
    bold: true,
    color: T.ink,
  });
  tx(s, "najbolji top-1: 81,39 %", {
    x: M,
    y: 5.94,
    w: 4.4,
    h: 0.26,
    size: 13,
    color: T.muted,
  });
  tx(s, "Posle epohe 26 tačnost opada, preprilagođavanje.", {
    x: 5.2,
    y: 5.2,
    w: 7.35,
    h: 0.36,
    size: 17,
    color: T.ink,
  });
  tx(s, "Dodatno treniranje nije put. Veći model jeste.", {
    x: 5.2,
    y: 5.68,
    w: 7.35,
    h: 0.32,
    size: 14,
    color: T.muted,
  });

  notes(
    "CNN je otprilike 20 puta brži: 16 milisekundi prema 325. Ali taj benchmark je na 20 pesama i heš pretraga raste sa bazom, pa tu brojku ne treba generalizovati. " +
      "Trening je stao na epohi 26; posle toga tačnost opada, što je klasično preprilagođavanje. Zato dodatne epohe nisu put, veći model je, i za njega ima prostora upravo zato što je inferenca tako brza. (65 s)",
  );
}

// ---------------------------------------------------------------- 11 why
{
  const s = newSlide("light", "Rezultati");
  heading(s, "Zašto heširanje pobeđuje ovde");

  const cols = [
    [
      "Testirali smo",
      T.teal,
      [
        "zašumljene originale na pet nivoa, −5 do 20 dB",
        "776 pesama iz 16 žanrova",
        "istu bazu i isti protokol za obe metode",
        "brzinu inferencije na 20 pesama",
      ],
      0.78,
    ],
    [
      "Nismo testirali",
      T.greyDeep,
      [
        "koveri i izvođenja uživo",
        "reverb i snimke iz sale",
        "razlaganje rezultata po nivou šuma",
        "milionske baze",
      ],
      6.95,
    ],
  ];
  cols.forEach(([head, color, items, x]) => {
    tx(s, head, { x, y: 1.8, w: 5.3, h: 0.36, size: 20, bold: true, color: T.ink });
    items.forEach((line, i) => {
      tx(s, line, { x, y: 2.42 + i * 0.5, w: 5.5, h: 0.3, size: 16, color: T.ink });
    });
  });
  vline(s, 6.55, 1.82, 2.6, T.rule, 0.75);

  tx(s, "Zato je CNN-ova prednost na koverima hipoteza, a ne rezultat.", {
    x: M,
    y: 5.12,
    w: CW,
    h: 0.44,
    size: 24,
    bold: true,
    color: T.ink,
  });
  tx(s, "Na zašumljenim originalima heširanje je u svom domenu. Poravnanje koristi vremensku strukturu pesme.", {
    x: M,
    y: 5.72,
    w: 11.4,
    h: 0.32,
    size: 14,
    color: T.muted,
  });

  notes(
    "Zašto onda heširanje pobeđuje? Zato što smo ga testirali na njegovom terenu: zašumljeni originali, ne koveri. " +
      "Poravnanje koristi vremensku strukturu pesme, a ne samo prisustvo heševa, zato je tako jako. " +
      "CNN-ova prednost na strukturnim mutacijama ostaje neproverena; to je pošteno reći i pre nego što nas pitaju. (50 s)",
  );
}

// ---------------------------------------------------------------- 12 future
{
  const s = newSlide("light", "Rezultati");
  heading(s, "Šta sledi");

  tx(s, "Danas: lokalne baze (dict i pickle, FAISS), bez reverba, rezultati agregirani po nivou šuma.", {
    x: M,
    y: 1.8,
    w: CW,
    h: 0.3,
    size: 14,
    color: T.muted,
  });

  const stops = [
    ["Test na koverima i uživo", "ključni eksperiment za CNN hipotezu"],
    ["Veći model", "ResNet-18 → MobileNetV3\nili dublja mreža"],
    ["Korisnički interfejs", "snimak → rezultat, bez komandne linije"],
    ["Skalabilna baza", "centralni indeks za milione pesama"],
  ];
  const railY = 3.02;
  hline(s, M, railY, CW, T.rule, 1);
  stops.forEach(([head, body], i) => {
    const x = M + i * 3.0;
    tick(s, x, railY - 0.13);
    tx(s, head, { x, y: 3.22, w: 2.75, h: 0.34, size: 17, bold: true, color: T.ink });
    tx(s, body, { x, y: 3.62, w: 2.7, h: 0.72, size: 12.5, color: T.muted });
  });

  tx(s, "Prvo mutacije, jer samo one mogu da promene zaključak.", {
    x: M,
    y: 5.42,
    w: 11.4,
    h: 0.44,
    size: 24,
    bold: true,
    color: T.ink,
  });

  notes(
    "Ograničenja su jasna: nismo testirali koveri i uživo, nema reverba, a baze su lokalne i nisu za milione pesama. " +
      "Zato su i sledeći koraci ovakvi: prvo test mutacija, jer to je jedina stvar koja može da promeni zaključak; onda veći model, pošto imamo prostor u latenciji; pa interfejs i skalabilna baza. (45 s)",
  );
}

setSection("Zaključak");

// ---------------------------------------------------------------- 13 conclusion
{
  const s = newSlide("close", "Zaključak");

  const stats = [
    ["97,56 %", "heširanje, top-1", T.tealOnInk, 0.78],
    ["81,39 %", "CNN, top-1", T.white, 4.55],
    ["20×", "brža inferenca", T.tealOnInk, 8.32],
  ];
  stats.forEach(([num, label, color, x]) => {
    tx(s, num, { x, y: 1.5, w: 3.5, h: 0.95, face: F.display, size: 60, bold: true, color });
    tx(s, label, { x, y: 2.5, w: 3.5, h: 0.26, size: 13, color: T.mutedOnInk });
  });

  ["Tačnije: heširanje i vremensko poravnanje.", "Brže: CNN inferenca, 16 ms prema 325 ms.", "Otvoreno: koveri i izvođenja uživo."].forEach(
    (line, i) => {
      tx(s, line, { x: M, y: 3.56 + i * 0.44, w: 11.4, h: 0.32, size: 18, color: T.white });
    },
  );

  tx(s, "Hvala. Pitanja?", {
    x: M,
    y: 5.18,
    w: 9,
    h: 0.85,
    face: F.display,
    size: 52,
    bold: true,
    color: T.white,
  });

  s.addImage({
    path: SPEC_BAND,
    x: 0,
    y: 6.3,
    w: 13.333,
    h: 1.2,
    altText: "Spektrogram sintetičkog audio primera",
  });

  notes(
    "Da zatvorim: heširanje je tačnije, CNN je znatno brži, a prednost CNN-a na koverima je otvoreno pitanje koje tek treba testirati. " +
      "Glavni doprinos nije pobednik, nego postavljen protokol koji omogućava da se ovo poredi ponovljivo. Hvala, spremni smo za pitanja. (20 s)",
  );
}

// ---------------------------------------------------------------- write
(async () => {
  const out = path.join(__dirname, "deck-graphical.pptx");
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
