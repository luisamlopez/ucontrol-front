import { TextField, TextFieldProps } from "formik-mui";

const TextAreaField = (props: TextFieldProps): JSX.Element => {
  return <TextField type="text" multiline {...props} minRows={3} />;
};

export default TextAreaField;
