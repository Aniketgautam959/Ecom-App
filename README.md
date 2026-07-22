# Oknitech E-Commerce

A white-label, single-vendor e-commerce platform built with **Laravel** (backend API + Bootstrap admin) and **Next.js** (frontend).

- **LaraBackend** — Laravel 11 application. Provides REST API, admin panel, Razorpay payments, Delhivery shipping, notifications, and CRUD modules.
- **NextUI** — Next.js 16 app. Server-side rendered storefront with Tailwind CSS, React Context for auth/cart/wishlist/currency, and Razorpay checkout.
- **Docker** — Docker Compose files for local development and production.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.2+, Laravel 11, Laravel Sanctum |
| Admin UI | Bootstrap 5 + SB Admin template |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Database | MySQL 8 (default) or SQLite |
| Cache | File / Redis / Database |
| Payments | Razorpay (PayPal/Stripe configured but optional) |
| Shipping | Delhivery API integration |

---

## Repository Layout

```
oknitech-ecom/
├── LaraBackend/          # Laravel API + admin
│   ├── app/Http/Controllers/Api/   # Customer API controllers
│   ├── app/Http/Controllers/Admin/ # Admin CRUD controllers
│   ├── app/Models/                 # Eloquent models
│   ├── app/Services/               # Business logic (Razorpay, Delhivery)
│   ├── database/migrations/        # All migrations
│   ├── resources/views/admin/      # Admin Blade views
│   └── routes/                     # api.php, admin-auth.php, web.php
├── NextUI/               # Next.js storefront
│   ├── app/                        # App router pages
│   ├── components/                 # Reusable UI components
│   ├── context/                    # Auth/Cart/Wishlist/Currency providers
│   └── lib/                        # API clients and helpers
├── docker/               # Nginx configs
├── docker-compose.yml    # Production Docker setup
├── docker-compose.local.yml # Local Docker setup
└── README.md             # This file
```

---

## What Is Included

### Customer Storefront (NextUI)

- Home, Shop, Products, Categories, Brands, Search
- Product detail with variants (sizes/colors), gallery, video, reviews
- Cart, Checkout (COD + Razorpay), Order success/failure pages
- Authentication: Login, Register, Forgot/Reset Password
- Account: Profile, Addresses, My Orders, Order Details, Wishlist, Notifications
- Static pages: About, FAQ, Contact, Privacy Policy, Terms & Conditions

### Customer API (LaraBackend)

- `/api/auth/*` — register, login, logout, forgot/reset password
- `/api/me` — profile, password change
- `/api/products` — listing, search, filters, related, latest
- `/api/categories`, `/api/brands` — listing and detail
- `/api/cart` — add/update/remove/clear
- `/api/checkout/summary` — calculate totals before placing order
- `/api/orders` — place, list, show, cancel, track
- `/api/addresses` — CRUD and default address
- `/api/wishlist` — add/remove/list
- `/api/coupon/validate` — apply coupon
- `/api/razorpay/*` — order, verify, failed, webhook
- `/api/delhivery/*` — serviceability, track, create shipment
- `/api/notifications` — list and mark read
- `/api/pages`, `/api/banners`, `/api/menus` — CMS content

### Admin Panel (LaraBackend)

Accessible at `/admin/login`.

- Dashboard
- Catalog: Products, Categories, Brands
- Sales: Orders, Customers, Coupons, Shipping Methods, Reports
- Engagement: Banners, Menus, Reviews, Notifications, CMS Pages
- Configuration: Payment Gateways, Taxes, Roles & Permissions, Settings, Audit Logs

Each module has CRUD, search/filter, pagination, status toggle, and bulk actions.

---

## Quick Start (Local)

### Requirements

- PHP 8.2+ with `mbstring`, `pdo_mysql`, `openssl`, `xml`, `curl`, `zip`, `gd` extensions
- Composer
- Node.js 20+ and npm
- MySQL 8 (or MariaDB)
- (Optional) Redis

### 1. Backend Setup

```bash
cd LaraBackend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create the database `app_db` in MySQL first, then run migrations
php artisan migrate

# (Optional) Seed default data
php artisan db:seed

# Create storage symlink for uploaded files
php artisan storage:link

# Start the dev server
php artisan serve
```

Backend API: `http://127.0.0.1:8000/api`

Admin panel: `http://127.0.0.1:8000/admin`

### 2. Frontend Setup

```bash
cd NextUI

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the dev server
npm run dev
```

Frontend: `http://localhost:3000`

### 3. Production Build

```bash
cd NextUI
npm run build
npm start
```

---

## Environment Variables

### LaraBackend `.env`

Required keys:

```bash
APP_NAME="Oknitech Ecom"
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=app_db
DB_USERNAME=app_user
DB_PASSWORD=

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000

# Payment: Razorpay
RAZORPAY_KEY=rzp_test_...
RAZORPAY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Shipping: Delhivery
DELHIVERY_API_KEY=
DELHIVERY_API_URL=https://track.delhivery.com
DELHIVERY_PICKUP_LOCATION=Primary
DELHIVERY_SHIPPER_NAME=
DELHIVERY_SHIPPER_ADDRESS=
DELHIVERY_SHIPPER_CITY=
DELHIVERY_SHIPPER_STATE=
DELHIVERY_SHIPPER_PIN=
DELHIVERY_SHIPPER_PHONE=
```

### NextUI `.env.local`

```bash
NEXT_PUBLIC_APP_NAME=Oknitech Ecom
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
LARAVEL_INTERNAL_URL=http://127.0.0.1:8000
NEXT_PUBLIC_LARAVEL_ORIGIN=http://127.0.0.1:8000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_...
```

> **Never put Razorpay secret or webhook secret in NextUI `.env.local`.** Those live only in `LaraBackend/.env`.

---

## Docker (Full Stack)

### Local Development

```bash
docker compose -f docker-compose.local.yml up --build
```

- Frontend: `http://localhost`
- Backend API: `http://localhost/api`
- Admin: `http://localhost/admin`
- MySQL runs inside Docker with DB `app_db`, user `app_user`, password `secret`

After the containers start, run migrations once:

```bash
docker exec -it app_api php artisan migrate
```

### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

## First Admin User

If no admin exists, register one at `/admin/register` (local only), then log in at `/admin/login`.

---

## Common Commands

```bash
# Laravel
cd LaraBackend
php artisan migrate:fresh --seed   # reset DB and seed
php artisan route:cache
php artisan view:cache
php artisan config:cache
php artisan storage:link

# Next.js
cd NextUI
npm run dev
npm run build
npm run start
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Access to /api` blocked by CORS | Update `FRONTEND_URL` in `LaraBackend/.env` and clear config cache: `php artisan config:clear` |
| Images uploaded in admin not showing | Run `php artisan storage:link` inside the Laravel directory |
| Razorpay checkout not loading | Check `NEXT_PUBLIC_RAZORPAY_KEY` in NextUI and `RAZORPAY_SECRET` in Laravel `.env` |
| Disk full during build | Remove `NextUI/.next` and `node_modules/.cache`, then rebuild |
| Database connection refused | Ensure MySQL is running and `DB_HOST`/`DB_PORT`/`DB_DATABASE` are correct |

---

## Notes

- Product images are stored in `LaraBackend/storage/app/public` and served via `/storage`.
- Admin activity logs and audit logs are implemented for tracking important admin actions.
- The platform is built to be white-label: change `NEXT_PUBLIC_APP_NAME` and `APP_NAME` to rebrand.

---

*Last updated: July 15, 2026*
