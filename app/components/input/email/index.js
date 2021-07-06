import React, { useState, useEffect } from 'react'

import {
  TextInput,
  StyleSheet,
  Dimensions
}
  from 'react-native'

const EmailInput = ({
  val = '',
  setEmail,
  autoFocus = false,
  inputAccessoryViewID = null }) => {

  const [value, setValue] = useState(val)

  useEffect(() => { setEmail(value) }, [value])

  return (
    <TextInput
      value={value}
      autoFocus={autoFocus}
      autoCorrect={false}
      autoCapitalize='none'
      clearButtonMode='while-editing'
      onChangeText={setValue}
      keyboardType='email-address'
      placeholder="Email Address"
      placeholderTextColor='#c7c7c7'
      style={styles.input}
      inputAccessoryViewID={inputAccessoryViewID} />
  )
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    height: 44,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    alignSelf: 'stretch',
    color: 'black',
    marginHorizontal: width / 24,
    letterSpacing: 0.25,
  },
})

export default EmailInput