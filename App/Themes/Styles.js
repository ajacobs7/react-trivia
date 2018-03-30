//NAME: Austin Jacobs
//SUNET ID: ajacobs7

import Metrics from './Metrics';
import Colors from './Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerIcon: {
    color: Colors.charcoal,
    fontSize: Metrics.icons.large,
    marginHorizontal: Metrics.baseMargin,
  },
  row: {
  	flexDirection: 'row',
  	alignItems: 'center',
  	justifyContent: 'center',
  },
  resultRow: {
    height: Metrics.screenHeight*0.08,
    padding: Metrics.screenWidth*0.05,
    borderWidth: 1,
    borderColor: Colors.silver,
    width: Metrics.screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default styles;
