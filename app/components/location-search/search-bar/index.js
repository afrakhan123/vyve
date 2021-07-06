import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import _ from 'lodash'
import LocationIconButton from 'app/components/location-icon-button'
import { textStyles } from 'app/styles/text'

import {
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native'

var LocationSearchBar = ({
  label,
  query,
  current,
  setQuery,
  onIcon,
  style = {},
  placeholder = 'Search a place or address',
  onBlur = () => { },
  onFocus = () => { },
  editable = true,
}, ref) => {
  const [showLocationIcon, setShowLocationIcon] = useState(false)

  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));

  const onFocusSearchBar = () => {
    setShowLocationIcon(true)
    onFocus()
  }

  const onBlurSearchBar = () => {
    setShowLocationIcon(false)
    onBlur()
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[textStyles.h6, { marginRight: 8, }]}>{label}</Text>
      <TextInput
        ref={inputRef}
        value={query}
        selectTextOnFocus={true}
        numberOfLines={1}
        multiline={false}
        onBlur={onBlurSearchBar}
        editable={editable}
        onFocus={onFocusSearchBar}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor='#c7c7c7'
        style={[styles.input, { marginBottom: 10, }]} />
      {current && showLocationIcon && <LocationIconButton onPressIcon={() => onIcon()} />}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingLeft: 20,
    alignItems: 'center',
    height: 38,
    borderRadius: 6,
    fontSize: 17,
    alignSelf: 'stretch',
    color: 'black',
  },
  input: {
    height: '100%',
    flex: 1,
    paddingRight: 5,
    paddingLeft: 7,
    fontSize: 16,
    alignSelf: 'stretch',
    color: 'black',
    letterSpacing: 0.25,
  },
})

export default forwardRef(LocationSearchBar)