import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const books = [
  { title: '문제는 경제다', author: '김개동' },
  { title: '82년생 김지영', author: '김지영' },
  { title: '88만원 세대', author: '유시민' },
  { title: '100만원 세대', author: '유시민' },
];

const typeDefs = gql`
  type Query {
    books: [Book]
    findBook(name: String): [Book]
  }
  type Book {
    title: String
    author: String
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    findBook: (obj, args) => {
      return books.filter(o => o.author === args.name);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen(3000, () => {
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
});
