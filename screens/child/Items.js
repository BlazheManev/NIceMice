//zaslon na katerem bo trgovina
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, off, set, child } from "firebase/database";
import { auth } from "../util/firebaseconfig";
import app from "../util/firebaseconfig";
import { COLORS } from "../colors/colors";
import Modal from "react-native-modal";
import CustomButton from "../components/CustomButton";
import { runTransaction } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Shadow } from "react-native-shadow-2";
const { width, height } = Dimensions.get("window");
import CustomText from "../components/CustomText";

function Items() {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [child, setChild] = useState("");
  const [change, setChange] = useState(false);

  const navigation = useNavigation();
  const [coinCount, setCoinCount] = useState(0);
  const db = getDatabase(app);
  const getChildId = async () => {
    try {
      const char = await AsyncStorage.getItem("childId");
      if (char !== null) {
        setChild(char);
      } else {
        navigation.navigate("Switch");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (auth.currentUser && child) {
      const userId = auth.currentUser.uid;

      const itemRef = ref(db, `users/${userId}/children/${child}/items`);
      const itemListener = onValue(itemRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const itemsArray = Object.keys(data).map((key) => {
            return { ...data[key], id: key };
          });
          setItems(itemsArray);
        } else {
          console.log("No items available");
        }
      });

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
        off(itemRef, "value", itemListener);
        off(coinRef, "value", coinListener);
      };
    }
  }, [db, change, child]);

  useEffect(() => {
    getChildId();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{
        flex: 1,
        padding: width * 0.02,
      }}
    >
      <Shadow
        corners={{ topStart: false, topEnd: false, bottomStart: false }}
        sides={{ top: false, start: false }}
        distance={5}
        paintInside={false}
      >
        <View style={styles.card}>
          <Image
            source={{
              uri: item.url,
            }}
            style={styles.image}
          />
          <CustomText type="regular">{item.name}</CustomText>
          <CustomText type="subtitle">{item.price} coins</CustomText>
        </View>
      </Shadow>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <View style={{ alignItems: "flex-start", alignSelf: "flex-start" }}>
          <CustomText type="regular">Balance: {coinCount}</CustomText>
        </View>
      </View>

      {items.length === 0 ? (
        <CustomText type="regular">No items available</CustomText>
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.9,
    alignSelf: "center",
  },
  card: {
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: COLORS.light,
    alignSelf: "center",
    padding: 32,
    borderRadius: 25,
    width: "80%",
  },
  disabledCard: {
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  image: {
    width: width * 0.4,
    height: height * 0.2,
    resizeMode: "cover",
    overflow: "hidden",
    marginBottom: 8,
    alignSelf: "center",
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.25,
    marginBottom: 8,
    resizeMode: "contain",
  },
});

export default Items;
