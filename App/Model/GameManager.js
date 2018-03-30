//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { Alert } from 'react-native';
import firebase from 'firebase';
import ProfileManager from './ProfileManager';

const maxPlayers = 2
const maxRound = 10

export default class GameManager {

  static createNewGame(category) {
    var current = firebase.auth().currentUser
    var newGame = firebase.database().ref('games').push();
    newGame.set({
      players: [{ id: current.uid, score : 0 }],
      currentPlayerIndex: 0, 
      category: { 
        id: category.id, 
        name: category.name 
      }, 
      round: 1,
    })
    return newGame.key;
  }
  
  static getUserPlayerID() {
    return firebase.auth().currentUser.uid
  }

  static getOpponent(game) {
    var current = firebase.auth().currentUser
    const otherPlayers = game.players.map((p) => p.id).filter((id) => id != current.uid)
    return (otherPlayers.length > 0) ? otherPlayers[0] : null
  }

  static nextPlayer(currentPlayerIndex) {
    return (currentPlayerIndex + 1)%maxPlayers
  }

  static getCurrentPlayerID(game) {
    let player = game.players[game.currentPlayerIndex]
    return (player) ? player.id : null
  }

  static isCurrentUserTurn(game) {
    var current = firebase.auth().currentUser
    return this.getCurrentPlayerID(game) == current.uid
  }

  static hasCurrentUserAsPlayer(game) {
    var current = firebase.auth().currentUser
    return game.players.map( (p) => p.id ).indexOf(current.uid) != -1
  }

  // Waitlist

  static addToWaitlist(gameID, category) {
    var current = firebase.auth().currentUser
    var waitingList = firebase.database().ref('waiting').child(category.id).push();
    waitingList.set({
      gameID: gameID,
      senderID: current.uid,
    })
  }

  static matchFromWaitlist(list) {
    if (!list) { return null; }
    var current = firebase.auth().currentUser
    let options = Object.keys(list).filter( (key) => list[key].senderID != current.uid );
    return (options.length == 0) ? null : list[options[0]].gameID;
  }

  static removeFromWaitlist(gameID, category) {
    firebase.database().ref('waiting').child(category.id).once('value').then( (snapshot) => {
      let list = snapshot.val();
      let options = Object.keys(list).filter( (key) => list[key].gameID == gameID );
      options.forEach( (key) => {
        firebase.database().ref('waiting').child(category.id).child(key).remove()
      })
    })
  }


  // Updating Games

  static addCurrentUserAsPlayer(gameID) {
    var current = firebase.auth().currentUser
    firebase.database().ref('games').child(gameID).once('value').then( (snapshot) => {
      let game = snapshot.val()
      game.players.push({ id: current.uid, score : 0 })
      //game.currentPlayerIndex = this.nextPlayer(game.currentPlayerIndex)
      /*if(game.currentPlayer == null) {
        game.currentPlayer = 
      }*/
      this.modifyGame(gameID, game)
    });
  }

  static finishTurnForCurrentUser(gameID, newScore, callback) {
    var current = firebase.auth().currentUser
    firebase.database().ref('games').child(gameID).once('value').then( (snapshot) => {
      let game = snapshot.val()
      game.players[game.currentPlayerIndex].score += newScore
      game.currentPlayerIndex = this.nextPlayer(game.currentPlayerIndex); 
      let lastIndex = maxPlayers-1
      if(game.players[lastIndex] && game.players[lastIndex].id == current.uid) { //last player of round
        if(game.round == maxRound) {
          let scores = game.players.map( (p) => p.score )
          let maxIndex = scores.indexOf(Math.max(...scores))
          game.winner = (maxIndex == -1) ? 'Tie' : game.players[maxIndex]
          if(game.winner) {
            ProfileManager.addWin(game.winner.id)
            let loserIndex = this.nextPlayer(maxIndex)
            ProfileManager.addLoss(game.players[loserIndex].id)
          }
        } else {
          game.round += 1
        }
      }
      this.modifyGame(gameID, game)
      ProfileManager.addCorrect(current.uid, newScore, game.category);
      callback()
    });
  }

  static modifyGame(gameID, newGame) {
    firebase.database().ref('games/'+gameID).set(newGame);
  }

}