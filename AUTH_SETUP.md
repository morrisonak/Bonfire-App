# Auth Setup Checklist

## Required Environment Variables

Before deploying the auth implementation, ensure these environment variables are set in Vercel:

### 1. Better Auth Secret (REQUIRED)
```
BETTER_AUTH_SECRET=<32+ character random string>
```

Generate with:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### 2. Better Auth URL (REQUIRED for production)
```
BETTER_AUTH_URL=https://bonfire-app.vercel.app
```

### 3. Vercel Postgres (REQUIRED)
Ensure Vercel Postgres is connected to your project. Vercel auto-injects:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

**Setup:** Go to your Vercel project → Storage → Create Database → Postgres

### 4. Resend (OPTIONAL - for production email)
```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

**Without these:** Magic links will be logged to console instead of emailed.

**Setup:** 
1. Sign up at https://resend.com
2. Add and verify your sending domain
3. Create an API key

## Database Schema

Better Auth will auto-create its tables on first run. No migrations needed.

Tables created:
- `user`
- `session`
- `account`
- `verification`

## Testing Locally

1. Create `.env.local`:
```bash
BETTER_AUTH_SECRET="dev-secret-at-least-32-chars-long-for-testing"
BETTER_AUTH_URL="http://localhost:5173"
POSTGRES_URL="postgresql://..."  # Your local or dev Postgres URL
# RESEND_API_KEY and EMAIL_FROM are optional for local dev
```

2. Run dev server:
```bash
bun run dev
```

3. Visit http://localhost:5173/login and test magic link flow

## Deployment Steps

1. **Set environment variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all REQUIRED variables above

2. **Connect Vercel Postgres:**
   - Project → Storage → Create → Postgres
   - This auto-adds `POSTGRES_URL` etc.

3. **Deploy to preview first:**
   ```bash
   git push origin breaking-changes/auth-wip
   ```
   - Vercel will create a preview deployment
   - Test the magic link flow on the preview URL

4. **Check logs if it fails:**
   - Vercel Dashboard → Deployments → [your deployment] → Functions tab
   - Look for error messages about missing env vars

5. **Once preview works, merge to master:**
   ```bash
   git checkout master
   git merge breaking-changes/auth-wip
   git push origin master
   ```

## Common Issues

### Error: Missing required environment variable: BETTER_AUTH_SECRET
→ Set `BETTER_AUTH_SECRET` in Vercel env vars (32+ chars)

### Error: Missing POSTGRES_URL
→ Connect Vercel Postgres to your project

### Error: Pool connection failed
→ Check that Postgres is accessible and tables exist (they should auto-create)

### Magic link not sending
→ If you want emails, set `RESEND_API_KEY` and `EMAIL_FROM`
→ Otherwise, check server logs for the magic link URL

## Next Steps After Auth Works

1. Add trial tracking fields to user table:
   - `trial_started_at`
   - `trial_ends_at`
   - `subscription_status`
   - `subscription_plan`

2. Protect routes with auth guards

3. Implement trial expiry checks

4. Add Stripe billing integration
