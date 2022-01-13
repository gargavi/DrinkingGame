import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect, connectAdvanced} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../../home/homeSlice";
import socket from "../../socket.js";
import axios from "axios";
import endpoint from "../../endpoint";

import characters from "../../characters/character_info";

function Rather({roomData,name, players, admin}) {
    const [dice, setDice] = useState(null)
    const [number, setNumber] = useState(0)
    const [prompt, setPrompt] = useState(null)
    const [choice, selectChoice] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [results, setResults] = useState(null)
    const [correct, setCorrect] = useState(null)

    useEffect(() => {
        socket.on("advanceRather", (data) => {
            console.log(data)
            setResults(data)
            if ((choice in data["results"] && 1 - choice in data["results"] && data["results"][choice] >= data["results"][1 - choice]) || !(1 - choice in data["results"]) ) {
                setCorrect(true) 
            } else  {
                setCorrect(false)
            }
            
            setNumber(2)
        })

    }, [])

    function goNext() {
        setNumber(number + 1) 
        axios.get(endpoint + "all_rather.json").then(results => {
            setPrompt(results["data"][roomData["state"]["prompt"]])
        }).catch(err => {
            console.log(err)
        })
    }



    function advance() { 
        socket.emit("advanceRather", (data) => {
            if ("errors" in data) {
                console.log(data["errors"])
            }
        })
    }

    function nextGame() { 
        console.log("next")
        socket.emit("nextGame", () => {
        })
        setNumber(0)
        selectChoice(null)
        setSubmitted(null)
        setResults(null)
        setCorrect(null)

    }

    function emitChoice(number) {
        socket.emit("rather", {number}, () => {

        })
        setSubmitted(true)
    }


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
                <Text style = {styles.discuss}> Choose an Option </Text>
                <Text style = {styles.prompt}> {prompt && prompt["question"]} </Text>
                <View style = {styles.choices}>

                    <Pressable style = {styles.choice} onPress = {() => selectChoice(0)}>
                        <Text style = {styles.choiceText}> {prompt && prompt["choices"][0]} </Text>
                        {choice != null && choice == 0 && !submitted &&  <Pressable style = {styles.selectBtn} onPress = {() => emitChoice(0)}><Text style = {styles.selectBtnText}> Select </Text></Pressable>}
                       {choice != null && choice == 0 && submitted && <Text style = {styles.submitted}> Submitted </Text>}
         
                    </Pressable> 

                    <Pressable style = {styles.choice} onPress = {() => selectChoice(1)}>
                        <Text style = {styles.choiceText}> {prompt && prompt["choices"][1]} </Text>
                        {choice != null && choice == 1 && !submitted &&  <Pressable style = {styles.selectBtn} onPress = {() => emitChoice(1)}><Text style = {styles.selectBtnText}> Select </Text></Pressable>}
                       {choice != null && choice == 1 && submitted && <Text style = {styles.submitted}> Submitted </Text>}
         
                    </Pressable>    
                </View> 
            </View>}

            {admin && submitted && number == 1 && <Pressable onPress= {() => advance()} style = {styles.Button}><Text style = {styles.ButtonText}> See Results </Text></Pressable>}
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
        fontSize: 24, 
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
    admin: state.home.admin
})
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Rather);  