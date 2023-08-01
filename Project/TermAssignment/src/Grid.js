import React, { useEffect, useRef, useState } from 'react';
import './css/Grid.css';
import Keyboard from './Keyboard';
import Icon from './Icon';
import Stats from './Stats';

const Grid = () => {
  let answer = "";
  const newWord=process.env.REACT_APP_FETCH_NEW_WORD_URL;
  const updateGuess=process.env.REACT_APP_UPDATE_GUESS_URL;
  const stat=process.env.REACT_APP_FETCH_STATS_URL;

  const fetchAnswer = () => {
    if(!localStorage.getItem("word")){
      fetch(newWord,
      {
        method: 'POST'
      }
        
        )
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
        answer = data.Word;
        console.log(data.Word);
        localStorage.setItem("word", data.Word);
    }
    )
    .catch((error) => {
        console.error('Error:', error);
        //alert('Something went wrong!')
        }
    );
    }
    else{
      answer = localStorage.getItem("word");
    }
  }

  if(!localStorage.getItem("word")){
    fetchAnswer();
  }
  else{
    answer = localStorage.getItem("word");
    // call fetchAnswer every 10 seconds

  }
  const RemoveWord = () => {
    if(localStorage.getItem("word"))
    localStorage.removeItem("word");
    fetchAnswer();
  }
  //remove word from local storage after every 10 seconds
  useEffect(() => {
    // Set up the interval when the component mounts
    const intervalId = setInterval(RemoveWord, 10000);

    // Clean up the interval when the component unmounts to avoid memory leaks
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  
  let correct_answer=answer.toUpperCase();
  const rows = 5;
  const columns = 6;
  const gridItemsRef = useRef([]);
  const keyboardKeys = document.querySelectorAll('.keyboard-key');

  const [lastFocusedRow, setLastFocusedRow] = useState(0);
  const [lastFocusedColumn, setLastFocusedColumn] = useState(0);

  const correct_answer_map = new Map();
  for (let i = 0; i < correct_answer.length; i++) {
    if (correct_answer_map.has(correct_answer[i])) {
      correct_answer_map.set(correct_answer[i], correct_answer_map.get(correct_answer[i]) + 1);
    }
    else {
      correct_answer_map.set(correct_answer[i], 1);
    }
  }

  const handleInput = (e, row, column) => {
    if ((e.key >= 'a' && e.key <= 'z')) {
      gridItemsRef.current[row][column].value = e.key.toUpperCase();
      if (row !== rows - 1) {
        gridItemsRef.current[row + 1][column].focus();
      }
    } else if (e.key === 'Backspace') {
      gridItemsRef.current[row][column].value = "";
      if (row !== 0) {
        gridItemsRef.current[row - 1][column].focus();
      }
    } else {
      if (row === rows - 1) {
        if (e.key === 'Enter' && (gridItemsRef.current[row][column].value !== "" && gridItemsRef.current[row][column].value.match(/[A-Z]/i))
        ) {
          const inputAnswerMap = new Map();

          let string = "";
          for (let i = 0; i < rows; i++) {
            string += gridItemsRef.current[i][column].value;
            inputAnswerMap.set(string[i], 0);
          }
          console.log("inputAnswerMap: ", inputAnswerMap);
          console.log("correct_answer_map: ", correct_answer_map);
          fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+string)
          .then(response => {
            
            if(response.ok) {
 


          for (let i = 0; i < rows; i++) {

              if (string[i].toUpperCase() === correct_answer[i].toUpperCase()) {
              gridItemsRef.current[i][column].classList.add("correct");
              inputAnswerMap.set(string[i], inputAnswerMap.get(string[i]) + 1);

              //change color of included letter to incorrect
              for(let j = 0; j < i; j++) {
                if(string[j].toUpperCase()!==correct_answer[j].toUpperCase() && string[j].toUpperCase()===string[i].toUpperCase() && gridItemsRef.current[j][column].classList.contains("included") && inputAnswerMap.get(string[i]) > correct_answer_map.get(string[i])) {
                  gridItemsRef.current[j][column].classList.remove("included");
                  gridItemsRef.current[j][column].classList.add("incorrect");
                  break;
                }
              }
            }
            else if(string[i].toUpperCase()!==correct_answer[i].toUpperCase() && inputAnswerMap.get(string[i]) < correct_answer_map.get(string[i])) {
              inputAnswerMap.set(string[i], inputAnswerMap.get(string[i]) + 1);

                gridItemsRef.current[i][column].classList.add("included");

            }

            else if (!correct_answer.toUpperCase().includes(string[i].toUpperCase()) || string[i].toUpperCase() !== correct_answer[i].toUpperCase()) {
              inputAnswerMap.set(string[i], inputAnswerMap.get(string[i]) + 1);

              gridItemsRef.current[i][column].classList.add("incorrect");
            }
            keyboardKeys.forEach((item) => {
              if(gridItemsRef.current[i][column].classList.contains("correct") && string[i].toUpperCase().includes(item.innerHTML)) {
                item.classList.remove("included");
                item.classList.add("correct");
              }
              else if(!item.classList.contains("correct") && gridItemsRef.current[i][column].classList.contains("included") && string[i].toUpperCase().includes(item.innerHTML)) {
                item.classList.add("included");
              }
              else if(!item.classList.contains("correct") && gridItemsRef.current[i][column].classList.contains("incorrect") && string[i].toUpperCase().includes(item.innerHTML )) {
                item.classList.add("incorrect");
              }
              if(gridItemsRef.current[i][column].classList.contains("correct") && string[i].toUpperCase().includes(item.innerHTML)) {
                item.classList.remove("included");
                item.classList.remove("incorrect");
                item.classList.add("correct");
              }

            }
            );
          }

          if (string.toUpperCase() === correct_answer.toUpperCase()) {
            alert("Correct answer!");

            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < columns; j++) {
                gridItemsRef.current[i][j].disabled = true;
              }
            }
            let addition=column+1;
            console.log("Guess"+addition)
            fetch(updateGuess, {
              method: 'POST',
              body: JSON.stringify({
                "email": localStorage.getItem("user"),
                "guess": "Guess" + addition
              })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
                
            Stats.fetchUserStats()
          }

          // If it's the last row, move to the next column
          if (column !== columns - 1) {
            // If the next column is not empty, move to the next column

            gridItemsRef.current[0][column + 1].focus();
          } else {
            if (gridItemsRef.current[row][column].value !== "" && gridItemsRef.current[row][column].value.match(/[a-z]/i)) {
              // If it's the last column, move to the first row
              gridItemsRef.current[0][0].focus();
              if(string.toUpperCase()!==correct_answer.toUpperCase())
                alert("You lost!\nCorrect answer: " + correct_answer.toUpperCase());
              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                  gridItemsRef.current[i][j].disabled = true;
                }
              }
            }
          }
        }if(!response.ok) {
            alert("Congratulations!, you've invented a new word!")
            return;
          }
        })
        .catch(error => {
          console.log(error);
          return error;
        });
        }
      }
    }
  };
  
  if(localStorage.getItem("user")) {
    fetch(stat, {
      method: 'POST',
      body: JSON.stringify({
        "email": localStorage.getItem("user"),
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if(data.body.solvedCurrent===true) {
        alert("You've solved this puzzle before!")

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          gridItemsRef.current[i][j].disabled = true;
        }
      }
    }
  }
    )
    .catch(error => console.log(error));

  }
  const handleTabKey = (e) => {
    e.preventDefault(); 
    gridItemsRef.current[lastFocusedRow][lastFocusedColumn].focus();
  };

  useEffect(() => {
    if (lastFocusedRow === null && lastFocusedColumn === null) {
      gridItemsRef.current[0][0].focus();
    }
    const gridItems = document.querySelectorAll('.grid-item');
    gridItemsRef.current = Array.from(gridItems).reduce((acc, item, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      if (!acc[row]) {
        acc[row] = [];
      }
      acc[row][column] = item;
      return acc;
    }, []);

    const handleKeyUp = (e) => {
      if(e.key === 'Shift') {
        e.preventDefault(); }
      if (e.key === 'Tab') {
        handleTabKey(e);
      } else {
        const index = Array.from(gridItems).findIndex((item) => item === e.target);
        if (index !== -1) {
          const row = Math.floor(index / columns);
          const column = index % columns;
          handleInput(e, row, column);
        }
      }
    };

    const handleBlur = (e) => {
      
      const index = Array.from(gridItems).findIndex((item) => item === e.target);
      if (index !== -1) {
        const row = Math.floor(index / columns);
        const column = index % columns;
        setLastFocusedRow(row);
        setLastFocusedColumn(column);
      }
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
    };

    gridItems.forEach((item) => {
      item.addEventListener('keyup', handleKeyUp);
      item.addEventListener('blur', handleBlur);
      item.addEventListener('mousedown', handleMouseDown);
    });

    const handleKeyDown = (e) => {
      e.preventDefault();
      if (e.key === 'Tab') {
        handleTabKey(e);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      gridItems.forEach((item) => {
        item.removeEventListener('keyup', handleKeyUp);
        item.removeEventListener('blur', handleBlur);
        item.removeEventListener('mousedown', handleMouseDown);
      });

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastFocusedRow, lastFocusedColumn]);


  const gridRows = [];
  for (let i = 0; i < rows; i++) {
    const gridItems = [];
    for (let j = 0; j < columns; j++) {
      gridItems.push(
        <div key={`${i}-${j}`}>
          <input
            type="text"
            className="grid-item"
            maxLength={1}
            style={{ width: '50px', height: '50px', fontSize: '30px', textAlign: 'center' }}
            autoFocus={lastFocusedRow === i && lastFocusedColumn === j}
          />
        </div>
      );
    }
    gridRows.push(<div className="row" key={i}>{gridItems}</div>);

    
  }

  return (
    <div>
      <Icon/>
      <h1 className='grid-h1'>Kush's Cloud Project</h1>
      <Stats/>

      <div className="grid">
        {gridRows}
      </div>
      <Keyboard />

      <a  href="https://icons8.com/icon/23265/user" style={{color:'white'}}>User icon by </a> 
      <a href="https://icons8.com" style={{color:'white'}}>Icons8</a>
      
        </div>
  );
};

export default Grid;