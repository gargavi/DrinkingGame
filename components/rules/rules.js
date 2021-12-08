import React, {useState} from "react"; 
import {Button, StyleSheet, View, Image, StatusBar, Text, TextInput, Pressable, ScrollView} from "react-native"; 
import {connect} from "react-redux"; 
import {Link} from "react-router-native";
import {setGames} from "../home/homeSlice";

function Rules({games, setGames}) {
    return ( 
        <View style={styles.container}>
            <Text style = {styles.title}> PiCALo </Text>
            <View style = {styles.games}>
                <Text style = {styles.gametitle}> Rules </Text>
                
                <ScrollView style = {styles.gameview}>
                    <Pressable style = {games["cheese_touch"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("cheese_touch")} }>
                        <Text style = {games["cheese_touch"] ? styles.selected_text: styles.text}> Cheese Touch </Text>
                    </Pressable>
                    <Pressable style = {games["random_characters"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("random_characters")} }>
                        <Text style = {games["random_characters"] ? styles.selected_text: styles.text}> Characters </Text>
                    </Pressable>
                    <Pressable style = {games["nsfw"] ? styles.pressed_button: styles.button} onPress = {() => {setGames("nsfw")} }>
                        <Text style = {games["nsfw"] ? styles.selected_text: styles.text}> NSFW </Text>
                    </Pressable>
                </ScrollView> 
            </View>
            <Link to = "/game" >
                <Text style = {styles.nextlink}> Next </Text> 
            </Link>
            <Link to = "/players">
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
    games: state.home.games
})
}
const mapDispatchToProps = {setGames}

export default connect(mapStateToProps, mapDispatchToProps)(Rules);  