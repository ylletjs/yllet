import React, { useEffect, useState } from 'react';
import { useClient } from '@yllet/react';

function App() {
  const endpoint = 'http://wordpress.test/wp-json/';
  const client = useClient({ endpoint });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await client.posts().get();
      setPosts(response);
    };

    fetchPosts();
  }, [client]);

  return (
    <div>
      <h1>Posts</h1>
      {!posts.length && <p>Loading...</p>}
      <ul>
        {posts.map((p, pi) => (
          <li key={pi}>{p.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
