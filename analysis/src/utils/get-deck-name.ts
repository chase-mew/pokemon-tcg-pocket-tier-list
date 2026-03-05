import cardToString from "./card-to-string";
import { Deck } from "./types";
import formatName from "./format-name";

type CardNameType = string | string[];

interface Architype {
  primary: CardNameType;
  secondary: CardNameType[];
}

const VENUSAUR = ["Mega Venusaur ex B1a 4", "Venusaur ex A1 4", "Venusaur B1a 3", "Venusaur A1 3"];
const CHARIZARD = ["Mega Charizard Y ex B1a 14", "Charizard ex A2b 10", "Charizard ex A1 36", "Charizard B1a 13", "Charizard A1 35"]
const BLASTOISE = ["Blastoise ex A1 56", "Mega Blastoise ex B1a 20", "Blastoise A1 55", "Blastoise B1a 19"]
const GRENINJA = ["Greninja A1 89", "Greninja ex B1 73"]
const ALTARIA = ["Mega Altaria ex B1 102", "Altaria A4a 55", "Altaria B1 197"]
const MAGNEZONE = ["Magnezone A2 53", "Magnezone B1a 26"]
const ESPEON = ["Espeon ex A4 83", "Espeon A3b 28"]
const GUZZLORD = ["Guzzlord ex A3a 43", "Guzzlord B2 109"]
const BUZZWOLE = ["Buzzwole ex A3a 6", "Buzzwole B2 14"]
const DECIDUEYE = ["Decidueye ex A3 12", "Decidueye A3a 5"]
const ALOLAN_NINETALES = ["Alolan Ninetales ex B2 29", "Alolan Ninetales A3 41"]
const POISON = ["Poison Barb A3 146", "Nihilego A3a 42"]
const ORICORIO = ["Oricorio A3 66", "Pichu A4 66"]
const MEGA_KANGASKHAN = ["Mega Kangaskhan ex B2 127", "Serena B1a 69", "Ilima A3 149"]
const MEGA_MAWILE = ["Mega Mawile ex B2 113", "Serena B1a 69"]
const MEOWSCARADA = ["Meowscarada ex B2a 3", "Meowscarada A2b 7"]

const ARCHITYPES: Architype[] = [
  // Outliers
  { primary: "Ditto B1a 55", secondary: ["Rampardos A2 89", "Liepard B1a 48", MAGNEZONE, "Maushold B2 143"] },

  // Stage 2 Mega
  { primary: "Mega Swampert ex B2 36", secondary: [] },
  { primary: "Mega Gardevoir ex B2 66", secondary: ["Latias A4a 36", "Sylveon ex A3b 34"] },
  { primary: VENUSAUR, secondary: ["Exeggutor ex A1 23", "Dustox B1 7", "Lilligant B1 18"] },
  { primary: CHARIZARD, secondary: [] },
  { primary: BLASTOISE, secondary: [] },
  { primary: "Mega Blaziken ex B1 36", secondary: [] },
  { primary: "Mega Ampharos ex B1 85", secondary: ["Alolan Raichu B2 50"] },

  // Stage 2 ex
  { primary: "Crobat ex A4 109", secondary: [POISON] },
  { primary: "Incineroar ex A3 33", secondary: [] },
  { primary: "Lunala ex A3 87", secondary: [] },
  { primary: DECIDUEYE, secondary: [] },
  { primary: "Gigalith ex A2 94", secondary: [] },
  { primary: "Solgaleo ex A3 122", secondary: ["Galarian Perrserker B2 111"] },
  { primary: "Lunala ex A3 87", secondary: [] },
  { primary: MEOWSCARADA, secondary: [] },

  // Stage 2
  { primary: "Chandelure B2 69", secondary: [] },
  { primary: "Galarian Obstagoon B2 100", secondary: [] },
  { primary: "Dusknoir A2 72", secondary: [MEGA_MAWILE, "Mega Absol ex B1 151", ALTARIA] },
  { primary: "Rampardos A2 89", secondary: ["Donphan ex A4 100"] },
  { primary: "Tyrantrum B2 90", secondary: [] },
  { primary: "Slaking B2 136", secondary: [] },
  { primary: "Baxcalibur B2a 36", secondary: [] },
  { primary: "Annihilape B2a 56", secondary: ["Mega Lopunny ex B1a 42"] },

  // Stage 1 Mega
  { primary: "Mega Medicham ex PB 29", secondary: [] },
  { primary: ALTARIA, secondary: ["Sylveon ex A3b 34", "Gourgeist B2 72", "Aegislash B1 172", GRENINJA] },
  { primary: "Mega Gyarados ex B1 52", secondary: ["Jellicent B1 69"] },
  { primary: "Mega Lopunny ex B1a 42", secondary: [MAGNEZONE, "Lucario A2 92", GRENINJA] },
  { primary: "Mega Steelix ex B1a 52", secondary: [] },

  // Stage 1 ex
  { primary: "Lugia ex A4 149", secondary: ["Ho-Oh ex A4 34"] },
  { primary: "Jolteon ex B1 81", secondary: ["Jolteon A3b 25", MAGNEZONE] },
  { primary: "Leafeon ex A2a 10", secondary: [] },
  { primary: ALOLAN_NINETALES, secondary: ["Crawdaunt A4 61"] },
  { primary: "Dragalge ex B1 160", secondary: [] },
  { primary: "Armarouge ex B2a 20", secondary: [] },
  { primary: "Bellibolt ex B2a 42", secondary: [MAGNEZONE] },
  { primary: "Gholdengo ex B2a 78", secondary: [] },

  // Stage 1
  { primary: "Hydreigon B1 157", secondary: [POISON] },
  { primary: ESPEON, secondary: [] },
  { primary: "Crobat A2a 50", secondary: [] },
  { primary: "Silvally A3a 61", secondary: [ORICORIO] },
  { primary: "Ariados B1a 6", secondary: ["Whimsicott ex B1 16"] },
  { primary: "Galarian Perrserker B2 111", secondary: [MEGA_MAWILE] },
  { primary: "Houndstone B2a 53", secondary: ["Gourgeist B2 72"] },
  { primary: "Gourgeist B2 72", secondary: [] },

  // Basic Mega
  { primary: MEGA_KANGASKHAN, secondary: [MAGNEZONE, GRENINJA, POISON, ORICORIO] },
  { primary: MEGA_MAWILE, secondary: [] },

  // Basic ex
  { primary: "Suicune ex A4a 20", secondary: [GRENINJA] },
  { primary: "Darkrai ex A2 110", secondary: ["Giratina ex A2b 35"] },
  { primary: GUZZLORD, secondary: [POISON] },
  { primary: BUZZWOLE, secondary: [] },
  { primary: "Mega Absol ex B1 151", secondary: [GRENINJA] },
  { primary: "Mimikyu ex B2 73", secondary: [GRENINJA, "Giratina ex A2b 35"] },
  { primary: "Chien-Pao ex B2a 37", secondary: [] },

  // Basic
  { primary: "Celesteela A3a 62", secondary: [] },

  // Tech Cards
  { primary: MAGNEZONE, secondary: [ORICORIO] },
  { primary: GRENINJA, secondary: [ORICORIO] },

  // Fallback
  { primary: "Professor's Research PA 7", secondary: [] },
];

// const DECK_NAMES: DeckNameType[] = [
//   // Doubles
//   ["Ditto B1a 55", "Liepard B1a 48"],
//   ["Ditto B1a 55", "Magneton A1 98"],

//   ["Mega Kangaskhan ex B2 127", "Gengar A1 122"],

//   ["Toxtricity ex B2 55", "Zeraora A3a 21"],
//   ["Toxtricity ex B2 55", "Pichu A4 66"],

//   ["Mega Lopunny ex B1a 42", "Lucario A2 92"],
//   ["Mega Lopunny ex B1a 42", "Magneton A1 98"],

//   ["Mimikyu ex B2 73", "Giratina ex A2b 35"],
//   ["Mimikyu ex B2 73", "Indeedee ex B1 121"],

//   ["Alolan Ninetales ex B2 29", "Froakie B1 71"],
//   ["Alolan Ninetales ex B2 29", "Crawdaunt A4 61"],

//   ["Tyrantrum B2 90", "Hitmonchan ex B1 124"],

//   ["Magneton A1 98", "Heliolisk B1a 29"],
//   ["Magneton A1 98", "Oricorio A3 66"],

//   ["Whimsicott ex B1 16", "Ariados B1a 6"],
//   ["Ariados B1a 6", "Kartana A3a 8"],

//   ["Mega Steelix ex B1a 52", "Oricorio A3 66"],
//   ["Mega Steelix ex B1a 52", "Dialga ex A2 119"],
//   ["Mega Steelix ex B1a 52", "Indeedee ex B1 121"],
//   ["Mega Steelix ex B1a 52", "Pichu A4 66"],
//   ["Mega Steelix ex B1a 52", "Mantyke A4a 23"],

//   ["Ditto B1a 55", "Rampardos A2 89"],
//   ["Ditto B1a 55", "Archeops B1 134"],

//   ["Archeops B1 134", "Rampardos A2 89"],
//   ["Rampardos A2 89", "Primeape A1a 42"],

//   ["Gengar A1 122", "Indeedee ex B1 121"],
//   ["Rillaboom B1 27", "Serperior A1a 6"],
//   ["Porygon-Z A4 137", "Indeede ex B1 121"],
//   ["Porygon-Z A4 137", "Chingling B1 109"],
//   ["Goodra B1 179", "Indeedee ex B1 121"],
//   ["Goodra B1 179", "Mantyke A4a 23"],

//   ["Mega Blaziken ex B1 36", "Heatmor B1 44"],
//   ["Mega Blaziken ex B1 36", "Entei ex A4a 10"],
//   ["Mega Blaziken ex B1 36", "Oricorio B2 22"],
//   ["Mega Blaziken ex B1 36", "Cleffa A4 77"],

//   ["Mega Altaria ex B1 102", "Goodra B1 179"],
//   ["Mega Altaria ex B1 102", "Dusknoir A2 72"],
//   ["Mega Altaria ex B1 102", "Galarian Cursola A4a 35"],
//   ["Mega Altaria ex B1 102", "Magnezone A2 53"],
//   ["Mega Altaria ex B1 102", "Shiinotic A3a 27"],
//   ["Mega Altaria ex B1 102", "Silvally A3a 61"],
//   ["Mega Altaria ex B1 102", "Sylveon ex A3b 34"],
//   ["Mega Altaria ex B1 102", "Greninja A1 89"],

//   ["Mega Pinsir ex B1 2", "Leafeon ex A2a 10"],
//   ["Mega Pinsir ex B1 2", "Simisage B1 14"],
//   ["Mega Pinsir ex B1 2", "Pichu A4 66"],

//   ["Mega Gyarados ex B1 52", "Milotic A4a 22"],
//   ["Mega Gyarados ex B1 52", "Jellicent B1 69"],

//   ["Mega Ampharos ex B1 85", "Oricorio A3 66"],
//   ["Mega Ampharos ex B1 85", "Zeraora A3a 21"],
//   ["Mega Ampharos ex B1 85", "Pichu A4 66"],

//   ["Jolteon ex B1 81", "Jolteon A3b 25"],
//   ["Jolteon ex B1 81", "Leafeon ex A2a 10"],
//   ["Jolteon ex B1 81", "Magnezone A2 53"],

//   ["Dragalge ex B1 160", "Absol A4 120"],
//   ["Dragalge ex B1 160", "Nihilego A3a 42"],
//   ["Honchkrow B1 149", "Snorlax A2a 63"],
//   ["Honchkrow B1 149", "Darkrai ex A2 110"],
//   ["Honchkrow B1 149", "Pichu A4 66"],
//   ["Honchkrow B1 149", "Magby A4 32"],
//   ["Indeedee ex B1 121", "Oricorio A3 66"],
//   ["Rampardos A2 89", "Snorlax ex A3b 57"],
//   ["Snorlax ex A3b 57", "Indeede ex B1 121"],
//   ["Rampardos A2 89", "Snorlax A2a 63"],
//   ["Espeon ex A4 83", "Indeedee ex B1 121"],
//   ["Melmetal ex B1 174", "Dialga ex A2 119"],
//   ["Rampardos A2 89", "Hitmonchan ex B1 124"],
//   ["Victreebel A1 20", "Chingling B1 109"],
//   ["Golem A1a 45", "Indeedee ex B1 121"],
//   ["Infernape ex A2 29", "Heatmor B1 44"],
//   ["Meowscarada A2b 7", "Pheromosa A3a 7"],
//   ["Guzzlord ex A3a 43", "Delcatty B1 194"],
//   ["Rampardos A2 89", "Delcatty B1 194"],
//   ["Meowscarada A2b 7", "Leafeon ex A2a 10"],
//   ["Infernape ex A2 29", "Magnezone A2 53"],
//   ["Galarian Cursola A4a 35", "Giratina ex A2b 35"],
//   ["Decidueye ex A3 12", "Decidueye A3a 5"],
//   ["Decidueye ex A3 12", "Chingling B1 109"],
//   ["Decidueye A3a 5", "Chingling B1 109"],
//   ["Garchomp ex A2a 47", "Donphan ex A4 100"],
//   ["Raikou ex A4a 25", "Alolan Raichu A4 66"],
//   ["Raikou ex A4a 25", "Luxray A2 60"],
//   ["Raikou ex A4a 25", "Magnezone A2 53"],
//   ["Raikou ex A4a 25", "Arceus ex A2a 71"],
//   ["Raikou ex A4a 25", "Electivire A2 57"],
//   ["Raikou ex A4a 25", "Tapu Koko ex A3a 19"],
//   ["Raikou ex A4a 25", "Oricorio A3 66"],
//   ["Raikou ex A4a 25", "Zeraora A3a 21"],
//   ["Weavile ex A2 99", "Weezing A1 177"],
//   ["Gyarados ex A1a 18", "Giratina ex A2b 35"],
//   ["Giratina ex A2b 35", "Darkrai ex A2 110"],
//   ["Leafeon ex A2a 10", "Irida A2a 72"],
//   ["Kabutops A1 159", "Primeape A1 142"],
//   ["Garchomp ex A2a 47", "Lucario A2 92"],
//   ["Garchomp ex A2a 47", "Aerodactyl ex A1a 46"],
//   ["Garchomp ex A2a 47", "Arceus ex A2a 71"],
//   ["Garchomp ex A2a 47", "Rampardos A2 89"],
//   ["Heatran A2a 13", "Magnezone A2 53"],
//   ["Arceus ex A2a 71", "Magnezone A2 53"],
//   ["Arceus ex A2a 71", "Greninja A1 89"],
//   ["Infernape ex A2 29", "Heatran A2a 13"],
//   ["Infernape ex A2 29", "Turtonator A3 37"],
//   ["Bronzong A2a 59", "Magnezone A2 53"],
//   ["Bronzong A2a 59", "Skarmory A2 111"],
//   ["Abomasnow A2a 21", "Arceus ex A2a 71"],
//   ["Probopass ex A2a 57", "Dialga ex A2 119"],
//   ["Glaceon ex A2a 22", "Manaphy A2 50"],
//   ["Leafeon ex A2a 10", "Yanmega ex A2 7"],
//   ["Arceus ex A2a 71", "Dialga ex A2 119"],
//   ["Dialga ex A2 119", "Shaymin A2 22"],
//   ["Darkrai ex A2 110", "Arceus ex A2a 71"],
//   ["Crobat A2a 50", "Arceus ex A2a 71"],
//   ["Lapras ex PA 14", "Greninja A1 89"],
//   ["Leafeon ex A2a 10", "Celebi ex A1a 3"],
//   ["Scolipede A1a 55", "Weezing A1 177"],
//   ["Articuno ex A1 84", "Greninja A1 89"],
//   ["Hitmonlee A1 154", "Greninja A1 89"],
//   ["Blastoise ex A1 56", "Weezing A1 177"],
//   ["Blastoise ex A1 56", "Manaphy A2 50"],
//   ["Marowak ex A1 153", "Magnezone A2 53"],
//   ["Starmie ex A1 76", "Greninja A1 89"],
//   ["Pikachu ex A1 96", "Electrode A1 100"],
//   ["Marowak ex A1 153", "Primeape A1a 42"],
//   ["Alakazam A1 117", "Weezing A1 177"],
//   ["Darkrai ex A2 110", "Magnezone A2 53"],
//   ["Palkia ex A2 49", "Greninja A1 89"],
//   ["Darkrai ex A2 110", "Greninja A1 89"],
//   ["Palkia ex A2 49", "Manaphy A2 50"],
//   ["Gliscor A2 84", "Lucario A2 92"],
//   ["Weavile ex A2 99", "Darkrai ex A2 110"],
//   ["Hitmonlee A1 154", "Magnezone A2 53"],
//   ["Yanmega ex A2 7", "Exeggutor ex A1 23"],
//   ["Mew ex A1a 32", "Greninja A1 89"],
//   ["Gyarados ex A1a 18", "Greninja A1 89"],
//   ["Gyarados ex A1a 18", "Manaphy A2 50"],
//   ["Gyarados ex A1a 18", "Vaporeon A1a 19"],
//   ["Gyarados ex A1a 18", "Druddigon A1a 56"],
//   ["Yanmega ex A2 7", "Dialga ex A2 119"],
//   ["Celebi ex A1a 3", "Serperior A1a 6"],
//   ["Rampardos A2 89", "Lucario A2 92"],
//   ["Rampardos A2 89", "Aerodactyl ex A1a 46"],
//   ["Darkrai ex A2 110", "Weezing A1 177"],
//   ["Celebi ex A1a 3", "Exeggutor ex A1 23"],
//   ["Skarmory A2 111", "Magnezone A2 53"],
//   ["Lucario A2 92", "Primeape A1a 42"],
//   ["Starmie ex A1 76", "Articuno ex A1 84"],
//   ["Dialga ex A2 119", "Magnezone A2 53"],
//   ["Articuno ex A1 84", "Magnezone A2 53"],
//   ["Aerodactyl ex A1a 46", "Primeape A1a 42"],
//   ["Lucario A2 92", "Primeape A1 142"],
//   ["Vaporeon A1a 19", "Articuno ex A1 84"],
//   ["Dialga ex A2 119", "Skarmory A2 111"],
//   ["Luxray A2 60", "Electivire A2 57"],
//   ["Luxray A2 60", "Oricorio A3 66"],
//   ["Bastiodon A2 114", "Skarmory A2 111"],
//   ["Magnezone A2 53", "Greninja A1 89"],
//   ["Infernape ex A2 29", "Moltres ex A1 47"],
//   ["Pikachu ex A1 96", "Zebstrika A1 106"],
//   ["Pikachu ex A1 96", "Pachirisu ex A2 61"],
//   ["Gallade ex A2 95", "Lucario A2 92"],
//   ["Gallade ex A2 95", "Hitmonlee A1 154"],
//   ["Starmie ex A1 76", "Magnezone A2 53"],
//   ["Melmetal A1 182", "Dialga ex A2 119"],
//   ["Palkia ex A2 49", "Magnezone A2 53"],
//   ["Aerodactyl ex A1a 46", "Lucario A2 92"],
//   ["Aerodactyl ex A1a 46", "Hitmonlee A1 154"],
//   ["Togekiss A2 65", "Mewtwo ex A1 129"],
//   ["Yanmega ex A2 7", "Wigglytuff ex A1 195"],
//   ["Wigglytuff ex A1 195", "Greninja A1 89"],
//   ["Starmie ex A1 76", "Vaporeon A1a 19"],
//   ["Weezing A1 177", "Arbok A1 165"],
//   ["Pikachu ex A1 96", "Raichu A1 95"],
//   ["Weezing A1 177", "Weavile ex A2 99"],
//   ["Pidgeot ex A1a 59", "Dialga ex A2 119"],
//   ["Togekiss A2 65", "Mismagius ex A2 67"],
//   ["Lucario A2 92", "Machamp ex A1 146"],
//   ["Dialga ex A2 119", "Lickilicky ex A2 125"],
//   ["Kangaskhan A1 203", "Greninja A1 89"],
//   ["Kingler A1 69", "Seaking A1 73"],
//   ["Lickilicky ex A2 125", "Greninja A1 89"],
//   ["Darkrai ex A2 110", "Druddigon A1a 56"],
//   ["Wormadam A2 115", "Skarmory A2 111"],
//   ["Empoleon A2 37", "Magnezone A2 53"],
//   ["Gallade ex A2 95", "Rampardos A2 89"],
//   ["Togekiss A2 65", "Magnezone A2 53"],
//   ["Rampardos A2 89", "Hitmonlee A1 154"],
//   ["Golem A1a 45", "Magnezone A2 53"],
//   ["Garchomp A2 123", "Kabutops A1 159"],
//   ["Garchomp A2 123", "Hitmonlee A1 154"],
//   ["Kangaskhan A1 203", "Magnezone A2 53"],
//   ["Heatran A2a 13", "Arceus ex A2a 71"],
//   ["Giratina ex A2b 35", "Mewtwo ex A1 129"],
//   ["Meowscarada A2b 7", "Carnivine A2a 9"],
//   ["Meowscarada A2b 7", "Exeggutor ex A1 23"],
//   ["Paldean Clodsire ex A2b 48", "Grafaiai A2b 51"],
//   ["Beedrill ex A2b 3", "Exeggutor ex A1 23"],
//   ["Wugtrio ex A2b 19", "Greninja A1 89"],
//   ["Wugtrio ex A2b 19", "Manaphy A2 50"],
//   ["Gholdengo A2b 57", "Dialga ex A2 119"],
//   ["Mesprit A2 76", "Uxie A2 75"],
//   ["Mesprit A2 76", "Uxie A2 75"],
//   ["Giratina ex A2b 35", "Gastly A1 120"],
//   ["Gallade ex A2 95", "Sudowoodo A2a 36"],
//   ["Honchkrow A2 97", "Greninja A1 89"],
//   ["Meowscarada A2b 7", "Magnezone A2 53"],
//   ["Tinkaton ex A2b 54", "Skarmory A2 111"],
//   ["Dragonite A1 185", "Giratina ex A2b 35"],
//   ["Dragonite A1 185", "Druddigon A1a 56"],
//   ["Exeggutor A1 22", "Carnivine A2a 9"],
//   ["Rampardos A2 89", "Pidgeot ex A1a 59"],
//   ["Lucario A2 92", "Sudowoodo A2a 36"],
//   ["Rotom A2a 35", "Carnivine A2a 9"],
//   ["Arcanine ex A1 41", "Moltres ex A1 47"],
//   ["Wugtrio ex A2b 19", "Starmie ex A1 76"],
//   ["Marowak ex A1 153", "Aerodactyl ex A1a 46"],
//   ["Rampardos A2 89", "Magnezone A2 53"],
//   ["Lucario A2 92", "Marshadow A1a 47"],
//   ["Magnezone A2 53", "Oricorio A3 66"],

//   ["Solgaleo ex A3 122", "Aegislash B1 172"],
//   ["Solgaleo ex A3 122", "Galarian Perrserker B2 111"],
//   ["Solgaleo ex A3 122", "Escavalier A3 120"],
//   ["Solgaleo ex A3 122", "Shiinotic A3a 27"],
//   ["Solgaleo ex A3 122", "Silvally A3a 617"],
//   ["Solgaleo ex A3 122", "Sylveon ex A3b 34"],
//   ["Solgaleo ex A3 122", "Scizor A4 123"],

//   ["Rampardos A2 89", "Lycanroc A3 101"],
//   ["Rampardos A2 89", "Kabutops A1 159"],
//   ["Crabominable ex A3 49", "Greninja A1 89"],
//   ["Crabominable ex A3 49", "Palkia ex A2 49"],
//   ["Beedrill ex A2b 3", "Beedrill A1 10"],
//   ["Lunala ex A3 87", "Giratina ex A2b 35"],


//   ["Wugtrio ex A2b 19", "Mantyke A4a 23"],
//   ["Pawmot A2b 28", "Oricorio A3 66"],
//   ["Wishiwashi ex A3 51", "Wishiwashi A3 50"],
//   ["Snorlax A2a 63", "Greninja A1 89"],
//   ["Snorlax A2a 63", "Giratina ex A2b 35"],
//   ["Wigglytuff A2b 61", "Greninja A1 89"],
//   ["Wigglytuff A2b 61", "Oricorio A3 66"],
//   ["Incineroar ex A3 33", "Silvally A3a 61"],
//   ["Incineroar ex A3 33", "Turtonator A3 37"],
//   ["Incineroar ex A3 33", "Oricorio A3 66"],
//   ["Pachirisu A2b 25", "Oricorio A3 66"],
//   ["Decidueye ex A3 12", "Lurantis A3 15"],
//   ["Dragonite A1 185", "Oricorio A3 66"],
//   ["Garchomp A2 123", "Greninja A1 89"],
//   ["Vikavolt A3 65", "Oricorio A3 66"],
//   ["Giratina ex A2b 35", "Tapu Lele A3 84"],
//   ["Carnivine A2a 9", "Arceus ex A2a 71"],
//   ["Giratina ex A2b 35", "Magnezone A2 53"],
//   ["Golduck A1 58", "Palkia ex A2 49"],
//   ["Pikachu ex A1 96", "Galvantula A1a 29"],
//   ["Pikachu ex A1 96", "Zapdos ex A1 104"],
//   ["Mismagius ex A2 67", "Tapu Lele A3 84"],
//   ["Gengar ex A1 123", "Tapu Lele A3 84"],
//   ["Alakazam A1 117", "Banette A3 75"],
//   ["Alolan Muk ex A3 111", "Grafaiai A2b 51"],
//   ["Paldean Clodsire ex A2b 48", "Weezing A1 177"],
//   ["Luxray A2 60", "Togedemaru A3 67"],
//   ["Zapdos ex A1 104", "Magnezone A2 53"],
//   ["Alolan Muk ex A3 111", "Toxapex A3 116"],
//   ["Melmetal A1 182", "Skarmory A2 111"],
//   ["Bastiodon A2 114", "Dialga ex A2 119"],
//   ["Rampardos A2 89", "Silvally A3a 61"],
//   ["Guzzlord ex A3a 43", "Naganadel A3a 45"],
//   ["Decidueye ex A3 12", "Pheromosa A3a 7"],
//   ["Naganadel A3a 45", "Darkrai ex A2 110"],
//   ["Naganadel A3a 45", "Nihilego A3a 42"],
//   ["Silvally A3a 61", "Zeraora A3a 21"],
//   ["Lycanroc ex A3a 33", "Hitmonlee A1 154"],
//   ["Pheromosa A3a 7", "Kartana A3a 8"],
//   ["Salazzle A3 36", "Nihilego A3a 42"],
//   ["Silvally A3a 61", "Greninja A1 89"],
//   ["Weezing A1 177", "Nihilego A3a 42"],
//   ["Silvally A3a 61", "Tapu Lele A3 84"],
//   ["Silvally A3a 61", "Oricorio A3 66"],
//   ["Stoutland A3a 56", "Giratina ex A2b 35"],
//   ["Stoutland A3a 56", "Tapu Lele A3 84"],
//   ["Gallade ex A2 95", "Stoutland A3a 56"],
//   ["Silvally A3a 61", "Blacephalon A3a 9"],
//   ["Garchomp A2 123", "Stoutland A3a 56"],
//   ["Decidueye ex A3 12", "Pheromosa A3a 7"],
//   ["Dusk Mane Necrozma PA 79", "Stakataka A3a 53"],
//   ["Dusk Mane Necrozma PA 79", "Celesteela A3a 62"],
//   ["Stakataka A3a 53", "Celesteela A3a 62"],
//   ["Silvally A3a 61", "Articuno ex A1 84"],
//   ["Stoutland A3a 56", "Silvally A3a 61"],
//   ["Rampardos A2 89", "Passimian A3a 34"],
//   ["Magnezone A2 53", "Shiinotic A3a 27"],
//   ["Infernape ex A2 29", "Silvally A3a 617"],
//   ["Incineroar ex A3 33", "Greninja A1 89"],
//   ["Stoutland A3a 56", "Rampardos A2 89"],
//   ["Greninja A1 89", "Sylveon ex A3b 34"],
//   ["Flareon ex A3b 9", "Turtonator A3 37"],
//   ["Magnezone A2 53", "Sylveon ex A3b 34"],
//   ["Heliolisk B1a 29", "Oricorio A3 66"],
//   ["Heliolisk B1a 29", "Zeraora A3a 21"],
//   ["Zeraora A3a 21", "Oricorio A3 66"],
//   ["Magnezone A2 53", "Tapu Koko ex A3a 19"],
//   ["Magnezone A2 53", "Oricorio A3 66"],
//   ["Incineroar ex A3 33", "Sylveon ex A3b 34"],
//   ["Magnezone A2 53", "Shiinotic A3a 27"],
//   ["Flareon ex A3b 9", "Salazzle A3 36"],
//   ["Stoutland A3a 56", "Sylveon ex A3b 34"],
//   ["Slurpuff A3b 32", "Alcremie A3b 37"],
//   ["Primarina ex A3b 24", "Pyukumuku A3 54"],
//   ["Sylveon A3b 33", "Sylveon ex A3b 34"],
//   ["Rampardos A2 89", "Sylveon ex A3b 34"],
//   ["Leafeon ex A2a 10", "Flareon ex A3b 9"],
//   ["Leafeon ex A2a 10", "Sylveon ex A3b 34"],
//   ["Flareon ex A3b 9", "Flareon A3b 8"],
//   ["Decidueye ex A3 12", "Leafeon ex A2a 10"],
//   ["Gengar ex A1 123", "Sylveon ex A3b 34"],
//   ["Umbreon A3b 43", "Darkrai ex A2 110"],
//   ["Gengar ex A1 123", "Shiinotic A3a 27"],
//   ["Stoutland A3a 56", "Sylveon ex A3b 34"],
//   ["Snorlax ex A3b 57", "Ho-Oh ex A4 34"],
//   ["Lugia ex A4 149", "Ho-Oh ex A4 34"],
//   ["Tapu Koko ex A3a 19", "Arceus ex A2a 71"],
//   ["Tapu Koko ex A3a 19", "Pichu A4 66"],
//   ["Tapu Koko ex A3a 19", "Oricorio A3 66"],
//   ["Tapu Koko ex A3a 19", "Zeraora A3a 21"],
//   ["Arceus ex A2a 71", "Pichu A4 66"],
//   ["Arceus ex A2a 71", "Oricorio A3 66"],
//   ["Arceus ex A2a 71", "Zeraora A3a 21"],
//   ["Crobat ex A4 109", "Umbreon ex A4 112"],
//   ["Crobat ex A4 109", "Arceus ex A2a 71"],
//   ["Crobat ex A4 109", "Sylveon ex A3b 34"],
//   ["Silvally A3a 61", "Pichu A4 66"],
//   ["Silvally A3a 61", "Magby A4 32"],
//   ["Donphan ex A4 100", "Rampardos A2 89"],
//   ["Ho-Oh ex A4 34", "Oricorio A3 66"],
//   ["Skarmory ex A4 124", "Skarmory A2 111"],
//   ["Donphan ex A4 100", "Lucario A2 92"],
//   ["Exeggutor ex A1 23", "Leafeon ex A2a 10"],
//   ["Espeon ex A4 83", "Gardevoir ex A4 105"],
//   ["Espeon ex A4 83", "Sylveon ex A3b 34"],
//   ["Manaphy A2 50", "Sylveon ex A3b 34"],
//   ["Dragonite ex A3b 53", "Altaria A4a 55"],
//   ["Dragonite ex A3b 53", "Sylveon ex A3b 34"],
//   ["Dragonite ex A3b 53", "Pichu A4 66"],
//   ["Dragonite ex A3b 53", "Zeraora A3a 21"],
//   ["Ho-Oh ex A4 34", "Magby A4 32"],
//   ["Leafeon ex A2a 10", "Leafeon A2a 10"],
//   ["Rayquaza ex PA 65", "Ho-Oh ex A4 34"],
//   ["Steelix A4 122", "Magby A4 32"],
//   ["Porygon-Z A4 129", "Espeon ex A4 83"],
//   ["Porygon-Z A4 129", "Sylveon ex A3b 34"],
//   ["Pawmot A2b 28", "Silvally A3a 61"],
//   ["Lanturn ex A4 65", "Oricorio A3 66"],
//   ["Lanturn ex A4 65", "Zeraora A3a 21"],
//   ["Tyranitar A4 119", "Umbreon ex A4 112"],
//   ["Typhlosion A4 29", "Sylveon ex A3b 34"],
//   ["Ho-Oh ex A4 34", "Mew ex A4 151"],
//   ["Typhlosion A4 29", "Turtonator A3 37"],
//   ["Primarina ex A3b 24", "Greninja A1 89"],
//   ["Tsareena A3 20", "Alolan Exeggutor A3 2"],
//   ["Donphan ex A4 100", "Marshadow A1a 47"],
//   ["Alolan Exeggutor A3 2", "Leafeon ex A2a 10"],
//   ["Flareon ex A3b 9", "Silvally A3a 61"],
//   ["Gallade ex A2 95", "Hitmontop A4 102"],
//   ["Umbreon ex A4 112", "Greninja A1 89"],
//   ["Darkrai ex A2 110", "Silvally A3a 61"],
//   ["Togekiss A2 65", "Cleffa A4 77"],
//   ["Flareon ex A3b 9", "Magby A4 32"],
//   ["Ho-Oh ex A4 34", "Pichu A4 66"],
//   ["Alolan Exeggutor A3 2", "Pichu A4 66"],
//   ["Leafeon ex A2a 10", "Alolan Exeggutor A3 2"],
//   ["Magcargo A4 31", "Silvally A3a 61"],
//   ["Giratina ex A2b 35", "Greninja A1 89"],
//   ["Milotic A4a 22", "Palkia ex A2 49"],
//   ["Poliwrath ex A4a 42", "Lucario A2 92"],
//   ["Gyarados A4 45", "Corsola A4 54"],
//   ["Gyarados A4 45", "Mantyke A4a 23"],
//   ["Altaria A4a 55", "Silvally A3a 61"],
//   ["Jumpluff ex A4a 3", "Darkrai ex A2 110"],
//   ["Jumpluff ex A4a 3", "Oricorio A3 66"],
//   ["Jumpluff ex A4a 3", "Zangoose A4a 65"],
//   ["Porygon-Z A4 129", "Stoutland A3a 56"],
//   ["Silvally A3a 61", "Palkia ex A2 49"],
//   ["Zoroark A4a 50", "Silvally A3a 61"],
//   ["Zoroark A4a 50", "Darkrai ex A2 110"],
//   ["Umbreon ex A4 112", "Umbreon A3b 43"],
//   ["Exeggutor ex A1 23", "Alolan Exeggutor A3 2"],
//   ["Dragonite ex A3b 53", "Dragonite A1 185"],
//   ["Miltank A4a 62", "Darkrai ex A2 110"],
//   ["Latios A4a 37", "Latias A4a 36"],
//   ["Poliwrath ex A4a 42", "Mantyke A4a 23"],
//   ["Jumpluff ex A4a 3", "Zeraora A3a 21"],
//   ["Flareon ex A3b 9", "Pichu A4 66"],

//   // Stage 2 ex
//   "Gigalith ex B2 87",
//   "Garchomp ex A2a 47",
//   "Infernape ex A2 29",
//   "Gallade ex A2 95",
//   "Pidgeot ex A1a 59",
//   "Blastoise ex A1 56",
//   "Gengar ex A1 123",
//   "Machamp ex A1 146",
//   "Beedrill ex A2b 3",
//   "Solgaleo ex A3 122",
//   "Lunala ex A3 87",
//   "Incineroar ex A3 33",
//   "Decidueye ex A3 12",
//   "Dragonite ex A3b 53",
//   "Primarina ex A3b 24",
//   "Crobat ex A4 109",
//   "Jumpluff ex A4a 3",
//   "Poliwrath ex A4a 42",

//   // Stage 2
//   "Galarian Obstagoon B2 100",
//   "Tyrantrum B2 90",
//   "Aegislash B1 172",
//   "Archeops B1 134",
//   "Dustox B1 7",
//   "Rillaboom B1 27",
//   "Goodra B1 179",
//   "Magneton A1 98",
//   "Magnezone B1a 26",
//   "Porygon-Z A4 137",
//   "Decidueye A3a 5",
//   "Bronzong A2a 59",
//   "Luxray A2 60",
//   "Bastiodon A2 114",
//   "Rampardos A2 89",
//   "Magnezone A2 53",
//   "Nidoqueen A1 168",
//   "Alakazam A1 117",
//   "Golem A1a 45",
//   "Dragonite A1 185",
//   "Garchomp A2 123",
//   "Togekiss A2 65",
//   "Scolipede A1a 55",
//   "Rhyperior A2 82",
//   "Meowscarada A2b 7",
//   "Tsareena A3 20",
//   "Pawmot A2b 28",
//   "Gengar A1 122",
//   "Stoutland A3a 56",
//   "Primarina A3 48",

//   // Stage 1 mega
//   "Mega Medicham ex PB 29",
//   "Mega Lopunny ex B1a 42",
//   "Mega Steelix ex B1a 52",
//   "Mega Gyarados ex B1 52",
//   "Mega Altaria ex B1 102",

//   // Stage 1 ex
//   "Toxtricity ex B2 55",
//   "Alolan Ninetales ex B2 29",
//   "Melmetal ex B1 174",
//   "Dragalge ex B1 160",
//   "Jolteon ex B1 81",
//   "Rapidash ex B1 31",
//   "Whimsicott ex B1 16",
//   "Gyarados ex A1a 18",
//   "Probopass ex A2a 57",
//   "Leafeon ex A2a 10",
//   "Glaceon ex A2a 22",
//   "Starmie ex A1 76",
//   "Marowak ex A1 153",
//   "Yanmega ex A2 7",
//   "Arcanine ex A1 41",
//   "Exeggutor ex A1 23",
//   "Wigglytuff ex A1 195",
//   "Mismagius ex A2 67",
//   "Wugtrio ex A2b 19",
//   "Lucario ex A2b 43",
//   "Paldean Clodsire ex A2b 48",
//   "Tinkaton ex A2b 54",
//   "Crabominable ex A3 49",
//   "Alolan Muk ex A3 111",
//   "Weavile ex A2 99",
//   "Flareon ex A3b 9",
//   "Kingdra ex A4 43",
//   "Lanturn ex A4 65",
//   "Espeon ex A4 83",
//   "Donphan ex A4 100",
//   "Umbreon ex A4 112",

//   // Stage 1
//   "Galarian Perrserker B2 111",
//   "Gyarados A4 45",
//   "Lilligant B1 18",
//   "Heliolisk B1a 29",
//   "Ariados B1a 6",
//   "Delcatty B1 194",
//   "Simisage B1 14",
//   "Galarian Cursola A4a 35",
//   "Honchkrow B1 149",
//   "Abomasnow A2a 21",
//   "Melmetal A1 182",
//   "Lumineon A1a 21",
//   "Gyarados A1 78",
//   "Weezing A1 177",
//   "Primeape A1a 42",
//   "Lucario A2 92",
//   "Marowak A1 152",
//   "Golduck A1 58",
//   "Gholdengo A2b 57",
//   "Wigglytuff A2b 61",
//   "Grafaiai A2b 51",
//   "Banette A3 75",
//   "Lurantis A3 15",
//   "Shiinotic A3a 27",
//   "Silvally A3a 61",
//   "Naganadel A3a 45",
//   "Lycanroc ex A3a 33",
//   "Salazzle A3 36",
//   "Steelix A4 122",
//   "Scizor A4 123",
//   "Tyranitar A4 119",
//   "Typhlosion A4 29",
//   "Milotic A4a 22",
//   "Gyarados A4 45",
//   "Altaria A4a 55",
//   "Electivire A2 57",
//   "Zoroark A4a 50",
//   "Magcargo A4 31",

//   // Basic mega
//   "Mega Mawile ex B2 113",
//   "Mega Kangaskhan ex B2 127",
//   "Mega Pinsir ex B1 2",
//   "Mega Absol ex B1 151",

//   // Basic ex
//   "Mimikyu ex B2 73",
//   "Teal Mask Ogerpon ex B2 17",
//   "Blacephalon ex B2 23",
//   "Tauros ex B1 183",
//   "Hitmonchan ex B1 124",
//   "Indeedee ex B1 121",
//   "Pikachu ex A1 96",
//   "Pachirisu ex A2 61",
//   "Darkrai ex A2 110",
//   "Articuno ex A1 84",
//   "Dialga ex A2 119",
//   "Zapdos ex A1 104",
//   "Palkia ex A2 49",
//   "Arceus ex A2a 71",
//   "Pikachu ex A2b 22",
//   "Giratina ex A2b 35",
//   "Buzzwole ex A3a 6",
//   "Guzzlord ex A3a 43",
//   "Tapu Koko ex A3a 19",
//   "Alolan Dugtrio ex A3a 47",
//   "Snorlax ex A3b 57",
//   "Shuckle ex A4 21",
//   "Ho-Oh ex A4 34",
//   "Skarmory ex A4 124",
//   "Lugia ex A4 149",
//   "Entei ex A4a 10",
//   "Raikou ex A4a 25",

//   // Basic
//   "Ditto B1a 55",
//   "Lt. Surge A1 226",
//   "Blaine A1 221",
//   "Hitmonlee A1 154",
//   "Tauros A1a 60",
//   "Snorlax A2a 63",
//   "Togedemaru A3 67",
//   "Celesteela A3a 62",
//   "Pheromosa A3a 7",
//   "Kartana A3a 8",
//   "Nihilego A3a 42",
//   "Blacephalon A3a 9",
//   "Dusk Mane Necrozma PA 79",
//   "Stakataka A3a 53",
//   "Magearna A3 123",
//   "Miltank A4a 62",
// ];

/**
 * Checks if a deck contains all cards in a given match criteria
 * @param cards The deck's cards
 * @param match The card names to match against
 * @param requireTwo Whether to require exactly 2 copies of each card
 * @returns Whether all cards in the match criteria are found in the deck
 */
const hasAllCards = (
  cards: Deck["cards"],
  primary: CardNameType,
  requireTwo: boolean,
  secondary?: CardNameType,
): boolean => {
  // Create a Set of card strings for O(1) lookup
  const cardStrings = new Set(cards.map((card) => cardToString(card)));

  const primaryMatch = Array.isArray(primary) ? primary : [primary];
  const secondaryMatch = Array.isArray(secondary) ? secondary : [secondary];

  let primaryMatches = primaryMatch.reduce((acc, cardName) => {
    const twoCopies = `2 ${cardName}`;
    const hasTwo = cardStrings.has(twoCopies);
    if (hasTwo) return acc + 2;
    const hasOne = cardStrings.has(`1 ${cardName}`)
    if (hasOne) return acc + 1;
    return acc;
  }, 0);
  let secondaryMatches = secondaryMatch.reduce((acc, cardName) => {
    const twoCopies = `2 ${cardName}`;
    const hasTwo = cardStrings.has(twoCopies);
    if (hasTwo) return acc + 2;
    const hasOne = cardStrings.has(`1 ${cardName}`)
    if (hasOne) return acc + 1;
    return acc;
  }, 0);

  if (requireTwo) return primaryMatches >= 2 && (secondaryMatches >= 2 || !secondary);
  return primaryMatches >= 1 && (secondaryMatches >= 2 || !secondary);
};

/**
 * Attempts to find a matching deck name based on the deck's cards
 * @param deck The deck to find a name for
 * @returns The formatted deck name if found, null otherwise
 */
const getDeckName = (deck: Deck): string | null => {
  const { cards } = deck;

  // First try matching with exactly 2 copies of each card
  for (const criteria of ARCHITYPES) {
    const { primary, secondary } = criteria;
    for (const secondaryCard of secondary) {
      if (hasAllCards(cards, primary, true, secondaryCard)) {
        const primaryMatch = Array.isArray(primary) ? primary : [primary];
        const secondaryMatch = Array.isArray(secondaryCard) ? secondaryCard : [secondaryCard];
        const match = [primaryMatch[0], secondaryMatch[0]];
        return formatName(cards, match);
      }
    }
    if (hasAllCards(cards, primary, true)) {
      const primaryMatch = Array.isArray(primary) ? [primary[0]] : [primary];
      return formatName(cards, primaryMatch);
    }
  }

  // First try matching with exactly 2 copies of each card
  for (const criteria of ARCHITYPES) {
    const { primary, secondary } = criteria;
    for (const secondaryCard of secondary) {
      if (hasAllCards(cards, primary, false, secondaryCard)) {
        const primaryMatch = Array.isArray(primary) ? primary : [primary];
        const secondaryMatch = Array.isArray(secondaryCard) ? secondaryCard : [secondaryCard];
        const match = [primaryMatch[0], secondaryMatch[0]];
        return formatName(cards, match);
      }
    }
    if (hasAllCards(cards, primary, false)) {
      const primaryMatch = Array.isArray(primary) ? [primary[0]] : [primary];
      return formatName(cards, primaryMatch);
    }
  }

  return null;
};

export default getDeckName;
