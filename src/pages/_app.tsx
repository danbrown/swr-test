import "../styles/global.css";

import Providers from "../providers";
import { SWRConfig } from "swr";
import axios from "axios";

const MyApp: React.FC<any> = ({ Component, pageProps }) => {
  return (
    <Providers>
      <SWRConfig
        value={{
          dedupingInterval: 5000, // the interval for checking deduping (in ms)
          fetcher: (url) => axios.get(url).then((res) => res.data), // a custom fetcher
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </Providers>
  );
};

export default MyApp;
