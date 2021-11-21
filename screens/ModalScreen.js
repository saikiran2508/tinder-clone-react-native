import { doc, serverTimestamp, setDoc } from '@firebase/firestore'
import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import tw from 'tailwind-rn'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'

const ModalScreen = () => {

    const { user } = useAuth()
    const navigation = useNavigation();
    const [image,setImage] = useState(null);
    const [job,setJob] = useState(null);
    const [age,setAge] = useState(null);

    const incompleteForm = !image || !age || !job;

    const updateUserProfile = () => {
        setDoc(doc(db,'users',user.uid),{
            id:user.uid,
            displayName:user.displayName,
            photoURL:image,
            job:job,
            age:age,
            timestamp:serverTimestamp(),
        }).then(()=>{
            navigation.navigate('Home')
        })
        .catch(error =>{
            alert(error.message)
        })
    }

    return (
        <View style={tw("flex-1 items-center pt-1 mt-5")} >
            <Image 
                style={tw("h-20 w-full")}
                resizeMode='contain'
                source={{uri:"https://links.papareact.com/2pf"}}
            />
            <Text style={tw("text-xl text-gray-500 p-2 font-bold")} >
                Welcome {user.displayName}
            </Text>
            <Text style={tw("text-center p-4 font-bold text-red-400")} >
                Step 1: The Profile Pic
            </Text>
            <TextInput style={tw("text-center text-xl pb-2")}
             value={image}
             onChangeText={text=>setImage(text)}
             placeholder="Enter a Profile Pic URL" />
             <Text style={tw("text-center p-4 font-bold text-red-400")} >
                Step 2: The Job
            </Text>
            <TextInput style={tw("text-center text-xl pb-2")}
            value={job}
            onChangeText={text=>setJob(text)}
             placeholder="Enter your Job" />
             <Text style={tw("text-center p-4 font-bold text-red-400")} >
                Step 3: The Age
            </Text>
            <TextInput style={tw("text-center text-xl pb-2")}
            value={age}
            onChangeText={text=>setAge(text)}
            maxLength={2}
            keyboardType='numeric'
             placeholder="Enter your Age" />

             <TouchableOpacity 
                disabled={incompleteForm}
                onPress={updateUserProfile}
                style={[tw("w-64 p-3 rounded-xl absolute bottom-10 "),
                    incompleteForm ? tw("bg-gray-400") : tw("bg-red-400")]} >
                 <Text style={tw("text-center text-white text-xl")} >
                     Update Profile
                 </Text>
             </TouchableOpacity>
        </View>
    )
}

export default ModalScreen
