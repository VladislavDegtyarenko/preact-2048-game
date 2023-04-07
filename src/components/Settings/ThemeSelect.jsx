import { useContext } from "react";
import GameContext from "../../GameContext";
import CustomSelect from "../ui/CustomSelect";

import { THEME } from "../../GameContext";

const ThemeSelect = () => {
  const {
    settings: { theme, setTheme },
  } = useContext(GameContext);

  const handleChange = (theme) => {
    setTheme(theme);
  };

  return (
    <CustomSelect
      heading="Theme"
      options={THEME}
      handleSelect={handleChange}
      selected={theme}
    />
  );
};

export default ThemeSelect;
