import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput
} from "react-native";

const { width, height } = Dimensions.get("window"); //View 의 윈도우 사이즈를 가져온다.

export default class ToDo extends Component {
  state = {
    isEditing: false, //수정화면 인지 아닌지,
    isCompleted: false,// 완성이됬는지 아닌지,
    toDoValue: ""
  };

  render() {
    const { toDoValue, isCompleted, isEditing } = this.state; //state값을 받아온다.
    const { text } = this.props; //props 값도 받아온다.

    return (
      <View style={styles.container}>{/* 메인 container 시작 */}
        <View style={styles.column}>{/* 가로로 배치한다. */}
          <TouchableOpacity onPress={this._toggleComplete}>{/* onPress 옵션을 넣으면, _toggleComplete를 실행한다. ß*/}
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle
              ]}  /* isCompleted가 참이면 completedCircle에 해당하는 스타일이 적용되고, 거짓이면 uncompletedCircle이 적용된다.*/
            />
          </TouchableOpacity>

          {isEditing ? (
            <TextInput /* isEditing이 true 일ㄷ 때, TextInput을 보여준다.*/
              style={[styles.input, styles.text, 
              isCompleted ? styles.completedText : styles.uncompletedText
                ]} /* isCompleted가 true이면 completedText를 아니면  uncompletedText 스타일을 적용한다.*/
                /* 이하는 TextInput 컴포넌트에 대한 기본적인 props 값들*/
                value={toDoValue}
                multiline={true}
                onChangeText={this._controllInput}
                returnKeyType={"done"}
                onBlur={this._finishEditing} /*onBlur는 text input이 blurred될 때 호출되는 콜백이다.*/
                /* 함수 형태의 props 이고 _finishEditing을 호출 */
              />
              ) : (
                <Text
                  style={[
                    styles.text,
                    isCompleted ? styles.completedText : styles.uncompletedText
                  ]}>
                  {text}
                </Text>
              )}              
        </View>

        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✅</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  _toggleComplete = () => {
    this.setState(prevState => {
      //toggle 버튼을 눌렀을 때, 이전 state 상에서 isCompleted 만 반대로 수정한다.
      return {
        isCompleted: !prevState.isCompleted
      };
    });
  };

  _startEditing = () => {
    const { text } = this.props;
    this.setState({ isEditing: true, toDoValue: text});
  };

  _finishEditing = () => {
    this.setState({
      isEditing: false
    });
  };

  _controllInput = text1 => {
    console.log(text1);
    this.setState({ toDoValue: text1 });
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20,
    marginLeft: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2,
    justifyContent: "space-between"
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 20,
    width: width / 2
  }
});