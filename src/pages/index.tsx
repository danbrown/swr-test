import {
  Button,
  Container,
  Flex,
  Input,
  Page,
  Link,
  Spacing,
  TextArea,
  Typography,
} from "@wipsie/ui";
import DefaultLayout from "../components/DefaultLayout";
import NextLink from "next/link";
import { useState, useEffect, createContext, useContext } from "react";
import useSwr, { useSWRConfig, mutate } from "swr";
import useMutation from "use-mutation";
import _ from "lodash";
import axios from "axios";
import { useWipsieApi } from "../_wipsieApi/context/WipsieApiContext";

export default function Home() {
  // const { data: posts, mutate: mutatePosts } = useSwr(
  //   "http://localhost:5000/posts"
  // );
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const { users, errorUsers } = useWipsieApi("users");
  const { createPost, posts } = useWipsieApi("posts");

  const handlePostPublish = async () => {
    createPost({
      content: postContent,
      title: postTitle,
    }).then(() => {
      setPostTitle("");
      setPostContent("");
    });
  };

  return (
    <DefaultLayout meta={{}}>
      <NextLink href="/dois">Dois</NextLink>
      <Container
        display="flex"
        maxWidth="600px"
        fullWidth
        align="center"
        justify="center"
        shape="rounded"
      >
        <Typography variant="h1">SWR data fetch</Typography>
        <Link href="/dois">
          <Button>Page 2</Button>
        </Link>
        <Spacing height={2} />
        <Input
          placeholder="Title"
          value={postTitle}
          shape="rounded"
          onChange={(e: any) => setPostTitle(e.target.value)}
          fullWidth
        />

        <Spacing height={1} />
        <TextArea
          placeholder="What's on your mind?"
          value={postContent}
          shape="rounded"
          onChange={(e: any) => setPostContent(e.target.value)}
          fullWidth
        />
        <Spacing height={1} />
        <Button onClick={handlePostPublish} fullWidth shape="rounded">
          Post
        </Button>
      </Container>

      <Spacing height={2} />

      {posts && (
        <Container fullWidth maxWidth="600px" p={1} shape="rounded">
          {posts?.content
            ?.sort(function (a, b) {
              if (a.id > b.id) {
                return -1;
              }
              if (a.id < b.id) {
                return 1;
              }
              // a must be equal to b
              return 0;
            })
            .map((post, index) => (
              <Container
                key={post.id}
                display="flex"
                fullWidth
                backgroundColor="highlight"
                shape="rounded"
                mb={index !== posts.length - 1 ? 2 : 0}
              >
                <NextLink href={`/dois`}>
                  <Typography variant="h2">
                    {post.id} - {post.title}
                  </Typography>
                </NextLink>
                <Spacing height={1} />
                <Typography variant="body1">{post.content}</Typography>
              </Container>
            ))}
        </Container>
      )}
    </DefaultLayout>
  );
}

// const [mutateing] = useMutateWithSwr("http://localhost:5000/posts");

function useMutateWithSwr(
  key: string,
  fetchFunction: (input: any) => Promise<any> = null
) {
  const { cache } = useSWRConfig();

  const selfFetchFunction = (input: any) => {
    return axios.get(key).then((res) => res.data);
  };

  return useMutation(fetchFunction || selfFetchFunction, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      // optimistically update the data before your mutation is run
      mutate(key, (current) => _.concat(current, input), false);

      return () => mutate(key, oldData, false); // rollback if it failed
    },

    onSuccess({ input }) {
      // if the mutation was a success, we update the cache of SWR to replace
      // the comment to optimistically added and add the final one returned
      // by the API
      mutate([key, input], (cachedData) => {
        return _.concat(cachedData, input);
      });
    },

    onFailure: ({ error, rollback }) => {
      console.error(error);
      // here we are calling the rallback fn returned by onMutate
      if (rollback) rollback();
    },
  });
}
