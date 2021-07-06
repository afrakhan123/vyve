import React, { useState, useEffect } from 'react'
import AppIntroSlider from 'react-native-app-intro-slider';
import OnboardingCard from 'app/components/onboarding/onboarding-card'
import rocket from 'app/styles/rocket'
import { textStyles } from 'app/styles/text'
import { BACKGROUND_BOTTOM, TITLE_UNDERSTAND, TITLE_TRACK, TITLE_REDUCE } from 'app/images/onboarding'
import PageControl from 'react-native-page-control'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { useNavigation } from 'react-navigation-hooks'
import AsyncStorage from '@react-native-community/async-storage'
import { ONBOARDING_STORAGE_KEY } from 'app/constants'
import Video from 'react-native-video';
import Style from 'app/styles/rocket'
import Mixpanel from 'react-native-mixpanel'

import {
  SLIDE_UNDERSTAND,
  SLIDE_TRACK,
  SLIDE_REDUCE,
} from 'app/constants/onboarding'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native'


const width = Dimensions.get('window').width
const ratio = width / 1242

const OnboardingView = () => {
  const slides = [SLIDE_UNDERSTAND, SLIDE_TRACK, SLIDE_REDUCE,].sort((a, b) => (a.key > b.key) ? 1 : -1)
  const titles = [TITLE_UNDERSTAND, TITLE_TRACK, TITLE_REDUCE]
  const [isLast, setIsLast] = useState(false)
  const [source, setSource] = useState(TITLE_UNDERSTAND)
  const [page, setPage] = useState(0)
  const { navigate } = useNavigation()

  useEffect(() => {
    Mixpanel.track("Open Onboarding Screen")
  }, [])

  useEffect(() => {
    const onboarded = async () => {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(true))
    }

    onboarded()
  }, [])

  const renderItem = ({ item }) => {
    return <OnboardingCard item={item} />
  }

  const didTapSkip = (isLast) => {
    Mixpanel.track(isLast ? 'Completed Onboarding' : 'Skipped Onboarding')
    navigate('Auth')
  }

  const onSlideChange = (index) => {
    setPage(index)
    setSource(source => titles[index] || source)
    setIsLast(index == slides.length - 1)
  }

  const skipButton = () => {
    return (<TouchableOpacity onPress={() => didTapSkip(isLast)} style={{ flexShrink: 1, paddingLeft: 50, paddingVertical: 10, paddingRight: 10, justifyContent: 'center', alignItems: 'flex-end', }}>
      <Text style={[textStyles.headerButtonTitle, { color: rocket.colours.yellow, fontSize: 18, fontWeight: rocket.weights.bold }]}>{isLast ? 'DONE' : 'SKIP'}</Text>
    </TouchableOpacity>)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />

      <View style={styles.videoContainer} >

        <Video source={require('../../images/onboarding/frameonboarding.mp4')}   // Can be a URL or a local file.
          repeat
          resizeMode={"none"}
          onBuffer={() => { }}                // Callback when remote video is buffering
          onError={() => { }}               // Callback when video cannot be loaded
          style={styles.video}

        />
        <View style={{ backgroundColor: Style.colours.dark, height: 70, justifyContent: 'center' }}>
          {skipButton()}
        </View>
      </View>
    </View>)

  // return (
  //   <View style={styles.container}>
  //     <StatusBar barStyle='light-content' />
  //     <Image source={source} style={styles.title} />
  //     <Image source={BACKGROUND_BOTTOM} style={styles.bottom} />
  //     <View style={styles.slideContainer}>

  //       <AppIntroSlider
  //         dotStyle={null}
  //         activeDotStyle={null}
  //         renderNextButton={null}
  //         renderDoneButton={null}
  //         showNextButton={false}
  //         showDoneButton={false}
  //         scrollEnabled={true}
  //         paginationStyle={styles.pagination}
  //         renderItem={renderItem}
  //         slides={slides}
  //         onSlideChange={onSlideChange}
  //         onDone={null} />
  //     </View>

  //     <View style={styles.skipContainer}>
  //       {skipButton()}
  //       <PageControl
  //         style={styles.pageControl}
  //         numberOfPages={slides.length}
  //         currentPage={page}
  //         pageIndicatorTintColor={rocket.colours.dark}
  //         currentPageIndicatorTintColor={rocket.colours.yellow}
  //         indicatorStyle={styles.indicator}
  //         currentIndicatorStyle={{ borderRadius: 8 }}
  //         indicatorSize={{ width: 8, height: 8 }}
  //         onPageIndicatorPress={() => { }}
  //       />
  //     </View>
  //   </View>)
}


const styles = StyleSheet.create({
  video: {
    marginTop: 25,
    marginBottom: 30,
    flex: 1,
    backgroundColor: Style.colours.dark,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: Style.colours.dark,
  },
  indicator: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: rocket.colours.light
  },
  slideContainer: {
    flexGrow: 1,
    marginTop: 20,
    ...ifIphoneX({
      marginBottom: ratio * 357 - 58
    }, {
      marginBottom: ratio * 357 - 12
    })
  },
  button: {
    backgroundColor: 'black',
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 8,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: width,
    height: ratio * 723,
    marginTop: -20,
  },
  bottom: {
    width: width,
    height: ratio * 357,
    marginTop: 20,
    position: 'absolute',
    bottom: 0,
  },
  pagination: {
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
  },
  pageControl: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  skipContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    height: 44,
    ...ifIphoneX({
      marginBottom: 36
    }, {
      marginBottom: 12
    })
  },
})

export default OnboardingView 