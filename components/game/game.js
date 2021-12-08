import React, {useEffect, useState} from "react"; 
import {Button, StyleSheet, View, Image, StatusBar, Text, Pressable, ScrollView} from "react-native"; 
import {connect} from "react-redux"; 
import {Link} from "react-router-native";
import axios from "axios";
import { setRefresh } from "../home/homeSlice";
import {setPlayerCharacter, setCharacters, addGameQuestion, clearGame, nextElement } from "./gameSlice";
import {tick, setstateInterval, setTime, start} from "../timer/timerSlice";

import endpoint from "../endpoint";

function Game({setPlayerCharacter, players, seconds,start, active, nextElement, clearGame, addGameQuestion, length, gameQuestions, playerCharacters,setCharacters, characters, games, tick, setstateInterval, setTime}) {

    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(false);
    const [style, setStyle] = useState("container")

    useEffect( () => {
        setLoading(true)
        clearGame()
        if (games["random_characters"]) {
            axios.get(endpoint + "special_characters.json").then(results => {
                const characters = results["data"];
                for (let i = 0; i < players.length; i ++ ) {
                    var player = players[i]
                    if (!Object.keys(playerCharacters).includes(player)) {
                        const rand = Math.floor(Math.random() * characters.length)
                        setPlayerCharacter({"character": characters[rand], "player": player})
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        }
        var total_length = gameQuestions.length;
        if (games["most_likely"]) {
            axios.get(endpoint + "all_likely.json").then(results => {
                for (let i = 0; i < length; i ++ ) {
                    var array_data = results["data"];
                    const rand = Math.floor(Math.random() * array_data.length)
                    const rand2 = Math.floor(Math.random() * total_length)
                    const data = array_data[rand]
                    data["type"] = "most_likely"
                    addGameQuestion({"data": data, "number": rand2})
                    array_data.splice(rand, 1)
                    total_length = total_length + 1;
                }
            }).catch(err => {
                console.log(err)
            })
        }
        if (games["trivia"]) {
            axios.get(endpoint + "all_trivia.json").then(results => {
                for (let i = 0; i < length; i ++ ) {
                    var array_data = results["data"];
                    const rand = Math.floor(Math.random() * array_data.length)
                    const rand2 = Math.floor(Math.random() * total_length)
                    const data = array_data[rand]
                    data["type"] = "trivia"
                    addGameQuestion({"data": data, "number": rand2})
                    array_data.splice(rand, 1)
                    total_length = total_length + 1;
                }
            }).catch(err => {
                console.log(err)
            })
        }
        if (games["number_game"]) {
            for (let i = 0; i < Math.floor(length/3); i ++ ) {
                const rand2 = Math.floor(Math.random() * total_length)
                const data = {"type": "number_game"}
                addGameQuestion({"data": data, "number": rand2})
                total_length = total_length + 1;
            }
        }
        if (games["quickdraw"]) {
            for (let i = 0; i < Math.floor(length/3); i ++ ) {
                const rand2 = Math.floor(Math.random() * total_length)
                const data = {"type": "quickdraw"}
                addGameQuestion({"data": data, "number": rand2})
                total_length = total_length + 1;
            }
        }
        if (games["drive"]) {
            for (let i = 0; i < length; i ++ ) {
                const rand2 = Math.floor(Math.random() * total_length)
                const data = {"type": "drive"}
                addGameQuestion({"data": data, "number": rand2})
                total_length = total_length + 1;
            }
        }
        if (games["cheese_touch"]) {
            axios.get(endpoint + "cheese_touch.json").then(results => {
                var json_data = results["data"];
                for (let i = 0; i < length; i ++ ) {
                    const rand = Math.floor(Math.random() * json_data["challenges"].length)
                    const rand3 = Math.floor(Math.random() * json_data["escapes"].length)
                    const rand2 = Math.floor(Math.random() * total_length)
                    const data = {"challenge": json_data["challenges"][rand], "escape": json_data["escapes"][rand3], "type": "cheese_touch"}
                    addGameQuestion({"data": data, "number": rand2})
                }
            }).catch(err => {
                console.log(err)
            })
        }
        setLoading(false)
    }, [])


    const mapping = Object.keys(playerCharacters).map((element, index) => {

        const character = playerCharacters[element]
        return (
            <View key = {index} style = {styles.characterCont}>
                <Text style = {styles.name}>
                    {element}
                </Text>
                <Text style = {styles.characterName}>
                    {character[0]}
                </Text>
                <Text style = {styles.description}>
                    {character[1]}
                </Text>
            </View>
        )
    })

    const [title, setTitle] = useState(null)
    const [question_value, setQuestion] = useState(null)
    useEffect(() => {
        if (gameQuestions.length > 0) {
            if (gameQuestions[0]["type"] == "most_likely") {
                setTitle("MOST LIKELY")
                setQuestion(gameQuestions[0]["question"])
                setTimer(false)
                setStyle("most_likely")
            } else if  (gameQuestions[0]["type"] == "trivia") {
                setTitle("TRIVIA")
                setQuestion(gameQuestions[0]["question"])
                setTimer(false)
                setStyle("trivia")
            } else if  (gameQuestions[0]["type"] == "number_game") {
                setTitle("NUMBER GAME")
                if (!active) {
                    setTime(5)
                    start()
                    setstateInterval(setInterval(tick, 1000))
                }
                setQuestion("Hold up a number - those who are unique get to give out that many drinks. Otherwise you must take them")
                setTimer(true);
                setStyle("number")
            } else if   (gameQuestions[0]["type"] == "drive") {
                setTitle("DRIVE")
                setQuestion("Play 3 times: losers take 3, 5, 7 penalties respectively")
                setTimer(false)
                setStyle("drive")
            } else if   (gameQuestions[0]["type"] == "quickdraw") {
                setTitle("QUICKDRAW")
                if (!active) {
                    setTime(3)
                    start()
                    setstateInterval(setInterval(tick, 1000))
                }
                setQuestion("Point Up")
                setTimer(true);
                setStyle("quickdraw")
            } else if   (gameQuestions[0]["type"] == "cheese_touch") {
                setTitle("CHEESE TOUCH")
                setTimer(false)
                const rand1 = Math.floor(Math.random() * players.length);
                const question = players[rand1] + " has the Cheese Touch. " + gameQuestions[0]["challenge"] + "\n To escape: " + gameQuestions[0]["escape"]
                setQuestion(question)
                setStyle("cheese")
            }

        } else {
            setTitle(null)
            setQuestion("Loading")
        }
    }, [gameQuestions])
    
    function Next() {
        nextElement()
        setTime(5)
    }
    return ( 
        <View> 
        <View style={styles[style]} >
            
            {!characters && games["random_characters"] && 
            <View style = {styles.characters} onTouchStart = {() =>setCharacters()}>
                <Text style = {styles.title}> All Characters and Abilities </Text>
                {mapping}
            </View>
            }
            {
                (characters || !games["random_characters"]) && !loading &&
                <View onTouchStart ={() => Next()} style = {styles.current}>
                    <Text style = {styles.title}>{title} </Text>
                    <Text style = {styles.question}> {question_value} </Text>
                    <Text style = {styles.timer}> {timer ? seconds : null }</Text>
                </View>
            }
        </View>
        
            <Link to = "/">
                    <Text style = {styles.rulelink}> Edit Rules </Text> 
            </Link>
            <Text style = {styles.charlink} onPress= {() => setCharacters()}> Characters </Text> 
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#f5d84c",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "center", 
      justifyContent: "center"
    }, 
    drive: {
        backgroundColor: "#e00404",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center", 
        justifyContent: "center"
    }, 
    number: {
        backgroundColor: "#2500ba",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center", 
        justifyContent: "center"
    }, 
    trivia: {
        backgroundColor: "#058409",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center", 
        justifyContent: "center"
    },
    most_likely: {
        backgroundColor: "#ba00ad",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center", 
        justifyContent: "center"
    },
    quickdraw: {
        backgroundColor: "#e5911b",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center", 
        justifyContent: "center"
    },  
    cheese: {
        backgroundColor: "#757a12",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center", 
        justifyContent: "center"
    },  

    title: {
        fontFamily: 'Quicksand_600SemiBold',
        fontSize: 80,
        marginBottom: "2%",
        color: "white"
    },  
    question: {
        fontFamily: 'Quicksand_400Regular',
        fontSize: 40, 
        color: "white", 
        padding: "10%", 
        textAlign: "center"
    }, 
    timer: {
        color: "red",
        fontSize: 80,
        fontFamily: 'Quicksand_600SemiBold',
    },
    characters: {
        display: "flex", 
        borderColor: "black", 
        borderWidth: 2,
        borderStyle: "solid",
        flexDirection: "column",
        alignItems: "center"
    },
    characterCont: {
        display: "flex", 
        flexDirection: "row", 
        padding: "2%",   
        borderColor: "black", 
        borderTopWidth: 2,
        borderStyle: "solid",      
    },  
    name: {
        width: "20%",
        textAlign: "center", 
        fontSize: 20,
        fontFamily: 'Quicksand_400Regular',
    }, 
    characterName: {
        width: "20%",
        textAlign: "center", 
        fontSize: 20,
        fontFamily: 'Quicksand_400Regular',
    }, 
    description: {
        width: "60%", 
        fontSize: 20,
        fontFamily: 'Quicksand_400Regular',

    }, 
    current: {
        height: "50%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-evenly"
    },
    charlink: {
        fontSize: 20,
        backgroundColor: "#077dd1", 
        color: "white",
        padding: "2%", 
        position: "absolute",
        bottom: 100,
        left: 100
    }, 
    rulelink: {
        fontSize: 20,
        backgroundColor: "#077dd1", 
        color: "white",
        padding: "2%", 
        position: "absolute", 
        bottom: 100,
        right: 100
    }
  });

const mapStateToProps = (state) => {
return ({
    games: state.home.games, 
    players: state.home.players, 
    playerCharacters: state.game.playerCharacters, 
    characters: state.game.characters, 
    length: state.home.length, 
    gameQuestions: state.game.gameQuestions, 
    refresh: state.home.refresh, 
    seconds: state.timer.seconds, 
    active: state.timer.active
})
}
const mapDispatchToProps = {setPlayerCharacter, setCharacters, addGameQuestion, setRefresh, clearGame, start, nextElement, tick, setstateInterval, setTime}

export default connect(mapStateToProps, mapDispatchToProps)(Game);  