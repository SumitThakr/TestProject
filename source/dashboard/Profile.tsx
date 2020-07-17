import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Color } from '../constant';
import { Avatar, Input, CheckBox, Button, Header } from 'react-native-elements';
import { NavigationState, NavigationScreenProp, NavigationParams } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { userDetail } from '../interface/interface';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ImagePicker from 'react-native-image-picker';
import firebase, { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}
const usersCollection = firestore().collection('Users');
var loginInfo: userDetail;
const timestamp = Date.now();
const reference = firebase.storage().ref(timestamp + '.png');
export const Profile: React.SFC<IProps> = (props) => {
    const loginInfo1: userDetail = props.navigation.getParam('loginInfo')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [psw, setPsw] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [imageUrl, setImageUrl] = useState('')
    useEffect(() => {
        getData()
    }, [])
    const getData = () => {
        setIsLoading(true)
        usersCollection
            .doc(loginInfo1.email)
            .get()
            .then((documentSnapshot: any) => {
                console.log('documentSnapshot:',documentSnapshot)
                setIsLoading(false)
                if (documentSnapshot?.exists) {
                    loginInfo = documentSnapshot?.data()
                    setFirstName(loginInfo?.firstName)
                    setLastName(loginInfo?.lastName)
                    setEmail(loginInfo?.email)
                    setPhone(loginInfo?.phone)
                    setJoinDate(loginInfo?.joineDate)
                    setPsw(loginInfo?.password)
                    setAddress(loginInfo?.address)
                    setIsEmail(loginInfo?.isDisplayEmail)
                    setIsMobile(loginInfo?.isDispalyMobile)
                    setImageUrl(loginInfo?.imageUrl)
                } else {
                    Toast.show('User not exists!')
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log('error: ', error);
            })
    }
    const saveData = () => {
        setIsLoading(true)
        const params = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            joineDate: joinDate,
            password: psw,
            address: address,
            isDisplayEmail: isEmail,
            isDispalyMobile: isMobile,
            imageUrl: imageUrl
        }
        usersCollection.doc(email).set(params)
            .then(function () {
                setIsLoading(false)
                setIsEdit(false)
                Toast.show("Data Saved successfully!");
            })
            .catch(function (error) {
                setIsLoading(false)
                setIsEdit(false)
                console.error("Error writing document: ", error);
            });
    }
    const validate = () => {
        if (firstName != '' && firstName != null) {
            if (lastName != '' && lastName != null) {
                if (email != '' && email != null) {
                    if (phone != '' && phone != null) {
                        if (joinDate != '' && joinDate != null) {
                            if (address != '' && address != null) {
                                setIsLoading(true)
                                saveData()
                            } else {
                                Toast.show('Please Enter Address!')
                            }
                        } else {
                            Toast.show('Please Enter Joining Date!')
                        }
                    } else {
                        Toast.show('Please Enter Mobile No.!')
                    }
                } else {
                    Toast.show('Please Enter Email!')
                }
            } else {
                Toast.show('Please Enter Last Name!')
            }
        } else {
            Toast.show('Please Enter First Name!')
        }
    }
    const Logout = () => {
        let key = ['loginInfo', 'isLogin']
        AsyncStorage.multiRemove(key).then(() => {
            Toast.show('you have logout Succesfuly');
        })
        props.navigation.navigate('Login');
    }
    
    const camera = () => {
        const timestamp = Date.now();
        console.log('timestamp:', timestamp)
        console.log('inside phototapped')
        const options = {
            quality: 1.0,
            maxWidth: 400,
            maxHeight: 400,
            storageOptions: {
                skipBackup: true
            },
        };

        ImagePicker.launchCamera(options, async (response) => {
            console.log(response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log('uri:', response.uri)
                setIsLoading(true)
                await reference.putFile(response.uri)
                    .then((data) => {
                        console.log('data:', data)
                        if(data.state=="success"){
                            getUrl(data.metadata.fullPath)
                        }else{
                            setIsLoading(false)
                        }                        
                    }).catch((error) => {
                        console.log('firebase storage error:', error)
                        setIsLoading(false)
                    })
            }
        });
    }
    const getUrl = async (fullPath) => {        
            setImageUrl( await storage()
            .ref(fullPath)
            .getDownloadURL()); 
            console.log('imageUrl:',imageUrl);
            setIsLoading(false)         
           
    }

    return (
        <View style={styles.container}>
            <Header
                backgroundColor={Color.white}
                leftComponent={
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Feather name={'chevron-left'} color={Color.blue} size={35} />
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 18, fontWeight: '700' }}>Profile</Text>
                }
                rightComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isEdit ?
                            <TouchableOpacity onPress={() => validate()}>
                                <Text style={{ fontSize: 14, fontWeight: '700', backgroundColor: Color.blue, paddingLeft: 5, paddingRight: 5, borderRadius: 10, paddingTop: 2, paddingBottom: 2, color: Color.white, textAlign: 'center' }}>Save</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity onPress={() => setIsEdit(true)}>
                                <Feather name={'edit-2'} color={Color.blue} size={22} />
                            </TouchableOpacity>}
                        <TouchableOpacity onPress={() => Logout()} style={{ marginLeft: 10 }}>
                            <Feather name={'power'} color={Color.blue} size={22} />
                        </TouchableOpacity>
                    </View>

                }
            />
            <ScrollView style={{ marginLeft: 10, marginRight: 10 }} showsVerticalScrollIndicator={false}>

                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Avatar
                            rounded
                            size={'large'}
                            source={{
                                uri:
                                    imageUrl,
                            }}
                        />
                        {isEdit?
                        <TouchableOpacity onPress={() => camera()} style={{ marginLeft: 60, marginTop: -30, backgroundColor: Color.black, borderRadius: 9, padding: 5,width:20,height:20 }}>
                            <Feather name='camera' size={10} color={Color.white} />
                        </TouchableOpacity>:null}
                    </View>
                    <Text style={{ color: Color.black, fontWeight: '700', fontSize: 30, marginLeft: 20 }}>Hello,</Text>
                </View>
                <View style={{ backgroundColor: Color.white, marginTop: 30, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Input
                            label='First Name'
                            placeholder='Enter First Name'
                            onChangeText={(firstname: string) => setFirstName(firstname)}
                            containerStyle={{ width: '50%' }}
                            value={firstName}
                            editable={isEdit}
                        />
                        <Input
                            label='Last Name'
                            placeholder='Enter Last Name'
                            onChangeText={(lastname: string) => setLastName(lastname)}
                            containerStyle={{ width: '50%' }}
                            value={lastName}
                            editable={isEdit}
                        />
                    </View>
                    <Input
                        label='Email'
                        placeholder='abc@gmail.com'
                        onChangeText={(email: string) => setEmail(email)}
                        value={email}
                        editable={false}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Input
                            label='Phone'
                            placeholder='Enter phone number'
                            onChangeText={(phone: string) => setPhone(phone)}
                            containerStyle={{ width: '50%' }}
                            value={phone}
                            editable={isEdit}
                            keyboardType={'number-pad'}
                            maxLength={10}
                        />
                        <Input
                            label='Join Date'
                            placeholder='DD-MM-YYYY'
                            onChangeText={(date: string) => setJoinDate(date)}
                            containerStyle={{ width: '50%' }}
                            value={joinDate}
                            editable={isEdit}
                            keyboardType={'number-pad'}
                            maxLength={10}
                        />
                    </View>
                    <Input
                        label='Address'
                        placeholder='Enter address'
                        onChangeText={(address: string) => setAddress(address)}
                        value={address}
                        editable={isEdit}
                    />
                </View>
                <TouchableOpacity style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: Color.white,
                    marginTop: 10,
                    marginRight: 5,
                    marginBottom: 20

                }}
                    onPress={() => {

                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <EvilIcons name={'lock'} color={Color.blue} size={35} />
                        <Text style={{ color: Color.black, marginLeft: 20, fontSize: 16, fontWeight: '700' }}>Change Password</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Feather name={'chevron-right'} color={Color.black_60} size={32} />
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
            {isLoading ? <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={Color.blue} />
            </View> : null}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Color.black_60,
        // marginLeft: 16, marginRight: 16
    }
})



