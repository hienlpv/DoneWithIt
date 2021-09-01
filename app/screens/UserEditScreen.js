import React, { useContext, useState } from "react";
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
import { updateUser } from "../api/auth";
import AppButton from "../components/Button";
import colors from "../config/colors";
import AuthContext from "../auth/context";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  phone: Yup.string().required().label("Phone"),
  email: Yup.string().required().email().label("Email"),
});

function UserEditScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [updateFailed, setUpdateFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const result = await updateUser(user.id, values);
    setLoading(false);

    if (!result.ok) return setUpdateFailed(result.data);
    setUpdateFailed(false);
    setUser(result.data);
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: `Cập nhật thành công`,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      onPress: () => Toast.hide(),
    });
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView>
        <ScrollView>
          <ErrorMessage
            error={updateFailed}
            visible={updateFailed}
            style={{ textAlign: "center" }}
          />
          <Form
            initialValues={{
              name: user.name,
              email: user.email,
              street: user.street,
              phone: user.phone,
              city: user.city,
              country: user.country,
              apartment: user.apartment,
            }}
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
              keyboardType="numeric"
              icon="phone"
              name="phone"
              placeholder="Phone"
            />
            <FormField
              autoCorrect={false}
              icon="map-marker"
              name="apartment"
              placeholder="Địa chỉ"
            />
            <FormField
              autoCorrect={false}
              icon="city"
              name="street"
              placeholder="Quận/Huyện"
            />
            <FormField
              autoCorrect={false}
              icon="city"
              name="city"
              placeholder="Tỉnh/Thành phố"
            />
            <FormField
              autoCorrect={false}
              icon="earth"
              name="country"
              placeholder="Quốc gia"
            />
            {loading ? (
              <AppButton title="Cập nhật..." />
            ) : (
              <SubmitButton title="Cập nhật" />
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

export default UserEditScreen;
