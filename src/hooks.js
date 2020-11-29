import firebase from "firebase";
import {useCallback, useEffect, useRef, useState} from "react";
import {useStoreActions} from "easy-peasy";


export const useFirebaseAuth = () => {
    const signIn = useStoreActions(actions => actions.signIn);
    const setUserAction = useStoreActions(actions => actions.setUser);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                signIn(user).catch();
                setUser(user);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            firebase.firestore().collection('users').doc(user.uid).onSnapshot((u) => {
                if (u.exists) {
                    console.log('updating user');
                    setUserAction(u.data())
                }
            })
        }
        // return () => unsubscribe();
    }, [user]);
}

export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}