import React from "react";
import {AocLink} from "../shared-components";
import styled from 'styled-components';

/*
    Wagers are between bettors and about one or more actors
        proposedBy: person who initiated the bet
        proposedTo: person to whom the bet was proposed
        actor: person upon whose outcome the bet depends
        opponent: person whose outcome determines the parameters of the wager about the actor (optional)
        contest: the specifics of the bet (# of stars, time constraints, etc)

    For example, a wager between Jack proposed to Jill saying Jack will get more stars than Jill
        proposedBy: Jack
        proposedTo: Jill
        actor:      Jack
        opponent:   Jill

    For example, a wager between Jack proposed to Jill saying Jack will get more than 10 stars
        proposedBy: Jack
        proposedTo: Jill
        actor:      Jack
        opponent:   null

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
 */

const namesFromUids = (auth, wager) => {
    const getName = (key) => {
        if (wager[key]?.uid === auth?.id) {
            return ['actor', 'proposedBy'].includes(key) ? 'I' : 'Me'
        } else {
            return wager[key]?.name;
        }
    }

    return ['proposedTo', 'proposedBy', 'actor', 'opponent']
        .map(key => [key, getName(key)])
        .reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
}

export const getWagerDescription = (wager, auth) => {
    const {bet, numStars, secondStars, hoursToCompletion, completedBy, direction, spread} = wager.details;
    const names = namesFromUids(auth, wager)

    const amountAndParties = wager.status === 'open' ? `${names['proposedBy']} proposed a bet of $${bet}` : `${names['proposedBy']} bet ${names['proposedTo']} $${bet}`

    const starType = secondStars ? ' second' : '';
    const willOrWont = direction === 'over' ? 'will' : `won't`
    const timeConstraint = hoursToCompletion ? `at least ${hoursToCompletion} hour(s) after they were released` : ''
    const dateConstraint = completedBy ? `by ${completedBy}` : '';
    const headToHeadStarsMetric = spread ? `${spread} more` : 'more'
    const starsMetric = wager.opponent ? headToHeadStarsMetric : numStars;
    const opponentClause = wager.opponent ? `than ${names['opponent']}` : '';

    const wagerDetails = `${names['actor']} ${willOrWont} earn at least ${starsMetric} ${starType} stars ${timeConstraint} ${dateConstraint} ${opponentClause}`
    return `${amountAndParties} that ${wagerDetails}`
}

const WagerRowContainer = styled.div`
  padding-bottom: 1em;
`

export const WagerRow = ({wager, auth, linkToWager}) => {
    return (
        <WagerRowContainer>
            {(wager.status === 'pending' && linkToWager) && <span>
                <AocLink to={`/groups/${wager.groupId}/wagers/${wager.id}`}>Pending:</AocLink>
            </span>}
            {(wager.status === 'pending' && !linkToWager) && 'Pending: '}
            {wager.status === 'booked' && 'Booked: '}
            <span> {getWagerDescription(wager, auth)} </span>
        </WagerRowContainer>
    )
}