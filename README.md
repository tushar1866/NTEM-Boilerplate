# NTEM Boilerplate

![NTEM Boilerplate](https://img.shields.io/badge/NTEM-Boilerplate-blue)
![PR Welcome](https://img.shields.io/badge/PR-Welcome-green)

NTEM Boilerplate is a Node.js application boilerplate for creating RESTful APIs using Mongoose, Express, and TypeScript. This boilerplate provides a structured and efficient setup to get your API project up and running quickly.

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)

## Introduction

This boilerplate is designed to help you create RESTful APIs with Node.js, Express, Mongoose, and TypeScript. It includes common tools and configurations to streamline the development process and ensure best practices.

## Features

-   **Modern Stack**: Built with Node.js, Express, Mongoose, and TypeScript.
-   **Robust Architecture**: Structured for scalability and maintainability.
-   **Pre-configured Tools**: Includes ESLint, Prettier, and TypeScript configuration.
-   **Quick Setup**: Initialize a new project with a single command.

## Prerequisites

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14.x or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Quick initialize

To create a new application using this boilerplate, run:

```sh
npx create-ntem-app <your-app-name>
cd <your-app-name>
npm run dev
```

Or

```sh
npm init create-ntem-app <your-app-name>
cd <your-app-name>
npm run dev
```

## Manual initialize

You love to do it in your way, Please follow these steps:

Clone repository:

```bash
git clone --depth 1 https://github.com/tushar1866/NTEM-Boilerplate.git
cd ntem-boilerplate
npx rimraf ./.git
```

Install the packages:

```bash
yarn install
```

Setup your environment variables:

```bash
cp .env.example .env

# to modify the environment variables open .env (if needed)
```

Inspired from https://github.com/hagopj13/node-express-boilerplate
