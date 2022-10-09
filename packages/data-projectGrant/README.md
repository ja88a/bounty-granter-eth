
$ npm install -g js-yaml


## Features

- TypeScript v4
- Testing with Jest
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- VS Code debugger scripts
- Local development with Nodemon

## Scripts

``sh
npm run start:dev
``

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

``sh
npm run start
``

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

``sh
npm run build
``

Builds the app at `build`, cleaning the folder first.

``sh
npm run test
``

Runs the `jest` tests once.

``sh
npm run test:dev
``

Run the `jest` tests in watch mode, waiting for file changes.

``sh
npm run prettier-format
``

Format your code.

``sh
npm run prettier-watch
``

Format your code in watch mode, waiting for file changes.