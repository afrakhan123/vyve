import { PRICE_PER_TONNE_GBP, STRIPE_COMMISSION } from "app/constants"
import {
  PETROL_CAR,
  DIESEL_CAR,
  ELECTRIC_CAR,
  HYBRID_CAR,
  NATIONAL_RAIL,
  UNDERGROUND,
  TRAM,
  BUS,
  FERRY,
  MOTORCYCLE,
  WALKING,
  CYCLE,
  DOMESTIC,
  SHORT_ECONOMY,
  SHORT_BUSINESS,
  LONG_ECONOMY,
  LONG_BUSINESS,
  LONG_FIRST,
  API_PETROL_CAR,
  API_DIESEL_CAR,
  API_ELECTRIC_CAR,
  API_HYBRID_CAR,
  API_NATIONAL_RAIL,
  API_UNDERGROUND,
  API_TRAM,
  API_BUS,
  API_DOMESTIC,
  API_SHORT_ECONOMY,
  API_SHORT_BUSINESS,
  API_LONG_ECONOMY,
  API_LONG_BUSINESS,
  API_LONG_FIRST,
  API_FERRY,
  API_MOTORCYCLE,
  API_WALKING,
  API_CYCLE
} from "app/constants"


import { toRadians } from "../conversions"


/**
 * - Using 2019 Emission Factor data:  
 * (1) https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/847122/Conversion-Factors-2019-Full-set-for-advanced-users.xls
 */




const DOMESTIC_BAND_START = 0
const SHORT_HAUL_BAND_START = 401000 // 401km in m
const LONG_HAUL_BAND_START = 3700000 // 3700km in m

const EmissionsUnitEnum = Object.freeze({
  kg_CO2e_km: 'Kg CO2 Equivalent per km',
  kg_CO2e_pkm: 'Kg CO2 Equivalent per passenger per km',
})

export const TransportModeEnum = Object.freeze({

  /**
   * UK Average values used for cars 
   */
  Car: {
    Petrol: {
      name: PETROL_CAR,
      api_name: API_PETROL_CAR,
      emissions_factor: 0.22995,
      unit: EmissionsUnitEnum.kg_CO2e_km,
      mapsMode: 'DRIVING'
    },
    Diesel: {
      name: DIESEL_CAR,
      api_name: API_DIESEL_CAR,
      emissions_factor: 0.21471,
      unit: EmissionsUnitEnum.kg_CO2e_km,
      mapsMode: 'DRIVING'
    },
    Hybrid: {
      name: HYBRID_CAR,
      api_name: API_HYBRID_CAR,
      emissions_factor: 0.09282,
      unit: EmissionsUnitEnum.kg_CO2e_km,
      mapsMode: 'DRIVING'
    },
    Electric: {
      name: ELECTRIC_CAR,
      api_name: API_ELECTRIC_CAR,
      emissions_factor: 0.0,
      unit: EmissionsUnitEnum.kg_CO2e_km,
      mapsMode: 'DRIVING'
    },
  },
  Train: {
    NationalRail: {
      name: NATIONAL_RAIL,
      api_name: API_NATIONAL_RAIL,
      emissions_factor: 0.04905,
      unit: EmissionsUnitEnum.kg_CO2e_pkm,
      mapsMode: 'TRANSIT'
    },
    Underground: {
      name: UNDERGROUND,
      api_name: API_UNDERGROUND,
      emissions_factor: 0.03514,
      unit: EmissionsUnitEnum.kg_CO2e_pkm,
      mapsMode: 'TRANSIT'
    },
    Tram: {
      name: TRAM,
      api_name: API_TRAM,
      emissions_factor: 0.03997,
      unit: EmissionsUnitEnum.kg_CO2e_pkm,
      mapsMode: 'TRANSIT'
    },
  },
  Bus: {
    name: BUS,
    api_name: API_BUS,
    emissions_factor: 0.12971,
    unit: EmissionsUnitEnum.kg_CO2e_pkm,
    mapsMode: 'TRANSIT'
  },
  Flight: { // ⚠️ Note: Business travel factors - Data for passenger travel doesn't include Radiative Forcing (additional environmental impact) 
    Domestic: {
      name: DOMESTIC,
      api_name: API_DOMESTIC,
      emissions_factor: 0.15573,
      unit: EmissionsUnitEnum.kg_CO2e_pkm,
    },
    Short: { // Uses data that assumes to/from is UK (only data available in DEFRA conversion factors 2019)
      Economy: {
        name: SHORT_ECONOMY,
        api_name: API_SHORT_ECONOMY,
        emissions_factor: 0.15573, // Uses average for short haul across all classes (since average is weighted towards economy and we don't have to distinguish between economy and economy+) 
        unit: EmissionsUnitEnum.kg_CO2e_pkm,
      },
      Business: {
        name: SHORT_BUSINESS,
        api_name: API_SHORT_BUSINESS,
        emissions_factor: 0.2336,
        unit: EmissionsUnitEnum.kg_CO2e_pkm,
      }
    },
    Long: { // Uses international (to/from does not have to be UK airport) - Can improve this later if needed 
      Economy: {
        name: LONG_ECONOMY,
        api_name: API_LONG_ECONOMY,
        emissions_factor: 0.14981, // Uses average for long haul across all classes (since average is weighted towards economy and we don't have to distinguish between economy and economy+) 
        unit: EmissionsUnitEnum.kg_CO2e_pkm,
      },
      Business: {
        name: LONG_BUSINESS,
        api_name: API_LONG_BUSINESS,
        emissions_factor: 0.43446,
        unit: EmissionsUnitEnum.kg_CO2e_pkm,
      },
      First: {
        name: LONG_FIRST,
        api_name: API_LONG_FIRST,
        emissions_factor: 0.59925,
        unit: EmissionsUnitEnum.kg_CO2e_pkm,
      }
    },

  },
  Ferry: {
    name: FERRY,
    api_name: API_FERRY,
    emissions_factor: 0.13469,
    unit: EmissionsUnitEnum.kg_CO2e_pkm,
    // mapsMode: 'TRANSIT'
  },
  Motorcycle: {
    name: MOTORCYCLE,
    api_name: API_MOTORCYCLE,
    emissions_factor: 0.14397,
    unit: EmissionsUnitEnum.kg_CO2e_pkm,
    mapsMode: 'DRIVING'
  },
  Walking: {
    name: WALKING,
    api_name: API_WALKING,
    emissions_factor: 0,
    unit: EmissionsUnitEnum.kg_CO2e_pkm,
    mapsMode: 'WALKING'
  },
  Cycle: {
    name: CYCLE,
    api_name: API_CYCLE,
    emissions_factor: 0,
    unit: EmissionsUnitEnum.kg_CO2e_pkm,
    mapsMode: 'BICYCLING'
  },
})

// const modes = {
//   [PETROL_CAR]: TransportModeEnum.Car.Petrol,
//   [DIESEL_CAR]: TransportModeEnum.Car.Diesel,
//   [ELECTRIC_CAR]: TransportModeEnum.Car.Electric,
//   [NATIONAL_RAIL]: TransportModeEnum.Train.NationalRail,
//   [UNDERGROUND]: TransportModeEnum.Train.Underground,
//   [TRAM]: TransportModeEnum.Train.Tram,
//   [BUS]: TransportModeEnum.Bus,
//   [DOMESTIC]: TransportModeEnum.Flight.Domestic,
//   [SHORT_ECONOMY]: TransportModeEnum.Flight.Short.Economy,
//   [SHORT_BUSINESS]: TransportModeEnum.Flight.Short.Business,
//   [LONG_ECONOMY]: TransportModeEnum.Flight.Long.Economy,
//   [LONG_BUSINESS]: TransportModeEnum.Flight.Long.Business,
//   [LONG_FIRST]: TransportModeEnum.Flight.Long.First,

//   [API_PETROL_CAR]: TransportModeEnum.Car.Petrol,
//   [API_DIESEL_CAR]: TransportModeEnum.Car.Diesel,
//   [API_ELECTRIC_CAR]: TransportModeEnum.Car.Electric,
//   [API_NATIONAL_RAIL]: TransportModeEnum.Train.NationalRail,
//   [API_UNDERGROUND]: TransportModeEnum.Train.Underground,
//   [API_TRAM]: TransportModeEnum.Train.Tram,
//   [API_BUS]: TransportModeEnum.Bus,
//   [API_DOMESTIC]: TransportModeEnum.Flight.Domestic,
//   [API_SHORT_ECONOMY]: TransportModeEnum.Flight.Short.Economy,
//   [API_SHORT_BUSINESS]: TransportModeEnum.Flight.Short.Business,
//   [API_LONG_ECONOMY]: TransportModeEnum.Flight.Long.Economy,
//   [API_LONG_BUSINESS]: TransportModeEnum.Flight.Long.Business,
//   [API_LONG_FIRST]: TransportModeEnum.Flight.Long.First,
// }

const modes = {}
modes[PETROL_CAR] = TransportModeEnum.Car.Petrol
modes[DIESEL_CAR] = TransportModeEnum.Car.Diesel
modes[ELECTRIC_CAR] = TransportModeEnum.Car.Electric
modes[ELECTRIC_CAR] = TransportModeEnum.Car.Hybrid
modes[NATIONAL_RAIL] = TransportModeEnum.Train.NationalRail
modes[UNDERGROUND] = TransportModeEnum.Train.Underground
modes[TRAM] = TransportModeEnum.Train.Tram
modes[BUS] = TransportModeEnum.Bus
modes[WALKING] = TransportModeEnum.Walking
modes[MOTORCYCLE] = TransportModeEnum.Motorcycle
modes[FERRY] = TransportModeEnum.Ferry
modes[CYCLE] = TransportModeEnum.Cycle
modes[DOMESTIC] = TransportModeEnum.Flight.Domestic
modes[SHORT_ECONOMY] = TransportModeEnum.Flight.Short.Economy
modes[SHORT_BUSINESS] = TransportModeEnum.Flight.Short.Business
modes[LONG_ECONOMY] = TransportModeEnum.Flight.Long.Economy
modes[LONG_BUSINESS] = TransportModeEnum.Flight.Long.Business
modes[LONG_FIRST] = TransportModeEnum.Flight.Long.First
modes[API_PETROL_CAR] = TransportModeEnum.Car.Petrol
modes[API_DIESEL_CAR] = TransportModeEnum.Car.Diesel
modes[API_ELECTRIC_CAR] = TransportModeEnum.Car.Electric
modes[API_HYBRID_CAR] = TransportModeEnum.Car.Hybrid
modes[API_NATIONAL_RAIL] = TransportModeEnum.Train.NationalRail
modes[API_UNDERGROUND] = TransportModeEnum.Train.Underground
modes[API_TRAM] = TransportModeEnum.Train.Tram
modes[API_BUS] = TransportModeEnum.Bus
modes[API_WALKING] = TransportModeEnum.Walking
modes[API_MOTORCYCLE] = TransportModeEnum.Motorcycle
modes[API_FERRY] = TransportModeEnum.Ferry
modes[API_CYCLE] = TransportModeEnum.Cycle
modes[API_DOMESTIC] = TransportModeEnum.Flight.Domestic
modes[API_SHORT_ECONOMY] = TransportModeEnum.Flight.Short.Economy
modes[API_SHORT_BUSINESS] = TransportModeEnum.Flight.Short.Business
modes[API_LONG_ECONOMY] = TransportModeEnum.Flight.Long.Economy
modes[API_LONG_BUSINESS] = TransportModeEnum.Flight.Long.Business
modes[API_LONG_FIRST] = TransportModeEnum.Flight.Long.First


/**
 *  - Calculations based on formulas found in: 
 * (1) https://www.bptargetneutral.com/uk/calculate/bundles/offset/pdf/uk/Methodology_Statement_Online_Travel_CalculatorsMay2018.pdf
 * 
 */

const calculate = (distance_in_metres, emissions_factor, uplift = 1) => {
  if (distance_in_metres < 0) throw 'Cannot calculate negative distances'
  if (distance_in_metres == 0) return [0, 0]

  const co2e_in_kg = distance_in_metres / 1000 * uplift * emissions_factor

  const price_per_kg = PRICE_PER_TONNE_GBP / 1000
  const offset_cost = co2e_in_kg * price_per_kg
  const stripe_commission = (1 + STRIPE_COMMISSION.PERCENTAGE / 100)
  const cost_with_commission = Math.floor(((offset_cost * stripe_commission) + STRIPE_COMMISSION.BASE_IN_PENCE / 100) * 100) / 100
  const co2e = Math.floor(co2e_in_kg * 10) / 10

  // TODO: REMOVE THIS HACK ⚠️⛔
  let hackCost = 0
  if (emissions_factor > 0) {
    hackCost = Math.max(cost_with_commission, .45)
  }
  return [co2e, hackCost]
}

/** 
 * - Uplift factor for UK users is defaulted to 20% as per reference document 
 */
const emissionsForTrainJourney = (train_type) => (distance_in_metres, uplift_factor_in_percent = 20, is_europe = false) => {
  const uplift = is_europe ? 1 : 1 + (uplift_factor_in_percent / 100)
  return calculate(distance_in_metres, train_type.emissions_factor, uplift)
}

const emissionsForBusJourney = () => (distance_in_metres) => {
  return calculate(distance_in_metres, TransportModeEnum.Bus.emissions_factor)
}

const emissionsForCarJourney = (car_type) => (distance_in_metres) => {
  return calculate(distance_in_metres, car_type.emissions_factor)
}

const emissionsForWalkingJourney = () => (distance_in_metres) => {
  return calculate(distance_in_metres, TransportModeEnum.Walking.emissions_factor)
}

const emissionsForMotorcycleJourney = () => (distance_in_metres) => {


  return calculate(distance_in_metres, TransportModeEnum.Motorcycle.emissions_factor)
}

const emissionsForFerryJourney = () => (distance_in_metres) => {
  return calculate(distance_in_metres, TransportModeEnum.Ferry.emissions_factor)
}
const emissionsForCycleJourney = () => (distance_in_metres) => {
  return calculate(distance_in_metres, TransportModeEnum.Cycle.emissions_factor)
}
const emissionsForFlightJourney = (flight_type) => (distance_in_metres) => {
  return calculate(distance_in_metres, flight_type.emissions_factor)
}

export const transportModeTypeFromName = (name) => {
  const mode = modes[name]
  if (!mode) {
    throw 'Unable to get mode for name: ' + name + ' ' + mode
  }

  return mode
}

export const isFlight = (trip) => {
  const mode = transportModeTypeFromName(trip.transport_mode)
  switch (mode) {
    case TransportModeEnum.Flight.Domestic:
    case TransportModeEnum.Flight.Short.Economy:
    case TransportModeEnum.Flight.Short.Business:
    case TransportModeEnum.Flight.Long.Economy:
    case TransportModeEnum.Flight.Long.Business:
    case TransportModeEnum.Flight.Long.First:
      return true
    default:
      return false
  }
}

export const useEmissionsCalculator = (type) => {
  const t = (typeof type === 'string' || type instanceof String) ? transportModeTypeFromName(type) : type

  switch (t) {
    case TransportModeEnum.Car.Petrol:
    case TransportModeEnum.Car.Diesel:
    case TransportModeEnum.Car.Electric:
    case TransportModeEnum.Car.Hybrid:
      return emissionsForCarJourney(t)
    case TransportModeEnum.Train.NationalRail:
    case TransportModeEnum.Train.Underground:
    case TransportModeEnum.Train.Tram:
      return emissionsForTrainJourney(t)
    case TransportModeEnum.Bus:
      return emissionsForBusJourney()
    case TransportModeEnum.Walking:
      return emissionsForWalkingJourney()
    case TransportModeEnum.Motorcycle:
      return emissionsForMotorcycleJourney(t)
    case TransportModeEnum.Ferry:
      return emissionsForFerryJourney()
    case TransportModeEnum.Cycle:
      return emissionsForCycleJourney()
    case TransportModeEnum.Flight.Domestic:
    case TransportModeEnum.Flight.Short.Economy:
    case TransportModeEnum.Flight.Short.Business:
    case TransportModeEnum.Flight.Long.Economy:
    case TransportModeEnum.Flight.Long.Business:
    case TransportModeEnum.Flight.Long.First:
      return emissionsForFlightJourney(t)
    default:
      throw 'Unrecognised transport mode: ' + t.name
  }
}

export const FlightClassEnum = Object.freeze({
  Economy: 'Economy',
  Business: 'Business',
  First: 'First',
})

export const flightMode = (distance_in_metres, flightClass) => {
  // Find a better way to do this lookup 
  if (distance_in_metres < DOMESTIC_BAND_START) throw 'Distance invalid'
  if (distance_in_metres < SHORT_HAUL_BAND_START) return TransportModeEnum.Flight.Domestic
  if (distance_in_metres < LONG_HAUL_BAND_START && distance_in_metres >= SHORT_HAUL_BAND_START) {
    switch (flightClass) {
      case FlightClassEnum.Economy:
        return TransportModeEnum.Flight.Short.Economy
      case FlightClassEnum.Business:
        return TransportModeEnum.Flight.Short.Business
      default:
        throw 'Flight Class ' + flightClass + ' Not supported for short haul flights'
    }
  }

  if (distance_in_metres >= LONG_HAUL_BAND_START) {
    switch (flightClass) {
      case FlightClassEnum.Economy:
        return TransportModeEnum.Flight.Long.Economy
      case FlightClassEnum.Business:
        return TransportModeEnum.Flight.Long.Business
      case FlightClassEnum.First:
        return TransportModeEnum.Long.First
      default:
        throw 'Flight Class ' + flightClass + ' Not supported for long haul flights'
    }
  }
}


export const haversineDistance = (origin, destination) => {
  const lat1 = origin.latitude
  const lat2 = destination.latitude
  const lon1 = origin.longitude
  const lon2 = destination.longitude

  var R = 6371e3
  var φ1 = toRadians(lat1)
  var φ2 = toRadians(lat2)
  var Δφ = toRadians(lat2 - lat1)
  var Δλ = toRadians(lon2 - lon1)

  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;
  return Math.ceil(d)
}


export const airportDistance = (origin, destination) => {
  return haversineDistance(origin, destination)
}
