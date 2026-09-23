import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await axios.get('/api/routine');
        setRoutine(response.data);
      } catch (err) {
        setError('Could not load today\'s routine.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, []  );

  return (
    <main className="home">
      <h1>Hello, Person</h1>
      <h2>Today's Routine</h2>
      {loading && <p>Loading today's routine...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul className="routine-list">
          {routine.map((item) => (
            <li key={item.id} className="routine-item">
              <span className="routine-time">{item.time}</span>
              <span className="routine-title">{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Home;
