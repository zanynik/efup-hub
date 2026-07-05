// Curated reading / watching list, organised by the themes that recur in the notes.
// `fromNotes: true` = you already named this person/work in your notes.
window.READING = {
  categories: [
    {
      key: "meditation",
      name: "Vipassana & Meditation",
      blurb: "The practice itself — observing sensation without reaction.",
      items: [
        { t:"The Art of Living: Vipassana Meditation as Taught by S.N. Goenka", who:"William Hart", type:"book", url:"https://en.wikipedia.org/wiki/Vipassana_movement",
          why:"The standard companion to the 10-day Goenka course. This is the exact technique your notes describe — sensation as the doorway, equanimity as the practice." },
        { t:"Altered Traits: Science Reveals What Meditation Does", who:"Daniel Goleman & Richard Davidson", type:"book", url:"https://en.wikipedia.org/wiki/Altered_Traits",
          why:"Davidson runs the lab whose fMRI work on meditators I cited in the book. This separates the real science from the woo — exactly the precision you want." },
        { t:"10% Happier", who:"Dan Harris", type:"book", url:"https://en.wikipedia.org/wiki/10%_Happier",
          why:"A skeptic news-anchor's entry into meditation. Good model for talking about Vipassana without sounding like a guru — useful for the writing platform you're building." },
        { t:"The Mind Illuminated", who:"Culadasa (John Yates)", type:"book", url:"https://en.wikipedia.org/wiki/The_Mind_Illuminated",
          why:"A complete, stage-by-stage troubleshooting manual for meditation — almost an engineering doc for attention. You'll love the structure." },
        { t:"10-Day Vipassana Course", who:"S.N. Goenka · dhamma.org", type:"course", fromNotes:true, url:"https://www.dhamma.org",
          why:"Your notes assume this technique. If you've never sat a full 10-day, this is the source. Free, donation-only — a working example of the gift economy you're arguing for." },
        { t:"Talks & Guided Meditations", who:"Tara Brach", type:"podcast", url:"https://www.tarabrach.com/talks-audio-video/",
          why:"Best public teacher of the 'observe the sensation, don't react' move applied to daily emotional life. Directly relevant to your office / flatmate moments." }
      ]
    },
    {
      key: "ego",
      name: "Ego, Self & Non-Duality",
      blurb: "Reality happens irrespective. The self that isn't.",
      items: [
        { t:"The Perennial Philosophy", who:"Aldous Huxley", type:"book", url:"https://en.wikipedia.org/wiki/The_Perennial_Philosophy_(Huxley)",
          why:"Argues the same recognition recurs across every tradition that looked hard enough — Advaita, Christian mysticism, Sufism. I cited this in the book; this is the source." },
        { t:"Being You: A New Science of Consciousness", who:"Anil Seth", type:"book", url:"https://en.wikipedia.org/wiki/Anil_Seth",
          why:"Seth's 'brain as prediction machine' framing — your sense of self is the brain's best guess. The neuroscience of Maya." },
        { t:"The Elephant in the Brain", who:"Kevin Simler & Robin Hanson", type:"book", url:"https://en.wikipedia.org/wiki/The_Elephant_in_the_Brain",
          why:"On the hidden, self-serving motives behind our actions — a hard, funny look at ego's daily operation. Connects to your 'we try to find a good reason for our actions' reflection." },
        { t:"Why Buddhism Is True", who:"Robert Wright", type:"book", url:"https://en.wikipedia.org/wiki/Why_Buddhism_Is_True",
          why:"Bridges evolutionary psychology and Buddhist no-self. The naturalistic case for the dissolving-ego project." },
        { t:"Be As You Are: The Teachings of Sri Ramana Maharshi", who:"edited by David Godman", type:"book", url:"https://en.wikipedia.org/wiki/Ramana_Maharshi",
          why:"The 'who am I?' self-enquiry route to the same door Vipassana reaches by sensation. Different technique, same destination." },
        { t:"Non-Duality Talks", who:"Rupert Spira", type:"video", url:"https://www.youtube.com/@RupertSpiraOfficialVideos",
          why:"The clearest living teacher of Advaita in plain English. Your 'JEIN — yes and no' chapter is his register." }
      ]
    },
    {
      key: "brain",
      name: "Dopamine, Habits & Addiction",
      blurb: "When does reinforcement learning turn into reinforcement addiction?",
      items: [
        { t:"Dopamine Nation: Finding Balance in the Age of Indulgence", who:"Anna Lembke", type:"book", url:"https://en.wikipedia.org/wiki/Anna_Lembke",
          why:"Lembke runs Stanford's addiction-medicine clinic. The reward-system reset I referenced in the book — the practical version of 'set the reward to zero.'" },
        { t:"The Molecule of More", who:"Daniel Lieberman & Michael Long", type:"book", url:"https://en.wikipedia.org/wiki/The_Molecule_of_More",
          why:"Why dopamine drives craving, novelty-chasing and dissatisfaction. The chemistry of the loops your notes keep identifying." },
        { t:"Hooked: How to Build Habit-Forming Products", who:"Nir Eyal", type:"book", url:"https://en.wikipedia.org/wiki/Nir_Eyal",
          why:"The playbook attention-economy products use to hijack your reward function. Read it as a defensive manual." },
        { t:"Scarcity: Why Having Too Little Means So Much", who:"Sendhil Mullainathan & Eldar Shafir", type:"book", url:"https://en.wikipedia.org/wiki/Scarcity_(book)",
          why:"The exact study I cited — chronic financial stress costs ~13 IQ points. The mechanism by which the fear-based economy manufactures more of itself." },
        { t:"Huberman Lab — Dopamine episodes", who:"Andrew Huberman", type:"podcast", url:"https://www.youtube.com/@hubermanlab",
          why:"Long-form, mechanistic explainers of reward, motivation and addiction. The RL-in-the-brain material at depth." }
      ]
    },
    {
      key: "rl",
      name: "Reinforcement Learning & Learning to Learn",
      blurb: "The maths behind both AlphaGo and your own brain.",
      items: [
        { t:"Reinforcement Learning: An Introduction", who:"Richard Sutton & Andrew Barto", type:"book", url:"https://en.wikipedia.org/wiki/Reinforcement_Learning:_An_Introduction",
          why:"The foundational textbook. Free online from the authors. The temporal-difference framework that powers AlphaGo and (roughly) your dopamine neurons." },
        { t:"Let's build the AlphaZero algorithm", who:"Andrej Karpathy", type:"video", fromNotes:true, url:"https://www.youtube.com/@AndrejKarpathy",
          why:"Karpathy is in your notes. Watch him build the self-play RL loop from scratch — the clearest way to see what 'reward function' really means." },
        { t:"Neural Networks: Zero to Hero", who:"Andrej Karpathy", type:"course", fromNotes:true, url:"https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
          why:"Build backprop by hand in code. Closes the gap between 'I know what's needed' and 'I know how it works' — your Karpathy-inspired learning note." },
        { t:"The AlphaGo / AlphaStar documentaries", who:"DeepMind", type:"video", url:"https://www.youtube.com/watch?v=WXuK6gekU1Y",
          why:"The actual story behind the Atari→Go→StarCraft arc in your notes. AlphaGo the film is genuinely moving." },
        { t:"Spaced Repetition & 'Augmenting Long-term Memory'", who:"Andy Matuschak", type:"article", url:"https://andymatuschak.org/",
          why:"On closing the gaps in what you know — directly answers your 'identify the gaps, fill them efficiently' note." }
      ]
    },
    {
      key: "ai",
      name: "AI — Trajectory, Agents & Coding With It",
      blurb: "Carbon building silicon. Your daily working material.",
      items: [
        { t:"The Thinking Game (documentary)", who:"Greg Kohs · on Demis Hassabis", type:"video", fromNotes:true, url:"https://www.thethinkinggame.com",
          why:"The documentary that triggered your 'A Vision for a Fearless Economy' deep-dive. Re-watch it now you've written the book — it lands differently." },
        { t:"Software 2.0 (essay)", who:"Andrej Karpathy", type:"article", fromNotes:true, url:"https://karpathy.medium.com/software-2-0-a64152b37c35",
          why:"The essay that reframes code as learned weights. Foundational to how you already think about 'computers on an autonomy slider.'" },
        { t:"Every (writing + build-a-business-on-AI)", who:"Dan Shipper & team", type:"blog", fromNotes:true, url:"https://every.to",
          why:"This is the company your 'audio rambling → PRD → articles/apps' workflow is modelled on. Read their pieces on compound engineering and LLM-as-a-judge." },
        { t:"Lenny's Podcast", who:"Lenny Rachitsky", type:"podcast", fromNotes:true, url:"https://www.lennysnewsletter.com/podcast",
          why:"The podcast you were listening to when you sketched the writing-platform idea. His 'expensive problems' framing is your ZPGS lens inverted." },
        { t:"Co-Intelligence: Living and Working with AI", who:"Ethan Mollick", type:"book", url:"https://en.wikipedia.org/wiki/Ethan_Mollick",
          why:"Practical, evidence-based guide to actually working with LLMs day-to-day. A sanity check on the workflows you're inventing." },
        { t:"Demis Hassabis on Lex Fridman", who:"Lex Fridman Podcast", type:"podcast", url:"https://lexfridman.com/demis-hassabis/",
          why:"Long-form Hassabis on long-term vision, AGI as a lottery ticket on intelligence — the lines that fed your fearless-economy reflection." },
        { t:"Dwarkesh Patel Podcast", who:"Dwarkesh Patel", type:"podcast", url:"https://www.dwarkesh.com",
          why:"Deep technical interviews with AI researchers and scientists. A step up in depth from the mainstream AI shows." }
      ]
    },
    {
      key: "money",
      name: "Money, Gift Economy & Basic Income",
      blurb: "What if food approached free? The ZPGS / EFUP material.",
      items: [
        { t:"Sacred Economics", who:"Charles Eisenstein", type:"book", url:"https://charleseisenstein.org/books/sacred-economics/",
          why:"The clearest full case for a gift economy. Free on the author's site. This is the book your ZPGS idea is reaching toward." },
        { t:"Debt: The First 5,000 Years", who:"David Graeber", type:"book", url:"https://en.wikipedia.org/wiki/Debt:_The_First_5000_Years",
          why:"Shows that money and markets are historically contingent, not natural law — the move you make in 'Power Law as Nature's Law.'" },
        { t:"The Gift: Creativity and the Artist in the Modern World", who:"Lewis Hyde", type:"book", url:"https://en.wikipedia.org/wiki/The_Gift_(Hyde_book)",
          why:"On why gift-exchange creates relationship where sale creates distance. The theory behind 'a business that meditates.'" },
        { t:"Utopia for Realists", who:"Rutger Bregman", type:"book", url:"https://en.wikipedia.org/wiki/Utopia_for_Realists",
          why:"The basic-income case I cited (Finland, etc.) in popular form. Direct evidence for the EFUP thesis: remove survival fear, people stand up." },
        { t:"Bullshit Jobs: A Theory", who:"David Graeber", type:"book", url:"https://en.wikipedia.org/wiki/Bullshit_Jobs",
          why:"Names the precise thing your office notes describe — the meaningless documentation, the resistance, the process-defending. Searing." },
        { t:"Doughnut Economics", who:"Kate Raworth", type:"book", url:"https://en.wikipedia.org/wiki/Doughnut_(economic_model)",
          why:"A redesign of the economic diagram itself — between social foundation and ecological ceiling. Concrete, not utopian." },
        { t:"GiveDirectly research", who:"GiveDirectly", type:"article", url:"https://www.givedirectly.org/research/",
          why:"Rigorous RCT evidence on unconditional cash — the empirical backbone for the basic-income side of your argument." }
      ]
    },
    {
      key: "crypto",
      name: "Bitcoin, NOSTR & Decentralization",
      blurb: "Personal data, censorship resistance, finding your people.",
      items: [
        { t:"Bitcoin: A Peer-to-Peer Electronic Cash System", who:"Satoshi Nakamoto", type:"article", fromNotes:true, url:"https://bitcoin.org/bitcoin.pdf",
          why:"You noted 'the power of the whitepaper — we saw how Bitcoin worked.' Re-read the original; it's only 9 pages." },
        { t:"The Bitcoin Standard", who:"Saifedean Ammous", type:"book", url:"https://en.wikipedia.org/wiki/The_Bitcoin_Standard",
          why:"The strongest case for hard money. Useful even if you disagree — it sharpens your own 'world without money' thesis." },
        { t:"NOSTR protocol notes", who:"fiatjaf & community", type:"article", fromNotes:true, url:"https://github.com/nostr-protocol/nips",
          why:"You referenced fiatjaf's AI-relay experiments. The NIPs are the spec — read how relays actually work before building on them." },
        { t:"Stacker News", who:"stacker.news", type:"blog", fromNotes:true, url:"https://stacker.news",
          why:"The forum you contributed to (the AI-summary feature). Lurk the top posts of all time — it's a working microcosm of attention-as-value." },
        { t:"Mastering Bitcoin", who:"Andreas Antonopoulos", type:"book", url:"https://github.com/bitcoinbook/bitcoinbook",
          why:"Free on GitHub. The technical deep-dive — how keys, scripts and txs actually work. Fills the implementation gap." }
      ]
    },
    {
      key: "systems",
      name: "Systems, Curiosity & Asking Why",
      blurb: "Never justify the status quo. See the system you live in.",
      items: [
        { t:"Thinking in Systems: A Primer", who:"Donella Meadows", type:"book", url:"https://en.wikipedia.org/wiki/Thinking_in_Systems",
          why:"The clearest intro to seeing feedback loops, leverage points and why systems resist change — the exact pattern you hit at the office." },
        { t:"The Beginning of Infinity", who:"David Deutsch", type:"book", url:"https://en.wikipedia.org/wiki/The_Beginning_of_Infinity",
          why:"A defence of explanation and 'keep asking why' as the engine of all progress. The philosophical backing for your 'Ask Why' app." },
        { t:"Antifragile", who:"Nassim Nicholas Taleb", type:"book", url:"https://en.wikipedia.org/wiki/Antifragile",
          why:"On systems that gain from disorder. Reframes 'people resist my proposals' as a feature of brittle systems, not a personal attack." },
        { t:"Veritasium", who:"Derek Muller", type:"video", fromNotes:true, url:"https://www.youtube.com/@veritasium",
          why:"You referenced the selfish-gene Veritasium video (and your disagreement with it). His back-catalogue is a feed of good 'ask why' prompts." },
        { t:"The Zeitgeist Movement / Peter Joseph", who:"Peter Joseph", type:"podcast", fromNotes:true, url:"https://www.thezeitgeistmovement.com",
          why:"You were listening to his podcast when you wrote 'How system conditioned are you?' The source for the 'collaborative rational document' idea." }
      ]
    },
    {
      key: "cosmos",
      name: "Consciousness, Panpsychism & Cosmos",
      blurb: "We are nature. Evolution 2.0.",
      items: [
        { t:"Galileo's Error: Foundations for a New Science of Consciousness", who:"Philip Goff", type:"book", url:"https://en.wikipedia.org/wiki/Galileo%27s_Error",
          why:"The most readable defence of panpsychism. The serious version of the 'maybe it's all conscious' thread in your notes." },
        { t:"The Ego Tunnel", who:"Thomas Metzinger", type:"book", url:"https://en.wikipedia.org/wiki/Thomas_Metzinger",
          why:"Metzinger's 'no self was ever found in the brain' argument — I cited him in the book. The cognitive-science of anatta." },
        { t:"Integrated Information Theory (IIT) papers", who:"Giulio Tononi", type:"article", url:"https://www.iit.wiki/",
          why:"The real mathematical attempt to quantify consciousness I referenced. Reads hard, but it's the genuine article." },
        { t:"The Selfish Gene", who:"Richard Dawkins", type:"book", url:"https://en.wikipedia.org/wiki/The_Selfish_Gene",
          why:"The book your 'selfishgene.txt' argues against. Read the original to sharpen your 'see evolution from consciousness, not the gene' counter." },
        { t:"The Feeling of What Happens", who:"Antonio Damasio", type:"book", url:"https://en.wikipedia.org/wiki/Antonio_Damasio",
          why:"On how the body maps itself into feeling and self — the neuroscience of your 'sensations are the doorway' chapter." }
      ]
    }
  ]
};
