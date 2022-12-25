## Description

Hvoya CRM. Project built with [Nest.js](https://nestjs.com/) and [Angular](https://angular.io/).

## Installation

### Prerequisites

1. [Node.js](https://nodejs.org/en/) and NPM (~v16.15.0)
2. [PostgreSQL](https://www.postgresql.org/download/) (~15.1)
3. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for VS Code

Install:
1. Nest CLI
```
npm install -g @nestjs/cli
```
2. Angular CLI 
```
npm install -g @angular/cli
```

### Backend (Nest)

1. Install node modules in the `root` of the project running: 

```bash
$ npm install
```

2. Create `.env` file in the `root` of the project with the following content:

```
# APP
PORT='3000'

# DATABASE
DB_HOST='localhost'
DB_PORT=5432
DB_USERNAME='postgres'
DB_PASSWORD='postgres'
DB_NAME='hvoya_crm_dev'

# JWT
JWT_SECRET='secret'
```

3. Create DB with the configs from `.env` in PostgreSQL.

### Frontend (Angular)

Switch to the `client` folder and install node modules running:

```bash
$ npm install
```

## Running the app

### Backend (Nest)

In `root` folder run:
```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

> Note: All API endpoint routes start with `/api`. E.g. `/api/products`

### Frontend (Angular)

In `client` folder run:
```bash
$ npm run start
```

## Test

### Backend (Nest)

In `root` folder run:
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Frontend (Angular)

In `client` folder run:
```bash
$ npm run test
```

## Environments

1. [Staging](http://167.99.145.25/) -> `ssh root@167.99.145.25`
2. [Jenkins](http://159.89.233.123:8080/) -> `ssh root@159.89.233.123`
3. [Trello](https://trello.com/b/YvdzPYBT/hvoya-crm)
4. [Small cheatsheet](https://docs.google.com/document/d/1pn9lYFZJRZNnFB6rV9sUU3tAMIfulvh9J2B37NIPl_8/edit#heading=h.xdwyq0n7131o) with some basic commands to help setup dev env

## Recipes

### Backend (Nest)

#### 1. Add new entity

1. Add entity to the `entities` folder.
2. Generate migration `npm run typeorm:generate-migration --name=<name>`.
3. Run migration `npm run typeorm:run-migrations`.

#### 2. Update entity (Add new column(s) or update column type, etc.)

1. Update entity.
2. Generate migration `npm run typeorm:generate-migration --name=<name>`.
3. Run migration `npm run typeorm:run-migrations`.
