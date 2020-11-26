import React from "react";
import {AocLink} from "./shared-components";
import {useStoreState} from "easy-peasy";


const WagerRow = ({wager}) => {
    return (
        <div>
            {wager.wager.status === 'pending' && <span>Pending: </span>}
            <span>
                ${wager.wager.wager.bet} to win ${wager.wager.wager.toWin} that you'll get
                more stars than <AocLink to={`/groups/${wager.groupId}/wagers/${wager.wagerId}`}>{wager.wager.opponent}</AocLink>
            </span>
        </div>
    )
}
export const Me = ({...props}) => {
    const user = useStoreState(state => state.user);
    return (
        <div>
            <p>--- My Groups---</p>
            {user?.groups?.map(group => <p><AocLink key={group} to={`/groups/${group}`}> {group}</AocLink></p>)}

            <p>--- My Wagers ---</p>
            {user?.wagers?.map(wager => <WagerRow wager={wager}/> )}
        </div>
    )
};