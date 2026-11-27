import './apm.js'; // Must be first — APM patches modules at load time.
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import apm from 'elastic-apm-node';
import { pool, initDb } from './db.js';
import logger from './logger.js';

const typeDefs = `#graphql
  type Author {
    id: Int
    name: String
    books: [Book]
  }

  type Book {
    id: Int
    title: String
    author: Author
  }

  type Query {
    books: [Book]
    book(id: Int!): Book
    authors: [Author]
    author(id: Int!): Author
  }

  type Mutation {
    addBook(title: String!, authorId: Int!): Book
    addAuthor(name: String!): Author
  }
`;

const resolvers = {
  Query: {
    books: async () => {
      const span = apm.startSpan('db.books.list');
      try {
        const { rows } = await pool.query('SELECT * FROM books ORDER BY id');
        logger.info({ message: 'books queried', count: rows.length });
        return rows;
      } catch (err) {
        apm.captureError(err as Error);
        logger.error({ message: 'books query failed', err });
        throw err;
      } finally {
        span?.end();
      }
    },

    book: async (_: unknown, { id }: { id: number }) => {
      const span = apm.startSpan('db.books.find');
      try {
        const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        return rows[0] ?? null;
      } catch (err) {
        apm.captureError(err as Error);
        throw err;
      } finally {
        span?.end();
      }
    },

    authors: async () => {
      const span = apm.startSpan('db.authors.list');
      try {
        const { rows } = await pool.query('SELECT * FROM authors ORDER BY id');
        logger.info({ message: 'authors queried', count: rows.length });
        return rows;
      } catch (err) {
        apm.captureError(err as Error);
        logger.error({ message: 'authors query failed', err });
        throw err;
      } finally {
        span?.end();
      }
    },

    author: async (_: unknown, { id }: { id: number }) => {
      const span = apm.startSpan('db.authors.find');
      try {
        const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
        return rows[0] ?? null;
      } finally {
        span?.end();
      }
    },
  },

  Mutation: {
    addBook: async (_: unknown, { title, authorId }: { title: string; authorId: number }) => {
      const span = apm.startSpan('db.books.insert');
      try {
        const { rows } = await pool.query(
          'INSERT INTO books (title, author_id) VALUES ($1, $2) RETURNING *',
          [title, authorId],
        );
        logger.info({ message: 'book added', title, authorId });
        return rows[0];
      } catch (err) {
        apm.captureError(err as Error);
        logger.error({ message: 'addBook failed', err });
        throw err;
      } finally {
        span?.end();
      }
    },

    addAuthor: async (_: unknown, { name }: { name: string }) => {
      const span = apm.startSpan('db.authors.insert');
      try {
        const { rows } = await pool.query(
          'INSERT INTO authors (name) VALUES ($1) RETURNING *',
          [name],
        );
        logger.info({ message: 'author added', name });
        return rows[0];
      } catch (err) {
        apm.captureError(err as Error);
        throw err;
      } finally {
        span?.end();
      }
    },
  },

  Book: {
    author: async (book: { author_id: number }) => {
      const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [book.author_id]);
      return rows[0] ?? null;
    },
  },

  Author: {
    books: async (author: { id: number }) => {
      const { rows } = await pool.query('SELECT * FROM books WHERE author_id = $1', [author.id]);
      return rows;
    },
  },
};

await initDb();

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

logger.info({ message: `Server ready`, url });
