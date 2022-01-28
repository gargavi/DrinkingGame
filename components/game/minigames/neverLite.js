import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, ImageBackground, Pressable} from "react-native"; 
import {connect, connectAdvanced} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../../home/homeSlice";
import socket from "../../socket.js";
import axios from "axios";
import endpoint from "../../endpoint";
import { setNever } from "./minigameSlice";
import {AutoSizeText, ResizeTextMode} from "react-native-auto-size-text"


function Never({roomData,setLikely, userData, never}) {
    const [number, setNumber] = useState(0)
    const [prompt, setPrompt] = useState(null)
    const [time, setTime] = useState(null)
    const [penalty, setPenalty] = useState(null)
    const [transition, setTransition] = useState(false)

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



    function goNext() {
        setNumber(number + 1) 
        if (never.length == 0) {
            axios.get(endpoint + "all_never.json").then(results => {
                setPrompt(results["data"][roomData["state"]["prompt"]])
                setNever(results["data"])
            }).catch(err => {
                console.log(err)
            })    
        } else {
            setPrompt(never[roomData["state"]["prompt"]])
        }
        setTime(30)
        setPenalty(roomData["state"]["penalty"])
    }

    function nextGame() {
        setTransition(true)
        setTimeout(() => {
            socket.emit("nextGame",{id: userData["_id"]}, () => {
            })    
            setNumber(0)
            setTime(30)
            setPenalty(null)
            setTransition(false)
        }, 2000)
    }


    return ( 
        <View style={styles.container}>
           <View style = {number == 0 ? styles.blackcont: styles.center}>
            {number == 0 && <Pressable style = {styles.gifcont} onPress = {() => goNext()}><Image style = {styles.gif} source = {require("../../photos/most_likely.gif")}/></Pressable> }
            {/* {number == 0 && <Text style = {styles.loading}> Loading </Text>} */}
            {number == 1 && 
            <View style = {styles.likely}>
                <Text style = {styles.time}> {time} </Text>
                <ImageBackground source = {require("../../photos/likelyback.png")} style = {styles.wrongback}>
                    <AutoSizeText mode={ResizeTextMode.group} style = {styles.prompt}> {prompt && prompt["question"]} </AutoSizeText>
                    </ImageBackground>            
                    {number == 1 && <Pressable onPress= {() => setNumber(2)} style = {styles.Button}><Text style = {styles.ButtonText}> Next </Text></Pressable>}
            
            </View>}
           {number == 2 && 
            <Pressable style = {styles.answer} onPress = {() => nextGame()}>
                    {/* <ImageBackground source = {require("../../photos/wrong.png")} style = {styles.wrongback}>
                        <Text style = {styles.incorrecttitle}> Wrong! </Text>
                    </ImageBackground>
                     */}
                    <Image source = {require("../../photos/question.png")}/>
                    <Text style = {styles.support}> You know who you are ...  </Text>
                    <Text style = {styles.penalty}> Take <Text style = {styles.number}> {penalty} </Text> sips </Text>
            </Pressable> 
            }
          
            {transition && <View style = {styles.endgifcont}><Image style = {styles.gif} source = {require("../../photos/transition.gif")}/></View> }

        
           </View>
        </View>
    )
}
const styles = StyleSheet.create({
    blackcont: {
        backgroundColor: "#FFE248",
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
    endgifcont: {
        position: "absolute",
        height: "100%", 
        width: "100%",
        zIndex: 1
    }, 
    likely: {
        display: "flex", 
        flexDirection: "column", 
        height: "80%", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
    }, 
    time: {
        color: "black", 
        fontFamily: "Cotton",
        fontSize: 40
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
    wrongback: {
        width: 337, 
        display: "flex",
        height: 227,
        alignSelf: "center",
        alignItems: "center", 
        justifyContent: "center", 
        padding: "2%"
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
    never: state.minigame.never, 
    userData: state.home.user
})
}
const mapDispatchToProps = {setNever}

export default connect(mapStateToProps, mapDispatchToProps)(Never);  