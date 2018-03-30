//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import { Images, Metrics, Colors, GlobalStyles } from '../Themes';
import { Auth } from '../Model';
import SignUpForm  from './Components/SignUpForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class SignUpScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      register: false,
    }
  }

  componentWillMount() {
    Auth.signInSavedUser(this.onSignIn)
  }

  signInUser = async () => {
    const {name, username, email, password} = this.state
    if(this.state.register){
      Auth.register(name, username, email, password, this.onSignIn)
    } else {
      Auth.signIn(email, password, this.onSignIn);
    }
  }

  onSignIn = (uid, email, password) => {
    Auth.saveSignInInfo(uid, email, password);
    this.props.navigation.navigate('Home');
  }

  forgotPass = () => {
    console.log('forgot password');
    Auth.sendForgotPasswordEmail(this.state.email)
  }

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}>

        <Image source={Images.logo} resizeMode={'contain'} style={styles.logo}/>
        
        <View style={styles.form}>
          <SignUpForm 
            register={this.state.register} 
            onChange={(key, val) => this.setState({[key]: val})}/>
          
          <TouchableOpacity onPress={this.signInUser} style={styles.button}>
            <Text style={styles.label}>{(this.state.register) ? 'Sign Up' : 'Login'}</Text>
          </TouchableOpacity>

          {!this.state.register &&
            <TouchableOpacity onPress={this.forgotPass} style={{margin: Metrics.baseMargin}}>
              <Text style={[styles.label, styles.highlight]}>Forgot Password?</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={GlobalStyles.row}>
          <Text style={styles.subtitle}>
            {(this.state.register) ? 'Already have an account? ' : 'Don\'t have an account? '}
          </Text>
          <TouchableOpacity onPress={() => this.setState({ register : !this.state.register })}>
            <Text style={[styles.subtitle, styles.highlight]}>
              {(this.state.register) ? 'Sign In' : 'Register'}.
            </Text>
          </TouchableOpacity>
        </View>
      
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin*2
  },
  logo: {
    width: Metrics.screenWidth*0.9,
    height: Metrics.screenWidth*0.3,
    marginTop: Metrics.doubleBaseMargin,
  },
  form: {
    alignItems: 'center', 
    marginBottom: Metrics.doubleBaseMargin*2,
  },
  label: {
    fontSize: Metrics.fonts.medium,
  },
  subtitle: {
    fontSize: Metrics.fonts.small,
  },
  highlight: {
    color: Colors.charcoal,
  },
  button: {
    borderWidth: 1,
    padding: Metrics.baseMargin,
    margin: Metrics.baseMargin,
    borderRadius: 20,
    width: Metrics.screenWidth*0.8,
    alignItems: 'center',
  },
});
