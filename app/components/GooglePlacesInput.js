import React, { useState, useEffect } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import settings from '../settings'
import { withNamespaces } from 'react-i18next'

const GooglePlacesInput = (props) => {
  const [autoComplete, setAutoComplete] = useState(null)

  useEffect(() => {
    if (!autoComplete) return

    if (!props.search) {
      autoComplete.triggerBlur()
    }
  }, [props.search])

  const { t, i18n } = props

  return (
    <GooglePlacesAutocomplete
      ref={(ref) => setAutoComplete(ref)}
      placeholder={t('search:searchPlaceholder', { lng: i18n.language })}
      minLength={2}
      autoFocus={false}
      returnKeyType={'search'}
      listViewDisplayed={props.search}
      fetchDetails={true}
      onPress={(data, details = null) => {
        props.onSearch({
          lat: details.geometry.location.lat,
          lon: details.geometry.location.lng,
        })
      }}
      textInputProps={{
        onFocus: () => {
          props.onFocus()
        },
        onBlur: () => {
          props.onBlur()
        },
      }}
      query={{
        key: settings.googlePlacesApiKey,
        language: 'en',
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      styles={{
        container: {
          backgroundColor: props.search ? 'white' : 'transparent',
        },
        textInputContainer: {
          marginTop: props.search ? 15 : 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          marginLeft: props.search ? 0 : 15,
          marginRight: props.search ? 0 : 15,
          paddingLeft: props.search ? 0 : 2,
          paddingRight: props.search ? 0 : 2,
          height: 70,          
          borderBottomWidth: props.search ? 2 : 0,
          borderBottomColor: props.search ? '#84D4FF' : 'white',
        },
        row: {
          height: 50,
          alignItems: 'center',
        },
        textInput: {
          marginLeft: 0,
          marginRight: 0,
          height: 60,
          color: '#5d5d5d',
          fontSize: 17,
        },
        listView: {
          backgroundColor: 'white'
        },
      }}
    />
  )
}

export default withNamespaces(['search'], { wait: true })(GooglePlacesInput)
