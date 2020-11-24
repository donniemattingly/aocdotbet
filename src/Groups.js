import React from "react";
import {AocLink} from "./shared-components";
import {useStoreState} from "easy-peasy";


export const Groups = ({...props}) => {
    const user = useStoreState(state => state.user);
  return (
      <div>
          <p>--- Groups ---</p>
          {user?.groups?.map(group => <AocLink key={group} to={`/groups/${group}`}> {group}</AocLink>)}
          <p>Not in a group? You can <AocLink to={'/groups/create'}> [Create One]</AocLink></p>
      </div>
  )
};