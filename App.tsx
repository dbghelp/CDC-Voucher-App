import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

export default function App() {
  const [url, setUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUrl = async () => {
      const savedUrl = await AsyncStorage.getItem('userUrl');
      if (savedUrl) setUrl(savedUrl);
      setLoading(false);
    };
    loadUrl();
  }, []);

  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string.startsWith('http') ? string : `https://${string}`);
      return url.hostname.includes('.');
    } catch {
      return false;
    }
  };

  const handleSaveUrl = async () => {
    const formatted = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
    if (!isValidUrl(formatted)) {
      Alert.alert('Invalid URL', 'Please enter a valid website address.');
      return;
    }

    await AsyncStorage.setItem('userUrl', formatted);
    setUrl(formatted);
  };

  const confirmReset = () => {
    Alert.alert(
      'Change Link?',
      'Are you sure you want to change the voucher URL?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: handleReset },
      ],
      { cancelable: true }
    );
  };

  const handleReset = async () => {
    await AsyncStorage.removeItem('userUrl');
    setUrl('');
    setInputUrl('');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!url) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Enter Voucher URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="https://voucher.redeem.gov.sg/<your-voucher-code>"
          value={inputUrl}
          onChangeText={setInputUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
        <Button title="SAVE LINK" onPress={handleSaveUrl} disabled={!inputUrl.trim()} />
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <WebView source={{ uri: url }} />
      <View style={styles.changeLinkContainer}>
        <Button title="CHANGE LINK" onPress={confirmReset} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  changeLinkContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    padding: 6,
  },
});
