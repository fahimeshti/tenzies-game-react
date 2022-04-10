import { useEffect, useState } from 'react';
import './App.css';
import Die from "./components/Die";
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [hours, setHours ] = useState(0);
  const [minutes, setMinutes ] = useState(0);
  const [seconds, setSeconds ] =  useState(0);
  const [showSeconds, setShowSeconds ] =  useState(0);
  const [bestScore, setBestScore ] =  useState(
    JSON.parse(localStorage.getItem("tenziesScores")) || {}
  );

  function countTimer() {
    setSeconds(prevSec => prevSec + 1);
    setMinutes(Math.floor((seconds - hours*3600)/60))
    setHours(Math.floor(seconds /3600))
      if (showSeconds < 60) {
      setShowSeconds(prevSec => prevSec + 1)
      } else {
      setShowSeconds(0)
      setShowSeconds(prevSec => prevSec + 1)
      }  

    }


useEffect(()=>{
  const myInterval = setInterval(() => {
    countTimer()
  }, 1000)
  if (tenzies) {
    clearInterval(myInterval);
  }
      return ()=> {
          clearInterval(myInterval);
        };
});


  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
        const store = {seconds, minutes, hours, rollCount}
        if (seconds < bestScore.seconds) {
          localStorage.setItem("tenziesScores", JSON.stringify(store))
          setBestScore(store)
        }
    }
}, [dice])

  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
}

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    
    }
    return newDice
  }

  function rollDice() {
    if(!tenzies) {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
        setRollCount(prevCount => prevCount + 1 )
    } else {
        setTenzies(false)
        setDice(allNewDice())
        setShowSeconds(0)
        setSeconds(0)
        setRollCount(0)
    }
  }

  const holdDice = (id) => {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
          {...die, isHeld: !die.isHeld} :
          die
    }))
  }

  const diceElements = dice.map(die => <Die 
    key={die.id} 
    value={die.value}
    isHeld={die.isHeld}
    holdDice={() => holdDice(die.id)}
     />)
    
    
          
     

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
            <p className="instructions">
              Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
          {diceElements}
      </div>
      <div className='bottom-box'>
        <div>
          <div className='best-score'>Best Score: {bestScore.rollCount ? bestScore.rollCount : 0}</div>
          <div>Dice rolled: {rollCount}</div>
        </div>
        <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
        </button>
        <div>
          <div className='best-score'>Best Time: {bestScore.seconds ? (`${bestScore.minutes}m ${bestScore.seconds}s`) : 
            "00s"
            }
          </div>
          <div className='time-box'>Time spent: {hours > 0 ? `${hours}h` : ''} {minutes}m {showSeconds}s</div>
        </div>
      </div>
    </main>
  );
}

export default App;
