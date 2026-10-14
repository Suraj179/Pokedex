import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function LoadIcon(){
    return(
       <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#0000ff" />
       </View>
    )
}

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});