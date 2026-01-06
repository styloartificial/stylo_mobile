import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AuthFooterProps {
  type: 'register' | 'login' | 'terms-only';
  onActionPress?: () => void;
  termsText?: string;
  termsContext?: 'register-step1' | 'register-step2' | 'login' | 'default';
  showTerms?: boolean;
}

const AUTH_CONFIG = {
  register: {
    prompt: "Don't have an account?",
    action: "Register",
  },
  login: {
    prompt: "Already have an account?",
    action: "Login",
  },
};

const TERMS_CONFIG = {
  'register-step1': 'By creating an account, you agree to our Terms of Service and Privacy Policy',
  'register-step2': 'By completing registration, you agree to our Terms of Service and Privacy Policy',
  'login': 'By logging in, you agree to our Terms of Service and Privacy Policy',
  'default': 'By continuing, you agree to our Terms of Service and Privacy Policy',
};

export const AuthFooter: React.FC<AuthFooterProps> = ({ 
  type, 
  onActionPress,
  termsText,
  termsContext = 'default',
  showTerms = true,
}) => {
  const config = type !== 'terms-only' ? AUTH_CONFIG[type] : null;

  const finalTermsText = termsText || TERMS_CONFIG[termsContext];

  const renderActionSection = () => {
    if (!config) return null;

    return (
      <View className="items-center">
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500">
            {config.prompt}{' '}
          </Text>
          <TouchableOpacity 
            onPress={onActionPress}
            activeOpacity={0.7}
          >
            <Text className="text-sm font-semibold text-[#8F42DE]">
              {config.action}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {renderActionSection()}

      {showTerms && (
        <View className="mt-2 px-8">
          <Text className="w-full text-center text-xs text-gray-500 leading-5">
            {finalTermsText.split(/(Terms of Service|Privacy Policy)/).map((part, i) => {
              if (part === 'Terms of Service' || part === 'Privacy Policy') {
                return (
                  <Text key={i} className="font-medium">
                    {part}
                  </Text>
                );
              }
              return part;
            })}
          </Text>
        </View>
      )}
    </>
  );
};

export default AuthFooter;