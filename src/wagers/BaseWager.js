/*
    types of wagers to support
        - head to head (with a spread)
        - over / under star total
        - over / under second star total
 */

import React, {useState} from "react";
import {AocRadio, FinePrintItem, Smaller} from "../shared-components";
import styled from "styled-components";
import {useForm} from "react-hook-form";
import firebase from "firebase";
import {AocSubmit, ErrorMessage} from "../groups/JoinGroup";
import {UnicodeSpinner} from "../UnicodeSpinner";
import {FinePrint} from "../FinePrint";

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

const AocSelect = styled.select`
    color: inherit;
    border: 1px solid #666666;
    background: #10101a;
    padding: 0 2px;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
`
const idToObjectMapToArray = (obj) => Object.keys(obj).map(key => ({id: key, ...obj[key]}));

const WagerMemberSelection = ({leaderboard, uid, opponentUid, subject = true, register, name}) => {
    const getAllowedSelections = () => {
        return idToObjectMapToArray(leaderboard?.members ?? {}).filter(member => member.uid)
    }
    return (
        <AocSelect ref={register} name={name} id="actor">
            <option key={uid} value={uid}>{subject ? 'I' : 'Me'}</option>
            {getAllowedSelections().map(member => <option key={member.uid} value={member.uid}> {member.name}</option>)}
        </AocSelect>
    )
}

const WagerDirectionSelect = ({register}) => {
    return (
        <AocSelect ref={register} name="wagerDirection" id="wagerDirection">
            <option value='over'>will</option>
            <option value='under'>won't</option>
        </AocSelect>
    )
}

export const BaseWager = ({opponentUid, myUid, groupId, group}) => {
    const [secondStars, setSecondStars] = useState(false);
    const [completionTime, setCompletionTime] = useState(false);
    const [byDate, setByDate] = useState(true)
    const [headToHead, setHeadToHead] = useState(false)

    const {register, handleSubmit, errors, formState} = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const getFormErrorMessage = (errors) => {
        const messages = {
            actor: "Must select all members of the bet",
            betAmount: "Must select a bet amount",
            completedBy: "Must provide a date",
            hoursToCompletion: "Must provide a number of hours for star completion",
            numStars: "Must provide a nubmer of stars",
            wagerDirection: "Must pick will or won't"
        }

        return messages[Object.keys(errors)[0]]
    }

    const starType = secondStars ? ' second' : '';
    const timeConstraint = completionTime ?
        <span> at least <WagerInput ref={register({required: !!completionTime})} name='hoursToCompletion' type='number'/> hour(s) after they were released </span> : ''
    const dateConstraint = byDate ?
        <span> by <WagerInput ref={register({required:!!byDate})} name='completedBy' type='date' defaultValue='2021-01-10'/> </span> : '';
    const wagerDirection = <span>
        that <WagerMemberSelection name="actor" register={register({required: true})} subject={true} uid={myUid} opponentUid={opponentUid} leaderboard={group.leaderboard}/>
        {' '} <WagerDirectionSelect register={register({required: true})}/> {' '}
    </span>;
    const headToHeadClause = headToHead ? <span> than <WagerMemberSelection name="opponent" register={register} subject={false} uid={myUid} opponentUid={opponentUid} leaderboard={group.leaderboard}/> </span> : ''
    const victoryCondition = headToHead ? 'earn more' :
        <span> earn <WagerInput ref={register({required: !headToHead})} name='numStars' type='number'/> </span>
    const onSubmit = async data => {
        setSubmitting(true);
        setErrorMessage(null);
        setSuccess(false);
        try {
            const wager = {
                proposedTo: opponentUid,
                proposedBy: myUid,
                groupId: groupId,
                details: {
                    actor: data.actor,
                    opponent: data.opponent,
                    bet: data.betAmount,
                    numStars: data.numStars,
                    secondStars: secondStars,
                    hoursToCompletion: data.hoursToCompletion,
                    completedBy: data.completedBy,
                    direction: data.wagerDirection,
                }
            }
            await firebase.functions().httpsCallable('createWager')(wager)
            setSuccess(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
        setSubmitting(false);
    }

    const headToHeadClicked = () => {
        setHeadToHead(!headToHead)
    }

    return (
        <div>
            <WagerOptionsContainer>
                <AocRadio value={secondStars} onClick={() => setSecondStars(!secondStars)}>
                    second stars only
                </AocRadio>
                <AocRadio value={completionTime} onClick={() => {
                    setCompletionTime(!completionTime);
                    setByDate(completionTime);
                }}>
                    each star within a certain time
                </AocRadio>
                <AocRadio value={!!byDate} onClick={() => {
                    setCompletionTime(byDate);
                    setByDate(!byDate);
                }}>
                    by a certain date
                </AocRadio>
                {/*<AocRadio value={!!aboutMe} onClick={aboutMeClicked}>*/}
                {/*    about me*/}
                {/*</AocRadio>*/}
                <AocRadio value={!!headToHead} onClick={headToHeadClicked}>
                    head to head
                </AocRadio>
            </WagerOptionsContainer>
            <br/>
            <div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <span>
                     Bet $<WagerInput ref={register({required: true})} type='number' name='betAmount' min={0}/> {wagerDirection}
                    {victoryCondition} {starType} stars {timeConstraint} {dateConstraint} {headToHeadClause}
                </span>
                <br/>
                <br/>
                {(!submitting && !success) && <AocSubmit value='[Propose]'/>}
                {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
            </form>
            <p>{!formState?.isValid && <ErrorMessage>{getFormErrorMessage(errors)}</ErrorMessage>}</p>
            <p>{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</p>
            <p>{success && ('Wager was proposed!')}</p>
            <br/>
            <br/>
            <FinePrint/>
        </div>
    )
}