[![Yaml][yaml-shield]][ref-yarn]
[![NodeJs][nodejs-shield]][ref-nodejs]
[![Typescript][typescript-shield]][ref-typescript]
[![Jest][jest-shield]][ref-jest]
[![Yarn][yarn-shield]][ref-yarn]

[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[jest-shield]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[yarn-shield]: https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white
[yaml-shield]: https://img.shields.io/badge/-YAML%201.2-blueviolet?style=for-the-badge

[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-yarn]: https://yarnpkg.com
[ref-yaml]: https://yaml.org/spec/1.2

## Purpose

Core library of the Project Granter app to handle project grants' data.

## Features
### Supports
- Import of YAML 1.2 project grant definitions
- Whitelisting & Validation of fields & values
- Merkle tree integration: root, leafs & proofs
- Transform & export necessary data for on-chain contract handling

### Technics
- TypeScript v4
- Typedoc API doc generation
- Unit and integration tests using Jest + Chaï
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- VS Code debugger scripts
- Local development with Nodemon


## Installation
```sh
pnpm install
```
or ``yarn install``

## Scripts

### Run

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.
```sh
yarn run start:dev
```

Starts the app in production by first building the project with `yarn run build`, and then executing the compiled JavaScript at `build/index.js`.
```sh
yarn run start
```

### Build

Builds the app at `build`, cleaning the folder first.
```sh
yarn run build
```

### Test

Runs the `jest` tests once.
```sh
yarn run test
```

Run the `jest` tests in watch mode, waiting for file changes.
```sh
yarn run test:dev
```

### Format
Format your code.
```sh
yarn run prettier-format
```

Format your code in watch mode, waiting for file changes.
```sh
yarn run prettier-watch
```


## License

Distributed under the [LGPL-2.1 license][license].

<!-- license -->
[license]: LICENSE