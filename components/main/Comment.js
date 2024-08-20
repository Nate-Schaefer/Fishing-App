import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, Button, TextInput} from 'react-native'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, addDoc, getDoc, collection, query, orderBy, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions/index';

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {
        function matchUserToComment(comments) {
            for(let i = 0; i < comments.length; i++) {
                if(comments[i].hasOwnProperty('user')) {
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator);
                if(user == undefined) {
                    props.fetchUsersData(comments[i].creator, false);
                } else {
                    comments[i].user = user;
                }
            }
            setComments(comments);
        }
            if (props.route.params.postId !== postId) {
                const db = getFirestore(); // Initialize Firestore
                const postDocRef = doc(db, "posts", props.route.params.uid, "userPosts", props.route.params.postId);
                const commentsCollectionRef = collection(postDocRef, "comments");
                onSnapshot(commentsCollectionRef, (snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data };
                    });
                    matchUserToComment(comments);
                });
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments);
        }
    }, [props.route.params.postId, props.users])

    const onComment = async () => {
        const db = getFirestore(); // Initialize Firestore
        const postDocRef = doc(db, "posts", props.route.params.uid, "userPosts", props.route.params.postId);
        const commentsCollectionRef = collection(postDocRef, "comments");
        try {
            await addDoc(commentsCollectionRef, {
                creator: getAuth().currentUser.uid,
                text: text
            });
            console.log(text)
            setText(""); // Clear the text input after posting the commen
            console.log(text)

        } catch (error) {
            console.error("Error adding comment: ", error);
        }    
    }

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined ?
                            <Text>{item.user.name}</Text> 
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View>
            <TextInput
                placeholder="Comment..."
                onChangeText={(text) => setText(text)}
            />
            <Button
                onPress={() => onComment()}
                title="Post Comment"
            />
            </View>
        </View>
  )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
});
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comment);