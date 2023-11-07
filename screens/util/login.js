// login file (firebase auth)

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
  View,
  Dimensions,
  Platform,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { COLORS } from "../colors/colors";
const { width, height } = Dimensions.get("window");
import app from "./firebaseconfig";
import { useNavigation } from "@react-navigation/native";

const auth = getAuth(app);

function Login() {
  const navigation = useNavigation();
  useEffect(() => {
    if (auth.currentUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    }
  });
  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "",
  });

  const signIn = async () => {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: true,
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  };

  const styles = getStyles(width);

  return (
    <View style={styles.container}>
      {Platform.OS == "ios" ? (
        <KeyboardAvoidingView behavior="position">
          <CustomText type="titleSec">
            Good day!{"\n"}Sign in with your credentials.
          </CustomText>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.inputWrapper}>
              <View style={value.error ? styles.inputError : styles.inputView}>
                <TextInput
                  textAlign={"left"}
                  style={styles.TextInput}
                  placeholder="Email..."
                  placeholderTextColor="#003f5c"
                  onChangeText={(text) => setValue({ ...value, email: text })}
                />
              </View>
            </View>
            <View style={styles.inputWrapper2}>
              <View style={value.error ? styles.inputError : styles.inputView}>
                <TextInput
                  textAlign={"left"}
                  style={styles.TextInput}
                  placeholder="Password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(text) =>
                    setValue({ ...value, password: text })
                  }
                />
              </View>
            </View>
            <CustomText type="subtitleError">
              {value.error ? "Wrong email or password!" : ""}
            </CustomText>
            <View
              style={{
                width: "90%",
                alignItems: "flex-end",
                marginTop: -5,
                marginBottom: 10,
              }}
            >
              <CustomText
                type="subtitleLink"
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Forgot password?
              </CustomText>
            </View>
            <View style={styles.wrapper}>
              <CustomButton
                title="Login"
                width="90%"
                onPress={signIn}
                type="primary"
              />
            </View>
            <CustomText type="subtitle">
              Don't Have an account?{" "}
              <CustomText
                type="subtitleLink"
                onPress={() => navigation.navigate("Register")}
              >
                Sign up
              </CustomText>
            </CustomText>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ alignItems: "center", width: "100%" }}>
          <CustomText type="titleSec">
            Good day!{"\n"}Sign in with your credentials.
          </CustomText>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.inputWrapper}>
              <View style={value.error ? styles.inputError : styles.inputView}>
                <TextInput
                  textAlign={"left"}
                  style={styles.TextInput}
                  placeholder="Email..."
                  placeholderTextColor="#003f5c"
                  onChangeText={(text) => setValue({ ...value, email: text })}
                />
              </View>
            </View>
            <View style={styles.inputWrapper2}>
              <View style={value.error ? styles.inputError : styles.inputView}>
                <TextInput
                  textAlign={"left"}
                  style={styles.TextInput}
                  placeholder="Password..."
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(text) =>
                    setValue({ ...value, password: text })
                  }
                />
              </View>
            </View>
            <CustomText type="subtitleError">
              {value.error ? "Wrong email or password!" : ""}
            </CustomText>
            <View
              style={{
                width: "90%",
                alignItems: "flex-end",
                marginTop: -5,
                marginBottom: 10,
              }}
            >
              <CustomText
                type="subtitleLink"
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Forgot password?
              </CustomText>
            </View>
            <View style={styles.wrapper}>
              <CustomButton
                title="Login"
                width="90%"
                onPress={signIn}
                type="primary"
              />
            </View>
            <CustomText type="subtitle">
              Don't Have an account?{" "}
              <CustomText
                type="subtitleLink"
                onPress={() => navigation.navigate("Register")}
              >
                Sign up
              </CustomText>
            </CustomText>
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (screenWidth) => {
  if (screenWidth >= 600) {
    return (styles = StyleSheet.create({
      wrapper: {
        width: "100%",
        marginBottom: 10,
      },

      inputWrapper: {
        width: "100%",
        alignItems: "center",
        marginTop: height * 0.05,
        marginBottom: 10,
      },
      inputWrapper2: {
        width: "100%",
        alignItems: "center",
      },
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },

      inputView: {
        height: 60,
        borderColor: COLORS.dark,
        borderWidth: 1,
        width: "90%",
        borderRadius: 60,
      },

      inputError: {
        height: 60,
        borderColor: COLORS.danger,
        borderWidth: 1,
        width: "90%",
        borderRadius: 60,
      },

      TextInput: {
        height: 60,
        flex: 1,
        padding: 10,
        marginLeft: 10,
      },
    }));
  } else {
    return (styles = StyleSheet.create({
      wrapper: {
        width: "100%",
        marginBottom: 10,
      },

      inputWrapper: {
        width: "100%",
        alignItems: "center",
        marginTop: height * 0.05,
        marginBottom: 10,
      },
      inputWrapper2: {
        width: "100%",
        alignItems: "center",
      },
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },

      inputView: {
        height: 45,
        borderColor: COLORS.dark,
        borderWidth: 1,
        width: "90%",
        borderRadius: 45,
      },

      inputError: {
        height: 45,
        borderColor: COLORS.danger,
        borderWidth: 1,
        width: "90%",
        borderRadius: 45,
      },

      TextInput: {
        height: 45,
        flex: 1,
        padding: 10,
        marginLeft: 10,
      },
    }));
  }
};

export default Login;
