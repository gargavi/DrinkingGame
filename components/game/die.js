import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../home/homeSlice";
import socket from "../socket.js";

function Dice({roomData, socketid,name }) {
    const history = useNavigate(); 
    const [dice, setDice] = useState(null)
    
    useEffect(() => {
        socket.on("dice", (data) => {
            setDice(data["value"])
        })

        return () => {}
    }, [])


    function rollDice() {
        socket.emit("dice",(data) => {
            setDice(data["value"])
        } )
    }

    function goNext() { 
        socket.emit("updateInfo", (data) => {
            if ("errors" in data) {
                alert(data["errors"])
            }
        })
    }

    return ( 
        <View style={styles.container}>
           <View style = {styles.center}>
            <View style = {styles.viewSec}> 
                <Text style = {styles.titleText}>It is {roomData["turn"]}'s turn to roll </Text>
            </View>
            <View style = {styles.viewSec}>
                <Text style = {styles.dice}> {dice == null ? "No Roll Yet": dice} </Text>
            </View>
            <View style = {styles.viewSec}>
                {name == roomData["turn"] && dice == null &&  <Pressable style = {styles.Button} onPress = {() => rollDice()}><Text style = {styles.ButtonText}> Roll </Text></Pressable>}
                {dice != null &&  <Pressable style = {styles.Button} onPress = {() => goNext()}><Text style = {styles.ButtonText}> Next </Text></Pressable>}
            </View>
           </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFE248",
        height: "100%",
        padding: "10%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
    },    
    center: {
        display: "flex",
        flex: 3,
        width: "100%",
        height: "70%",
        flexDirection: "column",
        textAlign: "center", 
        alignItems: "center", 
        justifyContent: "flex-start"
    }, 
    viewSec: {
        flex: 1, 
        flexDirection: "column",
        justifyContent: "center",

    }, 
    titleText: {
        fontFamily: "Cotton", 
        fontSize: 40, 
    }, 
    dice: {
        fontFamily: "Cotton", 
        fontSize: 60
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

  });

const mapStateToProps = (state) => {
return ({
    roomData: state.home.roomData,
    socketid: state.home.socket, 
    name: state.home.name
})
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Dice);  