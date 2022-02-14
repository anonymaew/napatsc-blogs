import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { Footer, timeToString } from ".";
import s from "./blog.module.scss";

const Blog = (props: any) => {
  return (
    <div className={s.blog}>
      <div className="blog-page">
        <div className="header">
          <h1>{props.meta.title}</h1>
          <p>{props.meta.description}</p>
          <p>
            Written by <a href={props.meta.authorLink}>{props.meta.author}</a>
            {` on ${timeToString(props.meta.date)}`}
          </p>
          <hr />
        </div>
        <MDXRemote {...props.mdx} />
        <br />
        <p>
          <Link href="/b">
            <a>{"<"} Back to the main page</a>
          </Link>
        </p>
        <Footer />
      </div>
    </div>
  );
};

export const getStaticProps = async ({ params: { blog } }: any) => {
  const markdownWithMeta = fs.readFileSync(
    path.join("blogs", blog + ".mdx"),
    "utf-8"
  );
  const { data: meta, content } = matter(markdownWithMeta);
  const mdx = await serialize(content);

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
