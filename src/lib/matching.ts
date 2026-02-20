import type { IUser } from "@/models/User";
import { migratorySpecies, type MigratorySpecies } from "@/data/species";

/**
 * Matching algorithm for Flock.
 *
 * Scores compatibility based on movement pattern similarity,
 * using location history as a proxy for lifestyle, pace, and vibe.
 *
 * Score components (0–1 each, weighted to 0–100 total):
 *   - Path Overlap       (35%) — shared countries across all stops
 *   - Temporal Proximity (20%) — same country at the same time
 *   - Future Convergence (20%) — shared future plans
 *   - Flexibility Match  (15%) — similar rooted/wind-blown score
 *   - Looking-For Align  (10%) — romantic/friends/both compatibility
 */

interface MigrationStop {
    country: string;
    countryCode: string;
    lat: number;
    lng: number;
    year?: number;
    season?: string;
}

// ─── Helpers ─────────────────────────────────────────────

function getAllCountries(user: Pick<IUser, "birthCountry" | "grewUp" | "recentMigrations" | "futurePlans">): string[] {
    return [
        user.birthCountry.country,
        ...user.grewUp.map((s) => s.country),
        ...user.recentMigrations.map((s) => s.country),
        ...user.futurePlans.map((s) => s.country),
    ];
}

function uniqueCountries(stops: { country: string }[]): Set<string> {
    return new Set(stops.map((s) => s.country));
}

// ─── Score Components ────────────────────────────────────

/**
 * Path Overlap: ratio of shared countries to total unique countries.
 */
function computePathOverlap(
    userA: Pick<IUser, "birthCountry" | "grewUp" | "recentMigrations" | "futurePlans">,
    userB: Pick<IUser, "birthCountry" | "grewUp" | "recentMigrations" | "futurePlans">
): number {
    const countriesA = new Set(getAllCountries(userA));
    const countriesB = new Set(getAllCountries(userB));
    const shared = [...countriesA].filter((c) => countriesB.has(c));
    const maxPossible = Math.max(countriesA.size, countriesB.size, 1);
    return Math.min(shared.length / maxPossible, 1);
}

/**
 * Temporal Proximity: were they in the same country around the same time?
 * Looks at recentMigrations with year/season data.
 */
function computeTemporalProximity(
    stopsA: MigrationStop[],
    stopsB: MigrationStop[]
): number {
    if (stopsA.length === 0 || stopsB.length === 0) return 0;

    let coLocations = 0;
    let maxPossible = 0;

    for (const a of stopsA) {
        if (!a.year) continue;
        for (const b of stopsB) {
            if (!b.year) continue;
            maxPossible++;
            if (a.country === b.country) {
                if (a.year === b.year) {
                    // Same country, same year
                    coLocations += a.season === b.season ? 1.0 : 0.6;
                } else if (Math.abs(a.year - b.year) <= 1) {
                    // Same country, adjacent year
                    coLocations += 0.3;
                }
            }
        }
    }

    return maxPossible > 0 ? Math.min(coLocations / Math.sqrt(maxPossible), 1) : 0;
}

/**
 * Future Convergence: do their future plans overlap?
 */
function computeFutureConvergence(
    futureA: { country: string }[],
    futureB: { country: string }[]
): number {
    if (futureA.length === 0 || futureB.length === 0) return 0;

    const setA = uniqueCountries(futureA);
    const setB = uniqueCountries(futureB);
    const shared = [...setA].filter((c) => setB.has(c));
    const maxPossible = Math.max(setA.size, setB.size, 1);
    return Math.min(shared.length / maxPossible, 1);
}

/**
 * Flexibility Match: how close are their flexibility scores?
 * 1.0 = identical, 0.0 = opposite ends.
 */
function computeFlexibilityMatch(flexA: number, flexB: number): number {
    return 1 - Math.abs(flexA - flexB);
}

/**
 * Looking-For Alignment: compatibility of relationship preferences.
 */
function computeLookingForAlignment(
    a: "romantic" | "friends" | "both",
    b: "romantic" | "friends" | "both"
): number {
    if (a === "both" || b === "both") return 1.0;
    if (a === b) return 1.0;
    return 0.3; // mismatch (romantic vs friends)
}

// ─── Main Scoring Function ───────────────────────────────

const WEIGHTS = {
    pathOverlap: 0.35,
    temporalProximity: 0.2,
    futureConvergence: 0.2,
    flexibilityMatch: 0.15,
    lookingForAlignment: 0.1,
} as const;

export interface CompatibilityResult {
    score: number; // 0–100
    breakdown: {
        pathOverlap: number;
        temporalProximity: number;
        futureConvergence: number;
        flexibilityMatch: number;
        lookingForAlignment: number;
    };
}

export function computeCompatibility(
    userA: Pick<IUser, "birthCountry" | "grewUp" | "recentMigrations" | "futurePlans" | "flexibility" | "lookingFor">,
    userB: Pick<IUser, "birthCountry" | "grewUp" | "recentMigrations" | "futurePlans" | "flexibility" | "lookingFor">
): CompatibilityResult {
    const pathOverlap = computePathOverlap(userA, userB);
    const temporalProximity = computeTemporalProximity(
        userA.recentMigrations as MigrationStop[],
        userB.recentMigrations as MigrationStop[]
    );
    const futureConvergence = computeFutureConvergence(
        userA.futurePlans,
        userB.futurePlans
    );
    const flexibilityMatch = computeFlexibilityMatch(
        userA.flexibility,
        userB.flexibility
    );
    const lookingForAlignment = computeLookingForAlignment(
        userA.lookingFor,
        userB.lookingFor
    );

    const score = Math.round(
        (WEIGHTS.pathOverlap * pathOverlap +
            WEIGHTS.temporalProximity * temporalProximity +
            WEIGHTS.futureConvergence * futureConvergence +
            WEIGHTS.flexibilityMatch * flexibilityMatch +
            WEIGHTS.lookingForAlignment * lookingForAlignment) *
        100
    );

    return {
        score,
        breakdown: {
            pathOverlap: Math.round(pathOverlap * 100),
            temporalProximity: Math.round(temporalProximity * 100),
            futureConvergence: Math.round(futureConvergence * 100),
            flexibilityMatch: Math.round(flexibilityMatch * 100),
            lookingForAlignment: Math.round(lookingForAlignment * 100),
        },
    };
}

// ─── Species Picker ──────────────────────────────────────

/**
 * Pick a migratory species that's thematically linked to the
 * matched pair's combined geography.
 */
export function pickSpeciesForPair(
    userA: Pick<IUser, "recentMigrations" | "futurePlans">,
    userB: Pick<IUser, "recentMigrations" | "futurePlans">
): MigratorySpecies {
    const allCountries = [
        ...userA.recentMigrations.map((s) => s.country),
        ...userA.futurePlans.map((s) => s.country),
        ...userB.recentMigrations.map((s) => s.country),
        ...userB.futurePlans.map((s) => s.country),
    ];

    const hasAsia = allCountries.some((c) =>
        ["Thailand", "Vietnam", "Indonesia", "Japan", "South Korea", "Malaysia", "Philippines", "Cambodia"].includes(c)
    );
    const hasEurope = allCountries.some((c) =>
        ["Portugal", "Spain", "France", "Germany", "Netherlands", "United Kingdom", "Sweden", "Norway", "Italy"].includes(c)
    );
    const hasAfrica = allCountries.some((c) =>
        ["Kenya", "Morocco", "South Africa", "Egypt"].includes(c)
    );
    const hasOceania = allCountries.some((c) =>
        ["New Zealand", "Australia"].includes(c)
    );
    const hasAmericas = allCountries.some((c) =>
        ["Mexico", "Costa Rica", "Brazil", "Argentina", "Colombia"].includes(c)
    );

    if (hasOceania) return migratorySpecies.find((s) => s.id === "bar-tailed-godwit")!;
    if (hasAfrica) return migratorySpecies.find((s) => s.id === "wildebeest")!;
    if (hasEurope && hasAfrica) return migratorySpecies.find((s) => s.id === "european-turtle-dove")!;
    if (hasAsia) return migratorySpecies.find((s) => s.id === "humpback-whale")!;
    if (hasAmericas) return migratorySpecies.find((s) => s.id === "monarch-butterfly")!;
    if (hasEurope) return migratorySpecies.find((s) => s.id === "arctic-tern")!;

    // Default
    return migratorySpecies.find((s) => s.id === "monarch-butterfly")!;
}
