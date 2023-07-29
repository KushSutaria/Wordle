import React from "react";
import { useState } from "react";
const Stats = () => {
    const [g1, setG1] = useState(0);
    const [g2, setG2] = useState(0);
    const [g3, setG3] = useState(0);
    const [g4, setG4] = useState(0);
    const [g5, setG5] = useState(0);
    const [g6, setG6] = useState(0);
    const fetchUserStats = () => {
        if(!localStorage.getItem("user") || localStorage.getItem("user")===null || localStorage.getItem("user")===undefined){
            
        }
        else{

        // show g1 g2 g3 g4 g5 g6 on webpage
        const values = {
            "email": localStorage.getItem("user")
        }
        console.log(values);
        if(values.email === null || values.email === undefined){
            setG1(0);
            setG2(0);
            setG3(0);
            setG4(0);
            setG5(0);
            setG6(0);
        }
        else{
        fetch('https://8nj236yhkd.execute-api.us-east-1.amazonaws.com/prod/fetchstats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          if(data.statusCode === 200){

            console.log(data.body.Guess1);
            console.log(data.body.Guess2);
            }
            setG1(data.body.Guess1);
            setG2(data.body.Guess2);
            setG3(data.body.Guess3);
            setG4(data.body.Guess4);
            setG5(data.body.Guess5);
            setG6(data.body.Guess6);
            console.log(g1, g2, g3, g4, g5, g6);

        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Something went wrong!')
            }
        );
    }
    }
}

fetchUserStats();
    return (
        <div className="stat">
            <h1>Stats</h1>
            <h2>Guess1: {g1}</h2>
            <h2>Guess2: {g2}</h2>
            <h2>Guess3: {g3}</h2>
            <h2>Guess4: {g4}</h2>
            <h2>Guess5: {g5}</h2>
            <h2>Guess6: {g6}</h2>
        </div>
    );
}

export default Stats;