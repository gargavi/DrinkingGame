import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable, Keyboard} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import BouncyCheckbox from "react-native-bouncy-checkbox"
import {setPlayers, setRoomData, setStart} from "../home/homeSlice";
import socket from "../socket.js";

function Lobby({setRoomData, setPlayers, roomData, setStart, name, room, players, admin}) {
    const history = useNavigate(); 
    const [shown, setShown] = useState(false)
    const [errors, setErrors] = useState("")
    const [minigameDiag, setMiniGameDiag] = useState(false)
    const [newplayer, setNewPlayer] = useState('')

    const [drinkLimit, setDrinkLimit] = useState(roomData["limit"])
    const [cheese_touch, setCheese] = useState(roomData["cheese_touch"])
    const [gameMode, setGameMode] = useState(roomData["lite"])
    const [minigames, setMiniGames] = useState(roomData["minigames"])
    useEffect(()=> { 

        socket.on("roomUpdate", (data) => { 
            setPlayers(data["userdata"])
            setRoomData(data["room"])
            setCheese(data["room"]["cheese_touch"])
            setGameMode(data["room"]["lite"])
            setMiniGames(data["room"]["minigames"])
        })
        socket.on("start", ()=> {
            setStart(true)
            history("/characters") 
        } )

        return () => {}
        
    }, [])

    function updateMiniGame(key) {
        minigames[key] = !minigames[key]

        setMiniGames({
        ...minigames,  [key]: !minigames[key] 
        })
    }

    function addPlayer() {
 
        socket.emit("addPlayer", {name: newplayer}, (data) => {
            if ("errors" in data) {
                alert(data["errors"])
            } else {
                setPlayers(data["userdata"])
            }
        })
        setNewPlayer("")
    }

    function updateRoomInfo() {
        socket.emit("update", {limit: drinkLimit, cheese_touch: cheese_touch, gameMode: gameMode, minigames: minigames}, (data) => {
            const a = 1 
        })

    }
  
    function StartGame() {
        socket.emit("start", (data) => {
            if ("errors" in data) { 
                alert(data["errors"])
            }
        })
    }


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

    const all = Object.keys(minigames).every((key) => minigames[key])

    const minigamelist = Object.keys(minigames).map((key, index) => 
        {
            return (
                    <BouncyCheckbox 
                    key = {index}
                    disabled = {!admin} 
                    isChecked = {!minigames[key]}
                    text = {key}
                    textStyle = {styles.bouncytext}
                    iconStyle ={styles.checkicon}
                    unfillColor = "#3F89F9"
                    fillColor = "transparent"
                    style = {styles.bouncy}
                    onPress = {() => updateMiniGame(key)}
                    />
            )
        }
    )

    return ( 
        <View style={styles.container}>

            {(shown || minigameDiag) && <Pressable style = {styles.exit} onPress = {() => {setShown(false);setMiniGameDiag(false)}}>
                    <Text style = {styles.exitText}> X </Text>
                </Pressable>}
            {shown && <View style = {styles.dialogue}>
            <Text style = {styles.minigameTitle}> Game Settings </Text>
            <Text style = {styles.subheader}> Drink Limit </Text>
            <Text style = {styles.para}> The max number of sips allowed per minigame.
             Any number above 6 (?) should only be chosen with full understanding of the players’ limits. </Text>
            <Text style = {styles.subheader}> Cheese Touch </Text>
            <Text style = {styles.para}> If you are on the same square as someone with the cheese touch, you get it and
             drink twice as much. However, you can pass it on.  </Text>
            <Text style = {styles.subheader}> Game Mode  </Text>
            <Text style = {styles.para}> Lite: This game version is more compact - the host will have prompts/minigames that people will play without controllers. Users that join the room will be able to view the same prompts. </Text>
            <Text style = {styles.para}> Classic: Imagine Mario Party - you will play the games using your phone as a controller and move along a virtual board game. Visit "https://wwww.avigarg.me/{room}" to see your board </Text>
            
            </View>}

            {minigameDiag && <View style = {styles.dialogue}>
            <View style = {styles.diagmini}>
                <Text style = {styles.minigameTitle}> MiniGames </Text>
                {minigamelist}
            </View>

            </View>}
            <KeyboardAvoidingView
             style = {styles.center}
                behavior="position" 
           >
            <Pressable style = {styles.homebtn} onPress = {()=> history("/")}>
                <Text style = {styles.home}> Home </Text>
            </Pressable>
            
            <Text style = {styles.title}> Room Code </Text>
            <Text style = {styles.room}> {room} </Text>
            <Text style = {styles.waiting}> Waiting for the Host </Text>
            
            <View style = {styles.players}>
                {player_names}

            </View>
            {admin && players.length <= 12 && <View style = {styles.med}>
             <TextInput
                style = {styles.input}
                value = {newplayer}
                maxLength = {10}
                onChangeText= {text => setNewPlayer(text)}
                returnKeyType="done"
                placeholder = "Enter Additional Player"
            />
            <Pressable style = {styles.add} onPress = {() => addPlayer()}><Text style = {styles.addText}> Add </Text></Pressable>
            </View>}

            <View style = {styles.settings}>
                <Text style = {styles.gametitle}> Game Setting </Text>
                <View style = {styles.drinklimit}>
                <Image source = {require("../photos/drink.png")}  style = {styles.drink}/>
                <View style = {styles.drinkinfo}>
                    <Text style = {styles.gamelabel}> Drink Limit </Text>
                    {admin && <TextInput
                    style = {styles.number}
                    onChangeText={setDrinkLimit}
                    keyboardType="numeric"
                    maxLength = {1}
                    returnKeyType="done"
                    value = {drinkLimit.toString()}
                    onSubmitEditing = {() => {Keyboard.dismiss()}}
                    /> }
                    {!admin && <Text style = {styles.number}> {drinkLimit} </Text>}
                </View>
                </View> 
                <View style = {styles.row}>
                    <Text style = {styles.gamelabel}> Cheese Touch </Text>
                    <Pressable  style = { admin ? styles.toggleadmin: styles.toggle} disabled = {!admin} onPress = {() => setCheese(!cheese_touch)}> 
                    <Text style = {styles.toggletext} > {cheese_touch ? "On": "Off" } </Text> 
                    </Pressable>
                </View> 
                <View style = {styles.row}>
                    <Text  style = {styles.gamelabel}> Game Mode </Text>
                    <Pressable style = { admin ? styles.toggleadmin: styles.toggle} disabled = {!admin} onPress = {() => setGameMode(!gameMode)} >
                        <Text style = {styles.toggletext} > {gameMode ? "Lite": "Classic" } </Text>
                    </Pressable>
                </View> 
                <View style = {styles.row}>
                <Text  style = {styles.gamelabel}> MiniGames </Text>
                    <Pressable style = {styles.minigameBtn} onPress = {() => setMiniGameDiag(true)} > 
                    
                        <Text style = {styles.minigameBtntext}> {all ? "All" : "Custom"} </Text>
                    </Pressable>                    
                </View> 
                
                <Pressable style = {styles.question} onPress = {() => setShown(!shown)}> 
                <Text style = {styles.questionText}> ? </Text> 
            
                </Pressable>
            </View>
            
            {(admin || room == "coolguy") && 
            <View style = {styles.adminBtns}>
            <Pressable style = {styles.updateBtn} onPress = {() => updateRoomInfo()}> 
                <Text style = {styles.updateBtnText}> Update </Text>
            </Pressable>
            <Pressable style = {styles.updateBtn} onPress = {() => StartGame()}> 
                <Text style = {styles.updateBtnText}> Start </Text>
            </Pressable>    
            </View>}
 

            
            
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
      paddingBottom: "2%",
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
    homebtn: {
        alignSelf: "center", 
        position: "absolute", 
        top: -40
    }, 
    home: {
        fontFamily: "Cotton"
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
    med: {
        flex: .5,
        display: "flex", 
        flexDirection: "row",
        marginTop: "3%", 
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: "8%",
    },
    add: {
        backgroundColor: "#3F89F9", 
        borderRadius: 10, 
        borderColor: "black", 
        borderStyle: "solid", 
        borderWidth: 2,
        textAlign: "center",

    }, 
    addText: {
        fontFamily: "Cotton",
        fontSize: 20,
        color: "white"
    }, 
    input: {
        fontFamily: "Helvetica",
        borderColor: "black", 
        borderWidth: 2,
        backgroundColor: "white", 
        borderStyle: "solid",
        fontSize: 20, 
        borderRadius: 15, 
        width: "80%", 
        textAlign: "center", 
        height: "100%",
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
        flex: 4,
        alignSelf: "center", 
        margin: 0, 
        borderRadius: 10, 
        paddingBottom: "8%"
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
        color: "#3F89F9", 
        flex: 3
    }, 
    row: {
        display: "flex", 
        flexDirection: "row", 
        alignSelf: "center", 
        width: "60%", 
        justifyContent: "space-around", 
        flex: 1, 
        alignItems: "center",
        marginTop: "4%"
    }, 
    gamelabel: {
        fontFamily: "Cotton",
        fontSize: 18,
        flex: 1,
        textAlign: "center", 
        marginRight: "10%"
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
        fontFamily: "Cotton",
        flex: 1
    },
    toggleadmin: {
        borderRadius: 10, 
        borderColor: "black", 
        borderStyle: "solid", 
        borderWidth: 2,
        textAlign: "center",
        padding: "2%",
        color: "black", 
        backgroundColor: "#3F89F9",
        overflow: "hidden",
        fontFamily: "Cotton", 
        flex: 1
    }, 
    minigameBtn: {
        textAlign: "center",
        color: "black", 
        alignSelf: "center", 
        flex: 1
    },
    minigameBtntext: {
        color: "#3F89F9",
        fontFamily: "Cotton", 
        fontSize: 20, 
        textAlign: "center",
        textDecorationStyle: "solid",
        textDecorationLine: "underline"
    },
    toggletext: {
        color: "white",
        fontFamily: "Cotton", 
        fontSize: 20,
        textAlign: "center",
    },
    adminBtns: {
        flex: 1, 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-around"
    }, 
    updateBtn: {
        borderRadius: 10, 
        borderColor: "black", 
        borderStyle: "solid", 
        borderWidth: 2,
        textAlign: "center",
        flex: .25,
        padding: "2%",
        marginTop: "5%",
        color: "black", 
        justifyContent: "center",
        backgroundColor: "#3F89F9",
        overflow: "hidden",
        fontFamily: "Cotton", 
        width: "20%", 
        alignSelf: "center"
    }, 
    updateBtnText: {
        fontFamily: "Cotton", 
        color: "white", 
        alignSelf: "center"
    },
    question: {
        color: "black", 
        fontFamily: "Cotton", 
        backgroundColor: "white",
        position: "absolute", 
        left: "85%", 
        width: 20,
        height: 20,
        bottom: "4%",
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
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "column",
    }, 
    diagmini: {
        flex: 3
    },
    subheader: {
        color: "black", 
        fontFamily: "Cotton", 
        fontSize: 24,
        alignSelf: "flex-start", 
    }, 
    para: {
 
        fontFamily: 'Helvetica', 
        fontSize: 16, 
    }, 
    exit: {
        backgroundColor: "#3F89F9",
        position: "absolute", 
        top: "19%",
        left: "105%",
        zIndex: 3,
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
    minigame: {
        flex: 4, 
        marginTop: "10%"
    }, 
    minigameTitle: {
        fontFamily: "Cotton", 
        fontSize: 48,
        color: "#3F89F9", 
    }, 
    bouncy: {
        marginTop: "4%", 
    },
    bouncytext: {
        fontFamily: "Cotton", 
        fontWeight: "bold",
        color: "black",
        fontSize: 24
    }, 
    checkicon: {
        borderColor: "black", 
        borderWidth: 2, 
        borderStyle: "solid", 
        borderRadius: 4
    }


  });

const mapStateToProps = (state) => {
return ({
    games: state.home.games, 
    name: state.home.name,
    room: state.home.room, 
    players: state.home.players, 
    roomData: state.home.roomData, 
    admin: state.home.admin
})
}
const mapDispatchToProps = {setPlayers,setRoomData,setStart}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);  