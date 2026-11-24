import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostsPlayground from "./PostsPlayground";
import { createPost, getPosts } from "./postsApi";

// Replace the real network calls with fakes we control
jest.mock("./postsApi");
const mockGetPosts = jest.mocked(getPosts);
const mockCreatePost = jest.mocked(createPost);

const samplePosts = [
  { id: 1, userId: 1, title: "First post", body: "a" },
  { id: 2, userId: 1, title: "Second post", body: "b" },
];

describe("PostsPlayground", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetPosts.mockResolvedValue(samplePosts);
  });

  it("shows a loading message, then the posts", async () => {
    render(<PostsPlayground />);
    expect(screen.getByText("Loading posts...")).toBeInTheDocument();
    expect(await screen.findByText("First post")).toBeInTheDocument();
    expect(screen.getByText("Second post")).toBeInTheDocument();
  });

  it("shows an error when the posts cannot be loaded", async () => {
    mockGetPosts.mockRejectedValue(new Error("Request failed (status 500)"));
    render(<PostsPlayground />);
    expect(
      await screen.findByText(/could not load posts: request failed/i),
    ).toBeInTheDocument();
  });

  it("shows validation errors and does not send an empty form", async () => {
    const user = userEvent.setup();
    render(<PostsPlayground />);
    await screen.findByText("First post");

    await user.click(screen.getByRole("button", { name: "Send post" }));

    expect(
      screen.getByText("Title must be at least 3 characters"),
    ).toBeInTheDocument();
    expect(screen.getByText("Body is required")).toBeInTheDocument();
    expect(mockCreatePost).not.toHaveBeenCalled();
  });

  it("sends the form, shows the new post and clears the inputs", async () => {
    const user = userEvent.setup();
    mockCreatePost.mockResolvedValue({
      id: 101,
      userId: 1,
      title: "My new post",
      body: "Hello",
    });
    render(<PostsPlayground />);
    await screen.findByText("First post");

    await user.type(screen.getByLabelText("Title"), "My new post");
    await user.type(screen.getByLabelText("Body"), "Hello");
    await user.click(screen.getByRole("button", { name: "Send post" }));

    expect(mockCreatePost).toHaveBeenCalledWith({
      title: "My new post",
      body: "Hello",
    });
    expect(await screen.findByText(/server gave it id 101/i)).toBeInTheDocument();
    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("");
  });

  it("shows an error message when sending fails", async () => {
    const user = userEvent.setup();
    mockCreatePost.mockRejectedValue(new Error("Request failed (status 500)"));
    render(<PostsPlayground />);
    await screen.findByText("First post");

    await user.type(screen.getByLabelText("Title"), "My new post");
    await user.type(screen.getByLabelText("Body"), "Hello");
    await user.click(screen.getByRole("button", { name: "Send post" }));

    expect(
      await screen.findByText(/could not send: request failed/i),
    ).toBeInTheDocument();
  });
});
