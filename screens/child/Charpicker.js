import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../util/firebaseconfig";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { COLORS } from "../colors/colors";

const AccountChild = () => {
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("character", value).then(() => {
        navigation.navigate("ChildSwitch");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight,
        marginBottom: StatusBar.currentHeight,
      }}
    >
      <Swiper
        key={2}
        onIndexChanged={handleIndexChanged}
        loop={false}
        activeDotColor={COLORS.primary}
        showsPagination={true}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={() => storeData("News")}>
            <Image
              source={require("../../assets/images/charPicker/news.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => storeData("Detective")}>
            <Image
              source={require("../../assets/images/charPicker/detective.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => storeData("Police")}>
            <Image
              source={require("../../assets/images/charPicker/police.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => storeData("Army")}>
            <Image
              source={require("../../assets/images/charPicker/army.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height,
  },
  leftArrow: {
    position: "absolute",
    left: 30,
    top: Dimensions.get("window").height / 2 - 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 30,
  },
  rightArrow: {
    position: "absolute",
    right: 30,
    top: Dimensions.get("window").height / 2 - 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 30,
  },
  arrowText: {
    fontSize: 24,
    color: "#FFF",
  },
  changeCharacterButton: {
    alignSelf: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  changeCharacterButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
});

export default AccountChild;
