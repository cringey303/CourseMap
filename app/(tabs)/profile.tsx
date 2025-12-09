import { useTheme } from '@/components/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Submission = {
    id: string;
    media_url: string;
    notes: string;
    created_at: string;
    user_id: string;
};

export default function ProfileScreen() {
    const { colors, isDark, setTheme, theme } = useTheme();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Profile Data
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [role, setRole] = useState<string>('MEMBER');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    const fetchProfileData = async () => {
        if (!session?.user) return;
        try {
            setLoading(true);
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
            if (profile?.role) setRole(profile.role.toUpperCase());

            const { data: subs, error } = await supabase
                .from('submissions')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && subs) setSubmissions(subs);
        } catch (e) {
            console.log('Error fetching data', e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (session) fetchProfileData();
        }, [session])
    );

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    // --- RENDER LOGIN ---
    // --- RENDER PROFILE ---

    // --- RENDER PROFILE ---
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.topRow}>
                <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
                <View style={styles.settingsRow}>
                    <Text style={{ color: colors.text, marginRight: 8 }}>{isDark ? 'Dark' : 'Light'}</Text>
                    <Switch value={isDark} onValueChange={toggleTheme} />
                </View>
            </View>

            <View style={[styles.roleBadge, { backgroundColor: colors.navy }]}>
                <Text style={styles.roleText}>{role}</Text>
            </View>

            <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
                <View style={styles.statBlock}>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{submissions.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.icon }]}>Uploads</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statBlock}>
                    <Text style={[styles.statNumber, { color: colors.text }]}>A</Text>
                    <Text style={[styles.statLabel, { color: colors.icon }]}>Team</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statBlock}>
                    <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
                    <Text style={[styles.statLabel, { color: colors.icon }]}>Days</Text>
                </View>
            </View>

            <TouchableOpacity onPress={handleSignOut} style={{ alignSelf: 'center', marginBottom: 20 }}>
                <Text style={{ color: colors.red, fontWeight: 'bold' }}>Sign Out</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent History</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <FlatList
                data={submissions}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProfileData} tintColor={colors.text} />}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <IconSymbol name="video.slash" size={40} color={colors.icon} />
                        <Text style={[styles.emptyText, { color: colors.icon }]}>No submissions found.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#000' }]}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.iconPlaceholder, { backgroundColor: colors.navy }]}>
                                <IconSymbol name="video.fill" size={24} color={'#FFF'} />
                            </View>
                        </View>
                        <View style={styles.cardCenter}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Practice Submission</Text>
                            <Text style={[styles.cardDate, { color: colors.icon }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
                            {item.notes ? <Text style={[styles.cardNotes, { color: colors.icon }]} numberOfLines={1}>{item.notes}</Text> : null}
                        </View>
                        <View style={styles.cardRight}>
                            <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    // AUTH STYLES
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    authTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    authSubtitle: {
        textAlign: 'center',
        marginBottom: 40,
        fontSize: 16,
    },
    input: {
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    authButtons: {
        marginTop: 20,
        gap: 15,
    },
    primaryButton: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // PROFILE HEADER
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    topRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
    },
    roleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 24,
    },
    roleText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    statsContainer: {
        flexDirection: 'row',
        borderRadius: 16,
        paddingVertical: 16,
        width: '100%',
        marginBottom: 30,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    statBlock: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: '60%',
    },
    sectionTitle: {
        alignSelf: 'flex-start',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
    },
    // CARD STYLES
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLeft: {
        marginRight: 16,
    },
    iconPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardCenter: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardDate: {
        fontSize: 13,
    },
    cardNotes: {
        fontSize: 13,
        marginTop: 2,
        fontStyle: 'italic',
    },
    cardRight: {
        marginLeft: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    },
});
