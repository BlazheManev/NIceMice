//datoteka z hitrimi navodili za starše

import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../util/firebaseconfig";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Parent() {
  const navigation = useNavigation();
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText type="title">Instructions</CustomText>
      <ImageBackground
        imageStyle={{ opacity: 0.2 }}
        source={require("../../assets/images/parent-child.png")}
      >
        <CustomText type="regular">
          Welcome to the parent section of the app.{"\n"}Here you can check your
          children's tasks and add new tasks. Simply click the plus icon on the
          bottom right of the screen and choose a child and title of the task.
          Once the task is completed, you can check it off by clicking on it in
          the Task Checker screen.{"\n"}
          We hope you enjoy the app!
        </CustomText>
      </ImageBackground>

      <View style={styles.wrapper}>
        <CustomButton
          title="Continue"
          onPress={() =>  navigation.navigate("TaskChecker")}
          type="primary"
          width="100%"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
  },
});

export default Parent;
