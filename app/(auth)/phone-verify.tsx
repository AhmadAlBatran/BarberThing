import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function PhoneVerifyScreen() {
  const { verifyPhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  const handleSendOtp = () => {
    if (phone.length < 8) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }
    // Backend / SMS service call goes here
    setStep('OTP');
  };

  const handleVerifyOtp = async () => {
    const success = await verifyPhone(phone, code);
    if (!success) {
      Alert.alert('Error', 'Invalid OTP Code');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 'PHONE' ? 'Enter Phone Number' : 'Enter Verification Code'}
      </Text>

      {step === 'PHONE' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="6-digit code"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
