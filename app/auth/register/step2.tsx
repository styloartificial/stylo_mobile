import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import CustomTextInput from 'components/CustomTextInput';
import CustomRadioInput, { CustomRadioButtonType } from 'components/CustomRadioInput';
import CustomSelectInput, { CustomSelectInputType } from 'components/CustomSelectInput';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';

import authService from 'services/authService';
import storageHelper from 'helpers/storageHelper';

interface Step2Props {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  onBack: () => void;
}

type GenderType = 'female' | 'male';

export default function Step2({ formData, onBack }: Step2Props) {
  const router = useRouter();

  const [gender, setGender] = useState<GenderType>('female');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skinTone, setSkinTone] = useState<number | null>(null);
  const [skinToneOptions, setSkinToneOptions] = useState<CustomSelectInputType[]>([]);
  const [bodyShape, setBodyShape] = useState<number | null>(null);         // ✅ tambah
  const [bodyShapeOptions, setBodyShapeOptions] = useState<CustomSelectInputType[]>([]); // ✅ tambah

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkinTone, setIsLoadingSkinTone] = useState(true);
  const [isLoadingBodyShape, setIsLoadingBodyShape] = useState(true);      // ✅ tambah

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DANGER);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 5000);
  };

  const genderOptions: CustomRadioButtonType[] = [
    { key: 'female', value: 'Female' },
    { key: 'male', value: 'Male' },
  ];

  // Fetch skin tones
  useEffect(() => {
    const fetchSkinTones = async () => {
      try {
        setIsLoadingSkinTone(true);
        const response = await authService.getSkinTones();

        const options: CustomSelectInputType[] =
          response.data?.data?.map((item: any) => ({
            key: item.id,
            value: item.title,
            description: item.description,
          })) || [];

        setSkinToneOptions(options);
        if (options.length > 0) setSkinTone(options[0].key as number);
      } catch (error: any) {
        const errors = error.response?.data?.errors as Record<string, string[]> | undefined;
        const errorMessage = errors
          ? Object.values(errors)[0][0]
          : error.response?.data?.message || 'Failed to load skin tone options';
        showAlert(AlertType.DANGER, errorMessage);
      } finally {
        setIsLoadingSkinTone(false);
      }
    };

    fetchSkinTones();
  }, []);

  // ✅ Fetch body shapes
  useEffect(() => {
    const fetchBodyShapes = async () => {
      try {
        setIsLoadingBodyShape(true);
        const response = await authService.getBodyShapes();

        const options: CustomSelectInputType[] =
          response.data?.data?.map((item: any) => ({
            key: item.id,
            value: item.title,
            description: item.description,
          })) || [];

        setBodyShapeOptions(options);
        if (options.length > 0) setBodyShape(options[0].key as number);
      } catch (error: any) {
        const errors = error.response?.data?.errors as Record<string, string[]> | undefined;
        const errorMessage = errors
          ? Object.values(errors)[0][0]
          : error.response?.data?.message || 'Failed to load body shape options';
        showAlert(AlertType.DANGER, errorMessage);
      } finally {
        setIsLoadingBodyShape(false);
      }
    };

    fetchBodyShapes();
  }, []);

  const handleCompleteSignup = async () => {
    // ✅ tambah bodyShape ke validasi
    if (!dateOfBirth || !height || !weight || !skinTone || !bodyShape) {
      showAlert(AlertType.ALERT, 'Please complete all fields');
      return;
    }

    const heightInt = parseInt(height);
    const weightInt = parseInt(weight);

    if (isNaN(heightInt) || heightInt <= 0) {
      showAlert(AlertType.ALERT, 'Please enter a valid height');
      return;
    }

    if (isNaN(weightInt) || weightInt <= 0) {
      showAlert(AlertType.ALERT, 'Please enter a valid weight');
      return;
    }

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const genderMap: Record<GenderType, string> = {
        female: 'FEMALE',
        male: 'MALE',
      };

      const registrationData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password,
        gender: genderMap[gender],
        date_of_birth: dateOfBirth,
        height: heightInt,
        weight: weightInt,
        skin_tone_id: skinTone,
        body_shape_id: bodyShape, // ✅ tambah
      };

      const response = await authService.register(registrationData);

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;
      const message = response.data?.message;

      if (token) await storageHelper.setItem('login_token', token);
      if (user) await storageHelper.setItem('user_data', JSON.stringify(user));

      if (message && message !== 'Success') {
        showAlert(AlertType.SUCCESS, message);
      }

      router.replace('/dashboard/home');

    } catch (error: any) {
      const errors = error.response?.data?.errors as Record<string, string[]> | undefined;
      const errorMessage = errors
        ? Object.values(errors)[0][0]
        : error.response?.data?.message || 'Registration failed';
      showAlert(AlertType.DANGER, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            Your fit profile
          </Text>
          <Text className="text-sm text-gray-500">
            Helps Stylo match you with better outfits.
          </Text>
        </View>

        {alertVisible && <CustomAlert type={alertType} message={alertMessage} />}

        <CustomRadioInput
          label="Gender"
          items={genderOptions}
          value={gender}
          onValueChange={(key) => setGender(key as GenderType)}
        />

        <CustomTextInput
          label="Date of Birth"
          placeholder="Select your date of birth"
          icon="calendar-outline"
          isDate
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <CustomTextInput
              label="Height"
              placeholder="170 cm"
              icon="resize-outline"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <CustomTextInput
              label="Weight"
              placeholder="60 kg"
              icon="fitness-outline"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        <CustomSelectInput
          label="Skin tone"
          icon="color-palette-outline"
          items={skinToneOptions}
          placeholder={isLoadingSkinTone ? 'Loading...' : 'Select your closest match'}
          value={skinTone}
          onValueChange={(item) => setSkinTone(item.key as number)}
        />

        {/* ✅ tambah body shape */}
        <CustomSelectInput
          label="Body shape"
          icon="body-outline"
          items={bodyShapeOptions}
          placeholder={isLoadingBodyShape ? 'Loading...' : 'Select your body shape'}
          value={bodyShape}
          onValueChange={(item) => setBodyShape(item.key as number)}
        />

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <AuthButton
              title="Back"
              color="secondary"
              icon="arrow-back-outline"
              onPress={onBack}
              disabled={isLoading}
            />
          </View>
          <View className="flex-1">
            <AuthButton
              title={isLoading ? 'Signing up...' : 'Sign up'}
              color="primary"
              icon="checkmark-outline"
              onPress={handleCompleteSignup}
              disabled={isLoading || isLoadingSkinTone || isLoadingBodyShape}
            />
          </View>
        </View>
      </View>

      <Text className="text-xs leading-5 text-gray-500 text-center">
        You can update these details anytime in your profile settings.
      </Text>
    </>
  );
}