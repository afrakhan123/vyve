import _ from 'lodash'
import { PermissionsAndroid } from "react-native"

export const requestLocationPermission = async (setPermission) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "VYVE",
        message:
          "VYVE needs access to your location to determine your starting point",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    setPermission(granted === PermissionsAndroid.RESULTS.GRANTED)
  } catch (err) {
    console.warn(err)
  }
}