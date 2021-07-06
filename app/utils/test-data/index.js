import { TransportModeEnum } from "app/utils/emissions"

export const TEST_TRIP = {
  origin: {
    location: 'Canada Water Station',
    coordinates: {
      longitude: -0.049838,
      latitude: 51.497859000000005
    }
  },
  destination: {
    location: 'London Waterloo',
    coordinates: {
      longitude: -0.115271,
      latitude: 51.503578
    }
  },
  mode: TransportModeEnum.Train.Underground
}

export const TEST_REGION = {
  latitude: 51.497859000000005,
  longitude: -0.115271,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
}

export const TEST_PROJECTS = [
  {
    id: 0,
    name: "Biogas Development, India",
    description: "Developing new ways to produce biogas more efficiently",
    avatar: "https://source.unsplash.com/1600x900/?india",
    target_emissions: 50000,
    total_emissions: 5000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
  {
    id: 1,
    name: "Sustainable Cookstoves, Mexico",
    description: "Reduce the amount of carbon in the atmosphere from cooking",
    avatar: "https://source.unsplash.com/1600x900/?pot",
    target_emissions: 300000,
    total_emissions: 60000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
  {
    id: 2,
    name: "Reforestation, Zambia",
    description: "Programs to compensate landowners for reforestation",
    avatar: "https://source.unsplash.com/1600x900/?forest",
    target_emissions: 240000,
    total_emissions: 200000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
  {
    id: 3,
    name: "Biogas Development, China",
    description: "Technology to use crop straw in generating biogas",
    avatar: "https://source.unsplash.com/1600x900/?china",
    target_emissions: 1000000,
    total_emissions: 200000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },

  // Duplicates 
  {
    id: 4,
    name: "Oil Reclamation, USA",
    description: "Restoring oil's performance characteristics to its original new-like condition",
    avatar: "https://source.unsplash.com/1600x900/?oil",
    target_emissions: 50000,
    total_emissions: 5000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
  {
    id: 5,
    name: "Sustainable Cookstoves, Mexico",
    description: "Reduce the amount of carbon in the atmosphere from cooking",
    avatar: "https://source.unsplash.com/1600x900/?kettle",
    target_emissions: 300000,
    total_emissions: 60000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
  {
    id: 6,
    name: "Reforestation, Zambia",
    description: "Programs to compensate landowners for reforestation",
    avatar: "https://source.unsplash.com/1600x900/?tree",
    target_emissions: 240000,
    total_emissions: 200000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
  {
    id: 7,
    name: "Biogas Development, China",
    description: "Technology to use crop straw in generating biogas",
    avatar: "https://source.unsplash.com/1600x900/?chinese",
    target_emissions: 1000000,
    total_emissions: 200000,
    complete: false,
    created_at: "2019-12-03T12:27:09.256Z",
    updated_at: "2019-12-03T12:27:09.256Z"
  },
]


export const TEST_TRIPS = {
  0: {
    id: 0,
    user_id: 0,
    payment_id: 0,
    from_coords: "[-0.115271, 51.503578]",
    from_name: 'London Waterloo',
    to_coords: "[-0.049838, 51.497859000000005]",
    to_name: 'Canada Water Station',
    distance: 5244,
    duration: 13,
    emissions: 200,
    transport_mode: TransportModeEnum.Train.Underground.name,
    created_at: "2019-12-04T15:37:20.897Z",
    updated_at: "2019-12-04T15:37:20.897Z"
  },
  1: {
    id: 1,
    user_id: 0,
    payment_id: null,
    from_coords: "[-1, 52.6667]",
    from_name: 'Leicester',
    to_coords: "[-0.1275, 51.50722]",
    to_name: 'London',
    distance: 182376,
    duration: 107,
    emissions: 41900,
    transport_mode: TransportModeEnum.Car.Petrol.name,
    created_at: "2019-12-03T15:37:20.897Z",
    updated_at: "2019-12-03T15:37:20.897Z"
  },
  2: {
    id: 2,
    user_id: 0,
    payment_id: null,
    from_coords: "[-0.115271, 51.503578]",
    from_name: 'London Waterloo',
    to_coords: "[-0.049838, 51.497859000000005]",
    to_name: 'Canada Water Station',
    distance: 5244,
    duration: 13,
    emissions: 200,
    transport_mode: TransportModeEnum.Train.Underground.name,
    created_at: "2019-12-04T15:37:20.897Z",
    updated_at: "2019-12-04T15:37:20.897Z"
  },
  3: {
    id: 3,
    user_id: 0,
    payment_id: null,
    from_coords: "[-1, 52.6667]",
    from_name: 'Leicester',
    to_coords: "[-0.1275, 51.50722]",
    to_name: 'London',
    distance: 182376,
    duration: 107,
    emissions: 41900,
    transport_mode: TransportModeEnum.Car.Petrol.name,
    created_at: "2019-12-03T15:37:20.897Z",
    updated_at: "2019-12-03T15:37:20.897Z"
  },
  4: {
    id: 4,
    user_id: 0,
    payment_id: null,
    from_coords: "[-0.115271, 51.503578]",
    from_name: 'London Waterloo',
    to_coords: "[-0.049838, 51.497859000000005]",
    to_name: 'Canada Water Station',
    distance: 5244,
    duration: 13,
    emissions: 200,
    transport_mode: TransportModeEnum.Train.Underground.name,
    created_at: "2019-12-04T15:37:20.897Z",
    updated_at: "2019-12-04T15:37:20.897Z"
  },
  5: {
    id: 5,
    user_id: 0,
    payment_id: 0,
    from_coords: "[-1, 52.6667]",
    from_name: 'Leicester',
    to_coords: "[-0.1275, 51.50722]",
    to_name: 'London',
    distance: 182376,
    duration: 107,
    emissions: 41900,
    transport_mode: TransportModeEnum.Car.Petrol.name,
    created_at: "2019-12-03T15:37:20.897Z",
    updated_at: "2019-12-03T15:37:20.897Z"
  }
}


