import {Text, View } from 'react-native';
import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux/reducers';

const store = configureStore({
  reducer: rootReducer,
});


const firebaseConfig = {
  apiKey: "AIzaSyA5mSoTNgadGvrtgECk1p0CrLBgOg11Q5U",
  authDomain: "fishing-app-5f929.firebaseapp.com",
  projectId: "fishing-app-5f929",
  storageBucket: "fishing-app-5f929.appspot.com",
  messagingSenderId: "32985637684",
  appId: "1:32985637684:web:983f3a46eb08899f2a3b61",
  measurementId: "G-243PQV9HBV"
};

if(getApps.length === 0){
  initializeApp(firebaseConfig)
}

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add';
import Save from './components/main/Save';
import Comment from './components/main/Comment';

const Stack = createStackNavigator();


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={Landing} options={{headerShown: false}}/>
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
      )
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={Main} options={{headerShown: true}}/>
            <Stack.Screen name="Add" component={Add} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={Save} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={Comment} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App