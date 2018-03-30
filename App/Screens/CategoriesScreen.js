//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Images, Metrics, Colors, GlobalStyles } from '../Themes';
import firebase from 'firebase';
import { QriusityAPI, GameManager, OpenTDB } from '../Model';
import { FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

export default class CategoriesScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerLeft: (
        <Feather
          name="chevron-left"
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={[GlobalStyles.headerIcon, {marginHorizontal: 0}]}/>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      results: [],
      loading: true,
      resultsPage: 1,
    }
  }

  componentDidMount() {
    this._search(this.state.searchText)
  }

  _search = async (text, reload=true) => {
    this._searchOpenTDB(text, reload=reload)
  }

  _searchOpenTDB = async (text) => {
    this.setState({ searchText : text })
    OpenTDB.searchCategories(text, (results) => this.setState({ results: results, loading: false }))   
  }

  _searchQriusity = async (text, reload=true) => {
    this.setState({ searchText : text })
    let page = (reload) ? 1 : this.state.resultsPage
    let newResults = await QriusityAPI.searchCategories(text, page)
    let results = (reload) ? newResults : this.state.results.concat(newResults)
    this.setState({ results: results, resultsPage: page + 1, loading: false })
  }

  selectCategory = (category) => {
    var current = firebase.auth().currentUser
    firebase.database().ref('waiting').child(category.id).once('value').then( (snapshot) => {
      var childData = snapshot.val();
      var matchedGameID = GameManager.matchFromWaitlist(childData);
      if(matchedGameID == null) {
        matchedGameID = GameManager.createNewGame(category);
        GameManager.addToWaitlist(matchedGameID, category);
      } else {
        GameManager.addCurrentUserAsPlayer(matchedGameID)
        GameManager.removeFromWaitlist(matchedGameID, category)
      } 
      this.props.navigation.navigate('Play', { gameID: matchedGameID, category : category })
    })
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity style={GlobalStyles.resultRow} onPress={() => this.selectCategory(item)}>
        <Text style={{fontSize: Metrics.fonts.large}}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {results} = this.state;
    if(this.state.loading) {
      return (
        <Progress.Circle 
          size={Metrics.icons.large} 
          color={Colors.teal}
          indeterminate={true} 
          style={styles.activity}/>
      );
    }
    return (
      <View style={styles.container}>
        <TextInput
            onChangeText={(text) => this._search(text)}
            value={this.state.searchText}
            placeholder={'Category'} 
            textAlign={'center'}
            style={styles.searchBar}/>
        <FlatList
          data={results}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
    //onEndReached={() => this._search(this.state.searchText, reload=false)} //use only for Qriusity
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  searchBar: {
    height: Metrics.images.small,
    width: Metrics.screenWidth*0.95,
    borderWidth: 1,
    borderRadius: 5,
    padding: Metrics.baseMargin,
    marginVertical: Metrics.baseMargin,
  },
  activity: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
});
