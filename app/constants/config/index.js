/**
 * This must be set to false for production releases. 
 */
const IS_DEV = false

const DEVELOPMENT = Object.freeze({
  base_url: 'https://test.oxygen.lcfapis.com/api',
  stripe_token: 'pk_test_3lQ72fzvDHEqL2WqTEU2Z6Bm00o9D78Isu',
  mixpanel_token: '4edc0b591c8a5399cdc12078c2c54f32',
})

const PRODUCTION = Object.freeze({
  base_url: 'https://prod.oxygen.lcfapis.com/api',
  stripe_token: 'pk_live_4KjMCNhkyZ8Pahmsd9Fay6VO00va7lTpCB',
  mixpanel_token: 'd2c22c7156bc4983968bce21e605cd80',
})

export default CONFIG = IS_DEV ? DEVELOPMENT : PRODUCTION