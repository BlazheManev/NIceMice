//datoteka za izbero vrste računa med starševskim in child

import React, { Children, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { COLORS } from "../colors/colors.js";
import CustomButton from "../components/CustomButton.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut, getAuth } from "firebase/auth";
import app from "../util/firebaseconfig";
const auth = getAuth(app);
import { db } from "../util/firebaseconfig";
import {
  off,
  onValue,
  ref,
  remove,
  runTransaction,
  get,
  update,
} from "firebase/database";
import CustomText from "../components/CustomText.js";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");

function Switch({ navigation }) {
  const [children, setChildren] = useState([]);
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();

  const getExpoPushTokenAndSaveToFirebase = async (userEmail) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission is not granted, ask for permission
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission is still not granted, display an error message
    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted.');
    } else {
      console.log('Notification permission granted.');
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: "82cbecf8-e6ad-47a3-b896-4b359349ed8b", //SPREMENI ID
        });

        const token = tokenData.data;
        // Save the Expo Push Token to the database for the current user
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userRef = ref(db, 'users/' + userId);
          const snapshot = await get(userRef);
          const userData = snapshot.exists() ? snapshot.val() : {};

          let expoPushTokens = userData.expoPushTokens || [];

          if (!expoPushTokens.includes(token)) {
            // Add the new token to the array if it doesn't already exist
            expoPushTokens.push(token);
          }

          // Save the updated array of Expo Push Tokens to the database
          await update(userRef, { expoPushTokens });
          console.log('Expo Push Token saved to Firebase:', token);
        }
      } catch (error) {
        console.error('Error getting Expo Push Token:', error);
      }
    }
  };
  const checkSubscription = async () => {
    try {
      const data = await AsyncStorage.getItem("subscription");
      const parsedData = JSON.parse(data);

      const { email, isSubscriptionExpired } = parsedData;
      console.log(data);
      if (isSubscriptionExpired === true) {
        navigation.navigate("Subscription");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkParentStatus = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        const { parent } = userData;

        if (parent === "true") {
          navigation.navigate("Parent");
        } else if (parent === "false") {
          navigation.navigate("ChildPicker");
        }
      } else {
        // If no userData is found in AsyncStorage, navigate to a default screen or handle the case accordingly.
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkSubscription();
    getExpoPushTokenAndSaveToFirebase();
    checkParentStatus();
  }, [isFocused]);

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      const childRef = ref(db, `users/${userId}/children`);
      const childListener = onValue(childRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const itemsArray = Object.keys(data).map((key) => {
            return { ...data[key], id: key };
          });
          setChildren(itemsArray);
        } else {
          console.log("No items available");
        }
      });

      // Cleanup function
      return () => {
        off(childRef, "value", childListener);
      };
    }
  }, [db]);

  useEffect(() => {
    const outputArray = children.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    setItems(outputArray);
  }, [children]);

  const handleParentPress = async () => {
    const data = {
      parent: "true",
    };
    await AsyncStorage.setItem("userData", JSON.stringify(data));
    navigation.navigate("Parent");
  };

  const handleChildPicker = async () => {
    const data = {
      parent: "false",
    };
    await AsyncStorage.setItem("userData", JSON.stringify(data));
    navigation.navigate("ChildPicker");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <CustomText type="title">I am...</CustomText>
      </View>
      <View style={styles.wrapper}>
        <View style={{ width: "100%", marginBottom: 10 }}>
          <CustomButton
            title="a Child"
            onPress={handleChildPicker}
            type="primary"
            width="90%"
          />
        </View>
        <CustomButton
          title="a Parent"
          onPress={handleParentPress}
          type="secondary"
          width="90%"
        />
      </View>
      <Image
        style={styles.image}
        source={require("../../assets/images/parenthood.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  wrapper: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
});

export default Switch;
