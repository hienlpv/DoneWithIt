import React, { useState, useContext } from "react";
import Toast from "react-native-toast-message";
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
import { ListItem } from "../components/lists";
import { addOrder } from "../api/order";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import * as cartActions from "../redux/actions/cartItem";
import * as productActions from "../redux/actions/product";

const validationSchema = Yup.object().shape({
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
      user: user.id,
      phone: values.phone,
      shippingAddress1: `${values.apartment} - ${values.street} - ${values.city}`,
    };

    setProgress(0);
    setUploadVisible(true);

    const result = await addOrder(dataPost, (progress) =>
      setProgress(progress)
    );

    setUploadVisible(false);

    if (!result.ok) {
      console.log(result.data);
      return Toast.show({
        type: "error",
        position: "top",
        text1: "Fail",
        text2: "Không thể tạo đơn hàng",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
      });
    }
    setErrorMessage(false);
    clearCart();
    navigation.navigate("Cart");
    await fetchProducts();
    Toast.show({
      type: "success",
      position: "top",
      text1: "Successfully",
      text2: "Đơn hàng của bạn đã được tạo",
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
                placeholder="Địa chỉ"
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
