import React, { useState, useContext } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import * as Yup from "yup";
import { connect } from "react-redux";
import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import AuthContext from "../auth/context";
import * as cartActions from "../redux/actions/cartItem";
import { ListItem } from "../components/lists";
import Icon from "../components/Icon";
import { addOrder } from "../api/order";

const validationSchema = Yup.object().shape({
  shippingAddress1: Yup.string().required().label("Address"),
  city: Yup.string().required().label("City"),
  phone: Yup.string().required().label("Phone"),
});

function CheckoutScreen(props) {
  const { navigation, cartItems, clearCart } = props;
  const { user } = useContext(AuthContext);

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
    const result = await addOrder(dataPost);
    if (!result.ok) return setErrorMessage(result.data);
    setErrorMessage(false);
    clearCart();
    navigation.navigate("Cart");
  };

  return (
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
        <Screen style={styles.container}>
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
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  userContainer: {
    marginVertical: 20,
  },
});

const mapStateToProps = (state) => ({ cartItems: state.cartItems });
const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(cartActions.clearCart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
