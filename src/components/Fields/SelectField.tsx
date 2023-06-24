import { Autocomplete, AutocompleteProps } from "formik-mui";

interface Option {
  id: string;
  label: string;
}

type SelectFieldProps = AutocompleteProps<Option, true, true, true> & {
  options: Option[];
};

const SelectField = ({ options, ...props }: SelectFieldProps): JSX.Element => {
  return (
    <Autocomplete
      options={options}
      // getOptionLabel={(option) => option.}
      {...props}
    />
  );
};

export default SelectField;
