import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Color } from '../constant';
import { Avatar, Input, CheckBox, Button } from 'react-native-elements';
import { NavigationState, NavigationScreenProp, NavigationParams } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import firebase, { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import Feather from 'react-native-vector-icons/Feather';
export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}
const timestamp = Date.now();
const usersCollection = firestore().collection('Users');
const reference = firebase.storage().ref(timestamp + '.png');
export const SignUp: React.SFC<IProps> = (props) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [psw, setPsw] = useState('');
    const [address, setAddress] = useState('');
    const [isEmail, setIsEmail] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [imageUrl, setImageUrl] = useState('')
    const getData = () => {        
        usersCollection
            .doc(email)
            .get()
            .then((documentSnapshot: any) => {
                if (documentSnapshot?.exists) {
                    setIsLoading(false)
                    Toast.show('User already exists!')
                } else {
                    saveData()
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log('error: ', error);
            })
    }
    const saveData = () => {
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
                Toast.show("Data Saved successfully!");
                console.log("Data Saved successfully!");
                props.navigation.navigate('Login');
            })
            .catch(function (error) {
                setIsLoading(false)
                console.error("Error writing document: ", error);
            });
    }
    const validate = () => {
        if (firstName != '' && firstName != null) {
            if (lastName != '' && lastName != null) {
                if (email != '' && email != null) {
                    if (phone != '' && phone != null) {
                        if (joinDate != '' && joinDate != null) {
                            if (psw != '' && psw != null) {
                                if (address != '' && address != null) {
                                    setIsLoading(true)
                                    getData()
                                } else {
                                    Toast.show('Please Enter Address!')
                                }
                            } else {
                                Toast.show('Please Enter password!')
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
                setIsLoading2(true)
                await reference.putFile(response.uri)
                    .then((data) => {
                        console.log('data:', data)
                        if(data.state=="success"){
                            getUrl(data.metadata.fullPath)
                        }else{
                            setIsLoading2(false)
                        }                        
                    }).catch((error) => {
                        console.log('firebase storage error:', error)
                        setIsLoading2(false)
                    })
            }
        });
    }
    const getUrl = async (fullPath) => {        
            setImageUrl( await storage()
            .ref(fullPath)
            .getDownloadURL()); 
            console.log('imageUrl:',imageUrl);
            setIsLoading2(false)         
           
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 20, fontWeight: '700' }}>Sign Up</Text>
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Avatar
                        rounded
                        size={'large'}
                        source={imageUrl?{
                            uri:
                                imageUrl,
                        }:require('../assets/images/user.png')}                        
                    />
                    <TouchableOpacity onPress={() => camera()} style={{marginLeft:50,marginTop:-30,backgroundColor:Color.black,borderRadius:9,padding:5}}>
                      <Feather name='camera' size={10} color={Color.white} />
                    </TouchableOpacity>
                    
                </View>
                <View style={{ flexDirection: 'row', marginTop: 40 }}>
                    <Input
                        label='First Name'
                        placeholder='Enter First Name'
                        onChangeText={(firstname: string) => setFirstName(firstname)}
                        containerStyle={{ width: '50%' }}
                    />
                    <Input
                        label='Last Name'
                        placeholder='Enter Last Name'
                        onChangeText={(lastname: string) => setLastName(lastname)}
                        containerStyle={{ width: '50%' }}
                    />
                </View>
                <Input
                    label='Email'
                    placeholder='abc@gmail.com'
                    onChangeText={(email: string) => setEmail(email)}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Input
                        label='Phone'
                        placeholder='Enter phone number'
                        onChangeText={(phone: string) => setPhone(phone)}
                        containerStyle={{ width: '50%' }}
                        maxLength={10}
                        keyboardType='number-pad'
                    />
                    <Input
                        label='Join Date'
                        placeholder='DD-MM-YYYY'
                        onChangeText={(date: string) => setJoinDate(date)}
                        containerStyle={{ width: '50%' }}
                        maxLength={10}
                        keyboardType='number-pad'
                    />
                </View>
                <Input
                    label='Password'
                    placeholder='Enter password'
                    onChangeText={(psw: string) => setPsw(psw)}
                />
                <Input
                    label='Address'
                    placeholder='Enter address'
                    onChangeText={(address: string) => setAddress(address)}
                />
                <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                        title='Dispaly email id'
                        textStyle={{ fontWeight: '600', fontSize: 14 }}
                        checked={isEmail}
                        onPress={() => setIsEmail(!isEmail)}
                        containerStyle={{ marginLeft: 0, marginTop: 0, paddingTop: 0,backgroundColor:Color.white,borderWidth:0 }}
                    />
                    <View style={{ flex: 1 }}>
                        <CheckBox
                            title='Display mobile no.'
                            textStyle={{ fontWeight: '600', fontSize: 14 }}
                            checked={isMobile}
                            onPress={() => setIsMobile(!isMobile)}
                            containerStyle={{ marginLeft: 0, marginTop: 0, paddingTop: 0, alignSelf: 'flex-end', marginRight: 0, paddingRight: 0,backgroundColor:Color.white,borderWidth:0 }}
                        />
                    </View>
                </View>
                <Button
                    title="Sign Up"
                    onPress={() => validate()}
                    containerStyle={{ marginTop: 20 }}
                    loading={isLoading}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                    <Text>Already member?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={{ marginLeft: 5 }}>
                        <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>Login Now</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {isLoading2 ? <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={Color.blue} />
            </View> : null}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        //marginLeft: 16, marginRight: 16
        padding:5
    }
})



