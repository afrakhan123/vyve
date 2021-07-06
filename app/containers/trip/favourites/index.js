
import React from 'react'

import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
} from 'react-native'
import { useApi } from 'app/api'
import { useNavigation } from 'react-navigation-hooks'
import { flightMode, FlightClassEnum, airportDistance, isFlight } from '../../../utils/emissions';
import { textStyles } from '../../../styles/text'
import { useStore } from '../../../store';
import { transportModeTypeFromName } from '../../../utils/emissions';
import { iconForTransportMode } from '../../../utils/formatters';
import {
    ICON_HEART_FILLED, ICON_HISTORY
} from '../../../images/icons'
import Mixpanel from 'react-native-mixpanel'
import {
    ICON_RETURN
} from '../../../images/icons'

const FavouritesScreen = () => {
    const api = useApi()
    const store = useStore()
    const { navigate } = useNavigation()
    const [faves, setfaves] = React.useState([])
    const [recurring, setRecurring] = React.useState([])

    React.useEffect(() => {
        getFaves()
    }, [])

    React.useEffect(() => {
        const getRecurring = async () => {
            const response = await api.getRecurring()
                .catch(error => {
                    return
                })
            Object.values(response.data).forEach((trip) => {
                trip.transportModeType = transportModeTypeFromName(trip.transport_mode)
                trip.icon = iconForTransportMode(trip.transport_mode)
            })

            setRecurring(Object.values(response.data))
            return
        }
        getRecurring()
    }, [])

    const getFaves = async () => {
        const response = await api.getFaves()
            .catch(error => {
                return
            })
        Object.values(response.data).forEach((trip) => {
            trip.transportModeType = transportModeTypeFromName(trip.transport_mode)
            trip.icon = iconForTransportMode(trip.transport_mode)
        })

        setfaves(Object.values(response.data))
        return
    }

    const didSelectFave = (trip) => {
        Mixpanel.track('Pressed Fave Trip')
        let from_coords = JSON.parse(trip.from_coords)
        from_coords = { longitude: from_coords.coordinates[0], latitude: from_coords.coordinates[1] }
        let to_coords = JSON.parse(trip.to_coords)
        to_coords = { longitude: to_coords.coordinates[0], latitude: to_coords.coordinates[1] }

        store.clearTrip() // If you go back and select a different transport mode, you're starting over

        store.setOrigin(trip.from_name, from_coords)
        store.setDestination(trip.to_name, to_coords)

        if (isFlight(trip)) {
            switch (trip.transport_mode) {
                case "flight_long_first":
                case "flight_long_business":
                case "flight_short_business":
                    const dist_business = airportDistance(from_coords, to_coords)
                    const mode_business = flightMode(dist_business, FlightClassEnum.Business)
                    store.setMode(mode_business)
                    navigate('Confirm', { isFlight: true })
                    break
                case "flight_domestic":
                case "flight_short_economy":
                case "flight_long_economy":
                    const dist_econ = airportDistance(from_coords, to_coords)
                    const mode_econ = flightMode(dist_econ, FlightClassEnum.Economy)
                    store.setMode(mode_econ)
                    navigate('Confirm', { isFlight: true })
                    break
            }
        }
        else {
            store.setMode(trip.transportModeType)
            navigate('Confirm')
        }
    }

    const deleteFave = async (trip) => {
        await api.deleteFave(trip.id)
        getFaves() //refresh data
    }

    return <View>
        {faves.map((trip, index) => {
            return (
                <TouchableOpacity key={index} style={styles.buttonFave} onPress={() => { didSelectFave(trip) }}>
                    <TouchableOpacity onPress={() => { deleteFave(trip) }}>
                        <Image resizeMode='contain'
                            style={styles.iconFave} source={ICON_HEART_FILLED} />
                    </TouchableOpacity>
                    <View style={{ flex: 5, padding: 10 }}>
                        <Text numberOfLines={2} style={textStyles.h5}>To {trip.to_name}</Text>
                        <Text numberOfLines={2} style={textStyles.h5}>From {trip.from_name}</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Image resizeMode='contain'
                            style={styles.icon} source={trip.icon} />
                    </View>
                </TouchableOpacity >
            )
        })}
        {recurring.map((trip, index) => {
            return (
                <TouchableOpacity key={index} style={styles.buttonFave} onPress={() => { didSelectFave(trip) }}>
                    <Image resizeMode='contain'
                        style={styles.iconFave} source={ICON_HISTORY} />
                    <View style={{ flex: 5, padding: 10 }}>
                        <Text numberOfLines={2} style={textStyles.h5}>To {trip.to_name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text numberOfLines={2} style={textStyles.h5}>From {trip.from_name}</Text>
                            <Image style={styles.iconReturn} source={trip.return_trip === 1 ? ICON_RETURN : ""} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Image resizeMode='contain'
                            style={styles.icon} source={trip.icon} />
                    </View>
                </TouchableOpacity >
            )
        })}
    </View>
}


const styles = StyleSheet.create({
    buttonFave: {
        borderBottomColor: "grey",
        borderBottomWidth: 0.3,
        alignItems: 'center',
        padding: 15,
        height: 92,
        alignSelf: 'stretch',
        flexDirection: 'row'
    },
    icon: {
        height: 35,
        width: 35,
        marginRight: 15,
    },
    iconFave: {
        height: 25,
        width: 25,
        marginHorizontal: 15,
    },
    iconReturn: {
        height: 10,
        width: 10,
        margin: 5
    },
})

export default FavouritesScreen 