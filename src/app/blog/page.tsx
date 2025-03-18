'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dnqsiqqu9/";

interface Blog {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  brief: string;
  content: string;
  tag: { name: string };
  date: string;
  author: { email: string };
}

interface Comment {
  id: number;
  content: string;
  date: string;
  user: { email: string };
}

// Fetch blogs from the API with authentication
async function fetchBlogs(token: string): Promise<Blog[]> {
  const res = await fetch('https://refashioned.onrender.com/api/blogs/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return res.json();
}

// Fetch comments for a blog with authentication
async function fetchComments(blogId: string, token: string): Promise<Comment[]> {
  const res = await fetch(`https://refashioned.onrender.com/api/blogs/${blogId}/comments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }

  return res.json();
}

// Blog Comments Component
const BlogComments = ({ blogId }: { blogId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("You must be logged in to view comments.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchComments(blogId, token);
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [blogId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (comments.length === 0) return <p>No comments found.</p>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-neutral-200 pb-4">
          <p className="text-neutral-600">{comment.content}</p>
          <p className="text-sm text-neutral-500">
            By {comment.user.email} on {new Date(comment.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

// Comment Form Component
const CommentForm = ({ blogId }: { blogId: string }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to comment.');
      setLoading(false);
      return;
    }

    const commentData = {
      content,
      blog: blogId,  // Add blog ID explicitly
    };

    console.log("Sending comment:", commentData);

    try {
      const response = await fetch(`https://refashioned.onrender.com/api/blogs/${blogId}/comments/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to post comment');
      }

      setContent('');
      setComments((prev) => [data, ...prev]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your comment..."
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

// Main Blog Page
export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Redirect to login page if no token
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchBlogs(token);
        setBlogs(data);
        if (data.length > 0) {
          setSelectedBlog(data[0]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (blogs.length === 0) return <p>No blogs found.</p>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">Blogs</h1>
      {selectedBlog && (
        <div className="mt-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{selectedBlog.title}</h1>
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={`${CLOUDINARY_BASE_URL}${selectedBlog.cover_image}`}
              alt={selectedBlog.title}
              className="object-cover"
              fill
            />
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            {selectedBlog.tag?.name} - {new Date(selectedBlog.date).toLocaleDateString()}
          </p>
          <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
          <h2 className="text-2xl font-bold mt-10">Comments</h2>
          <BlogComments blogId={selectedBlog.id.toString()} />
          <CommentForm blogId={selectedBlog.id.toString()} />
        </div>
      )}
    </div>
  );
}
