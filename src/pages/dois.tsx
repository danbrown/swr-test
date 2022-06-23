/* eslint-disable react/display-name */
import { useTheme, Link } from "@wipsie/ui";
import DefaultLayout from "../components/DefaultLayout";
import NextLink from "next/link";
import { isProd } from "../config";
import { useRouter } from "next/router";

export default function Home({ currentTheme, setCurrentTheme }: any) {
  const theme = useTheme();

  const router = useRouter();

  return (
    <DefaultLayout
      meta={{}}
      currentTheme={currentTheme}
      setCurrentTheme={setCurrentTheme}
    >
      <Link onClick={() => router.back()}>Back</Link>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
      consequuntur reprehenderit, exercitationem quia reiciendis earum deleniti
      assumenda nemo laboriosam eligendi!
    </DefaultLayout>
  );
}
