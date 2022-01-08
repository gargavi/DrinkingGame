import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {setPlayers, setGames, setName, setRoomData, setRoom} from "../home/homeSlice";
import socket from "../socket.js";

function Lobby({setRoomData, setPlayers, roomData, name, room, players}) {
    const history = useNavigate(); 
    const [shown, setShown] = useState(false)
    const [errors, setErrors] = useState("")
    
    useEffect(()=> { 

        socket.on("roomUpdate", (data) => { 
            setPlayers(data["userdata"])
            setRoomData(data["room"])
        })

    }, [])
  

    console.log(roomData)
    const player_names = players.map((player, index) => {

        if (player["name"]==name) {
            return (
                <Text key = {index} style = {styles.userName}> {player["name"]}</Text>
            )
        } else {
            return (
                <Text key = {index} style = {styles.name}> {player["name"]}</Text>
            )
        }
    })

    return ( 
        <View style={styles.container}>
            {shown && <View style = {styles.dialogue}>
            <View style = {styles.diagmini}>
                <Text style = {styles.gametitle}> Game Setting </Text>
                <View style = {styles.drinklimit}>
                <Image source = {require("../photos/drink.png")}  style = {styles.drink}/>
                    <View style = {styles.drinkinfo}>
                        <Text style = {styles.gamelabel}> Drink Limit </Text>
                        <Text style = {styles.number}> {roomData["limit"]} sips </Text>
                    </View>
                </View> 
                <View style = {styles.row}>
                    <Text style = {styles.gamelabel}> Cheese Touch </Text>
                    <Text style = {styles.toggle}> {roomData["cheese_touch"] ? "On": "Off" } </Text>
                </View> 
                <View style = {styles.row}>
                    <Text  style = {styles.gamelabel}> Game Mode </Text>
                    <Text style = {styles.toggle}> {roomData["controller"] ? "Controller": "Spectator" } </Text>
                </View> 
            </View>
            <View style = {styles.minigame}>
                    <Text  style = {styles.gamelabel}> MiniGames </Text>
                    <Text style = {styles.toggle}> Minigames </Text>
                </View> 
    

            </View>}
            <KeyboardAvoidingView
             style = {styles.center}
                behavior="position" 
           >
            <Text style = {styles.title}> Room Code </Text>
            <Text style = {styles.room}> {room} </Text>
            <Text style = {styles.waiting}> Waiting for the Host </Text>
            
            <View style = {styles.players}>
                {player_names}

            </View>

            <View style = {styles.settings}>
                <Text style = {styles.gametitle}> Game Setting </Text>
                <View style = {styles.drinklimit}>
                <Image source = {require("../photos/drink.png")}  style = {styles.drink}/>
                <View style = {styles.drinkinfo}>
                    <Text style = {styles.gamelabel}> Drink Limit </Text>
                    <Text style = {styles.number}> {roomData["limit"]} sips </Text>
                </View>
                </View> 
                <View style = {styles.row}>
                    <Text style = {styles.gamelabel}> Cheese Touch </Text>
                    <Text style = {styles.toggle}> {roomData["cheese_touch"] ? "On": "Off" } </Text>
                </View> 
                <View style = {styles.row}>
                    <Text  style = {styles.gamelabel}> Game Mode </Text>
                    <Text style = {styles.toggle}> {roomData["controller"] ? "Controller": "Spectator" } </Text>
                </View> 
                <View style = {styles.row}>
                <Text  style = {styles.gamelabel}> MiniGames </Text>
                    <Text style = {styles.toggle}> Minigames </Text>
                </View> 

                <Pressable style = {styles.question} onPress = {() => setShown(!shown)}> 
                <Text style = {styles.questionText}> ? </Text> 
            
                </Pressable>
            </View>
            
            
            </KeyboardAvoidingView>
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
        fontSize: 20.35, 
        alignSelf: "center"
    }, 
    room: {
        fontFamily: "Cotton",
        fontSize: 64, 
        alignSelf: "center",
        color: "#3F89F9"
    },
    waiting: {
        fontFamily: "Cotton",
        alignSelf: "center",
        color: "#3F89F9", 
        marginTop: "10%", 
        fontSize: 18
    }, 
    players: {
        display: "flex", 
        flex: 2,
        flexDirection: "row", 
        flexWrap: "wrap",
        justifyContent: "flex-start",
        width: "100%", 
        marginTop: "10%", 
        height: "40%"
    }, 
    name: {
        minWidth: "33%", 
        fontSize: 18,
        fontFamily: "Cotton", 
        color: "black", 
        textAlign: "center", 
        marginBottom: "5%"
    }, 
    userName: {
        minWidth: "30%", 
        fontSize: 18,
        fontFamily: "Cotton", 
        color: "black", 
        textAlign: "center", 
        color: "#3F89F9", 
        marginBottom: "5%"
    }, 
    settings: {
        borderColor: "black", 
        borderWidth: 2, 
        borderStyle: "solid",
        width:  300,
        flex: 3,
        alignSelf: "center", 
        margin: 0, 
        borderRadius: 10, 
        paddingBottom: "5%"
    }, 
    gametitle: {
        fontSize: 36, 
        fontFamily: "Cotton", 
        alignSelf: "center",
        position: "relative", 
        bottom: "8%", 
        backgroundColor: "white", 
        borderWidth: 2, 
        borderColor: "black", 
        borderRadius: 10, 
        overflow: 'hidden', 
        zIndex: 1
    },
    drinklimit: {
        flex: 3, 
        display: "flex", 
        width: "60%",
        flexDirection: "row", 
        alignSelf: "center",
        justifyContent: "space-around"
    },
    drink: {
        alignSelf: "center",
    },
    drinkinfo: {
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        marginLeft: "15%"
    },
    number: {
        fontFamily: "Cotton",
        fontSize: 40, 
        color: "#3F89F9"
    }, 
    row: {
        display: "flex", 
        flexDirection: "row", 
        alignSelf: "center", 
        width: "60%", 
        justifyContent: "space-around", 
        flex: 1, 
        marginTop: "4%"
    }, 
    gamelabel: {
        fontFamily: "Cotton",
        fontSize: 18,
    }, 
    toggle: {
        borderRadius: 10, 
        borderColor: "black", 
        borderStyle: "solid", 
        borderWidth: 2,
        textAlign: "center",
        padding: "2%",
        color: "black", 
        backgroundColor: "#C4c4c4",
        overflow: "hidden",
        fontFamily: "Cotton"
    },
    question: {
        color: "black", 
        fontFamily: "Cotton", 
        backgroundColor: "white",
        position: "relative", 
        left: "85%", 
        width: 20,
        height: 20,
        bottom: "-2%",
        borderRadius: 100, 
        borderStyle: "solid", 
        borderColor: "black",
        borderWidth: 2
    }, 
    questionText: {
        fontSize: 18, 
    },
    dialogue: {
        backgroundColor: "white", 
        height: "80%", 
        width: "100%", 
        position: "absolute", 
        top: "20%", 
        left: "12.5%", 
        zIndex: 1, 
        padding: "10%",
        borderRadius: 20, 
        borderColor: "black", 
        borderStyle: "solid",
        borderWidth: 2, 
        flexDirection: "column",
        alignItems: "center"
    }, 
    diagmini: {
        flex: 3
    },
    minigame: {
        flex: 4, 
        marginTop: "10%"
    }


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
const mapDispatchToProps = {setPlayers,setRoomData, setGames, setRoom, setName}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);  