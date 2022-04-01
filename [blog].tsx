import Link from "next/link";
import Head from "next/head";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeHighlight from "rehype-highlight";
import { timeToString } from ".";
import s from "./blog.module.scss";

export const Code = (props: any) => {
  return (
    <pre>
      {props.children.props.metastring ? (
        <p>{props.children.props.metastring}</p>
      ) : (
        <></>
      )}
      <code
        style={
          props.children.props.metastring
            ? {}
            : { borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }
        }
        className={props.children.props.className}
      >
        {props.children.props.children}
      </code>
    </pre>
  );
};

export const NextImage = (props: any) => {
  return (
    <div className={s.imgContainer}>
      <img
        src={`/_next/image?url=%2FblogImg%2F${props.src}&w=1080&q=50`}
        alt={props.alt}
      />
      <p>{props.alt}</p>
    </div>
  );
};

export const NextLink = (props: any) => {
  return (
    <Link href={props.href}>
      <a>{props.children}</a>
    </Link>
  );
};

export const Youtube = (props: any) => {
  return (
    <div className={s.youtube}>
      <div>
        <iframe
          width="720"
          height="405"
          src={props.src}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export const components = {
  pre: Code,
  img: NextImage,
  a: NextLink,
  Youtube: Youtube,
};

const Blog = (props: any) => {
  return (
    <div className={s.blog}>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
        />
      </Head>
      <div className="header">
        <h1>{props.meta.title}</h1>
        <p>{props.meta.description}</p>
        <div>
          <img
            src={`/_next/image?url=%2FblogImg%2F${props.meta.imgName}&w=1080&q=50`}
          />
        </div>
        <p>
          Written by <a href={props.meta.authorLink}>{props.meta.author}</a>
          {` on ${timeToString(props.meta.date)}`}
        </p>
        <hr />
      </div>
      <MDXRemote {...props.mdx} components={components} />
      <br />
      <p>
        <Link href="/b">
          <a>{"<"} Back to the main page</a>
        </Link>
      </p>
    </div>
  );
};

export const getStaticProps = async ({ params: { blog } }: any) => {
  const markdownWithMeta = fs.readFileSync(
    path.join("blogs", blog + ".mdx"),
    "utf-8"
  );
  const { data: meta, content } = matter(markdownWithMeta);
  const mdx = await serialize(content, {
    //@ts-ignore
    mdxOptions: { rehypePlugins: [rehypeHighlight] },
  });

  return {
    props: {
      meta,
      blog,
      mdx,
    },
  };
};

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join("blogs"));

  const paths = files.map((filename) => ({
    params: {
      blog: filename.replace(".mdx", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default Blog;
