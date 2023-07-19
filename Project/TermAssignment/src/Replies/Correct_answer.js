//return list of correct answers
import React from 'react';
import './Correct_answer.css';

export default function Correct_answer(props) {
    const {correct_answer} = props;
    return (
        <div className="correct_answer">
        <h1>Correct answer: {correct_answer}</h1>
        </div>
    );

}