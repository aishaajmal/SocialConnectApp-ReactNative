import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Convert percentage to device size
export function wp(percentage) {
  return (width * percentage) / 100;
}

export function hp(percentage) {
  return (height * percentage) / 100;
}
