import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Google from "expo-google-app-auth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext({
  // initial state...

});

const config = {
  androidClientId: '94634534771-qthghbu1dc41c45rcsbvouae4755d94d.apps.googleusercontent.com',
  iosClientId: '94634534771-qjtr8nfe8lckhh853fulfq6sauptj974.apps.googleusercontent.com',
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"]
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() =>
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        //Logged in...
        const docSnap = await getDoc(doc(db, 'users', user.uid))
          .catch(error => alert(error.message))
        setUser({ ...user, displayName: docSnap.data()?.displayName, photoURL: docSnap.data()?.photoURL, role: docSnap.data()?.role });
      } else {
        setUser(null);
      }

      setLoadingInitial(false);
    }
    ), []);

  const logout = async () => {
    setLoading(true);

    signOut(auth).catch((error) => setError(error)).finally(() => setLoading(false));
  }

  const signInWithGoogle = async () => {
    setLoading(true);

    await Google.logInAsync(config).then(async (logInResult) => {
      if (logInResult.type === 'success') {
        // login...
        const { idToken, accessToken } = logInResult;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        await signInWithCredential(auth, credential);
      }

      return Promise.reject();
    })
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }

  const updateProfile = (displayName, role, photoURL) => {

    setUser({ ...user, displayName, photoURL, role })
  }

  const memoedValue = useMemo(() => ({
    user,
    loading,
    error,
    logout,
    signInWithGoogle,
    updateProfile
  }), [user, loading, error])

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>

  )
}

export default function useAuth() {
  return useContext(AuthContext);
}