//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types'
import { Images, Metrics, Colors, GlobalStyles } from '../../Themes';
import GameManager from '../../Model/GameManager';
import ProfileManager from '../../Model/ProfileManager';

export default class GameRow extends React.Component {

  static propTypes = {
    game: PropTypes.object,
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      opponentProfile: { username: 'Pending' },
    }
  }

  componentDidMount() {
    const opponentID = GameManager.getOpponent(this.props.game) 
    ProfileManager.getProfile(opponentID, (profile) => {
      this.setState({ opponentProfile: profile })
    })
  }

  formattedScore(item) {
    let players = Object.values(item.players).sort((a,b) => (b.id == GameManager.getUserPlayerID()) - 0.5)
    var scores = players.map((p) => p.score)
    if(scores.length < 2) { scores.push(0) }
    return scores.join('-')
  }

  render() {
    const {game} = this.props
    const {opponentProfile} = this.state
    const image = (opponentProfile.picture) ? { uri: opponentProfile.picture} : Images.profile
    return (
      <TouchableOpacity style={styles.gameContainer} onPress={this.props.onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Images.profile} style={styles.profPic}/>
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: Metrics.fonts.medium}}>{opponentProfile.username}</Text>
            <Text style={{fontSize: Metrics.fonts.medium}}>{game.category.name}</Text>
          </View>
        </View>
        
        <View style={styles.gameStats}>
          <Text style={{fontSize: Metrics.fonts.xs}}>Round</Text>
          <View style={styles.round}>
            <Text style={{fontSize: Metrics.fonts.large}}>{game.round}</Text>
          </View>
          <Text style={{fontSize: Metrics.fonts.small}}>{this.formattedScore(game)}</Text>
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Metrics.screenWidth,
    borderWidth: 1,
    borderColor: Colors.silver,
    paddingHorizontal: Metrics.screenWidth*0.04,
    paddingVertical: Metrics.baseMargin,
  },
  gameStats: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  round: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.steel,
    width: Metrics.screenHeight*0.05,
    height: Metrics.screenHeight*0.05,
    borderRadius: Metrics.screenHeight*0.05/2,
    marginVertical: Metrics.smallMargin/2,
  },
  profPic: {
    width: Metrics.screenHeight*0.07,
    height: Metrics.screenHeight*0.07,
    borderRadius: Metrics.screenHeight*0.07/2,
    marginRight: Metrics.doubleBaseMargin,
  },
  label: {
    fontSize: 20,
  },
});
