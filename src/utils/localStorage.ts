export const loadState = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return undefined;

    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = (key: string, state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    // Ignore write errors
  }
};
