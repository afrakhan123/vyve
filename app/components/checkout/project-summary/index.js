import React from 'react'

import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions
} from 'react-native'

import _ from 'lodash'

import { textStyles } from 'app/styles/text'
import { useStore } from 'app/store'
import { ICON_CHEVRON } from 'app/images/icons'
import { TEST_PROJECTS } from '../../../utils/test-data'
import colours from 'app/styles/colours'
import { useNavigation } from 'react-navigation-hooks'
import { EVENT_TRIP_OFFSETPROJECT } from '../../../constants';
let width = Dimensions.get('window').width

export const ProjectSummary = () => {

  const store = useStore()
  const { navigate } = useNavigation()
  const project = store.state.currentProject.project


  const onPressRow = () => {
    navigate('Projects')
  }

  return (
    <TouchableHighlight
      underlayColor='#e0e0e0'
      style={styles.container}
      onPress={onPressRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.projectTitle}>Offsetting Project</Text>
        <View style={styles.projectRow}>
          {project &&
            <View style={styles.projectDetails}>
              <Image style={styles.avatar} source={{ uri: project.avatar }} />
              <Text numberOfLines={2} style={[textStyles.h6, { maxWidth: width * 0.55 }]}>{project.name}</Text>
            </View>
          }
          {!project &&
            <Text style={textStyles.h6}>Choose Project</Text>
          }
          <Image style={styles.chevron} source={ICON_CHEVRON} />
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  projectRow: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  projectDetails: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addPaymentIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  cardIcon: {
    height: 42,
    width: 42,
    resizeMode: 'contain',
  },
  projectTitle: {
    ...textStyles.h5,
    marginBottom: 4,
  },
  chevron: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 44,
    borderWidth: 0.5,
    borderColor: colours.border,
    marginRight: 15,
  }
})

export default ProjectSummary 