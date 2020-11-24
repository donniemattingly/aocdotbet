import firebase from "firebase";
import {useCallback, useEffect, useRef} from "react";
import {useStoreActions} from "easy-peasy";


export const useFirebaseAuth = () => {
    const setAuth = useStoreActions(actions => actions.setAuth);
    const loadUser = useStoreActions(actions => actions.loadUser);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setAuth(user);
                loadUser(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);
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