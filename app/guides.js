// guides.js — the editorial heart of Leonida Platinum.
//
// Everything in this file is our own writing: a kind classification for each of
// the 55 official trophies, an original guide of at least 200 characters per
// trophy reasoned from its official description, the numeric targets our
// tracker counts toward, the four trophies we flag as possibly missable (an
// unconfirmed inference, labelled as such everywhere it appears), and a
// seven-stage roadmap to the platinum that visits every trophy exactly once.
// The official names, descriptions and grades themselves live in
// data/trophies.json and are never repeated here except where a missable flag
// quotes the description it was reasoned from.

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side strands',
  activity: 'Activities',
  collect: 'Collectibles & coverage',
  crime: 'Crime',
  money: 'Money',
  world: 'World & completion',
  platinum: 'Platinum',
};

export const KIND_OF = {
  1: 'platinum',
  2: 'story', 3: 'story', 4: 'story', 5: 'story', 6: 'story', 7: 'story',
  8: 'story', 9: 'story', 10: 'story', 11: 'story', 12: 'story', 13: 'story',
  48: 'story',
  20: 'side', 22: 'side', 23: 'side', 24: 'side', 25: 'side', 26: 'side',
  27: 'side', 29: 'side',
  15: 'activity', 16: 'activity', 17: 'activity', 18: 'activity',
  19: 'activity', 21: 'activity', 46: 'activity', 51: 'activity',
  28: 'collect', 30: 'collect', 31: 'collect', 35: 'collect', 42: 'collect',
  55: 'collect',
  33: 'crime', 34: 'crime', 36: 'crime', 37: 'crime', 38: 'crime',
  39: 'crime', 40: 'crime', 41: 'crime', 43: 'crime', 45: 'crime',
  52: 'money', 53: 'money', 54: 'money',
  14: 'world', 32: 'world', 44: 'world', 47: 'world', 49: 'world',
  50: 'world',
};

export const GUIDE = {
  1: `The platinum is awarded the moment every other trophy on this list pops, so there is nothing to hunt down directly. Treat it as a progress report: work through the story, the strands, the activities and the collectibles in any order you enjoy, keep an eye on the few missable-flagged trophies elsewhere in this guide, and the Legend of Leonida is yours when the counter reaches 54 of 54.`,
  2: `Gone Fishing is the opening mission, so this pops simply by starting the story and playing through the introduction. Follow the on-screen prompts and learn the basic movement, driving and interaction controls as the game teaches them, then finish the sequence. It cannot be missed: the first mission is the front door of the game, and chapter select will let you replay it if you ever need to.`,
  3: `Play the story through to the end of Chapter 1. Main missions are marked on the map and in the pause menu, and nothing in the chapter depends on a choice you can get wrong, so just keep following the markers. Expect the chapter to introduce both protagonists and the basics of wanted levels, safehouses and switching characters before the trophy pops at the chapter card.`,
  4: `Finish every main mission in Chapter 2. The censored title is the chapter's own name on the official list, not a clue about its content. Keep a rotation of saves before the big set-pieces in case a mission glitches, and mop up any stranger strands that open along the way so the side content never piles up at the end of the game waiting for you.`,
  5: `Complete Chapter 3 of the story. By now the map should be opening up beyond Vice City itself, so use the travel time between missions to reveal new regions and note collectible spots for later. Nothing in this chapter is missable on the official information we have; if a mission offers a choice, pick freely, and keep a manual save if you want to see the other branch another day.`,
  6: `Finish Chapter 4. This is the last of the numbered chapters before the endgame, so it is a good moment to check your completion percentage and make a start on the longer grinds — stunts, range golds, laundering — rather than leaving them all for after the finale. The trophy pops automatically when the chapter's final mission ends.`,
  7: `Finish the final story mission. Before you start it, spend your money well, stock up on armour, ammo and snacks, and make a clean manual save in a separate slot: finales in this series tend to be long, combat-heavy and followed by a point of no return for some activities. The gold pops as the ending sequence begins. Most of this list can still be cleaned up afterwards in free roam if past games are a guide, but do not rely on that for the missable-flagged items.`,
  8: `Breakfast Run is a named story mission, so simply play the campaign and it will be offered as part of the main path. Follow the mission markers, complete the run the title promises — an early-morning job, most likely a delivery or escort — and the trophy pops at the mission-complete screen. It sits on the critical path, so it cannot be skipped or missed.`,
  9: `The Cartel Heist is a story set-piece: progress the campaign until it unlocks and play it through. Heists in this series usually let you prepare first, so if the game offers prep missions, crew choices or approach options, do the preps — they make the finale smoother and can change the payout. Keep a save from before the heist starts in case you want to retry for a cleaner run.`,
  10: `Child's Play is a named main mission. Play the story until it appears, follow its objectives, and the trophy unlocks on completion. Missions with family themes in this series often involve protecting or escorting someone, so keep your charge alive, use cover, and do not rush ahead of the person you are guarding if the objective tells you to stay close.`,
  11: `Headliners is a named story mission; work through the campaign until it is offered and finish it. The all-caps stylised title gives no mechanical clue, so go in prepared for anything: full health, armour and a varied weapon wheel. Like the other named-mission trophies on this list, it sits on the main path and pops automatically at the mission-complete screen.`,
  12: `VCIA Takedown is a named story mission built around Vice City International Airport — VCIA turns up elsewhere on this list too. Progress the story to unlock it, expect vehicles and possibly aircraft to be involved given the setting, and finish the mission to pop the trophy. Keep a manual save beforehand if you would like to replay it for fun later.`,
  13: `Operation Savage Glory is a named story operation; play the campaign through to it and complete every objective. 'Operation' missions in this series are usually multi-stage set-pieces against heavy opposition, so bring your best weapons and armour, use Combat Focus when groups bunch up, and top up your supplies between stages whenever the game gives you the chance.`,
  14: `The big one. The in-game 100% checklist — in the pause menu or progress screen — is the law: story missions, stranger strands, activities, collectibles, exploration and miscellany all feed it. Work through this guide section by section, use the tracker here to tick off the countable grinds, and check the game's own percentage often so you can spot which category is lagging. Save the last few percent for a calm session; this gold rarely pops by accident.`,
  15: `Stunt spots are scattered across Leonida: ramps, billboards, rooftops and dock cranes are the usual suspects. The counter in this tracker runs to 250, so treat it as a marathon, not a sprint — clear a handful whenever you pass a new district, use a fast bike or a light sports car for control in the air, and land on all wheels, because a crashed landing usually does not count. If a jump keeps failing, approach slower: most stunt spots are about the landing zone, not raw speed.`,
  16: `Open the map's activity legend and sample everything once: races, ranges, fishing, arcade games, meditation, hunting and whatever else Leonida offers. You only need to TRY each type, not win or complete it, so this is a cheap early trophy — spend one free-roam session touring the icons and starting each activity a single time. Stage 5 of the roadmap lists the activity trophies that grow out of these first tries.`,
  17: `Every shooting range challenge, gold-medalled. Our tracker counts 42 range challenges across Leonida's ranges, the figure community databases list for a full set; if the in-game list differs, trust the range's own menu — gold is what matters, not the count. Learn each weapon class on its own range, value accuracy bonuses over raw speed, and retry immediately while the target patterns are fresh. If a gold stays stubborn, come back when your shooting stats and weapon unlocks are maxed.`,
  18: `Find every Top Fun drone race start point and win each one at least once. Drone racing rewards smooth lines over full throttle: feather the turns, learn each course with a sighting lap, and only then push for the win. Because the trophy needs EVERY location, work the map district by district and tick locations off here as you clear them, so no start point hides forgotten in the Keys or the swamps.`,
  19: `Twenty DIFFERENT races — repeating the same easy circuit twenty times will not move this counter. Leonida's race series (street, off-road, water and air, if past games are a guide) each count separately, so tour the map and enter every distinct event once, then fill any remaining wins with whichever series suits your driving best. Winning pays as well as counting, so this grind partly funds the spending trophies.`,
  20: `Cal is one of Leonida's fishing contacts; find his challenge — fishing spots are usually marked near piers, lakes and the Keys — and out-fish him. Expect the challenge to be scored on weight or number of fish within a limit: use the best rod and bait you have unlocked, cast where the water ripples or shadows move, and play each fish patiently instead of reeling flat-out and snapping the line. If you lose, upgrade your tackle and challenge him again.`,
  21: `Find an arcade cabinet — bars, boardwalks and hangout spots are the classic places — and play one of its games through to completion; a full run, win or lose, should count, and if it does not, finish with a win. This is one of the cheapest trophies on the list and a good early tick while you are exploring Vice City's nightlife for the first time.`,
  22: `Andy is a stranger with his own mission strand. Do every Andy job as it appears on the map until his strand ends; the trophy pops on his FINAL mission, so if it has not popped, you have not finished — check the strand list in the pause menu. Stranger strands sometimes gate behind story progress, so if Andy goes quiet, advance the campaign and check the map again.`,
  23: `Kenton's strand ends with this trophy. Work through each Kenton mission as it unlocks; the boat-accident title hints his story involves the water, so brush up on boat handling and keep a fast boat handy for the late strand. As with all the named-contact trophies, 'final mission' means the strand's last job — if the trophy has not popped, more Kenton work is waiting somewhere on the map.`,
  24: `Billy's strand is themed around riding solo, if the title is anything to go by — expect bikes. Complete every Billy mission until the strand closes and the trophy pops on the final one. Motorcycle jobs reward a rider who brakes early and leans into corners rather than bouncing off traffic, so keep a nimble bike upgraded for the later, harder runs.`,
  25: `Eight full stranger strands, start to finish — not eight individual missions. Andy, Kenton, Billy, Randy, Tyrone and Bret elsewhere on this list are six of them, so finishing the named-contact trophies gets you most of the way; the remaining strands belong to strangers without a trophy of their own. Use the pause menu's strand tracker to see which strands are open, and finish strands rather than sampling many, because only completed strands count toward the eight.`,
  26: `Randy's strand is about moving product, judging by the title: expect delivery and pickup work, possibly against the clock or under heat. Finish every Randy job until his final mission completes and the trophy pops. If a delivery run keeps failing, scout the route in free roam first and pick a vehicle with room for the cargo and enough speed to outrun trouble.`,
  27: `Complete Tyrone's whole strand; the trophy lands on his final mission. Tyrone's jobs are unknown until the game is out, so go in with a flexible garage and full supplies. If his missions stop appearing, progress the main story — stranger strands in this series commonly pause until a chapter gate is passed, then resume with a phone call or a fresh map marker.`,
  28: `Meditation spots are the quiet collectible: scenic overlooks, beaches, hilltops and dock ends where you stop and breathe instead of causing mayhem. You need EVERY spot, so sweep region by region and mark them off with this tracker; the spots are easy to walk straight past because nothing about them shouts. If the game gives an ambient cue — the music softening, a prompt to sit — trust it and interact.`,
  29: `Bret is the hunting contact, and his strand builds to a unique animal — a specific legendary creature rather than a species. Prepare properly: learn the tracking and hunting basics on ordinary game first, bring the right calibre and bait, and follow Bret's clues into the unique animal's territory. Unique-animal hunts in open-world games are usually one-shot encounters, so make a manual save before the final hunt in case it goes wrong.`,
  30: `Collectible cards hide across Leonida in themed sets; finishing any THREE full sets pops this silver. Cards reward slow exploration: check bars, motels, lifeguard stands, rooftops and interiors, and listen for the audio cue games like this usually give near a collectible. Use this tracker set by set rather than grabbing strays at random — a set at ninety percent is worth finishing before you start another.`,
  31: `WAiNK — whatever the in-game service turns out to be; the name suggests a photo or check-in app in Leonida's social-media scene — must be used at 100 different locations. This is a pure coverage grind: make a habit of it whenever you arrive somewhere new, and sweep the map district by district with this tracker late in the game to find the gaps. Because locations likely include interiors and landmarks, it pairs naturally with the exploration trophy, The Goodtime State.`,
  32: `Fifty challenges from the game's challenge list — the pause menu usually tracks them: driving feats, combat feats, exploration feats and the like. Most complete themselves as you play the rest of this list, because stunts, races, robberies and headshots all feed challenge counters. Check the list at eighty percent completion and deliberately farm only the stragglers; this tracker counts them, and the game's own list is the referee.`,
  33: `A duo trophy: with your partner character riding with you, earn a four-star wanted level, then break line of sight and let it drain completely without being busted or wasted. Our tracker counts the stars you reach with your partner aboard. Open ground outside the city, a fast car, and a change of vehicle once the search begins are the classic recipe; if the game treats entering a safehouse mid-search as not escaping, stay out until the stars are gone.`,
  34: `Three shop robberies in one unbroken wanted streak, with your partner along. Plan a route of three stores close together — a Vice City strip is ideal — rob the first, keep the wanted level alive between stores rather than letting it fully drain, and hit the next two before escaping for good. Your partner's presence is required, so attempt it during a free-roam stretch where both characters are together, and bring a fast, durable car for the final getaway.`,
  35: `Discover — usually meaning get in and drive, or at least enter — 100 different vehicles. Traffic variety differs by district and time of day: rich areas spawn sports cars, the docks spawn trucks, the Keys spawn boats. Steal broadly as you travel, check parking lots and marinas, and let this tracker count them. Rare models — supercars, aircraft, service vehicles — are the usual stragglers; a vehicle's first drive is what registers it, so do not just look at them.`,
  36: `Combat Focus is this game's name for its slow-motion aiming ability. Charge it fully, pick a spot where at least five enemies cluster — a gang hideout, a robbery gone loud, a story ambush — activate it, and drop five before it runs out; headshots conserve the meter in most implementations. If you keep getting four, soften a group up first, or wait for a bigger late-story set-piece where enemies arrive in waves.`,
  37: `An 'unscheduled departure' from Vice City International Airport sounds like stealing an aircraft outside a mission — or a story moment you can play straight past. We flag this trophy as possibly missable (unconfirmed inference, reasoned from the official description quoted on the missables page): if it is a story beat, it happens once. Try it in free roam first — enter VCIA, take an aircraft that is not yours, and take off. If nothing pops, it belongs to a specific mission, so keep a save before airport story missions.`,
  38: `Honestly cryptic. The official description — 'Kinda hot in these Rhinos' — only tells us the Rhino, this series' tank, is involved, and that something about heat matters. Guesses include surviving inside a Rhino at a high wanted level, destroying a number of vehicles in one, or enduring Leonida's heat in it on a blazing day. We will not invent steps we cannot support: when the game is out, experiment around Rhinos under pressure and check back. For now, a Rhino on a long wanted rampage is the most literal reading of the words we have.`,
  39: `A stealth robbery: enter a jewelry store, take the goods and leave without the alarm or the detection state ever triggering. Learn the store's layout and its guard or camera positions on a legitimate visit first, use a silenced approach if the game allows one, wear whatever the game counts as a disguise, and move slowly — detection systems usually forgive a glimpse but not a stare. Save outside the store so a blown attempt costs you nothing.`,
  40: `Five full bank vault robberies, each ending in a successful escape — starting the robbery is not enough. Banks are endgame-grade targets: bring armour, heavy weapons, a planned exit vehicle and preferably your partner or crew. Spread the five across the map's banks rather than repeating one, in case repeats do not count, and let the heat fully clear between jobs. This tracker counts clean getaways only.`,
  41: `Armoured trucks patrol Leonida's roads on set routes, and the 'blitz play' is the classic ambush: block the truck, deal with the doors — explosives, or the method the game teaches — grab the cash and escape the response. Scout a truck's route in free roam, pick a choke point near a fast escape road or a tunnel, and strike when traffic is light. The trophy needs the escape, not just the loot, so save something fast for the getaway.`,
  42: `Full map exploration: every region of the state uncovered. Exploration usually registers by physically visiting an area, not by seeing it from a plane at altitude, so tour by road and boat — Vice City's districts, the Keys, the swamps, the farmland and the coast. Our tracker counts the percentage of the map revealed; the last stubborn percent is usually a tiny island, an interior or a mountain top, so sweep the edges of the fog systematically at the end.`,
  43: `Every gang's illegal operation, robbed once each. First learn the gang map: whose turf is whose, and what each gang's operation looks like — labs, chop shops, fronts. Robbing one gang's operation likely angers that gang, so vary your order and expect retaliation in their territory afterwards. If you cannot tell the gangs apart yet, progress the story; the campaign usually introduces each faction in turn.`,
  44: `The official description — 'Enjoy a cocktail with a view on Ocean Beach' — sounds like a small story or date moment rather than free-roam behaviour, which is why we flag this trophy as possibly missable (unconfirmed inference, reasoned from the description quoted on the missables page). Do it early: when the story first takes you to Ocean Beach, look for the bar or the partner interaction and have the drink. If you are past that point, check the beachfront bars in free roam for a cocktail prompt with your partner before assuming it is gone.`,
  45: `Find a vehicle showroom with a glass frontage, get inside with a car, and drive out THROUGH the glass 'in classic style' — a loving nod to a famous moment in this series' past. If driving politely out of the door does not pop it, you need the smash: build speed inside the showroom and exit through the window. Any showroom car should do; use one already inside, so you are not fighting the doorway with a vehicle that does not fit.`,
  46: `A bowling trophy at a named alley — Kolt & Associates. 'Follow-through' is bowling language for the arm swing after release, so expect a mini-game objective: bowl at the alley and complete whatever the follow-through prompt asks — a full game, a strike, or a technique challenge; the description does not say. Visit the alley, start a game, and play it properly rather than quitting after one frame; if a specific feat is required, the alley's own challenge list will show it.`,
  47: `Another cryptic one. 'A partnership with mass appeal', under the title Personal Best, suggests a record set together — a best time, score or streak achieved as a duo, possibly in a public or streamed setting, which is where the 'mass appeal' would come from. We cannot honestly narrow it further from the words alone. Working hypotheses once the game is out: set a personal best in a co-operative activity with your partner, or beat a partner-related record. Whenever the game shows a 'personal best' banner while you play as or with your partner, you are probably close.`,
  48: `This tracks the story's choice system: our counter runs to 500 choices, the figure community databases associate with the full set of recorded decisions — if the in-game tally differs, trust the game. Because choices made 'for better or worse' cannot be un-made, we flag this trophy as possibly missable in spirit (unconfirmed inference): you cannot replay a branch you did not take without an older save. Keep rotating manual saves at chapter starts so choice-dependent content stays reachable.`,
  49: `Cryptic, and flagged. 'Second time's the charm' implies failing or missing something once, then succeeding — or an event that only happens on a second attempt, a second visit, or a second run at a moment. Because a first attempt cannot be un-done, we flag this trophy as possibly missable (unconfirmed inference, reasoned from the official description quoted on the missables page). Practical advice: when something goes wrong in a mission or activity, retry it immediately rather than moving on — the second attempt is the natural place for this to pop.`,
  50: `The description — 'What the hell just happened?' — is a reaction, not an instruction: this is the series' traditional weird-event trophy. A UFO, a ghost, a bizarre random encounter in the Leonida night. We will not invent a location for it. Practical approach: explore remote places — swamps, the Keys, high ground — at night, follow up any strange lights or sounds, and interact with anything the game lets you photograph or approach. When something genuinely inexplicable happens, this should pop.`,
  51: `Run people down with a melee attack from a moving vehicle — 'bowl 'em over' — most likely in or near the bowling setting the joke points at. A melee drive-by means attacking from the driver's or passenger's seat at close range as you pass, not shooting. Find a group of pedestrians — the pavement outside Kolt & Associates' bowling alley is the thematic spot — drive past at moderate speed and swing; too fast and you simply run them over, which may not count as melee. Ten pins is the joke: one solid pass through a crowd should do it.`,
  52: `Marked bills come from robberies; laundering them through your contacts converts dirty cash to clean at a cut. This is a cumulative earnings target — $250,000 of laundered money across the whole game. Build the habit early: route every stack of marked bills through your contacts rather than spending it raw, and let the big scores — bank vaults, the cartel heist — feed the pipeline. The tracker counts dollars laundered; expect this to finish late unless you grind robberies on purpose.`,
  53: `Spend a cumulative $100,000 in shops: clothes, weapons, vehicles, modifications, food, services — everything counts, if past games are a guide. You will pass this naturally if you buy garages, cars and upgrades rather than hoarding cash; if you finish the story short of the mark, a vehicle-shopping spree closes the gap in minutes. The tracker counts shop spending only, and whether property purchases count depends on the game's own rules — the in-game statistic is the referee.`,
  54: `Buy every garage property on the map. Our tracker counts 8 garage properties across Leonida, the number community databases list; the in-game property map is the referee if it differs. Garages are bought with clean money, and some may gate behind story progress or income, so this pairs with the laundering and spending grinds: earn dirty, launder it, buy property. Buy them as they become affordable rather than in one endgame spree, because garage space helps the vehicle collection anyway.`,
  55: `The Scooter Bros app is Leonida's vehicle-registration service — an in-game phone app, most likely — and this trophy asks you to register 10 vehicles to it. Register the cars you actually keep, your daily drivers and favourites, rather than random traffic, because registration probably involves a fee or a short process at a set location. If registration happens automatically when you store a vehicle in a garage, this pops quietly during the Little Boxes grind; check the app after every new purchase.`,
};

// Numeric targets the tracker counts toward. `target` is the number the
// official description (or, where the description gives no figure, the
// community databases) sets; `unit` labels the counter in the interface.
export const TARGETS = {
  14: { target: 100, unit: '%', label: 'completion' },
  15: { target: 250, unit: 'stunts', label: 'stunts completed' },
  17: { target: 42, unit: 'golds', label: 'range gold medals' },
  19: { target: 20, unit: 'races', label: 'different races won' },
  25: { target: 8, unit: 'strands', label: 'stranger strands completed' },
  30: { target: 3, unit: 'sets', label: 'card sets completed' },
  31: { target: 100, unit: 'locations', label: 'WAiNK locations' },
  32: { target: 50, unit: 'challenges', label: 'challenges completed' },
  33: { target: 4, unit: 'stars', label: 'wanted stars reached with partner' },
  34: { target: 3, unit: 'shops', label: 'shops robbed back-to-back' },
  35: { target: 100, unit: 'vehicles', label: 'vehicles discovered' },
  36: { target: 5, unit: 'takedowns', label: 'takedowns in one Combat Focus' },
  40: { target: 5, unit: 'vaults', label: 'bank vaults robbed and escaped' },
  42: { target: 100, unit: '%', label: 'of Leonida explored' },
  48: { target: 500, unit: 'choices', label: 'choices made' },
  52: { target: 250000, unit: '$', label: 'laundered through contacts' },
  53: { target: 100000, unit: '$', label: 'spent across all shops' },
  54: { target: 8, unit: 'garages', label: 'garage properties bought' },
  55: { target: 10, unit: 'vehicles', label: 'vehicles registered' },
};

// The four trophies we flag as possibly missable. This is an unconfirmed
// inference reasoned from each trophy's official description — the app shows
// the quoted description beside the reasoning and labels it as inference,
// never as fact. The quote itself is read from data/trophies.json at runtime.
export const MISSABLES = [
  {
    id: 37,
    why: `An unscheduled departure sounds like a one-off story beat at the airport as much as a free-roam stunt; if it is scripted, it can only happen when the story offers it.`,
  },
  {
    id: 44,
    why: `A cocktail with a view reads like a small scripted moment — a date or a story beat on Ocean Beach — rather than something a bar sells in free roam, so it may exist only when the story stages it.`,
  },
  {
    id: 48,
    why: `Choices, once made, cannot be un-made inside one save file; any choice-dependent outcome on the untaken branch is unreachable without an older save.`,
  },
  {
    id: 49,
    why: `'Second time's the charm' implies a first attempt that fails or passes; if that first attempt is a one-time event, the second chance may never be offered again.`,
  },
];

// Seven stages to the platinum. Together they list every trophy id from 1 to
// 55 exactly once; the unit checks hold them to that.
export const ROADMAP = [
  {
    title: 'Touchdown in Leonida',
    note: `The opening hours: the first missions, and the Ocean Beach cocktail while the story is still serving it — it is missable-flagged, so drink early.`,
    ids: [2, 3, 8, 44],
  },
  {
    title: 'Chapters 2 to 4',
    note: `The middle of the campaign. Keep rotating saves at chapter starts; the choice tracker is quietly counting everything you decide.`,
    ids: [4, 5, 6, 10, 11],
  },
  {
    title: 'Heists and heat',
    note: `The story's set-pieces and the free-roam crime that mirrors them. Learn the robbery craft here — banks in stage 6 assume you have.`,
    ids: [9, 12, 13, 33, 34, 36, 39, 41, 45],
  },
  {
    title: 'Strangers and final favours',
    note: `Every named contact's strand, finished rather than sampled. Six of these strands also carry the Strangers & Freaks silver most of the way.`,
    ids: [22, 23, 24, 25, 26, 27, 29, 48],
  },
  {
    title: 'Leonida pastimes',
    note: `The activity card: stunts, ranges, races, fishing, arcade and bowling. Sample everything once for Master of None, then go back and master the ones with counters.`,
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 46, 51],
  },
  {
    title: 'Working the whole state',
    note: `Coverage and craft: cards, check-ins, challenges, vehicles, gangs, banks and the map itself — plus the three cryptic trophies, which only experimentation will solve.`,
    ids: [30, 31, 32, 35, 37, 38, 40, 42, 43, 47, 49, 50, 55],
  },
  {
    title: 'Money, finale and platinum',
    note: `The economy endgame — launder, spend, buy every garage — then the final mission, the 100% checklist, and the platinum that follows them.`,
    ids: [1, 7, 14, 52, 53, 54],
  },
];
