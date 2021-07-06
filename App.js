import React, { useEffect } from 'react'
import StoreProvider from './app/store/provider'
import { useInitialStore } from './app/store/initial'
import { createAppContainer } from 'react-navigation'
import AuthProvider from './app/utils/context/auth'
import { Root } from './app/navigation'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import Mixpanel from 'react-native-mixpanel'
import messaging from '@react-native-firebase/messaging'
import Amplify from 'aws-amplify'
import appsFlyer from 'react-native-appsflyer'
import config from './app/constants/config'

import { Platform } from 'react-native'

// Mixpanel
Mixpanel.sharedInstanceWithToken(config.mixpanel_token)

// Amplify
Amplify.configure({
  Auth: {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_Cj3LY6yr2',
    userPoolWebClientId: '17l88drh4ao085j3iugba0g4b8',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    oauth: {

      domain: 'vyve.auth.eu-west-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'vyvenow://auth/',
      redirectSignOut: 'vyvenow://auth/',
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
})

appsFlyer.initSdk(
  {
    devKey: 'kPdLYsBuCknXvFDbHNabP9',
    isDebug: false,
    appId: 'id1491323457', // iOS app id
  },
  (result) => {
    // console.log('appsflyer is working');
  },
  (error) => {
    console.error(error)
  }
)


const AppContainer = createAppContainer(Root)

const App = () => {
  const initial = useInitialStore()


  useEffect(() => {
    const token = async () => {
      const tok = await messaging().getToken()
      Mixpanel.union("$android_devices", [tok])
    }

    if (Platform.OS == 'android') {
      token()
    }
  }, [])

  return (
    <AuthProvider>
      <StoreProvider initial={initial} >
        <ActionSheetProvider>
          <AppContainer />
        </ActionSheetProvider>
      </StoreProvider>
    </AuthProvider>
  )
}

export default App
