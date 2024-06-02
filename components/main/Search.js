import React, {useState} from 'react'
import { Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { getFirestore, where, getDocs, query, collection } from 'firebase/firestore';


export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = async (search) => {
        const db = getFirestore(); // Initialize Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("name", ">=", search));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUsers(fetchedUsers);
    }
  return (
    <View>
      <TextInput placeholder="Type here" onChangeText={(search) => fetchUsers(search)}/>
        <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({item}) => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>

                    <Text>{item.name}</Text>
                    </TouchableOpacity>
            )}/>
    </View>
  )
}
