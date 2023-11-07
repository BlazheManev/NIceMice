import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, off, set, get } from "firebase/database";
import { auth } from "../util/firebaseconfig";
import app from "../util/firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../colors/colors";
import { signOut } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import { Shadow } from "react-native-shadow-2";
import CustomText from "../components/CustomText";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

function ChildSwitch() {
  const [coinCount, setCoinCount] = useState(0);
  const [character, setCharacter] = useState("");
  const [childName, setChildName] = useState("");
  const [child, setChild] = useState("");
  const navigation = useNavigation();
  const db = getDatabase(app);
  const isFocused = useIsFocused();

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

  const logOut = () => {
    signOut(auth).then(() => {
      AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  };

  const handleButtonForAccountChild = () => {
    navigation.navigate("ChildAccount");
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
      const name = await AsyncStorage.getItem("childName");
      if (childId !== null && name !== null) {
        setChild(childId);
        setChildName(name);
      } else {
        console.log("No user available");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
    if (auth.currentUser && child) {
      const userId = auth.currentUser.uid;

      // Coin count fetching
      const coinRef = ref(db, `users/${userId}/children/${child}/coins`);
      const coinListener = onValue(coinRef, (snapshot) => {
        if (snapshot.exists()) {
          setCoinCount(snapshot.val());
        } else {
          console.log("No coin data available");
        }
      });

      // Cleanup function
      return () => {
        off(coinRef, "value", coinListener);
      };
    }
  }, [db, child, childName]);

  const handleNewCharacter = async () => {
    await AsyncStorage.removeItem("character");
    navigation.reset({
      index: 0,
      routes: [{ name: "Charpicker" }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleWrapper}>
        <CustomText type="title">Hello {childName}</CustomText>
      </View>
      {character === "Army" ? (
        <Image
          source={require("../../assets/images/army.png")}
          style={{
            width: width,
            height: height * 0.2,
            resizeMode: "contain",
            marginBottom: height * 0.05,
          }}
        />
      ) : character === "Detective" ? (
        <Image
          source={require("../../assets/images/detective_whiskers.png")}
          style={{
            width: width,
            height: height * 0.2,
            resizeMode: "contain",
            marginBottom: height * 0.05,
          }}
        />
      ) : character === "Police" ? (
        <Image
          source={require("../../assets/images/police.png")}
          style={{
            width: width,
            height: height * 0.2,
            resizeMode: "contain",
            marginBottom: height * 0.05,
          }}
        />
      ) : character === "News" ? (
        <Image
          source={require("../../assets/images/news.png")}
          style={{
            width: width,
            height: height * 0.2,
            resizeMode: "contain",
            marginBottom: height * 0.05,
          }}
        />
      ) : (
        <></>
      )}
      <Shadow
        corners={{ topStart: false, topEnd: false, bottomStart: false }}
        sides={{ top: false, start: false }}
        distance={5}
        paintInside={false}
      >
        <View style={styles.itemsContainer}>
          <View style={styles.itemFirstContainer}>
            <View>
              <CustomText type="itemText">
                Your coins: {coinCount + " "}
                <View style={styles.iconWrapper}>
                  <Icon name="coins" size={16} color={COLORS.secondary} />
                </View>
              </CustomText>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Tasker", { title: character })
              }
              style={styles.item}
            >
              <Icon name="tasks" size={16} color={COLORS.secondary} />
              <CustomText type="itemText"> See your tasks </CustomText>
              <View style={styles.iconEndWrapper}>
                <Icon name="chevron-right" size={16} color={COLORS.secondary} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => handleNewCharacter()}
              style={styles.item}
            >
              <Icon name="exchange-alt" size={16} color={COLORS.secondary} />
              <CustomText type="itemText"> Change your character</CustomText>
              <View style={styles.iconEndWrapper}>
                <Icon name="chevron-right" size={16} color={COLORS.secondary} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Items")}
              style={styles.item}
            >
              <Icon name="child" size={16} color={COLORS.secondary} />
              <CustomText type="itemText"> See your items</CustomText>
              <View style={styles.iconEndWrapper}>
                <Icon name="chevron-right" size={16} color={COLORS.secondary} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Store")}
              style={styles.item}
            >
              <Icon name="store" size={16} color={COLORS.secondary} />
              <CustomText type="itemText"> Store</CustomText>
              <View style={styles.iconEndWrapper}>
                <Icon name="chevron-right" size={16} color={COLORS.secondary} />
              </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEndWrapper: {
    position: "absolute",
    right: 10,
  },
  iconWrapper: {
    alignSelf: "center",
  },
  buttonWrapper: {
    width: width * 0.9,
    marginTop: height * 0.05,
  },
  titleWrapper: {
    width: width,
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

  item: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChildSwitch;
