# Backlog
An Angular web app for tracking open tasks on a Kanban-style Board for all my private and public GitHub projects. Using GithUb API to retrieve metadata about your projects and Supabase for storing the work items and their status.

## Setup Guide
1. Create a new [Supabase](https://supabase.com/dashboard) project. Enable "Enable Data API" and "Automatically expose new tables".
1. Run `pnpm install` to install all necessary dependencies.
1. Run `pnpm db:login`. Follow the browser instructions and copy the OTP into your terminal when prompted.
1. Run `pnpm db:link`. Link this app to the newly create supabase project.
1. Run `pnpm db:push`. This will create the necessary database table
1. Run `pnpm fn:deploy`. This will deploy the 2 necessary edge functions.
1. Set an app password for this this app by running `pnpm supabase secrets set APP_PASSWORD=<app-password>`
1. In the /src/app/environments folder you'll find a template for the env vars of this app. Make a copy of the template file `environment.ts` and name it `environment.development.ts`.
1. Copy the Supabase project url from the project overview of your Supabase project.
1. Within your Supabase project go to Settings > Configuration > API Keys and copy the default publishable key. Paste it into the `environment.development.ts` file.
1. In the developer settings of your GitHub Account create a new [Personal Access Token](https://github.com/settings/personal-access-tokens). Set the Repository access of the new token to 'All repositories' and add a read-only permission for 'Metadata'. Save and copy the newly generated token.
1. Run `pnpm supabase secrets set GHP_TOKEN=<github-pat>` so that the app can retrieve all your GitHub repos metadata from the GitHub API via a Supabase edge function.
1. Run `pnpm start` to start the application. You should be greated by a login dialog. Enter the password you defined in Step 7. After successfully logging in, you should see a dashboard with all your private and public GitHub repos.  