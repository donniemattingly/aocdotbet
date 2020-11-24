import React from "react";
import {useParams} from "react-router-dom"

export const Group = ({...props}) => {
    const {groupId} = useParams();
    return (
        <div>
            {groupId}
        </div>
    )
};