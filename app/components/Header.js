import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

const Header = (props) => {
  return (
    <View style={styles.header}>
      <Image style={styles.img} source={require('../assets/group-white.png')} />
      <Text style={styles.text}>CROWDED</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    height: 70,
    width: '100%',
    backgroundColor: '#84D4FF',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    marginTop: 30,
    fontWeight: '700',
    color: 'white',
  },
  img: {
    marginTop: 30,
    width: 50,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})

export default Header
