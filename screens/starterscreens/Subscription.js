import React, { useState } from "react";
import {
  Button,
  View,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { auth, db } from "../util/firebaseconfig";
import CustomText from "../components/CustomText";
import { addMonths } from "date-fns"; // Import the addMonths func
import { push, ref, set } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../colors/colors";
import CustomButton from "../components/CustomButton";
import { Shadow } from "react-native-shadow-2";
const { width, height } = Dimensions.get("window");

function Subscription() {
  const [name, setName] = useState("");
  const stripe = useStripe();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const navigation = useNavigation();

  const subscribe = async () => {
    try {
      // sending request
      email = auth.currentUser;
      const response = await fetch(
        "strikeURL",
        {
          method: "POST",
          body: JSON.stringify({ email, amount: 1000 }), //  (5 USD = 500 cents)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      // 2. Initialize the Payment sheet
      console.log(data);
      const initResponse = await initPaymentSheet({
        merchantDisplayName: "notJust.dev",
        paymentIntentClientSecret: data.clientSecret,
        amount: 50,
      });
      if (initResponse.error) {
        console.log(initResponse.error);
        Alert.alert("Something went wrong");
        return;
      }

      // 3. Present the Payment Sheet from Stripe
      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        Alert.alert(
          `Error code: ${paymentResponse.error.code}`,
          paymentResponse.error.message
        );
        return;
      }

      // 4. If payment ok -> create the order

      try {
        // User registration

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
          routes: [{ name: "Welcome", userName: "John" }],
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
      }
    } catch (error) {
      console.error("Payment failed: ", error);
      // Handle payment error, if any
      Alert.alert("Payment failed, please try again.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Shadow
        corners={{ topStart: false, topEnd: false, bottomStart: false }}
        sides={{ top: false, start: false }}
        distance={5}
        paintInside={false}
      >
        <View style={styles.container}>
          <CustomText type="regular">
            Your subscription expired.{"\n"}Please subsrcibe to regain access of
            the app.
          </CustomText>
          <View style={styles.wrapper}>
            <CustomButton
              title="Subscribe"
              type="primary"
              width="100%"
              onPress={() => subscribe()}
            />
          </View>
        </View>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.light,
    padding: 20,
    width: width * 0.9,
  },
  wrapper: {
    marginBottom: 5,
    marginTop: 10,
  },
});

export default Subscription;
