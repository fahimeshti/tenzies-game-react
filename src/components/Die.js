import React from "react"

export default function Die({value, isHeld, holdDice}) {
    const styles = {
        backgroundColor: isHeld ? "#59E391" : "white"
    }
    return (
        <div onClick={holdDice} className="die-face" style={styles}>
            <h2 className="die-num">{value}</h2>
        </div>
    )
}