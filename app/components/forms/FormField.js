import React from "react";
import { useFormikContext } from "formik";

import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";
import { formatVND } from "../../utility/formatCurrency";

function AppFormField({ name, width, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  const changeText = (name) => {
    switch (name) {
      case "price":
        let price = parseInt(values[name].replace(/\./g, "").replace("đ", ""));
        setFieldValue(name, formatVND(price));
        break;
      case "concentration":
        setFieldValue(name, `${values[name]}%`);
        break;
      case "volume":
        setFieldValue(name, `${values[name]}ml`);
        break;
    }

    setFieldTouched(name);
  };

  return (
    <>
      <TextInput
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
