import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Login, SignUp } from './login';
import Dashboard from './dashboard/Dashboard';
import { SplashScreen } from './login/SplashScreen';
import { Profile } from './dashboard/Profile';
console.disableYellowBox = true;
const authStack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },   

}, {
    initialRouteName:'Login'
})
const DashboardStack = createStackNavigator({
    Dashboard: {
        screen: Dashboard,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
     

}, {
    initialRouteName:'Dashboard'
})

const mySwitch = createSwitchNavigator({ 
    spalsh:SplashScreen, 
    authStack: authStack, 
    DashboardStack:DashboardStack 
},{
    initialRouteName:'spalsh'
})

export default createAppContainer(mySwitch);



