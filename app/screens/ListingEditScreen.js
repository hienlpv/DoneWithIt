import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Yup from "yup";
import { connect } from "react-redux";

import {
  Form,
  FormField,
  FormImagePicker,
  FormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
// import useLocation from "../hooks/useLocation";
import useApi from "../hooks/useApi";
import { getCategories } from "../api/category";
import { addProducts } from "../api/product";
import UploadScreen from "./UploadScreen";
import * as productActions from "../redux/actions/product";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  brand: Yup.string().required().min(1).label("Brand"),
  price: Yup.string().required().min(1).label("Price"),
  countInStock: Yup.number().required().min(1).label("Stock"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image"),
});

function ListingEditScreen({ route, fetchProducts }) {
  const product = route.params.item;

  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  const getCategoriesApi = useApi(getCategories);

  useEffect(() => {
    getCategoriesApi.request();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    values.price = values.price.replace(/\./g, "").replace(" VND", "");

    let dataPost = {
      images: [...values.images],
      name: values.title,
      brand: values.brand,
      price: values.price,
      countInStock: values.countInStock,
      description: values.description,
      category: values.category.id,
    };

    setProgress(0);
    setUploadVisible(true);

    const res = await addProducts(dataPost, (progress) =>
      setProgress(progress)
    );

    setUploadVisible(false);

    if (!res.ok) {
      Alert.alert("ERROR", "Something went wrong! Cannot submit to Server");
      console.log(res.data);
    } else
      Toast.show({
        text1: "Successfully",
        text2: "Your product has been created",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        onPress: () => Toast.hide(),
      });

    resetForm();
    await fetchProducts();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen progress={progress} visible={uploadVisible} />
      <KeyboardAvoidingView>
        <ScrollView>
          <Form
            initialValues={{
              title: product ? product.name : "",
              brand: product ? product.brand : "",
              price: product ? product.price.toString() : "",
              description: product ? product.description : "",
              category: product ? product.category : "",
              countInStock: product ? product.countInStock.toString() : "",
              images: product ? product.images : [],
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormImagePicker name="images" />
            <FormField maxLength={255} name="title" placeholder="Title" />
            <FormField
              maxLength={255}
              name="brand"
              placeholder="Brand"
              width="80%"
            />
            <FormField
              keyboardType="numeric"
              name="price"
              placeholder="Price"
              width="70%"
            />
            <FormPicker
              width="50%"
              items={getCategoriesApi.data}
              name="category"
              placeholder="Category"
              PickerItemComponent={CategoryPickerItem}
              numberOfColumn={3}
            />
            <FormField
              keyboardType="numeric"
              name="countInStock"
              placeholder="Count in Stock"
              width="55%"
            />
            <FormField
              maxLength={255}
              multiline
              name="description"
              numberOfLines={3}
              placeholder="Description"
            />
            <SubmitButton title="Post" />
          </Form>
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
export default connect(null, (dispatch) => ({
  fetchProducts: async () => dispatch(productActions.fetchProducts()),
}))(ListingEditScreen);
