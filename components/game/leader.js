import React, {useState, useEffect} from "react"; 
import {StyleSheet, View, KeyboardAvoidingView, Image, Text, TextInput, Pressable} from "react-native"; 
import {connect} from "react-redux"; 
import {useNavigate} from "react-router-native";
import {} from "../home/homeSlice";
import socket from "../socket.js";

function Leader({roomData, userData, socketid,name }) {
    const history = useNavigate(); 
    const [dice, setDice] = useState(null)
    
    useEffect(() => {
        socket.on("dice", (data) => {
            setDice(data["value"])
        })

        return () => {}
    }, [])

    function goNext() { 
        socket.emit("nextGame",{id: userData["_id"]}, (data) => {
            if ("errors" in data) {
                alert(data["errors"])
            }
        })
    }


    return ( 
        <View style={styles.container}>
           <View style = {styles.center}>
            
            <Text style = {styles.leaderboard}> This will be the leaderboard </Text>
           <Pressable style = {styles.Button} onPress = {() => goNext()}><Text style = {styles.ButtonText}> Next Game </Text></Pressable>
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
        justifyContent: "space-evenly"
    }, 
    leaderboard: {
        fontSize: 80, 
        textAlign: "center", 
        fontFamily: "Cotton"
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
    name: state.home.name,
    userData: state.home.user
})
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Leader);  