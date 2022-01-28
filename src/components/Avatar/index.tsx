import React, {useState} from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  imageSize: {width: '100%', height: '100%'},
  borderCompletion: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: widthPercentageToDP(2),
  },
});

export interface AvatarProps extends ImageProps {
  /**
   * Active border in image
   */
  borderCompletion?: boolean;
  /**
   * Size of image
   */
  size: number;
}

const Avatar: React.FC<AvatarProps> = ({borderCompletion, size, ...props}) => {
  const [sizeImage, setSizeImage] = useState(0);

  return (
    <View
      style={[
        borderCompletion && styles.borderCompletion,
        {height: size, width: size, borderRadius: size / 2},
      ]}>
      <Image
        onLayout={({nativeEvent}) => setSizeImage(nativeEvent.layout.height)}
        {...props}
        style={[props.style, styles.imageSize, {borderRadius: sizeImage / 2}]}
      />
    </View>
  );
};

export {Avatar};
