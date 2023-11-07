// enostaven welcome screen

import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
const { width, height } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";

function Welcome() {
  const navigation = useNavigation();
  const handleContinuePress = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      const childId = await AsyncStorage.getItem("childId");
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        const { parent } = userData;

        // Email matches, now check if it's a parent or child
        if (parent === "true") {
          navigation.navigate("TaskChecker");
        } else if (parent === "false") {
          if (childId !== null) {
            navigation.navigate("ChildSwitch");
          } else {
            navigation.navigate("ChildPicker");
          }
        } else {
          navigation.navigate("Quickinst");
        }
      } else {
        navigation.navigate("Quickinst");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const styles = getStyles(width);
  return (
    <View style={styles.container}>
      <CustomText type="mainTitle">Welcome!</CustomText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: height * 0.02,
        }}
      >
        <Image
          source={require("../../assets/images/news.png")}
          style={styles.news}
        />
        <Image
          source={require("../../assets/images/police.png")}
          style={styles.police}
        />
      </View>

      <CustomButton
        type="primary"
        title="Continue"
        onPress={handleContinuePress} // Update the onPress handler
      />
    </View>
  );
}

const getStyles = (w) => {
  if (w >= 600) {
    return StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.01,
      },
      news: {
        width: width * 0.35,
        height: height * 0.25,
        alignSelf: "flex-start",
        marginBottom: 20,
        marginTop: 20,
      },
      police: {
        width: width * 0.35,
        height: height * 0.3,
        alignSelf: "flex-start",
        marginBottom: 20,
        marginTop: 20,
      },
    });
  } else {
    return StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.01,
      },
      news: {
        width: width * 0.4,
        height: height * 0.2,
        alignSelf: "flex-start",
        marginBottom: 20,
        marginTop: 20,
      },
      police: {
        width: width * 0.4,
        height: height * 0.25,
        alignSelf: "flex-start",
        marginBottom: 20,
        marginTop: 20,
      },
    });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.01,
  },
  news: {
    width: width * 0.4,
    height: height * 0.2,
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 20,
  },
  police: {
    width: width * 0.4,
    height: height * 0.25,
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 20,
  },
});

export default Welcome;
