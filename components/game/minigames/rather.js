import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect, connectAdvanced} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../../home/homeSlice";
import socket from "../../socket.js";
import axios from "axios";
import endpoint from "../../endpoint";

import { setRather } from "./minigameSlice";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

import characters from "../../characters/character_info";

function Rather({roomData,name, setRather, userData, rather, players, admin}) {
    const [dice, setDice] = useState(null)
    const [number, setNumber] = useState(0)
    const [prompt, setPrompt] = useState(null)
    const [choice, selectChoice] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [results, setResults] = useState(null)
    const [correct, setCorrect] = useState(null)

    const [time, setTime] = useState(null)
    useEffect(() => {

        if (time != null && time <= 0) {
            if (timerId) {
                clearInterval(timerId)
                return ;    
            }
            setTimeout(() => {
                setNumber(2)
            }, 2000)
            return ;
        } 
        let timerId;
        if (time != null ){
            timerId = setInterval(() => {
                setTime(time - 1)
            }, 1000)
     
        }
        if (timerId) {
            return () => clearInterval(timerId)
        }

    }, [time])


    useEffect(() => {
        socket.on("advanceRather", (data) => {
            setResults(data)
            setNumber(2)
            console.log(data)
        })

    }, [choice])

    function goNext() {
        setNumber(number + 1) 
        if (rather.length == 0) {
            axios.get(endpoint + "all_rather.json").then(results => {
                setPrompt(results["data"][roomData["state"]["prompt"]])
                setRather(results["data"])
            }).catch(err => {
                console.log(err)
            })
        } else {
            setPrompt(rather[roomData["state"]["prompt"]])
        }
        setTime(20)
 
    }



    function advance() {
        socket.emit("advanceRather",{id: userData["_id"]}, (data) => {
            if ("errors" in data) {
                console.log(data["errors"])
            }
        })
    }

    function nextGame() { 
        socket.emit("nextGame", {id: userData["_id"]}, () => {
        })
        setNumber(0)
        selectChoice(null)
        setSubmitted(null)
        setResults(null)
        setCorrect(null)
        setTime(10)

    }

    function emitChoice(number) {
        selectChoice(number)
        socket.emit("rather", {id: userData["_id"], number}, () => {

        })
        setSubmitted(true)
    }



    return ( 
        <View style={styles.container}>
           <View style = {number == 0 ? styles.blackcont: styles.center}>
            {number == 0 && <Pressable style = {styles.gifcont} onPress = {() => goNext()}><Image style = {styles.gif} source = {require("../../photos/rather_gif.gif")}/></Pressable> }
            {number == 0 && <Text style = {styles.loading}> Loading </Text>}
            {number == 1 && 
            <View style = {styles.likely}>
                <View style = {styles.promptCont}>
                  <Text style = {styles.timer}> {time} </Text>
                    <AutoSizeText mode = {ResizeTextMode.group}  style = {styles.prompt}> {prompt && prompt["question"]} </AutoSizeText>
                </View>
                <View style = {styles.choices}>

                    <Pressable disabled = {choice != null} style = {choice == 1 ? styles.blueChoiceNot : styles.blueChoice } onPress = {() => emitChoice(0)}>
                        <Text style = {styles.choiceText}> {prompt && prompt["choices"][0]} </Text>
                     
                    </Pressable> 

                    <Pressable disabled = {choice != null} style = {choice == 0 ? styles.redChoiceNot: styles.redChoice} onPress = {() => emitChoice(1)}>
                        <Text style = {styles.choiceText}> {prompt && prompt["choices"][1]} </Text>
                  
                    </Pressable>    
                </View> 
            </View>}

            {admin && number == 1 && <Pressable onPress= {() => advance()} style = {styles.Button}><Text style = {styles.ButtonText}> See Results </Text></Pressable>}
            {!admin && submitted && number == 1 && <Pressable style = {styles.Button}><Text style = {styles.ButtonText}> Waiting for host... </Text></Pressable>}
            {number == 2 && results && 
            <Pressable style = {styles.answer} onPress = {() => nextGame()}>
                <Image style = {styles.question} source = {require("../../photos/question.png")} /> 
                {correct && <Text style = {styles.winnerText}> You were a part of the majority!  </Text>}
                {!correct && <Text style = {styles.winnerText}> You were the outlier.. :(  </Text>}

                {correct && <Text style = {styles.penalty}> Hand out {results["penalty"]} sips ! </Text>}
                {!correct && <Text style = {styles.penalty}> Take {results["penalty"]} sips ! </Text>}
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
        justifyContent: "center", 
        width: "100%"
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
        alignItems: "center", 
        width: "100%", 
    }, 
    discuss: {
        fontFamily: "Cotton", 
        fontSize: 40, 
        textAlign: "center"
    }, 
    promptCont: {
        height: "20%", 
        width: "100%",
        padding: "2%", 
        flex: 1,
    }, 
    prompt: {
        fontFamily: "Cotton", 
        textAlign: "center"
    },  
    choices: {
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-evenly", 
        width: "100%", 
        alignItems: "center", 
        height: "40%", 
        flex: 3, 
        marginTop: "10%"
    }, 
    blueChoice: { 
        flex: 1.5, 
        justifyContent: "center", 
        backgroundColor: "#3F89F9", 
        width: "100%"
    },  
    blueChoiceNot: { 
        flex: 1.5, 
        justifyContent: "center", 
        backgroundColor: "rgba(63, 137, 249, .3)", 
        width: "100%"
    },  
    redChoice: { 
        flex: 1.5, 
        justifyContent: "center", 
        backgroundColor: "#F15E5E", 
        width: "100%"
    },  
    redChoiceNot: { 
        flex: 1.5, 
        justifyContent: "center", 
        backgroundColor: "rgba(241, 94, 94, .3)", 
        width: "100%"
    },
    choiceText: {
        fontFamily: "Cotton", 
        fontSize: 35, 
        color: "white", 
        textAlign: "center"
    },
    timer: {
        color: "red", 
        alignSelf: "center", 
        fontFamily: "Cotton", 
        fontSize: 40
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
    rather: state.minigame.rather, 
    userData: state.home.user

})
}
const mapDispatchToProps = {setRather}

export default connect(mapStateToProps, mapDispatchToProps)(Rather);  