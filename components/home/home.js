import React from "react"; 
import {Button, StyleSheet, View, Image, StatusBar, Text, Pressable, ScrollView} from "react-native"; 
import {connect} from "react-redux"; 
import {Link} from "react-router-native";
import {setPlayers, setGames} from "./homeSlice";
import {useFonts, Inter_900Black} from "@expo-google-fonts/inter"
import { produceWithPatches } from "immer";

function Home({games, setGames, setPlayers}) {

    return ( 
        <View style={styles.container}>
            <Text style = {styles.title}> PiCALo </Text>
            <View style = {styles.games}>
                <Text style = {styles.gametitle}> All Games </Text>
                
                <ScrollView style = {styles.gameview}>
                    <Pressable style = {games["most_likely"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("most_likely")} }>
                        <Text style = {games["most_likely"] ? styles.selected_text: styles.text}> Most Likely </Text>
                    </Pressable>
                    <Pressable style = {games["number_game"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("number_game")} }>
                        <Text style = {games["number_game"] ? styles.selected_text: styles.text}> Number Game </Text>
                    </Pressable>
                    <Pressable style = {games["trivia"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("trivia")} }>
                        <Text style = {games["trivia"] ? styles.selected_text: styles.text}> Trivia </Text>
                    </Pressable>
                    <Pressable style = {games["quickdraw"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("quickdraw")} }>
                        <Text style = {games["quickdraw"] ? styles.selected_text: styles.text}> Quick Draw </Text>
                    </Pressable>
                    <Pressable style = {games["drive"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("drive")} }>
                        <Text style = {games["drive"] ? styles.selected_text: styles.text}> Driving Game </Text>
                    </Pressable>
                    
                </ScrollView>
            </View>
            <Link to = "/players" >
                    <Text style = {styles.link}> Next </Text> 
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
        width: '50%'
    },  
    pressed_button: {
        backgroundColor: "#077dd1",
        borderStyle: "solid", 
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 5,
        width: "50%",
        alignItems: "center",
        padding: '2%',
        display: "flex",
        alignSelf: "center",
        marginTop: "2%"
    },
    selected_text: {
        fontSize: 20,
        fontFamily: 'Quicksand_700Bold',
        fontWeight: "700",
        color: "white"
    },
    button: {
        backgroundColor: "white",
        color: "black",
        borderStyle: "solid", 
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 2,
        width: "50%",
        alignItems: "center",
        padding: '3%',
        display: "flex",
        alignSelf: "center",
        marginTop: "2%"
    },
    text: {
        fontSize: 20,
        fontFamily: 'Quicksand_400Regular',
        fontWeight: "700"
    },
    image : {
      resizeMode: "contain", 
      width: "100%"
    },
    link: {
        fontSize: 20,
        backgroundColor: "#077dd1", 
        color: "white",
        padding: "2%", 
        position: "absolute",
        bottom: "10%",
        right: "20%"
    }
  });

const mapStateToProps = (state) => {
return ({
    games: state.home.games
})
}
const mapDispatchToProps = {setPlayers, setGames}

export default connect(mapStateToProps, mapDispatchToProps)(Home);  