import React from 'react'
import { StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'

const deviceWidth = Dimensions.get('window').width

const Button = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    height: 70,
    width: deviceWidth - 2 * 20,
    borderRadius: 100,
    backgroundColor: '#84D4FF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontWeight: '900',
    color: 'white',
  },
})

export default Button
