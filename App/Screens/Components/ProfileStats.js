//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import PropTypes from 'prop-types'
import { Images, Metrics, Colors } from '../../Themes';

export default class ProfileStats extends React.Component {
  static defaultProps = {
    profile: { won: 0, lost: 0, correct: 0}
  }

  static propTypes = {
    profile: PropTypes.object,
  }

  _renderStatsItem = ({item}) => {
    return (
      <View style={[styles.statsItem, { backgroundColor: item.color }]}>
        <Text style={{fontSize: Metrics.fonts.medium}}>{item.label}</Text>
        <Text style={{fontSize: Metrics.fonts.medium}}>{item.value || 0}</Text>
      </View>
    );
  }

  render() {
    const {profile} = this.props
    return (
      <View style={styles.statsBar}> 
        <FlatList
          data={[
            {label: 'won', value: profile.won, color: Colors.green },
            {label: 'lost', value: profile.lost, color: Colors.rose},
            {label: 'correct', value: profile.correct, color: Colors.yellow}
          ]}
          renderItem={this._renderStatsItem}
          keyExtractor={(item, index) => index}
          horizontal={true}
          scrollingEnabled={false}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsItem: {
    borderWidth: 2,
    borderColor: Colors.silver,
    width: Metrics.screenWidth/3,
    alignItems: 'center',
    padding: Metrics.baseMargin,
  },
});
