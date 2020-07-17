import React from 'react';
import { Color } from '../constant';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import VideoPlayer from 'react-native-video-player';
import { connect } from 'react-redux';
import * as Action from '../redux/action';
import { NavigationState, NavigationScreenProp, NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { userDetail } from '../interface/interface';
import { I_userDetail } from '../intialize/initializeState';
export interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
    storeState: any,
    getList: any
}

export interface State {
    data: any,
    isLoading: boolean,
    loginInfo:userDetail
}

class Dashboard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            loginInfo:I_userDetail
        };
    }
    componentDidMount() {
        this.getListApi();
        this.getAsyncData();
    }
     getAsyncData = async () => {
        const data = await AsyncStorage.getItem('loginInfo')
        this.setState({loginInfo:JSON.parse(data)})      
    }

    getListApi = () => {
        var params = {
            data: {},
            onDone: (response) => {
                this.hideLoader();
                if (response) {
                    this.setState({ data: response?.videos }, () => console.log('data:', this.state.data))
                }
            }
        }

        this.showLoader();
        this.props.getList(params);
    }

    showLoader = () => {
        this.setState({ isLoading: true });
    }

    hideLoader = () => {
        this.setState({ isLoading: false });
    }
    renderItem = (item: { thumbnail_url: string, title: string, video_url: string }, index: number) => (
        <View style={{ marginBottom: 15,marginLeft:10,marginRight:10 }}>
            <VideoPlayer
                video={{ uri: item?.video_url }}
                videoWidth={1600}
                videoHeight={900}
                thumbnail={{ uri: item?.thumbnail_url }}
                endThumbnail={{ uri: item?.thumbnail_url }}
            />
            <Card containerStyle={{ padding: 10, margin: 0, borderRadius: 10, elevation: 15, marginTop: -40 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: Color.blue }}>New</Text>
                    <Text style={{ color: Color.black_60, textAlign: 'right', flex: 1 }}>1 hr ago</Text>
                </View>
                <Text style={{ color: Color.black, fontWeight: '700', fontSize: 18 }}>{item?.title}</Text>
                <Text style={{ color: Color.black_60, fontWeight: '700', fontSize: 14, marginTop: 10 }}>{item?.title}</Text>
            </Card>
        </View>

    )

    render() {
        return (
            <View style={styles.container}>
                <View style={{margin:10}}>
                <Text style={{ color: Color.black_60, fontWeight: '700', marginTop: 10 }}>TODAY</Text>
                <View style={{ flexDirection: 'row', width: '100%',}}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ color: Color.black, fontWeight: '700', fontSize: 26 }}>My Feed</Text>
                    </View>
                    <View style={{ flex:1, alignItems: 'flex-end' }}>
                        <Avatar
                            rounded
                            source={{
                                uri:
                                    this.state.loginInfo.imageUrl,
                            }}
                            onPress={()=>this.props.navigation.navigate('Profile',{loginInfo:this.state.loginInfo})}
                        />
                    </View>
                </View>
                </View>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: 10 }}
                    refreshing={this.state.isLoading}
                    onRefresh={()=>this.getListApi()}
                />
              
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        //marginLeft: 16, marginRight: 16,
        
    }
})


const mapStateToProps = (state) => {
    return {
        storeState: state
    }
}

const mapDispatchFromProps = (dispatch) => {
    return {
        getList: (data) => {
            dispatch(Action.getUserList(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchFromProps)(Dashboard);
