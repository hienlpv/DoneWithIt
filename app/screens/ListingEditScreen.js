import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import useApi from "../hooks/useApi";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import { getCategories } from "../api/category";
import {
  Form,
  FormField,
  FormImagePicker,
  FormPicker,
  SubmitButton,
} from "../components/forms";
import * as productActions from "../redux/actions/product";

const validationSchema = Yup.object().shape({
  images: Yup.array().min(1, "Hãy chọn ít nhất 1 ảnh!"),
  title: Yup.string().required().label("Tên sản phẩm"),
  brand: Yup.string().required().label("Thương hiệu"),
  price: Yup.string().required().label("Giá"),
  countInStock: Yup.number().required().label("Số lượng"),
  category: Yup.object().required().nullable().label("Loại sản phẩm"),
  description: Yup.string().required().label("Mô tả sản phẩm"),
});

function ListingEditScreen({
  route,
  addProduct,
  updateProduct,
  fetchProducts,
}) {
  const product = route.params.item;

  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  const getCategoriesApi = useApi(getCategories);

  useEffect(() => {
    getCategoriesApi.request();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    values.price = values.price.replace(/\./g, "").replace("đ", "");

    let dataPost = {
      images: [...values.images],
      name: values.title,
      brand: values.brand,
      price: values.price,
      countInStock: values.countInStock,
      description: values.description,
      category: product ? values.category._id : values.category.id,
      concentration: values.concentration,
      volume: values.volume,
      origin: values.origin,
    };

    setProgress(0);
    setUploadVisible(true);

    product
      ? await updateProduct(product.id, dataPost, setProgress)
      : await addProduct(dataPost, setProgress);
    fetchProducts();

    setUploadVisible(false);
    resetForm();
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
              concentration: product ? product.concentration : "",
              volume: product ? product.volume : "",
              origin: product ? product.origin : "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormImagePicker name="images" />
            <FormField maxLength={255} name="title" placeholder="Tên" />
            <FormPicker
              width="50%"
              items={getCategoriesApi.data}
              name="category"
              placeholder="Loại"
              PickerItemComponent={CategoryPickerItem}
              numberOfColumn={3}
            />
            <FormField
              maxLength={255}
              name="brand"
              placeholder="Thương hiệu"
              width="80%"
            />
            <FormField
              keyboardType="numeric"
              maxLength={255}
              name="concentration"
              placeholder="Nồng độ"
              width="50%"
            />
            <FormField
              keyboardType="numeric"
              maxLength={255}
              name="volume"
              placeholder="Thể tích"
              width="50%"
            />
            <FormField
              maxLength={255}
              name="origin"
              placeholder="Xuất xứ"
              width="50%"
            />
            <FormField
              keyboardType="numeric"
              name="countInStock"
              placeholder="Số lượng"
              width="55%"
            />
            <FormField
              keyboardType="numeric"
              name="price"
              placeholder="Giá"
              width="70%"
            />
            <FormField
              multiline
              name="description"
              numberOfLines={3}
              placeholder="Mô tả"
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
  addProduct: async (data, setProgress) =>
    dispatch(productActions.addProducts(data, setProgress)),
  updateProduct: async (id, data, setProgress) =>
    dispatch(productActions.updateProducts(id, data, setProgress)),
}))(ListingEditScreen);
