import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, ScrollView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {setPlayers, setGames, setName, setRoomData, setRoom, setAdmin} from "../home/homeSlice";
import socket from "../socket.js";
import {Picker} from "@react-native-picker/picker";
import characters from "./character_info";

function Characters({setRoomData, setRoom, setPlayers, roomData, setAdmin,name, room, admin, players}) {
    const history = useNavigate(); 
    const [errors, setErrors] = useState("")
    const [char, setChar] = useState(null)
    const [user, setUser] = useState(name)
    const [update, setUpdate] = useState(1)
    
    useEffect(()=> { 

        socket.on("roomUpdate", (data) => { 
            setPlayers(data["userdata"])
            setRoomData(data["room"])
        })

        return () => {}

    }, [])

    function selectCharacter(character) { 

        socket.emit("characterUpdate", {name: user, character}, (data) => {
            
            if ("errors" in data) {
                alert(data["errors"])
            } else {
                setPlayers(data["userdata"])
            }
        })
    }

    const all = players.every(play => play["character"] != null )
    const player_names = players.map((play, index) => <Picker.Item key = {index} label = {play["name"]} value = {play["name"]}/>)

    const character_icons = characters.map((element, index) => {
        const charc = players.find(play => play["character"] == element["character_name"])
        
        const selected = char != null && char["character_name"] == element["character_name"]
        const me_selected = char != null && char["character_name"] == element["character_name"] && charc != null && charc["name"] == name
        return (
            <Pressable key = {index} style = {styles.icon} onPress = {() => setChar(element)}>
                <Image source = {{"uri": element["image"]}} style = {selected ? styles.selectedimage : styles.image}/>
                {charc != null && !me_selected && <Text style = {styles.playername}> {charc["name"]} </Text>}
                {charc == null && selected && !me_selected  && <Pressable style = {styles.selectBtn} onPress = {() => selectCharacter(element["character_name"])}><Text style = {styles.selectBtnText}> Select </Text></Pressable>}
                {me_selected  && <Pressable style = {styles.cancelBtn} onPress = {() => selectCharacter(null)}><Text style = {styles.selectBtnText}> Cancel </Text></Pressable>}
                
            </Pressable>)

    })



    return ( 
        <View style={styles.container}>
           <View style = {styles.center}>
                <Text style = {styles.title}> Select your Character </Text>
                <ScrollView style = {styles.scroll} contentContainerStyle= {styles.charcont}>
                    {character_icons}
                </ScrollView>
                <View style = {styles.middle}>
                {admin && <Picker
                    style = {styles.picker}
                    selectedValue = {user}
                    onValueChange = {(itemValue, itemIndex) => setUser(itemValue)}
                    > 
                    {player_names}
                    </Picker>}
                </View>
                <View style = {styles.characterinfo}>
                <View style = {styles.characterDesc}>
                    
                    
                    {char && 
                    <Text style = {styles.charname}> 
                        {char["character_name"]}
                        
                    </Text>}
                    {char && 
                    <Text style = {styles.charDescrip}> 
                    {char["character_descrip"]}
                    </Text>}
                    {all && admin && <Pressable><Text> Next </Text></Pressable>}
                    
                </View>
                </View>
           </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFE248",
      height: "100%",
      padding: "7%",
      paddingTop: "20%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start"
    },    
    center: {
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        textAlign: "center", 
        alignItems: "center", 
        justifyContent: "flex-start"
    },   
    title: {
        fontFamily: "Cotton",
        fontSize: 48,
        textAlign: "center"
    }, 
    scroll: {
        height: "60%",
        width: "100%",
        // borderColor: "black", 
        // borderStyle: "solid",
        // borderWidth: 2,
        marginBottom: 40, 
    },
    charcont: {
        display: "flex", 
        flexDirection: "row", 
        flexWrap: "wrap", 
        width: "100%",
        height: "100%",
        alignSelf: "center",
        justifyContent: "center",
        paddingBottom: 400
    },
    icon: {
        height: 100, 
        width: 100, 
        width: "30%", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "center"
    }, 
    selectBtn: {
        position: "absolute", 
        bottom: "40%", 
        zIndex: 1, 
        width: 100,
        alignItems: "center",
        backgroundColor: "rgba(255, 2555, 255, .9)", 
        borderRadius: 10, 
        borderColor: "black", 
        overflow: "hidden",
        borderWidth: 2, 
        borderStyle: "solid"
    }, 
    cancelBtn: {
        position: "absolute", 
        bottom: "40%", 
        zIndex: 1, 
        width: 100,
        alignItems: "center",
        backgroundColor: "rgba(241, 94, 94, .9)", 
        borderRadius: 10, 
        borderColor: "black", 
        overflow: "hidden",
        borderWidth: 2, 
        borderStyle: "solid"
    },
    selectBtnText: {
        fontFamily: "Cotton", 
        fontSize: 24

    }, 
    playername: {
        position: "absolute", 
        bottom: "40%", 
        zIndex: 1, 
        width: 100,
        alignItems: "center",
        backgroundColor: "rgba(63, 137, 249, .9)", 
        borderRadius: 10, 
        borderColor: "black", 
        borderWidth: 2, 
        overflow: "hidden",
        borderStyle: "solid", 
        textAlign: "center", 
        fontFamily: "Cotton", 
        fontSize: 24
    }, 
    selectedimage: {
        height: 80, 
        width: 80, 
        borderRadius: 100,
        alignItems: "center", 
        borderColor: "black", 
        borderWidth: 5
    },
    image: {
        height: 80, 
        width: 80, 
        borderRadius: 100
    },
    characterinfo: {
        display: "flex", 
        height: "30%",
        flexDirection: "row"
    }, 
    man: {
        flex: 3, 
        maxHeight: "10%", 
        overflow: "hidden"
    },
    characterDesc: {
        display: "flex", 
        flex: 3, 
        justifyContent: "space-evenly",
        flexDirection: "column",
        alignItems: "center"
    }, 
    charname :{
        fontFamily: "Cotton", 
        fontSize: 30
    }, 
    charDescrip: {
        fontFamily: "Cotton",
        fontSize: 24
    }, 
    picker: {
        height: "100%",
        width:400, 
        textAlign: "center",
        justifyContent: "center"
    }, 
    middle: {
        height: "10%",        
    }

  });

const mapStateToProps = (state) => {
return ({
    games: state.home.games, 
    name: state.home.name,
    room: state.home.room, 
    admin: state.home.admin,
    players: state.home.players, 
    roomData: state.home.roomData
})
}
const mapDispatchToProps = {setPlayers,setRoomData,setAdmin, setGames, setRoom, setName}

export default connect(mapStateToProps, mapDispatchToProps)(Characters);  