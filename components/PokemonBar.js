import React, { useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native'

export default function PokemonBar({ id, name, url, img }) {
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    return (
        <View style={styles.container}>
            {isLoading && <ActivityIndicator size='small' color='#000ff' />}
            {error && <Text style={styles.errorText}>Failed to load image</Text>}

            <Image
                source={{ uri: img }}
                style={styles.img}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                    setLoading(false)
                    setError(true)
                }}
            />
            <View style={styles.infoCard}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.idText}>{url}</Text>
                <Text style={styles.errorText}>#{id}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Horizontal alignment for card content
        alignItems: 'center',
        padding: 10,
        marginVertical: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    img: {
        width: 80,
        height: 80,
        marginRight: 12,
    },
    infoCard: {
        flex: 1,
        flexDirection: 'column', // Vertical alignment for text items
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    idText: {
        fontSize: 14,
        color: '#6c757d',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
}) 