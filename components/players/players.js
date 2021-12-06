import React, {useState} from "react"; 
import {Button, StyleSheet, View, Image, StatusBar, Text, TextInput, Pressable, ScrollView} from "react-native"; 
import {connect} from "react-redux"; 
import {Link} from "react-router-native";
import {setPlayers, removePlayer} from "../home/homeSlice";
import {useFonts, Inter_900Black} from "@expo-google-fonts/inter"
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faArrowRight} from "@fortawesome/free-solid-svg-icons"


function Players({setPlayers, players, removePlayer}) {
    const [name, setName] = useState("");


    function Submit() {
        setPlayers(name)
        setName("")
    }

    function remove(name) {
        removePlayer(name)
    }

    const player_names = players.map( (player, index) => {

        return(
           <View style = {styles.playercont} key = {index}> 
               <Text style = {styles.player}> {player}  </Text>
                <Pressable  onPress = {() => {remove(`${player}`)}}>
                    <Text style = {styles.remove}> X </Text>    
                </Pressable>
            </View> 
        )
    }
    )

    return ( 
        <View style={styles.container}>
            <Text style = {styles.title}> PiCALo </Text>
            <View style = {styles.games}>
                <Text style = {styles.gametitle}> All Players </Text>
                <View style = {styles.inputs}> 
                    <TextInput 
                        value = {name} 
                        placeholder = "Name"
                        onChangeText={ text => setName(text)}
                        style = {styles.nameBox}
                    />
                    <Pressable style = {styles.submit} onPress = {() => {Submit()}}> 
                        <Text style = {styles.submitText}> Submit </Text> 
                    </Pressable>
                </View>
                <View style = {styles.gameview}>
                    
                    {player_names}
                </View>
            </View>
            <Link to = "/gamerules" >
                <Text style = {styles.nextlink}> Next </Text> 
            </Link>
            <Link to = "/" >
                <Text style = {styles.prevlink}> Prev </Text> 
            </Link>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#f5d84c",
      height: "100%",
      padding: "10%",
      display: "flex",
      flexDirection: "column",
      textAlign: "center"
    },    
    title: {
        color: "#077dd1",
        borderStyle: "solid", 
        borderColor: "#077dd1",
        borderRadius: 10,
        borderWidth: 5,
        padding: "3%",
        paddingLeft: "10%",
        paddingRight: "10%",
        display: "flex",
        alignSelf: "center",
        fontSize: 50,
        fontFamily: 'Quicksand_600SemiBold'
    }, 
    games: {    
        display: "flex", 
        flexDirection: "column",
        height: "80%",
        textAlign: "center", 
        margin: "auto", 
        alignItems: "center",
        marginTop: "2%",
    }, 
    gametitle: {
        fontFamily: 'Quicksand_600SemiBold',
        fontSize: 30,
        marginBottom: "2%"
    },  
    gameview: {
        width: '50%',
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: "2%"

    },
    inputs: {
        display: "flex", 
        flexDirection: "row"
    },
    nameBox: {
        borderColor: "black",
        borderWidth: 2,
        width: "20%",
        textAlign: "center",
        padding: "1%"
    },
    submit: {
        backgroundColor: "blue",
        marginLeft: "1%", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    submitText: {
        color: "white"
    },
    playercont: {
        borderColor: "black", 
        borderStyle: "solid",
        borderWidth: 2, 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        borderRadius: 10,
        margin: "1%", 
        padding: "1%", 
    },
    player: {
        color: "#077dd1", 
        fontSize: 20,
        textAlign: "center",
    },
    remove: {
        color: "red"
    },
    nextlink: {
        fontSize: 20,
        backgroundColor: "#077dd1", 
        color: "white",
        padding: "2%", 
        position: "absolute",
        bottom: "10%",
        right: "20%"
    }, 
    prevlink: {
        fontSize: 20,
        backgroundColor: "#077dd1", 
        color: "white",
        padding: "2%", 
        position: "absolute",
        bottom: "10%",
        left: "20%"
    }
  });

const mapStateToProps = (state) => {
return ({
    players: state.home.players
})
}
const mapDispatchToProps = {setPlayers, removePlayer}

export default connect(mapStateToProps, mapDispatchToProps)(Players);  