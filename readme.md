## Installation & Setup

Clone project from github

```
  git clone https://github.com/mimamch/loyalty-management-system-api.git
  cd loyalty-management-system-api
```

Copy .env.example to .env

```
  cp .env.example .env
```

Change DATABASE_URL in .env file to your database url

```
  DATABASE_URL="postgres://username:password@host:5432/loyalty-management"
```

Installing depedencies

```
npm install
```

Seeding user and member

```
npm run seed
```

Run the server

```
npm run dev
```

## API Documentation

Available on swagger.json file

## Licence

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
