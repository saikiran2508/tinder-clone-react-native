import { useNavigation } from '@react-navigation/core'
import { UserInterfaceIdiom } from 'expo-constants';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from '@firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const DUMMY_DATA = [
    {
        FirstName:"Sai",
        LastName:"Kiran",
        job:"SDE",
        photoURL:"https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        age:20,
        id:1,
    },
    {
        FirstName:"Sai2",
        LastName:"kiran2",
        job:"SDE2",
        photoURL:"https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        age:21,
        id:2,
    },
    {
        FirstName:"Sai3",
        LastName:"Kiran3",
        job:"SDE3",
        photoURL:"https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        age:22,
        id:3,
    },
]

const HomeScreen = () => {

    const navigation = useNavigation();
    const { user,logout } = useAuth()
    const swipRef = useRef();
    const [profiles,setProfiles] = useState([]);

    useLayoutEffect(()=>
        onSnapshot(doc(db,'users',user.uid),snapshot=>{
            if(!snapshot.exists()){
                navigation.navigate("Modal")
            }
        })
    ,[])

    useEffect(()=>{
        let unsub;

        const fetchCards = async () => {

            const passes = await getDocs(collection(db,'users',user.uid,'passes')).then(
                (snapshot) => snapshot.docs.map((doc)=>doc.id)
            );

            const swipes = await getDocs(collection(db,'users',user.uid,'swipes')).then(
                (snapshot) => snapshot.docs.map((doc)=>doc.id)
            );

            const passesUserIds = passes.length > 0 ? passes : ["test"];
            const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

            console.log([...passesUserIds,...swipedUserIds])

            unsub = onSnapshot(query(collection(db,'users'),
            where('id','not-in',[...passesUserIds,...swipedUserIds]))
            ,(snapshot)=>{
                setProfiles(snapshot.docs.filter((doc)=>doc.id !== user.uid).map((doc) => ({
                    id:doc.id,
                    ...doc.data(),
                })))
            })
        }

        fetchCards();
        return unsub;
    },[db])

    const swipeLeft =  (cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex]
        console.log(`You swiped PASS on ${userSwiped.displayName}`)

        setDoc(doc(db,'users',user.uid,'passes',userSwiped.id),userSwiped);
          
    }

    const swipeRight = async (cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex]
        const loggedInProfile = await (await getDoc(doc(db,'users',user.uid))).data(); 

        getDoc(doc(db,'users',userSwiped.id,'swipes',user.uid)).then(
            (documentSnapshot) =>{
                if(documentSnapshot.exists()){
                    console.log(`Hooray you matched with ${userSwiped.displayName}`)
                    setDoc(doc(db,'users',user.uid,'swipes',userSwiped.id),userSwiped)

                    setDoc(doc(db,'matches',generateId(user.uid,userSwiped.id)),{
                        user: {
                            [user.uid] : loggedInProfile,
                            [userSwiped.id]: userSwiped
                        },
                        usersMatched:[user.uid,userSwiped.id],
                        timestamp:serverTimestamp(),
                    });
                    navigation.navigate('Match',{
                        loggedInProfile,
                        userSwiped,
                    })
                }
                else{
                    console.log(
                        `you swiped on ${userSwiped.displayName}`
                    );
                    setDoc(
                        doc(db,'users',user.uid,'swipes',userSwiped.id),
                        userSwiped
                    )
                }
            }
        )
    }

    return (
        <SafeAreaView style={tw("flex-1")} >
            {/* Header */}
                <View style={tw('flex-row justify-between items-center just relative px-5 top-3')} >
                    <TouchableOpacity onPress={logout} >
                        <Image style={tw("h-10 w-10 rounded-full")} source={{ uri: user.photoURL}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> navigation.navigate('Modal')} >
                        <Image style={tw('h-10 w-10')} source={require('../logo.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Chat')} >
                        <Ionicons name='chatbubbles-sharp' size={40} color="#FF5864" />
                    </TouchableOpacity>
                </View>


            {/* End of header */}

            {/* Cards */}
            <View style={tw("flex-1 -mt-6")} >
                <Swiper cards={profiles} 
                    ref = {swipRef}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex)=>{
                        console.log('Swip Pass')
                        swipeLeft(cardIndex)
                    }}
                    onSwipedRight={(cardIndex)=>{
                        console.log('Swip Match')
                        swipeRight(cardIndex)
                    }}
                    backgroundColor={"#4FD0E9"}
                    overlayLabels={{
                        left:{
                            title:"NOPE",
                            style:{
                                label:{
                                    textAlign:"right",
                                    color:"red",
                                }
                            }
                        },
                        right:{
                            title:"MATCH",
                            style:{
                                label:{
                                    // textAlign:"right",
                                    color:"#4DED30",
                                }
                            }
                        },
                    }}
                    containerStyle={{ backgroundColor:"transparent"}}
                    renderCard={(card)=> card ? (
                        <View key={card.id} style={tw("relative bg-white h-3/4 rounded-xl")} >
                            <Image style={tw("absolute top-0 h-full w-full rounded-xl")} source={{uri:card.photoURL}} />
                            <View 
                                style={[tw("absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"),styles.cardShodow]} 
                            >
                                <View>
                                    <Text style={tw("text-2xl font-bold")} >
                                        {card.displayName}
                                    </Text>
                                    <Text>
                                        {card.job}
                                    </Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")} >{card.age}</Text>
                            </View>
                        </View>
                    ):(
                        <View
                            style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"),
                            styles.cardShodow,]}
                        >
                            <Text style={tw("font-bold pb-5")} >No more Profiles</Text>
                            <Image 
                                style={tw("h-20 w-full")}
                                resizeMode='contain'
                                height={100} 
                                width={100}
                                source={{uri:"https://links.papareact.com/6gb"}}
                            />
                        </View>
                    )} 
                />
            </View>

            <View style={tw("flex-row justify-evenly")} >
                <TouchableOpacity
                    onPress={()=>swipRef.current.swipeLeft()}
                    style={tw("items-center justify-center rounded-full bottom-20 w-16 h-16 bg-red-200")} 
                >

                    <Entypo name='cross' size={24} color='red' />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>swipRef.current.swipeRight()}
                    style={tw("items-center justify-center rounded-full bottom-20 w-16 h-16 bg-green-200")} 
                >
                    <AntDesign name='heart' size={24} color='green' />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    cardShodow:{
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:1.
        },
        shadowOpacity:0.2,
        shadowRadius:1.41,
        elevation:2,
    },
})
