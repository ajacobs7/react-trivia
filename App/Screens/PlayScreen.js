//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, SectionList, Image, TouchableOpacity, FlatList } from 'react-native';
import { Images, Metrics, Colors } from '../Themes';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import {GameManager, QriusityAPI, OpenTDB} from '../Model';


const QUESTION_TIME = 15;
const NONE = null;
const ALL_WRONG = -1;

export default class PlayScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: params.category.name,
      headerTitleStyle: {fontSize: 25},
      headerLeft: null, //remove back button
      headerTitle: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      question: '',
      choices: [],
      time: 0.0,
      timer_id: NONE,
      answer: NONE, //index
      wrong: NONE,
      correct: NONE,
      points: 0,
    }
  }

  startTimer() {
    let id = setInterval( () => {
      if(this.state.time >= QUESTION_TIME) { this.checkAnswer() }
      this.setState({time: this.state.time + 0.1})
    }, 100)
    this.setState({ timer_id: id, time: 0.0 })
  }

  componentDidMount() {
    this.loadNewQuestion()
    this.startTimer()
  }

  loadNewQuestion = async () => {
    this.loadNewQuestionOpenTDB();
  }

  loadNewQuestionQriusity = async () => {
    const { category } = this.props.navigation.state.params
    let Q = await QriusityAPI.getQuestionFromCategory(category.id)
    this.setState({
      question: Q.question,
      choices: [Q.option1, Q.option2, Q.option3, Q.option4],
      answer: Q.answers-1,
    })
  }

  loadNewQuestionOpenTDB = async () => {
    const { category } = this.props.navigation.state.params
    OpenTDB.getQuestionFromCategory(category.id, (Q) => {
      let numChoices = Q.incorrect_answers.length + 1
      let answerIndex = Math.floor(Math.random()*numChoices)
      let choices = Q.incorrect_answers
      choices.splice(answerIndex, 0, Q.correct_answer)
      this.setState({
        question: Q.question,
        choices: choices,
        answer: answerIndex,
      })
    })
  }

  checkAnswer = (guessIndex=ALL_WRONG) => {
    clearInterval(this.state.timer_id)
    let isCorrect = guessIndex == this.state.answer
    this.setState({ correct: this.state.answer, wrong: ((isCorrect) ? NONE : guessIndex) })
    setTimeout(() => {
      if(isCorrect) {
        this.setState({ correct: NONE, wrong: NONE, points: this.state.points + 1 })
        this.loadNewQuestion();
        this.startTimer();
      } else {
        const { gameID } = this.props.navigation.state.params
        GameManager.finishTurnForCurrentUser(gameID, this.state.points, () => {
          this.props.navigation.navigate('Home')
        });
      }
    }, 3000)
  }

  _renderOption = (option, index) => {
    let style = [styles.choicesBox]
    if(index == this.state.correct) { 
      style.push(styles.correct) 
    } else if(index == this.state.wrong || this.state.wrong == ALL_WRONG) { 
      style.push(styles.wrong) 
    }
    return (
      <TouchableOpacity style={style} onPress={() => this.checkAnswer(index)}>
        <Text style={{fontSize: Metrics.fonts.medium}}>{option}</Text>
      </TouchableOpacity>
    );
  }


  render() {
    const {question, choices, time} = this.state
    return (
      <View style={styles.container}>
        <Progress.Bar 
          progress={time/QUESTION_TIME} 
          width={Metrics.screenWidth} 
          height={2}
          borderRadius={0}/>
        <View style={styles.question}>
          <Text style={{fontSize: Metrics.fonts.large, alignSelf: 'center'}}>{question}</Text>
        </View>
        <View style={{height: Metrics.screenHeight*0.5}}>
          <FlatList
            data={choices}
            renderItem={({item, index}) => this._renderOption(item, index)}
            keyExtractor={(item, index) => index}
            scrollEnabled={false}
            extraData={this.state}/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  question: {
    flex: 1, 
    justifyContent: 'center', 
    padding: Metrics.baseMargin,
    width: Metrics.screenWidth*0.9,
  },
  choicesBox: {
    width: Metrics.screenWidth*0.9,
    backgroundColor: Colors.silver,
    paddingVertical: Metrics.baseMargin,
    marginVertical: Metrics.baseMargin,
    alignItems: 'center',
  },
  correct: {
    backgroundColor: Colors.green,
  },
  wrong: {
    backgroundColor: Colors.rose,
  }
});
