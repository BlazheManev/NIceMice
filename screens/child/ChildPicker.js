import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import CustomButton from "../components/CustomButton.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut, getAuth } from "firebase/auth";
import Modal from "react-native-modal";
import app from "../util/firebaseconfig";
const auth = getAuth(app);
import { db } from "../util/firebaseconfig";
import { off, onValue, ref, push, get, update } from "firebase/database";
import CustomText from "../components/CustomText.js";
const { width, height } = Dimensions.get("window");
import { Shadow } from "react-native-shadow-2";
import { COLORS } from "../colors/colors.js";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

function ChildPicker({ navigation }) {
  const [children, setChildren] = useState([]);
  const [name, setName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [change, setChange] = useState(false);
  const [error, setError] = useState("");

  const characterChecker = async (child, childName) => {
    await AsyncStorage.setItem("childId", child);
    await AsyncStorage.setItem("childName", childName);
    console.log(child);
    console.log(childName);

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission is not granted, ask for permission
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission is still not granted, display an error message
    if (finalStatus !== "granted") {
      console.log("Notification permission not granted.");
    } else {
      console.log("Notification permission granted.");
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          experienceId:
            Constants?.expoConfig?.owner + "/" + Constants?.expoConfig?.slug,
        });

        const token = tokenData.data;
        // Save the Expo Push Token to the database for the current user
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userRef = ref(db, "users/" + userId + "/children/" + child);
          const snapshot = await get(userRef);

          let expoPushTokens = [];
          // Add the new token to the array
          expoPushTokens.push(token);

          // Save the updated array of Expo Push Tokens to the database
          await update(userRef, { expoPushTokens });
          console.log("Expo Push Token saved to Firebase:", token);
        }
      } catch (error) {
        console.error("Error getting Expo Push Token:", error);
      }
    }
    try {
      const char = await AsyncStorage.getItem("character");
      if (char !== null) {
        navigation.navigate("ChildSwitch");
      } else {
        navigation.navigate("Comic");
      }
    } catch (e) {
      console.error(e);
    }
  };

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
        }
      });

      // Cleanup function
      return () => {
        off(childRef, "value", childListener);
      };
    }
  }, [db]);

  const handleChildPress = async (child, childName) => {
    characterChecker(child, childName);
  };

  const addChild = () => {
    if (name && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newChildRef = ref(db, "users/" + userId + "/children/");
      push(newChildRef, {
        name: name,
      })
        .then(() => {
          setIsModalVisible(false);
          setName(""); // clear the input
        })
        .catch((error) => {
          setError("Error creating task.");
        });
    } else {
      setError("Please enter a name.");
    }
  };

  const styles = getStyles(width);

  return (
    <>
      <Modal
        animationOut={"slideOutDown"}
        animationOutTiming={500}
        animationInTiming={300}
        onBackdropPress={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
      >
        <View style={styles.modalContainer}>
          <CustomText type="regular">Enter the name of your child.</CustomText>
          <View style={error != "" ? styles.inputError : styles.inputView}>
            <TextInput
              onChangeText={setName}
              textAlign={"left"}
              style={styles.TextInput}
              placeholder="Name..."
              placeholderTextColor="#003f5c"
            />
          </View>
          <CustomText type="subtitleError">{error}</CustomText>

          <View style={styles.wrapper}>
            <CustomButton
              title="Add a child"
              onPress={addChild}
              type="secondary"
            />
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleWrapper}>
          <CustomText type="title">What is your name?</CustomText>
        </View>
        <Shadow
          corners={{ topStart: false, topEnd: false, bottomStart: false }}
          sides={{ top: false, start: false }}
          distance={5}
          paintInside={false}
        >
          <View style={styles.childrenContainer}>
            {children.map((child, index) => (
              <TouchableOpacity
                key={index}
                style={index == 0 ? styles.firstChild : styles.childContainer}
                onPress={() => {
                  handleChildPress(child.id, child.name);
                }}
              >
                <CustomText type="regular">{child.name}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </Shadow>
      </ScrollView>
      <TouchableOpacity
        style={styles.circle}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
          +
        </Text>
      </TouchableOpacity>
    </>
  );
}

const getStyles = (width) => {
  if (width >= 600) {
    return StyleSheet.create({
      circle: {
        backgroundColor: COLORS.primary,
        width: height * 0.07,
        height: height * 0.07,
        borderRadius: 50,
        position: "absolute",
        bottom: height * 0.03,
        right: height * 0.03,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
      },
      titleWrapper: {
        width: width * 0.9,
        marginBottom: height * 0.05,
        alignItems: "center",
      },
      container: {
        flexGrow: 1,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 40,
      },
      childContainer: {
        height: height * 0.07,
        alignSelf: "center",
        width: width * 0.9,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLORS.light,
        borderTopWidth: 1,
        padding: 10,
      },
      firstChild: {
        width: width * 0.9,
        height: height * 0.07,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
      },
      childrenContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.light,
      },
      wrapper: {
        marginBottom: 10,
        justifyContent: "flex-start",
      },
      title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
      },
      wrapper: {
        width: "100%",
        marginBottom: 10,
      },
      modalContainer: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 25,
      },

      inputView: {
        borderRadius: 60,
        borderColor: COLORS.primary,
        borderWidth: 1,
        width: "80%",
        height: 60,
        marginTop: 10,
      },

      inputError: {
        borderRadius: 60,
        width: "80%",
        height: 60,
        borderColor: "#ff0033",
        borderWidth: 1,
        marginTop: 10,
      },

      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
    });
  } else {
    return StyleSheet.create({
      circle: {
        backgroundColor: COLORS.primary,
        width: height * 0.07,
        height: height * 0.07,
        borderRadius: 50,
        position: "absolute",
        bottom: height * 0.03,
        right: height * 0.03,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
      },
      titleWrapper: {
        width: width * 0.9,
        marginBottom: height * 0.05,
        alignItems: "center",
      },
      container: {
        flexGrow: 1,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 40,
      },
      childContainer: {
        height: height * 0.07,
        alignSelf: "center",
        width: width * 0.9,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLORS.light,
        borderTopWidth: 1,
        padding: 10,
      },
      firstChild: {
        width: width * 0.9,
        height: height * 0.07,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
      },
      childrenContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.light,
      },
      wrapper: {
        marginBottom: 10,
        justifyContent: "flex-start",
      },
      title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
      },
      wrapper: {
        width: "100%",
        marginBottom: 10,
      },
      modalContainer: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 25,
      },

      inputView: {
        borderRadius: 30,
        borderColor: COLORS.primary,
        borderWidth: 1,
        width: "80%",
        height: 45,
        marginTop: 10,
      },

      inputError: {
        borderRadius: 30,
        width: "80%",
        height: 45,
        borderColor: "#ff0033",
        borderWidth: 1,
        marginTop: 10,
      },

      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
    });
  }
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: COLORS.primary,
    width: height * 0.07,
    height: height * 0.07,
    borderRadius: 50,
    position: "absolute",
    bottom: height * 0.03,
    right: height * 0.03,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  titleWrapper: {
    width: width * 0.9,
    marginBottom: height * 0.05,
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 40,
  },
  childContainer: {
    height: height * 0.07,
    alignSelf: "center",
    width: width * 0.9,
    borderColor: COLORS.light,
    borderTopWidth: 1,
    padding: 10,
  },
  firstChild: {
    width: width * 0.9,
    height: height * 0.07,
    lineHeight: height * 0.07,
    padding: 10,
  },
  childrenContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  wrapper: {
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  wrapper: {
    width: "100%",
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 25,
  },

  inputView: {
    borderRadius: 30,
    borderColor: COLORS.primary,
    borderWidth: 1,
    width: "80%",
    height: 45,
    marginTop: 10,
  },

  inputError: {
    backgroundColor: "#f8f8f8",
    borderRadius: 30,
    width: "80%",
    height: 45,
    borderColor: "#ff0033",
    borderWidth: 1,
    marginTop: 10,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
});

export default ChildPicker;
