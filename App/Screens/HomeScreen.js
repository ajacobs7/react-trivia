//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, SectionList, Image, SafeAreaView } from 'react-native';
import { Images, Metrics, Colors, GlobalStyles } from '../Themes';
import { FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import firebase from 'firebase';
import GameRow from './Components/GameRow'
import GameManager from '../Model/GameManager.js';

export default class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerRight: (
         <Feather
          name="plus"
          onPress={() => {
            firebase.database().ref('games').off();
            navigation.navigate('Categories')
          }}
          style={GlobalStyles.headerIcon}/>
      ), 
      headerLeft: (
        <Ionicons
          name="ios-person"
          onPress={() => navigation.navigate('Profile')} 
          style={GlobalStyles.headerIcon}/>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      games: [],
      currentUser: firebase.auth().currentUser.uid,
    }
  }

  componentDidMount() {
    firebase.database().ref('games').on('child_added', (snapshot) => {
      var childData = snapshot.val(); //remove arrays
      childData.key = snapshot.key;
      if(GameManager.hasCurrentUserAsPlayer(childData)) {
        var games = this.state.games.slice();
        games.push(childData);
        this.setState({games: games});
      }
    });
    firebase.database().ref('games').on('child_changed', (snapshot) => {
      gameIndex = this.state.games.map((g) => g.key).indexOf(snapshot.key)
      let newGames = this.state.games.slice()
      if(gameIndex == -1 || !GameManager.hasCurrentUserAsPlayer(newGames[gameIndex])) { return; }
      let game = snapshot.val() //make a copy
      game.key = snapshot.key
      newGames[gameIndex] = game
      this.setState({games: newGames})
    });
  }

  play = (item) => {
    if(GameManager.isCurrentUserTurn(item)) {
      firebase.database().ref('games').off();
      this.props.navigation.navigate('Play', { gameID: item.key, category: item.category } )
    }
  }

  _renderItem = ({item, section}) => {
    return <GameRow game={item} onPress={() => this.play(item)}/>
  }

  _renderSectionHeader = ({section}) => {
    return (
      <Text style={styles.sectionTitle}>{section.title}</Text>
    );
  }

  render() {
    const {games, currentUser} = this.state;
    const yourTurn = games.filter((game) => GameManager.isCurrentUserTurn(game) && !game.winner)
    const theirTurn = games.filter((game) => !GameManager.isCurrentUserTurn(game) && !game.winner)
    const finished = games.filter((game) => game.winner)
    return (
      <SafeAreaView style={styles.container}>
        
        <SectionList
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          sections={[
            {data: yourTurn, title: 'Your turn'},
            {data: theirTurn, title: 'Their turn'},
            {data: finished, title: 'Finished Games'}
          ]}
          keyExtractor={(item, index) => index}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontSize: Metrics.fonts.large, 
    backgroundColor: Colors.silver, 
    padding: 5,
    width: Metrics.screenWidth,
  },
});
