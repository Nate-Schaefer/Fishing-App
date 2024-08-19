import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from '../constants/index'; // Ensure this path is correct

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
                        return { id, ...data, creation };
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

export function fetchUserFollowing() {
    return async (dispatch) => {
        const db = getFirestore(); // Initialize Firestore
        const auth = getAuth(); // Initialize Firebase Auth
        const user = auth.currentUser;
        if (user) {
            const userPostsRef = collection(db, "following", user.uid, "userFollowing");
            try {
                const snapshot = await getDocs(userPostsRef);
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id;
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
                for(let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i]));
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('No user logged in');
        }
    };
}

export function fetchUsersData(uid) {
    return async (dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid == uid)
        const db = getFirestore(); // Initialize Firestore
        if (!found) {
            const userDocRef = doc(db, "users", uid);
            try {
                const snapshot = await getDoc(userDocRef);
                if (snapshot.exists()) {
                    let user = snapshot.data()  ;
                    user.uid = snapshot.id;
                    dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                    dispatch(fetchUsersFollowingPosts(user.uid))
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

export function fetchUsersFollowingPosts(uid) {
    return async (dispatch, getState) => {
        const db = getFirestore(); // Initialize Firestore
        const auth = getAuth(); // Initialize Firebase Auth
        const user = auth.currentUser;
        if (user) {
            const userPostsRef = collection(db, "posts", uid, "userPosts");
            const q = query(userPostsRef, orderBy("creation", "asc"));
            try {
                const snapshot = await getDocs(q);
                if (!snapshot.empty) { 
                    const uid = snapshot.docs[0].ref.path.split('/')[1];
                    const user = getState().usersState.users.find(el => el.uid == uid)
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data, user };
                    })
                    dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid});
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