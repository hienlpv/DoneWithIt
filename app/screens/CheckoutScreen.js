import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Icon from "../components/Icon";
import UploadScreen from "./UploadScreen";
import AuthContext from "../auth/context";
import { updateUser } from "../api/auth";
import { ListItem } from "../components/lists";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import * as cartActions from "../redux/actions/cartItem";
import * as productActions from "../redux/actions/product";
import * as orderActions from "../redux/actions/order";

const validationSchema = Yup.object().shape({
  apartment: Yup.string().required().label("Số nhà"),
  street: Yup.string().required().label("Quận/Huyện"),
  city: Yup.string().required().label("Tỉnh/Thành phố"),
  phone: Yup.string().required().label("Số ĐT"),
});

function CheckoutScreen(props) {
  const { navigation, cartItems, clearCart, fetchProducts, addOrder } = props;
  const { user, setUser } = useContext(AuthContext);

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
      user: user.id,
      phone: values.phone,
      shippingAddress1: `${values.apartment} - ${values.street} - ${values.city}`,
    };

    setProgress(0);
    setUploadVisible(true);

    await addOrder(dataPost, (progress) => setProgress(progress));

    setUploadVisible(false);
    setErrorMessage(false);
    clearCart();
    navigation.navigate("Cart");
    fetchProducts();
    updateUser(user.id, { ...user, ...values }).then((res) => {
      if (res.ok) setUser(res.data);
    });
  };

  if (!user) return <></>;

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
                city: user.city,
                phone: user.phone,
                apartment: user.apartment,
                street: user.street,
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <FormField
                autoCorrect={false}
                icon="map-marker"
                name="apartment"
                placeholder="Số nhà"
              />
              <FormField
                autoCorrect={false}
                icon="city"
                name="street"
                placeholder="Quận/huyện"
              />
              <FormField
                autoCorrect={false}
                icon="city"
                name="city"
                placeholder="Tỉnh/Thành phố"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                icon="phone"
                name="phone"
                placeholder="Số ĐT"
              />
              <SubmitButton title="Đặt hàng" />
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
  addOrder: async (data, setProgress) =>
    dispatch(orderActions.addOrders(data, setProgress)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
