/*
    types of wagers to support
        - head to head (with a spread)
        - over / under star total
        - over / under second star total
 */

import React, {useState} from "react";
import {AocRadio, AocRadioSpan} from "../shared-components";
import styled from "styled-components";
import {useForm} from "react-hook-form";
import firebase from "firebase";
import {AocSubmit, ErrorMessage} from "../groups/JoinGroup";
import {UnicodeSpinner} from "../UnicodeSpinner";

const getWagerText = (starsTotal, secondStars, completionTime) => {
    const starType = secondStars ? ' second' : '';
    const timeConstraint = completionTime ? ` at least ${completionTime} after they were released` : ''
    return `earn ${starsTotal}${starType} stars${timeConstraint}`
}

export const WagerInput = styled.input`
    color: inherit;
    border: 1px solid #666666;
    background: #10101a;
    padding: 0 2px;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    width: ${props => props.type === 'date' ? '9em' : '2em'};
    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }
`

const WagerOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const BaseWager = ({opponentUid, myUid, groupId}) => {
    const [starsTotal, setStarsTotal] = useState(10);
    const [secondStars, setSecondStars] = useState(false);
    const [completionTime, setCompletionTime] = useState(false);
    const [byDate, setByDate] = useState(true)
    const [aboutMe, setAboutMe] = useState(false)

    const {register, handleSubmit, errors} = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const starType = secondStars ? ' second' : '';
    const timeConstraint = completionTime ?
        <span> at least <WagerInput ref={register()} name='hoursToCompletion' type='number'/> hour(s) after they were released </span> : ''
    const dateConstraint = byDate ? <span> by <WagerInput ref={register()} name='completedBy' type='date' value='2021-01-01'/> </span> : '';
    const wagerDirection = aboutMe ? 'that I will ' : 'that they won\'t ';

    const onSubmit = async data => {
        setSubmitting(true);
        setErrorMessage(null);
        setSuccess(false);
        try {
            const wager = {
                opponent: opponentUid,
                uid: myUid,
                groupId: groupId,
                details: {
                    bet: data.betAmount,
                    numStars: data.numStars,
                    secondStars: secondStars,
                    hoursToCompletion: data.hoursToCompletion,
                    completedBy: data.completedBy,
                    aboutMe: aboutMe
                }
            }
            await firebase.functions().httpsCallable('createWager')(wager)
            setSuccess(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
        setSubmitting(false);
    }

    return (
        <div>
            <WagerOptionsContainer>
                <AocRadio value={secondStars} onClick={() => setSecondStars(!secondStars)}>
                    second stars only
                </AocRadio>
                <AocRadio value={completionTime} onClick={() => {setCompletionTime(!completionTime); setByDate(completionTime);}}>
                    each star within a certain time
                </AocRadio>
                <AocRadio value={!!byDate} onClick={() => {setCompletionTime(byDate); setByDate(!byDate);}}>
                    by a certain date
                </AocRadio>
                <AocRadio value={!!aboutMe} onClick={() => setAboutMe(!aboutMe)}>
                    about me
                </AocRadio>
            </WagerOptionsContainer>
            <br/>
            <div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <span>
                     Bet $<WagerInput ref={register()} type='number' name='betAmount'/> {wagerDirection}
                     earn <WagerInput ref={register()} name='numStars' type='number'/>
                     {starType} stars {timeConstraint} {dateConstraint}
                </span>
                <br/>
                {(!submitting && !success) && <AocSubmit value='[Propose]'/>}
                {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
            </form>

            <p>{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</p>
            <p>{success && ('Wager was proposed!')}</p>
        </div>
    )
}