export interface MigratorySpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  migrationRoute: string;
  regions: string[];
  imageEmoji: string;
  funFact: string;
}

export const migratorySpecies: MigratorySpecies[] = [
  {
    id: "arctic-tern",
    name: "Arctic Tern",
    scientificName: "Sterna paradisaea",
    description:
      "Arctic terns make the longest known migration of any animal, traveling from Arctic to Antarctic and back each year — roughly 71,000 km.",
    migrationRoute: "Arctic to Antarctic",
    regions: ["Northern Europe", "North America", "Southern Ocean"],
    imageEmoji: "🕊️",
    funFact:
      "Over its lifetime, an Arctic tern flies roughly the equivalent of three round trips to the Moon.",
  },
  {
    id: "bar-tailed-godwit",
    name: "Bar-tailed Godwit",
    scientificName: "Limosa lapponica",
    description:
      "Bar-tailed godwits hold the record for the longest non-stop flight — over 11,000 km from Alaska to New Zealand without rest.",
    migrationRoute: "Alaska to New Zealand",
    regions: ["Southeast Asia", "Oceania", "North America"],
    imageEmoji: "🐦",
    funFact:
      "They fly for 11 days straight without eating, drinking, or sleeping.",
  },
  {
    id: "monarch-butterfly",
    name: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    description:
      "Monarchs travel up to 4,800 km from Canada to central Mexico, navigating using the sun and Earth's magnetic field.",
    migrationRoute: "North America to Mexico",
    regions: ["North America", "Central America"],
    imageEmoji: "🦋",
    funFact:
      "No single butterfly makes the entire round trip — it takes four generations.",
  },
  {
    id: "humpback-whale",
    name: "Humpback Whale",
    scientificName: "Megaptera novaeangliae",
    description:
      "Humpback whales migrate up to 8,000 km between polar feeding grounds and tropical breeding waters.",
    migrationRoute: "Polar to Tropical waters",
    regions: ["South America", "Southern Ocean", "Southeast Asia", "Oceania"],
    imageEmoji: "🐋",
    funFact:
      "Their songs can travel thousands of kilometers through the ocean.",
  },
  {
    id: "european-turtle-dove",
    name: "European Turtle Dove",
    scientificName: "Streptopelia turtur",
    description:
      "European turtle doves migrate between European breeding grounds and sub-Saharan African wintering grounds, crossing the Mediterranean and Sahara.",
    migrationRoute: "Europe to Sub-Saharan Africa",
    regions: ["Europe", "Africa", "Middle East"],
    imageEmoji: "🕊️",
    funFact:
      "Their population has declined by 78% since 1980 due to habitat loss.",
  },
  {
    id: "wildebeest",
    name: "Wildebeest",
    scientificName: "Connochaetes taurinus",
    description:
      "Over 1.5 million wildebeest undertake a circular migration through the Serengeti-Mara ecosystem following the rains.",
    migrationRoute: "Serengeti to Masai Mara",
    regions: ["East Africa"],
    imageEmoji: "🦬",
    funFact:
      "The Great Migration involves over 2 million animals when you include zebras and gazelles.",
  },
];
