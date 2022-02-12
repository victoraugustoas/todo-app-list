// @see https://github.com/ethercreative/react-native-shadow-generator/blob/master/index.html

import {Platform, ShadowStyleIOS} from 'react-native';

// @see https://github.com/material-components/material-components-web/blob/master/packages/mdc-elevation/_variables.scss
const androidDepth = {
  umbra: [
    '0px 2px 1px -1px',
    '0px 3px 1px -2px',
    '0px 3px 3px -2px',
    '0px 2px 4px -1px',
    '0px 3px 5px -1px',
    '0px 3px 5px -1px',
    '0px 4px 5px -2px',
    '0px 5px 5px -3px',
    '0px 5px 6px -3px',
    '0px 6px 6px -3px',
    '0px 6px 7px -4px',
    '0px 7px 8px -4px',
    '0px 7px 8px -4px',
    '0px 7px 9px -4px',
    '0px 8px 9px -5px',
    '0px 8px 10px -5px',
    '0px 8px 11px -5px',
    '0px 9px 11px -5px',
    '0px 9px 12px -6px',
    '0px 10px 13px -6px',
    '0px 10px 13px -6px',
    '0px 10px 14px -6px',
    '0px 11px 14px -7px',
    '0px 11px 15px -7px',
  ],
  penumbra: [
    '0px 1px 1px 0px',
    '0px 2px 2px 0px',
    '0px 3px 4px 0px',
    '0px 4px 5px 0px',
    '0px 5px 8px 0px',
    '0px 6px 10px 0px',
    '0px 7px 10px 1px',
    '0px 8px 10px 1px',
    '0px 9px 12px 1px',
    '0px 10px 14px 1px',
    '0px 11px 15px 1px',
    '0px 12px 17px 2px',
    '0px 13px 19px 2px',
    '0px 14px 21px 2px',
    '0px 15px 22px 2px',
    '0px 16px 24px 2px',
    '0px 17px 26px 2px',
    '0px 18px 28px 2px',
    '0px 19px 29px 2px',
    '0px 20px 31px 3px',
    '0px 21px 33px 3px',
    '0px 22px 35px 3px',
    '0px 23px 36px 3px',
    '0px 24px 38px 3px',
  ],
  ambient: [
    '0px 0px 0px 0px',
    '0px 1px 3px 0px',
    '0px 1px 5px 0px',
    '0px 1px 8px 0px',
    '0px 1px 10px 0px',
    '0px 1px 14px 0px',
    '0px 1px 18px 0px',
    '0px 2px 16px 1px',
    '0px 3px 14px 2px',
    '0px 3px 16px 2px',
    '0px 4px 18px 3px',
    '0px 4px 20px 3px',
    '0px 5px 22px 4px',
    '0px 5px 24px 4px',
    '0px 5px 26px 4px',
    '0px 6px 28px 5px',
    '0px 6px 30px 5px',
    '0px 6px 32px 5px',
    '0px 7px 34px 6px',
    '0px 7px 36px 6px',
    '0px 8px 38px 7px',
    '0px 8px 40px 7px',
    '0px 8px 42px 7px',
    '0px 9px 44px 8px',
    '0px 9px 46px 8px',
  ],
};

function interpolate(i: number, a: number, b: number, a2: number, b2: number) {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
}

function parseShadow(raw: string) {
  const values = raw.split(' ').map(val => +val.replace('px', ''));
  return {
    x: values[0],
    y: values[1],
    blur: values[2],
  };
}

interface ShadowStyleBase {
  backgroundColor: string;
}
interface ShadowAndroidStyle extends ShadowStyleBase {
  elevation: number;
}
interface ShadowIosStyle extends ShadowStyleIOS, ShadowStyleBase {}

type ShadowStyle = ShadowAndroidStyle | ShadowIosStyle;

export function boxShadow(depth: number, shadowColor = '#000') {
  if (depth > 24 || depth < 0) {
    throw new Error('Depth out of range');
  }

  const s = parseShadow(androidDepth.penumbra[depth - 1]);
  const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);

  // Code
  const height = y;
  const opacity = Number(interpolate(depth - 1, 1, 24, 0.2, 0.6).toFixed(2));
  const radius = Number(interpolate(s.blur, 1, 38, 1, 16).toFixed(2)); //(s.blur * 0.45).toFixed(2);
  const elevation = depth;

  return Platform.select<ShadowStyle>({
    android: {
      elevation,
      backgroundColor: '#fff',
    },
    ios: {
      shadowColor,
      shadowOffset: {
        width: 0,
        height,
      },
      shadowOpacity: opacity,
      shadowRadius: radius,
      backgroundColor: '#fff',
    },
  });
}
