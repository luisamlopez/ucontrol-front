import { useField } from "formik";
import { RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  name: string;
  label: string;
  options: RadioOption[];
}

const RadioGroupField = ({
  name,
  label,
  options,
}: RadioGroupFieldProps): JSX.Element => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newValue = options.find((option) => option.value === value);
    helpers.setValue(newValue);
  };

  return (
    <>
      <FormLabel> {label}</FormLabel>
      <RadioGroup
        {...field}
        name={name}
        onChange={handleChange}
        aria-label={label}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default RadioGroupField;
