//comic slideshow file

import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { COLORS } from "../colors/colors";
import CustomButton from "../components/CustomButton";

function Comic() {
  const [currentImage, setCurrentImage] = useState(0);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

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
        key={"comic"}
        onIndexChanged={handleIndexChanged}
        loop={false}
        removeClippedSubviews={false}
        scrollEnabled={true}
        activeDotColor={COLORS.primary}
        showsPagination={currentIndex == 9 ? false : true}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic0.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic1.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic2.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic3.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic4.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic5.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic6.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic7.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic8.png")}
          />
        </View>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/comic/comic9.png")}
          />
        </View>
      </Swiper>
      {currentIndex == 9 ? (
        <CustomButton
          type="primary"
          width="90%"
          onPress={() => navigation.navigate("Charpicker")}
          title="Continue"
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    resizeMode: "contain",
  },
});

export default Comic;
