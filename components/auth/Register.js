import React, { Component } from 'react';
import { TextInput, View, Button } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Correct imports for Firestore

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        };

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password, name } = this.state;
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                const db = getFirestore(); // Initialize Firestore
                await setDoc(doc(db, "users", result.user.uid), {
                    name,
                    email
                });
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <TextInput placeholder="name" onChangeText={(name) => this.setState({name})}/>
                <TextInput placeholder="email" onChangeText={(email) => this.setState({email})}/>
                <TextInput placeholder="password" secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                <Button onPress={() => this.onSignUp()} title="Sign Up"/>
            </View>
        );
    }
}

export default Register;