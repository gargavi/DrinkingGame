import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {setPlayers, setRoomData, } from "../home/homeSlice";
import socket from "../socket.js";
import Dice from "./die";
import Likely from "./minigames/likely";


function Game({setRoomData, setPlayers, roomData}) {
    const history = useNavigate(); 


    useEffect(()=> { 



        return () => {}
    }, [])

    return ( 
        <View style={styles.container}>
           {/* {roomData != null && roomData["state"] && 
            <View>
            <Text> 
            {roomData["state"]["name"]}   
            </Text>
            <Text> 
            {roomData["state"]["prompt"]}   
            </Text>
            </View>
            } */}
            {roomData != null && roomData["state"] && roomData["state"]["name"] != "dice" && <Likely/>}
            {roomData != null && roomData["state"] && roomData["state"]["name"] == "dice" && <Dice/>}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFE248",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start"
    },    

  });

const mapStateToProps = (state) => {
return ({
    roomData: state.home.roomData
})
}
const mapDispatchToProps = {setRoomData, setPlayers}

export default connect(mapStateToProps, mapDispatchToProps)(Game);  