import React, {useEffect, useState} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {Link} from "react-router-native";
import {withRouter, useNavigate} from "react-router-native";
import {setPlayers, setName, setRoomData, setAdmin, setRoom, setSocket, setUser} from "./homeSlice";
import {useFonts} from "@expo-google-fonts/inter"
import socket from "../socket.js";
import {routerDict} from "../utils";

function Home({setRoomData, setAdmin, setPlayers,setUser, name, room, userData, setName, setRoom, setSocket}) {
    const history = useNavigate(); 
    const [shown, setShown] = useState(false)
    const [errors, setErrors] = useState("")
    function joinTeam() {
        setAdmin(false)
        if (name == "") {
            setErrors("Name cannot be empty")
        } else {
            socket.emit("join", {namer: name, room: room.toLowerCase()}, (data) => {
                if ("errors" in data) {
                    setErrors(data["errors"])
                } else {
                    setPlayers(data["userdata"])
                    setRoomData(data["room"])
                    if ("socketid" in data) {
                        setSocket(data["socketid"])
                    }
                    if ("user" in data) {
                        setUser(data["user"])
                    }
                    history("/lobby")
                }
            })
     
        }
    }

    useEffect(() => {
        socket.on('ping', function(data){
            socket.emit('pong', {beat: 1});
        });

        socket.on("roomUpdate", (data) => { 
            setPlayers(data["userdata"])
            setRoomData(data["room"])
            if ("user" in data) {
                setUser(data["user"])
            }
        })

        socket.on("nextGame", (data) => {
            console.log("nextgame")
            const room = data["room"]
            setRoomData(data["room"])
            setPlayers(data["userdata"])
            if (room["lite"]) {
                history(routerDict["lite"][room["state"]["name"]])
            } else {
                history(routerDict["classic"][room["state"]["name"]])
            }

            
        })



        return () => {}

    }, [])

    function createTeam() {
        if (name == "") {
            setErrors("Name cannot be empty")
        }  else {
            history("/create")
        }
        
    }

    return ( 
        <View style={styles.container}>
            {shown && <View style = {styles.dialogue}>
                <Pressable style = {styles.exit} onPress = {() => setShown(false)}>
                <Text style = {styles.exitText}> X </Text>
                </Pressable>
               
                <Text style = {styles.title}>
                    HOW TO
                </Text>
                <Text style = {styles.diagtext}>
                    Welcome to The Drinking Game! Before getting started there are some key rules 
                    to follow 
                </Text>
                <Text style = {styles.diagtext}>
                    Please drink responsibly and stay safe.
                </Text>
                <Text style = {styles.diagtext}>
                    Do not drive drunk.
                </Text>
                <Text style = {styles.diagtext}>
                    Tired of the same old drinking games like King's Cup? Want something more interesting? The Drinking Game allows 
                    you and your friends to play a variety of mini games together! You don't have to drink, but if you do, please do so 
                    responsibly. Meanwhile, have fun and stay safe.
                </Text>
                <Pressable style = {styles.rulesButton}  onPress = {() => {joinTeam()}} > 
                    <Text style = {styles.joinButtonText}> Rules/Read More </Text> 
                </Pressable> 
            </View>}
            <View
             style = {styles.center}
                behavior="position" 
           >
                <Image style = {styles.imageDG} source = {require("../photos/title_home.png")} />
                <Text style = {styles.label}> Name: </Text>
                <TextInput 
                    style = {styles.input}
                    value = {name} 
                    placeholder = "ENTER NAME "
                    autoFocus = {true}
                    maxLength = {10}
                    onChangeText={ text => setName(text)}
                />
                <Text style = {styles.label}> Room Code: </Text>
            
                <TextInput 
                    style = {styles.input}
                    value = {room} 
                    maxLength = {7}
                    placeholder = "ENTER ROOM CODE"
                    onChangeText={ text => setRoom(text)}
                />
                <Text style = {styles.error}> {errors}
                </Text>
                <View style = {styles.buttonCont}>
                <Pressable style = {styles.joinbutton}  onPress = {() => {joinTeam()}} > 
                    <Text style = {styles.joinButtonText}> Join </Text> 
                </Pressable> 
                <Pressable style = {styles.joinbutton}  onPress = {() => {createTeam()}} > 
                    <Text style = {styles.joinButtonText}> Create</Text> 
                </Pressable> 
                </View>
            </View>
            <Pressable style = {styles.question} onPress = {() => setShown(!shown)}> 
                <Text style = {styles.questionText}> ? </Text> 
            
            </Pressable>
            <Image source = {require("../photos/man.png")}  style = {styles.man}/>


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFE248",
      height: "100%",
      padding: "10%",
      paddingTop: "20%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start"
    },    
    center: {
        display: "flex",
        width: "100%",
        maxHeight: "70%",
        flexDirection: "column",
        textAlign: "center", 
        alignItems: "center", 
        justifyContent: "space-evenly"
    },
    imageDG: {
        alignSelf: "center",
    },
    label: {
        fontFamily: "Cotton",
        fontSize: 24, 
        alignSelf: "center",
        marginTop: "3%", 
    }, 
    input: {
        fontFamily: "Helvetica",
        borderColor: "black", 
        borderWidth: 2,
        backgroundColor: "white", 
        borderStyle: "solid",
        fontSize: 20, 
        padding: "5%", 
        borderRadius: 15, 
        minWidth: "80%", 
        textAlign: "center", 
        marginTop: "3%"
    }, 
    joinbutton: {
        marginTop: "10%",
        borderColor: "black", 
        borderWidth: 2,
        padding: "2%",
        borderRadius: 15,
        minWidth: "25%",
        textAlign: "center",
        backgroundColor: "#3F89F9", 
        color: "white",
        borderStyle: "solid",
        display: "flex", 
        flexDirection: "row",
        justifyContent: "center", 
        alignSelf: "center"
    }, 
    rulesButton: {
        marginTop: "10%",
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
    error: {
        fontFamily: "Cotton", 
        alignSelf: "center",
        marginTop: "5%",
        fontSize: 20,
        color: "red",
        marginBottom: "0%"
    }, 
    buttonCont: {
        display: "flex", 
        flexDirection: "row", 
        width: "100%",
        justifyContent: "space-evenly"
    }, 
    joinButtonText: {
        color: "white", 
        fontSize: 25,
        fontFamily: "Cotton"
    }, 
    question: {
        color: "black", 
        fontFamily: "Cotton", 
        backgroundColor: "white",
        position: "absolute", 
        left: "20%", 
        bottom: "10%",
        borderRadius: 100, 
        borderStyle: "solid", 
        borderColor: "black",
        borderWidth: 2
    }, 
    questionText: {
        fontSize: 40, 
    },
    man: {
        position: "absolute", 
        height: "25%", 
        bottom: "5%",
        right: "4%", 
        zIndex: 1,
        overflow:"visible"
    }, 
    dialogue: {
        backgroundColor: "white", 
        height: "80%", 
        width: "100%", 
        position: "absolute", 
        top: "20%", 
        left: "12.5%", 
        zIndex: 2, 
        padding: "10%",
        paddingTop: "0%",
        borderRadius: 20, 
        borderColor: "black", 
        borderStyle: "solid",
        borderWidth: 2, 
        flexDirection: "column",
        alignItems: "center"
    }, 
    exit: {
        backgroundColor: "#3F89F9",
        position: "relative", 
        bottom: 12, 
        left: 140,
        width: 30,
        height: 30,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100, 
        borderColor: "black", 
        borderStyle: "solid", 
        borderWidth: 2
    }, 
    exitText: {
        fontFamily: "Cotton", 
        color: "white", 
        fontSize: 25

    },
    title: { 
        color: "#3F89F9",
        fontFamily: "Cotton", 
        fontSize: 30
    }, 
    diagtext: {
        fontFamily: "Helvetica", 
        fontSize: 18, 
        marginTop: "10%", 
        alignSelf: "flex-start"
    }

 
  });

const mapStateToProps = (state) => {
return ({
    games: state.home.games, 
    name: state.home.name,
    room: state.home.room, 
    userData: state.home.user
})
}
const mapDispatchToProps = {setPlayers, setSocket, setUser, setAdmin, setRoomData, setRoom, setName}

export default connect(mapStateToProps, mapDispatchToProps)(Home);  