import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {User} from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {UserCredentials} from './Auth';

export interface AuthContext {
  user: FirebaseAuthTypes.User | null;
  signInState: {
    loadingSignIn: boolean;
    errorLoadingSignIn: boolean;
    signIn: (data: UserCredentials) => void;
  };
}

export const AuthContext = createContext({} as AuthContext);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [errorLoadingSignIn, setErrorLoadingSignIn] = useState(false);

  useEffect(() => {
    const unsubscriber = auth().onAuthStateChanged(user => setUser(user));
    return () => unsubscriber();
  }, []);

  const signIn = useCallback(async (data: UserCredentials) => {
    try {
      setLoadingSignIn(true);
      await auth().signInWithEmailAndPassword(data.email, data.password);
      setErrorLoadingSignIn(false);
    } catch (error) {
      setErrorLoadingSignIn(true);
    } finally {
      setLoadingSignIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInState: {
          signIn,
          errorLoadingSignIn,
          loadingSignIn,
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (Object.values(ctx).length === 0) {
    throw new Error('useAuth cannot be used outside of a AuthProvider');
  }
  return ctx;
};
