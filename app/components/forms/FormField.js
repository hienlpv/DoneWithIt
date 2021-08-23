import React from "react";
import { useFormikContext } from "formik";

import AppTextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({ name, width, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  const changeText = (name) => {
    if (name === "price") {
      let price = parseInt(values[name].replace(/\./g, "").replace(" VND", ""));
      price =
        price
          .toFixed(0)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
          .replace(" VND", "") + " VND";
      setFieldValue(name, price);
    }
    setFieldTouched(name);
  };

  return (
    <>
      <AppTextInput
        onBlur={() => changeText(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        width={width}
        value={values[name]}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;
