# VvE Digitaal (vveapp.com) - Session State

**Updated:** 2026-04-05
**Quick status:** Live at vveapp.com with Supabase connected. Auth works, schema deployed. Ready for first customer.

## Live URLs
- https://vveapp.com: LIVE (200 OK)
- https://app-two-indol-56.vercel.app: LIVE (Vercel default)

## Code Location
- **Source:** `C:\Users\hidde\_claude\vve-platform\app\`
- **GitHub:** vandenbergh-dotcom/vve-digitaal (master branch, clean)
- **Hosting:** Vercel (hiddes-projects-1b11b817/app)
- **Database:** Supabase (hzcbjusucsrymlkvurfb.supabase.co)
- **Domain:** vveapp.com via Cloudflare DNS

## Last Session (2026-04-05)
### What was done
- Reviewed all side projects, decided to kill WeWhyNot, pause EerlijkBod, focus on VvE Digitaal
- Built facturen page (create, bulk, email send, mark paid, iDEAL link)
- Built betalingsoverzicht (payment matrix members x months)
- Built instellingen page (VvE details, IBAN, email, notifications)
- Rebuilt onboarding into 6-step wizard (VvE, units, financial, members, docs, done)
- Built Mollie iDEAL payment API routes + Resend email API with Dutch invoice template
- Created complete Supabase schema (16 tables, RLS, functions), deployed it
- Built VvEProvider context + useSupabaseData hook for progressive DB migration
- Wired leden, instellingen, dashboard, sidebar, header to Supabase
- Overhauled landing page (dashboard mockup, comparison table, social proof)
- Registered vveapp.com, configured Cloudflare DNS, deployed

### What's next (priority order)
1. Wire facturen page to Supabase (biggest remaining gap)
2. Wire financieel + documenten pages to Supabase
3. Set up Resend with verified vveapp.com domain for real emails
4. Set up Mollie for real iDEAL payments
5. Set up Stripe for own subscription billing (customers paying for platform)
6. Find first VvE customer (Hidde's own building?)
7. Document upload via Supabase Storage + AI PDF parsing

### Blockers
- Resend needs domain verification before real emails work
- Mollie needs account + API key for real iDEAL payments

## Key Reference Files
- `supabase/schema.sql` - Full database schema (16 tables, RLS, functions)
- `src/lib/vve-context.tsx` - VvE context provider (auth + VvE + member)
- `src/lib/use-supabase-data.ts` - Data hook with demo fallback
- `src/lib/services/supabase-db.ts` - Full Supabase service layer
- `src/app/dashboard/facturen/page.tsx` - Invoice management (largest page)
- `.env.local` - All API keys (Supabase, Resend, Mollie)

## Quick Commands
```bash
cd /c/Users/hidde/_claude/vve-platform/app
npm run dev                    # Local dev
npm run build                  # Verify build
npx vercel --prod --yes        # Deploy to production
curl -s -o /dev/null -w "%{http_code}" https://vveapp.com  # Check live
```
