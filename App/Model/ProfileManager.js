//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import firebase from 'firebase';


export default class ProfileManager {

  static getCurrentUser() {
    return firebase.auth().currentUser;
  }

  static getProfile(uid, callback) {
    if(!uid) { return; }
    firebase.database().ref('users').child(uid).once('value').then( (snapshot) => {
      callback(snapshot.val())
    })
  }

  static createProfile(uid, name, username) {
    firebase.database().ref('users').child(uid).set({
      name: name,
      username: username,
    });
  }

  static updateProfile(uid, newProfile, callback) {
    var current = firebase.auth().currentUser
    firebase.database().ref('users').child(current.uid).set(newProfile).then(callback);
  }

  static addWin(uid) {
    firebase.database().ref('users/'+uid+'/won').once('value').then( (snapshot) => {
      let wins = snapshot.val() || 0
      firebase.database().ref('users/'+uid+'/won').set(wins+1);
    });
  }

  static addLoss(uid) {
    firebase.database().ref('users/'+uid+'/lost').once('value').then( (snapshot) => {
      let losses = snapshot.val() || 0
      firebase.database().ref('users/'+uid+'/lost').set(losses+1);
    });
  } 

  static addCorrect(uid, newCorrect, category) {
    firebase.database().ref('users/'+uid+'/correct').once('value').then( (snapshot) => {
      let correct = snapshot.val() || 0
      firebase.database().ref('users/'+uid+'/correct').set(correct+newCorrect);
    });
    firebase.database().ref('users/'+uid+'/categories/'+category.id).once('value').then( (snapshot) => {
      let data = snapshot.val()
      let correct = (data) ? data.correct : 0
      firebase.database().ref('users/'+uid+'/categories/'+category.id).set({
        name: category.name,
        correct: correct+newCorrect
      });
    });
  }

}


