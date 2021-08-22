import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { register } from "../api/auth";
import AppButton from "../components/Button";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  phone: Yup.string().required().label("Phone"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen({ navigation }) {
  const [registerFailed, setRegisterFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const result = await register(values);
    setLoading(false);

    if (!result.ok) return setRegisterFailed(result.data);
    setRegisterFailed(false);

    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Screen style={styles.container}>
          <ErrorMessage error={registerFailed} visible={registerFailed} />
          <Form
            initialValues={{ name: "", email: "", password: "", phone: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField
              autoCorrect={false}
              icon="account"
              name="name"
              placeholder="Name"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              placeholder="Email"
              textContentType="emailAddress"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              name="password"
              placeholder="Password"
              secureTextEntry
              textContentType="password"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              icon="phone"
              name="phone"
              placeholder="Phone"
            />
            {loading ? (
              <AppButton title="Register..." />
            ) : (
              <SubmitButton title="Register" />
            )}
          </Form>
          <ActivityIndicator
            animating={loading}
            size="large"
            color={colors.primary}
          />
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
