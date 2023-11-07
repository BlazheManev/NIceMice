// tukaj starš nardi task ki se shrani na friebase

import { useNavigation } from "@react-navigation/native";
import { push, ref, set } from "firebase/database";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../util/firebaseconfig"; // Import auth
import CustomButton from "../components/CustomButton";

function AddChild() {
  const [name, setName] = useState("");
  const navigation = useNavigation();

  const addChild = () => {
    if (name && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newChildRef = ref(db, "users/" + userId + "/children/");
      push(newChildRef, {
        name: name,
      })
        .then(() => {
          navigation.navigate("Switch");
          setName(""); // clear the input
        })
        .catch((error) => {
          console.error("Error creating task: ", error);
        });
    } else {
      console.log("Task is empty or user is not authenticated");
    }
  };

  return (
    <Modal>
      <View style={styles.container}>
        <Text style={styles.title}>Enter the name of your child.</Text>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={setName}
            textAlign={"left"}
            style={styles.TextInput}
            placeholder="Name..."
            placeholderTextColor="#003f5c"
          />
        </View>

        <View style={styles.wrapper}>
          <CustomButton title="ADD A KID" onPress={addChild} type="dark" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "#ff0033",
    fontSize: 12,
    marginBottom: 10,
    marginTop: -15,
  },
  wrapper: {
    width: "100%",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  inputView: {
    backgroundColor: "#f8f8f8",
    borderRadius: 30,
    width: "80%",
    height: 45,
    marginBottom: 20,
  },

  inputError: {
    backgroundColor: "#f8f8f8",
    borderRadius: 30,
    width: "80%",
    height: 45,
    borderColor: "#ff0033",
    borderWidth: 1,
    marginBottom: 20,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
});

export default AddChild;
