
# TMDB-FULLSTACK

Monorepo: **backend (NestJS)** + **frontend (Next.js)** — muestra películas (TMDB), cache con Redis, Prisma, tests con Jest.

---

## Tech

* Backend: NestJS, Prisma, Redis, Jest
* Frontend: Next.js, Tailwind, Material-UI, SWR, `next/image`

---

## Quickstart (mínimo)

Clonar:

```bash
git clone https://github.com/tu-usuario/tmdb-fullstack.git
cd tmdb-fullstack
```

Levantar servicios opcionales (Postgres + Redis):

```bash
docker compose up -d
```

Backend:

```bash
cd backend
cp .env.example .env     # poner TMDB_API_KEY y DATABASE_URL
pnpm install
npx prisma generate
npx prisma migrate dev --name init   # si usas Postgres
pnpm run start:dev                    # http://localhost:3001
```

Frontend:

```bash
cd frontend
cp .env.example .env     # ajustar NEXT_PUBLIC_API_URL
pnpm install
pnpm run dev                          # http://localhost:3000
```

---

## Tests

```bash
# backend
cd backend
pnpm run test

# frontend
cd frontend
pnpm run test
```

---

## Notas

* Añadir `image.tmdb.org` en `frontend/next.config.js` para `next/image`.
* No subir `.env`; usa `.env.example`.
* Ejecuta `npx prisma generate` tras cambiar `schema.prisma`.

---

