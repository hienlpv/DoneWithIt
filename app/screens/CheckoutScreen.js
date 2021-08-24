import React, { useState, useContext } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Alert,
} from "react-native";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { ListItem } from "../components/lists";
import UploadScreen from "./UploadScreen";
import Icon from "../components/Icon";

import AuthContext from "../auth/context";
import { addOrder } from "../api/order";
import * as cartActions from "../redux/actions/cartItem";
import * as productActions from "../redux/actions/product";

const validationSchema = Yup.object().shape({
  shippingAddress1: Yup.string().required().label("Address"),
  city: Yup.string().required().label("City"),
  phone: Yup.string().required().label("Phone"),
});

function CheckoutScreen(props) {
  const { navigation, cartItems, clearCart, fetchProducts } = props;
  const { user } = useContext(AuthContext);

  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = async (values) => {
    const orderItems = [];

    cartItems.forEach((cartItem) => {
      orderItems.push({ product: cartItem.id, quantity: cartItem.count });
    });

    const dataPost = {
      orderItems,
      ...values,
      user: user.id,
    };

    setProgress(0);
    setUploadVisible(true);

    const result = await addOrder(dataPost, (progress) =>
      setProgress(progress)
    );

    setUploadVisible(false);

    if (!result.ok)
      return Alert.alert("Something went wrong!", "Your order cannot create");

    setErrorMessage(false);
    clearCart();
    navigation.navigate("Cart");
    await fetchProducts();
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: "Your order has been created",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
    });
  };

  return (
    <Screen>
      <UploadScreen progress={progress} visible={uploadVisible} />
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.userContainer}>
            <ListItem
              title={user.name}
              subTitle={user.email}
              IconComponent={
                user.isAdmin ? (
                  <Icon name="account-cog" size={80} />
                ) : (
                  <Icon name="account" size={80} />
                )
              }
            />
          </View>
          {errorMessage && (
            <ErrorMessage error={errorMessage} visible={errorMessage} />
          )}
          <View style={styles.container}>
            <Form
              initialValues={{
                shippingAddress1: "",
                city: "",
                phone: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <FormField
                autoCorrect={false}
                icon="city"
                name="city"
                placeholder="City"
              />
              <FormField
                autoCorrect={false}
                icon="map-marker"
                name="shippingAddress1"
                placeholder="Address"
              />

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                icon="phone"
                name="phone"
                placeholder="Phone"
              />
              <SubmitButton title="Submit" />
            </Form>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  userContainer: {
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => ({ cartItems: state.cartItems });
const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(cartActions.clearCart()),
  fetchProducts: async () => dispatch(productActions.fetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
