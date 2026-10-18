
import React, { useState } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';

import { getTypeColor } from '../constants/TypeColor';

export default function PokemonBar({ id, name, img, types = [], onPress }) {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Use the first type to determine the card's theme.
    const mainColor = getTypeColor(types[0]);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: `${mainColor}20`,
                    borderColor: `${mainColor}80`,
                    opacity: pressed ? 0.75 : 1,
                },
            ]}
        >
            {/* Pokémon image */}
            <View style={styles.imageContainer}>
                {isLoading && !error && (
                    <ActivityIndicator
                        size="small"
                        color={mainColor}
                        style={styles.loader}
                    />
                )}

                {error ? (
                    <Text style={styles.errorText}>No image</Text>
                ) : (
                    <Image
                        source={{ uri: img }}
                        style={styles.img}
                        resizeMode="contain"
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                    />
                )}
            </View>

            {/* Pokémon information */}
            <View style={styles.infoCard}>
                <Text style={styles.idText}>
                    #{String(id).padStart(3, '0')}
                </Text>

                <Text style={styles.nameText} numberOfLines={1}>
                    {name}
                </Text>

                {/* Type badges */}
                <View style={styles.typesContainer}>
                    {types.map((type) => {
                        const typeColor = getTypeColor(type);

                        return (
                            <View
                                key={type}
                                style={[
                                    styles.typeBadge,
                                    { backgroundColor: typeColor },
                                ]}
                            >
                                <Text style={styles.typeText}>
                                    {type}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Decorative type-colored strip */}
            <View
                style={[
                    styles.colorStrip,
                    { backgroundColor: mainColor },
                ]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        minHeight: 112,
    },

    imageContainer: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    img: {
        width: 90,
        height: 90,
    },

    loader: {
        position: 'absolute',
        zIndex: 1,
    },

    infoCard: {
        flex: 1,
        justifyContent: 'center',
    },

    idText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 2,
    },

    nameText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#1E293B',
        textTransform: 'capitalize',
        marginBottom: 8,
    },

    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },

    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    typeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'capitalize',
    },

    errorText: {
        color: '#B91C1C',
        fontSize: 12,
    },

    colorStrip: {
        width: 5,
        alignSelf: 'stretch',
        borderRadius: 5,
        marginLeft: 8,
    },
});
