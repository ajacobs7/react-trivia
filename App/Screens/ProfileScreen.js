//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Images, Metrics, Colors, GlobalStyles } from '../Themes';
import { Auth, ProfileManager } from '../Model';
import ProfileHeader from './Components/ProfileHeader';
import ProfileStats from './Components/ProfileStats';
import ProfileCategoryRankings from './Components/ProfileCategoryRankings';
import ImagePicker from './ImagePickerScreen';
import { FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';

export default class ProfileScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerRight: (
        <Entypo
          name="log-out"
          onPress={() => {
            Auth.signOut()
            params.saveProfile()
            navigation.navigate('SignUp');
          }}
          style={[GlobalStyles.headerIcon, {fontSize: Metrics.icons.medium}]}/>
      ),
      headerLeft: (
        <Feather
          name="chevron-left"
          onPress={() => {
            params.saveProfile()
            navigation.navigate('Home');
          }}
          style={[GlobalStyles.headerIcon, {marginHorizontal: 0}]}/>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      user: ProfileManager.getCurrentUser(),
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ 
      saveProfile: this.saveProfile.bind(this) 
    });
    const params = this.props.navigation.state.params
    ProfileManager.getProfile(this.state.user.uid, (profile) => {
      if(params && params.pic) { profile['picture'] = params.pic } 
      this.setState({ profile: profile })
    }) 
  }

  componentWillUnmount() {
    this.saveProfile()
  }

  saveProfile() {
    if(this.state.profile) {
      ProfileManager.updateProfile(this.state.user.uid, this.state.profile)
    }
  }

  onChange = (key, newData) => {
    let newProfile = this.state.profile || {}
    newProfile[key] = newData
    this.setState({ profile : newProfile})
  }

  render() {
    return (
      <View>
        <ProfileHeader 
          profile={this.state.profile} 
          onPictureSelected={() => this.props.navigation.navigate('ImagePicker')}
          onColorChange={(color) => this.onChange('color', color)}/>
        <ProfileStats profile={this.state.profile}/>
        <ProfileCategoryRankings profile={this.state.profile}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: Metrics.screenWidth*0.05,
  },
});
