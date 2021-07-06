import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createSwitchNavigator } from 'react-navigation'
import TransportModeScreen from 'app/containers/trip/transport-mode'
import CarTypeScreen from 'app/containers/trip/car-type'
import TripConfirmationScreen from 'app/containers/trip/trip-confirmation'
import ProjectListScreen from 'app/containers/projects/project-list'
import CheckoutScreen from 'app/containers/checkout'
import AggregatePaymentScreen from 'app/containers/aggregatePayment'
import AddPaymentScreen from 'app/containers/payments/add-card'
import FirstTripScreen from 'app/containers/trip/first-trip'
import Launch from 'app/containers/launch'
import CloseButton from 'app/components/buttons/close'
import CloseAuthButton from 'app/components/buttons/close-auth'
import LocationsScreen from 'app/containers/trip/locations'
import SearchLocationScreen from 'app/containers/trip/search-location'
import CloseTripButton from 'app/components/buttons/close-trip'
import AuthenticationScreen from 'app/containers/authentication'
import CreateAccountScreen from 'app/containers/authentication/create'
import LandingScreen from 'app/containers/landing'
import FlightDetailsScreen from 'app/containers/flights/flight-details'
import ImpactScreen from 'app/containers/impact'
import VerifyScreen from 'app/containers/authentication/verify'
import ForgotScreen from 'app/containers/authentication/forgot'
import ResetCodeScreen from 'app/containers/authentication/reset-code'
import NewPasswordScreen from 'app/containers/authentication/new-password'
import Style from 'app/styles/rocket'
import OnboardingView from 'app/containers/onboarding'
import TripScreen from 'app/containers/trip'

const CheckoutStack = createStackNavigator(
  {
    Checkout: {
      screen: CheckoutScreen,
    },
    Projects: ProjectListScreen,
    AddPayment: AddPaymentScreen,

  },
  {
    headerMode: 'float',
    cardShadowEnabled: false,
    defaultNavigationOptions: {
      headerForceInset: { top: 'always', bottom: 'never' },
      headerTintColor: Style.colours.light,
      headerStyle: {
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
        backgroundColor: Style.colours.navigationBar,
      },
    }
  }
)

const AggregateStack = createStackNavigator(
  {
    AggregatePayment: {
      screen: AggregatePaymentScreen,
    },
    Projects: ProjectListScreen,
    AddPayment: AddPaymentScreen,
  },
  {
    headerMode: 'float',
    cardShadowEnabled: false,
    defaultNavigationOptions: {
      headerForceInset: { top: 'always', bottom: 'never' },
      headerTintColor: Style.colours.light,
      headerStyle: {
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
        backgroundColor: Style.colours.navigationBar,
      },
    }
  }
)

const AddTripStack = createStackNavigator(
  {
    First: FirstTripScreen,
    Mode: TransportModeScreen,
    Car: CarTypeScreen,
    Flight: FlightDetailsScreen,
    Locations: LocationsScreen,
    Search: {
      screen: SearchLocationScreen,
      navigationOptions: {
        headerRight: null,
      }
    },
    AddTrip: {
      screen: TripScreen,
      navigationOptions: {
        gesturesEnabled: false,
        headerTransparent: true,
        headerLeft: null,
        headerRight: (
          <CloseButton lightBackground={true} />
        ),
        headerStyle: {
          elevation: 0, //for android
          shadowOpacity: 0, //for ios
          borderBottomWidth: 0, //for ios
          marginLeft: 12,
          backgroundColor: 'transparent',
        },
      }
    },
    Confirm: {
      screen: TripConfirmationScreen,
      navigationOptions: {
        gesturesEnabled: false,
        headerTransparent: true,
        headerLeft: null,
        headerRight: (
          <CloseButton lightBackground={true} />
        ),
        headerStyle: {
          elevation: 0, //for android
          shadowOpacity: 0, //for ios
          borderBottomWidth: 0, //for ios
          marginLeft: 12,
          backgroundColor: 'transparent',
        },
      }
    },
    Projects: ProjectListScreen,
    Checkout: {
      screen: CheckoutScreen,
    },
    AggregatePayment: {
      screen: AggregatePaymentScreen,
    },
    AddPayment: AddPaymentScreen,
  },
  {
    cardShadowEnabled: false,
    navigationOptions: {
      gesturesEnabled: false,
    },
    defaultNavigationOptions: {
      headerRight: (
        <CloseTripButton />
      ),
      headerForceInset: { top: 'always', bottom: 'never' },
      headerTintColor: Style.colours.light,
      headerStyle: {
        elevation: 0, //for android
        shadowOpacity: 0, //for ios
        borderBottomWidth: 0, //for ios
        backgroundColor: Style.colours.navigationBar,
      },
    }
  }
)

const authOptions = {
  cardShadowEnabled: false,
  defaultNavigationOptions: {
    headerRight: (
      <CloseAuthButton lightBackground={true} />
    ),
    headerForceInset: { top: 'always', bottom: 'never' },
    headerTintColor: '#000',
    headerStyle: {
      elevation: 0, //for android
      shadowOpacity: 0, //for ios
      borderBottomWidth: 0, //for ios
      marginLeft: 12,
    },
  }
}

//TODO: Cleanup unused screens for creating an account 
const CreateAccountStack = createStackNavigator(
  {
    Create: CreateAccountScreen,
    Verify: VerifyScreen,
  },
  authOptions
)

const SignInStack = createStackNavigator(
  {
    Authenticate: AuthenticationScreen,
    Forgot: ForgotScreen,
    Reset: ResetCodeScreen,
    Password: NewPasswordScreen,
    Verify: VerifyScreen
  },
  authOptions
)


const AuthenticationStack = createStackNavigator(
  {
    Landing: LandingScreen,
    Authenticate: SignInStack,
    // Create: CreateAccountStack,
  },
  {
    mode: 'modal',
    initialRouteName: 'Landing',
    headerMode: 'none',
  }
)

const AppStack = createStackNavigator(
  {
    Home: ImpactScreen,
    Trip: AddTripStack,
    Checkout: CheckoutStack,
    Aggregate: AggregateStack
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

export const Root = createSwitchNavigator(
  {
    Launch,
    App: AppStack,
    Auth: AuthenticationStack,
    Onboarding: {
      screen: OnboardingView,
      headerMode: 'none',
    },
  },
  {
    headerMode: 'none',
  }
)