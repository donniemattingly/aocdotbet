import firebase from "firebase";
import {useEffect} from "react";
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