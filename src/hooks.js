import firebase from "firebase";
import {useEffect} from "react";
import {useStoreActions} from "easy-peasy";


export const useFirebaseAuth = () => {
    const setAuth = useStoreActions(actions => actions.setAuth);
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setAuth(user);
            }
        });
        return () => unsubscribe();
    }, []);
}