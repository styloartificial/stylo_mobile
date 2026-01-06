import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomTextInput from 'components/CustomTextInput';
import CustomRadioInput, { CustomRadioButtonType } from 'components/CustomRadioInput';
import CustomSelectInput, { CustomSelectInputType } from 'components/CustomSelectInput';
import CustomAlert, { AlertType } from 'components/CustomAlert';
import AuthButton from 'components/AuthButton';
import authService from 'services/authService';
import { useRouter } from 'expo-router';
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

const skinToneOptions: CustomSelectInputType[] = [
  { key: 1, value: 'Very Fair' },      
  { key: 2, value: 'Fair' },
  { key: 3, value: 'Light' },
  { key: 4, value: 'Medium' },
  { key: 5, value: 'Olive' },
  { key: 6, value: 'Tan' },
  { key: 7, value: 'Brown' },
  { key: 8, value: 'Dark Brown' },
  { key: 9, value: 'Deep' },
];

export default function Step2({ formData, onBack }: Step2Props) {
  const router = useRouter();

  const [gender, setGender] = useState<GenderType>('female');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skinTone, setSkinTone] = useState<number>(skinToneOptions[0].key as number);
  
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.DANGER);
  const [alertMessage, setAlertMessage] = useState('');

  const genderOptions: CustomRadioButtonType[] = [
    { key: 'female', value: 'Female' },
    { key: 'male', value: 'Male' },
  ];

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const handleCompleteSignup = async () => {
    console.log('=== FORM VALIDATION START ===');
    console.log('Current state:', {
      gender,
      dateOfBirth,
      height,
      weight,
      skinTone
    });

    // Validasi per field
    if (!dateOfBirth.trim()) {
      showAlert(AlertType.ALERT, 'Please enter your date of birth');
      return;
    }

    if (!height.trim()) {
      showAlert(AlertType.ALERT, 'Please enter your height');
      return;
    }

    if (!weight.trim()) {
      showAlert(AlertType.ALERT, 'Please enter your weight');
      return;
    }

    // Validasi format tanggal DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateOfBirth)) {
      showAlert(AlertType.ALERT, 'Date format must be DD/MM/YYYY (e.g., 28/09/2004)');
      return;
    }

    // Validasi tanggal valid
    const [day, month, year] = dateOfBirth.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getFullYear() !== year
    ) {
      showAlert(AlertType.ALERT, 'Please enter a valid date');
      return;
    }

    // Cek tanggal tidak di masa depan
    if (dateObj > new Date()) {
      showAlert(AlertType.ALERT, 'Date of birth cannot be in the future');
      return;
    }

    // Validasi height dan weight
    const heightInt = parseInt(height);
    const weightInt = parseInt(weight);
    
    if (isNaN(heightInt) || heightInt <= 0) {
      showAlert(AlertType.ALERT, 'Please enter a valid height (e.g., 170)');
      return;
    }
    
    if (isNaN(weightInt) || weightInt <= 0) {
      showAlert(AlertType.ALERT, 'Please enter a valid weight (e.g., 60)');
      return;
    }


    if (!gender || !skinTone) {
      showAlert(AlertType.ALERT, 'Please complete all fields');
      return;
    }

    console.log('=== VALIDATION PASSED ===');

    setIsLoading(true);
    setAlertVisible(false);

    try {
      const [day, month, year] = dateOfBirth.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const genderMap: Record<GenderType, string> = {
        'female': 'FEMALE',
        'male': 'MALE',
      };

      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password, 
        gender: genderMap[gender], 
        date_of_birth: formattedDate, 
        height: heightInt,
        weight: weightInt,
        skin_tone_id: skinTone, 
      };

      console.log('📤 Sending registration data:', registrationData);

      const response = await authService.register(registrationData);

      if (response.status === 200 || response.status === 201) {
        await storageHelper.setItem('login_token', response.data.data.token);
        await storageHelper.setItem('user_data', JSON.stringify(response.data.data.user));

        showAlert(AlertType.SUCCESS, 'Registration successful!');

        setTimeout(() => {
          router.replace('/dashboard/home');
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const fieldName = field.replace(/_/g, ' ');
              return `${fieldName}: ${(messages as string[]).join(', ')}`;
            })
            .join('\n');
          
          errorMessage = errorMessages;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
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

        {alertVisible && (
          <CustomAlert type={alertType} message={alertMessage} />
        )}

        <CustomRadioInput
          label="Gender"
          items={genderOptions}
          value={gender}
          onValueChange={(key) => {
            console.log('✅ Gender selected:', key);
            setGender(key as GenderType);
          }}
        />

        <CustomTextInput
          label="Date of birth"
          placeholder="DD / MM / YYYY"
          icon="calendar-outline"
          containerClassName="mb-2"
          value={dateOfBirth}
          onChangeText={(text) => {
            setDateOfBirth(text);
          }}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <CustomTextInput
              label="Height"
              placeholder="170 cm"
              icon="resize-outline"
              value={height}
              onChangeText={(text) => {
                setHeight(text);
              }}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <CustomTextInput
              label="Weight"
              placeholder="60 kg"
              icon="fitness-outline"
              value={weight}
              onChangeText={(text) => {
                setWeight(text);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <CustomSelectInput
          label="Skin tone"
          icon="color-palette-outline"
          items={skinToneOptions}
          placeholder="Select your closest match"
          value={skinTone}
          onValueChange={(item) => {
            setSkinTone(item.key as number);
          }}
        />

        <View className="flex-row gap-3 mb-4 mt-2">
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
              title={isLoading ? "Signing up..." : "sign up"}
              color="primary"
              icon="checkmark-outline"
              onPress={handleCompleteSignup}
              disabled={isLoading}
            />
          </View>
        </View>
        
      </View>

      <View>
        <Text className="text-xs leading-5 text-gray-500 text-center">
          You can update these details anytime in your profile settings.
        </Text>
      </View>
    </>       
  );
}