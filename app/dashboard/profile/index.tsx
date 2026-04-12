import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT_COLOR = '#8b5cf6';
const ACCENT_COLOR_MUTED = '#ddd6fe';

interface ProfileItemProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isLocked?: boolean;
  skinColor?: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  onChangeText,
  isLocked,
  skinColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-4">
      <Text className="text-base text-gray-400">{label}</Text>
      <View className="ml-4 flex-1 flex-row items-center justify-end">
        {skinColor && (
          <View style={{ backgroundColor: skinColor }} className="mr-2 h-4 w-4 rounded-full" />
        )}
        {isEditing ? (
          <TextInput
            className="min-w-[100px] border-b border-violet-300 text-right text-base font-medium text-gray-800"
            value={value}
            onChangeText={onChangeText}
            autoFocus
            onBlur={() => setIsEditing(false)}
            onSubmitEditing={() => setIsEditing(false)}
          />
        ) : (
          <Text className="mr-2 text-base font-medium text-gray-800">{value}</Text>
        )}
        <TouchableOpacity disabled={isLocked} onPress={() => setIsEditing(true)}>
          <Ionicons
            name={isLocked ? 'lock-closed-outline' : 'pencil-outline'}
            size={18}
            color={isLocked ? '#9ca3af' : ACCENT_COLOR}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Photo Picker Modal ───────────────────────────────────────────────────────

interface PhotoPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onPick: (useCamera: boolean) => void;
}

const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({ visible, onClose, onPick }) => {
  const insets = useSafeAreaInsets();

  // Animasi terpisah: fade untuk overlay, slide untuk sheet
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      // Masuk: overlay fade in + sheet slide up secara bersamaan
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Keluar: overlay fade out + sheet slide down secara bersamaan
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideY, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* Overlay: hanya animasi fade */}
      <Animated.View style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Sheet: slide up, duduk tepat di atas 3-Button Navigation */}
      <Animated.View
        style={{
          transform: [{ translateY: slideY }],
          // paddingBottom menyesuaikan tinggi 3-Button Navigation (gesture bar / nav bar)
          // insets.bottom = 0 pada gesture navigation, atau tinggi nav bar pada 3-button
          paddingBottom: insets.bottom,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className="rounded-t-3xl bg-white">
        {/* Drag handle */}
        <View className="mb-2 mt-3 h-1 w-10 self-center rounded-full bg-gray-200" />

        <Text className="mb-6 mt-2 text-center text-xl font-bold text-gray-900">
          Change Profile Photo
        </Text>

        <View className="mb-8 flex-row justify-around px-6">
          {/* Gallery */}
          <TouchableOpacity onPress={() => onPick(false)} className="items-center">
            <View className="mb-2 rounded-full bg-violet-100 p-4">
              <Ionicons name="images" size={30} color={ACCENT_COLOR} />
            </View>
            <Text className="font-medium text-gray-700">Gallery</Text>
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity onPress={() => onPick(true)} className="items-center">
            <View className="mb-2 rounded-full bg-violet-100 p-4">
              <Ionicons name="camera" size={30} color={ACCENT_COLOR} />
            </View>
            <Text className="font-medium text-gray-700">Camera</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

// ─── Profile Screen ───────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [showModal, setShowModal] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Jessica Doe',
    email: 'jessica.doe@example.com',
    gender: 'Female',
    height: '168 cm',
    weight: '58 kg',
    skinTone: 'Medium Light',
  });

  const pickImage = async (useCamera: boolean) => {
    setShowModal(false);
    let result;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Akses ditolak');
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View className="items-center pb-6 pt-8">
          <View className="relative">
            <View className="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 bg-white p-0.5 shadow-lg">
              <Image
                source={{ uri: profileImage }}
                className="h-full w-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="absolute bottom-0 right-0 rounded-full border-4 border-white p-2.5"
              style={{ backgroundColor: ACCENT_COLOR }}>
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-4 text-2xl font-bold text-gray-900">{userData.name}</Text>
        </View>

        {/* User Info */}
        <View className="mb-6 rounded-3xl border border-gray-100 bg-white px-5 shadow-sm">
          <ProfileItem
            label="Name"
            value={userData.name}
            onChangeText={(t) => setUserData({ ...userData, name: t })}
          />
          <ProfileItem
            label="Email"
            value={userData.email}
            onChangeText={() => {}}
            isLocked={true}
          />
          <ProfileItem
            label="Gender"
            value={userData.gender}
            onChangeText={(t) => setUserData({ ...userData, gender: t })}
          />
          <ProfileItem
            label="Height"
            value={userData.height}
            onChangeText={(t) => setUserData({ ...userData, height: t })}
          />
          <ProfileItem
            label="Weight"
            value={userData.weight}
            onChangeText={(t) => setUserData({ ...userData, weight: t })}
          />
          <ProfileItem
            label="Skin Tone"
            value={userData.skinTone}
            onChangeText={(t) => setUserData({ ...userData, skinTone: t })}
            skinColor="#eacda3"
          />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900">Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity className="mb-10 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Text className="text-lg font-semibold" style={{ color: ACCENT_COLOR_MUTED }}>
            Log Out
          </Text>
          <Ionicons name="log-out-outline" size={22} color={ACCENT_COLOR_MUTED} />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Upload Foto */}
      <PhotoPickerModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onPick={pickImage}
      />
    </SafeAreaView>
  );
}
