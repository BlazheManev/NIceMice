//prvi zaslon na aplikaciji ki opiše aplikacijo z slideshowom

import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Swiper from "react-native-swiper";
import { COLORS } from "../colors/colors";
import CustomText from "../components/CustomText";
import CustomButton from "../components/CustomButton";

const { width, height } = Dimensions.get("window");

const Description = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  const styles = getStyles(width);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight * 2,
        marginBottom: StatusBar.currentHeight,
      }}
    >
      <View style={styles.container}>
        <CustomText type="mainTitle">Nice Mice</CustomText>
        <Swiper
          key={3}
          onIndexChanged={handleIndexChanged}
          loop={false}
          activeDotColor={COLORS.primary}
          showsPagination={currentIndex == 2 ? false : true}
        >
          <View style={styles.slide}>
            <Image
              style={styles.todolist}
              source={require("../../assets/images/todolist.png")}
            />
            <CustomText type="titlePink">
              Superheroes always complete their tasks!{"\n"} Be a superhero
              today!
            </CustomText>
            <Image
              style={styles.detective}
              source={require("../../assets/images/detective_whiskers.png")}
            />
          </View>
          <View style={styles.slide2}>
            <CustomText type="titlePink">
              Parents and kids,{"\n"} a powerful duo on a mission to get things
              done!
            </CustomText>
            <Image
              style={styles.family}
              source={require("../../assets/images/family.png")}
            />
          </View>
          <View style={styles.slide}>
            <CustomText type="titlePink">
              Simplify parenting with our{"\n"} task-tracking app for kids
            </CustomText>
            <Image
              style={styles.army}
              source={require("../../assets/images/image-army.png")}
            />
          </View>
        </Swiper>
        {currentIndex == 2 ? (
          <CustomButton
            type="primary"
            width="90%"
            onPress={() => navigation.navigate("Register")}
            title="Continue"
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Description;

const getStyles = (screenWidth) => {
  if (screenWidth >= 600) {
    return StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      army: {
        width: width * 0.5,
        height: height * 0.3,
      },
      detective: {
        transform: [{ rotate: "-5deg" }],
        alignSelf: "flex-start",
      },
      todolist: {
        alignSelf: "flex-end",
      },
      family: {
        width: width * 0.3,
        height: height * 0.4,
        alignSelf: "flex-end",
        marginRight: width * 0.1,
      },
      continueButton: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: COLORS.light,
      },
      slide: {
        marginTop: height * 0.05,
        alignItems: "center",
        flex: 1,
      },
      slide2: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    });
  } else {
    return StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      army: {
        width: width * 0.7,
        height: height * 0.3,
        marginTop: height * 0.05,
      },
      detective: {
        transform: [{ rotate: "-5deg" }],
        alignSelf: "flex-start",
      },
      todolist: {
        alignSelf: "flex-end",
      },
      family: {
        width: width * 0.6,
        height: height * 0.4,
        alignSelf: "flex-end",
      },
      continueButton: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        backgroundColor: COLORS.light,
      },
      slide: {
        marginTop: height * 0.05,
        alignItems: "center",
        flex: 1,
      },
      slide2: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    });
  }
};
