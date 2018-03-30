//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types'
import { Images, Metrics, Colors } from '../../Themes';
import ProfileManager from '../../Model/ProfileManager';

export default class ProfileHeader extends React.Component {
  static defaultProps = {
    profile: { color: Colors.sky, name: '', username: '', picture: null}
  }

  static propTypes = {
    profile: PropTypes.object,
    onPictureSelected: PropTypes.func,
    onColorChange: PropTypes.func,
  }

  changeColor = () => {
    let options = [Colors.green, Colors.orange, Colors.yellow, Colors.teal, Colors.rose, Colors.sky];
    let curIndex = options.indexOf(this.props.profile.color)
    let newColor = options[(curIndex+1)%options.length]
    this.props.onColorChange(newColor)
  }

  render() {
    let {profile} = this.props
    let image = (profile.picture) ? { uri: profile.picture} : Images.profile
    let color = profile.color || Colors.sky
    return (
      <TouchableOpacity style={[styles.profHeader, {backgroundColor: color}]} onPress={this.changeColor}>
        <TouchableOpacity onPress={this.props.onPictureSelected}>
          <Image source={image} style={styles.profPic}/>
        </TouchableOpacity>
        <Text style={{fontSize: Metrics.fonts.large, color: 'white'}}>{profile.name}</Text>
        <Text style={{fontSize: Metrics.fonts.medium, color: 'white'}}>@{profile.username}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  profHeader: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight*0.3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profPic: {
    width: Metrics.screenHeight*0.15,
    height: Metrics.screenHeight*0.15,
    borderRadius: Metrics.screenHeight*0.15/2,
    marginRight: Metrics.smallMargin,
  },
});
