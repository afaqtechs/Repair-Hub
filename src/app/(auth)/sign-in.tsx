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

import { signIn } from "@/src/api";
import { showSuccess } from "@/src/lib/toast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {

    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSignInPress = async () => {
        setError("");
        setLoading(true);
        try {
            await signIn(
                email,
                password
            );
            showSuccess("Login", "Logged in successfully")
            router.replace("/");

        } catch (error: any) {
            setError(
                error.message
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-bg dark:bg-bg-dark">
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1
                }}
                showsVerticalScrollIndicator={false}
            >

                <View className="flex-1">
                    {/* Header */}
                    <View className="h-max px-6 pt-16">

                        <View className="flex-row items-center">

                            <View className="w-14 h-14 rounded-full  bg-card dark:bg-card-dark items-center justify-center">

                                <Image
                                    source={require("@/assets/ui/logo.png")}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        tintColor: "purple",
                                    }}
                                    resizeMode="contain"
                                />
                            </View>


                            <Text className=" text-text dark:text-text-dark  text-2xl  font-bold  ml-3">
                                Repair
                                <Text className="text-violet-500">
                                    Hub
                                </Text>
                            </Text>

                        </View>

                        <Text className="text-text dark:text-text-dark text-2xl font-bold mt-5">
                            Welcome back!
                        </Text>

                        <Text className="text-gray-500 mt-2 text-base">
                            Sign in to continue with RepairHub.
                        </Text>

                    </View>


                    <View className="rounded-3xl px-5 py-7 ">
                        <Text className="text-text dark:text-text-dark font-semibold mb-2">
                            Email
                        </Text>


                        <View className=" bg-input dark:bg-input-dark border border-border dark:border-border-dark rounded-xl flex-row items-center px-4 mb-5">
                            {/* Email Icon Placeholder */}
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#9CA3AF"
                            />
                            <TextInput

                                className="flex-1 py-4 ml-2 text-text dark:text-text-dark"

                                placeholder="Enter your email address"
                                placeholderTextColor="#9CA3AF"

                                value={email}
                                onChangeText={setEmail}

                                keyboardType="email-address"
                                autoCapitalize="none"

                            />

                        </View>

                        <Text className="text-text dark:text-text-dark font-semibold mb-2">
                            Password
                        </Text>

                        <View className="bg-input dark:bg-input-dark border border-border dark:border-border-dark rounded-xl flex-row items-center px-4 ">
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#9CA3AF"
                            />

                            <TextInput
                                className=" flex-1 py-4 ml-2 text-text dark:text-text-dark"

                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"

                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry

                                value={password}
                                onChangeText={setPassword}

                            />
                        </View>

                        <View className="flex-row justify-between items-center mt-4 mb-6">

                            <View className="flex-row items-center">
                                <View className=" w-5 h-5 rounded bg-violet-600 items-center justify-center mr-2 ">

                                    <Ionicons
                                        name="checkmark"
                                        size={14}
                                        color="white"
                                    />
                                </View>

                                <Text className="text-gray-500">
                                    Remember me
                                </Text>
                            </View>


                            <TouchableOpacity>
                                <Text className="text-violet-600 font-semibold">
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>

                        </View>

                        {error && (

                            <Text className=" text-red-500 mb-4">
                                {error}
                            </Text>

                        )}

                        <TouchableOpacity
                            onPress={onSignInPress}
                            disabled={loading}
                            className="bg-violet-700 rounded-xl py-4 items-center mb-6"
                        >

                            {
                                loading ?
                                    <ActivityIndicator color="white" />
                                    :
                                    <View className="flex-row items-center justify-center">

                                        <Text className="text-white font-bold text-base mr-2">
                                            Sign In
                                        </Text>

                                        <Ionicons
                                            name="arrow-forward"
                                            size={20}
                                            color="white"
                                        />

                                    </View>
                            }

                        </TouchableOpacity>

                        <View className=" flex-row items-center mb-5">

                            <View className="flex-1 h-px bg-card dark:bg-card-dark" />

                            <Text className="mx-3 text-gray-400">
                                continue with
                            </Text>

                            <View className="flex-1 h-px bg-card dark:bg-card-dark" />
                        </View>

                        <TouchableOpacity
                            className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl py-3 flex-1 mx-1 items-center"

                        >
                            <Text className="text-text dark:text-text-dark font-semibold">
                                Google
                            </Text>
                        </TouchableOpacity>

                        <View className=" bg-card dark:bg-card-dark rounded-2xl p-4 mt-6">
                            <View className="flex-row items-center">

                                <Image
                                    source={require("@/assets/ui/security-badge.png")}
                                    className="w-7 h-7 mr-2"
                                    resizeMode="contain"
                                />

                                <Text className=" text-violet-700 font-bold">
                                    Safe & Secure
                                </Text>

                            </View>
                            <Text className=" text-gray-500 mt-1">
                                Your information is protected and your account stays secure.
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}

                    <View className=" flex-row justify-center gap-3 mt-8 mb-8">
                        <Text className="text-gray-500">
                            Don&apos;t have an account?
                        </Text>
                        <Link href="/sign-up">

                            <Text className=" text-violet-600 font-bold ml-2">
                                Sign Up
                            </Text>

                        </Link>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}