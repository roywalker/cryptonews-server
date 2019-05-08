**Cryptonews is a Hacker News clone for the cryptocurrencies industry.**

## Prerequisites

You are going to need:

- node
- git
- yarn or npm
- [postgres](https://www.postgresql.org/)

## Installation

1. Clone this repository. `git clone https://github.com/roywalker/cryptonews-server.git`

2. Install dependencies. `yarn install`

3. Create the databases.

```
$ psql
$ CREATE DATABASE cryptonews;
$ CREATE DATABASE cryptonews_test;
```

4. Migrate the database. `yarn run db:migrate`

5. (Optional) Fill the database with sample data. `yarn run db:seed`

6. (Optional) Create .env file.

| Variable          | Description                |
| ----------------- | -------------------------- |
| PORT              | API port to listen from    |
| DATABASE_URL      | Postgres database URI      |
| DATABASE_TEST_URL | Postgres test database URI |
| JWT_SECRET        | JSON Web Token secret      |

## Running the app locally

```
$ yarn dev
```

You can now access the API at http://localhost:3000/api

## Testing

```
$ yarn test
```
