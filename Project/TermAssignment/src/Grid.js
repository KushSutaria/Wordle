import React, { useEffect, useRef, useState } from 'react';
import './Grid.css';

const Grid = () => {
  const correct_answer = "hello";
  const rows = 5;
  const columns = 6;
  const gridItemsRef = useRef([]);

  const [lastFocusedRow, setLastFocusedRow] = useState(0);
  const [lastFocusedColumn, setLastFocusedColumn] = useState(0);

  // create a hashmap of the correct answer and the number of times each letter appears
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
    if (e.key >= 'a' && e.key <= 'z') {
      gridItemsRef.current[row][column].value = e.key;
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
        if (e.key === 'Enter' && (gridItemsRef.current[row][column].value !== "" && gridItemsRef.current[row][column].value.match(/[a-z]/i))
        ) {
          const inputAnswerMap = new Map();

          const value = e.target.value;
          let string = "";
          for (let i = 0; i < rows; i++) {
            string += gridItemsRef.current[i][column].value;
            inputAnswerMap.set(string[i], 0);
          }
          console.log("inputAnswerMap: ", inputAnswerMap);
          console.log("correct_answer_map: ", correct_answer_map);
          for (let i = 0; i < rows; i++) {

              if (string[i] === correct_answer[i]) {
              gridItemsRef.current[i][column].classList.add("correct");
              inputAnswerMap.set(string[i], inputAnswerMap.get(string[i]) + 1);

              //change color of included letter to incorrect
              for(let j = 0; j < i; j++) {
                if(string[j]!==correct_answer[j] && string[j]===string[i] && gridItemsRef.current[j][column].classList.contains("included") && inputAnswerMap.get(string[i]) > correct_answer_map.get(string[i])) {
                  gridItemsRef.current[j][column].classList.remove("included");
                  gridItemsRef.current[j][column].classList.add("incorrect");
                  break;
                }
              }
            }
            else if(string[i]!==correct_answer[i] && inputAnswerMap.get(string[i]) < correct_answer_map.get(string[i])) {
              inputAnswerMap.set(string[i], inputAnswerMap.get(string[i]) + 1);

                gridItemsRef.current[i][column].classList.add("included");

            }

            else if (!correct_answer.includes(string[i]) || string[i] !== correct_answer[i]) {
              inputAnswerMap.set(string[i], inputAnswerMap.get(string[i]) + 1);

              gridItemsRef.current[i][column].classList.add("incorrect");
            }
              console.log(string[i]);
            console.log("inputAnswerMap: ", inputAnswerMap);

          }
          //console.log("inputAnswerMap: ", inputAnswerMap);

          if (string === correct_answer) {
            alert("Correct answer!");

            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < columns; j++) {
                gridItemsRef.current[i][j].disabled = true;
              }
            }
          }

          // If it's the last row, move to the next column
          if (column !== columns - 1) {
            // If the next column is not empty, move to the next column

            gridItemsRef.current[0][column + 1].focus();
          } else {
            if (gridItemsRef.current[row][column].value !== "" && gridItemsRef.current[row][column].value.match(/[a-z]/i)) {
              // If it's the last column, move to the first row
              gridItemsRef.current[0][0].focus();
              if(string!==correct_answer)
                alert("You lost!\nCorrect answer: " + correct_answer);
              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                  gridItemsRef.current[i][j].disabled = true;
                }
              }
            }
          }
        }
      }
    }
  };

  const handleTabKey = (e) => {
    e.preventDefault(); // Prevent default tab behavior
    // Focus on the next input element
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

    // Add the 'Tab' key press event listener to the document
    const handleKeyDown = (e) => {
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
      <h1>Kush's Cloud Project</h1>
      <div className="grid">
        {gridRows}
      </div>
    </div>
  );
};

export default Grid;