import {
  NavigationContainer,
  useScrollToTop,
  DefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { Image, Text, Navigation, TouchableOpacity } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import Charpicker from "./screens/child/Charpicker";
import Comic from "./screens/child/Comic";
import Parent from "./screens/parent/Parent";
import TaskChecker from "./screens/parent/TaskChecker";
import TaskMaker from "./screens/parent/TaskMaker";
import Quickinst from "./screens/postsub/Quickinst";
import Switch from "./screens/postsub/Switch";
import Welcome from "./screens/postsub/Welcome";
import Description from "./screens/starterscreens/Description";
import Login from "./screens/util/login";
import Register from "./screens/util/register";
import Subscription from "./screens/starterscreens/Subscription";
import Tasker from "./screens/child/Tasker";
import { auth, db } from "./screens/util/firebaseconfig";
import Shop from "./screens/util/shop";
import ForgotPassword from "./screens/util/forgotPassword";
import AddChild from "./screens/util/addChild";
import ChildPicker from "./screens/child/ChildPicker";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ref, onValue, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChildSwitch from "./screens/child/ChildSwitch";
import AccountParent from "./screens/parent/AccountParent";
import SplashScreen from "./screens/starterscreens/SplashScreen";
import { Appearance, useColorScheme } from "react-native";
import Items from "./screens/child/Items";

// Default screens
const Stack = createStackNavigator();

function App() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false); // New state variable
  const [isLoading, setIsLoading] = useState(true);

  /*const [open, setOpen] = useState(false);
  const [value, setValue] = useState("uk");
  const [items, setItems] = useState([
    {
      label: "UK",
      value: "uk",
      icon: () => <Image source={require("./assets/gb.png")} />,
    },
    {
      label: "FRA",
      value: "fra",
      icon: () => <Image source={require("./assets/fr.png")} />,
    },
    {
      label: "SLO",
      value: "slo",
      icon: () => <Image source={require("./assets/si.png")} />,
    },
  ]);*/

  useEffect(() => {
    // Call the async function to set the initial route
    const unsubscribeAuthListener = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        const userId = user.uid;
        const subscriptionRef = ref(db, "users/" + userId + "/subscription");
        const datas = onValue(subscriptionRef, (snapshot) => {
          const data = snapshot.val();
          setSubscriptionData(data);
          checkSubscriptionStatus(data, user);
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
      } else {
        setSubscriptionData(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuthListener();
    };
  }, []);

  // The subscription has expired

  const checkSubscriptionStatus = (subscriptionData, user) => {
    if (subscriptionData) {
      const { startDate, endDate } = subscriptionData;

      const currentDate = new Date();
      const subscriptionEndDate = new Date(endDate);

      if (currentDate > subscriptionEndDate) {
        const { email } = user;
        setIsSubscriptionExpired(true);

        const dataToSave = {
          isSubscriptionExpired: true,
          email,
        };
        AsyncStorage.removeItem("subscription").catch((error) =>
          console.log("Error deleting data:", error)
        );

        AsyncStorage.setItem("subscription", JSON.stringify(dataToSave)).catch(
          (error) => console.log("Error storing data:", error)
        );
      } else {
        AsyncStorage.removeItem("subscription").catch((error) =>
          console.log("Error deleting data:", error)
        );
        setIsSubscriptionExpired(false);
      }
    } else {
      setIsSubscriptionExpired(true);
    }
  };
  let colorScheme = useColorScheme();

  const publishableKey =
    "pk_live_51KrfW0Iz3z99y32E5d2HVOFKmqQnpXCqel5OFsgi90VB230AeY7xNdgAnN1APpdFIRVzno24xD4Ef3VewSq9ig5C00lEO3BXMe";
  /*if (colorScheme === "dark") {
    // render some dark thing
    return (
      <StripeProvider publishableKey={publishableKey}>
        <NavigationContainer>
          {isLoading ? (
            <SplashScreen />
          ) : (
            <Stack.Navigator
              initialRouteName={auth.currentUser ? "Welcome" : "Description"}
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#0C0C0C", // Set the header background color to transparent
                },
                headerTitleStyle: {
                  color: "white",
                },
                cardStyle: { backgroundColor: "#0C0C0C" }, // Set the background color to transparent
              }}
            >
              {auth.currentUser ? (
                <>
                  <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{
                      title: "Welcome",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="Tasker"
                    component={Tasker}
                    options={{
                      title: "Child",
                    }}
                  />
                  <Stack.Screen
                    name="AccountParent"
                    component={AccountParent}
                    options={{
                      title: "Account",
                    }}
                  />
                  <Stack.Screen
                    name="AddChild"
                    component={AddChild}
                    options={{
                      title: "Add a child",
                    }}
                  />
                  <Stack.Screen
                    name="ChildPicker"
                    component={ChildPicker}
                    options={{
                      title: "Pick a child",
                    }}
                  />
                  <Stack.Screen
                    name="ChildSwitch"
                    component={ChildSwitch}
                    options={{
                      title: "Child",
                    }}
                  />
                  <Stack.Screen
                    name="Subscription"
                    component={Subscription}
                    options={{
                      title: "Subscribe",
                    }}
                  />
                  <Stack.Screen
                    name="Quickinst"
                    component={Quickinst}
                    options={{
                      title: "Introduction",
                    }}
                  />
                  <Stack.Screen
                    name="Store"
                    component={Shop}
                    options={{
                      title: "Store",
                    }}
                  />
                  <Stack.Screen
                    name="Switch"
                    component={Switch}
                    options={{
                      title: "Account picker",
                    }}
                  />
                  <Stack.Screen
                    name="Comic"
                    component={Comic}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Charpicker"
                    component={Charpicker}
                    options={{
                      title: "Mouse picker",
                    }}
                  />
                  <Stack.Screen
                    name="Parent"
                    component={Parent}
                    options={{
                      title: "Instructions",
                    }}
                  />
                  <Stack.Screen
                    name="TaskChecker"
                    component={TaskChecker}
                    options={({ navigation }) => ({
                      headerRight: () => (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("AccountParent")}
                        >
                          <Image
                            source={require("./assets/images/account.png")}
                            style={{ height: 25, width: 25, marginRight: 16 }}
                          />
                        </TouchableOpacity>
                      ),
                      title: "All tasks",
                    })}
                  />
                  <Stack.Screen
                    name="TaskMaker"
                    component={TaskMaker}
                    options={{
                      title: "New task",
                    }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{
                      title: "Sign up",
                    }}
                  />
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                      title: "Sign in",
                    }}
                  />
                  <Stack.Screen
                    name="Description"
                    component={Description}
                    options={{
                      title: "Description",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{
                      title: "Description",
                    }}
                  />
                  <Stack.Screen
                    name="Subscription"
                    component={Subscription}
                    options={{
                      title: "Subscribe",
                    }}
                  />
                </>
              )}
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </StripeProvider>
    );
  } else {*/
  // render some light thing
  return (
    <StripeProvider publishableKey={publishableKey}>
      <NavigationContainer>
        {isLoading ? (
          <SplashScreen />
        ) : (
          <Stack.Navigator
            initialRouteName={auth.currentUser ? "Welcome" : "Description"}
            screenOptions={{
              headerStyle: {
                backgroundColor: "white", // Set the header background color to transparent
              },

              cardStyle: { backgroundColor: "white" }, // Set the background color to transparent
            }}
          >
            {auth.currentUser ? (
              <>
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{
                    title: "Welcome",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Tasker"
                  component={Tasker}
                  options={{
                    title: "Child",
                  }}
                />
                <Stack.Screen
                  name="AccountParent"
                  component={AccountParent}
                  options={{
                    title: "Account",
                  }}
                />
                <Stack.Screen
                  name="AddChild"
                  component={AddChild}
                  options={{
                    title: "Add a child",
                  }}
                />
                <Stack.Screen
                  name="ChildPicker"
                  component={ChildPicker}
                  options={{
                    title: "Pick a child",
                  }}
                />
                <Stack.Screen
                  name="ChildSwitch"
                  component={ChildSwitch}
                  options={{
                    title: "Child",
                  }}
                />
                <Stack.Screen
                  name="Subscription"
                  component={Subscription}
                  options={{
                    title: "Subscribe",
                  }}
                />
                <Stack.Screen
                  name="Quickinst"
                  component={Quickinst}
                  options={{
                    title: "Introduction",
                  }}
                />
                <Stack.Screen
                  name="Store"
                  component={Shop}
                  options={{
                    title: "Store",
                  }}
                />
                <Stack.Screen
                  name="Switch"
                  component={Switch}
                  options={{
                    title: "Account picker",
                  }}
                />
                <Stack.Screen
                  name="Comic"
                  component={Comic}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Charpicker"
                  component={Charpicker}
                  options={{
                    title: "Mouse picker",
                  }}
                />
                <Stack.Screen
                  name="Parent"
                  component={Parent}
                  options={{
                    title: "Instructions",
                  }}
                />
                <Stack.Screen
                  name="TaskChecker"
                  component={TaskChecker}
                  options={({ navigation }) => ({
                    headerRight: () => (
                      <TouchableOpacity
                        onPress={() => navigation.navigate("AccountParent")}
                      >
                        <Image
                          source={require("./assets/images/account.png")}
                          style={{ height: 25, width: 25, marginRight: 16 }}
                        />
                      </TouchableOpacity>
                    ),
                    title: "All tasks",
                  })}
                />
                <Stack.Screen
                  name="TaskMaker"
                  component={TaskMaker}
                  options={{
                    title: "New task",
                  }}
                />
                <Stack.Screen
                  name="Items"
                  component={Items}
                  options={{
                    title: "Your Items",
                  }}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{
                    title: "Sign up",
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    title: "Sign in",
                  }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                  options={{
                    title: "Description",
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{
                    title: "Sign up",
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    title: "Sign in",
                  }}
                />
                <Stack.Screen
                  name="Description"
                  component={Description}
                  options={{
                    title: "Description",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                  options={{
                    title: "Description",
                  }}
                />
                <Stack.Screen
                  name="Subscription"
                  component={Subscription}
                  options={{
                    title: "Subscribe",
                  }}
                />
                {/* Add other non-authenticated screens here */}
              </>
            )}
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </StripeProvider>
  );
}
// }
export default App;
