import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { useAuth } from '@/context/AuthContext';

const COUNTRY_CODES = [
  { code: '+970', label: ' +970' },
  { code: '+972', label: ' +972' },
];

export default function PhoneVerifyScreen() {
  const { setUserName } = useAuth();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [localNumber, setLocalNumber] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [sending, setSending] = useState(false);

  const getFullPhoneNumber = () => {
    const digitsOnly = localNumber.replace(/\D/g, ''); // strip non-digits
    return `${countryCode}${digitsOnly}`;
  };

  const handleSendOtp = async () => {
    if (localNumber.length < 7) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    try {
      setSending(true);
      const fullNumber = getFullPhoneNumber();
      const result = await signInWithPhoneNumber(auth, fullNumber, recaptchaVerifier.current!);
      setConfirmation(result);
      setStep('OTP');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to send code.');
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmation) return;
    try {
      await confirmation.confirm(code);
      await setUserName(name.trim());
    } catch (e: any) {
      Alert.alert('Error', 'Invalid OTP Code');
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification
      />

      <Text style={styles.title}>
        {step === 'PHONE' ? 'Enter Your Details' : 'Enter Verification Code'}
      </Text>

      {step === 'PHONE' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.phoneRow}>
            <View style={styles.codePicker}>
              {COUNTRY_CODES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={[
                    styles.codeOption,
                    countryCode === c.code && styles.codeOptionSelected,
                  ]}
                  onPress={() => setCountryCode(c.code)}
                >
                  <Text
                    style={[
                      styles.codeOptionText,
                      countryCode === c.code && styles.codeOptionTextSelected,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="591234567"
              keyboardType="phone-pad"
              value={localNumber}
              onChangeText={setLocalNumber}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={sending}>
            <Text style={styles.buttonText}>{sending ? 'Sending...' : 'Send Code'}</Text>
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
  phoneRow: { flexDirection: 'row', gap: 8, marginBottom: 15 },
  phoneInput: { flex: 1, marginBottom: 0 },
  codePicker: { flexDirection: 'row', gap: 4 },
  codeOption: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  codeOptionSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  codeOptionText: { fontSize: 14, color: '#333' },
  codeOptionTextSelected: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
