import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Button from "../components/Button";
import colors from "../config/colors";
import { register } from "../api/auth";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Họ và Tên"),
  phone: Yup.string().required().label("Số ĐT"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Mật khẩu"),
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
    <Screen style={styles.container}>
      <KeyboardAvoidingView>
        <ScrollView>
          <ErrorMessage
            error={registerFailed}
            visible={registerFailed}
            style={{ textAlign: "center" }}
          />
          <Form
            initialValues={{ name: "", email: "", password: "", phone: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField
              autoCorrect={false}
              icon="account"
              name="name"
              placeholder="Họ và Tên"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              placeholder="Email đăng nhập"
              textContentType="emailAddress"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              name="password"
              placeholder="Mật khẩu"
              secureTextEntry
              textContentType="password"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              icon="phone"
              name="phone"
              placeholder="Số điện thoại"
            />
            {loading ? (
              <Button title="Đăng ký..." />
            ) : (
              <SubmitButton title="Đăng ký" />
            )}
          </Form>
          <ActivityIndicator
            animating={loading}
            size="large"
            color={colors.primary}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
