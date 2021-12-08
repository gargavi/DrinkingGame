import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from "react-redux";
import {NativeRouter, Route, Routes, Link} from "react-router-native";
import store from "./components/store/store";
import Home from "./components/home/home";
import Players from "./components/players/players";
import Rules from "./components/rules/rules";

import Game from "./components/game/game";

import {useFonts} from "@expo-google-fonts/inter"; 
import { 
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold 
} from '@expo-google-fonts/quicksand'
import AppLoading from "expo-app-loading";

export default function App() {
  let [fontsLoaded] = useFonts({
    Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold 
  });
  if (!fontsLoaded) {
    return <AppLoading/>
  }
  return (
    <Provider store = {store} >
      <NativeRouter>
        <View>
          <Routes>
            <Route exact path = "/" element={<Home/>}/> 
            <Route path = "/players" element={<Players/>}/>
            <Route path = "/gamerules" element = {<Rules/>} />
            <Route path = "/game" element = {<Game/>} />
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
