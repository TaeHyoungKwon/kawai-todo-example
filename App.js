import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions,Platform } from 'react-native';
import ToDo from "./ToDo.js"

import { ScrollView } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  
  state = {
    newToDo: ""//새롭게 추가되는 할일 리스트
  };

  render() {

    const { newToDo } = this.state; //state 값으로 newToDo를 받는다.

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}> Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"}
            value={newToDo}
            onChangeText={this._controllNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            <ToDo text={"Hello I'm a ToDo"} /> 
          </ScrollView>
        </View>
      </View>
    );
  }
  _controllNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 40,
    fontWeight: "200",
    marginBottom: 50,
  },
  card:{
    backgroundColor: "white",
    flex: 1,
    width: width -25,
    borderTopLeftRadius:10,
    borderTopRightRadius: 10,
    ...Platform.select({
        ios: {
          shadowColor: "rgb(50,50,50)",
          shadowOpacity: 0.5,
          shadowRadius: 15,
          shadowOffset:{
            height:1,
            width: 0
          }
        },
        android: {
          elevation: 3
        }

      })
  },
  input: {
    padding: 20,
    borderBottomColor:"#bbb",
    borderBottomWidth: 1,
    fontSize: 25,
  },
  todos: {
    alignItems: "center"
  }
});
