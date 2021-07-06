import React from 'react'

import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  InputAccessoryView,
  TouchableOpacity,
  Switch,
  Dimensions
} from 'react-native'

import LoadingFooter from 'app/components/loading/footer'
import FooterButton from 'app/components/buttons/footer'
import Title from 'app/components/text/screen-title'
import { textStyles } from 'app/styles/text'

import useStripe from 'app/stripe'
import { useApi } from 'app/api'
import { useStore } from 'app/store'

import _ from 'lodash'
import SuccessView from 'app/components/success'

import { TextInputMask } from 'react-native-masked-text'
import { useNavigation } from 'react-navigation-hooks';
import { EVENT_PAYMENT_ADDCARD } from '../../../constants';

import Mixpanel from 'react-native-mixpanel'

let width = Dimensions.get('window').width

const AddPaymentScreen = () => {

  const [isLoading, setIsLoading] = React.useState(false)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [success, setSuccess] = React.useState(false)
  const [tokenErrorMessage, setTokenErrorMessage] = React.useState('')
  const [cardNumber, setCardNumber] = React.useState('')
  const [expiryMonth, setExpiryMonth] = React.useState('')
  const [expiryYear, setExpiryYear] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [defaultCard, setDefaultCard] = React.useState(true)

  const cardInputRef = React.useRef(null)
  const monthInputRef = React.useRef(null)
  const yearInputRef = React.useRef(null)
  const cvvInputRef = React.useRef(null)

  const stripe = useStripe()
  const api = useApi()
  const store = useStore()
  const { goBack } = useNavigation()


  React.useEffect(() => {
    Mixpanel.track('Open Add Card Screen')
  }, [])

  React.useEffect(() => {
    setButtonDisabled(
      cardNumber.length != cardInputRef.current.props.maxLength
      || expiryMonth.length != monthInputRef.current.props.maxLength
      || expiryYear.length != yearInputRef.current.props.maxLength
      || cvv.length != cvvInputRef.current.props.maxLength
    )
  }, [cardNumber, expiryMonth, expiryYear, cvv])

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        goBack()
      }, 500)
    }
  }, [success])

  const onPressAddCard = async () => {
    setIsLoading(true)
    setTokenErrorMessage('')
    const token = await stripe.createTokenWithCard({
      number: cardNumber,
      expMonth: parseInt(expiryMonth, 10),
      expYear: parseInt(expiryYear, 10),
      cvc: cvv,
    }).catch(error => {
      setTokenErrorMessage(error.message)
      setIsLoading(false)
    })

    if (token) {
      const method = await api.addPaymentMethod(token.tokenId)

      console.log('add-card: 💳 💳 💳 API Payment Method response', method)

      Mixpanel.trackWithProperties('Added Card', { card: method.data.card_ending })

      store.addPaymentMethod(method.data)
      if (defaultCard) {
        Mixpanel.trackWithProperties('Saved Card', { card: method.data.card_ending })
        // TODO: Add user preferences
        // const updatedUser = await api.updateUser(store.state.user.id, { default_payment_method_id: method.data.id })
        // store.updateUser(updatedUser.data)
      }

      setIsLoading(_.isEmpty(method)) // Do a better check 
      setSuccess(!_.isEmpty(method))
    }

  }


  const onSetCardnumber = (text) => {
    setCardNumber(text)
    if (text.length == cardInputRef.current.props.maxLength) {
      monthInputRef.current.focus()
    }
  }

  const onSetMonth = (text) => {
    setExpiryMonth(text)
    if (text.length == monthInputRef.current.props.maxLength) {
      yearInputRef.current.focus()
    }
  }

  const onSetYear = (text) => {
    setExpiryYear(text)
    if (text.length == yearInputRef.current.props.maxLength) {
      cvvInputRef.current.focus()
    }
  }

  const validateMonth = () => {
    const parsed = parseInt(expiryMonth, 10)
    if (expiryMonth != '' && (parsed < 1 || parsed > 12)) {
      setExpiryMonth('')
      return monthInputRef.current.focus()
    }

    if (expiryMonth.length == 1) {
      setExpiryMonth(() => ("0" + expiryMonth).slice(-2))
    }
  }

  const validateYear = () => {
    if (expiryYear != '' && expiryYear < new Date().getFullYear().toString().substr(-2)) {
      setExpiryYear('')
      return yearInputRef.current.focus()

    }
  }

  const renderFooter = () => {
    return success ? <SuccessView title='Added Card' /> : isLoading ? <LoadingFooter /> : <FooterButton disabled={buttonDisabled} onPress={onPressAddCard} title='Add Card' />
  }

  return (

    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
          <Title title='Add Card' />
          <View style={styles.inner} >
            <View style={styles.inputContainer}>
              {/* <TouchableOpacity style={styles.scan}>
                <Text style={textStyles.headerButtonTitle}>Scan Card</Text>
              </TouchableOpacity>
              <Text style={[textStyles.h5, { marginBottom: 20 }]}>Or</Text> */}

              <TextInputMask
                type={'credit-card'}
                style={styles.input}
                maxLength={19}
                value={cardNumber}
                placeholderTextColor='#C7C7C7'
                ref={cardInputRef}
                clearButtonMode='while-editing'
                placeholder="Credit Card Number"
                onChangeText={onSetCardnumber}
                inputAccessoryViewID='add-card'
              />

              <View style={styles.expiryContainer}>
                <TextInput
                  value={expiryMonth}
                  autoCorrect={false}
                  clearButtonMode='while-editing'
                  keyboardType='number-pad'
                  onChangeText={onSetMonth}
                  placeholder="Exp Month (MM)"
                  maxLength={2}
                  onBlur={validateMonth}
                  ref={monthInputRef}
                  placeholderTextColor='#C7C7C7'
                  style={[styles.input, { flex: 1, marginRight: 5, }]}
                  inputAccessoryViewID='add-card' />

                <TextInput
                  value={expiryYear}
                  autoCorrect={false}
                  clearButtonMode='while-editing'
                  keyboardType='number-pad'
                  onChangeText={onSetYear}
                  placeholder="Exp Year (YY)"
                  maxLength={2}
                  placeholderTextColor='#C7C7C7'
                  onBlur={validateYear}
                  ref={yearInputRef}
                  style={[styles.input, { flex: 1, marginLeft: 5, }]}
                  inputAccessoryViewID='add-card' />
              </View>

              <TextInput
                value={cvv}
                autoCorrect={false}
                clearButtonMode='while-editing'
                keyboardType='number-pad'
                onChangeText={setCvv}
                placeholder="CVV"
                maxLength={3}
                ref={cvvInputRef}
                placeholderTextColor='#C7C7C7'
                style={styles.input}
                inputAccessoryViewID='add-card' />
              <View style={styles.defaultContainer}>
                <Text adjustsFontSizeToFit={true} style={[textStyles.headerButtonTitle, { maxWidth: width * 0.75 }]}>Use this card for future payments</Text>
                <Switch style={{ marginLeft: 5 }} value={defaultCard} onValueChange={setDefaultCard} />
              </View>
            </View>
            {/*
             * Needed to make keyboard behave properly. Fills space at the bottom of the screen when we use flex-end for the container
             */}
            <View style={{ flex: 1, marginBottom: Platform.OS === 'ios' ? 50 : -100 }} />
          </View>

          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID="add-card">
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={textStyles.h6}>
                  {tokenErrorMessage ? <Text style={{ color: "red" }}>{tokenErrorMessage}</Text> : "We currently accept Visa or Mastercard"}
                </Text>
              </View>

              {renderFooter()}
            </InputAccessoryView>
          )}

        </KeyboardAvoidingView>
        <View><Text style={styles.errorMessage}>{tokenErrorMessage}</Text></View>
      </SafeAreaView >

      {renderFooter()}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  inner: {
    paddingTop: 22,
    justifyContent: 'flex-end',
    flex: 1,
    marginHorizontal: 22,
  },
  titleContainer: {
    width: 172,
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    height: 46,
    borderRadius: 8,
    fontSize: 17,
    marginBottom: 12,
    alignSelf: 'stretch',
    color: 'black'
  },
  inputContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scan: {
    justifyContent: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    paddingHorizontal: 15,
    height: 44,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  scanTitle: {
    fontSize: 16,
    color: '#333'
  },
  expiryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  defaultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  errorMessage: {
    textAlign: "center", color: "red", margin: 5
  }
})

export default AddPaymentScreen