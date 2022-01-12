import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {setPlayers, setRoomData, setRoom, setAdmin, setSocket} from "../home/homeSlice";
import socket from "../socket.js";

function Create({setRoomData, setRoom, setPlayers, setSocket, setAdmin,name}) {
    const history = useNavigate(); 
    const [lite, setLite] = useState(false)
    

    function createRoom() {
        const roomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const room =roomName.slice(0, 7)
        setRoom(room); 
        socket.emit("create", {namer: name, room: room.toLowerCase(), lite: lite}, (data) => {
            if ("errors" in data) {
                setErrors(data["errors"])
            } else {
                setAdmin(true)
                setPlayers(data["userdata"])
                setRoomData(data["room"])
                if ("socketid" in data) {
                    setSocket(data["socketid"])
                }
                history("/lobby")
            }
        })
    }

    return ( 
        <View style={styles.container}>
           <View style = {styles.center}>
               <Text style = {styles.title}> Choose your game mode  </Text>
               <Text style = {styles.title2}> (This will affect the types of playable minigames)</Text>
           <View style = {lite ? styles.selected : styles.normal} onTouchStart = {() => setLite(true)}>
               <Image source = {require("../photos/tmp_image.png")}  style = {styles.image}/>
               <Text style = {styles.mode}> Lite </Text>
                <Text style = {styles.descrip}> Users can join the room but will only be able to view the prompts instead of being able to play </Text>
           </View>
           <View style = {lite ? styles.normal : styles.selected} onTouchStart = {() => setLite(false)}>
           <Image source = {require("../photos/tmp_image.png")}  style = {styles.image}/>
           <Text style = {styles.mode}> Classic </Text>
           <Text style = {styles.descrip}> Users will play usnig their phones as controllers</Text>
           </View>
           
           <Pressable style = {styles.Button} onPress = {() => createRoom()}>
               <Text style = {styles.ButtonText}> Next </Text>
           </Pressable>
           </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFE248",
      height: "100%",
      padding: "10%",
      paddingTop: "30%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start"
    },    
    center: {
        display: "flex",
        width: "100%",
        flex: 1,
        paddingBottom: "15%",
        flexDirection: "column",
        textAlign: "center", 
        alignItems: "center", 
        justifyContent: "flex-start"
    },
    title: {
        fontFamily: "Cotton",
        fontSize: 36, 
        flex: 1, 
    }, 
    title2: {
        fontFamily: "Cotton",
        fontSize: 16, 
        flex: 1
    }, 
    selected: {
        flex: 3, 
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-around", 
        width: "70%", 
        backgroundColor: "rgba(255,255,255, .7)",
        padding: "2%", 
        marginBottom: "10%"
    }, 
    normal: {
        flex: 3,
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-around", 
        width: "70%", 
        padding: "2%", 
        marginBottom: "10%"

    }, 
    image: {
        alignSelf: "center", 
        height: 120, 
        width: 120, 
        marginBottom: 10
    },
    mode: {
        alignSelf: "center", 
        fontFamily: "Cotton", 
        fontSize: 24
        
    },
    descrip: {
        alignSelf: "center", 
        textAlign: "center", 
        fontFamily: "Cotton", 
        fontSize: 18
    }, 
    Button: {
        borderColor: "black", 
        borderWidth: 2,
        padding: "2%",
        borderRadius: 15,
        textAlign: "center",
        backgroundColor: "#3F89F9", 
        color: "white",
        borderStyle: "solid",
        display: "flex", 
        flexDirection: "row",
        justifyContent: "center"
    },
    ButtonText: {
        color: "white", 
        fontSize: 25,
        fontFamily: "Cotton"
    }, 
   


  });

const mapStateToProps = (state) => {
return ({
    games: state.home.games, 
    name: state.home.name,
    room: state.home.room, 
    players: state.home.players, 
    roomData: state.home.roomData
})
}

const mapDispatchToProps = {setPlayers,setRoomData,setAdmin, setSocket, setRoom}

export default connect(mapStateToProps, mapDispatchToProps)(Create);  