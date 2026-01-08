import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!, 
  offlineAccess: false, 
});

export async function signInWithGoogle(): Promise<{ idToken: string } | null> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) return null;

    return { idToken };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled login');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play Services not available');
    } else {
      console.error('Google Sign In error:', error);
    }
    return null;
  }
}
