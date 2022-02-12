import s from "./blog.module.scss";
import Link from "next/link";

export const timeToString = (unix: number) => {
  const d = new Date(unix);
  //convert unix time to string
  const year = d.getFullYear();
  const month = d.toString().split(" ")[1];
  const date = d.getDate();
  return `${date} ${month} ${year}`;
};

export interface BlogProps {
  meta: {
    title: string;
    description: string;
    author: string;
    authorLink: string;
    date: number;
  };
  children: React.ReactNode;
}

export const Blog = (props: BlogProps) => (
  <div className={s.blog}>
    <div className="blogPage">
      <h1>{props.meta.title}</h1>
      <p>{props.meta.description}</p>
      <p>
        Written by <a href={props.meta.authorLink}>{props.meta.author}</a> on{" "}
        {timeToString(props.meta.date)}
      </p>
      <hr />
      {props.children}
      <br />
      <p>
        <Link href="/b">
          <a>{"<"} Back to the main page</a>
        </Link>
      </p>
      <hr />
      <p>
        © {new Date().getFullYear()}{" "}
        <a href="https://github.com/anonymaew">Napat Srichan</a>
      </p>
    </div>
  </div>
);

const Blogs = () => {
  return (
    <div className={s.blog}>
      <div>
        <h1>This will be a blog page soon</h1>
      </div>
    </div>
  );
};

export default Blogs;
