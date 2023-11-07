import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, off, set, get } from "firebase/database";
import { auth } from "../util/firebaseconfig";
import app from "../util/firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../colors/colors";
import { signOut } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { Shadow } from "react-native-shadow-2";
const { width, height } = Dimensions.get("window");

function Tasker() {
  const [coinCount, setCoinCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [character, setCharacter] = useState("");
  const [child, setChild] = useState("");
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const db = getDatabase(app);

  const setChatGptAi = async (userId) => {
    try {
      let character = await AsyncStorage.getItem("character");
      if (character) {
        character = character.toLowerCase(); // Convert the character to lowercase
      } else {
        console.log("Character not found in AsyncStorage");
        return;
      }
      console.log(character);

      // Retrieve the tasks for the given character from the tasksAi node
      const tasksSnapshot = await get(ref(db, "tasksAI"));
      let tasksForCharacter = [];
      tasksSnapshot.forEach((taskSnapshot) => {
        const task = taskSnapshot.val();
        if (task.childId === child) {
          tasksForCharacter = [];
          return; // Skip the task as it's already completed by the child
        }
        if (task.character === character) {
          tasksForCharacter.push({ id: taskSnapshot.key, ...task }); // Include the ID from the key in the tasksForCharacter array
        }
      });

      // Check if any tasks were found for the given character
      if (tasksForCharacter.length === 0) {
        console.log("No tasks found for character:", character);
        return;
      }

      // Check if the task with the same description already exists in the user's tasks
      const userTasksSnapshot = await get(ref(db, `users/${userId}/tasks`));
      let taskExists = false;
      userTasksSnapshot.forEach((taskSnapshot) => {
        const task = taskSnapshot.val();
        if (task.taskAI === true && task.childId === child) {
          taskExists = true;
        }
      });

      // If the task does not exist, add it to the user's tasks
      if (!taskExists) {
        const newTaskRef = ref(
          db,
          `users/${userId}/tasks/${tasksForCharacter[0].id}`
        ); // Use the ID from tasksForCharacter
        set(newTaskRef, {
          id: Date.now(),
          description: tasksForCharacter[0].task,
          childId: child,
          taskAI: true,
        })
          .then(() => {
            console.log(
              "Task AI added to the user's tasks for character:",
              character
            );
          })
          .catch((error) => {
            console.error("Error creating task:", error);
          });
      }
    } catch (error) {
      console.error("Error setting taskAI:", error);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("character");
      if (value !== null) {
        setCharacter(value);
      } else {
        setCharacter("No character selected");
      }
    } catch (e) {
      console.error(e);
    }
    try {
      const childId = await AsyncStorage.getItem("childId");
      if (childId !== null) {
        setChild(childId);
      } else {
        console.log("No user available");
        navigation.navigate("Login");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
    if (auth.currentUser && child) {
      const userId = auth.currentUser.uid;
      setChatGptAi(userId);

      // Task fetching
      const taskRef = ref(db, `users/${userId}/tasks`);
      const taskListener = onValue(taskRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const tasksArray = Object.keys(data).map((key) => {
            return { ...data[key], id: key };
          });
          setTasks(tasksArray);
        } else {
          console.log("No tasks available");
        }
      });

      // Coin count fetching
      const coinRef = ref(db, `users/${userId}/children/${child}/coins`);
      const coinListener = onValue(coinRef, (snapshot) => {
        if (snapshot.exists()) {
          setCoinCount(snapshot.val());
        } else {
          console.log("No coin data available");
        }
      });

      const itemRef = ref(db, `users/${userId}/children/${child}/items`);
      const itemListener = onValue(itemRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const tasksArray = Object.keys(data).map((key) => {
            return { ...data[key], id: key };
          });
          setItems(tasksArray);
        } else {
          console.log("No items available");
        }
      });

      // Cleanup function
      return () => {
        off(taskRef, "value", taskListener);
        off(coinRef, "value", coinListener);
        off(itemRef, "value", itemListener);
      };
    }
  }, [db, child]);

  useEffect(() => {
    var res = tasks.filter((item) => item.childId === child);
    setfilteredTasks(res);
  }, [tasks, child]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginBottom: height * 0.05 }}>
        <CustomText type="title">My tasks</CustomText>
      </View>
      <Shadow
        corners={{ topStart: false, topEnd: false, bottomStart: false }}
        sides={{ top: false, start: false }}
        distance={5}
        paintInside={false}
      >
        <View style={styles.tasksContainer}>
          {filteredTasks.length != 0 ? (
            filteredTasks.map((task, index) => {
              if (task.taskAI === true) {
                return (
                  <View
                    key={index}
                    style={index == 0 ? styles.firstTask : styles.tasks}
                  >
                    <CustomText type="taskTitleTextAI">
                      {task.description.content.toUpperCase() + " (AI)"}
                    </CustomText>
                  </View>
                );
              }
              return (
                <View
                  key={index}
                  style={index == 0 ? styles.firstTask : styles.tasks}
                >
                  <CustomText type="taskTitleText">
                    {task.description.toUpperCase()}
                  </CustomText>
                </View>
              );
            })
          ) : (
            <CustomText type="regular">No tasks available.</CustomText>
          )}
        </View>
      </Shadow>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    alignSelf: "center",
    width: width * 0.9,
    borderColor: COLORS.light,
    borderTopWidth: 1,
    padding: 10,
  },
  firstTask: {
    width: width * 0.9,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flexGrow: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20,
  },
});

export default Tasker;
