import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) Alert.alert('Login Error', error.message);
        setLoading(false);
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) Alert.alert('Sign Up Error', error.message);
        else Alert.alert('Success', 'Check your email for confirmation!');
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* Fallback Gradient since Image Generation failed - intended to be ImageBackground */}
            <LinearGradient
                colors={['#003366', '#001a33']}
                style={styles.background}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Text style={styles.title}>CourseMap</Text>
                        <Text style={styles.subtitle}>Track your rowing progress</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color="#FFFFFF" />
                        ) : (
                            <View style={styles.buttons}>
                                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                    <Text style={styles.loginButtonText}>Log In</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#E0E0E0',
        fontWeight: '500',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect container for form
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    input: {
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#FFFFFF',
    },
    buttons: {
        marginTop: 10,
        gap: 15,
    },
    loginButton: {
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    loginButtonText: {
        color: '#003366',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
