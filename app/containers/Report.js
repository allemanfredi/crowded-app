import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { storeReport } from '../api'
import { showMessage } from 'react-native-flash-message'
import Loader from '../components/Loader'
import { withNamespaces } from 'react-i18next'
import * as Crypto from 'expo-crypto'
import { getKey } from '../utils/first-time'
import Header from '../components/Header'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

class Report extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      report: false,
      loaded: false,
      isLoading: false,
    }
  }

  submit = async (_value) => {
    const { t, i18n } = this.props

    try {
      if (this.props.permission !== 'granted') {
        showMessage({
          message: t('global:locationNotEnabled', { lng: i18n.language }),
          description: t('global:locationNotEnabledDesc', {
            lng: i18n.language,
          }),
          type: 'danger',
        })
        return
      }

      this.setState({ isLoading: true })

      const key = await getKey()

      const report = {
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        uuid: this.props.uuid,
        value: _value,
        hash: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          key
        ),
      }

      await storeReport(report)
      showMessage({
        message: t('report:succed', { lng: i18n.language }),
        description: t('report:descSucced', { lng: i18n.language }),
        type: 'success',
      })

      this.setState({ isLoading: false })
    } catch (err) {
      this.setState({ isLoading: false })

      const { code } = err

      if (code) {
        showMessage({
          message: t('report:failed', { lng: i18n.language }),
          description: t('report:descFailed', { lng: i18n.language }),
          type: 'danger',
        })
      } else {
        showMessage({
          message: t('report:networkError', { lng: i18n.language }),
          /*description: t('report:networkErrorDesc', { lng: i18n.language }),*/
          type: 'danger',
        })
      }
    }
  }

  render() {
    const { t, i18n } = this.props

    return (
      <View style={{ flex: 1 }}>
        <Header />
        <Loader isVisible={this.state.isLoading} />
        <View style={{ ...styles.centered, flex: 10, marginTop: 70 }}>
          <Text style={styles.title}>
            {t('report:title', { lng: i18n.language })}
          </Text>
          <Text style={styles.msg}>
            {t('report:description', { lng: i18n.language })}
          </Text>
        </View>
        <View
          style={{
            ...styles.centered,
            flex: 7,
            display: 'flex',
            flexDirection: 'row',
            marginTop: -10,
            marginBottom: 40,
          }}
        >
          <TouchableOpacity onPress={() => this.submit(0)}>
            <Image
              style={{ ...styles.emoticon, marginRight: 35 }}
              source={require('../assets/bad.png')}
            />
            <Text
              style={{
                alignSelf: 'center',
                marginRight: 35,
                marginTop: 5,
                color: '#475965',
              }}
            >
              {t('report:no', { lng: i18n.language })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.submit(1)}>
            <Image
              style={{ ...styles.emoticon, marginLeft: 35 }}
              source={require('../assets/good.png')}
            />
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 35,
                marginTop: 5,
                color: '#475965',
              }}
            >
              {t('report:yes', { lng: i18n.language })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#475965',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  msg: {
    fontSize: 17,
    fontWeight: '400',
    color: '#475965',
    marginTop: 15,
    textAlign: 'center',
  },
  emoticon: {
    padding: 10,
    width: 90,
    height: 90,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})

export default withNamespaces(['report', 'global'], { wait: true })(Report)
