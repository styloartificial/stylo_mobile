import React, { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthHeader from 'components/AuthHeader';
import AuthTitle from 'components/AuthTitle';

interface AuthScreenProps {
  headerDescription: string;
  titleTitle: string;
  titleDescription: string;
  children: ReactNode;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  headerDescription,
  titleTitle,
  titleDescription,
  children,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <AuthHeader description={headerDescription} />
        <AuthTitle title={titleTitle} description={titleDescription} />
        
        <View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthScreen;