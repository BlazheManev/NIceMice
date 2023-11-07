import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";

function Quickinst() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <CustomText type="title">Introduction</CustomText>
      <ImageBackground
        source={require("../../assets/images/toy-child.png")}
        imageStyle={{ opacity: 0.2 }}
      >
        <CustomText type="regular">
          Nice Mice is the all-in-one app that revolutionizes how parents and
          children collaborate on tasks and activities. Organize your family's
          routines effortlessly, track real-time progress, motivate with
          rewards, and stay connected through interactive messaging. Start now
          and experience a harmonious family team achieving greatness together!
        </CustomText>
      </ImageBackground>

      <CustomButton
        title="Continue"
        onPress={() => navigation.navigate("Switch")}
        type="primary"
        width="100%"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default Quickinst;
