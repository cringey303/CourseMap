import { useTheme } from '@/components/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { calculateCourseLength, HOCR_COURSE } from '@/constants/CourseData';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const totalKm = calculateCourseLength(HOCR_COURSE);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);
            }
        })();
    }, []);

    const initialRegion = {
        latitude: 42.366,
        longitude: -71.135,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                provider={PROVIDER_DEFAULT}
                tintColor={colors.navy}
                userInterfaceStyle={isDark ? 'dark' : 'light'}
                // CRITICAL FIX: Push map controls down by the top safe area inset
                mapPadding={{ top: insets.top, bottom: 0, left: 0, right: 0 }}
            >
                <Polyline
                    key="hocr-polyline-v3-final"
                    coordinates={HOCR_COURSE}
                    strokeColor={isDark ? '#FFA500' : colors.navy}
                    strokeWidth={4}
                    lineDashPattern={[1]}
                />
                <Marker
                    coordinate={HOCR_COURSE[0]}
                    title="Start"
                    description="BU Boathouse"
                    pinColor={colors.navy}
                />
                <Marker
                    coordinate={HOCR_COURSE[HOCR_COURSE.length - 1]}
                    title="Finish"
                    description="Herter Park"
                    pinColor={colors.red}
                />
            </MapView>

            {/* GLASSMORPHISM OVERLAY */}
            <View style={[styles.overlayWrapper, { bottom: 80 + insets.bottom }]}>
                <View style={[styles.glassCard, { backgroundColor: colors.glass, borderColor: isDark ? '#333' : 'rgba(255,255,255,0.4)' }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.navy }]}>
                            <IconSymbol name="map.fill" size={20} color={'#FFFFFF'} />
                        </View>
                        <View>
                            <Text style={[styles.courseName, { color: colors.text }]}>Head of the Charles</Text>
                            <Text style={[styles.location, { color: colors.icon }]}>Boston, MA</Text>
                        </View>
                    </View>

                    <View style={styles.cardStats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{totalKm}km</Text>
                            <Text style={[styles.statLabel, { color: colors.icon }]}>Distance</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>Upstream</Text>
                            <Text style={[styles.statLabel, { color: colors.icon }]}>Direction</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    overlayWrapper: {
        position: 'absolute',
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    glassCard: {
        width: '100%',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    location: {
        fontSize: 14,
    },
    cardStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    divider: {
        width: 1,
        height: 30,
    },
});