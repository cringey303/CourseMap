import { useTheme } from '@/components/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.text }]}>CourseMap</Text>
                        <Text style={[styles.username, { color: colors.icon }]}>Rower</Text>
                    </View>
                    <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
                        <IconSymbol name="person.fill" size={24} color="#FFF" />
                    </View>
                </View>

                {/* SEARCH BAR */}
                {/* SEARCH BAR */}
                <View style={[
                    styles.searchContainer,
                    {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1
                    }
                ]}>
                    <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
                    <TextInput
                        placeholder="Search teams, courses, regattas..."
                        placeholderTextColor={colors.icon}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                </View>

                {/* QUICK ACTIONS GRID */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Explore</Text>
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={[
                        styles.gridItem,
                        {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                            borderWidth: 1
                        }
                    ]}>
                        <View style={[styles.gridIcon, { backgroundColor: isDark ? 'rgba(2, 136, 209, 0.2)' : '#FFF' }]}>
                            <IconSymbol name="play.fill" size={24} color="#0288D1" />
                        </View>
                        <Text style={[styles.gridLabel, { color: colors.text }]}>Regattas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.gridItem,
                        {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                            borderWidth: 1
                        }
                    ]}>
                        <View style={[styles.gridIcon, { backgroundColor: isDark ? 'rgba(46, 125, 50, 0.2)' : '#FFF' }]}>
                            <IconSymbol name="person.fill" size={24} color="#2E7D32" />
                        </View>
                        <Text style={[styles.gridLabel, { color: colors.text }]}>Teams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.gridItem,
                        {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                            borderWidth: 1
                        }
                    ]}>
                        <View style={[styles.gridIcon, { backgroundColor: isDark ? 'rgba(239, 108, 0, 0.2)' : '#FFF' }]}>
                            <IconSymbol name="map.fill" size={24} color="#EF6C00" />
                        </View>
                        <Text style={[styles.gridLabel, { color: colors.text }]}>Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.gridItem,
                        {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                            borderWidth: 1
                        }
                    ]}>
                        <View style={[styles.gridIcon, { backgroundColor: isDark ? 'rgba(123, 31, 162, 0.2)' : '#FFF' }]}>
                            <IconSymbol name="arrow.up.doc.fill" size={24} color="#7B1FA2" />
                        </View>
                        <Text style={[styles.gridLabel, { color: colors.text }]}>Results</Text>
                    </TouchableOpacity>
                </View>

                {/* FAVORITES */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorites</Text>
                <TouchableOpacity
                    style={[styles.favoriteCard, { backgroundColor: colors.navy }]}
                    onPress={() => router.push('/(tabs)/map')}
                >
                    <View style={styles.favoriteContent}>
                        <View style={styles.favoriteTextContainer}>
                            <Text style={styles.favoriteTitle}>Head of the Charles</Text>
                            <Text style={styles.favoriteSubtitle}>Boston, MA • 4.8km</Text>
                        </View>
                        <View style={styles.goButton}>
                            <IconSymbol name="chevron.right" size={20} color={colors.navy} />
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    // HEADER
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
    },
    username: {
        fontSize: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // SEARCH
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        marginBottom: 30,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    // GRID
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    gridItem: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 20,
        padding: 15,
        justifyContent: 'space-between',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    gridIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    // FAVORITES
    favoriteCard: {
        width: '100%',
        height: 120,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'flex-end',
        shadowColor: '#003366',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    favoriteContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoriteTextContainer: {},
    favoriteTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    favoriteSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginTop: 4,
    },
    goButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
