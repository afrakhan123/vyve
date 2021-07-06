import React from 'react'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import { gramsToKg } from 'app/utils/conversions'
import { PRICE_PER_TONNE_GBP } from 'app/constants'
import { textStyles } from 'app/styles/text'
import { useEmissionsCalculator } from 'app/utils/emissions'

export const CostSummary = ({ trip }) => {

  const calculate = useEmissionsCalculator(trip.transport_mode)

  return (
    <View style={[styles.row, styles.costSummary]}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.paymentTitle}>Emissions</Text>
        {/* <Text style={textStyles.caption}>Emissions</Text> */}
        <Text style={textStyles.h6}>{gramsToKg(trip.emissions) + 'kg CO2e'}</Text>
        {/* <Text style={textStyles.h6}>{'£' + PRICE_PER_TONNE_GBP.toFixed(2) + ' per tonne'}</Text> */}
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={textStyles.caption}>Total</Text>
        <Text style={textStyles.h2}>{'£' + calculate(trip.distance)[1].toFixed(2)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginVertical: 20,
  },
  costSummary: {
    alignContent: 'space-between',
    alignItems: 'center'
  },
  paymentTitle: {
    ...textStyles.h5,
    marginBottom: 4,
  },
})

export default CostSummary 