### 3. High-Level Architecture Overview

The solution is built on a **JAMstack architecture**, decoupling the frontend presentation layer from the backend business logic and data services. This ensures maximum performance, security, and scalability.

*   **Frontend (J - JavaScript, M - Markup):** A statically generated Next.js application, pre-rendered at build time for core content pages. Dynamic interactions (e.g., form submissions, map interactions) are handled by client-side JavaScript.
*   **Backend (A - APIs):** A collection of managed, serverless microservices exposed via GraphQL and RESTful endpoints. These services handle data persistence, business logic, authentication, and third-party integrations.
*   **Content Delivery:** All static assets (HTML, CSS, JS, images) are served globally via a Content Delivery Network (CDN) for optimal performance.
*   **Infrastructure as Code (IaC):** The entire AWS infrastructure is defined and provisioned using AWS Amplify’s declarative configuration, stored within the application’s Git repository. This ensures reproducibility, version control, and auditability of the infrastructure.

---

### 4. Detailed Component Architecture

#### 4.1. Frontend Layer
*   **Framework:** Next.js (App Router) with TypeScript.
*   **Rendering Strategy:**
    *   **Static Site Generation (SSG):** Used for all informational pages. Content is “baked” into static HTML files at build time, ensuring the fastest possible load times and perfect SEO.
    *   **Server-Side Rendering (SSR) / Client-Side Rendering (CSR):** Used for dynamic pages requiring real-time data or user interaction, such as the church finder map (which fetches location data) and forms for prayer requests or pastor Q&A.
*   **State Management:** Primarily handled through React’s native state and context. For complex data fetching, the Apollo Client (for GraphQL) or React Query will be used.
*   **UI Library:** A lightweight, accessible component library (e.g., Radix UI, shadcn/ui) to ensure a consistent and professional user experience.

#### 4.2. Backend Layer (APIs and Services)
*   **Primary API Gateway:** AWS AppSync (GraphQL).
    *   **Rationale:** Provides a single, flexible endpoint for the frontend to fetch and mutate data. GraphQL’s strongly typed schema and ability to request only needed fields reduce over-fetching and improve performance. It integrates natively with AWS Amplify and DynamoDB.
*   **Data Persistence:** Amazon DynamoDB.
    *   **Rationale:** A fully managed, serverless NoSQL database. It offers single-digit millisecond latency, automatic scaling, and a pay-per-request pricing model, making it ideal for the application’s content structure (e.g., BlogPosts, VideoItems, Churches, PrayerRequests). Its schema-less nature aligns well with the evolving content model.
*   **Authentication & Authorization:** Amazon Cognito.
    *   **Rationale:** A fully managed service for user sign-up, sign-in, and access control. It will manage user pools for the administrative backend, with granular role-based access control (RBAC) defining permissions for Admins, Editors, and Moderators.
*   **File Storage:** Amazon S3.
    *   **Rationale:** The industry-standard, durable, and scalable object storage service. It will store all media assets (images, audio, video files). Files will be uploaded directly from the browser to S3 using pre-signed URLs for enhanced security and reduced server load.
*   **Search Service:** Amazon OpenSearch Service.
    *   **Rationale:** A managed service for full-text search. It will index the `content` field of BlogPosts and the `description` field of VideoItems, enabling users to search for specific topics or keywords across the site’s dynamic content.
*   **Email Service:** SendGrid (Third-Party SaaS).
    *   **Rationale:** A specialized, reliable, and cost-effective email delivery platform. It will be used to send notifications to administrators when new prayer requests or pastor Q&A submissions are received. API keys will be securely stored in AWS Systems Manager (SSM) Parameter Store.

#### 4.3. Infrastructure and Deployment
*   **Hosting & CI/CD:** AWS Amplify Hosting.
    *   **Rationale:** A fully managed service that provides a git-based workflow for building, deploying, and hosting full-stack web applications. It automatically provisions a global CDN, sets up SSL/TLS, and manages the deployment pipeline. A push to the `main` branch triggers an automated build and deployment.
*   **Infrastructure as Code (IaC):** AWS Amplify CLI.
    *   **Rationale:** The Amplify CLI allows developers to define cloud resources (Cognito, AppSync, DynamoDB, S3, OpenSearch) using declarative configuration files (e.g., `schema.graphql`, `auth` configuration) that are stored alongside the application code in the Git repository. This enables “git push” to deploy both code and infrastructure changes, ensuring consistency across environments (dev, staging, prod).
*   **Secrets Management:** AWS Systems Manager (SSM) Parameter Store.
    *   **Rationale:** A secure, scalable service for managing configuration data and secrets (e.g., SendGrid API key). Parameters are encrypted and can be accessed by authorized AWS services (e.g., Lambda functions).

---
