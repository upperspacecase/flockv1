export interface MigrationStop {
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  year?: number;
  season?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  birthCountry: MigrationStop;
  grewUp: MigrationStop[];
  recentMigrations: MigrationStop[];
  futurePlans: MigrationStop[];
  currentLocation: MigrationStop;
  flexibility: number; // 0 = rooted, 1 = wind-blown
  lookingFor: "romantic" | "friends" | "both";
  bio?: string;
}

export const mockProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Lina",
    age: 29,
    photo: "/avatars/lina.jpg",
    birthCountry: { country: "Colombia", countryCode: "CO", lat: 4.57, lng: -74.3 },
    grewUp: [
      { country: "Spain", countryCode: "ES", lat: 40.46, lng: -3.75 },
      { country: "United States", countryCode: "US", lat: 37.09, lng: -95.71 },
    ],
    recentMigrations: [
      { country: "Portugal", countryCode: "PT", lat: 39.4, lng: -8.22, year: 2024, season: "spring" },
      { country: "Thailand", countryCode: "TH", lat: 15.87, lng: 100.99, year: 2024, season: "winter" },
      { country: "Indonesia", countryCode: "ID", lat: -0.79, lng: 113.92, year: 2025, season: "spring" },
    ],
    futurePlans: [
      { country: "Vietnam", countryCode: "VN", lat: 14.06, lng: 108.28 },
      { country: "Japan", countryCode: "JP", lat: 36.2, lng: 138.25 },
    ],
    currentLocation: { country: "Indonesia", countryCode: "ID", lat: -8.34, lng: 115.09 },
    flexibility: 0.8,
    lookingFor: "both",
    bio: "Designing from wherever the wifi works. Salsa dancer, sunrise swimmer, collecting sunsets like stamps.",
  },
  {
    id: "2",
    name: "Kai",
    age: 32,
    photo: "/avatars/kai.jpg",
    birthCountry: { country: "New Zealand", countryCode: "NZ", lat: -40.9, lng: 174.89 },
    grewUp: [
      { country: "United Kingdom", countryCode: "GB", lat: 55.38, lng: -3.44 },
      { country: "Sweden", countryCode: "SE", lat: 60.13, lng: 18.64 },
    ],
    recentMigrations: [
      { country: "Portugal", countryCode: "PT", lat: 39.4, lng: -8.22, year: 2024, season: "spring" },
      { country: "Thailand", countryCode: "TH", lat: 15.87, lng: 100.99, year: 2024, season: "fall" },
      { country: "Indonesia", countryCode: "ID", lat: -0.79, lng: 113.92, year: 2025, season: "winter" },
    ],
    futurePlans: [
      { country: "Brazil", countryCode: "BR", lat: -14.24, lng: -51.93 },
      { country: "Argentina", countryCode: "AR", lat: -38.42, lng: -63.62 },
    ],
    currentLocation: { country: "Indonesia", countryCode: "ID", lat: -8.34, lng: 115.09 },
    flexibility: 0.7,
    lookingFor: "romantic",
    bio: "Born Kiwi, raised between grey skies and northern lights. Building things on the internet, chasing waves in the real world.",
  },
  {
    id: "3",
    name: "Aisha",
    age: 27,
    photo: "/avatars/aisha.jpg",
    birthCountry: { country: "Kenya", countryCode: "KE", lat: -0.02, lng: 37.91 },
    grewUp: [
      { country: "United Arab Emirates", countryCode: "AE", lat: 23.42, lng: 53.85 },
      { country: "United Kingdom", countryCode: "GB", lat: 55.38, lng: -3.44 },
    ],
    recentMigrations: [
      { country: "Germany", countryCode: "DE", lat: 51.17, lng: 10.45, year: 2024, season: "spring" },
      { country: "Portugal", countryCode: "PT", lat: 39.4, lng: -8.22, year: 2024, season: "summer" },
      { country: "Morocco", countryCode: "MA", lat: 31.79, lng: -7.09, year: 2025, season: "winter" },
    ],
    futurePlans: [
      { country: "Indonesia", countryCode: "ID", lat: -0.79, lng: 113.92 },
      { country: "Vietnam", countryCode: "VN", lat: 14.06, lng: 108.28 },
    ],
    currentLocation: { country: "Morocco", countryCode: "MA", lat: 31.79, lng: -7.09 },
    flexibility: 0.6,
    lookingFor: "friends",
    bio: "Third-culture kid with too many home countries. Photographer, tea obsessive, collecting stories from strangers.",
  },
  {
    id: "4",
    name: "Tomás",
    age: 30,
    photo: "/avatars/tomas.jpg",
    birthCountry: { country: "Brazil", countryCode: "BR", lat: -14.24, lng: -51.93 },
    grewUp: [
      { country: "Brazil", countryCode: "BR", lat: -14.24, lng: -51.93 },
      { country: "Portugal", countryCode: "PT", lat: 39.4, lng: -8.22 },
    ],
    recentMigrations: [
      { country: "Netherlands", countryCode: "NL", lat: 52.13, lng: 5.29, year: 2024, season: "spring" },
      { country: "Indonesia", countryCode: "ID", lat: -0.79, lng: 113.92, year: 2024, season: "winter" },
      { country: "Thailand", countryCode: "TH", lat: 15.87, lng: 100.99, year: 2025, season: "spring" },
    ],
    futurePlans: [
      { country: "Japan", countryCode: "JP", lat: 36.2, lng: 138.25 },
      { country: "South Korea", countryCode: "KR", lat: 35.91, lng: 127.77 },
    ],
    currentLocation: { country: "Thailand", countryCode: "TH", lat: 15.87, lng: 100.99 },
    flexibility: 0.9,
    lookingFor: "both",
    bio: "Music producer who found out you can make beats anywhere. Fluent in Portuguese, English, and hand gestures.",
  },
  {
    id: "5",
    name: "Maren",
    age: 28,
    photo: "/avatars/maren.jpg",
    birthCountry: { country: "Norway", countryCode: "NO", lat: 60.47, lng: 8.47 },
    grewUp: [
      { country: "Norway", countryCode: "NO", lat: 60.47, lng: 8.47 },
      { country: "France", countryCode: "FR", lat: 46.23, lng: 2.21 },
    ],
    recentMigrations: [
      { country: "Spain", countryCode: "ES", lat: 40.46, lng: -3.75, year: 2024, season: "spring" },
      { country: "Mexico", countryCode: "MX", lat: 23.63, lng: -102.55, year: 2024, season: "fall" },
      { country: "Costa Rica", countryCode: "CR", lat: 9.75, lng: -83.75, year: 2025, season: "winter" },
    ],
    futurePlans: [
      { country: "Portugal", countryCode: "PT", lat: 39.4, lng: -8.22 },
      { country: "Thailand", countryCode: "TH", lat: 15.87, lng: 100.99 },
    ],
    currentLocation: { country: "Costa Rica", countryCode: "CR", lat: 9.75, lng: -83.75 },
    flexibility: 0.5,
    lookingFor: "romantic",
    bio: "Climate scientist who practices what she studies. Sauna enthusiast, amateur birder, believes in slow mornings.",
  },
];

export const currentUser: UserProfile = {
  id: "self",
  name: "Tay",
  age: 31,
  photo: "/avatars/tay.jpg",
  birthCountry: { country: "New Zealand", countryCode: "NZ", lat: -40.9, lng: 174.89 },
  grewUp: [
    { country: "United Kingdom", countryCode: "GB", lat: 55.38, lng: -3.44 },
    { country: "Sweden", countryCode: "SE", lat: 60.13, lng: 18.64 },
  ],
  recentMigrations: [
    { country: "Portugal", countryCode: "PT", lat: 39.4, lng: -8.22, year: 2024, season: "spring" },
    { country: "Thailand", countryCode: "TH", lat: 15.87, lng: 100.99, year: 2024, season: "fall" },
    { country: "Indonesia", countryCode: "ID", lat: -0.79, lng: 113.92, year: 2025, season: "winter" },
  ],
  futurePlans: [
    { country: "Vietnam", countryCode: "VN", lat: 14.06, lng: 108.28 },
    { country: "United Kingdom", countryCode: "GB", lat: 55.38, lng: -3.44 },
  ],
  currentLocation: { country: "Brazil", countryCode: "BR", lat: -22.91, lng: -43.17 },
  flexibility: 0.7,
  lookingFor: "both",
  bio: "Born in NZ, raised between grey skies and northern lights. Currently chasing southern hemisphere summer.",
};
