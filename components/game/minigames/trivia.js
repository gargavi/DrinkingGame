import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable, ImageBackground} from "react-native"; 
import {connect, connectAdvanced} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../../home/homeSlice";
import socket from "../../socket.js";
import axios from "axios";
import endpoint from "../../endpoint";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text"

import { setTrivia } from "./minigameSlice";
import characters from "../../characters/character_info";

function Trivia({roomData,name,setTrivia,userData, trivia, players, admin}) {
    const [number, setNumber] = useState(0)
    const [prompt, setPrompt] = useState(null)
    const [option, setChoice] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [correct, setCorrect] = useState(null)
    const [penalty, setPenalty] = useState(null)

    const [time, setTime] = useState(10)

    useEffect(() => {

        if (time <= 0) {
            if (timerId) {
                clearInterval(timerId)
                return ;    
            }
            setTimeout(() => {
                advance()
            }, 2000)
            return ;
        } 
        const timerId = setInterval(() => {
            setTime(time - 1)
        }, 1000)
        return () => clearInterval(timerId)

    }, [time])

    useEffect(() => {
        socket.on("advanceTrivia", (data) => {
            if ("errors" in data) {
                alert(data["errors"])
            } else {
                setNumber(2)
                setPenalty(data)
            }
        })
        return () => {}
    }, [])

    function goNext() {
        setNumber(number + 1) 

        if (trivia.length == 0) {
            axios.get(endpoint + "all_trivia.json").then(results => {
                setPrompt(results["data"][roomData["state"]["prompt"]])
                setTrivia(results["data"])
            }).catch(err => {
                console.log(err)
            })    
        } else {
            setPrompt(trivia[roomData["state"]["prompt"]])
        }
        setTime(10)
    }


    function selectChoice(choice) {
        setChoice(choice)
        setCorrect(choice.toLowerCase() == prompt["answer"].toLowerCase())
        setSubmitted(true)
    }


    function advance() { 
        socket.emit("advanceTrivia", {id: userData["_id"]}, (data) => {
            if ("errors" in data) {
                console.log(data["errors"])
            }
        })
        if (correct == null) {
            setCorrect(false)
        }
    }



    function nextGame() { 
        socket.emit("nextGame",{id: userData["_id"]}, () => {
        })
        setNumber(0)
        setSubmitted(null)
        setCorrect(null)
        setPenalty(null)
        setChoice(null)
        setTime(10)

    }



    const color_array = ["rgb(89, 156, 255)", "rgb(238, 76, 76)", "rgb(137, 82, 255)", "rgb(34, 139, 57)"]
    const color_array_op = ["rgba(89, 156, 255, .3)", "rgba(238, 76, 76, .3)", "rgba(137, 82, 255, .3)", "rgba(34, 139, 57, .3)"]
    let choices; 
    if (prompt) { 
        choices = prompt["choices"].map((choice, index) => {

            let temp_style;
            if (choice == option && submitted ) {
                temp_style = StyleSheet.create({color: {backgroundColor: color_array[index % color_array.length]}})
            } else if (submitted) { 
                temp_style = StyleSheet.create({
                    color: {
                        backgroundColor: color_array_op[index % color_array.length], 
                        color: "rgba(255, 255, 255, .3)", 
                        borderColor: "rgba(0, 0, 0, .3)"
                    }})
            } else {
                temp_style = StyleSheet.create({color: {backgroundColor: color_array[index % color_array.length]}})
            }
            var style_press = StyleSheet.compose(styles.choice, temp_style.color)
            let icon; 
            if (submitted) {
                if (choice == prompt["answer"]) {
                    icon =  <Text style = {styles.fontAwesome}> {String.fromCodePoint(0xf00c)} </Text>
                } else if (choice == option) {
                    icon =  <Text style = {styles.fontAwesomeX}> {String.fromCodePoint(0xf00d)} </Text>

                } 
            }
            
            
            return (
                <Pressable disabled = {time == 0} key = {index} onPress = {() => selectChoice(choice)} style = {style_press}>
                    <Text style = {styles.choiceText}> {choice}</Text>
                    {icon}
                </Pressable>
            )
        })
    }

    return ( 
        <View style={styles.container}>
           <View style = {number == 0 ? styles.blackcont: styles.center}>
            {number == 0 && <Pressable style = {styles.gifcont} onPress = {() => goNext()}><Image style = {styles.gif} source = {require("../../photos/trivia_gif.gif")}/></Pressable> }
            {number == 0 && <Text style = {styles.loading}> Loading </Text>}
            {number == 1 && 
            <View style = {styles.likely}>
                <View style = {styles.promptCont}>
                <Text style = {styles.timer}> {time} </Text>
                <AutoSizeText mode = {ResizeTextMode.group}  style = {styles.prompt}> {prompt && prompt["question"]} </AutoSizeText>
    
                </View>

                <View style = {styles.choices}>
                    {choices}
                </View> 
            </View>}

            {/* {time <= 0 && number == 1 && <Pressable onPress= {() => advance()} style = {styles.Button}><Text style = {styles.ButtonText}> Next </Text></Pressable>}
             */}
            {number == 2 && penalty && 
            <Pressable style = {styles.answer} onPress = {() => nextGame()}>
                {correct && 
                <View style = {styles.finalcont}>
                    <Text style = {styles.correcttitle}> Not Bad! </Text>
                    <Text style = {styles.support}> You're off the hook </Text>
                    <Image style = {styles.imageright} source = {require("../../photos/right.png")}/>
                </View>
                }
                {!correct && 
                <View style = {styles.finalcont}>
                    <ImageBackground source = {require("../../photos/wrong.png")} style = {styles.wrongback}>
                        <Text style = {styles.incorrecttitle}> Wrong! </Text>
                    </ImageBackground>
                    
                    <Text style = {styles.support}> Suck it up </Text>
                    <Text style = {styles.penalty}> Take <Text style = {styles.number}> {penalty["penalty"]} </Text> sips </Text>

                </View>
                }

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
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between"
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
        height: "70%", 
        width: "100%",
        flex: 4,
        alignItems: "center", 
    }, 
    discuss: {
        fontFamily: "Cotton", 
        fontSize: 40
    }, 
    wrongback: {
        height: 100,
        width: 100
    },
    promptCont: {
        height: "40%", 
        width: "100%",
        padding: "2%", 
        paddingTop: "10%",
        paddingBottom: "10%",
        flex: 1,
        backgroundColor: "white"
    }, 
    prompt: {
        fontFamily: "Cotton", 
        textAlign: "center"
    }, 
    timer: {
        color: "red", 
        alignSelf: "center", 
        fontFamily: "Cotton", 
        fontSize: 40
    }, 
    question: {
        height: "20%", 
        overflow: "visible"
    }, 
    choices: {
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-around", 
        width: "80%", 
        alignItems: "center", 
        paddingBottom: "40%",
        flex: 3
    }, 
    choice: { 
        alignItems: "center",
        backgroundColor: "#3F89F9", 
        borderRadius: 100, 
        borderColor: "black", 
        borderWidth: 4,
        width: 280, 
        height: 70, 
        marginTop: 70, 
        flexDirection: "row",
        textAlignVertical: "center", 
        justifyContent: "center"
    },  
    choiceText: {
        fontFamily: "Cotton", 
        fontSize: 40, 
        color: "white",
        textAlign: "center"
    },
    fontAwesome: {
        fontFamily: "fontawesome",
        color: "green", 
        fontSize: 30, 
    }, 
    fontAwesomeX: {
        fontFamily: "fontawesome",
        color: "red", 
        fontSize: 30, 
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
        height: "80%", 
        width: "100%"
    }, 
    finalcont: {
        width: "100%", 
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly"
    }, 
    correcttitle: {
        fontFamily: "Cotton", 
        fontSize: 60, 
        alignSelf: "center"
    },
    imageright: {
        position: "absolute", 
        left: 0, 
        top: "150%"
    }, 
    wrongback: {
        width: 290, 
        display: "flex",
        height: 218,
        alignSelf: "center",
        alignItems: "center", 
        justifyContent: "flex-end"
    }, 
    incorrecttitle: {
        height: "100%", 
        fontFamily: "Cotton", 
        fontSize: 60, 
        alignSelf: "center", 
        top: "35%",
        color: "white", 
        textAlign: "center",
        textAlignVertical: "center"
    },
    penalty: {
        fontFamily: "Cotton",
        fontSize: 64, 
        textAlign: "center"
    },
    number: { 
        color: "#3F89F9"
    },
    support: {
        fontFamily: "Cotton", 
        fontSize: 40, 
        alignSelf: "center", 
        textAlign: "center"
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
    trivia: state.minigame.trivia, 
    userData: state.home.user
})
}
const mapDispatchToProps = {setTrivia}

export default connect(mapStateToProps, mapDispatchToProps)(Trivia);  