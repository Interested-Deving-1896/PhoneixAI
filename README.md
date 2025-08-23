# 🚀 Phoenix AI Universal - Complete Setup Guide

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Database**: PostgreSQL (recommended) or SQLite (development)
- **AI Provider API Keys**: At least one required

## 🛠️ Step-by-Step Setup

### 1. Project Initialization

```bash
# Create new project directory
mkdir phoenix-ai-universal
cd phoenix-ai-universal

# Initialize git repository
git init

# Create package.json (copy from artifacts above)
# Create all configuration files from the artifacts
```

### 2. Install Dependencies

```bash
# Install all packages
npm install

# Generate Prisma client
npx prisma generate
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local
```

**Required Environment Variables:**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/phoenix_ai"

# At least one AI provider (recommended: start with Anthropic)
ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Authentication
NEXTAUTH_SECRET="run-openssl-rand-base64-32-to-generate"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Apply database schema
npx prisma db push

# (Optional) Open database browser
npx prisma studio
```

### 5. Development Server

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 🌐 Deployment Options

### Option A: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add database (Vercel Postgres recommended)
```

### Option B: Railway (Full-stack friendly)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up

# Add PostgreSQL database in Railway dashboard
```

### Option C: Docker (Self-hosted)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Includes PostgreSQL, Redis, and Ollama
```

### Option D: Render (Alternative cloud)

1. Connect GitHub repository to Render
1. Create PostgreSQL database
1. Deploy web service
1. Configure environment variables

## 🔑 API Keys Setup

### Anthropic (Claude)

1. Visit [console.anthropic.com](https://console.anthropic.com)
1. Create API key
1. Add to `ANTHROPIC_API_KEY`

### OpenAI (GPT)

1. Visit [platform.openai.com](https://platform.openai.com)
1. Create API key
1. Add to `OPENAI_API_KEY`

### Google (Gemini)

1. Visit [aistudio.google.com](https://aistudio.google.com)
1. Create API key
1. Add to `GOOGLE_API_KEY`

### Local Models (Ollama)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models
ollama pull llama3.1
ollama pull mixtral

# Set LOCAL_AI_URL="http://localhost:11434"
```

## 🧪 Testing & Quality

```bash
# Run all tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📊 Usage Analytics

The system includes comprehensive analytics:

- **Token Usage Tracking** - Monitor costs across providers
- **Response Time Metrics** - Performance monitoring
- **Provider Health Status** - Real-time availability
- **User Session Analytics** - Conversation insights

## 🔧 Advanced Configuration

### Custom AI Providers

Add new providers by implementing `BaseAIProvider`:

```typescript
export class CustomProvider extends BaseAIProvider {
  async chat(messages, model, config) {
    // Your implementation
  }
}
```

### Workflow Customization

Modify phases in the Phoenix interface:

```typescript
const phases = [
  { id: 'research', name: 'Research', icon: Search },
  { id: 'design', name: 'Design', icon: Palette },
  // Add your phases
];
```

### System Prompts

Customize the Phoenix architect persona:

```typescript
const systemPrompt = `
You are Phoenix, specialized in ${domain}.
Current phase: ${phase}
Focus on: ${objectives}
`;
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Errors**

```bash
# Check DATABASE_URL format
# Ensure database is running
# Run: npx prisma db push
```

**API Key Issues**

```bash
# Verify API key format
# Check provider status at their status pages
# Test with minimal request
```

**Build Failures**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Port Conflicts**

```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

### Performance Optimization

**Production Tuning**

- Enable Redis for session storage
- Configure CDN for static assets
- Set up proper database indexes
- Enable response caching

**Scaling Considerations**

- Use load balancers for multiple instances
- Implement horizontal database scaling
- Set up provider API quotas
- Monitor and alert on usage thresholds

## 📞 Support & Community

- **Documentation**: Complete API docs included
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Updates**: Watch repository for new features

## 🔄 Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Update Prisma
npx prisma generate

# Security audits
npm audit fix
```

### Monitoring

- Set up error tracking (Sentry recommended)
- Monitor provider API quotas
- Track response times and success rates
- Regular database maintenance

-----

## ✅ Success Checklist

- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] At least one AI provider working
- [ ] Authentication system functional
- [ ] Development server running
- [ ] Tests passing
- [ ] Ready for deployment

**🎉 Congratulations! You now have a production-ready Universal AI Interface that can work with any AI provider, featuring intelligent fallbacks, real-time streaming, and enterprise-grade architecture.**
