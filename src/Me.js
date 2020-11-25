import React from "react";
import {AocLink} from "./shared-components";
import {useStoreState} from "easy-peasy";


export const Me = ({...props}) => {
    const user = useStoreState(state => state.user);
    return (
        <div>
            <p>--- My Groups---</p>
            {user?.groups?.map(group => <p><AocLink key={group} to={`/groups/${group}`}> {group}</AocLink></p>)}

            <p>--- My Wagers ---</p>
            {user?.wagers?.map(wager => <p>{wager.wagerId}</p>)}
        </div>
    )
};