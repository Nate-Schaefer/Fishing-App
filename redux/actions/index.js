import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { USER_STATE_CHANGE } from '../constants/index'; // Ensure this path is correct

export function fetchUser() {
    return async (dispatch) => {
        const db = getFirestore(); // Initialize Firestore
        const auth = getAuth(); // Initialize Firebase Auth
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            try {
                const snapshot = await getDoc(userDocRef);
                if (snapshot.exists()) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
                } else {
                    console.log('User does not exist');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('No user logged in');
        }
    };
}