import http from 'k6/http';
import { sleep, check } from 'k6';

// Ramp up to 10 virtual users over 30s, hold for 2 min, ramp down.
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '2m',  target: 10 },
    { duration: '15s', target: 0  },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.05'],   // less than 5 % errors
    http_req_duration: ['p(95)<2000'],  // 95th percentile under 2 s
  },
};

const URL = 'http://apolloserver:4000/';

const QUERIES = [
  // List all books with their authors
  JSON.stringify({
    query: `{ books { id title author { name } } }`,
  }),
  // List all authors with their books
  JSON.stringify({
    query: `{ authors { id name books { title } } }`,
  }),
  // Fetch a single book by id (rotates through 1–5)
  null, // filled dynamically below
  // Add a new author then immediately add a book (mutation pair)
  null,
];

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // Rotate through the static queries
  const idx = Math.floor(Math.random() * 2);
  const res = http.post(URL, QUERIES[idx], { headers });

  check(res, {
    'status 200':     (r) => r.status === 200,
    'no gql errors':  (r) => {
      try {
        return !JSON.parse(r.body).errors;
      } catch {
        return false;
      }
    },
  });

  // Occasionally fetch a single book by random id
  if (Math.random() < 0.3) {
    const id = Math.ceil(Math.random() * 5);
    http.post(URL, JSON.stringify({ query: `{ book(id: ${id}) { title author { name } } }` }), { headers });
  }

  // Occasionally fire a mutation
  if (Math.random() < 0.1) {
    const ts = Date.now();
    const addAuthor = http.post(URL,
      JSON.stringify({ query: `mutation { addAuthor(name: "Load Author ${ts}") { id } }` }),
      { headers },
    );
    try {
      const authorId = JSON.parse(addAuthor.body).data?.addAuthor?.id;
      if (authorId) {
        http.post(URL,
          JSON.stringify({ query: `mutation { addBook(title: "Load Book ${ts}", authorId: ${authorId}) { id title } }` }),
          { headers },
        );
      }
    } catch { /* ignore parse errors */ }
  }

  sleep(1);
}
