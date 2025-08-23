# Phoenix AI Universal - Application Architecture Plan

Based on the provided files, the Phoenix AI Universal application is a full-stack Next.js application with a robust backend, flexible AI integration, and a sophisticated frontend.

## 1. Key Components:

### a. Frontend (Next.js / React):
- **User Interface:** Built with React, likely using Next.js for server-side rendering and routing.
- **AI Interaction:** Components for chat, configuration, and display of AI responses.
- **State Management:** React hooks (`useAI`) for managing AI provider states, messages, and configurations.
- **Authentication:** Integration with NextAuth.js for user login and session management.
- **Export Capabilities:** Functionality to export conversations (Markdown, JSON, PDF).

### b. Backend (Next.js API Routes):
- **AI Provider Management:** API routes (`/api/ai/chat`, `/api/ai/chat/stream`, `/api/ai/providers`, etc.) to handle AI requests, manage providers, and implement fallback logic.
- **Authentication Endpoints:** Handled by NextAuth.js for secure user management.
- **Database Interaction:** APIs to interact with the PostgreSQL database (via Prisma) for chat history, user management, and usage analytics.
- **Rate Limiting & CORS:** Middleware for security and cross-origin requests.

### c. Database (PostgreSQL with Prisma ORM):
- **User Management:** Stores user accounts, sessions, and authentication details.
- **Chat History:** Persists conversation data, including messages, sessions, and metadata.
- **AI Configuration:** Stores user-specific AI settings.
- **Usage Analytics:** Tracks token usage, request counts, and provider statistics.
- **System Configuration:** Stores system-wide settings.
- **Exports & Sharing:** Manages export tasks and shared chat sessions.

### d. AI Abstraction Layer (`lib/ai/providers`):
- **BaseAIProvider:** Abstract interface for various AI providers.
- **Provider Implementations:** Concrete implementations for Anthropic, OpenAI, Google, Cohere, and Local models.
- **Unified Response Format:** Ensures consistent data structure from different AI sources.
- **Error Handling:** Graceful degradation and informative error messages.

### e. Intelligent Orchestration System (`lib/ai/manager.ts`):
- **AIProviderManager:** Centralized management of AI providers.
- **Automatic Fallbacks:** Seamless switching between providers on failure.
- **Health Monitoring:** Real-time status checking of AI providers.
- **Load Balancing:** Intelligent routing based on provider availability and priority.

## 2. Relationships:
- The Frontend communicates with the Backend via Next.js API routes.
- The Backend utilizes the AI Abstraction Layer and Intelligent Orchestration System to interact with various AI providers.
- The Backend also interacts with the PostgreSQL database via Prisma for data persistence.
- NextAuth.js handles authentication flows, integrating with both the Frontend and Backend.

## 3. Deployment Strategy:
- The application is designed for serverless deployment (Vercel recommended for Next.js).
- Docker Compose is provided for self-hosted deployments, including PostgreSQL, Redis, and Ollama.
- Railway and Render are also supported as alternative cloud deployment options.

## 4. Development Environment:
- **TypeScript:** Ensures type safety across the stack.
- **Testing Framework (Jest):** For comprehensive unit and integration tests.
- **ESLint & Prettier:** For code quality and formatting.
- **CI/CD Pipeline (GitHub Actions):** For automated deployment workflows.

This architecture provides a scalable, reliable, and flexible foundation for the Phoenix AI Universal application, allowing for easy integration of new AI providers and robust management of existing ones.

