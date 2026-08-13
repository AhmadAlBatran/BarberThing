import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const SERVICES = [
  { id: '1', name: 'Haircut', price: 25 },
  { id: '2', name: 'Beard Trim', price: 10 },
  { id: '3', name: 'Hair Color', price: 50 },
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
];

type Service = {
  id: string;
  name: string;
  price: number;
};

export default function HomeScreen() {
  // Store multiple selected services in an array
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // User Details State
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const toggleServiceSelection = (service: Service) => {
    setSelectedServices((prevServices) => {
      const exists = prevServices.some((s) => s.id === service.id);
      if (exists) {
        return prevServices.filter((s) => s.id !== service.id);
      } else {
        return [...prevServices, service];
      }
    });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleBooking = () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter your full name.');
      return;
    }

    // Basic phone validation (at least 8-15 digits/symbols)
    const phoneRegex = /^[0-9\-\+\s]{8,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    if (selectedServices.length === 0 || !selectedTime) {
      Alert.alert('Incomplete', 'Please select at least one service, date, and time slot.');
      return;
    }

    const serviceNames = selectedServices.map((s) => s.name).join(', ');
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    Alert.alert(
      'Booking Confirmed! 🎉',
      `Name: ${name}\nPhone: ${phone}\nServices: ${serviceNames}\nTotal Price: $${totalPrice.toFixed(
        2
      )}\nDate: ${date.toDateString()}\nTime: ${selectedTime}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Barber Shop Booking</Text>

      {/* 1. Contact Information */}
      <Text style={styles.sectionTitle}>1. Contact Information</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Phone Number (e.g. +1234567890)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* 2. Service Selection */}
      <Text style={styles.sectionTitle}>2. Select Services</Text>
      <View style={styles.listContainer}>
        {SERVICES.map((item) => {
          const isSelected = selectedServices.some((s) => s.id === item.id);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => toggleServiceSelection(item)}
            >
              <Text
                style={[
                  styles.cardText,
                  isSelected && styles.selectedCardText,
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.cardPrice,
                  isSelected && styles.selectedCardText,
                ]}
              >
                ${item.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Date Selection */}
      <Text style={styles.sectionTitle}>3. Choose Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* 4. Time Slot Selection */}
      <Text style={styles.sectionTitle}>4. Select Time</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeChip,
              selectedTime === time && styles.selectedTimeChip,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.timeChipText,
                selectedTime === time && styles.selectedTimeChipText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    gap: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  listContainer: {
    gap: 10,
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#eef6ff',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCardText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cardPrice: {
    fontSize: 14,
    color: '#666',
  },
  dateButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTimeChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeChipText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookButton: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
