import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import PropTypes from "prop-types";
import { COLORS } from "../colors/colors";
export default class CountrySelect extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <DropDownPicker
        containerStyle={{
          justifyContent: "center",
          alignItems: "flex-end",
          borderRadius: 25,
          margin: 16,
          width: 110,
          backgroundColor: "transparent",
        }}
        dropDownContainerStyle={{
          backgroundColor: "transparent",
          borderColor: COLORS.primary,
        }}
        style={{
          borderRadius: 25,
          borderColor: "transparent",
          backgroundColor: "transparent",
        }}
        open={this.props.open}
        value={this.props.value}
        items={this.props.items}
        setOpen={this.props.setOpen}
        setValue={this.props.setValue}
        setItems={this.props.setItems}
      />
    );
  }
}
CountrySelect.propTypes = {
  value: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setItems: PropTypes.func.isRequired,
};
