function tally(values) {
    const counts = {};
    for (const v of values) counts[v] = (counts[v] || 0) + 1;
    return counts;
}
const sumAll = values => values.reduce((a, v) => a + v, 0);
export const BONUS_THRESHOLD = 63
export const BONUS_POINTS = 35

function scoreFace(values, face) {
    return values.filter(v => v === face).reduce((s, v) => s + v, 0);
}
function nOfAKind(values, n) {
    return Object.values(tally(values)).some(c => c >= n) ? sumAll(values) : 0;
}
function fullHouse(values) {
    const c = Object.values(tally(values)).sort((a, b) => a - b);
    return (c.length === 2 && c[0] === 2 && c[1] === 3) ? 25 : 0;
}
function yahtzee(values) {
    return Object.values(tally(values)).some(c => c === 5) ? 50 : 0;
}
function clean(values) {
    return [...new Set(values)].sort((a, b) => a - b).join("");
}
function smallStraight(values) {
    const s = clean(values);
    return (s.includes("1234") || s.includes("2345") || s.includes("3456")) ? 30 : 0;
}
function largeStraight(values) {
    const s = clean(values);
    return (s === "12345" || s === "23456") ? 40 : 0;
}

export function scoreCategory(values, category) {
    const faces = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 };
    if (category in faces) return scoreFace(values, faces[category]);
    const table = {
        threeKind: () => nOfAKind(values, 3),
        fourKind: () => nOfAKind(values, 4),
        fullHouse: () => fullHouse(values),
        smallStraight: () => smallStraight(values),
        largeStraight: () => largeStraight(values),
        yahtzee: () => yahtzee(values),
        chance: () => sumAll(values),
    };
    return table[category] ? table[category]() : 0;
}

export const CATEGORIES = [
    { key: "ones", label: "Ones", section: "upper", hint: "Count and Add Only Aces" },
    { key: "twos", label: "Twos", section: "upper", hint: "Count and Add Only Twos" },
    { key: "threes", label: "Threes", section: "upper", hint: "Count and Add Only Threes" },
    { key: "fours", label: "Fours", section: "upper", hint: "Count and Add Only Fours" },
    { key: "fives", label: "Fives", section: "upper", hint: "Count and Add Only Fives" },
    { key: "sixes", label: "Sixes", section: "upper", hint: "Count and Add Only Sixes" },
    { key: "threeKind", label: "Three of a Kind", section: "lower", hint: "Add Total of All Dice" },
    { key: "fourKind", label: "Four of a Kind", section: "lower", hint: "Add Total of All Dice" },
    { key: "fullHouse", label: "Full House", section: "lower", hint: "Score 25" },
    { key: "smallStraight", label: "Small Straight", section: "lower", hint: "Score 30" },
    { key: "largeStraight", label: "Large Straight", section: "lower", hint: "Score 40" },
    { key: "yahtzee", label: "Yahtzee", section: "lower", hint: "Score 50" },
    { key: "chance", label: "Chance", section: "lower", hint: "Score Total of All 5 Dice" },
];

function sectionTotal(scores, section) {
    return CATEGORIES
        .filter(cat => cat.section === section && cat.key in scores)
        .reduce((sum, cat) => sum + scores[cat.key], 0)
}

export function calculateTotals(scores) {
    const upperTotal = sectionTotal(scores, "upper")
    const bonus = upperTotal >= BONUS_THRESHOLD ? BONUS_POINTS : 0
    const lowerTotal = sectionTotal(scores, "lower")
    return {
        upperTotal,
        bonus,
        lowerTotal,
        grandTotal: upperTotal + bonus + lowerTotal,
    }
}

export function isGameOver(scores) {
    return Object.keys(scores).length === CATEGORIES.length
}