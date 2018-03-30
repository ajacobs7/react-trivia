//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import ProfileManager from './ProfileManager';

export default class Auth {

  static verifyEmail(email) {
    // https://stackoverflow.com/questions/940577/javascript-regular-expression-email-validation?lq=1
    var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(emailFormat)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
        [{text: 'OK', onPress: null}],
        { cancelable: false }
      )
    }
    return email.match(emailFormat);
  }

  // https://firebase.google.com/docs/auth/web/password-auth
  static register(name, username, email, password, callback) {
    if(this.verifyEmail(email)) {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch( (error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        if(errorCode == 'auth/email-already-in-use') {
          Alert.alert(
            'Email Already In Use',
            errorMessage,
            [{text: 'OK', onPress: null}],
            { cancelable: false }
          )
        } else if (errorCode == 'auth/weak-password') {
          Alert.alert(
            'Weak Password',
            'Please enter a valid password. A valid password has at least 6 characters.',
            [{text: 'OK', onPress: null}],
            { cancelable: false }
          )
        }
      }).then( () => {
        var user = firebase.auth().currentUser
        if(user) {
          ProfileManager.createProfile(user.uid, name, username);
          callback(user.uid, email, password);
        }
      });
    }
  }

  // https://firebase.google.com/docs/auth/web/password-auth
  static signIn(email, pass, callback) {
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      if(errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password') {
        Alert.alert(
          'Invalid Credentials',
          errorMessage,
          [{text: 'OK', onPress: null}],
          { cancelable: false }
        )
      } 
      // ...
    }).then( () => {
      var user = firebase.auth().currentUser
      if(user) { callback(user.uid, email, pass); }
    });
  }

  // https://firebase.google.com/docs/auth/web/password-auth
  static signOut() {
    this.discardSignInInfo();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  static async discardSignInInfo() {
    try {
      await AsyncStorage.removeItem('uid');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('pass');
    } catch (error) {
      console.log(error)
    }
  }
 
  static async saveSignInInfo(uid, email, pass) {
    try {
      await AsyncStorage.setItem('uid', JSON.stringify(uid));
      await AsyncStorage.setItem('email', JSON.stringify(email));
      await AsyncStorage.setItem('pass', JSON.stringify(pass));
    } catch (error) {
      console.log(error)
    }
  }

  static async signInSavedUser(callback) {
    try {
      const id = await AsyncStorage.getItem('uid');
      if(JSON.parse(id) != null) {
        const email = await AsyncStorage.getItem('email');
        const pass = await AsyncStorage.getItem('pass');
        this.signIn(JSON.parse(email), JSON.parse(pass), callback);
      }
    } catch (error) {
      console.log(error);
      console.log(error.code);
    }
  }

  //https://firebase.google.com/docs/auth/web/manage-users
  static async sendForgotPasswordEmail(email) {
    if (!this.verifyEmail(email)) { return; }
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Email sent.
      Alert.alert(
        'Email Sent',
        'Check your email to reset your password.',
        [{text: 'OK', onPress: null}],
        { cancelable: false }
      )
    }).catch(function(error) {
      // An error happened.
      console.log(error)
    });
  }

}


