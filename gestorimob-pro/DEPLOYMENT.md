# 🚀 Deployment Guide - GestorImob Pro

## Overview

This guide will help you deploy GestorImob Pro to Netlify with secure Gemini AI integration using Netlify Functions.

## Prerequisites

- Netlify account ([sign up free](https://app.netlify.com/signup))
- Google Gemini API key ([get your key](https://aistudio.google.com/app/apikey))
- Git repository connected to Netlify
- Node.js and npm installed locally

---

## 🔐 Security: Generate New API Key

> **⚠️ IMPORTANT**: Your old API key was exposed in client-side code. You MUST generate a new one and revoke the old key.

### Steps:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the new key (starts with `AIza...`)
4. **REVOKE the old key** (`AIzaSyArveX__r4_cof2l-CUTJQYO-lfqr2irLc`) to prevent abuse

---

## 📦 Local Development Setup

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Create Local Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your NEW Gemini API key
# .env should contain:
GEMINI_API_KEY=AIza...your-new-key-here
```

**⚠️ Never commit `.env` to Git!** (It's already in `.gitignore`)

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Local Development Server

```bash
# Use Netlify CLI instead of npm run dev
netlify dev
```

This will:
- Start the Vite dev server
- Run Netlify Functions locally
- Make functions available at `http://localhost:8888/.netlify/functions/`
- Auto-reload on code changes

### 5. Test AI Features Locally

Open `http://localhost:8888` and test:
- ✅ AI Assistant chat
- ✅ Property inspection image analysis
- ✅ Contract generation

Check browser DevTools → Network tab to verify:
- ❌ No `GEMINI_API_KEY` visible in requests
- ✅ Requests go to `/.netlify/functions/gemini-*`

---

## 🌐 Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended)

#### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select the `gestorimob-pro` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions` (auto-detected)

#### 2. Add Environment Variables

**CRITICAL STEP** - Without this, AI features won't work!

1. In Netlify Dashboard → Your Site → **Site configuration** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIza...your-new-key-here` (paste your NEW key)
   - **Scopes**: All scopes selected
4. Click **"Create variable"**

#### 3. Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at `https://your-site-name.netlify.app`

---

### Option B: Deploy via Netlify CLI

```bash
# Login to Netlify
netlify login

# Initialize site (first time only)
netlify init

# Deploy to production
netlify deploy --prod

# During deployment, you'll be prompted to:
# - Link to existing site or create new one
# - Confirm build directory: dist
# - Confirm functions directory: netlify/functions
```

After deployment, add environment variable via CLI:

```bash
netlify env:set GEMINI_API_KEY "AIza...your-new-key-here"
```

---

## ✅ Verify Production Deployment

### 1. Check Site is Live

Visit your Netlify URL: `https://your-site-name.netlify.app`

### 2. Test AI Features

1. **AI Assistant**: Send a message like "Me ajude com um contrato de aluguel"
2. **Image Analysis**: Upload a property photo
3. **Contract Generation**: Fill in property/tenant details and generate

### 3. Check Functions in Netlify

1. Netlify Dashboard → Your Site → **Functions**
2. You should see 3 functions:
   - `gemini-chat`
   - `gemini-analyze-image`
   - `gemini-generate-contract`
3. Click each to view logs and invocations

### 4. Verify Security

Open browser DevTools → Network tab:
- ❌ **NEVER** see `GEMINI_API_KEY` anywhere
- ✅ See requests to `/.netlify/functions/gemini-*`
- ✅ Responses come from Netlify Functions

---

## 🔍 Troubleshooting

### AI Not Responding / 500 Errors

**Cause**: API key not configured or invalid

**Solution**:
1. Check Netlify Dashboard → Environment variables
2. Verify `GEMINI_API_KEY` exists and is correct
3. Redeploy: Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

### Functions Not Found (404)

**Cause**: Functions not deployed or wrong directory

**Solution**:
1. Check `netlify.toml` has `[functions]` section
2. Verify `netlify/functions/*.ts` files exist
3. Redeploy the site
4. Check build logs for function compilation errors

### CORS Errors

**Cause**: Trying to call Google API directly from frontend

**Solution**:
- Ensure you're using the NEW `geminiService.ts` that calls Netlify Functions
- Do NOT call `generativelanguage.googleapis.com` from frontend
- All calls should go through `/.netlify/functions/`

### Local Development Not Working

**Cause**: Missing `.env` file or Netlify CLI not installed

**Solution**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Create .env from example
cp .env.example .env

# Edit .env and add your API key
# Then run:
netlify dev
```

---

## 📊 Monitor Usage

### Gemini API Quotas

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)
2. Check your daily quota usage
3. Free tier: 60 requests/minute, 1500 requests/day

### Netlify Function Usage

1. Netlify Dashboard → Your Site → **Analytics** → **Functions**
2. View:
   - Total invocations
   - Average execution time
   - Error rate
3. Free tier: 125,000 function invocations/month

---

## 🔒 Best Practices

1. **Never expose API keys** in client-side code
2. **Always use environment variables** for secrets
3. **Regenerate API keys** if accidentally committed to Git
4. **Monitor function logs** for errors or abuse
5. **Set up alerts** in Netlify for failed deployments
6. **Use `.gitignore`** to prevent committing `.env`

---

## 📚 Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables Guide](https://docs.netlify.com/environment-variables/overview/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Netlify CLI Reference](https://cli.netlify.com/)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Netlify function logs: Dashboard → Functions → Click function → View logs
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Try redeploying the site
5. Test locally first with `netlify dev`

---

**🎉 You're all set! Your GestorImob Pro is now securely deployed with AI features powered by Netlify Functions.**
