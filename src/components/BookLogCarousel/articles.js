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
    title: "But why taste?",
    subtitle:
      "AI can produce competent design. So what's left for designers? The answer everyone reaches for is taste. I think that answer is incomplete.",
    author: "Harry Spawforth",
    issue: "VOL.07 / ISSUE 04",
    date: "Apr, 2026",
    readtime: "05 MIN",
    section: "ESSAY",
    excerpt:
      "AI can produce competent design. So what's left for designers? The answer everyone reaches for is taste. I think that answer is incomplete.",
    body: [
      "Scroll through design X or LinkedIn and you'll see the same argument on repeat. AI can produce competent design. So what's left for designers? Taste. Taste is the moat. Taste is the thing AI cannot replicate, and so the future-fit designer is the one with the most of it.",
      "The question worth asking isn't what humans still have over AI. It's the other way around. AI is not the complete answer. The work ahead is to embrace what these tools can do, and then look hard at what humans bring that the tools cannot.",
      "To be clear, taste is a real skill. It takes years of absorbing creativity, refining, and developing a point of view. It's what separates a competent design from one that feels right for the brand it's serving. It's not that I think the taste discussion is wrong, it's just that I think it's incomplete.",
      "I have this feeling that taste won't hold the line on its own. AI is getting better, and there's no good reason to think this is the one ridge it doesn't climb. Taste is also notoriously hard to measure. That pushes design closer to art, where judgement replaces metrics. But judgement at scale is a popularity contest. AI is built to win those, it averages, it aims for the 50th percentile, it gives you the version most people will nod at. That's not the design 50% think is the best or the most creative. It's the design the most people can agree with. No spike of emotion. No strong reaction in either direction. Just a quiet, broad \"yeah, that's fine.\"",
      "So if taste isn't the moat we thought it was, it begs the question. What does hold? I like how Magnifica Humanitas articulated it: machines lack human experiences, embodiment, and an understanding of love or responsibility. With just how much noise, excitement and disruption AI is making I think we need to reflect on what we have still to offer.",
      "The first is philosophy. The habit of looking at a problem from every angle, reasoning from values, applying metaphors to help make sense of problems, asking why something matters and not just whether it works. Philosophy is what shapes the experience. It takes a problem that's too large or too tangled to see clearly and gives it a form. A metaphor, an analogy, the right framing, anything that lets other people see what you're seeing. That's how complex problems become ones a team can actually act on. And once the shape is there, the rest follows. Alignment when the data points two ways. Conviction when a stakeholder wants the obvious answer and the obvious answer is wrong. Philosophy is how you arrive at a point of view or make sense of complex systems. AI alone doesn't have a point of view. It has a distribution.",
      "The second is judgement. AI gives you the 50th percentile by design. A designer's job, increasingly, is to know when to refuse it. When the model produces the version most people will nod at, judgement is the capacity to look at it, see what's missing, and choose the other way. Not for the sake of contrarianism. Because the consensus answer isn't always the right one, and the moments that matter most in design are usually the ones where it isn't. AI will zag every time, because the model is built to. Judgement is knowing when to zig.",
      "Philosophy and judgement aren't enough on their own. The work is to make design calls that move a number, change a behaviour, win a customer. AI can write a strategy doc. It can't decide which design call is worth making, or tie that call to something the business will actually feel. That last part is the work I care about most.",
      "None of this is an argument against AI. The opposite. AI is the most powerful tool a designer has ever had, and the designers who win the next decade are the ones who use it well. They'll use it to move faster, generate more options, test more ideas. But they'll bring their own philosophy, their own judgement, their own strategic intuition to decide which of those ideas is actually worth shipping.",
    ],
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
    title: "Landscape of data",
    subtitle:
      "Most information tools have one job: show you the data. The good ones have a second job. They let you move seamlessly between altitudes for different levels of context.",
    author: "Harry Spawforth",
    issue: "VOL.07 / ISSUE 04",
    date: "Apr, 2026",
    readtime: "05 MIN",
    section: "FIELD NOTES",
    excerpt:
      "Most information tools have one job: show you the data. The good ones have a second job. They let you move seamlessly between altitudes for different levels of context.",
    body: [
      "I spent several rounds of research sitting with management consultants.",
      "The instinct is to give consultants more data, or better data. In fairness, both are good things. Better data is rarely the wrong investment. But data, however good, only pays off when the person using it can move between altitudes.",
      "A consultant diagnosing a business has to see it at several layers. Zoomed in, they need revenue, products, the tech stack. A step out, they need competitors, market position, growth relative to the field. Further out, they need the full landscape: the players in the market, the businesses upstream and downstream that shape the conditions their client is operating in. Each layer surfaces different causes, different risks, different leverage points. Consultants who work from one altitude solve for what they can see. The good ones solve for what's actually happening.",
      "We already know how to do this. Maps have worked this way for centuries on paper, and for two decades on screens.",
      "Zoom in on London and you see the London Eye, the path along the river, the pier it sits on. Pull back and the Eye becomes one landmark among many: Westminster, the bridges, the South Bank. Pull back further and London itself becomes one node in a country, surrounded by rivers, motorways and green belts that shape how everything moves. The place doesn't change. Your understanding of it does.",
      "The same logic applies to business data. Zoomed in: revenue, products, the tech stack. A step out: competitors, market position, who's growing faster than who. Further out: the full market, the upstream suppliers, the downstream buyers, the broader forces acting on the industry. The business doesn't change at each altitude. What you understand about it does.",
      "The workflow I built tries to do two things. It reads intent from how a consultant searches, and starts them at the altitude that matches it. From there, the interface stays out of the way: progressive disclosure and a careful layout let them drop into detail or pull back to context without losing the line of inquiry they came in on.",
      "One detail kept getting called out in testing. Instead of the page growing endlessly from the bottom, the way ChatGPT and most deep research tools do, consultants could branch off at the point of interest. They could open up a thread of inquiry without losing the one they came in on. Consultants who saw it described it as a frustration they hadn't known they had. They'd lived with the alternative for years, and only recognised it as a problem the moment a different version existed.",
      "If you're building anything that delivers information to someone making a decision, the question to ask isn't \"how much data should I show?\" It's \"how easily can they change altitude on it?\" Dashboards, research interfaces, AI assistants, internal analytics products: they all serve someone trying to make a decision, and they all default to dumping data at a single altitude.",
      "Data tells you what is. Altitude tells you what it means. The tools that figure out how to give people both are the ones I'd bet on.",
    ],
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
    /* Temporarily hidden — kept in the data so it can be restored later. */
    hidden: true,
    title: "The standard deviation of AI design output, how to utilise for workflow efficiency",
    subtitle: "What the book remembers that you forgot",
    author: "Helena Crisp",
    issue: "VOL.07 / ISSUE 03",
    date: "Mar, 2026",
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
    id: "005",
    num: "005",
    title: "Cheap subsidised AI has made our products lazy",
    part: "Part 1",
    next: { id: "006", label: "Part 2", title: "What thinking harder about AI looks like" },
    subtitle:
      "Every product in 2026 ships the same AI features in the same places. Not because users asked for them, but because right now they're almost free to add. That subsidy won't last.",
    author: "Harry Spawforth",
    issue: "VOL.07 / ISSUE 02",
    date: "Feb, 2026",
    readtime: "06 MIN",
    section: "ESSAY",
    excerpt:
      "Every product in 2026 ships the same AI features in the same places. Not because users asked for them, but because right now they're almost free to add. That subsidy won't last.",
    body: [
      "Open any tech product in 2026 and you'll see the same feature in the same place. Summarise this Slack channel. Summarise this document. Summarise this meeting. Summarise this thread. Sometimes the summary is genuinely useful, when the use case warrants it. But most of the time the button is there because somebody could ship it, not because the use case asked for it.",
      "I want to talk about why every product looks like this. Because it isn't a coincidence, and it isn't because users asked for it.",
      "The reason every product looks like this is that AI is cheap right now. Not actually cheap. Just cheap to us. The labs running these models are burning through investor money at a rate that makes Uber's early years look modest, and the IPOs of OpenAI and Anthropic are circling. When those land, the burden of paying for all this shifts. Some of it goes to public markets. Most of it ends up with the people using the product, which is to say, all of us.",
      "Cheap AI changes how products get built. When inference is effectively free, there's no friction on adding another AI feature. No exec asks whether the eighth summary button is worth it. No product team has to defend the cost. We've become blind to the questions that usually discipline product thinking, what does this cost to run and what return are we getting for it. The need for speed has won out over the patience to ask.",
      "What this produces, in practice, is bolt-on. Every roadmap has an AI line item. Every product page has a sparkle icon. Every workflow has a button that calls a model whether or not the model is the right thing to call. Teams ship features quickly because the leadership chant is the same in every company: we need AI in this. The thinking happens, when it happens at all, after the feature is out.",
      "And the laziness goes deeper than the feature itself. It runs all the way back into how the feature got built. Tokens get burned long before anything ships, on workflows nobody questioned, on prompts that did more than they needed to, on agents that ran twice because nobody bothered to set up the first one properly. AI is excellent at improving efficiency on bounded, low-risk tasks. We are using it for everything, including the parts where the speed gain is illusory and the cost is real.",
      "The feature itself rarely starts in the right place. It doesn't start from a user, or a use case, or a real piece of context. It starts from the tool. We're not building things people need. We're finding places to put a model. This applies just as much to AI-native products as to legacy ones bolting on a chatbot. Same instinct, different starting position. The product team that should be asking what's actually worth building here is asking instead what can this model do that we can ship by Friday.",
      "This isn't sustainable, and almost nobody is talking about it. The IPOs are coming. The subsidy isn't going to last forever. The price of inference will move closer to its real cost. And when that happens, every product team that spent the last two years adding AI to everything is going to be asked a much simpler question than they're used to. Is this feature worth what it now costs to run?",
      "That's a healthier question than it sounds. Some features will earn their price tag easily. Others will get rescoped, narrowed, or quietly turned off, and that's fine. The harder bit is the conversation with users, because the bar AI has set is \"look what this can do\" and the bar after pricing arrives might be a little lower. Building back from that takes careful strategy, considered thinking, and a much better understanding of where AI actually belongs in the use case.",
      "None of this is a complaint about AI. The tools are useful. They have changed what I can produce in a day, the kinds of problems I can take on, the speed at which I can move from idea to test. They have made me a more productive designer. And they have opened up fields I wouldn't have gone near two years ago. I am building and shipping my own software now. The rate of improvement isn't slowing, and I am genuinely intrigued about what's coming.",
      "The laziness isn't the tool's fault. Lazy features are a direct response to how easily we've been able to ship, and to how comfortable that ease has made us. None of this is a problem we should be waiting on. The reckoning will force the question, but the question was always there. The work ahead, when the price of inference catches up, isn't to use less AI. It's to think harder about which uses earn their place. What that thinking looks like in practice is where this conversation goes next.",
    ],
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
    title: "Cheap subsidised AI has made our products lazy",
    part: "Part 2",
    subtitle:
      "Part one ended on a question: what does thinking harder about AI actually look like? The recalibration is already underway. Here's the framework I keep coming back to.",
    author: "Harry Spawforth",
    issue: "VOL.07 / ISSUE 02",
    date: "Feb, 2026",
    readtime: "08 MIN",
    section: "ESSAY",
    excerpt:
      "Part one ended on a question: what does thinking harder about AI actually look like? The recalibration is already underway. Here's the framework I keep coming back to.",
    body: [
      "Part one ended on a question. What does thinking harder about AI actually look like in practice? Before we get there, it's worth noticing that the shift is already underway. In places that aren't making headlines, some companies are pulling back. Teams that were encouraged to burn tokens on every available workflow are being asked to be more selective. The return on all that token spend isn't matching the bill, and the same companies that were beating the AI drum a year ago are starting to ask different questions. This is the recalibration. It's begun.",
      "None of this should surprise anyone who was paying attention a year ago. In 2025, MIT's NANDA initiative published a study on enterprise AI called The GenAI Divide. The headline finding was that 95% of enterprise generative AI pilots had failed to produce a measurable return. Not most. Ninety-five percent.",
      "What's interesting is the diagnosis. Executives in the study tended to blame the models. The researchers found something else. The problem wasn't the AI. It was what the report called a learning gap. People and organisations didn't understand which use cases AI was suited to, and they didn't know how to design workflows that captured the benefit while managing the downsides. The tools worked. The way we were using them didn't.",
      "A year on, the study reads less like a warning and more like a forecast. The recalibration starting to happen now is the predictable response to what was already true then. The shift isn't being driven by AI getting worse. It's being driven by companies finally noticing that the way they've been building with it hasn't been working.",
      "The learning gap shows up first in the process. Most product teams build the same way. Find a pain point. Diverge on solutions. Converge on a feature. It's a good process for most product work. It's the wrong shape for AI.",
      "AI isn't best at solving fresh problems. It's best at optimising friction that's already there. Smoothing the slow parts of a workflow. Reducing the cognitive load on a step a user already does. Surfacing context they would otherwise have to dig for. When teams start from a pain point and ask \"how can AI solve this\", they end up reaching for a model whether or not the situation called for one. When teams start from an existing friction and ask \"is there a capability that would make this lighter\", they end up somewhere more useful.",
      "The starting question matters. Most of the lazy features in part one came from the wrong one.",
      "There's a second piece of the learning gap. Most people think of AI as one thing, and that one thing is usually a chatbot. It's the loudest, most expensive, most general form of the technology, and it's the one everyone reaches for by default. But AI isn't a single capability. It's a wide set of approaches with very different costs, speeds, and use cases.",
      "Classification is AI. So is semantic search. So is intent detection, routing, ranking, summarisation, prediction. Some of these run cheaply on small models or even on-device. Some don't need a large language model anywhere near them. A lot of the friction worth removing in a product can be removed without ever calling the most expensive form of the tool.",
      "Teams that treat AI as a single primitive end up reaching for the most expensive option every time. The teams that know the wider toolkit pick the right tool for the friction in front of them.",
      "The framework I keep coming back to is simple, and it works because it puts the starting question in the right place. Context plus AI capability equals concept.",
      "Context is the use case. The specific friction. The specific user, doing a specific thing, at a specific moment in a workflow. Not \"users want to be more productive\". Not \"people get overwhelmed in long documents\". Something concrete enough that you can describe what changes when the friction is gone.",
      "AI capability is the specific tool you're reaching for, picked from the wider spectrum. You should be able to say which one, why, what value it gives the user, what it costs to run, and what its limitations are. If you can't answer those, you haven't picked one yet.",
      "Concept is what emerges when context and capability are matched well. It isn't a feature you reverse-engineered from a model. It's the design move that lands when you put the right capability against the right friction. Most of the time it's smaller and quieter than the AI feature most teams would have shipped. That's usually a sign you've done it right.",
      "Even with the right context and the right capability, four things have to be true for the concept to actually land.",
      "The first is risk. AI is excellent on bounded, low-stakes friction. It is unreliable on high-stakes decisions, and dressing that unreliability in confident language doesn't make it less unreliable. If the cost of getting it wrong is significant, the capability either needs guardrails, automated checks, and human review built into the design, or it needs to not ship.",
      "The second is integration. Most AI features fail not at the capability layer but at the touch point where the capability meets the user's behaviour. The model can do the thing. The user has to want to do the thing with the model in the loop. Designing that touch point is the most underrated work in AI right now, and it's almost never given the time it needs.",
      "The third is measurement. Teams need to know, before they ship, what success looks like and how they'll know they've reached it. Most don't. AI outputs are messy enough that without a clear evaluation method, every result becomes a matter of opinion. That's how lazy features survive long after they've stopped earning their place.",
      "The fourth is judgement. I've written elsewhere about this, but it's worth repeating here. Knowing when not to build is part of the work. The equation lets you check whether a concept is worth shipping. The harder discipline is being willing to walk away from a concept that isn't, even when leadership wants you to ship something.",
      "The recalibration won't be kind to teams that spent the cheap era bolting on. It will reward the teams who were already thinking like this. The ones who started from context, picked the right capability for the job, and shipped concepts that earned their cost from day one.",
      "None of this is news. Product teams have gotten complacent with the basics, because cheap AI gave us permission to. The teams that snap out of it now will be a long way ahead of the ones who don't.",
      "If you take one thing from these two pieces, let it be the question. Not \"how can we add AI to this?\" Ask, \"what's the friction worth removing, what capability fits, and is the concept that emerges worth what it costs?\" That's the shift. It's not bigger than that.",
    ],
    cover: { hue: 260, chroma: 0.025, lightness: 0.42 },
    coords: "37.77 N / 122.41 W",
    field: "ESS_29",
    revision: "R.06",
    paper: "ash",
    decorations: [
      { type: "postit", color: "yellow", style: { top: "42%", right: "8%" }, rotate: 4 },
      { type: "paper-out", side: "right", style: { top: "30%", height: "28%" }, rotate: -2 },
      { type: "paper-out", side: "bottom", style: { left: "38%", width: "30%" }, rotate: 3 },
    ],
    sections: defaultSections,
  },
  {
    id: "007",
    num: "007",
    title: "The expensive cost of cheap thinking",
    subtitle:
      "We've spent two years celebrating how fast we can produce things, without asking what we lose by producing them so quickly. Some work is pure output. For the rest, the process was the gift.",
    author: "Harry Spawforth",
    issue: "VOL.07 / ISSUE 02",
    date: "Jun, 2026",
    readtime: "07 MIN",
    section: "ESSAY",
    excerpt:
      "We've spent two years celebrating how fast we can produce things, without asking what we lose by producing them so quickly. Some work is pure output. For the rest, the process was the gift.",
    body: [
      "It is curious, I think, that we have spent the last two years celebrating the speed at which we can now produce things, without quite asking what we lose by producing them so quickly.",
      "Consider the painter. A finished canvas, framed and hung, is often described as if the value lived in the image alone. The composition, the colour, the resemblance. But anyone who has watched a painter at work knows that the canvas is only the last layer of something much larger. The hours of looking. The thousand small decisions about what to leave out. The work that taught the painter how to see what they are now painting. The canvas is the visible part of a far longer, far less visible process, and the painter's hand at the end is steady because of everything that came before it.",
      "That sounds, I imagine, like a rather genteel point about craft. Let me apply it somewhere less genteel.",
      "A lawyer who has spent years reading judgments, drafting submissions, and being argued out of their first instinct by a senior partner does not, when they walk into a courtroom, hold a list of rules. They hold something more useful and harder to write down. A feel for which arguments will land, which precedents will be quietly distinguished, which way the case is leaning before they've spoken, and how to change the flow of the room when the moment demands it. None of that is retrievable from a brief read on the morning of the hearing. It is the residue of having done the work. And here is the difficulty. An AI summary, however good, delivers the information without the depth. The lawyer who relied on the summary walks into the courtroom holding little context. The lawyer who did the ground work walks into the courtroom holding everything the work made them.",
      "I should be clear that no one is suggesting lawyers are about to outsource all their case preparation to a chatbot. The example is illustrative, not predictive. But the principle it makes visible is not confined to law. Over-reliance on AI in the wrong scenarios produces reduced performance, and most of the people experiencing it are doing so in less high-stakes settings where the cost is harder to see.",
      "The question that helps, I find, is not \"can the AI do this?\" but \"what do I lose by not doing it myself?\" These are not the same question. The first asks whether the output will arrive. The second asks whether anything else will, too.",
      "Some tasks are pure output. If I want to know the boiling point of water at altitude, or whether the trains are running into Waterloo this morning, the answer is the answer. I gain nothing by deriving the boiling point from first principles. The output is the whole of the gift, and outsourcing it costs me nothing because there is nothing else to lose.",
      "Other tasks are nothing like that. They produce information that is genuinely useful, but the information arrives separated from the context that tells you what to do with it. AI can extract insights from a hundred interviews. It can summarise a market. It can produce a competent draft of almost anything you can describe to it. None of those outputs are wrong. They are, however, missing the depth around them that would tell you which insights to weigh, which parts of the market are about to shift, and which sentences in the draft are doing work the rest of the document is quietly leaning on. The document at the end is a kind of receipt for a process that has changed the person doing it. Take the receipt without the process and you have, quite literally, paid for nothing.",
      "What happens, in practice, when one tries to take the receipt without the process is common, and rarely commented on. It usually goes one of two ways.",
      "In the first, the document arrives, you read it, and you sit down to act on it. And you quickly realise that you cannot. The insights are there, but it is unclear which of them are real and which are artefacts of the way the question was posed. You end up, sheepishly, going back and doing some version of the work the AI was supposed to have spared you. The offload was illusory. The hours saved at the top end have to be paid back at the bottom, with interest, because the work is now being done in the wrong order.",
      "In the second, which is by far the more expensive variety, you read the document and act on it anyway. The decisions you then make are, on average, slightly worse than the decisions you would have made if you had done the work yourself. Not catastrophically worse. Just steadily, imperceptibly, drifting in the wrong direction. The cost shows up later, usually somewhere you were not looking, and by the time it is visible, the cause is no longer easy to trace back to the document you half-read several months ago.",
      "None of this, I should say, is an argument against using AI. AI is incredibly useful, and there are a great many things you would have to be slightly mad to do yourself when a model will do them more quickly and to a perfectly acceptable standard.",
      "The argument is rather narrower than that. We have, in some sense, been blinded by the excitement that AI can do so much on the surface, and we have overlooked something underneath it that matters quite a lot. There are parts of our work where the output is the gift, and parts where the process was, and we have stopped distinguishing between the two. We are outsourcing both with the same enthusiasm, and we are paying for it in a slightly delayed way that is only now beginning to show.",
      "This is, I think, where product designers carry a particular responsibility. We are the ones putting AI into the workflows that millions of people then live inside. Every time we put a button in a product that invites someone to skip a piece of context-building work, we are making a small decision on behalf of every user who will press it. Some of those decisions are kind. We are sparing them from drudgery they were never going to learn anything from. Other decisions, dressed in the same clothes, are quietly taking something from them, and we are the ones designing the moment in which it happens. The least we can do is know the difference.",
      "My own work has, for some years now, been an attempt to design this difference into products on purpose. The aim has been to build features that take the drudgery and leave the depth, rather than the reverse. The principle is here. The detail is in my work.",
    ],
    cover: { hue: 18, chroma: 0.045, lightness: 0.6 },
    coords: "51.50 N / 00.12 W",
    field: "ESS_30",
    revision: "R.07",
    paper: "clay",
    decorations: [
      { type: "postit", color: "pink", style: { top: "43%", right: "8%" }, rotate: -4 },
      { type: "doodle", shape: "heart", style: { bottom: "32%", left: "30%" }, rotate: 10 },
      { type: "paper-out", side: "bottom", style: { left: "36%", width: "30%" }, rotate: 2 },
    ],
    sections: defaultSections,
  },
];

/* Articles shown in listings and given static routes. Anything with
   `hidden: true` is kept in ARTICLES (so it's easy to restore) but
   excluded from the site until the flag is removed. */
export const VISIBLE_ARTICLES = ARTICLES.filter((a) => !a.hidden);

export function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id);
}
