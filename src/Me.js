import React from "react";
import {AocLink} from "./shared-components";
import {useStoreState} from "easy-peasy";


export const Me = ({...props}) => {
    const user = useStoreState(state => state.user);
    return (
        <div>
            <p>--- Me ---</p>
            {user?.groups?.map(group => <AocLink key={group} to={`/groups/${group}`}> {group}</AocLink>)}
        </div>
    )
};