/**
 * Auth
 */
export const DEFAULT_USER_AUTH = Object.freeze({
  userId: '',
  idToken: '',
  authenticated: false,
})

export const MIN_PASSWORD_LENGTH = 8

export const INITIAL_AUTH = {
  userId: '',
  email: '',
  idToken: '',
  authenticated: false,
  verified: false,
  requiresReset: false,
}

/**
 * AsyncStorage Keys 
 */
export const USER_STORAGE_KEY = '@user'
export const AUTH_STORAGE_KEY = '@auth'
export const PAYMENTS_STORAGE_KEY = '@payments'
export const TRIPS_STORAGE_KEY = '@trips'
export const ONBOARDING_STORAGE_KEY = '@onboarding'


export const SUPPORT_EMAIL = 'support@vyvenow.com'

/**
 * Payment Infomation 
 */
export const PRICE_PER_TONNE_GBP = 10
export const STRIPE_COMMISSION = {
  BASE_IN_PENCE: 20,
  PERCENTAGE: 1.4,
}
export const USER_COST_PER_TONNE = (PRICE_PER_TONNE_GBP * (1 + STRIPE_COMMISSION.PERCENTAGE / 100)) + (STRIPE_COMMISSION.BASE_IN_PENCE / 100)

/**
 * MapBox 
 */
export const MAPBOX_TOKEN = 'pk.eyJ1IjoibGNmbGF1bmNocGFkIiwiYSI6ImNrM2ZyYXBqaDAwMXczbW1zYzg3NnJ6bG0ifQ.3y3kUq-yhQNOigDwUNevyA'


/**
 * Google APIs 
 */
export const GOOGLE_API_KEY = 'AIzaSyCzGVp8tuZ-WLmszWbbZG4oAvWLKMiGO9M'

/**
 * Social Providers   
 */
export const COGNITO_SOCIAL_PROVIDER = {
  FACEBOOK: 'Facebook',
  GOOGLE: 'Google',
  APPLE: 'SignInWithApple',
}

/**
 * oAuth payload events   
 */
export const HUB_PAYLOAD_EVENT = {
  PARSING: 'parsingCallbackUrl',
  FAILED: 'signIn_failure',
  SIGNIN: 'signIn',
}




/**
 * Transport Mode Names  
 */
export const PETROL_CAR = 'Petrol Car'
export const DIESEL_CAR = 'Diesel Car'
export const ELECTRIC_CAR = 'Electric Car'
export const HYBRID_CAR = 'Hybrid Car'
export const NATIONAL_RAIL = 'National Rail'
export const UNDERGROUND = 'Underground'
export const TRAM = 'Tram'
export const BUS = 'Bus'
export const DOMESTIC = 'Flight'
export const SHORT_ECONOMY = 'Flight'
export const SHORT_BUSINESS = 'Flight'
export const LONG_ECONOMY = 'Flight'
export const LONG_BUSINESS = 'Flight'
export const LONG_FIRST = 'Flight'
export const FERRY = 'Ferry'
export const MOTORCYCLE = 'Motorcycle'
export const WALKING = 'Walking'
export const CYCLE = 'Cycling'

export const API_PETROL_CAR = 'petrol_car'
export const API_DIESEL_CAR = 'diesel_car'
export const API_ELECTRIC_CAR = 'electric_car'
export const API_HYBRID_CAR = 'hybrid_car'
export const API_NATIONAL_RAIL = 'national_rail'
export const API_UNDERGROUND = 'underground'
export const API_TRAM = 'tram'
export const API_BUS = 'bus'
export const API_DOMESTIC = 'flight_domestic'
export const API_SHORT_ECONOMY = 'flight_short_economy'
export const API_SHORT_BUSINESS = 'flight_short_business'
export const API_LONG_ECONOMY = 'flight_long_economy'
export const API_LONG_BUSINESS = 'flight_long_business'
export const API_LONG_FIRST = 'flight_long_first'
export const API_FERRY = 'ferry'
export const API_MOTORCYCLE = 'motorcycle'
export const API_WALKING = 'walking'
export const API_CYCLE = 'cycle'
/**
 * Analytics 
 */
// Impact 
export const EVENT_IMPACT_SCREEN = 'impact_screen'
export const EVENT_IMPACT_ADDTRIP = 'impact_addtrip'
export const EVENT_IMPACT_TRIPOFFSET = 'impact_tripoffset'

// Payment 
export const EVENT_PAYMENT_OFFSETCARDADD = 'payment_offsetcardadd'
export const EVENT_PAYMENT_PAYNOW = 'payment_paynow'
export const EVENT_PAYMENT_ADDCARD = 'payment_addcard'
export const EVENT_PAYMENT_SCANCARD = 'payment_scancard'
export const EVENT_PAYMENT_ERROR = 'payment_error'
export const EVENT_PAYMENT_CONFIRMATION = 'payment_confirmation'
export const EVENT_PAYMENT_FINISH = 'payment_finish'
export const EVENT_PAYMENT_SUCCESS = 'payment_success'

//Offset Projects 
export const EVENT_PROJECTS_LIST = 'projects_list'
export const EVENT_PROJECTS_SELECTED = 'projects_selected'
export const EVENT_PROJECTS_DEFAULTPROJECT = 'projects_defaultproject'

//Add a trip 
export const EVENT_TRIP_START = 'trip_start'
export const EVENT_TRIP_STARTLOCATION = 'trip_startlocation'
export const EVENT_TRIP_STARTLOCATIONABANDONED = 'trip_startlocationabandoned'
export const EVENT_TRIP_END = 'trip_end'
export const EVENT_TRIP_ENDLOCATION = 'trip_endlocation '
export const EVENT_TRIP_STARTNEXT = 'trip_startnext'
export const EVENT_TRIP_ENDNEXT = 'trip_endnext'
export const EVENT_TRIP_ENDLOCATIONABANDONED = 'trip_endlocationabandoned'
export const EVENT_TRIP_METHOD = 'trip_method'
export const EVENT_TRIP_SELECT_METHOD = 'trip_select_method'

// export const EVENT_TRIP_METHODCAR = 'trip_methodcar'
// export const EVENT_TRIP_METHODWALK = 'trip_methodwalk'
// export const EVENT_TRIP_METHODCYCLE = 'trip_methodcycle'
// export const EVENT_TRIP_METHODRAIL = 'trip_methodrail'

export const EVENT_TRIP_CARFUELTYPE = 'trip_carfueltype'

export const EVENT_TRIP_SELECT_CARTYPE = 'trip_select_cartype'
// export const EVENT_TRIP_CARPETROL = 'trip_carpetrol'
// export const EVENT_TRIP_CARDIESEL = 'trip_cardiesel'
// export const EVENT_TRIP_CAREV = 'trip_carev'

export const EVENT_TRIP_IMPACT = 'trip_impact'
export const EVENT_TRIP_CALCULATEDCARBON = 'trip_calculatedcarbon'
export const EVENT_TRIP_OFFSETNOW = 'trip_offsetnow'
export const EVENT_TRIP_IMPACTCLOSE = 'trip_impactclose'
export const EVENT_TRIP_OFFSETSUMMARY = 'trip_offsetsummary'
export const EVENT_TRIP_OFFSETCANCEL = 'trip_offsetcancel'
export const EVENT_TRIP_OFFSETPROJECT = 'trip_offsetproject'

// Returning User Login 
export const EVENT_RETURNINGUSER = 'returningUser'

//Onboarding 
export const EVENT_ONBOARDING_NEWCUSTOMERFLOW = 'onboarding_newCustomerFlow'
export const EVENT_ONBOARDING_NEWCUSTOMEREMAIL = 'onboarding_newCustomeremail'
export const EVENT_ONBOARDING_ADDPASSWORD = 'onboarding_addpassword'
export const EVENT_ONBOARDING_ABANDONED = 'onboarding_abandoned'
export const EVENT_ONBOARDING_ERROR = 'onboarding_error'
export const EVENT_ONBOARDING_ADDTRIP = 'onboarding_addtrip' 