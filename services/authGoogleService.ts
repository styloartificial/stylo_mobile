import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { decode as base64Decode } from 'base-64';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();

    await GoogleSignin.signIn();

    const { idToken, accessToken } = await GoogleSignin.getTokens();

    if (!idToken) {
      throw new Error('Google idToken is null');
    }

    // Decode JWT safely
    const payload = JSON.parse(
      base64Decode(idToken.split('.')[1])
    );

    const login_id = payload.sub;

    console.log('LOGIN ID:', login_id);

    return {
      provider: 'google',
      login_id,
      accessToken,
      idToken,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled');
      return null;
    }

    console.error('Google Sign-In Error:', error);
    throw error;
  }
}
