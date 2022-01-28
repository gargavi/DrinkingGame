import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect, connectAdvanced} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../../home/homeSlice";
import socket from "../../socket.js";
import axios from "axios";
import endpoint from "../../endpoint";
import { setCategories } from "./minigameSlice";

import characters from "../../characters/character_info";

function Categories({roomData,setCategories, userData, categories, players, admin}) {
    const [number, setNumber] = useState(0)
    const [prompt, setPrompt] = useState(null)
    const [selectedplayer, setSelectedPlayer] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [results, setResults] = useState(null)
    const [user_start, setUserStart] = useState(null)


    useEffect(() => {
        socket.on("advanceLikely", (data) => {
            setResults(data)
            setNumber(2)
        })

    }, [])

    function goNext() {
        setNumber(number + 1) 
        if (categories.length == 0) {
            axios.get(endpoint + "all_category.json").then(results => {
                setPrompt(results["data"][roomData["state"]["prompt"]])
                setCategories(results["data"])
            }).catch(err => {
                console.log(err)
            })    
        } else {
            setPrompt(categories[roomData["state"]["prompt"]])
        }
        setUserStart(roomData["state"]["user_start"])
    }

    function selectPlayer(name) {
        socket.emit("likely", {name, id: userData["_id"]}, () => {
        })
        setSubmitted(true)
    }

    function advance() { 
        socket.emit("advanceLikely", {id: userData["_id"]},  (data) => {
            if ("errors" in data) {
                console.log(data["errors"])
            }
        })
    }

    function nextGame() { 
        socket.emit("nextGame",{id: userData["_id"]}, () => {
        })
        setNumber(0)
        setSelectedPlayer(null)
        setSubmitted(null)
        setResults(null)

    }



    const player_icons = players.map((play, index) => {
        const rel_char = characters.find(char => char["character_name"] == play["character"] )

        return (
            <Pressable disabled = {roomData["lite"] && !admin} onPress = {() => setSelectedPlayer(play["name"])} style = {styles.icon} key = {index}>
                {rel_char && <Image style = {styles.image} source = {{"uri": rel_char["image"]}}/> }
                <Text style = {styles.playername}>  {play["name"]}</Text>            
                {selectedplayer == play["name"] && !submitted &&  <Pressable style = {styles.selectBtn} onPress = {() => selectPlayer(play["name"])}><Text style = {styles.selectBtnText}> Select </Text></Pressable>}
                {selectedplayer == play["name"] && submitted && <Text style = {styles.submitted}> Submitted </Text>}
            </Pressable>
            
        )
    })

    let winnerImage;
    if (results) {
        const player = players.find(play => play["name"] == results["winner"])
        if (player) {
            const character = characters.find(char => char["character_name"] == player["character"])
            if (character) {
                winnerImage = character["image"]
            }
        }
    }

    return ( 
        <View style={styles.container}>
           <View style = {number == 0 ? styles.blackcont: styles.center}>
            {number == 0 && <Pressable style = {styles.gifcont} onPress = {() => goNext()}><Image style = {styles.gif} source = {require("../../photos/most_likely.gif")}/></Pressable> }
            {number == 0 && <Text style = {styles.loading}> Loading </Text>}
            {number == 1 && 
            <View style = {styles.likely}>
                <Text style = {styles.userstart}> {user_start} starts </Text>  
                <Text style = {styles.prompt}> {prompt && prompt["question"]} </Text>
                {admin && 
                <View style = {styles.charcont}>
                    {player_icons}
                </View>}
            </View>}

            {admin && submitted && number == 1 && <Pressable onPress= {() => advance()} style = {styles.Button}><Text style = {styles.ButtonText}> See Results </Text></Pressable>}
            {number == 2 && results && 
            <Pressable style = {styles.answer} onPress = {() => nextGame()}>
                <Image style = {styles.question} source = {require("../../photos/question.png")} /> 
                <Text style = {styles.winnerText}> Our winner is </Text>
                <Image style = {styles.winnerImage} source = {{"uri": winnerImage}}/>
                <Text style = {styles.winner}> {results["winner"]}</Text>
                <Text style = {styles.penalty}> Take {results["penalty"]} sips ! </Text>
            </Pressable> 
            
            }
           </View>
        </View>
    )
}
const styles = StyleSheet.create({
    blackcont: {
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start" 
    }, 
    container: {
        backgroundColor: "#FFE248",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
    },    
    center: {
        display: "flex",
        flex: 3,
        flexDirection: "column",
        textAlign: "center", 
        alignItems: "center", 
        justifyContent: "center"
    }, 
    gifcont: {
        height: "100%", 
        width: "100%",
        zIndex: 1
    }, 
    gif: {
        height: "100%", 
        width: "100%"
    }, 
    likely: {
        display: "flex", 
        flexDirection: "column", 
        height: "80%", 
        alignItems: "center"
    }, 
    discuss: {
        fontFamily: "Cotton", 
        fontSize: 40
    }, 
    prompt: {
        fontSize: 60, 
        fontFamily: "Cotton", 
        padding: "5%", 
        textAlign: "center"
    }, 
    userstart: {
        fontFamily: "Cotton", 
        fontSize: 30
    }, 
    charcont: {
        display: "flex", 
        flexDirection: "row", 
        alignSelf: "center",
        justifyContent: "center",
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
    image: {
        height: 80, 
        width: 80, 
        alignSelf: "center",
        borderRadius: 100
    }, 
    playername: {
        alignSelf: "center", 
        fontFamily: "Cotton",
        fontSize: 18, 
        textAlign: "center"
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
    selectBtnText: {
        fontFamily: "Cotton", 
        fontSize: 24
    }, 
    submitted: {
        position: "absolute", 
        bottom: "40%", 
        zIndex: 1, 
        width: 100,
        alignItems: "center",
        backgroundColor: "rgba(241, 94, 94, .9)", 
        borderRadius: 10, 
        borderColor: "black", 
        borderWidth: 2, 
        overflow: "hidden",
        borderStyle: "solid", 
        textAlign: "center", 
        fontFamily: "Cotton", 
        fontSize: 24
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
    answer: {
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        // borderColor: "black", 
        // borderWidth: 2, 
        height: "80%"
    }, 
    question: {
        height: "20%", 
        overflow: "visible"
    }, 
    winnerText: {
        fontFamily: "Cotton", 
        fontSize: 36
    }, 
    winner: {
        fontFamily: "Cotton", 
        fontSize: 36
    }, 
    penalty: {
        fontSize: 64, 
        fontFamily: "Cotton"
    }, 
    winnerImage: {
        height: 150, 
        width: 150
    }, 
    loading: {
        position: "absolute",
        top: "50%",
        color: "white", 
        fontSize: 120, 
        textAlign: "center", 
        alignSelf: "center", 
        zIndex: 0, 
        fontFamily: "Cotton"
    }

  });

const mapStateToProps = (state) => {
return ({
    roomData: state.home.roomData,
    socketid: state.home.socket, 
    name: state.home.name, 
    players: state.home.players, 
    admin: state.home.admin, 
    categories: state.minigame.categories, 
    userData: state.home.user
})
}
const mapDispatchToProps = {setCategories}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);  