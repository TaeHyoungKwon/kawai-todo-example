import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  TextInput, 
  Dimensions,
  Platform,
  AsyncStorage } from 'react-native';
import { AppLoading } from "expo";
import ToDo from "./ToDo.js"
import uuidv1 from "uuid/v1";

import { ScrollView } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  
  state = {
    newToDo: "",//새롭게 추가되는 할일 리스트
    loadedToDos: false, // toDo가 로드가 되었는지 여부
    toDos: {} // 할일 리스트 객체
  };

  //컴포넌트가 만들어지고 첫 렌더링을 마친후 실행되는 메소드
  componentDidMount = () => {
    this._loadToDos();
  }

  render() {

    const { newToDo, loadedToDos, toDos } = this.state; //state 값으로 newToDo를 받는다.

    if (!loadedToDos) {
      return <AppLoading/>;
    }

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
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map(toDo =>(
              <ToDo 
                key={toDo.id}
                deleteToDo={this._deleteToDo}
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
                {...toDo}
                />
            ))}
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
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      console.log(toDos);
      const parsedToDos = JSON.parse(toDos);
      this.setState({ loadedToDos: true, toDos: parsedToDos });
    } catch (err) {
      console.log(err);
    }
  };

  _addToDo = () => {
    const { newToDo } = this.state; // _controllNewToDo를 통해 실시간으로 바뀌는 newToDo state를 받는다.
    
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };

        console.log({...newToDoObject})

        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _uncompleteToDo = id => {    
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], 
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }

  _updateToDo = (id, text) => {
    console.log("dfasdf")
    console.log(text);
    this.setState(prevState => {
      console.log(prevState);
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], text: text }
        }
      };

      console.log(newState);
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  //_saveToDos - 저장과 관련된 일을 하는데, 인자 값으로 newToDos를 받는다.
  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
    console.log(newToDos);
    console.log(JSON.stringify(newToDos));
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
