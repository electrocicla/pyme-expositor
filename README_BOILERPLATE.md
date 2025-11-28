# Pyme Expositor - SaaS Boilerplate

This is a highly customizable web application skeleton designed for creators, agencies, and SMEs to deploy a landing page and portfolio site with a visual editor.

## Features

-   **Visual Editor:** Customize header, hero, gallery, footer, and theme settings in real-time.
-   **Media Management:** Upload images and videos to Cloudflare R2.
-   **Cloudflare Stack:** Built on Cloudflare Workers (Backend), Pages (Frontend), D1 (Database), and R2 (Storage).
-   **React Bits Effects:** Integrated support for visual effects.
-   **Publishing Workflow:** Draft vs. Published states.

## Setup

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Database Setup:**
    Initialize the D1 database:
    ```bash
    cd worker
    npx wrangler d1 execute expositor-db --local --file=./schema.sql
    ```

3.  **Development:**
    Start the frontend and backend:
    ```bash
    # Terminal 1 (Frontend)
    pnpm dev

    # Terminal 2 (Backend)
    cd worker
    pnpm dev
    ```

4.  **Deployment:**
    Deploy to Cloudflare:
    ```bash
    pnpm deploy
    ```

## Configuration

-   **Admin Login:** Default credentials are `owner` / `secretpassword`. Change this in `worker/schema.sql` or via the database.
-   **Environment Variables:** Update `worker/wrangler.jsonc` with your R2 bucket details and JWT secret.

## Project Structure

-   `src/components/Editor`: Visual editor components.
-   `src/contexts/ConfigContext.tsx`: State management for site configuration.
-   `src/types/config.ts`: Configuration schema.
-   `worker/src/index.ts`: Backend API (Hono).
-   `worker/schema.sql`: Database schema.
