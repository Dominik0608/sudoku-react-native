import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, Modal, KeyboardAvoidingView, Dimensions, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { IP } from '../global';

const Sudoku = () => {
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState('');
  const [values, setValues] = useState([
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
    [[1, false], [2, false], [3, false], [4, false], [5, false], [6, false], [7, false], [8, false], [9, false]],
  ]);
  const [selected, setSelected] = useState(1);

  const [, forceUpdate] = useReducer((x) => !x, false)

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
    if (username.length === 0) { return false; }
    try {
      await AsyncStorage.setItem('username', username);
      setModal(false);
    } catch(e) {
      setUsername('Ismeretlen');
    }
  }

  const generateSudoku = async () => {
    axios.get(IP + 'generate')
      .then(function (response) {
        let matrix = response.data;
        for (let i = 0; i < matrix.length; i++) {
          const row = matrix[i];
          for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            row[j] = [cell, !cell];
          }
        }
        setValues(matrix);
        console.log('sudoku generated');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    generateSudoku();
  }, [])

  const changeValue = (row, column) => {
    let newValues = values;
    if (!newValues[row][column][1]) { return false; }

    newValues[row][column][0] = selected;
    setValues(newValues);
    forceUpdate(); // ha már máshogy nem akar frissülni a componens
  }

  const checkSudokuSolve = async () => {
    Toast.hide();
    axios.post(IP + 'checker', {
      username: username,
      sudoku: values
    })
    .then(function (response) {
      console.log(response.data);
      if (response.data) {
        generateSudoku();
        Toast.show({
          type: 'success',
          text1: 'Gratulálok, sikeres megoldás!',
          visibilityTime: 5000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sajnos nem sikerült helyesen megoldani.',
          visibilityTime: 5000,
        });
      }
    })
    .catch(function (error) {
      Toast.show({
        type: 'error',
        text1: 'Hiba történt a csatlakozás során!',
        text2: 'Kérlek próbálkozz később!',
        visibilityTime: 5000,
      });
    });
  }

  return(
    <KeyboardAvoidingView
      behavior={ Platform.OS == "ios" ? "padding" : "height" }
      style={{ marginTop: Constants.statusBarHeight, height: "100%", padding: 10 }}
    >
      <View style={{ flex: 1,  alignItems: 'center' }}>
        <Text style={{ margin: 20, fontSize: 26 }}>Helló, <Text style={{ color: "#0c63f0" }}>{username}</Text>!</Text>

        <View>
          {values.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row', borderBottomWidth: ((rowIndex === 2 || rowIndex === 5 ) ? 3 : 1) }}>
              {row.map((cell, cellIndex) => (
                <TouchableOpacity key={cellIndex} activeOpacity={cell[1] ? 0.2 : 1} onPress={ () => changeValue(rowIndex, cellIndex) }>
                  <View style={{ height: windowWidth/9, width: windowWidth/9, borderWidth: 1.1, margin: -0.1, borderRightWidth: ((cellIndex === 2 || cellIndex === 5) ? 3 : 1), borderColor: '#000', alignItems: 'center', justifyContent: 'center', backgroundColor: (cell[1] ? "#fff" : "#ccc") }}>
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
              <View style={{ height: windowWidth/9, width: windowWidth/9, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center', backgroundColor: selected === cell ? '#7ec9ff' : '#fff' }}>
                <Text style={{ fontSize: windowWidth/15 }} allowFontScaling={false}>{cell}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Button mode="contained" onPress={() => checkSudokuSolve()}>
          Ellenőrzés
        </Button>

      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modal}
        onRequestClose={() => {
          return false;
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ margin: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 22 }}>
              Üdvözöllek kedves idegen!
              {"\n"}
              Kérlek add meg a neved a játékhoz:
            </Text>
            <TextInput
              value={username}
              onChangeText={text => setUsername(text)}
              maxLength={40}
              style={{ textAlign: 'center', marginVertical: 10 }}
            />
            <Button mode="contained" onPress={() => setUser()}>
              Tovább
            </Button>
          </View>
        </View>
      </Modal>
      <Toast />
    </KeyboardAvoidingView>
  )
}

export default Sudoku;