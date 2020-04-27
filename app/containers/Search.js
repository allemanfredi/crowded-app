import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Text,
} from 'react-native'
import GooglePlacesInput from '../components/GooglePlacesInput'
import Result from '../components/Result'
import Loader from '../components/Loader'
import { getResult } from '../api'
import { showMessage } from 'react-native-flash-message'
import { withNamespaces } from 'react-i18next'
import Header from '../components/Header'

class Search extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      search: false,
      report: false,
      loaded: false,
      result: null,
      uuid: null,
      isLoading: false,
    }
  }

  compute = async (_lat, _lon) => {
    const { t, i18n } = this.props

    try {
      this.setState({ isLoading: true })

      const result = await getResult(_lat, _lon)

      this.setState({
        result: result ? result : -1,
      })

      this.setState({ isLoading: false })
    } catch (err) {
      this.setState({ isLoading: false })

      showMessage({
        message: t('search:error', { lng: i18n.language }),
        /*description: t('report:errorDescSearch', { lng: i18n.language }),*/
        type: 'danger',
      })
    }
  }

  render() {
    const { t, i18n } = this.props

    return (
      <TouchableWithoutFeedback
        onPress={() =>
          this.setState({
            search: false,
            report: false,
          })
        }
      >
        {this.state.result && !this.state.search ? (
          <Result
            result={this.state.result}
            onBack={() => this.setState({ result: null })}
          />
        ) : (
          <View
            style={{
              flex: 1,
            }}
          >
            <Header />
            <Loader isVisible={this.state.isLoading} />
            {/*<Button text="Search" onPress={this.compute} />*/}

            {this.state.search ? null : (
              <View style={styles.descriptionContainer}>
                <Text style={styles.msg}>
                  {t('search:title', { lng: i18n.language })}
                </Text>
                <Text style={styles.crowded}>
                  {t('search:crowded', { lng: i18n.language })}
                  <Text style={styles.msg}>?</Text>
                </Text>
                <Image
                  style={styles.img}
                  source={require('../assets/map.png')}
                />
              </View>
            )}

            {!this.state.result ? (
              <View style={{ flex: this.state.search ? 5 : 2 }}>
                <GooglePlacesInput
                  search={this.state.search}
                  onSearch={({ lat, lon }) => this.compute(lat, lon)}
                  onFocus={() => this.setState({ search: true })}
                  onBlur={() => this.setState({ search: false })}
                />
              </View>
            ) : null}
          </View>
        )}
      </TouchableWithoutFeedback>
    )
  }
}

export default withNamespaces(['search'], { wait: true })(Search)

const styles = StyleSheet.create({
  descriptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 5,
    marginTop: 70,
    padding: 20,
    display: 'flex',
  },
  crowded: {
    color: '#84D4FF',
    marginBottom: 50,
    fontSize: 35,
    fontWeight: '700',
  },
  img: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  msg: {
    fontSize: 30,
    fontWeight: '700',
    color: '#475965',
  },
  logoText: {
    fontSize: 45,
    color: '#84D4FF',
    fontWeight: '900',
  },
  footer: {
    position: 'absolute',
    marginBottom: 20,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
