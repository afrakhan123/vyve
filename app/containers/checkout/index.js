import React from 'react'

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native'

import Title from 'app/components/text/screen-title'
import Border from 'app/components/border'
import TripSummary from 'app/components/checkout/trip-summary'
import CostSummary from 'app/components/checkout/cost-summary'
import PaymentSummary from '../../components/checkout/payment-summary'
import FooterButton from 'app/components/buttons/footer'
import { textStyles } from '../../styles/text'
import ProjectSummary from '../../components/checkout/project-summary'
import SuccessView from 'app/components/success'

import { useStore } from 'app/store'
import { useEmissionsCalculator } from '../../utils/emissions'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'


import _ from 'lodash'
import { SafeAreaView } from 'react-navigation';
import { useApi } from 'app/api'
import LoadingFooter from '../../components/loading/footer';

import { EVENT_PAYMENT_PAYNOW, EVENT_TRIP_OFFSETCANCEL, EVENT_TRIP_OFFSETSUMMARY } from '../../constants';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Mixpanel from 'react-native-mixpanel'


const CheckoutScreen = ({ onComplete = () => { }, onCancel = () => { } }) => {
  const api = useApi()
  const store = useStore()
  const trip = store.state.checkoutTrip
  const calculate = useEmissionsCalculator(trip.transport_mode)
  const { dismiss } = useNavigation()


  const [co2, cost] = calculate(trip.distance)
  const [isLoading, setIsLoading] = React.useState(false)
  const [payDisabled, setPayDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    Mixpanel.trackWithProperties('Open Checkout', { ...trip })
  }, [])

  React.useEffect(() => {
    const emptyProject = _.isEmpty(store.state.currentProject)
    const emptyCard = _.isEmpty(store.state.payment_methods)
    setPayDisabled(emptyProject || emptyCard)
  }, [store.state])

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        dismiss()
      }, 500)
    }
  }, [success])

  const onPressPay = async () => {
    setIsLoading(true)

    const pay = {
      payment_method_id: Object.values(store.state.payment_methods)[0].id,
      project_id: store.state.currentProject.project.id,
      amount: cost * 100,
      currency: "gbp",
      trips: [trip.id]
    }

    const payment = await api.createPayment(pay).catch(e => {
      setSuccess(false)
    })

    setIsLoading(false)
    if (payment) {
      Mixpanel.trackWithProperties('Made offset payment', { ...pay })
      setSuccess(true)
    }
  }

  const onPressCancel = () => {
    onCancel() // This is for closing from add trip 
    dismiss()
  }

  const renderFooter = () => {
    return isLoading ? <LoadingFooter bright={true} full={false} /> :
      (success ? <SuccessView title='Payment Completed' full={false} /> : <FooterButton
        bright={true}
        disabled={payDisabled}
        onPress={onPressPay}
        title={'Pay £' + cost.toFixed(2)}
        full={false} />)
  }

  return (
    <View style={styles.container}>

      <Title title='VYVE your Trip' />

      <ScrollView contentContainerStyle={styles.checkoutContainer}>
        <TripSummary trip={trip} />
        <Border />
        <CostSummary trip={trip} />
        <Border />
        <PaymentSummary />
        <Border />
        <ProjectSummary />
        <Border />
      </ScrollView>
      <View style={{ height: 132 }}>
        <View style={styles.buttonContainer}>
          {renderFooter()}

          <TouchableOpacity disabled={isLoading} style={styles.cancelButton} onPress={onPressCancel}>
            <Text style={textStyles.h3} >Cancel</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {
    marginHorizontal: 25,
  },
  checkoutContainer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginVertical: 20,
  },
  tripSummary: {
    marginRight: 28,
  },
  costSummary: {
    alignContent: 'space-between',
    alignItems: 'center'
  },
  summaryIcon: {
    height: 90,
    width: 90,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    // height: 132,
    width: '100%',
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    ...ifIphoneX({
      bottom: 36,
    }, {
      bottom: 20,
    })
  },
  cancelButton: {

    justifyContent: 'center',
    alignItems: 'center',
    ...ifIphoneX({
      marginTop: 20,
    }, {
      marginTop: 16,
    })
  }
})

export default CheckoutScreen