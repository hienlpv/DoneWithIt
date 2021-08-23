import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
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

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.string().required().min(1).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image"),
});

function ListingEditScreen(props) {
  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  // const location = useLocation();
  const getCategoriesApi = useApi(getCategories);

  useEffect(() => {
    getCategoriesApi.request();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    values.price = values.price.replace(/\./g, "").replace(" VND", "");
    let dataPost = {
      images: [...values.images],
      name: values.title,
      price: values.price,
      category: values.category.id,
      description: values.description,
      countInStock: 10,
    };
    setProgress(0);
    setUploadVisible(true);

    const res = await addProducts(dataPost, (progress) =>
      setProgress(progress)
    );

    setUploadVisible(false);

    if (!res.ok) {
      alert("Some thing went wrong! Could not Post Product!");
      console.log(res.data);
    } else alert("Success");

    resetForm();
    await props.fetchProducts();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen progress={progress} visible={uploadVisible} />
      <KeyboardAvoidingView>
        <ScrollView>
          <Form
            initialValues={{
              title: "",
              price: "",
              description: "",
              category: null,
              images: [],
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormImagePicker name="images" />
            <FormField maxLength={255} name="title" placeholder="Title" />
            <FormField
              keyboardType="numeric"
              name="price"
              placeholder="Price"
              width="80%"
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
