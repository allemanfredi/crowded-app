import * as SecureStore from 'expo-secure-store'
import uuid from 'react-native-uuid'
import settings from '../settings'

/**
 * NOTE: secret key used only to "authenticate" messages
 * sent from a mobile application, since there is not login,
 * an attacker, if finds the endpoint could send fake data to
 * the server since there is not authentication.
 * I know this process can be improved, but consindering 
 * the app itself can be a good compromise
 */
let key = 'secret key'

const getIdentifier = async () => {
  try {
    const value = await SecureStore.getItemAsync(settings.storage.ID)
    if (!value) {
      const id = uuid.v4()
      await SecureStore.setItemAsync(settings.storage.ID, id + '&' + key)
      key = null
      return id
    }
    key = null
    return value.split('&')[0]
  } catch (err) {
    console.log(err)
  }
}

const getKey = async () => {
  try {
    const value = await SecureStore.getItemAsync(settings.storage.ID)
    return value.split('&')[1]
  } catch (err) {
    console.log(err)
  }
}

export { getIdentifier, getKey }
