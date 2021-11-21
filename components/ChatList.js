import { collection, onSnapshot, query, where } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import tw from "tailwind-rn"
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import ChatRow from './ChatRow';

const ChatList = () => {

    const [matches, setMatches] = useState();
    const { user } = useAuth();

    useEffect(()=>
        onSnapshot(query(collection(db,'matches'),where('usersMatched','array-contains',user.uid)),
        snapshot => setMatches(snapshot.docs.map((doc) => ({
            id:doc.id,
            ...doc.data(),
        })))),
    [user]);

    // console.log(matches)

    return  ( 
        <FlatList 
            style={tw("h-full")}
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ChatRow matchDetails={item}/>}
        /> 
    ) 
};

export default ChatList
