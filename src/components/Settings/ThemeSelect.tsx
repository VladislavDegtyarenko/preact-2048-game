import { useContext } from "react";
import GameContext from "../../GameContext";
import CustomSelect from "../ui/CustomSelect";

// TS
import { Theme } from "../../types/types";

const ThemeSelect = () => {
  const {
    settings: { theme, setTheme },
  } = useContext(GameContext);

  const handleChange = (theme: Theme) => {
    setTheme(theme);
  };

  return (
    <CustomSelect
      heading="Theme"
      options={Theme}
      handleSelect={handleChange as (selected: string) => void}
      selected={theme}
    />
  );
};

export default ThemeSelect;
