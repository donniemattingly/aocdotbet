import React from "react";
import {AocLink} from "./shared-components";
import {useStoreState} from "easy-peasy";
import {WagerInput} from "./wagers/BaseWager";


const WagerRow = ({wager, auth}) => {
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

    return (
        <div>
            {wager.status === 'pending' && <span>Pending: </span>}
            <span>
                {wagerDirection} earn {numStars} {starType} stars {timeConstraint} {dateConstraint}
            </span>
        </div>
    )
}
export const Me = ({...props}) => {
    const user = useStoreState(state => state.user);
    const auth = useStoreState(state => state.auth);

    return (
        <div>
            <p>--- My Groups---</p>
            {user?.groups?.map(group => <p><AocLink key={group} to={`/groups/${group}`}> {group}</AocLink></p>)}

            <p>--- My Wagers ---</p>
            {user?.wagers?.map(wager => <WagerRow wager={wager} auth={auth}/> )}
        </div>
    )
};