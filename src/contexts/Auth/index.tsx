import {
  reauthenticateWithCredential,
  SignInMethod,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {auth} from '../../../firebase';
import {UserCredentials} from './Auth';

export interface AuthContext {
  user: User | null;
  signInState: {
    loadingSignIn: boolean;
    errorLoadingSignIn: boolean;
    signIn: (data: UserCredentials) => void;
  };
}

export const AuthContext = createContext({} as AuthContext);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [errorLoadingSignIn, setErrorLoadingSignIn] = useState(false);

  useEffect(() => {
    const unsubscriber = auth.onAuthStateChanged(setUser);
    return () => unsubscriber();
  }, []);

  const signIn = useCallback(async (data: UserCredentials) => {
    try {
      setLoadingSignIn(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
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
