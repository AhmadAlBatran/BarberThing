import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';

// 1. IMPORT THE AUTH HOOK HERE
import { useAuth } from '@/context/AuthContext';

const SERVICES = [
  'Haircut & Styling',
  'Beard Trim',
  'Full Grooming Package',
  'Facial Care',
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
];

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  barber: string;
}

const PAST_APPOINTMENTS = [
  {
    id: '101',
    service: 'Beard Trim',
    date: '12 July 2026, 02:30 PM',
    status: 'Completed',
  },
  {
    id: '102',
    service: 'Full Grooming Package',
    date: '01 June 2026, 04:00 PM',
    status: 'Completed',
  },
];

export default function MenuScreen() {
  // 2. CALL THE HOOK AT THE TOP OF YOUR COMPONENT
  const { logout, userPhone } = useAuth();

  const [upcoming, setUpcoming] = useState<Appointment[]>([
    {
      id: '1',
      service: 'Haircut & Styling',
      date: 'Sat, Jul 25, 2026',
      time: '10:30 AM',
      barber: 'Alex',
    },
    {
      id: '2',
      service: 'Beard Trim',
      date: 'Mon, Aug 03, 2026',
      time: '02:30 PM',
      barber: 'Sam',
    },
    {
      id: '3',
      service: 'Facial Care',
      date: 'Fri, Aug 14, 2026',
      time: '09:00 AM',
      barber: 'Jordan',
    },
  ]);

  // Modal & Edit State
  const [editingItem, setEditingItem] = useState<Appointment | null>(null);
  const [editService, setEditService] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');

  // 3. USE THE DYNAMIC PHONE NUMBER FROM CONTEXT
  const user = {
    name: 'John Doe',
    phone: userPhone || '+1 234 567 890',
  };

  // 1. Cancel Action
  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setUpcoming(upcoming.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  // 2. Open Edit Modal
  const openEditModal = (item: Appointment) => {
    setEditingItem(item);
    setEditService(item.service);
    setEditTime(item.time);
  };

  // 3. Save Changes
  const handleSaveEdit = () => {
    if (!editingItem) return;

    setUpcoming((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, service: editService, time: editTime }
          : item
      )
    );

    setEditingItem(null);
    Alert.alert('Updated! 🎉', 'Your appointment details have been updated.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Account & Appointments</Text>

      {/* 1. PROFILE SECTION */}
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
        </View>

        {/* 4. LOG OUT BUTTON INSIDE THE PROFILE CARD */}
        <TouchableOpacity
          style={[styles.cancelButton, { marginTop: 15, backgroundColor: '#ffebee' }]}
          onPress={logout}
        >
          <Text style={[styles.cancelButtonText, { color: '#d32f2f' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* 2. UPCOMING APPOINTMENTS */}
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      {upcoming.length > 0 ? (
        upcoming.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceTitle}>{item.service}</Text>

              {/* EDIT BUTTON */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.detailText}>📅 {item.date} at {item.time}</Text>
            <Text style={styles.detailText}>💈 Barber: {item.barber}</Text>

            {/* CANCEL BUTTON */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No upcoming appointments scheduled.</Text>
        </View>
      )}

      {/* 3. PAST APPOINTMENTS */}
      <Text style={styles.sectionTitle}>Past Appointments</Text>
      {PAST_APPOINTMENTS.map((item) => (
        <View key={item.id} style={[styles.card, styles.pastCard]}>
          <View style={styles.pastHeader}>
            <Text style={styles.serviceTitle}>{item.service}</Text>
            <Text style={styles.statusBadge}>{item.status}</Text>
          </View>
          <Text style={styles.detailText}>📅 {item.date}</Text>
        </View>
      ))}

      {/* EDIT MODAL */}
      <Modal visible={!!editingItem} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Appointment</Text>

            <Text style={styles.modalSubTitle}>Select Service or Package</Text>
            {SERVICES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.modalOption,
                  editService === s && styles.modalOptionSelected,
                ]}
                onPress={() => setEditService(s)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    editService === s && styles.modalOptionTextSelected,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.modalSubTitle}>Select Time Slot</Text>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    editTime === t && styles.timeChipSelected,
                  ]}
                  onPress={() => setEditTime(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      editTime === t && styles.timeChipTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.modalCancelBtnText}>Dismiss</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 24,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#eef6ff',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ffebee',
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
  pastCard: {
    opacity: 0.8,
    backgroundColor: '#fafafa',
  },
  pastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusBadge: {
    fontSize: 12,
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalSubTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 8,
  },
  modalOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 6,
  },
  modalOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#eef6ff',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  timeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeChipText: {
    fontSize: 13,
    color: '#333',
  },
  timeChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  modalSaveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
