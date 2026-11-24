import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPost, getPosts } from "./postsApi";
import type { Post } from "./postsApi";
import "./playground.css";

type FormErrors = { title?: string; body?: string };

export default function PostsPlayground() {
  // --- the list (GET) ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --- the form (POST) ---
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [created, setCreated] = useState<Post | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getPosts();
        if (!ignore) setPosts(data);
      } catch (err) {
        if (!ignore) {
          setLoadError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  function validate(): FormErrors {
    const found: FormErrors = {};
    if (title.trim().length < 3) {
      found.title = "Title must be at least 3 characters";
    }
    if (body.trim().length === 0) {
      found.body = "Body is required";
    }
    return found;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // do not send invalid data

    setSubmitting(true);
    setSubmitError(null);
    setCreated(null);
    try {
      const post = await createPost({ title, body });
      setCreated(post);
      setPosts((current) => [post, ...current]); // show it at the top
      setTitle("");
      setBody("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1>Playground: form + fake API</h1>
      <p className="playground__note">
        Study page. Talks to jsonplaceholder.typicode.com, which does not save
        anything.
      </p>

      <form className="playground__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p role="alert">{errors.title}</p>}

        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {errors.body && <p role="alert">{errors.body}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send post"}
        </button>

        {submitError && <p role="alert">Could not send: {submitError}</p>}
        {created && <p role="status">Created! The server gave it id {created.id}.</p>}
      </form>

      <h2>Posts</h2>
      {loading && <p>Loading posts...</p>}
      {loadError && <p role="alert">Could not load posts: {loadError}</p>}
      {!loading && !loadError && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
