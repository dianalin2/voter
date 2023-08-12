'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Form(props) {
    const { poll, token, baseUrl } = props;

    const originalResponses = {}

    poll.questions.forEach(question => {
        if (question.votes.length === 0)
            return;

        originalResponses[question._id] = {
            'options': question.votes[0].options ?? []
        };
    });

    const [state, setState] = useState({
        currQuestionIdx: 0,
        currQuestion: poll.questions[0]._id,
        responses: originalResponses,
        buttonText: 'Save Responses'
    });

    const checkOption = (e) => {
        const currQuestion = poll.questions[state.currQuestionIdx];
        const optionId = e.target.id;

        const responses = state.responses;

        const checked = e.target.checked;

        if (currQuestion.multiSelect) {
            if (checked) {
                responses[currQuestion._id] = {
                    'options': [...responses[currQuestion._id]?.options ?? [], optionId]
                }
            } else {
                responses[currQuestion._id] = {
                    'options': responses[currQuestion._id]?.options.filter(option => option !== optionId)
                }
            }
        } else {
            responses[currQuestion._id] = {
                'options': checked ? [optionId] : []
            }
        }
    };

    const questionDivs = poll.questions.map(question => {
        return (
            <div key={question._id} className={styles.QuestionDiv + (state.currQuestion === question._id ? ' ' + styles.QuestionDivActive : '')}>
                <h2 className={styles.QuestionTitle}>{question.question}</h2>
                <div className={styles.Options}>
                    {
                        question.options.map(option => {
                            return (
                                <label htmlFor={option._id} key={option._id}>
                                    <div className={styles.Option}>
                                        <input type={question.multiSelect ? "checkbox" : "radio"} name={question._id} id={option._id} onChange={checkOption} defaultChecked={question._id in originalResponses && originalResponses[question._id].options.find(id => id === option._id)} />
                                        <div>
                                            <h3>{option.title}</h3>
                                            <p>{option.description}</p>
                                        </div>
                                    </div>
                                </label>
                            );
                        })
                    }
                </div>
                {poll.canUpdateVote ? <span><em>You may update your vote at a later time.</em></span> : null}
            </div>
        );
    });

    const switchQuestion = (dir) => {
        const newQuestionIdx = Math.min(Math.max(state.currQuestionIdx + dir, 0), poll.questions.length - 1);
        setState({ ...state, currQuestionIdx: newQuestionIdx, currQuestion: poll.questions[newQuestionIdx]._id })
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const res = await fetch(`${baseUrl}/api/poll/${poll._id}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(state.responses)
        });

        await res.json();

        // window.location.href = `/poll/${poll._id}/results`;
        setState({ ...state, buttonText: 'Saved!' });
        setTimeout(() => setState({ ...state, buttonText: 'Save Responses' }), 1000);
    };

    return (
        <form className="VertCenter MainWidth" onSubmit={submitForm}>
            <h1 className={styles.PollTitle}>{poll.title}</h1>
            <div className={styles.Questions}>
                {questionDivs}
            </div>

            <div className={styles.ProgressButtons}>
                <button type="button" className={styles.Progress} onClick={() => switchQuestion(-1)} disabled={state.currQuestionIdx === 0}>{'<'}</button>
                <button type="button" className={styles.Progress} onClick={() => switchQuestion(+1)} disabled={state.currQuestionIdx === poll.questions.length - 1}>{'>'}</button>
            </div>

            <button type="submit" className={[styles.Submit, styles.Progress].join(' ')}>{state.buttonText}</button>
        </form>
    );
}
