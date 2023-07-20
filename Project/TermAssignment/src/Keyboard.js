import React from "react";

const Keyboard = () => {

const keyboard = document.createElement("div");
keyboard.classList.add("keyboard");
document.body.appendChild(keyboard);


return (
    <div>
        <div className="keyboard">
        <button className="keyboard-key">Q</button>
        <button className="keyboard-key">W</button>
        <button className="keyboard-key">E</button>
        <button className="keyboard-key">R</button>
        <button className="keyboard-key">T</button>
        <button className="keyboard-key">Y</button>
        <button className="keyboard-key">U</button>
        <button className="keyboard-key">I</button>
        <button className="keyboard-key">O</button>
        <button className="keyboard-key">P</button>
        <br/>
        <button className="keyboard-key">A</button>
        <button className="keyboard-key">S</button>
        <button className="keyboard-key">D</button>
        <button className="keyboard-key">F</button>
        <button className="keyboard-key">G</button>
        <button className="keyboard-key">H</button>
        <button className="keyboard-key">J</button>
        <button className="keyboard-key">K</button>
        <button className="keyboard-key">L</button>
        <br/>
        <button className="keyboard-key">Z</button>
        <button className="keyboard-key">X</button>
        <button className="keyboard-key">C</button>
        <button className="keyboard-key">V</button>
        <button className="keyboard-key">B</button>
        <button className="keyboard-key">N</button>
        <button className="keyboard-key">M</button>
        </div>
    </div>
)
}


export default Keyboard;