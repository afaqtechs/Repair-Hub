import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { signUp } from "@/api";


export default function SignUpScreen() {

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignUpPress = async () => {
    setError("");
    setLoading(true);

    try {
      await signUp(
        email,
        password,
        firstName,
        lastName
      );
      router.replace("/(root)/(tabs)");

    } catch (error: any) {
      setError(
        error.message
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        flexGrow: 1
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <View className="flex-1">
        <View className="bg-violet-700 h-max px-6 py-16">
          <View className="flex-row items-center">

            <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">

              <Image
                source={require("@/assets/ui/logo.png")}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: "white",
                }}
                resizeMode="contain"
              />

            </View>

            <Text className=" text-white text-2xl font-bold ml-3">

              Repair
              <Text className="text-violet-200">
                Hub
              </Text>

            </Text>


          </View>

          <View className="mt-5 relative justify-between gap-3 ">
            <View className="flex-1 w-[200px]">
              <Text className=" text-white  text-2xl  font-bold  mt-5 ">
                Create your account
              </Text>


              <Text className=" text-violet-100 mt-2 text-base ">
                Join Repair Hub and grow your repair business today.
              </Text>
            </View>
            <Image
              source={require("@/assets/ui/technician.png")}
              className="rounded-full z-10 bg-white p-5 flex-1 absolute -right-5 -bottom-10 w-40 h-40"
              resizeMode="contain"
            />

          </View>

        </View>

        {/* FORM */}

        <View className="  bg-white -mt-10 rounded-3xl  px-5 py-7  shadow-sm">

          <View className="flex-row gap-3 mb-4">

            <View className=" flex-1 border border-gray-200 rounded-xl flex-row items-center px-3">

              <Ionicons
                name="person-outline"
                size={20}
                color="#9CA3AF"
              />
              <TextInput
                className="flex-1 py-4 ml-2"
                placeholder="First name"
                placeholderTextColor="#9CA3AF"

                value={firstName}
                onChangeText={setFirstName}

              />
            </View>

            <View className=" flex-1  border  border-gray-200 rounded-xl flex-row items-center  px-3">

              <Ionicons
                name="person-outline"
                size={20}
                color="#9CA3AF"
              />
              <TextInput

                className="flex-1 py-4 ml-2"

                placeholder="Last name"
                placeholderTextColor="#9CA3AF"

                value={lastName}
                onChangeText={setLastName}

              />
            </View>
          </View>

          <View className=" border border-gray-200 rounded-xl flex-row items-center px-3 mb-4 ">


            <Ionicons
              name="mail-outline"
              size={20}
              color="#9CA3AF"
            />
            <TextInput

              className="flex-1 py-4 ml-2"

              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"

              keyboardType="email-address"
              autoCapitalize="none"

              value={email}
              onChangeText={setEmail}

            />
          </View>

          <View className=" border border-gray-200 rounded-xl flex-row items-center px-3">


            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
            />


            <TextInput

              className="flex-1 py-4 ml-2"

              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"

              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}

              value={password}
              onChangeText={setPassword}
            />


            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >

              <Ionicons

                name={
                  showPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }

                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <Text className=" text-gray-400 text-sm mt-2 mb-5 ">
            Password must be at least 8 characters

          </Text>


          <View className=" flex-row items-center mb-6 ">

            <View className=" w-5 h-5 rounded bg-violet-600 items-center justify-center mr-2 ">
              <Ionicons
                name="checkmark"
                size={14}
                color="white"
              />
            </View>

            <Text className="text-gray-500">
              I agree to the
              <Text className="text-violet-600">
                Terms of Service
              </Text>

              and

              <Text className="text-violet-600">
                Privacy Policy
              </Text>

            </Text>
          </View>

          {error &&
            <Text className="text-red-500 mb-4">
              {error}
            </Text>
          }

          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={loading}
            className=" bg-violet-700 rounded-xl py-4 items-center mb-6 "
          >
            {
              loading ?

                <ActivityIndicator color="white" />
                :
                <View className="flex-row items-center justify-center">

                  <Text className="text-white font-bold text-base mr-2">
                    Sign Up
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="white"
                  />

                </View>
            }
          </TouchableOpacity>

          <View className=" bg-violet-50 rounded-2xl p-4 flex-row items-center">
            <Image
              source={require("@/assets/ui/security-badge.png")}
              className=" w-12 h-12 mr-3"
              resizeMode="contain"

            />

            <View className="flex-1">

              <Text className=" text-violet-700 font-bold">

                Secure & Trusted

              </Text>

              <Text className="text-gray-500 text-sm">

                Your data is protected and your business is safe with us.

              </Text>

            </View>

          </View>

        </View>

        {/* FOOTER */}

        <View className=" flex-row justify-center my-8 ">


          <Text className="text-gray-500">

            Already have an account?

          </Text>


          <Link href="/sign-in">

            <Text className=" text-violet-600 font-bold ml-2 ">

              Sign In

            </Text>

          </Link>
        </View>

      </View>

    </ScrollView>

  );

}