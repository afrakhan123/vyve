import React, { useState, useEffect } from 'react'
import { textStyles, fontWeights } from 'app/styles/text'
import { MIN_PASSWORD_LENGTH } from 'app/constants'
import rocket from 'app/styles/rocket'

import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'

const PasswordInput = ({
  setPassword,
  autoFocus = false,
  showRequirements = true,
  setPasswordValid = () => { },
  setIsFocused = () => { },
  placeholder = 'Password',
  inputAccessoryViewID = null }) => {

  const [value, setValue] = useState('')
  const [secure, setSecure] = useState(true)
  const [hasUpper, setHasUpper] = useState(false)
  const [hasLower, setHasLower] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [passwordCounter, setPasswordCounter] = useState(0 + '/' + MIN_PASSWORD_LENGTH)
  const [hasMinChars, setHasMinChars] = useState(false)

  const onFocusPassword = () => { setIsFocused(true) }
  const onBlurPassword = () => { setIsFocused(false) }
  const onTogglePassword = () => { setSecure(() => !secure) }

  const hasNum = (string) => { return /\d/.test(string) }
  const hasUppercase = (str) => { return str.toLowerCase() != str }
  const hasLowercase = (str) => { return str.toUpperCase() != str }

  useEffect(() => {
    const upper = hasUppercase(value)
    const lower = hasLowercase(value)
    const number = hasNum(value)
    const min = value.length > MIN_PASSWORD_LENGTH - 1
    const counter = value.length + '/' + MIN_PASSWORD_LENGTH
    setHasUpper(upper)
    setHasLower(lower)
    setHasNumber(number)
    setHasMinChars(min)
    setPasswordCounter(counter)
    setPasswordValid(upper && lower && number && min)
    setPassword(value)
  }, [value])

  return (
    <>
      <View style={styles.passwordContainer}>
        <TextInput
          value={value}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize='none'
          onBlur={onBlurPassword}
          onFocus={onFocusPassword}
          clearButtonMode='never'
          onChangeText={setValue}
          secureTextEntry={secure}
          placeholderTextColor='#c7c7c7'
          placeholder={placeholder}
          style={styles.passwordInput}
          inputAccessoryViewID={inputAccessoryViewID} />
        <TouchableOpacity onPress={onTogglePassword} style={styles.toggleContainer} >
          <Text style={styles.toggleText}>{secure ? 'SHOW' : 'HIDE'}</Text>
        </TouchableOpacity>
      </View>
      {showRequirements &&
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.passwordRequirement, { flex: 1 }]}>
            At least one
          <Text style={hasUpper ? styles.requirementHighlight : {}}> uppercase</Text>
            <Text>, </Text>
            <Text style={hasLower ? styles.requirementHighlight : {}}>lowercase</Text>
            <Text> and </Text>
            <Text style={hasNumber ? styles.requirementHighlight : {}}>number</Text>
          </Text>
          <Text style={[styles.passwordRequirement, hasMinChars ? styles.requirementHighlight : {}]}>{passwordCounter}</Text>
        </View>}
    </>
  )
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    height: 44,
    borderRadius: 8,
    marginHorizontal: width / 24,
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  passwordInput: {
    fontSize: 16,
    flex: 1,
    color: 'black',
    letterSpacing: 0.25,
  },
  toggleText: {
    ...textStyles.caption,
    fontWeight: fontWeights.bold,
    color: '#888899'
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    marginLeft: 15,
  },
  passwordRequirement: {
    ...textStyles.h6,
    marginHorizontal: 8 + width / 24,
    fontSize: 12,
    alignSelf: 'flex-start'
  },
  requirementHighlight: {
    color: rocket.colours.link,
    fontWeight: fontWeights.semibold,
  },
})

export default PasswordInput