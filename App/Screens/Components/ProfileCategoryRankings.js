//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types'
import { Images, Metrics, Colors, GlobalStyles } from '../../Themes';

export default class ProfileCategoryRankings extends React.Component {

  static propTypes = {
    profile: PropTypes.object,
  }

  _renderCategoryItem = (item, index) => {
    return (
      <TouchableOpacity style={[GlobalStyles.resultRow, {justifyContent: 'space-between'}]}>
        <Text style={{fontSize: Metrics.fonts.medium}}>{index+1}.  {item.name}</Text>
        <Text style={{fontSize: Metrics.fonts.medium}}>{item.correct}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {profile} = this.props
    var items = null
    if(profile && profile.categories) {
      items = (Object.values(profile.categories)||[]).sort((a,b) => b.correct > a.correct) 
    }
    return (
      <View style={{height: Metrics.screenHeight*0.45, paddingTop: Metrics.baseMargin, alignItems: 'center'}}> 
        <Text style={{fontSize: Metrics.fonts.large, margin: Metrics.smallMargin}}>Best Categories</Text>
        { profile && profile.categories &&
          <View>
            <FlatList
              data={items}
              renderItem={({item, index}) => this._renderCategoryItem(item,index)}
              keyExtractor={(item, index) => index}/>
          </View>
        } 
      </View>
    );
  }
}
