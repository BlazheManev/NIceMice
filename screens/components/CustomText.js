import React from "react";
import { Text, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { COLORS } from "../colors/colors";
import * as Font from "expo-font";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default class CustomText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount = async () => {
    await Font.loadAsync({
      Shrikhand: require("../../assets/fonts/Shrikhand-Regular.ttf"),
      Bubblegum: require("../../assets/fonts/BubblegumSans-Regular.ttf"),
      Hind: require("../../assets/fonts/Hind-Regular.ttf"),
      HindBold: require("../../assets/fonts/Hind-Bold.ttf"),
      HindMedium: require("../../assets/fonts/Hind-Medium.ttf"),
    });
    this.setState({ fontLoaded: true });
  };
  render() {
    const { type, children } = this.props;
    const { fontLoaded } = this.state;

    if (!fontLoaded) {
      return null; // Return null or a loading indicator while the font is loading
    }
    const styles = getStyle();

    const getStyleByType = () => {
      switch (type) {
        case "mainTitle":
          return styles.mainTitle;
        case "title":
          return styles.title;
        case "regular":
          return styles.regular;
        case "regularBig":
          return styles.regularBig;
        case "regularButton":
          return styles.regularButton;
        case "titleSec":
          return styles.titleSec;
        case "titleBlue":
          return styles.titleBlue;
        case "titlePink":
          return styles.titlePink;
        case "subtitle":
          return styles.subtitle;
        case "subtitleLink":
          return styles.subtitleLink;
        case "subtitleError":
          return styles.subtitleError;
        case "regularButtonLight":
          return styles.regularButtonLight;
        case "taskTitleText":
          return styles.taskTitleText;
        case "taskChildText":
          return styles.taskChildText;
        case "regularButtonLightTablet":
          return styles.regularButtonLightTablet;
        case "taskTitleTextAI":
          return styles.taskTitleTextAI;
        case "taskChildTextAI":
          return styles.taskChildTextAI;
        default:
          return styles.regular;
      }
    };

    const textStyle = [getStyleByType()];

    if (this.props.onPress) {
      return (
        <Text onPress={this.props.onPress} style={textStyle}>
          {children}
        </Text>
      );
    }

    return <Text style={textStyle}>{children}</Text>;
  }
}

CustomText.propTypes = {
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

const getStyle = () => {
  if (width >= 600) {
    return (styles = StyleSheet.create({
      mainTitle: {
        fontSize: width * 0.16,
        width: "90%",
        textAlign: "center",
        fontFamily: "Shrikhand",
        color: COLORS.primary,
      },
      title: {
        width: "100%",
        fontSize: width * 0.11,
        fontFamily: "Shrikhand",
        textAlign: "center",
        color: COLORS.primary,
      },
      titleSec: {
        fontSize: width * 0.09,
        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "Bubblegum",
        color: COLORS.secondary,
        marginBottom: 20,
      },
      titleBlue: {
        fontSize: width * 0.09,
        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "Shrikhand",
        color: COLORS.primary,
      },
      titlePink: {
        fontSize: width * 0.09,
        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "Shrikhand",
        color: COLORS.secondary,
      },
      regular: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.03,
        lineHeight: height * 0.045,
        alignSelf: "center",
        textAlign: "justify",
        color: COLORS.secondary,
      },
      taskTitleText: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.025,
        lineHeight: height * 0.05,
        paddingHorizontal: 10,
        color: COLORS.secondary,
      },
      taskTitleTextAI: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.025,
        lineHeight: height * 0.05,
        paddingHorizontal: 10,
        color: COLORS.primary,
      },
      taskChildText: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.02,
        lineHeight: height * 0.05,
        color: COLORS.secondary,
      },
      taskChildTextAI: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.02,
        lineHeight: height * 0.05,
        color: COLORS.primary,
      },
      regularButton: {
        fontFamily: "Bubblegum",
        marginBottom: 10,
        fontSize: 20,
        alignSelf: "center",
        color: COLORS.secondary,
        lineHeight: 50,
      },
      regularButtonLight: {
        fontFamily: "Bubblegum",
        marginBottom: 10,
        fontSize: 20,
        alignSelf: "center",
        color: "white",
        lineHeight: 50,
      },
      regularButtonLightTablet: {
        fontFamily: "Bubblegum",
        marginBottom: 10,
        fontSize: 30,
        alignSelf: "center",
        color: "white",
        lineHeight: 60,
      },
      regularBig: {
        fontSize: 30,
        fontFamily: "Bubblegum",
        alignSelf: "center",
        textAlign: "center",
        color: COLORS.secondary,
      },
      subtitle: {
        fontFamily: "HindMedium",
        color: COLORS.secondary,
        fontSize: 18,
      },
      subtitleLink: {
        fontFamily: "HindMedium",
        color: COLORS.blue,
        fontSize: 18,
      },
      subtitleError: {
        fontFamily: "Hind",
        fontSize: 16,
        color: COLORS.danger,
        textAlign: "center",
      },
    }));
  } else {
    return (styles = StyleSheet.create({
      mainTitle: {
        fontSize: width * 0.17,
        width: "90%",
        textAlign: "center",
        fontFamily: "Shrikhand",
        color: COLORS.primary,
      },
      title: {
        width: "100%",
        fontSize: width * 0.11,
        fontFamily: "Shrikhand",
        textAlign: "center",
        color: COLORS.primary,
      },
      titleSec: {
        fontSize: width * 0.09,
        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "Bubblegum",
        marginBottom: 20,
        color: COLORS.secondary,
      },
      titleBlue: {
        fontSize: width * 0.09,
        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "Shrikhand",
        color: COLORS.primary,
      },
      titlePink: {
        fontSize: width * 0.09,
        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "Shrikhand",
        color: COLORS.secondary,
      },
      regular: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.03,
        lineHeight: height * 0.045,
        alignSelf: "center",
        textAlign: "justify",
        color: COLORS.secondary,
      },
      taskTitleText: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.025,
        lineHeight: height * 0.05,
        paddingHorizontal: 10,
        color: COLORS.secondary,
      },
      taskTitleTextAI: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.025,
        lineHeight: height * 0.05,
        paddingHorizontal: 10,
        color: COLORS.primary,
      },
      taskChildText: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.02,
        lineHeight: height * 0.05,
        color: COLORS.secondary,
      },
      taskChildTextAI: {
        fontFamily: "Bubblegum",
        fontSize: height * 0.02,
        lineHeight: height * 0.05,
        color: COLORS.primary,
      },
      regularButton: {
        fontFamily: "Bubblegum",
        marginBottom: 10,
        fontSize: 20,
        alignSelf: "center",
        color: COLORS.secondary,
        lineHeight: 50,
      },
      regularButtonLight: {
        fontFamily: "Bubblegum",
        marginBottom: 10,
        fontSize: 20,
        alignSelf: "center",
        color: "white",
        lineHeight: 50,
      },
      regularButtonLightTablet: {
        fontFamily: "Bubblegum",
        marginBottom: 10,
        fontSize: 30,
        alignSelf: "center",
        color: "white",
        lineHeight: 60,
      },
      regularBig: {
        fontSize: 30,
        fontFamily: "Bubblegum",
        alignSelf: "center",
        textAlign: "center",
        color: COLORS.secondary,
      },
      subtitle: {
        fontFamily: "HindMedium",
        color: COLORS.secondary,
      },
      subtitleLink: {
        fontFamily: "HindMedium",
        color: COLORS.blue,
      },
      subtitleError: {
        fontFamily: "Hind",
        fontSize: 12,
        color: COLORS.danger,
        textAlign: "center",
      },
    }));
  }
};
