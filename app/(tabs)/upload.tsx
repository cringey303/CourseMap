import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// COLORS
import { useTheme } from '@/components/ThemeContext';

export default function UploadScreen() {
    const { colors } = useTheme();
    const [uploading, setUploading] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [videoAsset, setVideoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const pickVideo = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setVideoAsset(result.assets[0]);
                setVideoUri(result.assets[0].uri);
            }
        } catch (e) {
            Alert.alert('Error picking video');
        }
    };

    const removeVideo = () => {
        setVideoUri(null);
        setVideoAsset(null);
    };

    const handleUpload = async () => {
        if (!videoAsset) return;

        try {
            setUploading(true);

            const response = await fetch(videoAsset.uri);
            const arrayBuffer = await response.arrayBuffer();

            const fileName = `${Date.now()}_${Math.random()}.mov`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('course-media')
                .upload(fileName, arrayBuffer, {
                    contentType: videoAsset.mimeType || 'video/quicktime',
                });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('course-media')
                .getPublicUrl(fileName);

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error: dbError } = await supabase
                    .from('submissions')
                    .insert({
                        user_id: user.id,
                        media_url: publicUrlData.publicUrl,
                        notes: 'Uploaded via app',
                    });
                if (dbError) throw dbError;
            }

            Alert.alert('Success', 'Video uploaded successfully!');
            router.push('/(tabs)/profile');
            removeVideo(); // Reset

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Upload failed. Check console.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Upload Footage</Text>
                <Text style={[styles.subtitle, { color: colors.icon }]}>Share course footage with others</Text>
            </View>

            <View style={styles.content}>
                {/* DROP ZONE OR PREVIEW */}
                {!videoUri ? (
                    <TouchableOpacity
                        style={[styles.dropZone, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={pickVideo}
                    >
                        <IconSymbol name="cloud.upload.fill" size={50} color={colors.navy} />
                        <Text style={[styles.dropText, { color: colors.text }]}>Tap to select file</Text>
                        <Text style={[styles.dropSubText, { color: colors.icon }]}>(Max 500MB)</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.previewContainer, { backgroundColor: colors.card, shadowColor: '#000' }]}>
                        {/* Thumbnail Placeholder */}
                        <View style={styles.thumbnailPlaceholder}>
                            <Image
                                source={{ uri: videoUri }}
                                style={styles.thumbnailImage}
                                resizeMode="cover"
                            />
                            <View style={styles.playOverlay}>
                                <IconSymbol name="play.fill" size={30} color="#FFF" />
                            </View>
                        </View>

                        <TouchableOpacity style={[styles.removeButton, { backgroundColor: colors.red }]} onPress={removeVideo}>
                            <IconSymbol name="xmark" size={16} color="#FFF" />
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>

                        <Text style={[styles.fileName, { color: colors.text }]}>Ready to upload</Text>
                    </View>
                )}
            </View>

            {/* FOOTER ACTION */}
            <View style={styles.footer}>
                {uploading ? (
                    <ActivityIndicator size="large" color={colors.navy} />
                ) : (
                    <TouchableOpacity
                        style={[styles.uploadButton, !videoUri && styles.disabledButton, { backgroundColor: !videoUri ? colors.border : colors.navy }]}
                        onPress={handleUpload}
                        disabled={!videoUri}
                    >
                        <Text style={[styles.buttonText, { color: !videoUri ? colors.text : '#FFF' }]}>Upload</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center', // Center the drop zone vertically in available space
    },
    // DROP ZONE
    dropZone: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: '600',
    },
    dropSubText: {
        marginTop: 5,
    },
    // PREVIEW
    previewContainer: {
        width: '100%',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: 180,
        backgroundColor: '#000',
        borderRadius: 12,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        opacity: 0.7,
    },
    playOverlay: {
        position: 'absolute',
    },
    fileName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        position: 'absolute',
        top: 25,
        right: 25,
    },
    removeText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 12,
    },
    // FOOTER
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    uploadButton: {
        height: 56,
        borderRadius: 28, // Fully rounded pill
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
