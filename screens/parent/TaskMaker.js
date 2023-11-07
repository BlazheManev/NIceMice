// tukaj starš nardi task ki se shrani na friebase

import { useNavigation } from "@react-navigation/native";
import { ref, set, onValue, off, push, get } from "firebase/database";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { auth, db } from "../util/firebaseconfig"; // Import auth
import CustomButton from "../components/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import { Shadow } from "react-native-shadow-2";
import { COLORS } from "../colors/colors";
import CustomText from "../components/CustomText";
const { width, height } = Dimensions.get("window");
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";

function TaskMaker() {
  const [task, setTask] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [children, setChildren] = useState([]);
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [type, setType] = useState("");

  const today = new Date();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    console.log(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
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
          setError("Error creating a child.");
        });
    } else {
      setError("Please enter a name.");
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
  useEffect(() => {
    checkSubscription();
  }, [isFocused]);

  const sendCongratulationsToUsersWithEmail = async (message, childId) => {
    try {
      const userId = auth.currentUser.uid;
      const userRef = ref(
        db,
        "users/" + userId + "/children/" + childId + "/expoPushTokens"
      );
      const snapshot = await get(userRef);
      const usersData = snapshot.exists() ? snapshot.val() : {};

      const requestData = {
        tokens: usersData,
        title: "Congratulations!",
        body: message,
      };
      // Make the HTTP POST request to the server
      const response = await fetch(
        "https://stripe-backend-wo97.onrender.com/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      // Check the response status and handle accordingly
      if (response.ok) {
        console.log("Push notifications sent successfully to the server.");
      } else {
        console.error("Failed to send push notifications to the server.");
      }
    } catch (error) {
      console.error("Error sending congratulations:", error);
    }
  };

  const characterChecker = async () => {
    await AsyncStorage.setItem("childId", value);
    try {
      const char = await AsyncStorage.getItem("character");
      if (char !== null) {
        navigation.navigate("Tasker", { title: char });
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
        } else {
          console.log("No children available");
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

  const createTask = () => {
    if (task && value && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newTaskRef = ref(db, "users/" + userId + "/tasks/" + Date.now());
      set(newTaskRef, {
        id: Date.now(),
        description: task,
        childId: value,
      })
        .then(() => {
          const message = ` You have Have New Task `;
          sendCongratulationsToUsersWithEmail(message, value);
          navigation.navigate("TaskChecker");
          setTask(""); // clear the input
        })
        .catch((error) => {
          console.error("Error creating task: ", error);
        });
    } else {
      setError("Please enter a task and/or choose a child.");
    }
  };

  const [isLeftActive, setIsLeftActive] = useState(false); // Change this to false
  const flowingAnimation = useRef(
    new Animated.Value(isLeftActive ? 0 : 1)
  ).current;

  const handleButtonPress = () => {
    setIsLeftActive(!isLeftActive);
    if (type === "daily" || type === "") {
      setType("monthly");
    } else {
      setType("daily");
    }
    console.log(type);
    Animated.timing(flowingAnimation, {
      toValue: isLeftActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const buttonRightActive = flowingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.primary, "white"],
  });

  const buttonLeftActive = flowingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["white", COLORS.primary],
  });

  return (
    <>
      <Modal
        animationOut={"slideOutDown"}
        animationOutTiming={300}
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
              type="primary"
            />
          </View>
        </View>
      </Modal>
      <View style={styles.mainContainer}>
        <CustomText type="title">Create a new task.</CustomText>
        <Shadow
          corners={{ topStart: false, topEnd: false, bottomStart: false }}
          sides={{ top: false, start: false }}
          distance={5}
          paintInside={false}
        >
          <View style={styles.container}>
            {items.length > 0 ? (
              <View
                style={{
                  marginBottom: 20,
                  width: "100%",
                  zIndex: 1000,
                }}
              >
                <DropDownPicker
                  style={
                    error ? styles.dropdownStyleError : styles.dropdownStyle
                  }
                  dropDownContainerStyle={{
                    borderColor: error ? COLORS.danger : COLORS.primary,
                    color: "red",
                    elevation: 5,
                  }}
                  open={open}
                  placeholder="Choose a child account"
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                />
              </View>
            ) : (
              <View style={styles.buttonWrapper}>
                <CustomButton
                  title="Add your first child"
                  width="100%"
                  type="light"
                  onPress={() => setIsModalVisible(true)}
                />
              </View>
            )}
            <TextInput
              style={error ? styles.inputError : styles.input}
              placeholder="Enter task title"
              value={task}
              onChangeText={setTask}
            />
            <CustomText type="subtitleError">{error}</CustomText>
            <BouncyCheckbox
              size={25}
              fillColor={COLORS.primary}
              unfillColor="#FFFFFF"
              text="Is this task concurrent?"
              textStyle={{
                textDecorationLine: "none",
              }}
              iconStyle={{ borderColor: COLORS.primary }}
              innerIconStyle={{ borderWidth: 1.5 }}
              onPress={() => {
                setSelection(!isSelected);
              }}
            />
            <View style={{ marginVertical: 10 }}>
              {isSelected ? (
                <View
                  style={{
                    marginBottom: 20,
                    width: "100%",
                    zIndex: 1000,
                  }}
                >
                  <View style={styles.tabWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.buttonLeft,
                        !isLeftActive ? styles.buttonLeftActive : null,
                        { backgroundColor: buttonLeftActive },
                      ]}
                      onPress={isLeftActive ? handleButtonPress : null}
                      activeOpacity={1}
                    >
                      <Text>Daily</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.buttonRight,
                        isLeftActive ? styles.buttonRightActive : null,
                        { backgroundColor: buttonRightActive },
                      ]}
                      onPress={!isLeftActive ? handleButtonPress : null}
                      activeOpacity={1}
                    >
                      <Text>Monthly</Text>
                    </TouchableOpacity>
                  </View>
                  <CustomButton
                    type="light"
                    title="Choose when to stop"
                    width="100%"
                    onPress={showDatepicker}
                  />
                </View>
              ) : (
                <></>
              )}
              {show ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              ) : (
                <></>
              )}
            </View>

            <View style={styles.wrapper}>
              <CustomButton
                title="Create Task"
                onPress={createTask}
                type="primary"
                width="100%"
                disabled={items.length > 0 && task.length > 0 ? false : true}
              />
            </View>
            <View style={styles.wrapper}>
              <CustomButton
                title="Task Checker"
                onPress={() => navigation.navigate("TaskChecker")}
                type="secondary"
                width="100%"
              />
            </View>
          </View>
        </Shadow>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRight: {
    width: width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 25,
    height: 45,
    position: "absolute",
    right: width * 0.1,
  },
  buttonRightActive: {
    width: width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 45,
    position: "absolute",
    right: width * 0.1,
    zIndex: 1000,
  },
  buttonLeft: {
    width: width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 25,
    height: 45,
  },
  buttonLeftActive: {
    width: width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 45,
    zIndex: 1000,
  },
  dropdownStyle: {
    borderRadius: 25,
    maxHeight: 40,
    borderColor: COLORS.primary,
  },
  dropdownStyleError: {
    borderRadius: 25,
    maxHeight: 40,
    borderColor: COLORS.danger,
  },
  buttonWrapper: {
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 25,
  },
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.light,
    padding: width * 0.05,
    width: width * 0.9,
  },
  tabWrapper: {
    flexDirection: "row",
    width: width * 0.9,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 25,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  inputError: {
    height: 50,
    borderColor: COLORS.danger,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  wrapper: {
    marginBottom: 5,
    width: "100%",
  },
});

export default TaskMaker;
