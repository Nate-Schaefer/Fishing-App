import React, {useState} from 'react'
import { TextInput, View, Image, Button } from 'react-native'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';


export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image
        const auth = getAuth()
        const storage = getStorage()
        const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, childPath);
        const task = uploadBytesResumable(storageRef, blob)
        const taskProgress = snapshot => {
            console.log(snapshot)
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            getDownloadURL(task.snapshot.ref).then((snapshot) => {
                savePostData(snapshot)
                console.log(snapshot)
            })

        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        const auth = getAuth();
        const db = getFirestore();
        const userPostsRef = collection(db, "posts", auth.currentUser.uid, "userPosts");
        const postData = {
            downloadURL,
            caption,
            creation: serverTimestamp() // Ensure firebase is imported correctly
        };
        setDoc(doc(userPostsRef), postData).then(() => {
            props.navigation.popToTop();
        }).catch(error => console.error("Error adding document: ", error));
    }
  return (
    <View style={{flex:1}}>
      <Image source={{uri: props.route.params.image}}/>
      <TextInput placeholder="Write a Caption . . . "
      onChangeText={(caption) => setCaption(caption)}/>
      <Button title="Save" onPress={() => uploadImage()}/>
    </View>
  )
}
