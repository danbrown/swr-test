import "../styles/global.css";

import Providers from "../providers";
import { SWRConfig } from "swr";
import axios from "axios";
import { WipsieApiProvider } from "../_wipsieApi/context/WipsieApiContext";

const MyApp: React.FC<any> = ({ Component, pageProps }) => {
  return (
    <Providers>
      <SWRConfig
        value={{
          dedupingInterval: 5000, // the interval for checking deduping (in ms)
          fetcher: (url) => axios.get(url).then((res) => res.data), // a custom fetcher
        }}
      >
        <WipsieApiProvider>
          <Component {...pageProps} />
        </WipsieApiProvider>
      </SWRConfig>
    </Providers>
  );
};

export default MyApp;
