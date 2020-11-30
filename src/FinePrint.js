import {FinePrintItem, Smaller} from "./shared-components";
import React from "react";

export const FinePrint = () => {
    return (
        <Smaller>
            <strong>Fine Print</strong>
            <ul>
                <FinePrintItem>
                    Stars must be earned the old-fashioned way. No copying code from reddit (or elsewhere).
                </FinePrintItem>
                <FinePrintItem>
                    Head to Head wagers ties are broken by whoever received their last star first
                </FinePrintItem>
                <FinePrintItem>
                    You must be willing to share your code if the other person requests it
                </FinePrintItem>
                <FinePrintItem>
                    Bets can be proposed at any time, even during the competition (accept carefully).
                </FinePrintItem>
            </ul>
        </Smaller>
    )
}