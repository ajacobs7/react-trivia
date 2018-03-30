//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, Image, CameraRoll, TouchableOpacity } from 'react-native';
import { Images, Metrics, Colors } from '../Themes';
import Grid from 'react-native-grid-component';
import PropTypes from 'prop-types'
import { ProfileManager } from '../Model'

export default class ImagePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    }
  }

  getPhotos() {
    // https://facebook.github.io/react-native/docs/cameraroll.html
    CameraRoll.getPhotos({
       first: 50,
       after: this.state.offset,
       assetType: 'Photos',
     })
     .then(r => {
       this.setState({ photos: this.state.photos.concat(r.edges), offset: r.page_info.end_cursor });
     })
     .catch((err) => {
        //Error Loading Images
     });
  }

  componentDidMount() {
    this.getPhotos()
  }

  _renderItem = (p, i) => {
    let image = p.node.image.uri
    return (
      <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('Profile', {pic: image})}>
        <Image source={{ uri: image }} style={styles.image}/>
      </TouchableOpacity>
    )
  }


  render() {
    return (
      <Grid
        style={{paddingVertical: Metrics.baseMargin }}
        renderItem={this._renderItem}
        data={this.state.photos}
        itemsPerRow={3}
        onEndReached={() => this.getPhotos()}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: Metrics.baseMargin,
  },
  image: {
    resizeMode: 'contain',
    width: (Metrics.screenWidth/3) - Metrics.baseMargin,
    height: (Metrics.screenWidth/3) - Metrics.baseMargin,
    margin: Metrics.smallMargin,
  }
});
