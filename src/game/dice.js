export const randomRoll = () => Math.ceil(Math.random() * 6)

export function rollAllDice() {
    return Array.from({ length: 5 }, () => ({
        value: randomRoll(),
        isHeld: false,
        id: crypto.randomUUID(),
    }));
}

export function rerollFree(dice) {
    return dice.map(die => (die.isHeld ? die : { ...die, value: randomRoll() }))
}

export function toggleHold(dice, id) {
    return dice.map(die => (die.id === id ? {...die, isHeld: !die.isHeld } : die))
}