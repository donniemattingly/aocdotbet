import React from "react";
import {AocLink} from "./shared-components";
import {useStoreState} from "easy-peasy";
import {WagerRow} from "./wagers/WagerRow";

export const Me = ({...props}) => {
    const user = useStoreState(state => state.user);
    const auth = useStoreState(state => state.auth);

    return (
        <div>
            <p>--- My Groups---</p>
            {user?.groups?.map(group => <p><AocLink key={group} to={`/groups/${group}`}> {group}</AocLink></p>)}

            <p>--- My Wagers ---</p>
            {Object.values(user?.wagers ?? {}).map(wager => <WagerRow wager={wager} auth={auth} linkToWager={true}/> )}
        </div>
    )
};