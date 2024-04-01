import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Detail = () => {
  return (
    <View style = {styles.container}>
      <Text>Detail</Text>
    </View>
  )
}

export default Detail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems:'center',
        justifyContent: 'center'
    },
})
