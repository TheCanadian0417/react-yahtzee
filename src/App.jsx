import { useState, useEffect, useRef } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Die from './Die.jsx'
import { rollAllDice, rerollFree, toggleHold } from "./game/dice.js";
import { scoreCategory, calculateTotals, BONUS_THRESHOLD, CATEGORIES, isGameOver } from "./game/scoring.js";

export default function App() {

    const [dice, setDice] = useState( () => rollAllDice())
    const [isRolling, setIsRolling] = useState(false)
    const [rollsLeft, setRollsLeft] = useState(2)
    const [showScores, setShowScores] = useState(false);
    const [scores, setScores] = useState({})
    const rollTimer = useRef(null)

    function animateRoll() {
        clearInterval(rollTimer.current)          // never run two rolls at once
        setIsRolling(true)
        let ticks = 0
        rollTimer.current = setInterval(() => {
            setDice(oldDice => rerollFree(oldDice))
            ticks++
            if (ticks === 8) {
                clearInterval(rollTimer.current)
                setIsRolling(false)
            }
        }, 70)
    }

    function rollDice() {
        if (isRolling || rollsLeft === 0 || gameOver) return
        setRollsLeft(prev => prev - 1)
        animateRoll()
    }

// Roll in once when the page loads
    useEffect(() => {
        animateRoll()
        return () => clearInterval(rollTimer.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const values = dice.map(d => d.value)

    const gameOver =  isGameOver(scores)

    const hold = id => {
        if (gameOver || isRolling) return
        setDice(oldDice => toggleHold(oldDice, id))
    }

    function bankScore(key) {
        if (key in scores || gameOver || isRolling) return;
        setScores(old => ({ ...old, [key]: scoreCategory(values, key) }))
        setDice(rollAllDice())
        setRollsLeft(2)
        animateRoll()
    }

    function newGame() {
        setScores({})
        setDice(rollAllDice())
        setRollsLeft(2)
        setShowScores(false)
    }

    const { upperTotal, bonus, lowerTotal, grandTotal } = calculateTotals(scores)


  return (
    <div className="game-board" >
        <h1>Yahtzee</h1>

        <div className="dice-area">
        {dice.map(die => (
            <Die key={die.id}
                 value={die.value}
                 isHeld={die.isHeld}
                 rolling={isRolling && !die.isHeld}
                 hold={() => hold(die.id)}
            />
            ))}
        </div>

        { rollsLeft > 0 && gameOver === false && <button className="roll-btn" onClick={rollDice} disabled={isRolling}>
            {`Roll (${rollsLeft} remaining)`}
        </button>}

        { rollsLeft > 0 && !gameOver && <button className="score-btn" onClick={() => setShowScores(prev => !prev)}>
            {showScores ? "Hide Scores" : "Show Scores"}
        </button>}
        {gameOver && <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final score: {grandTotal}</p>
            <button className="new-game-btn" onClick={newGame}>New Game</button>
        </div>}

        {( rollsLeft === 0 || gameOver || showScores )&& <div className="score-card">
            <table className="score-table">
                <thead>
                <tr>
                    <th>Category</th>
                    <th className="hint">How to score</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                <tr className="section-row"><th colSpan={3}>Upper Section</th></tr>
                {CATEGORIES.filter(c => c.section === "upper").map(cat => (
                    <tr key={cat.key}>
                        <th scope="row">{cat.label}</th>
                        <td className="hint">{cat.hint}</td>
                        <td className="score-cell">
                            {cat.key in scores
                                ? scores[cat.key]
                                : <button onClick={() => bankScore(cat.key)}>{scoreCategory(values, cat.key)}</button>}
                        </td>
                    </tr>
                ))}
                <tr className="total-row">
                    <th scope="row">Upper Total</th>
                    <td className="hint">Sum of section</td>
                    <td className="score-cell">{upperTotal}</td>
                </tr>
                <tr className="total-row">
                    <th scope="row">Bonus</th>
                    <td className="hint">
                        {upperTotal >= BONUS_THRESHOLD
                            ? "Earned!"
                            : `Needs ${BONUS_THRESHOLD - upperTotal} more`}
                    </td>
                    <td className="score-cell">{bonus}</td>
                </tr>
                </tbody>
                <tbody>
                <tr className="section-row"><th colSpan={3}>Lower Section</th></tr>
                {CATEGORIES.filter(c => c.section === "lower").map(cat => (
                    <tr key={cat.key}>
                        <th scope="row">{cat.label}</th>
                        <td className="hint">{cat.hint}</td>
                        <td className="score-cell">
                            {cat.key in scores
                                ? scores[cat.key]
                                : <button onClick={() => bankScore(cat.key)}>{scoreCategory(values, cat.key)}</button>}
                        </td>
                    </tr>
                ))}
                </tbody>
                    <tfoot>
                    <tr className="total-row">
                        <th scope="row">Lower Total</th>
                        <td className="hint">Sum of section</td>
                        <td className="score-cell">{lowerTotal}</td>
                    </tr>
                    <tr className="total-row grand-total">
                        <th scope="row">Grand Total</th>
                        <td className="hint">Upper + bonus + lower</td>
                        <td className="score-cell">{grandTotal}</td>
                    </tr>
                    </tfoot>
            </table>
        </div> }

    </div>
  )
}
