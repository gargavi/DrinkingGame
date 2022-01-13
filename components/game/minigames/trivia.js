import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect, connectAdvanced} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../../home/homeSlice";
import socket from "../../socket.js";
import axios from "axios";
import endpoint from "../../endpoint";

import characters from "../../characters/character_info";

function Trivia({roomData,name, players, admin}) {
    const [dice, setDice] = useState(null)
    const [number, setNumber] = useState(0)
    const [prompt, setPrompt] = useState(null)
    const [option, setChoice] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [correct, setCorrect] = useState(null)
    const [penalty, setPenalty] = useState(null)

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
        axios.get(endpoint + "all_trivia.json").then(results => {
            setPrompt(results["data"][roomData["state"]["prompt"]])
            
        }).catch(err => {
            console.log(err)
        })
    }


    function selectChoice(choice) {
        console.log(choice)
        setCorrect(choice.toLowerCase() == prompt["answer"].toLowerCase())
        setSubmitted(true)
    }


    function advance() { 
        socket.emit("advanceTrivia", (data) => {
            if ("errors" in data) {
                console.log(data["errors"])
            }
        })
    }



    function nextGame() { 
        socket.emit("nextGame", () => {
        })
        setNumber(0)
        setSubmitted(null)
        setCorrect(null)
        setPenalty(null)
        setChoice(null)

    }




    let choices; 
    if (prompt) { 
        choices = prompt["choices"].map((choice, index) => {

            return (
                <Pressable onPress = {() => setChoice(index)} style = {styles.choice}>
                    <Text style = {styles.choiceText}> {choice}</Text>
                    {index == option && !submitted &&  <Pressable style = {styles.selectBtn} onPress = {() => selectChoice(choice)}><Text style = {styles.selectBtnText}> Select </Text></Pressable>}
                    {index == option && submitted && <Text style = {styles.submitted}> Submitted </Text>}
                </Pressable>
            )
        })
    }

    return ( 
        <View style={styles.container}>
           <View style = {number == 0 ? styles.blackcont: styles.center}>
            {number == 0 && <Pressable style = {styles.gifcont} onPress = {() => goNext()}><Image style = {styles.gif} source = {require("../../photos/most_likely.gif")}/></Pressable> }
            {number == 0 && <Text style = {styles.loading}> Loading </Text>}
            {number == 1 && 
            <View style = {styles.likely}>
                <Text style = {styles.discuss}> Choose an Option </Text>
                <Text style = {styles.prompt}> {prompt && prompt["question"]} </Text>
                <View style = {styles.choices}>
                    {choices}
                </View> 
            </View>}

            {admin && submitted && number == 1 && <Pressable onPress= {() => advance()} style = {styles.Button}><Text style = {styles.ButtonText}> See Results </Text></Pressable>}
            
            {number == 2 && penalty && 
            <Pressable style = {styles.answer} onPress = {() => nextGame()}>
                <Image style = {styles.question} source = {require("../../photos/question.png")} /> 
                {correct && <Text style = {styles.winnerText}> Correct!  </Text>}
                {!correct && <Text style = {styles.winnerText}> Incorrect!  </Text>}

                {correct && <Text style = {styles.penalty}> Hand out {penalty["reward"]} sips ! </Text>}
                {!correct && <Text style = {styles.penalty}> Take {penalty["penalty"]} sips ! </Text>}
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
    question: {
        height: "20%", 
        overflow: "visible"
    }, 
    choices: {
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        width: "80%", 
        alignItems: "center", 
        height: "40%"
    }, 
    choice: { 
        alignItems: "center",
        backgroundColor: "#3F89F9", 
        borderRadius: 100, 
        borderColor: "black", 
        overflow: "hidden",
        borderWidth: 2, 
        borderStyle: "solid", 
        height: 150, 
        width: 150, 
        alignItems: "center", 
        padding: 20,
        justifyContent: "flex-start"
    },  
    choiceText: {
        fontFamily: "Cotton", 
        fontSize: 30, 
        color: "white", 
        textAlign: "center"
    },
    selectBtn: {
        position: "absolute", 
        bottom: "30%", 
        zIndex: 1, 
        width: 150,
        padding: "3%",
        alignItems: "center",
        backgroundColor: "rgba(255, 2555, 255, .9)", 
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
        width: 150,
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
    admin: state.home.admin
})
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Trivia);  