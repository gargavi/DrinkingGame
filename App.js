import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as Font from "expo-font";
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from "react-redux";
import {NativeRouter, Route, Routes, Link} from "react-router-native";
import store from "./components/store/store";
import Home from "./components/home/home";
import socket from "./components/socket"
import Lobby from "./components/lobby/lobby"
import Create from "./components/create/create";
import Characters from "./components/characters/characters";
import Game from "./components/game/game";

//games Classic 
import Likely from "./components/game/minigames/likely"
import Rather from "./components/game/minigames/rather"
import Trivia from "./components/game/minigames/trivia"
import Die from "./components/game/die"
import Leader from "./components/game/leader"
import Category from "./components/game/minigames/categories"; 

//games Lite 
import LikelyLite from './components/game/minigames/likelyLite';
import RatherLite from "./components/game/minigames/ratherLite"; 
import CategoryLite from './components/game/minigames/categoryLite';
import NeverLite from "./components/game/minigames/neverLite"


import AppLoading from "expo-app-loading";

const fetchFonts = () => {
  return Font.loadAsync({
    "Cotton": require("./fonts/Cotton-Regular.ttf"), 
    "fontawesome": require("./fonts/fa-solid-900.ttf")
  })
}

export default function App() {
  const [dataload, setLoad] = useState(false)
  if (!dataload) {
    return <AppLoading
      startAsync={fetchFonts}
      onError={() => console.log("error")}
      onFinish = {() => setLoad(true)}
    
    />
  }

  return (
    <Provider store = {store} >
      <NativeRouter>
        <View>
          <Routes>
            <Route exact path = "/" element={<Home/>}/> 
            {/* <Route path = "/players" element={<Players/>}/>
            <Route path = "/gamerules" element = {<Rules/>} />
            */}
            <Route path = "/lobby" element = {<Lobby/>} />
            <Route path = "/create" element = {<Create/>} />
            <Route path = "/characters" element = {<Characters/>} />
            <Route path = "/leader" element = {<Leader/>}/> 
            <Route path = "/die" element = {<Die/>} /> 
            <Route path = "/trivia" element = {<Trivia/>} />
            <Route path = "/likely" element = {<Likely/>} />
            <Route path = "/likelylite" element = {<LikelyLite/>} /> 
            <Route path = "/rather" element = {<Rather/>} /> 
            <Route path = "/ratherlite" element = {<RatherLite/>} />
            <Route path = "/category" element = {<Category/>} />
            <Route path = "/categoryLite" element = {<CategoryLite/>} />
            <Route path = "/neverLite" element = {<NeverLite/>} />
          </Routes>
        </View>
        </NativeRouter>
    </Provider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
