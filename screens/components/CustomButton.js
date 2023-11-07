import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import { COLORS } from "../colors/colors";
import CustomText from "./CustomText";

const { width, height } = Dimensions.get("window");

export default class CustomButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (width >= 600) {
      if (this.props.type === "primary") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={{ overflow: "hidden" }}>
                <View
                  style={
                    this.props.disabled
                      ? styles(this.props.width).buttonPrimTabletDisabled
                      : styles(this.props.width).buttonPrimTablet
                  }
                >
                  <View style={styles(this.props.width).circle} />
                  <View style={styles(this.props.width).circleLeft} />
                  <View style={styles(this.props.width).circleMainTablet} />
                  <View style={styles(this.props.width).circleRight2} />
                  <View style={styles(this.props.width).circleRight} />
                  <CustomText type="regularButtonLightTablet">
                    {this.props.title}
                  </CustomText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "secondary") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonSecTablet}>
                <CustomText type="regularButtonLightTablet">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "success") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonSucTablet}>
                <CustomText type="regularButtonLightTablet">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "danger") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonDangerTablet}>
                <CustomText type="regularButtonLightTablet">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "light") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonLightTablet}>
                <Text>{this.props.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "dark") {
        return (
          <View
            style={styles(this.props.width).wrapper}
            disabled={this.props.disabled ? true : false}
          >
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles(this.props.width).buttonDarkTablet}>
                <CustomText type="regularButtonTablet">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "blue") {
        return (
          <View
            style={styles(this.props.width).wrapper}
            disabled={this.props.disabled ? true : false}
          >
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles(this.props.width).buttonBlue}>
                <CustomText type="regularButton">{this.props.title}</CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      if (this.props.type === "primary") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={{ overflow: "hidden" }}>
                <View
                  style={
                    this.props.disabled
                      ? styles(this.props.width).buttonPrimDisabled
                      : styles(this.props.width).buttonPrim
                  }
                >
                  <View style={styles(this.props.width).circle} />
                  <View style={styles(this.props.width).circleMain} />
                  <View style={styles(this.props.width).circleRight} />
                  <CustomText type="regularButtonLight">
                    {this.props.title}
                  </CustomText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "secondary") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonSec}>
                <CustomText type="regularButtonLight">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "success") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonSuc}>
                <CustomText type="regularButtonLight">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "danger") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonDanger}>
                <CustomText type="regularButtonLight">
                  {this.props.title}
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "light") {
        return (
          <View style={styles(this.props.width).wrapper}>
            <TouchableOpacity
              onPress={this.props.onPress}
              disabled={this.props.disabled ? true : false}
            >
              <View style={styles(this.props.width).buttonLight}>
                <Text>{this.props.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "dark") {
        return (
          <View
            style={styles(this.props.width).wrapper}
            disabled={this.props.disabled ? true : false}
          >
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles(this.props.width).buttonDark}>
                <CustomText type="regularButton">{this.props.title}</CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "blue") {
        return (
          <View
            style={styles(this.props.width).wrapper}
            disabled={this.props.disabled ? true : false}
          >
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles(this.props.width).buttonBlue}>
                <CustomText type="regularButton">{this.props.title}</CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      } else if (this.props.type === "blue") {
        return (
          <View
            style={styles(this.props.width).wrapper}
            disabled={this.props.disabled ? true : false}
          >
            <TouchableOpacity onPress={this.props.onPress}>
              <View style={styles(this.props.width).buttonBlue}>
                <CustomText type="regularButton">{this.props.title}</CustomText>
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }
}

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  width: PropTypes.string,
  disabled: PropTypes.bool,
};

const styles = (width2) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    buttonContainer: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      justifyContent: "center",
    },
    circle: {
      position: "absolute",
      backgroundColor: "#f09d48",
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: "hidden",
      top: -15,
      left: 30,
    },
    circleLeft: {
      position: "absolute",
      backgroundColor: "#f09d48",
      width: 60,
      height: 60,
      borderRadius: 30,
      overflow: "hidden",
      left: width * 0.2,
      bottom: -15,
    },
    circleMainTablet: {
      position: "absolute",
      backgroundColor: "#f09d48",
      width: 90,
      height: 90,
      borderRadius: 90,
      overflow: "hidden",
    },
    circleRight2: {
      position: "absolute",
      backgroundColor: "#f09d48",
      width: 60,
      height: 60,
      borderRadius: 60,
      overflow: "hidden",
      bottom: -15,
      right: width * 0.2,
    },
    circleMain: {
      position: "absolute",
      backgroundColor: "#f09d48",
      width: 65,
      height: 65,
      borderRadius: 65,
      overflow: "hidden",
    },
    circleRight: {
      position: "absolute",
      backgroundColor: "#f09d48",
      width: 45,
      height: 45,
      borderRadius: 45,
      overflow: "hidden",
      top: -10,
      right: 50,
    },

    buttonPrimTablet: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9c53c",
    },
    buttonPrimTabletDisabled: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9c53c",
      opacity: 0.7,
    },
    buttonPrim: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9c53c",
    },
    buttonPrimDisabled: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9c53c",
      opacity: 0.7,
    },
    buttonSec: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.secondary,
    },
    buttonSecTablet: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.secondary,
    },
    buttonSuc: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.success,
    },
    buttonSucTablet: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.success,
    },
    buttonLight: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderColor: COLORS.dark,
      borderWidth: 1,
    },
    buttonLightTablet: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderColor: COLORS.dark,
      borderWidth: 1,
    },
    buttonDanger: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.danger,
    },
    buttonDangerTablet: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.danger,
    },
    buttonDark: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.dark,
    },
    buttonBlue: {
      width: width2 ? width2 : "80%",
      alignSelf: "center",
      borderRadius: 25,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.blue,
    },
  });
