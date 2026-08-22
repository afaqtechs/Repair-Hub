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
import { showError, showSuccess } from "@/src/lib/toast";
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

        if (!email.trim() || !password.trim()) {
            showError("Failed", "Email and password are required");
            return;
        }

        setLoading(true);

        try {
            const result = await signIn(
                email.trim(),
                password
            );

            if (result?.user) {
                showSuccess("Welcome back!", "Logged in successfully");
                router.replace("/");
            } else {
                showError("Failed", "Failed to sign in please provide correct credentials.");
            }

        } catch (error: any) {
            const message =
                error?.message || "Unable to sign in";

            setError(message);
            showError("Sign in failed", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-bg">
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

                            <View className="w-14 h-14 rounded-full  bg-card items-center justify-center">

                                <Image
                                    source={require("@/assets/ui/logo.png")}
                                    resizeMode="contain"
                                    className="w-[40px] h-[40px] rounded-xl overflow-hidden"
                                />
                            </View>

                            <Text className=" text-text  text-2xl  font-bold  ml-3">
                                Repair
                                <Text className="text-violet-500">
                                    Hub
                                </Text>
                            </Text>

                        </View>

                        <Text className="text-text text-2xl font-bold mt-5">
                            Welcome back!
                        </Text>

                        <Text className="text-gray-500 mt-2 text-base">
                            Sign in to continue with RepairHub.
                        </Text>

                    </View>


                    <View className="rounded-3xl px-5 py-7 ">
                        <Text className="text-text font-semibold mb-2">
                            Email
                        </Text>


                        <View className=" bg-input border border-border rounded-xl flex-row items-center px-4 mb-5">
                            {/* Email Icon Placeholder */}
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#9CA3AF"
                            />
                            <TextInput

                                className="flex-1 py-4 ml-2 text-text"

                                placeholder="Enter your email address"
                                placeholderTextColor="#9CA3AF"

                                value={email}
                                onChangeText={setEmail}

                                keyboardType="email-address"
                                autoCapitalize="none"

                            />

                        </View>

                        <Text className="text-text font-semibold mb-2">
                            Password
                        </Text>

                        <View className="bg-input border border-border rounded-xl flex-row items-center px-4 ">
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#9CA3AF"
                            />

                            <TextInput
                                className=" flex-1 py-4 ml-2 text-text"

                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"

                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry

                                value={password}
                                onChangeText={setPassword}

                            />
                        </View>

                        {error && (

                            <Text className=" text-red-500 mb-4">
                                {error}
                            </Text>

                        )}

                        <TouchableOpacity
                            onPress={onSignInPress}
                            disabled={loading}
                            className="bg-violet-700 rounded-xl py-4 items-center my-6"
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
                    </View>

                    <View className=" flex-row justify-center gap-3">
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