import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'tailwind-rn'
import { StyleSheet } from 'react-native';
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { db } from '../firebase';

const ChatRow = ({matchDetails}) => {

    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo,setMatchedUserInfo] = useState(null);
    const[lastmessage, setLastMessage] = useState('');

    useEffect(()=>{
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.user,user.uid))
    },[matchDetails,user])

    useEffect(()=> onSnapshot(
        query(
            collection(db,'matches',matchDetails.id,'messages'),orderBy('timestamp','desc')
            ),snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
        ),[matchDetails,db])

    // console.log(matchedUserInfo)

    return (
        <TouchableOpacity style={[tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"),
         styles.cardShadow]}
         onPress={() => navigation.navigate("Message",{
             matchDetails,
         })}
         >
            <Image 
                style={tw("rounded-full h-16 w-16 mr-4")}
                source={{ uri:matchedUserInfo?.photoURL }}
            />
            <View>
                <Text style={tw("text-lg font-semibold")} >
                    {matchedUserInfo?.displayName}
                </Text>
                <Text>{lastmessage || 'Say Hi'}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow;

const styles = StyleSheet.create({
    cardShadow:{
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:1,
        },
        shadowOpacity:0.2,
        shadowRadius:1.41,

        elevation:2,
    }
})
