import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://emirue:T8eZE1JVLEW6r79u@cluster0-foq9c.gcp.mongodb.net/test?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log('connected success mongoose');
  })
  .catch((err) => {
    console.log('err');
  });

const Book = mongoose.model('book', {
  title: String,
  author: String
});

// const books = [
//   { title: '문제는 경제다', author: '김개동' },
//   { title: '82년생 김지영', author: '김지영' },
//   { title: '88만원 세대', author: '유시민' },
//   { title: '100만원 세대', author: '유시민' },
// ];
//
// books.forEach((item) => {
//   new Book(item).save();
// });

const typeDefs = gql`
  type Query {
    books: [Book]
    findBook(name: String): [Book]
  }
  
  type Book {
    title: String
    author: String
  }
  
  type Mutation {
      addBook(title: String, author: String):Book
  }
`;

const resolvers = {
  Query: {
    books: async (obj, args, ctx) => {
      console.log(ctx);
      return await ctx.models.Book.find();
    },
    findBook: async (obj, args, ctx) => {
      return await ctx.models.Book.find({
        author: args.name
      });
    }
  },
  Mutation: {
    addBook: async (obj, args, ctx) => {
      return await new ctx.models.Book(args).save();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    return {
      models: {
        Book
      }
    }
  },
});

const app = express();
server.applyMiddleware({ app });

app.listen(3000, () => {
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
});
