import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFiles } from '@graphql-tools/load-files';
import { addMocksToSchema } from '@graphql-tools/mock';

console.log('Starting Mock Server...', process.cwd());

const typeDefs = await loadFiles(`${process.cwd()}/**/*.graphql`);

function mockId(): string {
  return Math.floor(Math.random() * 100000).toString();
}

function randomDate(): Date {
  const start = new Date(Date.now());
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 10);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
const mockStrings = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6', 'String 7', 'String 8', 'String 9', 'String 10'];

function mockString(): string {
  const index = Math.floor(Math.random() * mockStrings.length);
  return mockStrings[index];
}
function mockInt(): number {
  return Math.floor(Math.random() * 100000);
}

function mockBoolean(): boolean {
  return Math.random() >= 0.5;
}

function mockFloat(): number {
  return Math.random() * 100000;
}
function mockDecimal(): string {
  return (Math.random() * 100000).toFixed(2);
}
function mockDate(): string {
  return randomDate().toLocaleDateString();
}
function mockTime(): string {
  return randomDate().toLocaleTimeString();
}
function mockDateTime(): string {
  return randomDate().toISOString();
}
function mockUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const schema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs }),
  mocks: {
    Int: () => mockInt(),
    Float: () => mockFloat(),
    String: () => mockString(),
    Boolean: () => mockBoolean(),
    ID: () => mockId(),
    Date: () => mockDate(),
    DateTime: () => mockDateTime(),
    Time: () => mockTime(),
    Decimal: () => mockDecimal(),
    UUID: () => mockUUID(),
  }
});

const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Mock Server ready at: ${url}`);