import firebase from "firebase";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {AocInput, AocSubmit, ErrorMessage} from "../groups/JoinGroup";
import {UnicodeSpinner} from "../UnicodeSpinner";
import {useStoreActions} from "easy-peasy";
import styled from "styled-components";

const WagerInput = styled(AocInput)`
  width: 4em;
`

export const SimpleStarsWager = ({opponentUid, myUid, groupId}) => {
    const [submitting, setSubmitting] = useState();
    const {register, handleSubmit, errors} = useForm();

    const [errorMessage, setErrorMessage] = useState(null);
    const [success, setSuccess] = useState(false);

    const loadUser = useStoreActions(actions => actions.loadUser);

    const onSubmit = async data => {
        setSubmitting(true);
        try {
            const wager = {
                opponent: opponentUid,
                uid: myUid,
                groupId: groupId,
                details: {
                    type: 'simpleStars',
                    bet: data.bet,
                    toWin: data.toWin
                }
            }
            await firebase.functions().httpsCallable('createWager')(wager)
            setSuccess(true);
            await loadUser(myUid);
        } catch (error) {
            setErrorMessage(error.message);
        }
        setSubmitting(false);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>
                    Think you'll get more stars?
                </p>
                <span>
                        Bet
                        $<WagerInput name="bet" defaultValue={''} ref={register({required: true})}/>
                    {' '}
                    to win
                        $<WagerInput name="toWin" defaultValue={''} ref={register({required: true})}/>
                    {' '} {(!submitting && !success) && <AocSubmit value='[Propose]'/>}
                    {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
                    </span>

                <p>{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</p>
                <p>{success && ('Wager was proposed!')}</p>
            </form>
        </div>
    )
}