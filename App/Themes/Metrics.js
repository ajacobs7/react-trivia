import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
}
metrics.fonts = {
  xs: metrics.screenWidth*0.02,
  small: metrics.screenWidth*0.03,
  medium: metrics.screenWidth*0.04,
  large: metrics.screenWidth*0.05,
  xl: metrics.screenHeight*0.05,
}
metrics.icons = {
  tiny: 15,
  small: 20,
  medium: metrics.screenHeight*0.03,
  large: metrics.screenHeight*0.05,
  xl: 50
}
metrics.images = {
  small: metrics.screenHeight*0.05,
  medium: metrics.screenHeight*0.07,
}

export default metrics
