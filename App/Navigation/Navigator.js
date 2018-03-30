//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StackNavigator } from 'react-navigation'
import { Images, Colors, Metrics } from '../Themes'
import { View, Image, StyleSheet } from 'react-native';
import { SignUpScreen, HomeScreen, PlayScreen, ProfileScreen, CategoriesScreen, ImagePickerScreen } from '../Screens';

const PrimaryNav = StackNavigator({
  SignUp: { screen: SignUpScreen },
  Home: { screen: HomeScreen },
  Play: { screen: PlayScreen },
  Profile: { screen: ProfileScreen },
  Categories: { screen: CategoriesScreen },
  ImagePicker: {screen: ImagePickerScreen },
}, {
  // Default config for all screens
  headerMode: 'screen',
  initialRouteName: 'SignUp',
  navigationOptions: ({navigation}) => {
    const styles = StyleSheet.create({
      logo: {
        resizeMode: 'contain',
        height: Metrics.images.medium,
        margin: Metrics.smallMargin,
      },
    });
    return {
      headerTintColor: Colors.charcoal,
      headerTitle: <Image source={Images.logo} style={styles.logo}/>,
      headerStyle: {
        backgroundColor: 'white',
        borderWidth: 0,
        height: Metrics.images.medium*1.2,
      }
    }
  }
})

export default PrimaryNav

