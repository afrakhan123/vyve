import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Alert
} from 'react-native'

import React from 'react'
import { textStyles } from 'app/styles/text'
import colours from 'app/styles/colours'

import { ICON_OFFSET, ICON_CHECKMARK } from 'app/images/icons'
import { useEmissionsCalculator } from 'app/utils/emissions';

import { useNavigation, } from 'react-navigation-hooks'
import TripDetails from '../trip-details'
import { useStore } from '../../../store';
import { EVENT_IMPACT_TRIPOFFSET } from '../../../constants';
import { iconForTransportMode } from '../../../utils/formatters';
import { isFlight } from '../../../utils/emissions'
import { ICON_TRASH } from '../../../images/icons'
import { fontWeights } from '../../../styles/text'
import { useApi } from '../../../api'


import Mixpanel from 'react-native-mixpanel'
import { TouchableHighlight } from 'react-native-gesture-handler'

const width = Dimensions.get('window').width

const TripCard = ({ trip, isEditing = false }) => {
  const { navigate } = useNavigation()
  const store = useStore()
  const api = useApi()

  const calculate = useEmissionsCalculator(trip.transport_mode)


  const [translateAnimation] = React.useState(new Animated.Value(0))
  const [opacityAnimated] = React.useState(new Animated.Value(0))
  const [buttonXAnimated] = React.useState(new Animated.Value(6))


  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateAnimation, { toValue: isEditing ? -60 : 0, duration: 225, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacityAnimated, { toValue: isEditing ? 1 : 0, duration: 225, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ])
    ]).start()
  }, [isEditing])


  const onPressOffset = (trip) => {
    Mixpanel.trackWithProperties('Pressed Offset', { ...trip })
    store.checkout(trip)
    navigate('Checkout', { trip: trip })


  }

  const offsetButtonText = (trip) => {
    return trip.payment_id != null ? 'Offset' : '£' + calculate(trip.distance)[1].toFixed(2) + ' to VYVE your trip'
  }

  const deleteTrip = async (id) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateAnimation, { toValue: -width, duration: 350, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacityAnimated, { toValue: 0, duration: 225, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ])
    ]).start(async () => {
      const response = await api.deleteTrip(id)
      if (response) {
        store.deleteTrip(id)
        Mixpanel.trackWithProperties('Deleted Trip', { ...trip })
      }
    })
  }

  const onDelete = () => {
    if (trip.payment_id) {
      Alert.alert(
        'Already offset',
        "You've already offset the emissions from this trip. Are you sure you want to delete it?",
        [
          { text: 'Cancel', style: 'cancel', onPress: () => { } },
          { text: 'Delete', onPress: () => deleteTrip(trip.id) },
        ],
      )
    } else {
      deleteTrip(trip.id)
    }
  }

  return (
    <>
      <View style={[styles.container]}>
        <Animated.View style={{ transform: [{ translateX: translateAnimation }] }} >
          <View style={styles.inner}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.iconContainer}>
                  <Image style={styles.icon} source={iconForTransportMode(trip.transport_mode)} />
                </View>
                <View style={styles.contentContainer}>
                  <TripDetails trip={trip} showDuration={!isFlight(trip)} />
                </View>
              </View>
              <TouchableOpacity
                disabled={trip.payment_id != null}
                style={styles.offsetButton}
                onPress={() => onPressOffset(trip)}>
                <Text style={textStyles.buttonTitleSmall}>{offsetButtonText(trip)}</Text>
                <Image style={styles.buttonIcon} source={trip.payment_id == null ? ICON_OFFSET : ICON_CHECKMARK} />
              </TouchableOpacity>
            </View>
            <Animated.View style={{ justifyContent: 'center', opacity: opacityAnimated, marginLeft: 20, transform: [{ translateX: buttonXAnimated }] }}>
              <TouchableHighlight
                underlayColor="white" style={{ paddingVertical: 30 }} onPress={onDelete}>
                <View style={{ alignItems: 'center' }}>
                  <Image style={styles.delete} source={ICON_TRASH} />
                  <Text style={{ ...textStyles.caption, marginTop: 3, color: '#E3163C', fontSize: 12, fontWeight: fontWeights.medium, textAlign: 'center' }}>Delete</Text>
                </View>
              </TouchableHighlight>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  delete: {
    height: 26,
    width: 26,
    tintColor: '#E3163C',
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: colours.border,
    paddingVertical: 24,
  },

  inner: {
    width: width,
    flexDirection: 'row',
    marginHorizontal: 25,
  },


  iconContainer: {
    width: 56,
  },
  icon: {
    height: 35,
    width: 35,
    marginRight: 15
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  offsetButton: {
    height: 56,
    marginHorizontal: 5,
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#e9ff5f',
    marginTop: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    flexDirection: 'row'
  },
  buttonIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  }
})

export default TripCard