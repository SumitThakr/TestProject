import React, { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { NavigationState, NavigationScreenProp, NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Color } from '../constant';
export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export const SplashScreen: React.SFC<Props> = (props) => {
    useEffect(() => {
       getData()
    }) 
const getData=async ()=>{
    const data= await AsyncStorage.getItem('isLogin')
    const isLogin=data?JSON.parse(data):false
    setTimeout(() => isLogin ? props.navigation.navigate('DashboardStack') : props.navigation.navigate('authStack'), 2000)
}
  
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Text style={{ fontSize: 21, color: Color.black, letterSpacing: 1 }}>Test Project</Text>            
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,       
        justifyContent: 'center',
        alignItems: 'center'

    },
})