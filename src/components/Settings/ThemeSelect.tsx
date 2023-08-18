import CustomSelect from "../ui/CustomSelect";

// TS
import { Theme } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getTheme, themeChanged } from "../../features/settingsSlice";

const ThemeSelect = () => {
  const theme = useAppSelector(getTheme);
  const dispatch = useAppDispatch();

  const handleChange = (theme: Theme) => {
    dispatch(themeChanged(theme));
  };

  const themeOptions: { [key: string]: Theme } = {
    "Elegant Dark": "DARK",
    "Classic Light": "LIGHT",
  };

  return (
    <CustomSelect
      heading="Theme"
      options={themeOptions}
      handleSelect={handleChange as (selected: string | number) => void}
      selected={theme}
    />
  );
};

export default ThemeSelect;
