import React from "react";
import {AocLink} from "./shared-components";


export const Groups = ({...props}) => {

  return (
      <div>
          <br/>
          Not in a group? You can <AocLink to={'/groups/create'}> [Create One]</AocLink>
      </div>
  )
};