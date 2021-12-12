import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, Modal, ScrollView, FlatList, KeyboardAvoidingView, Dimensions, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from "expo-constants";

const Sudoku = () => {
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState('');
  const [values, setValues] = useState([
    [[1, true], [2, true], [3, true], [4, true], [5, true], [6, true], [7, true], [8, true], [9, true]],
    [[1, false], [2, true], [3, true], [4, true], [5, true], [6, true], [7, true], [8, true], [9, true]],
    [[1, true], [2, true], [3, false], [4, true], [5, true], [6, true], [7, true], [8, true], [9, true]],
    [[1, true], [2, true], [3, true], [4, true], [5, false], [6, true], [7, true], [8, true], [9, true]],
    [[1, true], [2, true], [3, true], [4, true], [5, true], [6, true], [7, true], [8, true], [9, true]],
    [[1, true], [2, false], [3, true], [4, true], [5, true], [6, true], [7, false], [8, true], [9, true]],
    [[1, true], [2, true], [3, true], [4, true], [5, true], [6, true], [7, true], [8, true], [9, true]],
    [[1, false], [2, true], [3, true], [4, true], [5, true], [6, true], [7, true], [8, true], [9, true]],
    [[1, true], [2, true], [3, true], [4, false], [5, true], [6, true], [7, true], [8, true], [9, false]],
  ]);
  const [, forceUpdate] = useReducer((x) => !x, false)

  const [selected, setSelected] = useState(1);
  const windowWidth = Dimensions.get('window').width - 20;

  useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if(username !== null) {
          setUsername(username);
        } else {
          setModal(true);
        }
      } catch(e) {
        setModal(true);
      }
    }

    getUsername();
  });

  const setUser = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      setModal(false);
    } catch(e) {
      setUsername('Ismeretlen');
    }
  }

  const changeValue = (row, column) => {
    let newValues = values;
    if (!newValues[row][column][1]) { return false; }

    newValues[row][column][0] = selected;
    setValues(newValues);
    forceUpdate(); // ha már máshogy nem akar frissülni a componens
  }

  return(
    <KeyboardAvoidingView
      behavior={ Platform.OS == "ios" ? "padding" : "height" }
      style={{ marginTop: Constants.statusBarHeight, height: "100%", padding: 10 }}
    >

    <SafeAreaProvider>
      {/* <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
        <View style={{ flex: 1,  alignItems: 'center' }}>
          <Text style={{ margin: 20, fontSize: 26 }}>Helló, {username}!</Text>

          <View>
            {values.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: 'row', borderBottomWidth: ((rowIndex === 2 || rowIndex === 5 ) ? 3 : 1) }}>
                {row.map((cell, cellIndex) => (
                  <TouchableOpacity key={cellIndex} activeOpacity={cell[1] ? 0.2 : 1} onPress={ () => changeValue(rowIndex, cellIndex) }>
                    <View style={{ height: windowWidth/9, width: windowWidth/9, borderWidth: 1, borderRightWidth: ((cellIndex === 2 || cellIndex === 5) ? 3 : 1), borderColor: '#000', alignItems: 'center', justifyContent: 'center', backgroundColor: (cell[1] ? "#fff" : "#ccc") }}>
                      <Text style={{ fontSize: windowWidth/15, color: (cell[1] ? "#000" : "#f00") }} allowFontScaling={false}>{cell[0]}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cell, cellIndex) => (
              <TouchableOpacity key={cellIndex} onPress={ () => setSelected(cell) }>
                <View style={{ height: windowWidth/9, width: windowWidth/9, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center', backgroundColor: selected === cell ? '#6eb9ff' : '#fff' }}>
                  <Text style={{ fontSize: windowWidth/15 }} allowFontScaling={false}>{cell}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Button mode="contained" onPress={() => console.log('asd')}>
            Ellenőrzés
          </Button>

        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modal}
          onRequestClose={() => {
            setModal(!modal);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ margin: 20 }}>
              <Text style={{ textAlign: 'center' }}>Üdvözöllek kedves idegen!</Text>
              <Text style={{ textAlign: 'center' }}>Kérlek add meg a neved a játékhoz:</Text>
              <TextInput
                value={username}
                onChangeText={text => setUsername(text)}
              />
              <Button mode="contained" onPress={() => setUser()}>
                Tovább
              </Button>
            </View>
          </View>
        </Modal>
      {/* </ScrollView> */}
    </SafeAreaProvider>
    </KeyboardAvoidingView>
  )
}

export default Sudoku;