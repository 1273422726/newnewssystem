export const LoadingReduces = (prevState = { isCollapsed: false }, action) => {
  let { type, payload } = action;
  switch (type) {
    case "change_loading":
      let newState = { ...prevState };
      newState.isLoading = payload;
      return newState;
    default:
      return prevState;
  }
};
