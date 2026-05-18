/* BookLog Carousel — article data.
   Each article has:
   - `paper`: palette key (see Cover.js PAPER_PALETTES) — cardstock colour
   - `decorations`: array of one or two stickers/doodles on the cover */

const defaultSections = [
  { id: "context", label: "Context" },
  { id: "excerpt", label: "Excerpt" },
  { id: "takeaway", label: "Takeaway" },
];

export const ARTICLES = [
  {
    id: "001",
    num: "001",
    title: "Evolution of the designer",
    subtitle: "On the long arc of finishing what you start",
    author: "Marguerite Vale",
    issue: "VOL.07 / ISSUE 04",
    date: "2026.04.18",
    readtime: "11 MIN",
    section: "ESSAY",
    excerpt:
      "Somewhere between the hundredth and two-hundredth page, a book stops being a stranger. The compact between reader and writer becomes specific. You learn the cadence, the tics, the small generosities — and patience starts to feel less like waiting and more like listening.",
    cover: { hue: 32, chroma: 0.04, lightness: 0.62 },
    coords: "51.50 N / 00.12 W",
    field: "ESS_04",
    revision: "R.04",
    paper: "manila",
    decorations: [
      /* Yellow post-it nudged down into the middle-right so it no
         longer overlaps the tape label at the top. */
      { type: "postit", color: "yellow", style: { top: "44%", right: "8%" }, rotate: -5 },
      { type: "doodle", shape: "asterisk", style: { bottom: "30%", left: "32%" }, rotate: 14 },
      { type: "paper-out", side: "bottom", style: { left: "40%", width: "32%" }, rotate: -2 },
    ],
    sections: defaultSections,
  },
  {
    id: "002",
    num: "002",
    title: "Design Philosophy",
    subtitle: "Why the second pass is the only one that matters",
    author: "Idris Okafor",
    issue: "VOL.07 / ISSUE 04",
    date: "2026.04.11",
    readtime: "08 MIN",
    section: "FIELD NOTES",
    excerpt:
      "The first reading is a survey. You are mapping the terrain — finding the rivers, the ridges, the places that snag. The second reading is the field walk. Pen in hand, you stop, you double back, you write in the margin. The book becomes a place you have been.",
    cover: { hue: 220, chroma: 0.03, lightness: 0.58 },
    coords: "40.71 N / 74.00 W",
    field: "FN_11",
    revision: "R.02",
    paper: "slate",
    decorations: [
      { type: "paper-out", side: "bottom", style: { left: "30%", width: "44%" }, rotate: 1 },
      { type: "paper-out", side: "right", style: { top: "32%", height: "28%" }, rotate: 3 },
      { type: "doodle", shape: "star", style: { bottom: "40%", left: "32%" }, rotate: -8 },
    ],
    sections: defaultSections,
  },
  {
    id: "003",
    num: "003",
    title: "Design Strategy",
    subtitle: "What the book remembers that you forgot",
    author: "Helena Crisp",
    issue: "VOL.07 / ISSUE 03",
    date: "2026.03.27",
    readtime: "14 MIN",
    section: "LONGFORM",
    excerpt:
      "I first read Middlemarch at twenty and thought it was about marriage. I read it again at thirty and thought it was about ambition. Now, at forty, I am quite sure it is about disappointment — that ordinary, productive, indispensable form of grief that nobody warns you about.",
    cover: { hue: 88, chroma: 0.025, lightness: 0.55 },
    coords: "55.95 N / 03.18 W",
    field: "LF_27",
    revision: "R.07",
    paper: "moss",
    decorations: [
      /* Mug ring moved down-right to clear the tape label. */
      { type: "mug-ring", variant: "a", style: { top: "42%", right: "8%" }, rotate: 0 },
      { type: "doodle", shape: "arrow", style: { bottom: "30%", left: "30%" }, rotate: -22 },
      { type: "paper-out", side: "bottom", style: { left: "44%", width: "30%" }, rotate: 3 },
    ],
    sections: defaultSections,
  },
  {
    id: "004",
    num: "004",
    title: "Design wouldn't mean anything without research",
    subtitle: "Where friction does its quiet work",
    author: "Tomás Reinhard",
    issue: "VOL.07 / ISSUE 03",
    date: "2026.03.14",
    readtime: "09 MIN",
    section: "ARGUMENT",
    excerpt:
      "A difficult book is not the same as a bad one. The difficulty is the point — the place where the writer stops doing your thinking for you and asks you to climb the next sentence under your own power. Some of the best hours of my reading life have been spent on a single page.",
    cover: { hue: 18, chroma: 0.04, lightness: 0.48 },
    coords: "48.85 N / 02.35 E",
    field: "ARG_14",
    revision: "R.03",
    paper: "clay",
    decorations: [
      /* Pink post-it moved over to the middle-left so the tape stays
         clear. */
      { type: "postit", color: "pink", style: { top: "38%", left: "30%" }, rotate: 7 },
      { type: "paper-out", side: "right", style: { top: "55%", height: "24%" }, rotate: -2 },
    ],
    sections: defaultSections,
  },
  {
    id: "005",
    num: "005",
    title: "Business & Product, where design has fumbled",
    subtitle: "What our shelves say when no one is reading them",
    author: "Saoirse Lin",
    issue: "VOL.07 / ISSUE 02",
    date: "2026.02.28",
    readtime: "06 MIN",
    section: "ESSAY",
    excerpt:
      "Every shelf is a confession. The novels you finished, the ones you meant to. The history you bought in a fit of ambition; the poetry you returned to in grief. A shelf is not a library — it is a record of selves, the ones you were, the ones you tried to be.",
    cover: { hue: 58, chroma: 0.05, lightness: 0.66 },
    coords: "37.77 N / 122.41 W",
    field: "ESS_28",
    revision: "R.05",
    paper: "legal",
    decorations: [
      /* Orange post-it moved into the middle so the tape stays
         readable. */
      { type: "postit", color: "orange", style: { top: "44%", right: "8%" }, rotate: -3 },
      { type: "paper-out", side: "top", style: { left: "35%", width: "42%" }, rotate: -2 },
      { type: "paper-out", side: "bottom", style: { left: "30%", width: "26%" }, rotate: 4 },
    ],
    sections: defaultSections,
  },
  {
    id: "006",
    num: "006",
    title: "Notes on Quitting a Book",
    subtitle: "The 80-page rule, and the right to walk away",
    author: "Beatrix Hand",
    issue: "VOL.07 / ISSUE 02",
    date: "2026.02.14",
    readtime: "07 MIN",
    section: "FIELD NOTES",
    excerpt:
      "There is no virtue in finishing a book that does not earn it. Eighty pages is a fair audition. If by then it has not pulled you in — by voice, by argument, by the thinness of a single line — close it gently and put it back. Your time is the only library you cannot replace.",
    cover: { hue: 260, chroma: 0.025, lightness: 0.42 },
    coords: "52.52 N / 13.40 E",
    field: "FN_14",
    revision: "R.02",
    paper: "ash",
    decorations: [
      { type: "mug-ring", variant: "c", style: { bottom: "30%", right: "12%" }, rotate: 12 },
      { type: "doodle", shape: "heart", style: { bottom: "44%", left: "32%" }, rotate: -10 },
      { type: "paper-out", side: "right", style: { top: "26%", height: "30%" }, rotate: 2 },
      { type: "paper-out", side: "bottom", style: { left: "38%", width: "28%" }, rotate: -3 },
    ],
    sections: defaultSections,
  },
];

export function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id);
}
