//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet } from 'react-native';
import Navigator from './App/Navigation/Navigator';
import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD4_ZZKCU3Q2XiRkKvFpVSXUsjRG3s4-p0",
  authDomain: "trivia-fa430.firebaseapp.com",
  databaseURL: "https://trivia-fa430.firebaseio.com",
  projectId: "trivia-fa430",
  storageBucket: "",
  messagingSenderId: "662527012555"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  render() {
    return <Navigator/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

