import ReduxProvider from "./ReduxProvider";
import ThemeProvider from "./ThemeProvider";
import LoadingProvider from "./LoadingProvider";

const Providers = ({ children }) => {
  return (
    <ReduxProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ReduxProvider>
  );
};

export default Providers;
