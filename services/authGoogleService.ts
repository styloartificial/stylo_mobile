import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export function authGoogleService() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'stylo',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID!,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'id_token',
    redirectUri,
  });

  const signInWithGoogle = async (): Promise<{ idToken: string } | null> => {
    const result = await promptAsync();

    if (result.type !== 'success') {
      return null;
    }

    const idToken = result.params?.id_token;
    if (!idToken) return null;

    return { idToken };
  };

  return {
    signInWithGoogle,
    ready: !!request,
  };
}
