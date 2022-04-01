import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import s from "./blog.module.scss";

export interface BlogProps {
  meta: {
    title: string;
    description: string;
    imgName: string;
    author: string;
    authorLink: string;
    date: number;
  };
  children: React.ReactNode;
}

export const timeToString = (unix: number) => {
  const d = new Date(unix);
  //convert unix time to string
  const year = d.getFullYear();
  const month = d.toString().split(" ")[1];
  const date = d.getDate();
  return `${date} ${month} ${year}`;
};

export const BlogCard = (props: any) => (
  <div>
    <Link href={`/b/${props.id}`}>
      <a>
        <div className="blog-card">
          <div>
            <Image
              src={"/blogImg/" + props.meta.imgName}
              width={640}
              height={360}
            />
          </div>
          <div>
            <h3>{props.meta.title}</h3>
            <div>
              <p>{props.meta.description}</p>
              <p>{`${props.meta.author}, ${timeToString(props.meta.date)}`}</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  </div>
);

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join("blogs"));

  const blogs = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join("blogs", filename),
      "utf-8"
    );
    const { data: meta } = matter(markdownWithMeta);

    return {
      meta,
      id: filename.split(".")[0],
    };
  });

  return {
    props: {
      blogs,
    },
  };
};

const Blogs = (props: any) => {
  return (
    <div className={s.blog}>
      <div className="header">
        <h1>Blogs</h1>
        <hr />
      </div>
      <h1>Latest</h1>
      <div className={s.blogContainer}>
        {props.blogs
          .sort((a: any, b: any) => b.meta.date - a.meta.date)
          .map((blog: any) => (
            <BlogCard key={blog.id} meta={blog.meta} id={blog.id} />
          ))}
      </div>
    </div>
  );
};

export default Blogs;
