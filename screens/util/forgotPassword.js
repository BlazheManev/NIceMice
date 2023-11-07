// login file (firebase auth)

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Image, Dimensions } from "react-native";
import CustomButton from "../components/CustomButton";
const { width, height } = Dimensions.get("window");
import app from "./firebaseconfig";
import { COLORS } from "../colors/colors";
import CustomText from "../components/CustomText";

const auth = getAuth(app);

function ForgotPassword({ navigation }) {
  useEffect(() => {
    if (auth.currentUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome", userName: "John" }],
      });
    }
  });
  const [value, setValue] = useState({
    email: "",
    error: "",
  });
  const forgotPassword = async () => {
    if (value.email === "") {
      setValue({
        ...value,
        error: "Email is mandatory!",
      });
      return;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(value.email) === false) {
      setValue({
        ...value,
        error: "Email is not correct.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, value.email);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (er) {
      if (er.message === "Firebase: Error (auth/user-not-found).") {
        setValue({
          ...value,
          error: "User not found.",
        });
      }
    }
  };
  const styles = getStyles(width);


  return (
    <View style={styles.container}>
      <CustomText type="titleSec">
        Enter the email{"\n"}associated with your account.
      </CustomText>
      <View style={value.error ? styles.inputError : styles.inputView}>
        <TextInput
          textAlign={"left"}
          style={styles.TextInput}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setValue({ ...value, email: text })}
        />
      </View>

      <CustomText type="subtitleError">{value.error ? value.error : ""}</CustomText>
      <Image style={styles.image} source={require("../../assets/images/forgotPassword.png")} />
      <CustomButton
        title="Send recovery email"
        onPress={forgotPassword}
        type="primary"
      />
    </View>
  );
}
const getStyles = (screenWidth) => {
  if(screenWidth >= 600){
    return (StyleSheet.create({
      title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
      },
  
      image: {
        width: "70%",
        height: "30%"
      },
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    
      inputView: {
        borderRadius: 60,
        borderWidth: 1,
        borderColor: COLORS.primary,
        width: "80%",
        height: 60,
      },
    
      inputError: {
        borderRadius: 60,
        width: "80%",
        height: 60,
        borderColor: "#ff0033",
        borderWidth: 1,
      },
    
      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
    }));
  } else{
    return (StyleSheet.create({
      title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
      },

      image: {
        width: "80%",
        height: "30%"
      },
      container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      },
    
      inputView: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.primary,
        width: "80%",
        height: 45,
      },
    
      inputError: {
        borderRadius: 30,
        width: "80%",
        height: 45,
        borderColor: "#ff0033",
        borderWidth: 1,
      },
    
      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
    }));
  }
};

export default ForgotPassword;
