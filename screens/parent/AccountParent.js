import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
const { width, height } = Dimensions.get("window");
import { COLORS } from "../colors/colors";
import { Shadow } from "react-native-shadow-2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../util/firebaseconfig";
import { signOut } from "firebase/auth";
import Modal from "react-native-modal";
import { ref, push } from "firebase/database";
function AccountParent() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");

  const logOut = () => {
    AsyncStorage.clear();
    signOut(auth).then(() => {
      navigation.navigate("Register");
    });
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
              type="secondary"
            />
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleWrapper}>
          <CustomText type="title">Account</CustomText>
        </View>
        <Shadow
          corners={{ topStart: false, topEnd: false, bottomStart: false }}
          sides={{ top: false, start: false }}
          distance={5}
          paintInside={false}
        >
          <View style={styles.itemsContainer}>
            <View style={styles.itemFirstContainer}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                style={styles.item}
              >
                <CustomText type="itemText">Add a child</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </Shadow>
        <View style={styles.buttonWrapper}>
          <CustomButton
            onPress={logOut}
            type="danger"
            title="Log out"
            width="100%"
          />
        </View>
      </ScrollView>
    </>
  );
}

const getStyles = (width) => {
  if (width >= 600) {
    return StyleSheet.create({
      container: {
        flexGrow: 1,
        marginTop: 20,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
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
      modalContainer: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 25,
      },
      wrapper: {
        width: "100%",
      },
      buttonWrapper: {
        width: width * 0.9,
        marginTop: height * 0.05,
      },
      titleWrapper: {
        marginBottom: height * 0.05,
      },
      itemFirstContainer: {
        height: height * 0.07,
        alignSelf: "center",
        width: width * 0.9,
        padding: 10,
        justifyContent: "center",
      },
      itemContainer: {
        height: height * 0.07,
        alignSelf: "center",
        width: width * 0.9,
        borderColor: COLORS.light,
        borderTopWidth: 1,
        padding: 10,
        justifyContent: "center",
      },

      itemsContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.light,
      },
    });
  } else {
    return StyleSheet.create({
      container: {
        flexGrow: 1,
        marginTop: 20,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
      },
      inputView: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
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
      modalContainer: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 25,
      },
      wrapper: {
        width: "100%",
      },
      buttonWrapper: {
        width: width * 0.9,
        marginTop: height * 0.05,
      },
      titleWrapper: {
        marginBottom: height * 0.05,
      },
      itemFirstContainer: {
        height: height * 0.07,
        alignSelf: "center",
        width: width * 0.9,
        padding: 10,
        justifyContent: "center",
      },
      itemContainer: {
        height: height * 0.07,
        alignSelf: "center",
        width: width * 0.9,
        borderColor: COLORS.light,
        borderTopWidth: 1,
        padding: 10,
        justifyContent: "center",
      },

      itemsContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.light,
      },
    });
  }
};

export default AccountParent;
