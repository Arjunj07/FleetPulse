// A REAL call to a free public fake API: https://jsonplaceholder.typicode.com
// It answers like a real server but does not save anything.
const BASE_URL = "https://jsonplaceholder.typicode.com";

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type NewPost = {
  title: string;
  body: string;
};

// GET: ask the server for data
export async function getPosts(limit = 5): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }
  return (await response.json()) as Post[];
}

// POST: send data to the server
export async function createPost(newPost: NewPost): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newPost, userId: 1 }),
  });
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }
  return (await response.json()) as Post;
}
