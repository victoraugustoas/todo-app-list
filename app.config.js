import 'dotenv/config';

export default {
  expo: {
    name: 'todoAppWExpo',
    slug: 'todoAppList',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icon.png',
    owner: 'victoraugustoas',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.victoraugustoas.todoAppList',
      googleServicesFile: './firebaseFiles/GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.victoraugustoas.todoAppList',
      googleServicesFile: './firebaseFiles/google-services.json',
    },
    web: {
      favicon: './src/assets/favicon.png',
    },
    description: '',
    userInterfaceStyle: 'automatic',
    extra: {
      user: process.env.EMAIL,
      passwd: process.env.PASSWORD,
    },
    plugins: ['@react-native-firebase/app'],
  },
};
