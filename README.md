# Template Overview

This template is structured as a monorepo using Turborepo to manage multiple applications and helper packages.

Below is an explanation of the important scripts in the setup, please read if you are interesting in how
everything works.

## Quick Start

For a quick start to this turborepo template follow these commands.

1. Get the envs for each project from here: TODO add env hub
2. `npm install`: installs all the node modules.
3. If you want the database to run locally you can run: `docker-compose up -d`
4. Start **all** the dev servers with `npm run dev`.

## Scripts

### ROOT

Core application's package.json scripts.

#### `build`

- **Purpose**: Runs the Turborepo build process across all packages.
- **Details**: Compiles and builds all necessary files within the monorepo.

#### `dev`

- **Purpose**: By default runs four packages in the monorepo: two nextjs react applications (apps/client and apps/admin), a single nestjs nodejs application (apps/server), and a shared types folder (/packages/shared). \*Runs the `npm run dev` command of each app and shared folder.\*

- **Details**: Read the **Apps and Packages** and **Shared Types and Components** section.

#### `build:lib`

- **Purpose**: Builds the shared folder types with the clean:build command from inside packages/shared
- **Details**: Removes the shared folder dist with unused types, transpiles typescript files, and generates the export files.

**_NOTE_**

There is a build script for generating export files on
_On macOS:_
Right-click on the app when you first run it, click Open, and then Allow it to run. This can prevent future warnings.
Alternatively, go to System Preferences > Security & Privacy and explicitly allow the app.

_On Windows:_
When the "untrusted app" warning appears, click More Info and then Run Anyway to bypass the warning.

### packages/shared

#### `build`

- **Purpose**: Transpiles ts files into js files.
- **Details**: Transpiles everything in the `/src` folder to the `/dist` folder.

#### `clean:build`

- **Purpose**: Deletes the dist folder and re-generates the transpiled contents.
- **Details**: Deletes the contents inside the dist folder and re-generates it by tsc transpilation of the contents in `/src` and then generates the exports through the lib-gen script.
