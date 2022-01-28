
import {useNavigate} from "react-router-native"
import { StyleSheet } from "react-native";

const routerDict = {
    "lite": {
        "Most Likely": "/likelylite", 
        "Trivia Drink": "/trivia", 
        "Would You Rather": "/ratherlite", 
        "Categories": "/categoryLite",
        "dice": "/die", 
        "leader": "/leader"
    }, 
    "classic": {
        "Most Likely": "/likely", 
        "Trivia Drink": "/trivia", 
        "Would You Rather": "/rather", 
        "dice": "/die", 
        "leader": "/leader",
        "Categories": "/category"
    }
}

const liteStyles = StyleSheet.create({
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


export {routerDict, liteStyles}