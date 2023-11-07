import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import CustomText from "../components/CustomText";

const { width, height } = Dimensions.get("window");

function SplashScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFocused) {
      }
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, [navigation, isFocused]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splashscreen.png")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    backgroundColor: "#ffffff",
    width: width,
    height: height,
  },
});

export default SplashScreen;
