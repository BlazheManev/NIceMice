import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useStripe } from "@stripe/stripe-react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { COLORS } from "../colors/colors";
import { addMonths } from "date-fns"; // Import the addMonths func
import { auth, db } from "../util/firebaseconfig"; // Import auth

import { push, ref, set } from "firebase/database";

const { width, height } = Dimensions.get("window");

function Register({ navigation }) {
  const [value, setValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    isErrorMail: false,
    isErrorPass: false,
    errorMsg: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const stripe = useStripe();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    if (auth.currentUser) {
      navigation.replace("Welcome", { userName: "John" });
    }
  }, []);

  const handleSubscribePress = () => {
    navigation.navigate("Subscription");
  };

  const signUpAndSubscribe = async () => {
    if (
      value.email === "" ||
      value.password === "" ||
      value.confirmPassword === ""
    ) {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
        isErrorMail: true,
        isErrorPass: true,
      });
      return;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(value.email) === false) {
      setValue({
        ...value,
        error: "Email is not correct.",
        isErrorMail: true,
        isErrorPass: false,
      });
      return;
    }

    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{}[\]:;'"|\\,.?<>]).{8,}$/;
    if (passwordRegex.test(value.password) === false) {
      setValue({
        ...value,
        error:
          "Password must contain at least 8 characters, one number and one special character.",
        isErrorMail: false,
        isErrorPass: true,
      });
      return;
    }

    if (value.password !== value.confirmPassword) {
      setValue({
        ...value,
        error: "Passwords do not match.",
        isErrorMail: false,
        isErrorPass: true,
      });
      return;
    }

    try {
      setIsLoading(true); // Show loading indicator

      const emailExists = await fetchSignInMethodsForEmail(auth, value.email);
      if (emailExists.length > 0) {
        // Email already exists, show a message to the user
        setValue({
          ...value,
          isErrorMail: true,
          isErrorPass: false,
          error: "",
          errorMsg: "Email is already in use. Please choose a different email.",
        });
        return;
      }
      // Subscription payment
      const response = await fetch(
        "https://stripe-backend-wo97.onrender.com/intent",
        {
          method: "POST",
          body: JSON.stringify({ name, amount: 1000 }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      // Initialize the Payment sheet
      const initResponse = await initPaymentSheet({
        merchantDisplayName: "notJust.dev",
        paymentIntentClientSecret: data.clientSecret,
        amount: 50,
      });
      if (initResponse.error) {
        setIsLoading(false); // Hide loading indicator
        console.log(initResponse.error);
        Alert.alert("Something went wrong");
        return;
      }

      // Present the Payment Sheet from Stripe
      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        Alert.alert(
          `Error code: ${paymentResponse.error.code}`,
          paymentResponse.error.message
        );
        return;
      }

      // Payment is successful, proceed with user registration
      try {
        // User registration
        await createUserWithEmailAndPassword(auth, value.email, value.password);

        // Calculate the startDate and endDate
        const startDate = new Date().toISOString();
        const endDate = addMonths(new Date(), 12).toISOString();

        const user = auth.currentUser;
        if (user) {
          // Save the subscription details to the Realtime Database
          const userId = user.uid;
          const subscriptionRef = ref(db, "users/" + userId + "/subscription");
          set(subscriptionRef, {
            startDate,
            endDate,
          })
            .then(() => {
              console.log("Subscription details saved to the database");
            })
            .catch((err) => {
              console.log("Error saving subscription details: ", err);
            });
        }

        // If payment is successful and user registered, navigate to Welcome screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      } catch (err) {
        // Handle user registration error, if any
        if (err.code === "auth/email-already-in-use") {
          setValue({
            ...value,
            isErrorMail: true,
            isErrorPass: false,
            error: "",
            errorMsg:
              "Email is already in use. Please choose a different email.",
          });
        } else if (!err.message.startsWith("Firebase: Error")) {
          console.error(err);
          Alert.alert("Something went wrong, try again later!");
        }
        // Add console.error to log the error details
      }
    } catch (error) {
      // Handle payment error, if any
      Alert.alert("Payment failed, please try again.");
    } finally {
      setIsLoading(false); // Hide loading indicator regardless of success or failure
    }
  };

  const styles = getStyles(width);

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="position">
          <View style={{ alignItems: "center", width: "100%" }}>
            <CustomText type="titleSec">
              Hello!{"\n"}Please register to continue.
            </CustomText>
            <View
              style={value.isErrorMail ? styles.inputError : styles.inputView}
            >
              <TextInput
                textAlign={"left"}
                style={styles.TextInput}
                placeholder="Email..."
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setValue({ ...value, email: text })}
              />
            </View>
            <CustomText type="subtitleError">
              {value.isErrorMail ? value.error : ""}
            </CustomText>
            <View
              style={value.isErrorPass ? styles.inputError : styles.inputView}
            >
              <TextInput
                textAlign={"left"}
                placeholder="Password..."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={(text) => setValue({ ...value, password: text })}
                style={styles.TextInput}
              />
            </View>
            <CustomText type="subtitleError">
              {value.isErrorPass ? value.error : ""}
            </CustomText>

            <View
              style={value.isErrorPass ? styles.inputError : styles.inputView}
            >
              <TextInput
                textAlign={"left"}
                style={styles.TextInput}
                placeholder="Confirm password..."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={(text) =>
                  setValue({ ...value, confirmPassword: text })
                }
              />
            </View>
            <CustomText type="subtitleError">
              {value.isErrorPass ? value.error : ""}
            </CustomText>
            <CustomText type="subtitleError">
              {value.errorMsg ? value.errorMsg : ""}
            </CustomText>
            <View style={styles.wrapper}>
              <CustomButton
                title="Register and Subscribe"
                width="90%"
                type="primary"
                onPress={signUpAndSubscribe}
              />
              {isLoading && <ActivityIndicator size="medium" color="#000" />}
            </View>
            <CustomText type="subtitle">
              Already have an account?{" "}
              <CustomText
                type="subtitleLink"
                onPress={() => navigation.navigate("Login")}
              >
                Sign in
              </CustomText>
            </CustomText>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ alignItems: "center", width: "100%" }}>
          <CustomText type="titleSec">
            Hello!{"\n"}Please register to continue.
          </CustomText>
          <View
            style={value.isErrorMail ? styles.inputError : styles.inputView}
          >
            <TextInput
              textAlign={"left"}
              style={styles.TextInput}
              placeholder="Email..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setValue({ ...value, email: text })}
            />
          </View>
          <CustomText type="subtitleError">
            {value.isErrorMail ? value.error : ""}
          </CustomText>
          <View
            style={value.isErrorPass ? styles.inputError : styles.inputView}
          >
            <TextInput
              textAlign={"left"}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(text) => setValue({ ...value, password: text })}
              style={styles.TextInput}
            />
          </View>
          <CustomText type="subtitleError">
            {value.isErrorPass ? value.error : ""}
          </CustomText>

          <View
            style={value.isErrorPass ? styles.inputError : styles.inputView}
          >
            <TextInput
              textAlign={"left"}
              style={styles.TextInput}
              placeholder="Confirm password..."
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(text) =>
                setValue({ ...value, confirmPassword: text })
              }
            />
          </View>
          <CustomText type="subtitleError">
            {value.isErrorPass ? value.error : ""}
          </CustomText>
          <CustomText type="subtitleError">
            {value.errorMsg ? value.errorMsg : ""}
          </CustomText>
          <View style={styles.wrapper}>
            <CustomButton
              title="Register and Subscribe"
              width="90%"
              type="primary"
              onPress={signUpAndSubscribe}
            />
            {isLoading && <ActivityIndicator size="medium" color="#000" />}
          </View>
          <CustomText type="subtitle">
            Already have an account?{" "}
            <CustomText
              type="subtitleLink"
              onPress={() => navigation.navigate("Login")}
            >
              Sign in
            </CustomText>
          </CustomText>
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

      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },

      TextInput: {
        height: 60,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },

      loginBtn: {
        width: "90%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: "lightblue",
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
    }));
  } else {
    return (styles = StyleSheet.create({
      title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
      },
      wrapper: {
        width: "100%",
        marginBottom: 10,
      },
      errorText: {
        color: "#ff0033",
        fontSize: 10,
        marginBottom: 10,
      },
      errorTextMsg: {
        color: "#ff0033",
        fontSize: 12,
        marginBottom: 10,
        marginTop: -10,
      },
      container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },

      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },

      loginBtn: {
        width: "90%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: "lightblue",
      },
      inputView: {
        height: 45,
        borderColor: COLORS.dark,
        fontSize: 16,
        lineHeight: 32,
        borderWidth: 1,
        width: "90%",
        borderRadius: 25,
      },

      inputError: {
        height: 45,
        borderColor: COLORS.danger,
        fontSize: 16,
        lineHeight: 32,
        borderWidth: 1,
        width: "90%",
        borderRadius: 25,
      },
    }));
  }
};

export default Register;
