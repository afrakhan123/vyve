import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { TEST_PROJECTS } from '../../../utils/test-data'
import ProjectCard from '../../../components/projects/project-card'
import Title from '../../../components/text/screen-title'
import { textStyles } from '../../../styles/text';
import { useNavigationParam } from 'react-navigation-hooks';
import { useApi } from 'app/api'
import { EVENT_PROJECTS_LIST } from '../../../constants';

import Mixpanel from 'react-native-mixpanel'

const ProjectListScreen = () => {
  const api = useApi()
  const next = useNavigationParam('next')

  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    Mixpanel.track('Open Projects List Screen')
  }, [])

  React.useEffect(() => {
    const projects = async () => {
      const p = await api.getProjects()
      setProjects(p.data)
    }

    projects()
  }, [])

  return (
    <>
      <Title title='Choose an Offsetting Project' />
      <View style={styles.container}>
        <FlatList
          data={projects}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingTop: 24, }}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => { return <ProjectCard project={item} next={next} /> }} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 22,
  }
})

export default ProjectListScreen 