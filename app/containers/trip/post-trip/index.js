import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import TripStatisticsRow from 'app/components/trips/trip-stats-row'
import Border from 'app/components/border'
import TripDetailsRow from 'app/components/trips/trip-details-row'
import { createTrip } from 'app/api'
import LoadingFooter from 'app/components/loading/footer'
import FooterButton from 'app/components/buttons/footer'
import SuccessView from 'app/components/success'
import ErrorView from 'app/components/error'
import { useStore } from 'app/store'
import Mixpanel from 'react-native-mixpanel'
import { useNavigation } from 'react-navigation-hooks'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import ConfettiCannon from 'react-native-confetti-cannon';
import Style from 'app/styles/rocket'
import { StackActions } from 'react-navigation'
import { useEmissionsCalculator } from 'app/utils/emissions'
import {
  View, Modal, Text,
  StyleSheet, TouchableOpacity
} from 'react-native'


const ConfirmAndOffsetButton = ({ onPress = () => { } }) => {

  const [showConfirmation, setShowConfirmation] = useState(true)
  useEffect(() => { setTimeout(() => { setShowConfirmation(false) }, 1250) }, [])
  return (showConfirmation ? <SuccessView title='Added to your trips' full={!isIphoneX()} /> : <FooterButton onPress={onPress} title='Offset' full={!isIphoneX()} bright={true} />)
}

const ErrorAndTryAgainButton = ({ onPress = () => { } }) => {
  const [showError, setShowError] = useState(true)
  useEffect(() => { setTimeout(() => { setShowError(false) }, 1000) }, [])
  return (showError ? <ErrorView title='Unable to save trip' full={!isIphoneX()} /> : <FooterButton onPress={onPress} title='Try Again' full={!isIphoneX()} bright={true} />)
}

const PostTrip = ({ transport, from, to, distance, duration, emissions, cost, returnTrip }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState(null)
  const store = useStore()
  const [congratsModalVisible, setCongratsModalVisible] = useState(false);
  const { navigate, dispatch } = useNavigation()
  const [zeroEmmisions, setZeroEmissions] = useState(false);
  const [CO2eSaved, setCO2eSaved] = useState(0);

  useEffect(() => {
    console.log('ERROR POSTING TRIP :>>', error)
  }, [error])

  const onSuccess = () => {
    if (response) {
      store.checkout(response)
      navigate('Projects', { next: 'Checkout' })
    }
    Mixpanel.trackWithProperties('Pressed Offset', { ...response, cost: cost })
  }

  const onRetry = async () => {
    await createTrip(from, to, transport, distance, duration, emissions, returnTrip, setError, setResponse, setLoading)
  }

  useEffect(() => {

    if (transport.api_name === 'walking' || transport.api_name === 'cycle' || transport.api_name === 'electric_car') {
      setZeroEmissions(true)
      const calculate = useEmissionsCalculator('petrol_car')

      setCO2eSaved(calculate(distance)[0] + 'kg CO2e saved vs an average car journey')
    }

    const saveTrip = async () => {
      console.log("PostTrip - cost :>> ", cost);
      console.log("PostTrip - emissions :>> ", emissions);
      console.log("PostTrip - duration :>> ", duration);
      console.log("PostTrip - distance :>> ", distance);
      console.log("PostTrip - to :>> ", to);
      console.log("PostTrip - from :>> ", from);
      console.log("PostTrip - transport :>> ", transport);
      console.log("PostTrip - returnTrip :>> ", returnTrip);
      await createTrip(from, to, transport, distance, duration, emissions, returnTrip, setError, setResponse, setLoading)
    }
    saveTrip()
    setTimeout(() => { setCongratsModalVisible(true) }, 3000)
  }, [])




  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TripDetailsRow transport={transport} from={from} to={to} />
        <Border />
        <TripStatisticsRow distance={distance} emissions={emissions} cost={cost} />
      </View>
      {loading ? <LoadingFooter full={!isIphoneX()} /> :
        error ? <ErrorAndTryAgainButton onPress={onRetry} /> :
          response ? (zeroEmmisions ? <FooterButton onPress={() => { navigate('Home') }} title={CO2eSaved} full={!isIphoneX()} bright={true} /> :
            <ConfirmAndOffsetButton onPress={onSuccess} />) : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={congratsModalVisible}
        onRequestClose={() => {
          setCongratsModalVisible(false)
        }}
      >
        <View style={styles.modalContainer}>
          <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
          <View style={{ alignItems: 'center', borderRadius: 10, backgroundColor: Style.colours.dark, height: 275 }} >
            <Text style={{ color: Style.colours.yellow, padding: 15, fontSize: 24, textAlign: 'center' }}>CONGRATULATIONS</Text>
            <Text style={{ paddingHorizontal: 15, padding: 5, color: 'white', fontSize: 18, textAlign: 'center' }}>You just took another step to understanding your impact. Add another trip to keep tracking.</Text>
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Style.colours.yellow, width: 280, height: 50, borderRadius: 25, margin: 20 }}
              onPress={() => {
                setCongratsModalVisible(false)
                dispatch(StackActions.popToTop())
              }}
            >
              <Text style={{ color: 'black' }}>Add another trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Style.colours.dark, height: 35, width: 100 }}
              onPress={() => {
                setCongratsModalVisible(false)
              }}
            >
              <Text style={{ color: 'white' }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: -40,
    ...ifIphoneX({
      marginBottom: 30,
    }),
  },
  modalContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 30
  },
  inner: {
    marginTop: 24,
    marginBottom: 24,
    marginHorizontal: 22,
  },
})

export default PostTrip