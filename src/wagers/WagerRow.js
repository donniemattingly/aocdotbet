import React from "react";
import {AocLink} from "../shared-components";

export const getWagerDescription = (wager, auth) => {
    const {bet, numStars, secondStars, hoursToCompletion, completedBy, aboutMe} = wager.details;

    const starType = secondStars ? ' second' : '';
    const timeConstraint = hoursToCompletion ? `at least ${hoursToCompletion} hour(s) after they were released`: ''
    const dateConstraint = completedBy ? `by ${completedBy}` : '';
    let wagerDirection;
    const proposedByMe = wager.proposedBy.uid === auth.id;
    const initiator = proposedByMe ? `I bet ${wager.proposedTo.name} $${bet} that` : `${wager.proposedBy.name} bet me $${bet} that`
    if(aboutMe){
        if(proposedByMe){
            wagerDirection = `${initiator} that I will`
        } else {
            wagerDirection = `${initiator} they will`
        }
    } else {
        if(proposedByMe){
            wagerDirection = `${initiator} they won't`
        } else {
            wagerDirection = `${initiator} I won't`
        }
    }

    return `${wagerDirection} earn ${numStars} ${starType} stars ${timeConstraint} ${dateConstraint}`
}


export const WagerRow = ({wager, auth}) => {

    return (
        <div>
            {wager.status === 'pending' && <span>
                <AocLink to={`/groups/${wager.groupId}/wagers/${wager.id}`}>Pending:</AocLink>
            </span>}
            {wager.status == 'booked' && 'Booked: '}
            <span> {getWagerDescription(wager, auth)} </span>
        </div>
    )
}