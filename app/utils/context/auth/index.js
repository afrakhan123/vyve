import React, { useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { INITIAL_AUTH } from 'app/constants/'
import { useAuth } from 'app/hooks/useAuth'

// ===========================================================================

/**
 * Create a new account with Cognito
 */

export const createAccountCognito = async (
  username,
  password,
  setError,
  setLoading,
  onCreate,
) => {
  setLoading(true)
  setError(null)
  const result = await Auth.signUp({
    username,
    password,
    attributes: {
      email: username,
    }
  })
    .catch(error => {
      setLoading(false)
      setError(error)
      return
    })

  if (result && result.user) {
    console.log(result)
    setLoading(false)
    await onCreate({
      userId: result.userSub,
      email: result.user.username,
      password: password
    })
  }
}

// ===========================================================================

/**
 * Verify Account
 */

export const verifyAccount = async (
  username,
  code,
  setError,
  onVerified,
) => {
  const data = await Auth.confirmSignUp(username, code)
    .catch(error => {
      setError(error)
    })

  console.log('VERIFIED DATA :>>', data)

  if (data) {
    onVerified()
  }
}



// ===========================================================================

/**
 * Resend Verification
 */

export const resendVerification = async (
  username,
  setError,
  setLoading,
) => {
  setLoading(true)
  await Auth.resendSignUp(username)
    .catch(error => {
      setLoading(false)
      setError(error)
    })
  setLoading(false)
}


// ===========================================================================

/**
 * Sign in
 */

export const signInCognito = async (
  username,
  password,
  setError,
  setLoading = () => { },
  onAuthenticated,
) => {
  setLoading(true)
  setError(null)
  const user = await Auth.signIn({ username, password })
    .catch(error => {
      setLoading(false)
      setError(error)
      return
    })

  if (user) {
    setLoading(false)
    await onAuthenticated({
      userId: user.attributes.sub,
      email: user.username,
      idToken: user.signInUserSession.idToken.jwtToken,
      verified: user.attributes.email_verified,
    })
  }
}

// ===========================================================================

/**
 * Forgot Password
 */

export const forgotPassword = async (
  username,
  setError = () => { },
) => {
  const data = await Auth.forgotPassword(username)
    .catch(error => {
      setError(error)
    })

}

// ===========================================================================

/**
 * Forgot Password Submit
 */

export const submitNewPassword = async (
  username,
  code,
  new_password,
  setError,
  setSuccess
) => {
  console.log('Submitting new password', username, code, new_password)
  await Auth.forgotPasswordSubmit(username, code, new_password)
    .catch(error => {
      setError(error)
      return
    })
  setSuccess(true)
}



// ===========================================================================

/**
 * Sign out
 *
 * Note: A bug with Auth.signOut prevents the user from being signed out
 * A workaround (below) is to get the current user and call signOut() on the user object
 */

export const signOutCognito = async (
  setError,
  onSignOut,
) => {
  Auth.signOut()
    .then(async data => {
      onSignOut(data)
    })
    .catch(error => {
      setError(error)
    })
}

// ===========================================================================

/**
 * Create context with initial auth values
 */
const initial = {
  auth: INITIAL_AUTH,
  loaded: false,
  dispatch: () => { },
}

export const AuthContext = React.createContext(initial)

const { Provider } = AuthContext

const AuthProvider = ({ children }) => {
  const { auth, loaded, dispatch } = useAuth()

  const value = {
    auth,
    loaded,
    dispatch,
  }

  return (
    <Provider
      value={value}>
      {children}
    </Provider>
  )
}


export default AuthProvider
