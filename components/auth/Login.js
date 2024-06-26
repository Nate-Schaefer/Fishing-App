import React, { Component } from 'react'
import { TextInput, View, Button } from 'react-native'
import { signInWithEmailAndPassword, getAuth} from 'firebase/auth'

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password } = this.state
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }
  render() {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <TextInput placeholder="email" onChangeText={(email) => this.setState({email})}/>
            <TextInput placeholder="password" secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
            <Button onPress={() => this.onSignUp()} title="Sign In"/>
        </View>
    )
  }
}

export default Login