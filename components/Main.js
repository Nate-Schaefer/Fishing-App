import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserFollowing, fetchUserPosts, clearData } from '../redux/actions/index';

import Feed from './main/Feed';
import Add from './main/Add';
import Profile from './main/Profile';
import Search from './main/Search';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null);
}
export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }


  render() {
    return (
        <Tab.Navigator initialRouteName="Feed" labeled={false}>
            <Tab.Screen name="Feed" component={Feed} 
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                )
            }}/>
            <Tab.Screen name="Search" component={Search}  navigation={this.props.navigation}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="magnify" color={color} size={26} />
                )
            }}/>
            <Tab.Screen name="AddContainer" component={EmptyScreen} 
            listeners={({ navigation }) => ({
                tabPress: event => {
                    event.preventDefault();
                    navigation.navigate("Add");
                }
            })}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                )
            }}/>
            <Tab.Screen name="Profile" component={Profile} 
            listeners={({ navigation }) => ({
                tabPress: event => {
                    event.preventDefault();
                    const auth = getAuth();
                    navigation.navigate("Profile", {uid: auth.currentUser.uid});
                }
            })}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                )
            }}/>
        </Tab.Navigator>
    )
  }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
});
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);

export default connect(null, mapDispatchToProps)(Main);