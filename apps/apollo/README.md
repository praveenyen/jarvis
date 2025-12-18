<p align="center">
  <a href="README.md">
   <img src="apollo.gif" alt="Logo" width="332" height="332">
    </a>
  <h2 align="center">Apollo</h2>
<h5 align="center">The new Jarvis</h5>
</p>

### Table of contents

<!--ts-->

- [General Info](#general-info)
- [Technologies Used](#technologies-used)
- [Overview](#overview)
<!--te-->

### General Info

Apollo is an internal dashboard application built using Next.js and React. It will serve as a modernized frontend for replacing the existing the internal application (Jarvis), aiming to enhance user experience, performance, and scalability.

This project is created with [Next.js](https://nextjs.org) 14 and is bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Technologies Used

| Technology                                             | Version |
| :----------------------------------------------------- | ------: |
| [Next.js](https://nextjs.org)                          |  15.1.2 |
| [Jotai](https://jotai.org/docs)                        |  2.10.3 |
| [Mantine UI](https://mantine.dev/getting-started/)     |  7.15.0 |
| [React Js](https://react.dev/blog/2024/12/05/react-19) |  19.0.0 |
| [Typescript](https://www.typescriptlang.org/)          |   5.7.2 |
| [node](https://nodejs.org/en/)                         | 22.12.0 |

### Overview

- Choice of Router

  - **_The App Router_** allows routes to be implicitly created based on file names in the pages directory, it requires you to define your routes using a JavaScript API within an app directory.

- Client-Side

  - The client side runs completely on the `React 19` ecosystem. Most of the components
    are leveraged from the component library that `Mantine UI` provides.

  - The client side uses a central store managed by `Jotai` to manage data that is shared by various components
    spread across various pages

  - This project uses `ESLint` and `Prettier` to maintain the formatting sanity of the project

  - `Husky` adds git hooks for pre-commit checks.

- Server-Side

  - Next.js uses Server Components by default - this is to improve your application's performance and means you don't have to take additional steps to adopt them. Hence, the usage of 'use client' for a client component.
  - Refer this [doc](https://nextjs.org/docs/app/building-your-application/rendering/server-components) to learn more about server components.

  - API routes provide a solution to build a public API with Next.js. Any file inside the folder pages/api is mapped to /api/\* and will be treated as an API endpoint instead of a page. Hence, these public apis in turn communicates on behalf of the client to the intended backend services. [Read more...](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
