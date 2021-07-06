import React from 'react'

import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native'

import _ from 'lodash'

import { textStyles } from 'app/styles/text'
import { useStore } from 'app/store'
import { ICON_CHEVRON } from 'app/images/icons'
import { capitalizeFirstLetter, iconForCard } from '../../../utils/formatters';
import { useNavigation } from 'react-navigation-hooks'
import { useApi } from 'app/api'
import { EVENT_PAYMENT_OFFSETCARDADD } from '../../../constants';

export const PaymentSummary = () => {
  const store = useStore()
  const api = useApi()
  const [card, setCard] = React.useState(Object.values(store.state.payment_methods)[0])
  const { navigate } = useNavigation()


  React.useEffect(() => {
    const cards = async () => {
      const c = await api.getPaymentMethods()
      console.log('payment-summary: 33 - API response', c.data)
      store.receivePaymentMethods(c.data)
    }

    cards()
  }, [])

  React.useEffect(() => {
    const c = Object.values(store.state.payment_methods)[0]
    setCard(c)
  }, [store.state.payment_methods])

  const cardDetails = () => {
    return (card != undefined) ? capitalizeFirstLetter(card.card_brand) + ' •••• ' + card.card_ending : 'Add Payment Card'
  }

  const addPaymentCard = () => {
    navigate('AddPayment')
  }

  return (
    <TouchableHighlight
      disabled={!_.isEmpty(store.state.payment_methods)}
      underlayColor='#e0e0e0'
      onPress={addPaymentCard}>
      <View style={[styles.row, styles.summary]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.paymentTitle}>Payment</Text>
          <Text style={[textStyles.h6, { color: "#705fff", marginBottom: 5 }]}>{cardDetails()}</Text>
          <Text style={styles.paymentSubtext}>
            *Payment used to offset and for operational costs.
          </Text>
          <Text style={styles.paymentSubtext}>
            Minimum payment fee of £0.45 applies.
          </Text>
        </View>
        {card &&
          <Image style={styles.cardIcon} source={iconForCard(card.card_brand)} />
        }
        {!card &&
          <Image style={styles.chevron} source={ICON_CHEVRON} />
        }
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    paddingVertical: 20,
  },
  summary: {
    alignContent: 'space-between',
    alignItems: 'center'
  },
  chevron: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  cardIcon: {
    height: 42,
    width: 42,
    resizeMode: 'contain',
  },
  paymentTitle: {
    ...textStyles.h5,
    marginBottom: 4,
  },
  paymentSubtext: {
    fontSize: 10,
    width: 400
  },
})

export default PaymentSummary 