import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs, setDoc, deleteDoc } from 'firebase/firestore';


function Feed(props) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let posts = []
    console.log(props.usersLoaded)
    console.log(props.following.length)
    console.log(props)
    if(props.usersLoaded == props.following.length) {
      for(let i = 0; i < props.following.length; i++) {
        const user = props.users.find(el => el.uid == props.following[i])
        console.log("user for feed")
        console.log(user)
        if(user != undefined) {
          posts = [...posts, ...user.posts]
        }
      }

      posts.sort(function(x,y) {
        return x.creation - y.creation
      })

      setPosts(posts)
    }
  }, [props.usersLoaded, props.following, props.users])

  return (
    <View styles = {styles.container}>
      <View styles = {styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
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
  posts: store.userState.posts,
  following: store.userState.following,
  users: store.userState.users,
  usersLoaded: store.usersState.usersLoaded
})

export default connect(mapStateToProps, null)(Feed);