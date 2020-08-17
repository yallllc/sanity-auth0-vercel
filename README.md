# Sanity Studio with Auth0 SSO on Vercel Serverless

This example project uses [Sanity.io](https://www.sanity.io/docs/) hosted on [Vercel](https://vercel.com/docs), with custom login through [Auth0](https://auth0.com/docs/api/).

To get Auth0 SSO login working on Vercel Serverless, the project leverages the [nextjs-auth0](https://github.com/auth0/nextjs-auth0) module despite the fact that this is not a Next.js project. (The peer dependency is not truly needed, so it works without adding Next.) This module handles login server-side using cookies and is a way to use Vercel serverless instead of a separate Express server.

:skull_and_crossbones: **This repo is published for discussion purposes.** It is not intended as a fully-working example and code here may not work correctly, so use at your own risk. :skull_and_crossbones:

<details><summary>Requirements</summary>

- a linked Sanity project
- a linked Vercel hosting project, plus signing in and deploying to vercel
- an Auth0 tenant set up for email/pw SSO login, and a user added to it
- correct CORS settings in Sanity, Vercel and Auth0
- a .env file like .env.example here, to run locally - later variables would be set in Vercel
- project is run locally using `yarn start:vercel` which uses port 8000
</details>
<br/>

Work was based on several public examples:

- [Sanity 3rd-party-auth-example](https://github.com/sanity-io/3rd-party-auth-example)
- [Sanity community-studio](https://github.com/sanity-io/community-studio)

These both rely on Express, which makes this Vercel-based example unique, at time of writing.

## What it Does

1. A custom `config/@sanity/default-login.json` directs user click to:
2. `/api/login` -> Auth0
3. `/api/on_logged_in` (requires Auth0 CORS domain settings) calls `auth0.handleCallback` and uses its `onUserLoaded` option to perform Sanity login

The main work is done in `onUserLoaded`. This file uses custom roles set up in Auth0 as user metadata to add/remove the user to custom Sanity groups, then authorizes the Sanity session.

A basic migration to update group permissions is also included in the `migrations` folder.
