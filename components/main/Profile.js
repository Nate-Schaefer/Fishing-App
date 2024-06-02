import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';


function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { currentUser, posts } = props;
    const auth= getAuth();

    if (props.route.params.uid === auth.currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    } 
    else {
      grabUser();
    }
  }, [props.route.params.uid])

  const grabUser = async () => {
    const db = getFirestore(); // Initialize Firestore
    const userDocRef = doc(db, "users", props.route.params.uid); // Corrected to use doc instead of collection
      
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
        setUser(userSnapshot.data());
    } 
    else {
        console.log('User does not exist');
      }
          

    const userPostsRef = collection(db, "posts", props.route.params.uid, "userPosts");
    const q = query(userPostsRef, orderBy("creation", "asc"));
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
        })
        setUserPosts(posts);
      }
      else {
        setUserPosts([]);
      }
  }

  if(user === null) {
    return <View/>
  }
  return (
    <View styles = {styles.container}>
      <View styles = {styles.containerInfo}>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      </View>

      <View style= {styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
              />
            </View>
          )}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40
  },
  containerInfo: {
    margin: 20
  },
  containerGallery: {
    flex: 1
  },
  image: {
    flex: 1,
    aspectRatio: 1/1
  },
  containerImage: {
    flex: 1/3
  }
})
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile);