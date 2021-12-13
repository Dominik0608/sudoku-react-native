import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';
import Constants from "expo-constants";
import axios from 'axios';
import { IP } from '../global';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [refreshing] = useState(false);

  const updateLeaderboard = async () => {
    axios.get(IP + 'leaderboard')
      .then(function (response) {
        setUsers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    updateLeaderboard();
  }, [])

  return(
    <KeyboardAvoidingView
      behavior={ Platform.OS == "ios" ? "padding" : "height" }
      style={{ marginTop: Constants.statusBarHeight, padding: 10 }}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={updateLeaderboard}
          />
        }
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 26, marginBottom: 5, paddingHorizontal: 20, borderBottomWidth: 2, borderColor: '#0c63f0' }}>Játékot teljesítők</Text>
          {users.map((user, index) => (
            <Text key={user.id} style={{ fontSize: 20, backgroundColor: (index % 2 ? "#ccc" : "#ddd"), width: '100%', textAlign: 'center', padding: 5 }}>{user.name}</Text>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Leaderboard;