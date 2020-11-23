import {action, computed, createStore, thunk} from "easy-peasy";
import firebase from "firebase";

export const store = createStore({
    auth: {loggedIn: false},
    loggedIn: computed(state => state.auth.loggedIn),
    setAuth: action((state, user) => {
        if (user) {
            return {
                ...state,
                auth: {
                    loggedIn: true,
                    name: user.displayName,
                    id: user.uid,
                }
            }
        } else {
            return {
                ...state,
                auth: {loggedIn: false}
            }
        }
    }),
    signOut: thunk(async (actions, payload) => {
        console.log('signing out');
        await firebase.auth().signOut();
        actions.setAuth(null);
    })
});