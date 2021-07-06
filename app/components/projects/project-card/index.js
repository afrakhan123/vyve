import React from 'react'
import ProgressBar from 'app/components/progress-bar'
import colours from 'app/styles/colours'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import Mixpanel from 'react-native-mixpanel'
import PrimaryButton from '../../buttons/primary'
import SecondaryButton from '../../buttons/secondary'
import { useNavigation } from 'react-navigation-hooks'
import { useStore } from '../../../store'
import { textStyles } from 'app/styles/text'

import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking
} from 'react-native'


const ProjectCard = ({ project, next = undefined }) => {

  const { navigate, goBack } = useNavigation()
  const store = useStore()

  const onPressSelect = () => {
    Mixpanel.trackWithProperties('Chose Project', { name: project.name })
    store.choseProject(project)
    return next ? navigate(next) : goBack()
  }

  const onPressLearnMore = async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(project.url)
    } else {
      Linking.openURL(project.url)
    }
  }

  return (
    <View style={styles.container} >
      <View style={styles.contentContainer}>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.projectDescription}>{project.description}</Text>
        <ProgressBar style={styles.progressBar} total={project.total_emissions} target={project.target_emissions} />
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 8, marginLeft: -5, }}>
          <PrimaryButton title='Select' onPress={onPressSelect} />
          {project.url && <SecondaryButton title='Learn More' onPress={onPressLearnMore} />}
        </View>
      </View>
      <View style={styles.imageContainer} >
        <Image style={styles.image} source={{ uri: project.avatar }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 23,
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colours.border,
  },
  imageContainer: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#C7C7C7',
    width: 124,
  },
  image: {
    flex: 1,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 25,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  projectName: {
    marginBottom: 8,
    ...textStyles.h3,
  },
  projectDescription: {
    marginBottom: 8,
    ...textStyles.smallBody,
  },
  progressBar: {
    flex: 1,
  },
})

export default ProjectCard 