/**
 * Text to Speech App
 * Beautiful UI with API integration
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
// @ts-ignore - react-native-sound doesn't have TypeScript definitions
import Sound from 'react-native-sound';
// @ts-ignore - react-native-fs doesn't have TypeScript definitions
import RNFS from 'react-native-fs';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

// Base64 encoder for React Native
const base64Encode = (str: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;
    const bitmap = (a << 16) | (b << 8) | c;
    output += chars.charAt((bitmap >> 18) & 63);
    output += chars.charAt((bitmap >> 12) & 63);
    output += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
    output += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
  }
  return output;
};

interface VoiceOption {
  label: string;
  value: string;
}

const LANGUAGES: VoiceOption[] = [
  { label: 'Bangla', value: 'bn' },
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
];

const VOICE_TYPES: VoiceOption[] = [
  { label: 'Cute Cartoon Baby', value: 'cute_cartoon_baby' },
  { label: 'Deep Voiceover', value: 'deep_voiceover' },
  { label: 'News Reporter', value: 'news_reporter' },
  { label: 'Normal Female', value: 'normal_female' },
  { label: 'Normal Male', value: 'normal_male' },
  { label: 'Old Man', value: 'old_man' },
  { label: 'Old Woman', value: 'old_woman' },
  { label: 'Radio Host', value: 'radio_host' },
  { label: 'Smart Male', value: 'smart_male' },
  { label: 'Teen Female', value: 'teen_female' },
  { label: 'Teen Male', value: 'teen_male' },
  { label: 'Whisper', value: 'whisper' },
];

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
      />
      <AppContent isDarkMode={isDarkMode} />
    </SafeAreaProvider>
  );
}

function AppContent({ isDarkMode }: { isDarkMode: boolean }) {
  const safeAreaInsets = useSafeAreaInsets();
  const [text, setText] = useState('আমার সোনার বাংলা, আমি তোমায় ভালোবাসি');
  const [selectedLanguage, setSelectedLanguage] = useState('bn');
  const [selectedVoiceType, setSelectedVoiceType] = useState('teen_female');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Sound | null>(null);

  // Bangladeshi Flag Colors - Green & Red
  const colors = {
    // Green shades (Bangladesh flag green)
    primary: '#006A4E', // Official Bangladesh green
    primaryLight: '#008B6B', // Lighter green for gradients
    primaryDark: '#00523A', // Darker green for depth
    
    // Red (Bangladesh flag red circle)
    accent: '#F42A41', // Official Bangladesh red
    accentLight: '#FF4D5F', // Lighter red for highlights
    
    // Background colors
    background: isDarkMode ? '#0A1F17' : '#F0F9F6', // Dark green tint / Light green tint
    surface: isDarkMode ? '#0F2B20' : '#FFFFFF',
    surfaceElevated: isDarkMode ? '#15382A' : '#F8FCFA',
    
    // Text colors
    text: isDarkMode ? '#FFFFFF' : '#1A3D2E',
    textSecondary: isDarkMode ? '#B8D4C8' : '#4A6B5E',
    textLight: isDarkMode ? '#E0F0E8' : '#2D5A47',
    
    // UI elements
    border: isDarkMode ? '#1F4A38' : '#D4E8DE',
    borderLight: isDarkMode ? '#2A5A45' : '#E8F5EF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    
    // Selection states
    selected: isDarkMode ? '#1F4A38' : '#E0F5ED',
    selectedText: '#FFFFFF',
  };

  useEffect(() => {
    return () => {
      // Cleanup sound on unmount
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
    };
  }, []);

  const generateSpeech = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text to convert to speech');
      return;
    }

    setLoading(true);
    setError(null);
    setPlaying(false);

    // Stop any currently playing sound
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('language', selectedLanguage);
      formData.append('voice_type', selectedVoiceType);
      formData.append('text', text.trim());

      // Make API request
      const response = await fetch('https://texttospeechfree.online/generate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Referer': 'https://texttospeechfree.online/',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // The API returns JSON with audio_file path
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        // Check if the response was successful
        if (!data.success) {
          throw new Error(data.message || 'Failed to generate speech');
        }
        
        // Handle the audio_file path
        if (data.audio_file) {
          // Construct full URL from relative path
          const audioUrl = data.audio_file.startsWith('http')
            ? data.audio_file
            : `https://texttospeechfree.online${data.audio_file}`;
          
          console.log('Audio file URL:', audioUrl);
          await playAudio(audioUrl);
        } else if (data.url || data.audio_url) {
          // Fallback for other possible response formats
          await playAudio(data.url || data.audio_url);
        } else {
          throw new Error(data.message || 'No audio file received from API');
        }
      } else {
        // If not JSON, assume it's an audio file - save it directly
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const audioPath = `${RNFS.DocumentDirectoryPath}/tts_${Date.now()}.mp3`;
        
        // Convert to base64 for React Native FS
        let binary = '';
        const len = uint8Array.length;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = base64Encode(binary);
        
        await RNFS.writeFile(audioPath, base64, 'base64');
        await playAudioFromPath(audioPath);
      }
    } catch (err: any) {
      console.error('Error generating speech:', err);
      setError(err.message || 'Failed to generate speech. Please try again.');
      Alert.alert('Error', err.message || 'Failed to generate speech. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playAudioFromPath = async (filePath: string) => {
    return new Promise<void>((resolve, reject) => {
      const sound = new Sound(filePath, '', (error: any) => {
        if (error) {
          console.error('Error loading sound:', error);
          setError('Failed to load audio file');
          reject(error);
          return;
        }

        sound.play((success: boolean) => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setPlaying(false);
          sound.release();
          soundRef.current = null;
        });

        setPlaying(true);
        soundRef.current = sound;
        setAudioUrl(filePath);
        setAudioFilePath(filePath);
        resolve();
      });
    });
  };

  const playAudio = async (url: string) => {
    try {
      // For React Native, we need to download the file first
      const downloadPath = `${RNFS.DocumentDirectoryPath}/tts_${Date.now()}.mp3`;
      
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadPath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        await playAudioFromPath(downloadPath);
      } else {
        throw new Error('Failed to download audio file');
      }
    } catch (err: any) {
      console.error('Error playing audio:', err);
      setError(err.message || 'Failed to play audio');
      // Fallback: try to play directly from URL (may work on some platforms)
      try {
        const sound = new Sound(url, '', (error: any) => {
          if (error) {
            console.error('Error loading sound from URL:', error);
            setError('Failed to load audio file');
            return;
          }
          sound.play((success: boolean) => {
            if (success) {
              console.log('Successfully finished playing');
            } else {
              console.log('Playback failed due to audio decoding errors');
            }
            setPlaying(false);
            sound.release();
            soundRef.current = null;
          });
          setPlaying(true);
          soundRef.current = sound;
          setAudioUrl(url);
          // Store the download path for download functionality
          const downloadPath = `${RNFS.DocumentDirectoryPath}/tts_${Date.now()}.mp3`;
          setAudioFilePath(downloadPath);
        });
      } catch (fallbackErr) {
        console.error('Fallback audio play failed:', fallbackErr);
        setError('Failed to play audio. Please try again.');
      }
    }
  };

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // iOS doesn't need this permission
    }

    try {
      // For Android 13+ (API 33+), we don't need WRITE_EXTERNAL_STORAGE
      if (Platform.Version >= 33) {
        return true;
      }

      // For Android 10-12, request WRITE_EXTERNAL_STORAGE
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to storage to save audio files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  };

  const downloadAudio = async () => {
    if (!audioUrl) {
      Alert.alert('Error', 'No audio file available to download');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      let downloadDir: string;
      
      // For Android, try to get Downloads directory, fallback to Documents if permission denied
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        
        if (hasPermission) {
          try {
            // Try to use Downloads directory
            downloadDir = RNFS.DownloadDirectoryPath;
            // Test if we can write to this directory
            const testPath = `${downloadDir}/.test_write`;
            try {
              await RNFS.writeFile(testPath, 'test', 'utf8');
              await RNFS.unlink(testPath);
            } catch {
              // If we can't write, fallback to Documents
              downloadDir = RNFS.DocumentDirectoryPath;
            }
          } catch {
            // Fallback to Documents directory
            downloadDir = RNFS.DocumentDirectoryPath;
          }
        } else {
          // Permission denied, use Documents directory (no permission needed)
          downloadDir = RNFS.DocumentDirectoryPath;
        }
      } else {
        // iOS
        downloadDir = RNFS.DocumentDirectoryPath;
      }
      
      // Create a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `text-to-speech-${timestamp}.mp3`;
      const downloadPath = `${downloadDir}/${filename}`;

      // If we have a local file path, copy it; otherwise download from URL
      if (audioFilePath && audioFilePath.startsWith('/')) {
        // Check if the local file exists
        const fileExists = await RNFS.exists(audioFilePath);
        if (fileExists) {
          // Copy the existing file to downloads
          await RNFS.copyFile(audioFilePath, downloadPath);
          Alert.alert(
            'Download Complete',
            `Audio file saved to:\n${downloadPath}`,
            [{ text: 'OK' }]
          );
        } else {
          // File doesn't exist, download from URL
          await downloadFromUrl(audioUrl, downloadPath);
        }
      } else {
        // Download from URL
        await downloadFromUrl(audioUrl, downloadPath);
      }
    } catch (err: any) {
      console.error('Error downloading audio:', err);
      const errorMessage = err.message || 'Failed to download audio file';
      setError(errorMessage);
      Alert.alert('Download Error', errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  const downloadFromUrl = async (url: string, downloadPath: string) => {
    const downloadResult = await RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadPath,
    }).promise;

    if (downloadResult.statusCode === 200) {
      Alert.alert(
        'Download Complete',
        `Audio file saved to:\n${downloadPath}`,
        [{ text: 'OK' }]
      );
    } else {
      throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
    }
  };

  const stopAudio = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
      setPlaying(false);
    }
  };

  const styles = createStyles(colors, safeAreaInsets);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient Background */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* Option 1: Use local logo file (add logo.png to assets folder) */}
              <Image
                source={require('./assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              {/* Option 2: Use remote logo URL (uncomment and replace URL) */}
              {/* <Image
                source={{ uri: 'https://your-domain.com/logo.png' }}
                style={styles.logo}
                resizeMode="contain"
              /> */}
              {/* Option 3: Use emoji/icon placeholder (uncomment to use) */}
              {/* <View style={styles.logoPlaceholder}>
                <Text style={styles.logoEmoji}>🎤</Text>
              </View> */}
            </View>
            <Text style={styles.title}>Text to Speech</Text>
            <Text style={styles.subtitle}>বাংলা • हिंदी • English</Text>
            <Text style={styles.subtitleSecondary}>Convert your text into natural speech</Text>
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Enter Text</Text>
            {text.length > 0 && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setText('')}
              >
                <Text style={styles.resetButtonText}>🔄 Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Type your text here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{text.length} characters</Text>
        </View>

        {/* Language Selector */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Language</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectorContainer}
          >
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={[
                  styles.selectorButton,
                  selectedLanguage === lang.value && styles.selectorButtonSelected,
                ]}
                onPress={() => setSelectedLanguage(lang.value)}
              >
                <Text
                  style={[
                    styles.selectorButtonText,
                    selectedLanguage === lang.value && styles.selectorButtonTextSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Voice Type Selector */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Voice Type</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectorContainer}
          >
            {VOICE_TYPES.map((voice) => (
              <TouchableOpacity
                key={voice.value}
                style={[
                  styles.selectorButton,
                  selectedVoiceType === voice.value && styles.selectorButtonSelected,
                ]}
                onPress={() => setSelectedVoiceType(voice.value)}
              >
                <Text
                  style={[
                    styles.selectorButtonText,
                    selectedVoiceType === voice.value && styles.selectorButtonTextSelected,
                  ]}
                >
                  {voice.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Download Button - Show before Generate if audio exists */}
        {audioUrl && !loading && (
          <TouchableOpacity
            style={[styles.downloadButton, downloading && styles.downloadButtonDisabled]}
            onPress={downloadAudio}
            disabled={downloading}
          >
            {downloading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.downloadButtonText}>Downloading...</Text>
              </View>
            ) : (
              <Text style={styles.downloadButtonText}>⬇️ Download</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={generateSpeech}
          disabled={loading || playing}
        >
          {loading ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.generateButtonText}>Generating...</Text>
            </View>
          ) : (
            <Text style={styles.generateButtonText}>
              {playing ? '🎵 Playing...' : '🎤 Generate Speech'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Audio Controls - Stop Button */}
        {audioUrl && !loading && (
          <View style={styles.audioControls}>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopAudio}
              disabled={!playing}
            >
              <Text style={styles.stopButtonText}>
                {playing ? '⏸ Stop' : '⏹ Stopped'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any, insets: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: insets.bottom + 20,
    },
    headerContainer: {
      backgroundColor: colors.primary,
      paddingTop: insets.top + 10,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      marginBottom: 15,
      shadowColor: colors.primaryDark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      alignItems: 'center',
    },
    logoContainer: {
      marginBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      width: 100,
      height: 100,
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
      padding: 8,
    },
    logo: {
      width: 84,
      height: 84,
      borderRadius: 42,
    },
    logoPlaceholder: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoEmoji: {
      fontSize: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      fontSize: 15,
      color: '#FFFFFF',
      fontWeight: '600',
      marginBottom: 2,
      opacity: 0.95,
    },
    subtitleSecondary: {
      fontSize: 12,
      color: '#FFFFFF',
      opacity: 0.85,
      marginTop: 2,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.5,
      flex: 1,
    },
    resetButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    resetButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    textInput: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 18,
      fontSize: 16,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.borderLight,
      minHeight: 140,
      textAlignVertical: 'top',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    charCount: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'right',
      fontWeight: '500',
    },
    selectorContainer: {
      flexDirection: 'row',
      paddingHorizontal: 4,
    },
    selectorButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 2,
      borderColor: colors.borderLight,
      marginRight: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    selectorButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primaryDark,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    selectorButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    selectorButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    generateButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      marginHorizontal: 20,
      shadowColor: colors.primaryDark,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    generateButtonDisabled: {
      opacity: 0.7,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    generateButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    errorContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      marginHorizontal: 20,
      borderWidth: 2,
      borderColor: colors.error,
      borderLeftWidth: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: '600',
    },
    audioControls: {
      marginTop: 12,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 20,
    },
    stopButton: {
      flex: 1,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.borderLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    stopButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    downloadButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    downloadButtonDisabled: {
      opacity: 0.6,
    },
    downloadButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });

export default App;
