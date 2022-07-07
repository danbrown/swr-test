import { useState, useEffect, createContext, useContext } from "react";
import useSwr, { useSWRConfig, mutate } from "swr";
import useMutation from "use-mutation";
import _ from "lodash";
import axios from "axios";

const apiUrl = "https://env.staging.api.wipsie.com";

type KeyVariants = "posts" | "users";

type WipsieApiContextType = typeof WipsieApi | null;

type BaseFilters = {
  terms?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

type PostsApiInput = BaseFilters & { publisherId: string };

type UsersApiInput = BaseFilters;

type ApiVariantsInputs = {
  posts: PostsApiInput;
  users: UsersApiInput;
};

interface ApiVariantsReturns {
  posts: PostsApiReturns;
  users: UsersApiReturns;
}

type PostsApiReturns = ReturnType<typeof postsApi>;
type UsersApiReturns = ReturnType<typeof usersApi>;

const postsApi = ({
  terms = "",
  page = 0,
  limit = 20,
  sort = "",
  publisherId = null,
}: PostsApiInput) => {
  const {
    data: posts,
    mutate: mutatePosts,
    error: errorPosts,
    isValidating: isValidatingPosts,
  } = useSwr(
    `${apiUrl}/posts/search?terms=${terms}&page=${page}&limit=${limit}&sort=${sort}`
    // "http://localhost:5000/posts"
  );

  return {
    posts,
    mutatePosts,
    errorPosts,
    isValidatingPosts,

    createPost: async ({ title, content }) => {
      return new Promise(async (resolve, reject) => {
        const newPost = {
          title,
          content,
        };

        const updatedList = [...posts, newPost];

        await mutatePosts(updatedList, false);

        axios
          .post(`http://localhost:5000/posts`, newPost)
          .then((res) => {
            mutatePosts(updatedList, true);
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  };
};

const usersApi = (input: UsersApiInput) => {
  const {
    data: users,
    mutate: mutateUsers,
    error: errorUsers,
    isValidating: isValidatingUsers,
  } = useSwr("http://localhost:5000/users");

  return {
    users,
    mutateUsers,
    errorUsers,
    isValidatingUsers,
  };
};

const WipsieApi = {
  posts: postsApi,
  users: usersApi,
};

const WipsieApiContext = createContext<WipsieApiContextType>(null);

export const WipsieApiProvider = ({ children }: { children: any }) => {
  return (
    <WipsieApiContext.Provider value={WipsieApi}>
      {children}
    </WipsieApiContext.Provider>
  );
};

export function useWipsieApi<T extends KeyVariants>(
  key: T,
  variables: ApiVariantsInputs[T] = null
): ApiVariantsReturns[T] {
  const context = useContext(WipsieApiContext);

  if (context === null) {
    throw new Error("useWipsieApi must be used within a WipsieApiProvider");
  }

  if (!key) {
    throw new Error("No content key specified");
  }

  const typed = context[key]({ ...(variables as any) });

  return typed as ApiVariantsReturns[T];
}
