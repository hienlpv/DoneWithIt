import React, { useState, useContext } from "react";
import { StyleSheet, Image } from "react-native";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
import { ActivityIndicator } from "react-native";

import Screen from "../components/Screen";
import {
  Form,
  FormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import { login } from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import colors from "../config/colors";
import AppButton from "../components/Button";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const authContext = useContext(AuthContext);

  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const result = await login(values);
    setLoading(false);

    if (!result.ok) return setLoginFailed(true);
    setLoginFailed(false);

    const user = jwtDecode(result.data);
    authContext.setUser(user.user);
    authStorage.storeToken(result.data);
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo-red.png")} />

      <ErrorMessage
        style={styles.error}
        error="Invalid email or password"
        visible={loginFailed}
      />
      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
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
        {loading ? (
          <AppButton title="Login..." />
        ) : (
          <SubmitButton title="Login" />
        )}
      </Form>
      <ActivityIndicator
        animating={loading}
        size="large"
        color={colors.primary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  error: {
    width: "100%",
    textAlign: "center",
  },
});

export default LoginScreen;
