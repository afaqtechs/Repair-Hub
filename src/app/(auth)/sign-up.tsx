import { Link, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { signUp } from "@/src/api";
import { showError, showSuccess } from "@/src/lib/toast";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatFileSize } from "@/src/utils/formatFileSize";
import { decodeBase64 } from "@/src/utils/decodeBase64";
import { supabase } from "@/src/lib/supabase";


export default function SignUpScreen() {

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    size: number;
    mimeType: string;
  } | null>(null);

  const [uploadingDocument, setUploadingDocument] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const file = new File(asset.uri);
      const fileInfo = await file.info();

      const size = fileInfo.exists
        ? fileInfo.size ?? asset.size
        : undefined;

      if (size === undefined) {
        showError("Error", "Could not read the file size");
        return;
      }

      if (size > 2 * 1024 * 1024) {
        showError("File Too Large", "Please select a file smaller than 2MB");
        return;
      }

      setSelectedFile({
        uri: asset.uri,
        name: asset.name || "document",
        size,
        mimeType: asset.mimeType || "application/pdf",
      });
    } catch (error: any) {
      showError("Error", error.message || "Failed to select document");
    }
  };

  const onSignUpPress = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await signUp(
        email,
        password,
        firstName,
        lastName,
        phone,
      );

      if (!data?.user) {
        throw new Error("Could not create your account");
      }

      const userId = data.user.id;

      // Upload license if selected
      if (selectedFile) {
        setUploadingDocument(true);

        const file = new File(selectedFile.uri);
        const base64 = await file.base64();

        const extension = selectedFile.name.includes(".")
          ? selectedFile.name.split(".").pop()
          : selectedFile.mimeType.split("/").pop();

        const filePath = `${userId}/legal_doc_${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("legal_documents")
          .upload(
            filePath,
            decodeBase64(base64),
            {
              contentType: selectedFile.mimeType,
              upsert: false,
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            legal_document_url: filePath,
            verification_status: "pending",
          })
          .eq("id", userId);

        if (profileError) {
          throw profileError;
        }
      }

      showSuccess(
        "Success",
        "Registered successfully"
      );

      router.replace("/(root)/(tabs)");

    } catch (error: any) {
      setError(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
      setUploadingDocument(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View className="flex-1">
            <View className=" h-max px-6 py-16">
              <View className="flex-row items-center">

                <View className="w-14 h-14 rounded-full  bg-card items-center justify-center">

                  <Image
                    source={require("@/assets/ui/logo.png")}
                    className="w-[40px] h-[40px] rounded-xl overflow-hidden"
                    resizeMode="contain"
                  />
                </View>

                <Text className=" text-text text-2xl font-bold ml-3">

                  Addis
                  <Text className="text-green-500">
                    Repairs
                  </Text>

                </Text>


              </View>

              <View className="mt-0 relative justify-between gap-3 ">
                <View className="flex-1 w-[200px]">
                  <Text className=" text-text  text-2xl  font-bold  mt-5 ">
                    Create your account
                  </Text>

                  <Text className=" text-gray-500 mt-2 text-base ">
                    Join Addis Repairs and grow your repair business today.
                  </Text>
                </View>
                <Image
                  source={require("@/assets/ui/technician.png")}
                  className="rounded-full z-10 bg-card p-5 flex-1 absolute -right-5 -bottom-10 w-40 h-40"
                  resizeMode="contain"
                />

              </View>

            </View>

            {/* FORM */}

            <View className="  bg-card -mt-10 rounded-3xl  px-5 py-10  shadow-sm">

              <View className="flex-row gap-3 mb-4">

                <View className=" flex-1 bg-input border border-border rounded-xl flex-row items-center px-3">

                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput
                    className="flex-1 py-4 ml-2 text-text"
                    placeholder="First name"
                    placeholderTextColor="#9CA3AF"

                    value={firstName}
                    onChangeText={setFirstName}

                  />
                </View>

                <View className=" flex-1 bg-input border border-border rounded-xl flex-row items-center  px-3">

                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput

                    className="flex-1 py-4 ml-2 text-text"

                    placeholder="Last name"
                    placeholderTextColor="#9CA3AF"

                    value={lastName}
                    onChangeText={setLastName}

                  />
                </View>
              </View>

              <View className="bg-input border border-border rounded-xl flex-row items-center px-3 mb-4 ">

                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput

                  className="flex-1 py-4 ml-2 text-text"

                  placeholder="Enter your email address"
                  placeholderTextColor="#9CA3AF"

                  keyboardType="email-address"
                  autoCapitalize="none"

                  value={email}
                  onChangeText={setEmail}

                />
              </View>

              <View className="bg-input border border-border rounded-xl flex-row items-center px-3 mb-4 ">

                <Ionicons
                  name="phone-portrait-outline"
                  size={20}
                  color="#9CA3AF"
                />


                <TextInput

                  className="flex-1 py-4 ml-2 text-text"

                  placeholder="Add your phone number"
                  placeholderTextColor="#9CA3AF"

                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}

                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View className="bg-input border border-border rounded-xl flex-row items-center px-3 mb-4">

                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9CA3AF"
                />


                <TextInput

                  className="flex-1 py-4 ml-2 text-text"

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

              {error &&
                <Text className="text-red-500 mb-4">
                  {error}
                </Text>
              }

              <View className="mb-5">
                <View className="flex-row items-center mb-2">
                  <Text className="text-text font-semibold">
                    Business License
                  </Text>

                  <Text className="text-gray-400 text-xs ml-2">
                    (Optional)
                  </Text>
                </View>

                <Text className="text-gray-400 text-xs mb-3">
                  You can upload, edit, or remove your license later from your account.
                </Text>

                <TouchableOpacity
                  onPress={handlePickDocument}
                  className="bg-input border border-border rounded-xl px-4 py-4 flex-row items-center"
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#9CA3AF"
                  />

                  <View className="flex-1 ml-3">
                    <Text className="text-text font-medium">
                      {selectedFile
                        ? selectedFile.name
                        : "Upload your business license"}
                    </Text>

                    <Text className="text-gray-400 text-xs mt-1">
                      PDF, JPG or PNG • Max 2MB
                    </Text>
                  </View>

                  {selectedFile ? (
                    <TouchableOpacity
                      onPress={() => setSelectedFile(null)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={22}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons
                      name="cloud-upload-outline"
                      size={22}
                      color="#16A34A"
                    />
                  )}
                </TouchableOpacity>

                {selectedFile && (
                  <Text className="text-gray-400 text-xs mt-2">
                    {formatFileSize(selectedFile.size)}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={loading}
                className=" bg-green-700 rounded-xl py-4 items-center mb-6 "
              >
                {loading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="white" />

                    <Text className="text-white font-bold ml-2">
                      {uploadingDocument ? "Uploading license..." : "Creating account..."}
                    </Text>
                  </View>
                ) : (
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
                )}
              </TouchableOpacity>

            </View>
            {/* FOOTER */}

            <View className=" flex-row justify-center my-8 ">


              <Text className="text-gray-500">

                Already have an account?

              </Text>


              <Link href="/sign-in">

                <Text className=" text-green-600 font-bold ml-2">

                  Sign In

                </Text>

              </Link>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );

}