import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Pool, type Client } from 'pg';
import express, { Request } from 'express';
import { NodePlugin } from 'graphile-build';
import { gql, makeExtendSchemaPlugin, postgraphile, Plugin } from 'postgraphile';
import AggregatesPluggin from '@graphile/pg-aggregates';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import axios from 'axios';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
};

const EXCLUDED_QUERIES = ['IntrospectionQuery', 'queryLogs', '_squidStatus'];

const app = express();

const pool = new Pool(process.env.DB_URL ? { connectionString: process.env.DB_URL } : DB_CONFIG);

// This is needed as in certain intervals a query is made to check status of the processor
export const ProcessorStatusPlugin: Plugin = makeExtendSchemaPlugin((build, options) => {
  const schemas: string[] = options.stateSchemas || ['squid_processor'];

  return {
    typeDefs: gql`
      type _ProcessorStatus {
        name: String!
        height: Int!
        hash: String!
      }

      extend type Query {
        _squidStatus: [_ProcessorStatus!]!
      }
    `,
    resolvers: {
      Query: {
        _squidStatus: async (parentObject, args, context, info) => {
          const pgClient: Client = context.pgClient;

          const { rows } = await pgClient.query(schemas.map((s) => `SELECT '${s}' as name , height, hash FROM ${s}.status`).join(' UNION ALL '));

          return rows || [];
        },
      },
    },
  };
});

const sanitizeQuery = (query: string): string => {
  // NOTE: Remove newlines and extra text before the first '{' and extra whitespaces
  const sanitizedQuery = query
    .replace(/^[^{]*\{/, '{')
    .replace(/[\n\s]+/g, ' ')
    .trim();

  return sanitizedQuery;
};

const logQueries = async (req: Request) => {
  const query = req.body.query;
  // NOTE: exclude some queries as they dont give us relevant information
  if (query && !EXCLUDED_QUERIES.some((excludedQuery) => query.includes(excludedQuery))) {
    const id = uuidv4();
    const sanitizedQuery = sanitizeQuery(query);
    const chainName = process.env.CHAIN || '';
    const timestamp = new Date();
    const { data } = await axios.get(`http://ip-api.com/json/${req.headers['x-forwarded-for']}`);
    let location = '';

    if (data.country) {
      location = `${data.city}, ${data.country}`;
    }

    try {
      await pool.query('INSERT INTO query_logs (id, query, timestamp, location, chain_name) VALUES ($1, $2, $3, $4, $5)', [
        id,
        sanitizedQuery,
        timestamp,
        location,
        chainName,
      ]);
    } catch (err) {
      console.error('Error logging query:', err);
    }
  }
  return {};
};

app.use(
  postgraphile(process.env.DB_URL || DB_CONFIG, 'public', {
    watchPg: true,
    retryOnInitFail: true,
    includeExtensionResources: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    disableDefaultMutations: true,
    skipPlugins: [NodePlugin],
    appendPlugins: [ProcessorStatusPlugin, AggregatesPluggin, FilterPlugin, SimplifyInflectorPlugin],
    externalUrlBase: process.env.BASE_PATH,
    disableQueryLog: true,
    enableQueryBatching: true,
    graphiqlRoute: '/graphql', // This is needed for the explorer to work as the cloud URL is hardcoded.
    graphqlRoute: '/graphql/', // This is needed for the explorer to work as the cloud URL is hardcoded.
    pgSettings: logQueries,
  })
);

app.listen(process.env.GRAPHQL_SERVER_PORT || process.env.GQL_PORT, () => {
  console.log(`Squid API listening on port ${process.env.GRAPHQL_SERVER_PORT || process.env.GQL_PORT}`);
});
