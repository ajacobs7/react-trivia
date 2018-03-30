//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import PropTypes from 'prop-types'
import { Images, Metrics, Colors } from '../../Themes';

export default class SignUpForm extends React.Component {

  static propTypes = {
    register: PropTypes.bool,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      username: '',
    }
  }

  componentDidMount() {
    for(var key in this.state){ this.props.onChange(key, this.state[key]) }
  }

  _renderTextField = (item,i) => {
    return (
      <TextInput
        key={i}
        style={styles.textField}
        onChangeText={(text) => {
          this.setState({ [item]: text })
          this.props.onChange(item, text)
        }}
        value={this.state[item]}
        placeholder={item}
        secureTextEntry={item=='password'} />
    );
  }

  render() {
    var fields = ['email', 'password']
    if(this.props.register) { fields = ['name', 'username'].concat(fields); }
    return (
      <View style={styles.formContainer}>
        {fields.map( (f, i) => {
          return this._renderTextField(f,i);
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    alignItems: 'flex-start',
    flex: 0,
  },
  textField: {
    width: Metrics.screenWidth*0.8,
    height: 40,
    fontSize: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.baseMargin,
  },
});
