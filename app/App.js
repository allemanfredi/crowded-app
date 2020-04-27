import * as React from 'react'
import i18n from './trans/i18n'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import Search from './containers/Search'
import Report from './containers/Report'
import { storePosition } from './api'
import { getIdentifier, getKey } from './utils/first-time'
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import { withNamespaces } from 'react-i18next'
import * as Crypto from 'expo-crypto'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import * as Permissions from 'expo-permissions'
import { getDistance } from 'geolib'
import { Asset } from 'expo-asset'
import { AppLoading } from 'expo'

const THREESHOLD_METERS = 25
const THREESHOLD_INTERVAL = 10000

let currentLatitude = null
let currentLongitude = null

TaskManager.defineTask('location-tracking', async ({ data, error }) => {
  if (error) {
    console.log('location-tracking task ERROR:', error)
    return
  }
  if (data) {
    const { locations } = data
    const latitude = locations[0].coords.latitude
    const longitude = locations[0].coords.longitude

    if (currentLatitude && currentLongitude) {
      const distance = getDistance(
        {
          latitude,
          longitude,
        },
        {
          latitude: currentLatitude,
          longitude: currentLongitude,
        }
      )

      if (distance < THREESHOLD_METERS) {
        return
      }
    }

    currentLatitude = latitude
    currentLongitude = longitude

    const key = await getKey()
    const uuid = await getIdentifier()

    const position = {
      latitude,
      longitude,
      uuid,
      hash: await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        key
      ),
    }

    storePosition(position)
      .then(() => {
        return
      })
      .catch(() => {
        return
      })

    console.log(
      `${new Date(Date.now()).toLocaleString()}: ${latitude}, ${longitude}`
    )
  }
})

const Tab = createBottomTabNavigator()

class WrappedApp extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      uuid: null,
      latitude: null,
      longitude: null,
      permission: null,
      isReady: false,
    }
  }

  async componentDidMount() {
    const { t, i18n } = this.props

    const uuid = await getIdentifier()
    this.setState({ uuid })

    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status !== 'granted') {
      showMessage({
        message: t('global:deniedLocation', { lng: i18n.language }),
        description: t('global:deniedLocationDesc', { lng: i18n.language }),
        type: 'danger',
      })

      return
    }

    this.monitorPosition()

    this.setState({ permission: status })

    if (status === 'granted') {
      Location.getCurrentPositionAsync({ enableHighAccuracy: true })
    } else {
      showMessage({
        message: t('global:deniedLocation', { lng: i18n.language }),
        description: t('global:deniedLocationDesc', { lng: i18n.language }),
        type: 'danger',
      })

      return
    }

    Location.startLocationUpdatesAsync('location-tracking', {
      accuracy: Location.Accuracy.Highest,
      timeInterval: THREESHOLD_INTERVAL,
      distanceInterval: THREESHOLD_METERS,
      pausesUpdatesAutomatically: true,
    })
  }

  // trigger each 20 meters
  monitorPosition = () => {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: THREESHOLD_INTERVAL,
        distanceInterval: THREESHOLD_METERS,
        pausesUpdatesAutomatically: true,
      },
      async (_position) => {
        const { latitude, longitude } = _position.coords

        this.setState({
          latitude,
          longitude,
        })
      },
      (error) => console.log(error)
    )
  }

  renderReport = () => (
    <Report
      uuid={this.state.uuid}
      latitude={this.state.latitude}
      longitude={this.state.longitude}
      permission={this.state.permission}
    />
  )

  renderSubmit = () => (
    <Search
      uuid={this.state.uuid}
      latitude={this.state.latitude}
      longitude={this.state.longitude}
    />
  )

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/bad.png'),
      require('./assets/desert.png'),
      require('./assets/good.png'),
      require('./assets/high.png'),
      require('./assets/low.png'),
      require('./assets/map.png'),
      require('./assets/medium.png'),
    ]

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync()
    })
    return Promise.all(cacheImages)
  }

  render() {
    const { t, i18n } = this.props

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              const iconName =
                route.name === 'Search' || route.name === 'Cerca'
                  ? 'ios-search'
                  : 'ios-send'

              return <Ionicons name={iconName} size={size} color={color} />
            },
          })}
          tabBarOptions={{
            activeTintColor: '#84D4FF',
          }}
        >
          <Tab.Screen
            name={t('tab:search', { lng: i18n.language })}
            component={this.renderSubmit}
          />
          <Tab.Screen
            name={t('tab:contribute', { lng: i18n.language })}
            component={this.renderReport}
          />
        </Tab.Navigator>
        <FlashMessage position="top" duration={3000} />
      </NavigationContainer>
    )
  }
}

const ReloadAppOnLanguageChange = withNamespaces(['global'], {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedApp)

export default class App extends React.Component {
  render() {
    return <ReloadAppOnLanguageChange />
  }
}
