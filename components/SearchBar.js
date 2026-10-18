
import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function SearchBar({ value, onChangeText, placeholder = 'Search Pokémon...',}) {
    return (
        <View style={styles.container}>
            <Text style={styles.searchIcon}>⌕</Text>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#888"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
            />

            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Text style={styles.clearButton}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 50,
        marginHorizontal: 16,
    },
    searchIcon: {
        fontSize: 25,
        color: '#64748B',
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
    },
    clearButton: {
        fontSize: 18,
        color: '#64748B',
        paddingLeft: 10,
    },
});
