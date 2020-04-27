import React from 'react'
import { ActivityIndicator, StyleSheet, Dimensions, View } from 'react-native'
import Modal from 'react-native-modal'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const Loader = (props) => {
  return (
    <Modal
      isVisible={props.isVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
    >
      <View style={styles.box}>
        <View style={styles.boxContent}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContent: {
    backgroundColor: 'transparent',
    width: deviceWidth - 50,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
})

export default Loader
