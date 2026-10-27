# BusinessOS Nigeria — MVP starter

A responsive React + Vite prototype for a configurable Nigerian small-business management app.

## Included
- Responsive sidebar/dashboard layout
- Business profile setup that adapts to restaurant/bar, retail, supermarket, pharmacy, salon and other business types
- Sample performance metrics and illustrative chart
- Inventory/product CRUD (add and delete)
- Record sales with stock deduction and stock validation
- Record expenses
- Customer directory
- CSV export of sales
- Rule-based business tips (not an AI integration)
- Local browser persistence with `localStorage`
- Settings and reset of sample data

## Run locally (Windows)
1. Install Node.js LTS from https://nodejs.org if it is not installed.
2. Extract this ZIP.
3. Open the extracted `businessos-nigeria` folder in VS Code.
4. Open Terminal → New Terminal.
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. Open the local URL Vite prints (usually `http://localhost:5173`).

## Important MVP limitations
This is a frontend demo, not yet production SaaS. Records are stored only in the current browser. It has no real login, backend API, cloud database, backups, multi-tenant isolation, real AI integration, supplier workflow, payroll, accounting/tax engine, or payment processing. Do not use it for sensitive or business-critical live records.

## Recommended production path
- Frontend: React + Vite (or Next.js if SEO/server-rendering becomes important)
- Backend: FastAPI on Railway
- Database: PostgreSQL
- Authentication: secure server-side sessions or a reputable auth provider
- Tenant isolation: every business-owned record must be scoped to a business/tenant ID and authorized server-side
- Security: validation, audit logs, backups, rate limits, least-privilege staff roles, secure secrets, and automated tests
- Integrations: add AI, payment, invoicing and messaging providers only through server-side endpoints

## GitHub
Create an empty repository named `businessos-nigeria`, then push the project:
```bash
git init
git add .
git commit -m "Initial BusinessOS Nigeria MVP"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/businessos-nigeria.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username. Do not commit API keys or `.env` files.
