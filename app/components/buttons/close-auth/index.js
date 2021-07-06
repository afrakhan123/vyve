import React, { useContext } from 'react'
import CloseButton from '../close';
import { AuthContext } from 'app/utils/context/auth'

const CloseAuthButton = (props) => {
  const { setUnauthStatus } = useContext(AuthContext)
  return <CloseButton onPress={setUnauthStatus} {...props} />
}

export default CloseAuthButton