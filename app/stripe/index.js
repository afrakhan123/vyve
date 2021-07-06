import stripe from 'tipsi-stripe'
import config from '../constants/config'

const useStripe = () => {
  stripe.setOptions({
    publishableKey: config.stripe_token
  })

  return stripe
}

export default useStripe 