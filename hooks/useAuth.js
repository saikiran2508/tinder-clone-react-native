import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { View, Text } from 'react-native';
import * as Google from 'expo-google-app-auth'
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from '@firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({})

 

const config = {
    androidClientId:'91581362147-a0033uci2j5oh5ag58p9nmt3q8pot5c6.apps.googleusercontent.com',
    iosClientId:'91581362147-btnbd1r4h6ujuh8ch3tulv3vlup76ffa.apps.googleusercontent.com',
    scopes:["profile","email"],
    permissions:["public_profile","email","gender","location"],
}

export const AuthProvider = ({ children }) => {

    const [error,setError] = useState(null);
    const [user,setUser] = useState(null);
    const [loadingInitial,setLodingInitil] = useState(true)
    const [loading,setLoding] = useState(false)

    useEffect(()=>
        onAuthStateChanged(auth, (user)=>{
            if(user){
                // Logged In
                setUser(user)
            }
            else{
                setUser(null)
            }
            setLodingInitil(false)
        }),
    [])

    const logout = () =>{
        setLoding(true);
        signOut(auth)
        .catch((error)=>setError(error))
        .finally(()=>setLoding(false))
    }

    const signInWithGoogle = async() => {
        setLoding(true);
        await Google.logInAsync(config).then(async (LogInResult)=>{
            if(LogInResult.type === "success"){
                const { idToken, accessToken} = LogInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken); 
                await signInWithCredential(auth,credential);
            }
            return Promise.reject();
        }).catch(error => setError(error))
        .finally(()=>setLoding(false));
    }

    const memoedValue = useMemo(()=>({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
    }),[user, loading, error])

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    ) 
};

export default function useAuth() {
    return useContext(AuthContext)
}

