import React from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import { Rating } from 'react-native-ratings'
import Button from './Button'
import { withNamespaces } from 'react-i18next'
import { getResultStatus } from '../utils/result'
import Header from '../components/Header'

const Result = (props) => {
  const { t, i18n } = props

  let img = null

  const result = getResultStatus(props.result)
  switch (result) {
    case 'low': {
      img = require('../assets/low.png')
      break
    }
    case 'medium': {
      img = require('../assets/medium.png')
      break
    }
    case 'high': {
      img = require('../assets/high.png')
      break
    }
    default: {
      img = require('../assets/desert.png')
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.containertTitle}>
        <Image style={styles.img} source={img} />
        <Text
          style={{
            ...styles.msg,
            fontSize: props.result === -1 || !props.result ? 18 : 35,
          }}
        >
          {props.result === -1 || !props.result
            ? t('result:noData', { lng: i18n.language })
            : t(`result:${result}`, { lng: i18n.language })}
        </Text>
      </View>
      <View style={styles.newSearch}>
        <Button
          text={t('result:newSearch', { lng: i18n.language })}
          onPress={() => props.onBack()}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containertTitle: {
    flex: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  msg: {
    fontWeight: '700',
    color: '#475965',
    marginTop: 15,
    marginTop: 40,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  img: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
  newSearch: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default withNamespaces(['result'], { wait: true })(Result)
