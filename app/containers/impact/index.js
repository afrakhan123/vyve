import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useFocusEffect } from 'react-navigation-hooks'
import { textStyles } from 'app/styles/text'
import { useStore } from 'app/store'
import { isIphoneX } from 'react-native-iphone-x-helper'
import ActionButton from 'react-native-action-button';
import { SafeAreaView } from 'react-navigation'
import { useNavigation } from 'react-navigation-hooks'
import { useApi } from 'app/api'
import { ICON_MENU, ICON_SHARE } from 'app/images/icons'
import { sortByDate } from 'app/utils/formatters'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { USER_STORAGE_KEY, SUPPORT_EMAIL } from 'app/constants'
import { AuthContext } from 'app/utils/context/auth'
import { useStats } from 'app/hooks/useStats'
import { signOutCognito } from 'app/utils/context/auth'
import TripCard from 'app/components/trips/trip-card'
import Border from 'app/components/border'
import email from 'react-native-email'
import AsyncStorage from '@react-native-community/async-storage'
import Mixpanel from 'react-native-mixpanel'
import Style from 'app/styles/rocket'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useEmissionsCalculator } from 'app/utils/emissions'
import { metresToMiles } from 'app/utils/conversions'
import Share from 'react-native-share';
import { captureRef } from "react-native-view-shot";
import { SHARE_BACKGROUND } from 'app/images/background'
import Video from 'react-native-video';
import { gramsToKg } from 'app/utils/conversions'
import {
  ICON_SAVED,
  ICON_LIST,
  ICON_DISTANCE,
  ICON_OFFSETCLOUD
} from '../../images/icons'

import {
  Text,
  ImageBackground,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import moment from 'moment'

import { AuthActions } from 'app/hooks/useAuth'

const width = Dimensions.get('window').width;

const ImpactScreen = () => {

  const store = useStore()
  const [impact, setImpact] = React.useState(0)
  const api = useApi()
  const { navigate } = useNavigation()
  const [loadedUser, setLoadedUser] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)

  const [view, setView] = React.useState('All Time')
  const [progressBarPercentage, setProgressBarPercentage] = React.useState(0)
  const { showActionSheetWithOptions } = useActionSheet()
  const [loadingTrips, setLoadingTrips] = useState(false)

  const [totalEmissions, setTotalEmissions] = useState(0)
  const [noOfTrips, setNoOfTrips] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)
  const [totalKgSaved, setTotalKgSaved] = useState(0)
  const [totalKgOffset, setTotalKgOffset] = useState(0)
  const [totalKgToOffset, setTotalKgToOffset] = useState(0)
  const [costRemaining, setCostRemaining] = useState(0)
  const [paymentIdArray, setPaymentIdArray] = useState(0)

  const [header, setHeader] = React.useState(null)
  const viewShot = React.useRef();

  const { auth, dispatch } = React.useContext(AuthContext)

  useEffect(() => {

    console.log('AUTH :>>', auth)
    const header = {
      'Authorization': "Bearer " + auth.idToken,
    }
    setHeader(header)
  }, [auth])

  const setError = (error) => {
    console.warn('Impact: Sign Out Error', error)
  }

  const { stats, success, setId } = useStats(-1)

  React.useEffect(() => {

    if (success) {
      const timestamp = new Date()
      Mixpanel.set({
        "emissions_previous_week": stats.emissions / 1000,
        "emissions_offset_this week": stats.offset / 1000,
        "distance_this_week": metresToMiles(stats.distance).toFixed(0),
        "emissions_change_last_week": stats.change.toFixed(0),
        "emissions_previous_month": stats.emissions_month / 1000,
        "emissions_offset_this_month": stats.offset_month / 1000,
        "distance_this_month": metresToMiles(stats.distance_month).toFixed(0),
        "emissions_change_last_month": stats.change_month.toFixed(0),
        "emissions_metrics_updated_at": timestamp.toISOString(),
      })
    }
  }, [stats])


  /**
   * TODO: Rethink this logic 
   */
  React.useEffect(() => {
    const isFirst = loadedUser && !store.state.user.created_first_trip && !_.isEmpty(store.state.user) && !store.state.attemptedWalkthrough
    if (isFirst) {
      store.attemptedWalkthrough()
      navigate('Trip', { first: isFirst })
    }
  }, [store.state.user, loadedUser])


  // React.useEffect(() => {
  //   setImpact(store.state.user.total_emissions / 1000 || impact)
  // }, [store.state.user])

  /**
   * Get the user each time new trips are added 
   * So that we can check default projects and default payment details 
   * 
   * ⚠️ We need to improve this before we scale ⚠️
   */

  React.useEffect(() => {
    const getUser = async () => {
      console.log('ME :>>', header)
      const user = await api.me(header)
      if (user) {
        setLoadedUser(true)
        setId(user.data.id)
        // store.createUser(user.data) // TODO: separate action for sign in user 
      }
    }

    getUser()
  }, [store.state.trips, header])

  React.useEffect(() => {
    let totalOffsetCost = 0;
    let paidOffsetCost = 0;
    Object.values(store.state.trips).forEach((trip) => {
      const calculate = useEmissionsCalculator(trip.transport_mode)

      totalOffsetCost += calculate(trip.distance)[1]
      if (trip.payment_id) {
        paidOffsetCost += calculate(trip.distance)[1]
      }
    })
    const progressBarPercentageRatio = (paidOffsetCost / totalOffsetCost) * 100;
    setProgressBarPercentage(progressBarPercentageRatio)

  }, [store.state.trips])

  React.useEffect(() => {
    const calculate = useEmissionsCalculator('petrol_car')
    const tripsList = Object.values(store.state.trips).sort(sortByDate).filter(filterByDate);
    let totalEmissions = 0;
    let totalDistance = 0;
    let totalKgSaved = 0;
    let totalKgOffset = 0
    let costRemaining = 0;
    let totalKgToOffset = 0;
    let paymentIdArray = [];

    tripsList.forEach((trip) => {

      const C02e = calculate(trip.distance)[0]
      if (trip.transport_mode === 'walking' || trip.transport_mode === 'cycle' || trip.transport_mode === 'electric_car') {
        totalKgSaved += C02e
      }

      if (trip.payment_id) {
        totalKgOffset += gramsToKg(trip.emissions)
      }
      else {
        totalKgToOffset += gramsToKg(trip.emissions)
        paymentIdArray.push(trip.id)
        if (!(trip.transport_mode === 'walking' || trip.transport_mode === 'cycle' || trip.transport_mode === 'electric_car')) {
          costRemaining += calculate(trip.distance)[1]
        }
      }
      totalDistance += trip.distance
      totalEmissions += gramsToKg(trip.emissions)
    })
    setTotalEmissions(totalEmissions.toFixed(1))
    setNoOfTrips(tripsList.length)
    setTotalDistance(totalDistance)
    setTotalKgSaved(totalKgSaved.toFixed(1))
    setTotalKgOffset(totalKgOffset.toFixed(1))
    setTotalKgToOffset(totalKgToOffset.toFixed(1))
    setCostRemaining(costRemaining.toFixed(2))
    setPaymentIdArray(paymentIdArray)

  }, [store.state.trips, view])


  const onSignOut = (data) => {
    dispatch({
      type: AuthActions.Clear,
    })
    Mixpanel.track('Signed Out')
    Mixpanel.reset()
    navigate('Auth')
  }

  const onPressSignOut = async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY)
    store.logout()
    await signOutCognito(
      setError,
      onSignOut)
  }

  const onPressEmail = () => {
    const to = [SUPPORT_EMAIL]
    email(to, {
      subject: 'Help'
    }).catch(console.error)
  }

  const onPressMenu = () => {
    showActionSheetWithOptions(
      {
        options: ['Cancel', 'Sign Out', 'Help'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        textStyle: { textAlign: "center", width: '100%' }
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          onPressSignOut()
        }
        if (buttonIndex === 2) {
          onPressEmail()
        }
      },
    );
  }

  const onPressShare = async () => {
    Mixpanel.track('Pressed Share Button')
    let url = '';
    captureRef(viewShot.current, {
      format: "png",
      result: "base64"
    }).then(
      async uri => {
        url = 'data:image/png;base64,' + uri

        const title = 'VYVE';
        const message = 'https://play.google.com/store/apps/details?id=com.vyvenow';

        const shareOptions = Platform.select({
          ios: {
            activityItemSources: [
              { // For sharing url with custom title.
                placeholderItem: { type: 'url', content: url },
                item: {
                  default: { type: 'url', content: url },
                },
                subject: {
                  default: title,
                },
                linkMetadata: { originalUrl: url, url, title },
              },
            ],
          },
          default: {
            title,
            url,
            message: 'https://play.google.com/store/apps/details?id=com.vyvenow',
            type: 'image/jpeg',
            failOnCancel: false,
          },
        });

        try {
          await Share.open(shareOptions);
        } catch (error) {
          console.log(error)
        }
      },
      error => console.error("Oops, snapshot failed", error)
    );
  };


  /**
   * Track Screen Event 
   */
  const logEvents = React.useCallback(() => {
    Mixpanel.track('Open Home Screen')
  }, [])

  useFocusEffect(logEvents)


  const trips = async () => {
    console.log('Trying trips :>>', auth)
    setLoadingTrips(true)
    const trips = await api.getTrips(header)
    console.log('TRIPS :>>', trips)
    store.receiveTrips(trips.data)
    setLoadingTrips(false)
  }

  useEffect(() => {
    if (header) {
      trips()
    }
  }, [header])


  /**
   * Get trips from server each time we focus the impact page 
   */
  const onFocus = React.useCallback(() => {
    trips()
  }, [store.state.loadedTrips, store.state.displayCheckout])

  useFocusEffect(onFocus)

  const onPressAddTrip = () => {
    Mixpanel.track('Pressed Add Trip')
    store.clearTrip()
    navigate('Trip')
    setIsEditing(false)
  }

  const ViewEnum = Object.freeze({
    last7_days: 'This Week',
    last30_days: 'This Month',
    alltime: 'All Time'
  })

  const filterByDate = (trip) => {
    {
      if (view === ViewEnum.last7_days) {
        // var period = moment().subtract(7, 'd').format('YYYY-MM-DD');
        var period = moment().startOf('week').format('YYYY-MM-DD')
        return trip.created_at > period
      }
      else if (view === ViewEnum.last30_days) {
        // var period = moment().subtract(30, 'd').format('YYYY-MM-DD');
        var period = moment().startOf('month').format('YYYY-MM-DD')
        return trip.created_at > period
      }
      else {
        return trip
      }
    }
  }

  return (
    <>
      <StatusBar backgroundColor={Style.colours.dark} barStyle="light-content" />
      <SafeAreaView forceInset={{ top: 'never', bottom: 'never' }} style={styles.container}>
        <View style={[styles.impactScoreContainer]}>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[Style.text.hero, { marginLeft: 0, }]}>{totalEmissions}kg</Text>
          <Text style={[Style.text.hero, Style.text.white, {
            fontSize: 22, marginTop: -25
          }]}>CO2e emitted</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.userStatIcon} source={ICON_LIST} />
              <View style={styles.userStat}>
                <Text style={styles.userStatText}>{noOfTrips} trips</Text>
                <Text style={[Style.text.body, Style.text.light]}>Trip Summary</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.userStatIcon} source={ICON_DISTANCE} />
              <View style={styles.userStat}>
                <Text style={styles.userStatText}>{metresToMiles(totalDistance).toFixed(1) + 'mi'}</Text>
                <Text style={[Style.text.body, Style.text.light]}>Distance</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.userStatIcon} source={ICON_SAVED} />
              <View style={styles.userStat}>
                <Text style={styles.userStatText}>{totalKgSaved}kg</Text>
                <Text style={[Style.text.body, Style.text.light]}>C02e saved</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.userStatIcon} source={ICON_OFFSETCLOUD} />
              <View style={styles.userStat}>
                <Text style={styles.userStatText}>{totalKgOffset}kg</Text>
                <Text style={[Style.text.body, Style.text.light]}>C02e offset</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            disabled={costRemaining < 0.01}
            onPress={() => { navigate('Aggregate', { paymentIdArray, costRemaining, totalKgToOffset, view }) }}
            style={styles.offsetButton}
          >
            <Text style={[Style.text.body, Style.text.dark], { fontWeight: 'bold' }}>£{costRemaining} remaining to VYVE your trips</Text>
          </TouchableOpacity>
        </View>

        {loadingTrips &&
          <View style={{ flexGrow: 1, backgroundColor: 'white', justifyContent: 'center' }}>
            <ActivityIndicator size='small' color={Style.colours.dark} />
          </View>
        }

        {!loadingTrips && !_.isEmpty(store.state.trips) &&
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 25, marginBottom: 5 }}>
              <Text style={[Style.text.title3, Style.text.light, { fontSize: 20 }]}>Trips</Text>
              <TouchableOpacity onPress={() => setIsEditing(isEditing => !isEditing)} >
                <Text style={[Style.text.title3, Style.text.light, { fontSize: 18 }]}>{isEditing ? 'Done' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>
            <Border />
            <View style={{ flexGrow: 1, backgroundColor: 'white', width: '100%', height: '100%' }}>
              <FlatList
                data={Object.values(store.state.trips).sort(sortByDate).filter(filterByDate)}
                showsVerticalScrollIndicator={false}
                style={styles.trips}
                removeClippedSubviews={true}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => { return <TripCard trip={item} isEditing={isEditing} /> }} />
            </View>
          </View>
        }

        {!loadingTrips && _.isEmpty(store.state.trips) &&
          <View style={styles.empty}>
            <Video source={require('../../images/background/addtrip.mp4')}   // Can be a URL or a local file.
              repeat
              resizeMode={"cover"}
              onBuffer={() => { }}                // Callback when remote video is buffering
              onError={() => { }}               // Callback when video cannot be loaded
              style={styles.video} />
            <TouchableOpacity style={styles.button} onPress={onPressAddTrip}>
              <Text style={{ fontSize: 22, color: 'white', textAlign: 'center' }}>Add your first trip</Text>
              <Image style={styles.plusIcon} source={require('../../images/background/plus.png')} />
            </TouchableOpacity>
          </View>
        }
      </SafeAreaView>
      <View style={styles.signOutContainer}>

        <TouchableOpacity style={[styles.timeframe, view === ViewEnum.alltime && { borderBottomColor: Style.colours.light }]}
          onPress={() => setView(ViewEnum.alltime)}>
          <Text style={[Style.text.light, { textAlign: "center", fontSize: 12 }]}>{ViewEnum.alltime}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.timeframe, view === ViewEnum.last30_days && { borderBottomColor: Style.colours.light }]}
          onPress={() => setView(ViewEnum.last30_days)}>
          <Text style={[Style.text.light, { textAlign: "center", fontSize: 12 }]}>{ViewEnum.last30_days}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.timeframe, view === ViewEnum.last7_days && { borderBottomColor: Style.colours.light }]}
          onPress={() => setView(ViewEnum.last7_days)}>
          <Text style={[Style.text.light, { textAlign: "center", fontSize: 12 }]}>{ViewEnum.last7_days}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressShare} style={styles.signOutbutton}>
          <Image resizeMode="contain" style={{ width: 20, marginTop: 4, }} source={ICON_SHARE} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressMenu} style={styles.signOutbutton}>
          <Image resizeMode="contain" style={{ width: 20, marginTop: 4, }} source={ICON_MENU} />
        </TouchableOpacity>
      </View>

      <ActionButton
        offsetY={Platform.OS === "ios" ? 40 : 30}
        buttonColor={Style.colours.dark}
        buttonTextStyle={[Style.weights.semibold, { fontSize: 28 }]}
        onPress={onPressAddTrip}
      />
      {/* Needs to render for Viewshot so render off screen  */}
      <View style={{ position: 'absolute', right: 2000 }}>
        <View collapsable={false} ref={viewShot} style={{ height: 350, width: 350 }}>
          <ImageBackground source={SHARE_BACKGROUND} style={styles.shareImage}>
            <Text style={styles.shareText}>{progressBarPercentage ? progressBarPercentage.toFixed(0) : 0}<Text style={{ fontSize: 60 }}>%</Text></Text>
          </ImageBackground>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.colours.dark,
  },
  impactScoreContainer: {
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    ...ifIphoneX({
      marginTop: 100,
    }, {
      marginTop: 70,
    })
  },
  shareImage: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: 'center'
  },
  shareText: {
    fontFamily: 'DrukCond-Super',
    marginLeft: '5%',
    marginTop: Platform.OS == 'android' ? '-10%' : '4%',
    color: "white",
    fontSize: 190
  },
  split: {
    width: 0.5,
    height: 45,
    backgroundColor: Style.colours.titleGrey,
    opacity: 0.65,
  },
  trips: {
    backgroundColor: 'white',
    flexGrow: 1,
    marginBottom: 450
  },
  timeframe: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 2,
    padding: 10,
    height: '100%'
  },
  signOutContainer: {
    justifyContent: 'space-between',
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    right: 20,
    left: 25,
    ...ifIphoneX({
      top: 40,
    }, {
      top: 10,
    })
  },
  signOutbutton: {
    alignItems: "flex-end",
    width: 50,
    height: 100,
    justifyContent: 'center',
  },
  video: {
    width: width,
    flex: 1,
    backgroundColor: Style.colours.dark,
  },
  empty: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Style.colours.dark,
    // top: 0,
    position: 'absolute',
    height: 50, width: 250,
    borderRadius: 30
  },
  plusIcon: {
    marginLeft: 15, height: 25, width: 25
  },
  offsetButton: {
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ff5f',
    height: 56,
    borderRadius: 40,
    width: '85%',
  },
  userStat: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7
  },
  userStatIcon: {
    height: 35,
    width: 35
  },
  userStatText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17
  },
})


export default ImpactScreen