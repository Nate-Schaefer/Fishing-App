import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from '../constants/index'; // Ensure this path is correct

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

export function fetchUserPosts() {
    return async (dispatch) => {
        const db = getFirestore(); // Initialize Firestore
        const auth = getAuth(); // Initialize Firebase Auth
        const user = auth.currentUser;
        if (user) {
            const userPostsRef = collection(db, "posts", user.uid, "userPosts");
            const q = query(userPostsRef, orderBy("creation", "asc"));
            try {
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data };
                    })
                    dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
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