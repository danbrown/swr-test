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
import { useState, useEffect } from "react";
import useSwr from "swr";

export default function Home() {
  const { data: posts, mutate: mutatePosts } = useSwr(
    "http://localhost:5000/posts"
  );
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const handlePostPublish = async () => {
    const post = {
      title: postTitle,
      content: postContent,
    };

    const updatedList = [...posts, post];

    await mutatePosts(updatedList, false);

    await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }).then(() => {
      setPostTitle("");
      setPostContent("");
    });

    await mutatePosts(updatedList, true);
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
          {posts.reverse().map((post, index) => (
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
