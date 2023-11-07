// file v katerem staš preverja ai taske in approva taske ki jih je naredil otrok

import { useNavigation } from "@react-navigation/native";
import {
  off,
  onValue,
  ref,
  remove,
  runTransaction,
  get,
  update,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { auth, db } from "../util/firebaseconfig";
import { COLORS } from "../colors/colors";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
const { width, height } = Dimensions.get("window");
import { useIsFocused } from "@react-navigation/native";
import { Shadow } from "react-native-shadow-2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { scheduleNotificationAsync } from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function TaskChecker() {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const [children, setChildren] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const isFocused = useIsFocused();
  const [notificationsSent, setNotificationsSent] = useState([]);

  const sendPushNotification = async (title, body, token) => {
    try {
      // Send a push notification to a specific Expo Push Token
      const notification = {
        to: token,
        sound: "default",
        title,
        body,
      };

      await scheduleNotificationAsync({
        content: notification,
        trigger: null, // Set the trigger to null for immediate delivery
      });

      console.log("Push notification sent successfully.");
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  const sendCongratulationsToUsersWithEmail = async (
    email,
    message,
    childId
  ) => {
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

  const getExpoPushTokenAndSaveToFirebase = async (userEmail) => {
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
          projectId: "82cbecf8-e6ad-47a3-b896-4b359349ed8b", //SPREMENI ID
        });

        const token = tokenData.data;
        // Save the Expo Push Token to the database for the current user
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userRef = ref(db, "users/" + userId);
          const snapshot = await get(userRef);
          const userData = snapshot.exists() ? snapshot.val() : {};

          let expoPushTokens = userData.expoPushTokens || [];

          if (!expoPushTokens.includes(token)) {
            // Add the new token to the array if it doesn't already exist
            expoPushTokens.push(token);
          }

          // Save the updated array of Expo Push Tokens to the database
          await update(userRef, { expoPushTokens });
          console.log("Expo Push Token saved to Firebase:", token);
        }
      } catch (error) {
        console.error("Error getting Expo Push Token:", error);
      }
    }
  };

  const checkSubscription = async () => {
    try {
      const data = await AsyncStorage.getItem("subscription");
      const parsedData = JSON.parse(data);

      const { isSubscriptionExpired } = parsedData;
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
  useEffect(() => {
    if (auth.currentUser) {
      getExpoPushTokenAndSaveToFirebase(auth.currentUser.email);
      const userId = auth.currentUser.uid;
      const tasksRef = ref(db, "users/" + userId + "/tasks");
      const listener = onValue(
        tasksRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const tasksArray = Object.keys(data).map((key) => {
              return { ...data[key], id: key };
            });
            setTasks(tasksArray);
          } else {
            console.log("No data available");
          }
        },
        (error) => {
          console.error("Error fetching tasks: ", error);
        }
      );
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
        off(tasksRef, "value", listener);
        off(childRef, "value", childListener);
      };
    } else {
      navigation.navigate("Login");
    }
  }, [db]);

  const approveTask = async (task, childId) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const taskRef = ref(db, "users/" + userId + "/tasks/" + task.id);
      try {
        // Remove the task from the database
        if (task.taskAI) {
          const tasksAiRef = ref(db, `tasksAI/${task.id}`);
          await update(tasksAiRef, {
            childId: childId,
          });
          const coinsRef = ref(
            db,
            "users/" + userId + "/children/" + childId + "/coins"
          );
          await runTransaction(coinsRef, (currentCoins) => {
            return (currentCoins || 0) + 20;
          });
        } else {
          const coinsRef = ref(
            db,
            "users/" + userId + "/children/" + childId + "/coins"
          );
          await runTransaction(coinsRef, (currentCoins) => {
            return (currentCoins || 0) + 10;
          });
        }
        await remove(taskRef);

        // Filter out the task from the tasks array using setTasks
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));

        // Check if the task has already been approved and notification sent
        if (!notificationsSent.includes(task.id)) {
          // If the task has not been approved before, send the notification
          const congratsMessage = `Congratulations! You have earned coins.`;

          // Send the notification
          await sendCongratulationsToUsersWithEmail(
            task.email,
            congratsMessage,
            childId
          );

          // Add the task ID to the notificationsSent state
          setNotificationsSent((prevNotifications) => [
            ...prevNotifications,
            task.id,
          ]);
        }

        setModalVisible(false);
      } catch (error) {
        console.error("Error approving task: ", error);
      }
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleApproveTask = (childId) => {
    if (selectedTask) {
      approveTask(selectedTask, childId);
    }
  };

  return (
    <>
      {selectedTask && (
        <Modal
          animationOut={"slideOutDown"}
          animationOutTiming={300}
          animationInTiming={300}
          onBackdropPress={() => setModalVisible(false)}
          isVisible={isModalVisible}
        >
          <View style={styles.modalCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            ></View>
            <CustomText type="regular">
              {`Approve task for ${
                children.find((child) => child.id === selectedTask.childId).name
              }?`}
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 12,
              }}
            >
              <CustomButton
                type="success"
                width="45%"
                title="YES"
                onPress={() => handleApproveTask(selectedTask.childId)}
              />

              <CustomButton
                width="45%"
                title="NO"
                type="danger"
                onPress={closeModal}
              />
            </View>
          </View>
        </Modal>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ marginBottom: height * 0.05 }}>
          <CustomText type="title">Task Checker</CustomText>
        </View>
        <Shadow
          corners={{ topStart: false, topEnd: false, bottomStart: false }}
          sides={{ top: false, start: false }}
          distance={5}
          paintInside={false}
        >
          <View style={styles.tasksContainer}>
            {tasks.length != 0 ? (
              tasks.map((task, index) => {
                const child = children.find(
                  (child) => child.id === task.childId
                );
                if (task.taskAI === true) {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={index == 0 ? styles.firstTask : styles.tasks}
                      onPress={() => openModal(task)}
                    >
                      <CustomText type="taskTitleTextAI">
                        {task.description.content.length > 30
                          ? task.description.content
                              .substring(0, 20)
                              .toUpperCase() +
                            " ..." +
                            " (AI)"
                          : task.description.content.toUpperCase()}
                      </CustomText>

                      <CustomText type="taskChildTextAI">
                        for {child?.name ?? "Unknown Child"}
                      </CustomText>
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={index}
                    style={index == 0 ? styles.firstTask : styles.tasks}
                    onPress={() => openModal(task)}
                  >
                    <CustomText type="taskTitleText">
                      {task.description.length > 30
                        ? task.description.substring(0, 30).toUpperCase() +
                          " ..."
                        : task.description.toUpperCase()}
                    </CustomText>

                    <CustomText type="taskChildText">
                      for {child?.name ?? "Unknown Child"}
                    </CustomText>
                  </TouchableOpacity>
                );
              })
            ) : (
              <CustomText type="regular">No tasks available.</CustomText>
            )}
          </View>
        </Shadow>
      </ScrollView>

      <TouchableOpacity
        style={styles.addCircleButton}
        onPress={() => navigation.navigate("TaskMaker")}
      >
        <Text style={styles.addCircleButtonText}>+</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  addCircleButton: {
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
  tasksContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.light,
  },

  addCircleButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  tasks: {
    height: height * 0.07,
    alignSelf: "center",
    width: width * 0.9,
    borderColor: COLORS.light,
    borderTopWidth: 1,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firstTask: {
    width: width * 0.9,
    height: height * 0.07,
    lineHeight: height * 0.07,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCard: {
    backgroundColor: COLORS.light,
    alignSelf: "center",
    padding: 32,
    borderRadius: 25,
    width: "80%",
  },

  container: {
    flexGrow: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TaskChecker;
