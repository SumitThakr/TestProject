import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Color } from '../constant';
import { Input, CheckBox, Button } from 'react-native-elements';
import { NavigationState, NavigationScreenProp, NavigationParams } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import { userDetail } from '../interface/interface';
import { I_userDetail } from '../intialize/initializeState';
import AsyncStorage from '@react-native-community/async-storage';
export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}
const usersCollection = firestore().collection('Users');
export interface State {
    email: string,
    psw: string,
    userDetail: userDetail,
    checked: boolean,
    isLoading: boolean
}
export class Login extends React.Component<IProps, State> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            email: '',
            psw: '',
            userDetail: I_userDetail,
            checked: false,
            isLoading: false
        };
    }
    getData = () => {
        this.setState({ isLoading: true })
        firestore()
            .collection('Users')
            .doc(this.state.email)
            .get()
            .then((documentSnapshot: any) => {
                this.setState({ isLoading: false })
                if (documentSnapshot?.exists) {
                    this.setState({ userDetail: documentSnapshot?.data(), isLoading: false }, () => this.authenticate())
                } else {
                    Toast.show('User does not exists!')
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                console.log('error: ', error);
            })
    }
    authenticate = () => {
        if (this.state.userDetail.email === this.state.email) {
            if (this.state.userDetail.password === this.state.psw) {
                this.storeData()
            } else {
                Toast.show('Password is wrong!')
            }
        } else {
            Toast.show('email-id is wrong!')
        }
    }
    storeData = async () => {
        try {
            await AsyncStorage.multiSet([['loginInfo', JSON.stringify(this.state.userDetail)], ['isLogin', 'true']]);
            Toast.show('Login Successfuly!')
            this.props.navigation.navigate('DashboardStack')
        } catch (e) {
            console.log('storeData error:', e)
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '700' }}>Login</Text>
                    <View style={{ marginTop: 60, alignSelf: 'center', backgroundColor: Color.blue, height: 120, width: '60%', borderRadius: 2, }}>
                    </View>
                    <Input
                        label='Email Address'
                        placeholder='Enter Email'
                        onChangeText={(email: string) => this.setState({ email: email })}
                        containerStyle={{ marginTop: 50 }}
                    />
                    <Input
                        label='Password'
                        placeholder='Enter Password'
                        onChangeText={(password: string) => this.setState({ psw: password })}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <CheckBox
                            title='Remember me'
                            textStyle={{ fontWeight: '600', fontSize: 14 }}
                            checked={this.state.checked}
                            onPress={() => this.setState({ checked: !this.state.checked })}
                            containerStyle={{ marginLeft: 0, marginTop: 0, paddingTop: 0,backgroundColor:Color.white,borderWidth:0  }}
                        />
                        <TouchableOpacity onPress={() => { }} style={{ flex: 1, padding: 5 }}>
                            <Text style={{ textAlign: 'right', flex: 1 }}> Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        title="Login"
                        onPress={() => {
                            if (this.state.email != '' && this.state.email != null) {
                                if (this.state.psw != '' && this.state.psw != null) {
                                    this.getData()
                                } else {
                                    Toast.show('Please enter password!');
                                }
                            } else {
                                Toast.show('Please enter email id!');
                            }                           
                        }
                        }
                        containerStyle={{ marginTop: 20 }}
                        loading={this.state.isLoading}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Text>Not member yet?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style={{ marginLeft: 5 }}>
                            <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>Register Now</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
       // marginLeft: 16, marginRight: 16
       padding:5
    }
})

