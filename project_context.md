# Project Structure

```
ProjectOdyssey/
    .gitignore
    package.json
    README.md
    client/
        odyssey/
            .env.local
            .gitignore
            eslint.config.mjs
            next-env.d.ts
            next.config.ts
            package.json
            postcss.config.mjs
            README.md
            tailwind.config.ts
            tsconfig.json
            app/
                favicon.ico
                globals.css
                landingPage.css
                layout.tsx
                page.tsx
                components/
                    ClusteringView.tsx
                    ConfirmationModal.tsx
                    LocationModal.tsx
                    MapComponent.tsx
                    MultiOptionSelector.tsx
                dashboard/
                    page.tsx
                destinations/
                    page.tsx
                login/
                    page.tsx
                planner/
                    page.tsx
                profile/
                    page.tsx
                signup/
                    landingPage.css
                    page.tsx
            public/
                Cabrion-Black.ttf
                cover.png
                dashboard-bg.jpg
                file.svg
                globe.svg
                next.svg
                Odyssey_Logo.png
                vercel.svg
                window.svg
            resource/
                login/
                    dashboard1.html
                    landingpage.txt
                    login.html
                    Odyssey_Logo.png
                    signup.html
    server/
        .env
        .env.local
        old.env
        package.json
        scripts/
            test-ai.js
        src/
            server.js
            config/
                db.js
                supabaseClient.js
            middleware/
                authMiddleware.js
            models/
                Itinerary.js
                User.js
            repositories/
                places.repo.js
            routes/
                ai.routes.js
                auth.js
                clustering.routes.js
                placeRoutes.js
                protected.js
                tripRoutes.js
            services/
                placeService.js
                ai/
                    geminiClient.js
                    intent.js
                    validate.js
                    prompts/
                        clustering.prompt.js
                        itinerary.prompt.js
                        multiItinerary.prompt.js
                        search.prompt.js
```

# File Contents

## File: package.json
```json
{
  "dependencies": {
    "node-fetch": "^3.3.2"
  }
}

```

## File: README.md
```md
# ProjectOdyssey

```

## File: client\odyssey\eslint.config.mjs
```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

## File: client\odyssey\next-env.d.ts
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

## File: client\odyssey\next.config.ts
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

## File: client\odyssey\package.json
```json
{
  "name": "odyssey",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@vis.gl/react-google-maps": "^1.7.1",
    "next": "^16.0.10",
    "nodemon": "^3.1.11",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/json5": "^0.0.30",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.23",
    "eslint": "^9",
    "eslint-config-next": "16.0.7",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "5.9.3"
  }
}

```

## File: client\odyssey\postcss.config.mjs
```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

## File: client\odyssey\README.md
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

## File: client\odyssey\tailwind.config.ts
```ts
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         odyssey: ['"Playfair Display"', 'serif'],
//         body: ['Manrope', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// };


import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        odyssey: ['"Playfair Display"', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#FFF5E9', // Your custom background color
        }
      }
    },
  },
  plugins: [],
};
export default config;
```

## File: client\odyssey\tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
, "tailwind.config.js"  ],
  "exclude": [
    "node_modules"
  ]
} 


```

## File: client\odyssey\app\globals.css
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom global styles here */

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

## File: client\odyssey\app\landingPage.css
```css
/* ----------------- Reset & Base ----------------- */
/* * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
} */

body {
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #FFF4E8;
    color: #111;
}

/* ----------------- Layout ----------------- */
.header {
    max-width: 1200px;
    margin: auto;
    padding: 32px;
}

/* ----------------- First Section (Hero) ----------------- */
.first {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    margin-top: 40px;
}

/* Text */
#text {
    max-width: 520px;
}

#text h1 {
    font-size: 56px;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
}

#text p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 28px;
}

/* Buttons */
.btn {
    padding: 12px 22px;
    border-radius: 12px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 12px;
}

#travel {
    background-color: #2FB36D;
    color: #000;
}
#travel:hover{
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(47, 179, 109, 0.35);
}
#learn {
    background-color: #111;
    color: #fff;
}
#learn:hover{
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0,0,0, 0.35);
}
/* Image */
#travelIMG img {
    border-radius: 10px;
    width: 520px;
    max-width: 100%;
}

/* ----------------- Second Section (Features) ----------------- */
.second {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 80px;
}

/* Feature Box */
.box {
    background-color: #fff;
    padding: 24px;
    border-radius: 16px;
    min-height: 140px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

/* ----------------- Responsive ----------------- */
@media (max-width: 900px) {
    .first {
        flex-direction: column;
        text-align: center;
    }

    #text h1 {
        font-size: 42px;
    }

    .second {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    .second {
        grid-template-columns: 1fr;
    }
}
/* ---------------- Navbar (Sticky + Glassmorphic) ---------------- */
.navbar {
    position: sticky;
    top: 16px;
    z-index: 1000;

    -webkit-backdrop-filter: blur(14px);
    background: rgba(245, 239, 230, 0.30);
    backdrop-filter: blur(9px);

    border-radius: 18px;
    padding: 14px 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    max-width: 1200px;
    margin: 20px auto;

    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Left logo */
.nav-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 18px;
}

/* Right links */
.nav-right {
    display: flex;
    align-items: center;
    gap: 28px;
}

.nav-right a {
    text-decoration: none;
    color: #111;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    transition: opacity 0.2s ease;
}

.nav-right a:hover {
    opacity: 0.7;
}

/* Active underline */
.nav-right a.active::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #111;
    left: 0;
    bottom: -6px;
}

/* Sign-in button */
.signin-btn {
    background-color: #2FB36D;
    border: none;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.signin-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(47, 179, 109, 0.35);
}
/* ---------------- Feature Section ---------------- */
.second {
    margin-top: 80px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
}

/* Base card */
.box {
    padding: 26px 28px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.05);
    min-height: 150px;
}

/* Card text */
.box h3 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
}

.box p {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
}

/* Pastel backgrounds */
.box.ai {
    background: linear-gradient(135deg, #FFF1E8, #FFE7DA);
}

.box.routes {
    background: linear-gradient(135deg, #FFF8DC, #FFF1B8);
}

.box.explore {
    background: linear-gradient(135deg, #F5F5F5, #EEEEEE);
}

.box.memory {
    background: linear-gradient(135deg, #FFF6E3, #FFEBC0);
}

.box.community {
    background: linear-gradient(135deg, #F7F7F7, #EFEFEF);
}

.box.budget {
    background: linear-gradient(135deg, #FFF0E8, #FFE2D6);
}

/* ---------------- Responsive ---------------- */
@media (max-width: 900px) {
    .second {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    .second {
        grid-template-columns: 1fr;
    }
}
.third{
    background-color: #000;
    margin-top: 80px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    width: 100%;
}
.sec{
    text-align: center;
    color: #EEEEEE;
    padding: 26px 28px;
    min-height: 150px;
}
.sec h3{
    font-size: 4.5rem;
}
.sec p{
    font-size: 1.5rem;
}

.four {
    background-color: white;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; /* CENTER everything horizontally */
    gap: 12px;
}

/* Title text spacing */
.four h1 {
    font-size: 36px;
}

.four p {
    color: #555;
    margin-bottom: 24px;
}

/* Number circle */
.four h2 {
    width: 3rem;
    height: 3rem;
    background-color: #d9d9d9;
    border-radius: 50%;

    display: flex;              /* CENTER number inside circle */
    align-items: center;
    justify-content: center;

    font-size: 18px;
    font-weight: 600;
}

/* Description text */
.four h4 {
    max-width: 600px;           /* Responsive width */
    color: #333;
    line-height: 1.6;
    margin-bottom: 24px;
}
.five{
    text-align: center;
    background-color: white;
    display: flex;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.start-btn {
    background-color: #2FB36D;
    border: none;
    padding: 8px 18px;
    border-radius: 999px;
    margin: 2%;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.start-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(47, 179, 109, 0.35);
}
.plan{
    width: 600px;  
    max-height: 400px;  
    border-radius: 15px;
    background-color: #FFF4E8;
    padding: 10px;
}
.five h3{
    margin: 5px;
}
.six{
    background-color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 1.3rem;
}
.pad{
    background-color: white;
    padding-top: 80px;
}
```

## File: client\odyssey\app\layout.tsx
```tsx
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import "./globals.css";

// Load fonts with CSS variables for easy usage
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Odyssey Travel App",
  description: "Plan your perfect trips with AI-powered itineraries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Manrope:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

```

## File: client\odyssey\app\page.tsx
```tsx
"use client"; // Make it a client component for interactivity

import React from "react";
import Link from "next/link";
import "./landingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              {/* Ensure this path points to your public folder */}
              <img 
                src="/Odyssey_Logo.png" 
                alt="Odyssey Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-xl sm:text-2xl font-medium font-odyssey tracking-wider">
              Odyssey
            </span>
          </div>

        <div className="nav-right">
          <a className="active" href="#">About</a>
          <a href="#">Destinations</a>
          <a href="#">Pricing</a>
          {/* Sign-in navigates to /login */}
          <Link href="/login">
            <button className="signin-btn">Sign-in</button>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="header">
        <div className="first">
          <div id="text">
            <h1>Your Journey, <br /> Unified</h1>
            <p>
              Simplify trip organization with intuitive planning tools and connect with a vibrant
              community of travelers. Powered by AI for personalized itineraries and optimized
              routes.
            </p>
            <br />
            <button className="btn" id="travel">Start Planning Now</button>
            <button className="btn" id="learn">Learn more</button>
          </div>
          <div id="travelIMG">
            <img src="/cover.png" alt="Travel Cover" />
          </div>
        </div>

        {/* Features */}
        <div className="second">
          <div className="box ai">
            <h3>✨ AI Assistant</h3>
            <p>Personalized itineraries generated in seconds</p>
          </div>

          <div className="box routes">
            <h3>🗺️ Smart Routes</h3>
            <p>
              AI-powered route optimization that saves time and money,
              ensuring you visit attractions in the most efficient sequence.
            </p>
          </div>

          <div className="box explore">
            <h3>🌍 Discover and Explore</h3>
            <p>
              Browse destinations categorized by <strong>Nature</strong>,
              <strong>Urban Lifestyle</strong>, and <strong>History & Museums</strong> to find your
              perfect adventure.
            </p>
          </div>

          <div className="box memory">
            <h3>📸 Memory Lane</h3>
            <p>
              Automatically chronicle your travel history with a beautiful timeline of all the places
              you've visited.
            </p>
          </div>

          <div className="box community">
            <h3>👥 Community</h3>
            <p>Connect with travelers worldwide</p>
          </div>

          <div className="box budget">
            <h3>💰 Budget Estimates</h3>
            <p>
              Get accurate cost estimates for transportation, accommodation, and activities before
              you book.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="third">
        <div className="sec">
          <h3>120K+</h3>
          <p>Happy Travellers</p>
        </div>

        <div className="sec">
          <h3>500K+</h3>
          <p>Destinations</p>
        </div>

        <div className="sec">
          <h3>10K+</h3>
          <p>Shared itineraries</p>
        </div>

        <div className="sec">
          <h3>5K+</h3>
          <p>New users daily</p>
        </div>
      </div>

      {/* How it works */}
      <div className="pad">
        <div className="four">
          <h1>How It Works</h1>
          <p>Start your journey in three simple steps</p>
          <h2>1</h2>
          <h4>Search for your target destination and browse through our curated selection of attractions</h4>
          <h2>2</h2>
          <h4>Use our AI assistant or manual planner to create the perfect itinerary with optimized routes and estimated costs</h4>
          <h2>3</h2>
          <h4>Share your journey with the community and discover hidden gems from fellow travelers.</h4>
        </div>
      </div>

      {/* Call to action */}
      <div className="pad">
        <div className="five">
          <div className="plan">
            <h3>Ready to Start Your Adventure?</h3>
            <p>Join thousands of travelers planning their perfect trips</p>
            <button className="start-btn">Start Planning Now</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pad">
        <div className="six">
          <h6>©Odyssey. Made with ❤️ by Route6</h6>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

```

## File: client\odyssey\app\components\ClusteringView.tsx
```tsx
"use client";

import { useState } from "react";

type Cluster = {
  clusterName: string;
  description: string;
  suggestedDays: number;
  places: {
    name: string;
    category: string;
    reasoning: string;
    estimatedVisitHours: number;
    estimatedCost: number;
  }[];
};

type ClusteringData = {
  overallReasoning: string;
  recommendedDuration: number;
  clusters: Cluster[];
};

type ClusteringViewProps = {
  data: ClusteringData;
  loading?: boolean;
  onContinue: (selectedPlaces: any[]) => void;
};

export default function ClusteringView({
  data,
  loading = false,
  onContinue,
}: ClusteringViewProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  const togglePlace = (placeName: string) => {
    const newSelected = new Set(selectedPlaces);
    if (newSelected.has(placeName)) {
      newSelected.delete(placeName);
    } else {
      newSelected.add(placeName);
    }
    setSelectedPlaces(newSelected);
  };

  const handleContinue = () => {
    // Convert selected places back to array format
    const selected = Array.from(selectedPlaces).map((name) => {
      // Find the place in clusters to get full details
      for (const cluster of data.clusters) {
        const place = cluster.places.find((p) => p.name === name);
        if (place) {
          return {
            name: place.name,
            category: place.category,
            estimatedCost: place.estimatedCost,
            estimatedVisitHours: place.estimatedVisitHours,
          };
        }
      }
      return { name };
    });

    onContinue(selected);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
        <p>Odyssey is analyzing destinations...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "12px" }}>
      {/* Overall Reasoning */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", color: "#1f2937" }}>
          ✨ Trip Overview
        </h3>
        <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.6" }}>
          {data.overallReasoning}
        </p>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "8px" }}>
          Recommended Duration: <strong>{data.recommendedDuration} days</strong>
        </p>
      </div>

      {/* Clusters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {data.clusters.map((cluster, clusterIdx) => (
          <div
            key={clusterIdx}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {/* Cluster Header */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1f2937", marginBottom: "4px" }}>
                📍 {cluster.clusterName}
              </h4>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                {cluster.description}
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                Suggested: <strong>{cluster.suggestedDays} day(s)</strong>
              </p>
            </div>

            {/* Places in Cluster */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cluster.places.map((place, placeIdx) => {
                const isSelected = selectedPlaces.has(place.name);
                return (
                  <div
                    key={placeIdx}
                    onClick={() => togglePlace(place.name)}
                    style={{
                      padding: "12px",
                      background: isSelected ? "#f0f9ff" : "#f3f4f6",
                      border: isSelected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Controlled by parent onClick
                      style={{
                        marginTop: "3px",
                        cursor: "pointer",
                        width: "18px",
                        height: "18px",
                        accentColor: "#3b82f6",
                      }}
                    />

                    {/* Place Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 600, color: "#1f2937", fontSize: "14px" }}>
                          {place.name}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            background: "#e0e7ff",
                            color: "#4f46e5",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            textTransform: "capitalize",
                          }}
                        >
                          {place.category}
                        </span>
                      </div>

                      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                        {place.reasoning}
                      </p>

                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#9ca3af" }}>
                        <span>⏱️ {place.estimatedVisitHours}h</span>
                        <span>💰 ${place.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <button
          onClick={handleContinue}
          disabled={selectedPlaces.size === 0}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: selectedPlaces.size === 0 ? "#d1d5db" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: selectedPlaces.size === 0 ? "not-allowed" : "pointer",
            fontSize: "14px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (selectedPlaces.size > 0) {
              (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedPlaces.size > 0) {
              (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
            }
          }}
        >
          Generate {selectedPlaces.size > 0 ? `${selectedPlaces.size} Place${selectedPlaces.size > 1 ? "s" : ""}` : "Places"} →
        </button>
      </div>
    </div>
  );
}

```

## File: client\odyssey\app\components\ConfirmationModal.tsx
```tsx
"use client";

import { useState } from "react";

type ScheduleItem = {
  placeId: string | null;
  name: string;
  category: string;
  time: string;
  timeRange: string;
  visitDurationMin: number;
  notes: string;
};

type ScheduleDay = {
  day: number;
  date: string;
  items: ScheduleItem[];
};

type SelectedItinerary = {
  id: string;
  title: string;
  description: string;
  paceDescription: string;
  estimatedCost: number;
  schedule: ScheduleDay[];
};

type ConfirmationModalProps = {
  isOpen: boolean;
  itinerary: SelectedItinerary | null;
  tripName: string;
  onConfirm: (finalTripName: string) => void;
  onClose: () => void;
  onEdit?: () => void;
  saving?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  itinerary,
  tripName,
  onConfirm,
  onClose,
  onEdit,
  saving = false,
}: ConfirmationModalProps) {
  const [tripNameInput, setTripNameInput] = useState(tripName || "My Trip");

  if (!isOpen || !itinerary) return null;

  const handleConfirm = () => {
    onConfirm(tripNameInput);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          maxHeight: "90vh",
          maxWidth: "600px",
          width: "90%",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
      {/* Modal Header */}
      <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937", marginBottom: "4px" }}>
          📋 Confirm Your Itinerary
        </h2>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>
          Review and confirm your trip before saving
        </p>
      </div>

      {/* Modal Body */}
      <div style={{ padding: "20px" }}>
        {/* Trip Name Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#1f2937", display: "block", marginBottom: "6px" }}>
            Trip Name
          </label>
          <input
            type="text"
            value={tripNameInput}
            onChange={(e) => setTripNameInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
            placeholder="Enter trip name"
          />
        </div>

        {/* Itinerary Summary */}
        <div style={{ marginBottom: "20px", padding: "16px", background: "#f3f4f6", borderRadius: "8px" }}>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
            {itinerary.title}
          </h4>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", lineHeight: "1.5" }}>
            {itinerary.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>Duration</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                {itinerary.schedule.length} days
              </p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>Cost</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#3b82f6" }}>
                ${itinerary.estimatedCost.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>Pace</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#1f2937" }}>
                {itinerary.paceDescription.split(",")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Full Schedule */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937", marginBottom: "12px" }}>
            📅 Full Schedule
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {itinerary.schedule.map((day) => (
              <div
                key={day.day}
                style={{
                  padding: "12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#1f2937" }}>
                    Day {day.day} • {day.date}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {day.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        padding: "8px",
                        background: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#1f2937",
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            background: "#fef3c7",
                            color: "#92400e",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.time}
                        </span>
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                          {item.timeRange}
                        </span>
                      </div>
                      <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                        ⏱️ {item.visitDurationMin}m • {item.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Footer - Actions */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #e5e7eb",
          background: "#f9fafb",
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onClose}
          disabled={saving}
          style={{
            padding: "10px 16px",
            background: "#f3f4f6",
            color: "#6b7280",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
          }}
        >
          ← Cancel
        </button>

        {onEdit && (
          <button
            onClick={onEdit}
            disabled={saving}
            style={{
              padding: "10px 16px",
              background: "#fef3c7",
              color: "#92400e",
              border: "1px solid #fcd34d",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.5 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "#fde68a";
            }}
            onMouseLeave={(e) => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "#fef3c7";
            }}
          >
            ✏️ Edit & Regenerate
          </button>
        )}

        <button
          onClick={handleConfirm}
          disabled={saving || !tripNameInput.trim()}
          style={{
            padding: "10px 16px",
            background:
              saving || !tripNameInput.trim() ? "#d1d5db" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: saving || !tripNameInput.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!saving && tripNameInput.trim()) {
              (e.currentTarget as HTMLButtonElement).style.background = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!saving && tripNameInput.trim()) {
              (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
            }
          }}
        >
          {saving ? "Saving..." : "✓ Confirm & Save"}
        </button>
      </div>
      </div>
      </>
    );
}

```

## File: client\odyssey\app\components\LocationModal.tsx
```tsx
"use client";
import React, { useState } from "react";

export default function LocationModal({ isOpen, onClose, data }: any) {
  const [imgIndex, setImgIndex] = useState(0);

  if (!isOpen || !data) return null;

  // Fallbacks for data fields to prevent crashes
  const images = data.images && data.images.length > 0 ? data.images : ["/dashboard-bg.jpg"];
  const description = data.description || `Experience the beauty of ${data.name}. Perfect for a ${data.category || 'relaxed'} trip.`;
  const reviews = data.reviews || [
    { user: "Alex", rating: 5, comment: "Absolutely loved it!" },
    { user: "Sam", rating: 4, comment: "Great spot, but busy." }
  ];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
    }} onClick={onClose}>
      <div style={{
        backgroundColor: "white", width: "90%", maxWidth: "900px", height: "80vh",
        borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column",
        position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px", zIndex: 10,
          background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%",
          width: "32px", height: "32px", cursor: "pointer", fontWeight: "bold"
        }}>✕</button>

        {/* Top: Image Carousel */}
        <div style={{ height: "45%", position: "relative", background: "#f3f4f6" }}>
          <img src={images[imgIndex]} alt={data.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
            {imgIndex + 1} / {images.length}
          </div>
        </div>

        {/* Bottom: Content Split */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left: Info */}
          <div style={{ width: "50%", padding: "32px", borderRight: "1px solid #e5e7eb", overflowY: "auto" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", fontFamily: "Playfair Display, serif" }}>{data.name}</h2>
            <span style={{ background: "#ffedd5", color: "#9a3412", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
              {data.category || "Destination"}
            </span>
            <p style={{ marginTop: "20px", lineHeight: "1.6", color: "#4b5563" }}>{description}</p>
            <div style={{ marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
              ⏱ Suggested time: {data.visitDurationMin || 60} mins
            </div>
          </div>

          {/* Right: Reviews */}
          <div style={{ width: "50%", padding: "32px", background: "#f9fafb", overflowY: "auto" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Traveler Reviews</h3>
            {reviews.map((rev: any, i: number) => (
              <div key={i} style={{ background: "white", padding: "16px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>{rev.user}</span>
                  <span style={{ color: "#eab308", fontSize: "12px" }}>{"★".repeat(rev.rating)}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#4b5563" }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: client\odyssey\app\components\MapComponent.tsx
```tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

type MapComponentProps = {
  items: any[]; // items from left-column itinerary
  onClose?: () => void;
};

function Directions({ items }: { items: any[] }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || items.length < 2) {
      console.log("Directions: Not enough valid items or services not ready", { 
        itemsCount: items.length, 
        hasDirectionsService: !!directionsService,
        hasDirectionsRenderer: !!directionsRenderer
      });
      return;
    }

    // Filter valid locations
    const validItems = items.filter(item => item.placeId || item.name);
    console.log("Directions: Valid items for routing", validItems);
    
    if (validItems.length < 2) {
      console.log("Directions: Not enough valid items after filtering");
      return;
    }

    try {
      const origin = validItems[0].placeId ? { placeId: validItems[0].placeId } : { query: validItems[0].name };
      const destination = validItems[validItems.length - 1].placeId 
        ? { placeId: validItems[validItems.length - 1].placeId } 
        : { query: validItems[validItems.length - 1].name };
      
      const waypoints = validItems.slice(1, -1).map(item => ({
        location: item.placeId ? { placeId: item.placeId } : { query: item.name },
        stopover: true
      }));

      console.log("Directions: Making route request", { origin, destination, waypointsCount: waypoints.length });

      directionsService.route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING
      }).then(response => {
        console.log("Directions: Route received successfully", response);
        directionsRenderer.setDirections(response);
      }).catch(err => {
        console.error("Directions request failed", err);
      });
    } catch (err) {
      console.error("Directions: Error during route setup", err);
    }

    return () => {
      directionsRenderer.setMap(null); // Cleanup
    };
  }, [directionsService, directionsRenderer, items]);

  return null;
}

export default function MapComponent({ items, onClose }: MapComponentProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Filter items that have at least a name
  const validItems = useMemo(() => items.filter(i => i.name), [items]);
  
  // Calculate center (fallback if no items)
  const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris

  console.log("MapComponent Debug:", {
    itemsCount: items.length,
    validItemsCount: validItems.length,
    validItems: validItems
  });

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Places to See Route</h2>
          <p className="text-gray-600">
            Add places to your itinerary on the left to see the route on the map
          </p>
        </div>
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Your Route...</h2>
          <p className="text-gray-600">
            Processing your places...
          </p>
        </div>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
     return <div className="p-4 text-red-500">Error: Google Maps API Key is missing.</div>;
  }

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Header / Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold hover:bg-gray-100"
        >
          Close Map
        </button>
      </div>

      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker
          className="w-full h-full"
          fullscreenControl={false}
        >
           {/* Render Markers */}
           {validItems.map((item, index) => (
             <AdvancedMarkerWithRef
               key={item.id || index}
               item={item}
               index={index}
               onClick={() => setSelectedItem(item)}
             />
           ))}

           {/* Render Route */}
           <Directions items={validItems} />

           {/* Info Window */}
           {selectedItem && (
             <InfoWindow
               position={null} // AdvancedMarker handles position usually, but we need coordinates. 
               // Issue: If we use placeId, we don't have lat/lng immediately for InfoWindow anchor unless we geocode or use the marker anchor.
               // Workaround: simpler approach is to rely on marker click. 
               // Actually, InfoWindow in this library is tricky with just PlaceID.
               // Let's skip InfoWindow for V1 or try to anchor it to the marker if possible.
               // BETTER: Just show a card at the bottom of the screen?
               // Let's try standard InfoWindow if we have lat/lng? We might not.
               // For now, let's just log or show a simple overlay.
               onCloseClick={() => setSelectedItem(null)}
             >
               <div className="p-2">
                 <h3 className="font-bold">{selectedItem.name}</h3>
                 <p className="text-xs text-gray-500">{selectedItem.category}</p>
                 {selectedItem.visitDurationMin && (
                    <p className="text-xs">⏱ {selectedItem.visitDurationMin} min</p>
                 )}
               </div>
             </InfoWindow>
           )}
        </Map>
      </APIProvider>
    </div>
  );
}

// Separate component to handle Marker logic and geocoding if needed? 
// Actually, AdvancedMarker requires position {lat, lng}.
// If we only have PlaceID, we might need to fetch details or let DirectionsRenderer handle it.
// BUT, to show custom markers for ALL items (not just route points), we need positions.
// DirectionsRenderer shows markers by default, but we suppressed them to show custom ones?
// WAIT: DirectionsRenderer is easiest for V1. It handles PlaceIDs automatically.
// Let's UN-suppress markers in DirectionsRenderer for V1 if we only have PlaceIDs.
// However, the user wants "Interactivity".
// Strategy: 
// 1. Use DirectionsRenderer to show the route AND markers (easiest for PlaceID).
// 2. If we want custom markers, we'd need Geocoding Service to convert PlaceID -> LatLng.
// Let's stick to DirectionsRenderer markers for now, but maybe try to add click listeners?
// Actually, let's refine this:
// If we use DirectionsRenderer, it will put A, B, C markers. That is mostly sufficient for "Sequence".
// We can just rely on DirectionsRenderer for the visual map.

function AdvancedMarkerWithRef({ item, index, onClick }: any) {
    // If we don't have lat/lng, we can't render AdvancedMarker easily without looking it up.
    // We will skip rendering manual markers if we don't have coordinates, 
    // and rely on DirectionsRenderer to show the points.
    // IF the item has lat/lng (e.g. from Clustering/Database), we show it.
    
    // Check if we have standard lat/lng (some AI responses might fake it or database has it)
    // The `places` table has `location` (PostGIS), need to see if it's passed to frontend.
    // If not, we rely on DirectionsRenderer.
    
    if (item.lat && item.lng) {
        return (
            <AdvancedMarker position={{ lat: item.lat, lng: item.lng }} onClick={onClick}>
                <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
            </AdvancedMarker>
        );
    }
    return null;
}

```

## File: client\odyssey\app\components\MultiOptionSelector.tsx
```tsx
"use client";

import { useState } from "react";

type ScheduleItem = {
  placeId: string | null;
  name: string;
  category: string;
  time: string;
  timeRange: string;
  visitDurationMin: number;
  notes: string;
};

type ScheduleDay = {
  day: number;
  date: string;
  items: ScheduleItem[];
};

type Itinerary = {
  id: string;
  title: string;
  description: string;
  paceDescription: string;
  estimatedCost: number;
  schedule: ScheduleDay[];
};

type MultiOptionSelectorProps = {
  itineraries: Itinerary[];
  loading?: boolean;
  onSelect: (itinerary: Itinerary) => void;
  onBack?: () => void;
};

export default function MultiOptionSelector({
  itineraries,
  loading = false,
  onSelect,
  onBack,
}: MultiOptionSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
        <p>Odyssey is generating your options...</p>
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
        <p>No itineraries generated. Try again.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1f2937", marginBottom: "4px" }}>
          🎯 Choose Your Itinerary Style
        </h3>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>
          Select one of these 3 options, or edit places to regenerate
        </p>
      </div>

      {/* Itinerary Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: itineraries.length <= 2 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {itineraries.map((itinerary) => {
          const isHovered = hoveredId === itinerary.id;
          const totalDays = itinerary.schedule.length;
          const totalPlaces = itinerary.schedule.reduce((sum, day) => sum + day.items.length, 0);

          return (
            <div
              key={itinerary.id}
              onMouseEnter={() => setHoveredId(itinerary.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: isHovered ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                boxShadow: isHovered ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "all 0.3s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => onSelect(itinerary)}
            >
              {/* Card Header */}
              <div style={{ padding: "16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "4px" }}>
                  {itinerary.title}
                </h4>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>
                  {itinerary.paceDescription}
                </p>
              </div>

              {/* Card Body */}
              <div style={{ padding: "16px", flex: 1 }}>
                {/* Description */}
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", lineHeight: "1.5" }}>
                  {itinerary.description}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "2px" }}>Duration</p>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                      {totalDays} day{totalDays > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "2px" }}>Places</p>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                      {totalPlaces}
                    </p>
                  </div>
                </div>

                {/* Cost */}
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "2px" }}>Estimated Cost</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "#3b82f6" }}>
                    ${itinerary.estimatedCost.toLocaleString()}
                  </p>
                </div>

                {/* Sample Schedule Preview */}
                <div style={{ marginTop: "12px" }}>
                  <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px", fontWeight: 600 }}>
                    Sample Schedule:
                  </p>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {itinerary.schedule.slice(0, 2).map((day) => (
                      <div key={day.day} style={{ marginBottom: "6px" }}>
                        <span style={{ fontWeight: 600, color: "#1f2937" }}>Day {day.day}:</span>{" "}
                        {day.items.map((item) => item.name).join(" → ")}
                        {itinerary.schedule.length > 2 && day.day === 2 && <span>...</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer - Select Button */}
              <div
                style={{
                  padding: "12px 16px",
                  background: isHovered ? "#eff6ff" : "#f9fafb",
                  borderTop: "1px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: isHovered ? "#3b82f6" : "#e5e7eb",
                    color: isHovered ? "#fff" : "#6b7280",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = isHovered ? "#3b82f6" : "#e5e7eb";
                    (e.currentTarget as HTMLButtonElement).style.color = isHovered ? "#fff" : "#6b7280";
                  }}
                  onClick={() => onSelect(itinerary)}
                >
                  Select This Option →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            padding: "8px 12px",
            background: "#f3f4f6",
            color: "#6b7280",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

```

## File: client\odyssey\app\dashboard\page.tsx
```tsx
// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Types & Interfaces ---
interface TripCardProps {
  title: string;
  image: string;
}

interface RecommendationProps {
  title: string;
  image: string;
}

// --- Mock Data ---
const recentDrafts: TripCardProps[] = [
  {
    title: "Bali Trip",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=300&fit=crop"
  },
  {
    title: "Darjeeling Trip",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
  }
];

const recommendations: RecommendationProps[] = [
  {
    title: "Summer Vibes",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&h=300&fit=crop"
  },
  {
    title: "Winter Trips near you",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop"
  },
  {
    title: "Shopping this season",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop"
  },
  {
    title: "Safari",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop"
  }
];

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // --- PROTECTION LOGIC ---
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("token");
      
      // 1. Immediate check: No token? Go to login.
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 2. Verification check: Ask backend if token is valid
        // NOTE: Use the same IP/URL that worked for your login (e.g., localhost:4000 or your PC IP)
        const res = await fetch("http://localhost:4000/api/user/profile", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        // 3. If backend says error (401/403), the token is bad/expired
        if (!res.ok) {
          throw new Error("Invalid token");
        }

        // 4. Token is good! Load user data
        const data = await res.json();
        setUser(data.user);
        
        // Optional: Update local storage with fresh user data
        localStorage.setItem("user", JSON.stringify(data.user));

      } catch (err) {
        console.error("Session expired:", err);
        alert("session expired, please login again");
        // 5. CRITICAL: Wipe storage so Login page doesn't bounce us back
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [router]);

  // Prevent flash of content while checking auth
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF5E9]">Loading Odyssey...</div>;
  }

  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">
      {/* --- Navigation --- */}
      <nav className="sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              {/* Ensure this path points to your public folder */}
              <img 
                src="/Odyssey_Logo.png" 
                alt="Odyssey Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-xl sm:text-2xl font-medium font-odyssey tracking-wider">
              Odyssey
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a href="#" className="text-gray-900 font-semibold underline">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black hover:font-bold transition-all">Planner</a>
            <a href="#" className="text-black hover:font-bold transition-all">My Trips</a>
            <a href="#" className="text-black hover:font-bold transition-all">Saved places</a>
            <a href="#" className="text-black hover:font-bold transition-all">Co-Travellers</a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <button onClick={() => router.push("/profile")} className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-3 mt-4 md:hidden pb-2">
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Home</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Planner</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">My Trips</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Saved places</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Co-Travellers</a>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Hero Section with Search */}
        <div className="relative mb-12 rounded-3xl overflow-hidden h-64 sm:h-96 shadow-xl">
            {/* Ensure this path points to your public folder */}
          <img 
            src="dashboard-bg.jpg" 
            alt="Travel" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-full max-w-xl px-4">
              <div className="flex items-center bg-gray-900 bg-opacity-70 rounded-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Search your next destination..."
                  className="flex-1 px-4 sm:px-6 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                />
                <button className="mt-2 mx-4 sm:mt-0 sm:ml-2 bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition flex items-center gap-1 mb-2 sm:mb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#F19E39">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Drafts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Drafts</h2>
          <div className="flex flex-wrap gap-4">
            {recentDrafts.map((draft, index) => (
              <div key={index} className="relative w-1/2 sm:w-40 h-32 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                <img src={draft.image} alt={draft.title} className="w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">{draft.title}</span>
              </div>
            ))}
            
            {/* 'Add New' Placeholder */}
            <div className="w-1/2 sm:w-40 h-32 rounded-2xl bg-gray-300 bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition shadow-lg">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-900">Recommended For You:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {recommendations.map((item, index) => (
              <div key={index} className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#3A3A3A] text-white rounded-2xl p-8 flex flex-col items-center justify-center h-52 shadow-xl">
            <h3 className="text-4xl font-bold mb-6 text-center">Check out what your Friends are doing!</h3>
            <button className="bg-gray-300 text-gray-800 px-8 py-3 rounded-full flex items-center justify-center hover:bg-gray-400 transition">
              <span className="font-bold text-2xl">→</span>
            </button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-[#ADC4CE] text-gray-900 rounded-2xl flex items-center justify-center shadow-xl h-32 sm:h-full">
              <h3 className="text-4xl font-bold">Share Pictures</h3>
            </div>
            <div className="bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl h-32 sm:h-full">
              <h3 className="text-4xl font-bold">Review a place</h3>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-gray-300 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-700">Your Timeline</h2>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-300 py-6 text-center mt-16">
        <p className="text-gray-800 text-sm">
          ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;

```

## File: client\odyssey\app\destinations\page.tsx
```tsx
// app/destinations/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types & Interfaces ---
interface DestinationCardProps {
  id: string;
  name: string;
  type: "COUNTRY" | "CITY" | "POI";
  image: string;
  description?: string;
}

interface TrendingDestination {
  name: string;
  type: "COUNTRY" | "CITY";
  slug: string;
  popularity: number;
}

// --- Mock Data ---
const recentSearches: DestinationCardProps[] = [
  {
    id: "1",
    name: "Bali",
    type: "CITY",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    description: "Island of the Gods"
  },
  {
    id: "2",
    name: "Bhutan",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    description: "Land of the Thunder Dragon"
  },
  {
    id: "3",
    name: "Santorini",
    type: "CITY",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop",
    description: "Greek Island Paradise"
  },
  {
    id: "4",
    name: "Dubai",
    type: "CITY",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    description: "City of Gold"
  }
];

const trendingDestinations: TrendingDestination[] = [
  { name: "Khulna", type: "CITY", slug: "khulna", popularity: 9500 },
  { name: "Tangail", type: "CITY", slug: "tangail", popularity: 9200 },
  { name: "Satkhira", type: "CITY", slug: "satkhira", popularity: 8900 },
  { name: "Sylhet", type: "CITY", slug: "sylhet", popularity: 8700 },
  { name: "Cox's Bazar", type: "CITY", slug: "coxs-bazar", popularity: 9800 },
  { name: "Rangamati", type: "CITY", slug: "rangamati", popularity: 8500 },
  { name: "Bandarban", type: "CITY", slug: "bandarban", popularity: 8300 },
  { name: "Chittagong", type: "CITY", slug: "chittagong", popularity: 9100 }
];

const popularCountries: DestinationCardProps[] = [
  {
    id: "c1",
    name: "Japan",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    description: "Land of the Rising Sun"
  },
  {
    id: "c2",
    name: "Italy",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop",
    description: "The Eternal Beauty"
  },
  {
    id: "c3",
    name: "Thailand",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&h=400&fit=crop",
    description: "Land of Smiles"
  },
  {
    id: "c4",
    name: "France",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    description: "Romance & Culture"
  },
  {
    id: "c5",
    name: "United States",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
    description: "Land of Opportunity"
  },
  {
    id: "c6",
    name: "Australia",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=400&fit=crop",
    description: "Down Under"
  }
];

const DestinationsPage: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DestinationCardProps[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showBrowseCountries, setShowBrowseCountries] = useState(false);

  // Simulate search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, this would be an API call
      const mockResults: DestinationCardProps[] = [
        {
          id: "search-1",
          name: searchQuery,
          type: "CITY",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">
      {/* --- Navigation --- */}
      <nav className="sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <img 
                src="/Odyssey_Logo.png" 
                alt="Odyssey Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-xl sm:text-2xl font-medium font-odyssey tracking-wider">
              Odyssey
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a onClick={() => router.push("/dashboard")} className="text-black hover:font-bold transition-all cursor-pointer">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black hover:font-bold transition-all cursor-pointer">Planner</a>
            <a href="#" className="text-black hover:font-bold transition-all">My Trips</a>
            <a href="#" className="text-gray-900 font-semibold underline">Destinations</a>
            <a href="#" className="text-black hover:font-bold transition-all">Co-Travellers</a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <button onClick={() => router.push("/profile")} className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-3 mt-4 md:hidden pb-2">
            <a onClick={() => router.push("/dashboard")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Planner</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">My Trips</a>
            <a href="#" className="text-black font-bold pl-2">Destinations</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Co-Travellers</a>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Hero Search Section */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto">
            <div className="flex items-center bg-gray-900 rounded-full overflow-hidden shadow-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your next destination....."
                className="flex-1 px-6 sm:px-8 py-4 sm:py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
              />
              <button 
                type="submit"
                className="mr-3 p-3 bg-white hover:bg-gray-200 rounded-full transition-colors"
                disabled={isSearching}
              >
                <svg 
                  className="w-6 h-6 text-gray-900" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Browse by Country Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowBrowseCountries(!showBrowseCountries)}
              className="bg-[#4A9B7F] hover:bg-[#3d8a6d] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Browse by Country
            </button>
          </div>
        </div>

        {/* Browse by Country Section (Collapsible) */}
        {showBrowseCountries && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Popular Countries</h2>
              <button 
                onClick={() => setShowBrowseCountries(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCountries.map((country) => (
                <div 
                  key={country.id}
                  className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                  onClick={() => router.push(`/destinations/country/${country.name.toLowerCase()}`)}
                >
                  <img 
                    src={country.image} 
                    alt={country.name} 
                    className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold mb-1">{country.name}</h3>
                    <p className="text-gray-200 text-sm">{country.description}</p>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Recent Searches:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSearches.map((search) => (
              <div 
                key={search.id}
                className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => router.push(`/destinations/${search.type.toLowerCase()}/${search.name.toLowerCase()}`)}
              >
                <img 
                  src={search.image} 
                  alt={search.name} 
                  className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold">{search.name}</h3>
                  {search.description && (
                    <p className="text-gray-200 text-sm mt-1">{search.description}</p>
                  )}
                </div>
                {/* Type badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                    {search.type}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            Trending
            <span className="text-3xl">�</span>
            :
          </h2>
          
          {/* Trending list in a card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDestinations.map((destination, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 hover:bg-[#FFF5E9] rounded-xl cursor-pointer transition-colors group"
                  onClick={() => router.push(`/destinations/${destination.type.toLowerCase()}/${destination.slug}`)}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#4A9B7F] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#4A9B7F] transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">{destination.type.toLowerCase()}</p>
                  </div>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-[#4A9B7F] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explore by Category Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Explore by Interest</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Urban Category */}
            <div 
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/category/urban")}
            >
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop" 
                alt="Urban" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">�️</div>
                  <h3 className="text-white text-3xl font-bold">Urban</h3>
                  <p className="text-gray-200 text-sm mt-2">Cities & Culture</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* Nature Category */}
            <div 
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/category/nature")}
            >
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" 
                alt="Nature" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">�️</div>
                  <h3 className="text-white text-3xl font-bold">Nature</h3>
                  <p className="text-gray-200 text-sm mt-2">Parks & Wildlife</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* History Category */}
            <div 
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/category/history")}
            >
              <img 
                src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop" 
                alt="History" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">�️</div>
                  <h3 className="text-white text-3xl font-bold">History</h3>
                  <p className="text-gray-200 text-sm mt-2">Heritage & Monuments</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Editor's Picks</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Large featured card */}
            <div 
              className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/city/tokyo")}
            >
              <img 
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop" 
                alt="Tokyo" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ FEATURED
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-4xl font-bold mb-2">Tokyo</h3>
                <p className="text-gray-200 text-lg mb-4">Where tradition meets innovation</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-semibold">4.9</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">1,234 reviews</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* Grid of smaller cards */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop", rating: 4.8 },
                { name: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=400&fit=crop", rating: 4.9 },
                { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop", rating: 4.7 },
                { name: "Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=400&fit=crop", rating: 4.8 }
              ].map((dest, index) => (
                <div 
                  key={index}
                  className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                  onClick={() => router.push(`/destinations/city/${dest.name.toLowerCase()}`)}
                >
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-bold">{dest.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-white text-sm font-semibold">{dest.rating}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-gray-300 py-6 text-center mt-16">
        <p className="text-gray-800 text-sm">
          ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
        </p>
      </footer>
    </div>
  );
};

export default DestinationsPage;
```

## File: client\odyssey\app\login\page.tsx
```tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [loading, setLoading] = useState(false);

  // 2. NEW: Check if user is already logged in
  useEffect(() => {
    // Check if we have a token saved
    const token = localStorage.getItem("token");
    if (token) {
      // If yes, redirect immediately to dashboard
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Store Token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-4 z-50 px-8 py-4 mx-4 md:mx-16 my-6 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            {/* Make sure the image path is correct relative to your public folder */}
            <img src="/Odyssey_Logo.png" alt="Odyssey Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-medium font-odyssey tracking-wider">Odyssey</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Destinations</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
          <button className="px-6 py-2 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 transition font-medium">
            Sign-in
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/40 transition"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:hidden mt-6 flex-col gap-4`}>
        <a href="#" className="text-gray-700 font-medium">About</a>
        <a href="#" className="text-gray-700 font-medium">Destinations</a>
        <a href="#" className="text-gray-700 font-medium">Pricing</a>
        <button className="w-full px-6 py-2 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 transition font-medium">
          Sign-in
        </button>
      </div>
    </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <h2 className="text-white text-2xl font-semibold mb-2">
            Welcome Back Traveller
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Please login with your Odyssey account
          </p>

          {error && (
            <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Google Sign-in */}
            <button
              type="button"
              className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full py-3 border-2 border-green-500 text-green-500 rounded-lg"
            >
              Create Account
            </button>
            {/* Problem logging in link */}
            <div className="text-center pt-2">
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-gray-300 underline"
              >
                Problem logging in?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-300 py-6 text-center">
        <p className="text-gray-800 text-sm">
          ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;

```

## File: client\odyssey\app\planner\page.tsx
```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
  DragOverEvent,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import LocationModal from "../components/LocationModal"; // Import the modal
import ClusteringView from "../components/ClusteringView"; // Import clustering view
import MultiOptionSelector from "../components/MultiOptionSelector"; // Import multi-option selector
import ConfirmationModal from "../components/ConfirmationModal"; // Import confirmation modal
import MapComponent from "../components/MapComponent"; // Import MapComponent

// --- TYPES (Updated to include data for Modal) ---
type Item = {
  id: string;                 
  placeId?: string;           
  name: string;               // Map 'text' to 'name'
  text?: string;              // Keep 'text' for compatibility with your UI
  description?: string;
  category?: string;
  visitDurationMin?: number;
  time?: string;
  images?: string[];
  reviews?: any[];
  source?: "db" | "ai";
};

type ActiveTab = "chat" | "destinations" | "summaries" | "map";
type DestinationsView = "search" | "collections";

/* -------------------- Custom Collision Logic (YOUR ORIGINAL) -------------------- */
const customCollisionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

/* -------------------- Sortable Item (MODIFIED: Added Info Button) -------------------- */
function SortableItem({
  id,
  text,
  isIndicatorBefore,
  onAction,
  actionType = "remove",
  disabled = false,
  // New props
  itemData,
  onViewDetails 
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // This class ensures your original styling works
      className={`sortable-item ${isDragging ? "z-50" : ""}`}
    >
      <div style={{ 
        padding: "12px", 
        background: "#fff", 
        borderRadius: "12px", 
        marginBottom: "10px", 
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        position: "relative"
      }}>
        {/* Drop Indicator Logic */}
        {isIndicatorBefore !== undefined && (
          <div style={{
            position: "absolute",
            left: 0, right: 0,
            height: "2px",
            background: "#22c55e",
            transition: "all 0.2s",
            top: isIndicatorBefore ? "-6px" : "auto",
            bottom: isIndicatorBefore ? "auto" : "-6px"
          }} />
        )}

        {/* --- MAIN CARD CONTENT (Draggable) --- */}
        <div 
          style={{ flex: 1, cursor: disabled ? "default" : "grab", display: "flex", flexDirection: "column" }}
          {...attributes} 
          {...listeners}
        >
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>{text}</span>
          
          {/* Optional: Show tiny details below name */}
          {itemData?.category && (
             <span style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", marginTop: "2px" }}>
               {itemData.category} {itemData.visitDurationMin ? `• ${itemData.visitDurationMin}m` : ""}
             </span>
          )}
        </div>

        {/* --- BUTTON GROUP --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          
          {/* 1. INFO BUTTON (New) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Don't trigger drag
              if (onViewDetails) onViewDetails(itemData);
            }}
            onPointerDown={(e) => e.stopPropagation()} // Don't start drag
            style={{
              background: "#eff6ff",
              color: "#3b82f6",
              border: "1px solid #dbeafe",
              borderRadius: "50%",
              width: "24px", 
              height: "24px",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold"
            }}
            title="View Details"
          >
            i
          </button>

          {/* 2. ACTION BUTTON (Add/Remove) */}
          {onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(id);
              }}
              onPointerDown={(e) => e.stopPropagation()} // Don't start drag
              style={{
                background: actionType === "add" ? "#ecfdf5" : "#fef2f2",
                color: actionType === "add" ? "#059669" : "#dc2626",
                border: "none",
                borderRadius: "50%",
                width: "24px", 
                height: "24px",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              {actionType === "add" ? "+" : "×"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Column Component (YOUR ORIGINAL + Prop passing) -------------------- */
function Column({ id, items, actionType, onActionItem, dropIndicatorIndex, transparent, isSortable = true, onViewDetails }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: transparent ? "transparent" : "rgba(255,255,255,0.5)",
        borderRadius: "16px",
        border: transparent ? "none" : "2px dashed #d1d5db",
        transition: "background 0.2s"
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }} className="custom-scrollbar">
        {isSortable ? (
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item: any, index: number) => (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.name} // Display Name
                itemData={item}  // Pass full object
                actionType={actionType}
                onAction={onActionItem}
                onViewDetails={onViewDetails} // Pass down function
                isIndicatorBefore={
                  dropIndicatorIndex === index ? true :
                  dropIndicatorIndex === index + 1 ? false : undefined
                }
              />
            ))}
          </SortableContext>
        ) : (
          // Non-sortable items (e.g., search results)
          items.map((item: any) => (
            <SortableItem
              key={item.id}
              id={item.id}
              text={item.name}
              itemData={item}
              actionType={actionType}
              onAction={onActionItem}
              onViewDetails={onViewDetails}
              disabled={true}
            />
          ))
        )}
        
        {items.length === 0 && !transparent && (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- Chat Column (Updated for Cards) -------------------- */
function ChatColumn({ messages, chatInput, setChatInput, onSendMessage, onAddCard, onViewDetails, loading }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg: any) => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%",
              padding: "12px 16px",
              borderRadius: "16px",
              borderTopLeftRadius: msg.sender === "ai" ? "4px" : "16px",
              borderTopRightRadius: msg.sender === "user" ? "4px" : "16px",
              background: msg.sender === "user" ? "#1f2937" : "#ffffff",
              color: msg.sender === "user" ? "#ffffff" : "#1f2937",
              fontSize: "14px",
              lineHeight: "1.5",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              {msg.text}
            </div>
            
            {/* RENDER AI CARDS */}
            {msg.cards && msg.cards.length > 0 && (
              <div style={{ marginTop: "10px", width: "90%" }}>
                {msg.cards.map((card: any) => (
                  <SortableItem 
                    key={card.id} 
                    id={card.id} 
                    text={card.name} 
                    itemData={card}
                    actionType="add" 
                    onAction={() => onAddCard(card)} // Add to collections
                    onViewDetails={onViewDetails}    // View details
                    disabled={true}                  // Chat items are fixed
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ fontSize: "12px", color: "#9ca3af", padding: "10px" }}>Odyssey is writing...</div>}
      </div>

      <form onSubmit={onSendMessage} style={{ padding: "10px", background: "#fff", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ position: "relative" }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Odyssey..."
            style={{ width: "100%", padding: "12px 40px 12px 16px", borderRadius: "99px", background: "#f3f4f6", border: "none", outline: "none", fontSize: "14px" }}
          />
          <button type="submit" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#000", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ↑
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------- MAIN PAGE -------------------- */
export default function PlannerPage() {
  const router = useRouter();

  // --- STATE ---
  const [tripName, setTripName] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [destinationsView, setDestinationsView] = useState<DestinationsView>("search");
  
  // Clustering State (NEW - Stage 1)
  const [stage, setStage] = useState<"chat" | "clustering" | "options" | "confirmation">("chat");
  const [clusteringData, setClusteringData] = useState<any>(null);
  const [clusteringLoading, setClusteringLoading] = useState(false);
  const [selectedPlacesFromClustering, setSelectedPlacesFromClustering] = useState<any[]>([]);
  
  // Itinerary Generation State (NEW - Stage 2)
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [itineraryOptions, setItineraryOptions] = useState<any[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [customRequirements, setCustomRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  
  const [itinerary, setItinerary] = useState<Item[]>([]);
  const [collections, setCollections] = useState<Item[]>([
    { id: "c1", name: "Louvre Museum", category: "museum" },
    { id: "c2", name: "Eiffel Tower", category: "urban" }
  ]);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  
  // Saved Itinerary State (NEW)
  const [savedItinerary, setSavedItinerary] = useState<any>(null);
  const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null);
  
  // Day tracking state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayCheckboxes, setDayCheckboxes] = useState<{ [key: string]: boolean }>({});
  
  const [chat, setChat] = useState<any[]>([
    { id: "m1", text: "Hello! Where are we going?", sender: "ai", cards: [] }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // Drag State
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ column: string; index: number } | null>(null);

  // Modal State (NEW)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Item | null>(null);

  // Load saved itinerary from backend on mount
  useEffect(() => {
    const loadSavedItinerary = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch user's saved itineraries from backend
        const res = await fetch("http://localhost:4000/api/trips", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // Get the most recent itinerary
          const latestItinerary = data.data[0];
          
          // Reconstruct the saved itinerary format
          const selectedItin = latestItinerary.selected_itinerary;
          setSavedItineraryId(latestItinerary.id);
          setSavedItinerary({
            id: latestItinerary.id,
            tripName: latestItinerary.trip_name,
            title: selectedItin?.title,
            description: selectedItin?.description,
            paceDescription: selectedItin?.paceDescription,
            estimatedCost: selectedItin?.estimatedCost,
            schedule: selectedItin?.schedule
          });
        }
      } catch (err) {
        console.error("Error loading saved itinerary:", err);
      }
    };

    loadSavedItinerary();
  }, []);

  // --- HANDLER: OPEN MODAL ---
  const handleViewDetails = (item: Item) => {
    setSelectedLocation(item);
    setModalOpen(true);
  };

  // --- HANDLER: ADD TO COLLECTIONS ---
  const handleAddToCollections = (card: Item) => {
    // Avoid duplicates
    if (!collections.find(c => c.name === card.name)) {
      setCollections(prev => [...prev, { ...card, id: `col-${Date.now()}-${Math.random()}` }]);
    }
  };

  // --- HANDLER: SAVE TRIP ---
  const handleSaveTrip = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to save.");
        router.push("/login");
        return;
    }
    try {
        const res = await fetch("http://localhost:4000/api/trips", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ name: tripName, itinerary, collections })
        });
        if(res.ok) {
            alert("Trip Saved Successfully!");
        } else {
            alert("Failed to save trip.");
        }
    } catch(e) { console.error(e); }
  };

  // --- HANDLER: SEND MESSAGE (AI) ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChat(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      // Check if this is a clustering request (trip planning keywords)
      const isClusteringRequest = chatInput.toLowerCase().includes("trip") || 
                                  chatInput.toLowerCase().includes("plan") || 
                                  chatInput.toLowerCase().includes("day") ||
                                  chatInput.toLowerCase().includes("itinerary");

      if (isClusteringRequest) {
        // Call clustering endpoint
        setClusteringLoading(true);
        const clusterRes = await fetch("http://localhost:4000/api/clustering/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: userMsg.text,
            userContext: { budget: "medium", pace: "moderate" }
          })
        });

        if (clusterRes.ok) {
          const clusterData = await clusterRes.json();
          setClusteringData(clusterData.data);
          setStage("clustering");
          
          // Add AI response to chat
          setChat(prev => [...prev, {
            id: Date.now().toString() + "ai",
            text: "I've analyzed your request and found these place clusters. Select the ones you'd like to visit!",
            sender: "ai",
            cards: []
          }]);
          setClusteringLoading(false);
          setLoading(false);
          return;
        }
      }

      // Regular chat flow (existing)
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, collections, itinerary })
      });
      const data = await res.json();

      // PARSE THE AI RESPONSE
      let aiCards: Item[] = [];
      
      // 1. Direct cards
      if (data.cards) aiCards = [...aiCards, ...data.cards];
      
      // 2. Itinerary Preview (Nested days)
      if (data.itineraryPreview?.days) {
        data.itineraryPreview.days.forEach((day: any) => {
          if (day.items) {
             day.items.forEach((item: any) => {
                aiCards.push({
                   ...item, 
                   id: `ai-${Date.now()}-${Math.random()}`, 
                   description: `Day ${day.day} - ${item.time || 'Visit'}`,
                   source: "ai"
                });
             });
          }
        });
      }

      setChat(prev => [...prev, {
        id: Date.now().toString() + "ai",
        text: data.message || data.reply || "Here is a plan for you.",
        sender: "ai",
        cards: aiCards
      }]);

    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { id: "err", text: "Error connecting to AI.", sender: "ai" }]);
    } finally {
      setLoading(false);
      setClusteringLoading(false);
    }
  };

  // --- HANDLER: Clustering Continue (Stage 1 → Stage 2) ---
  const handleClusteringContinue = (selectedPlaces: any[]) => {
    setSelectedPlacesFromClustering(selectedPlaces);
    // Add selected places to collections for drag-drop
    const newPlaces = selectedPlaces.map((place: any) => ({
      id: `cluster-${Date.now()}-${Math.random()}`,
      name: place.name,
      category: place.category,
      source: "ai" as const
    }));
    setCollections(prev => [...prev, ...newPlaces]);
    
    // Show next step message in chat
    setChat(prev => [...prev, {
      id: Date.now().toString() + "ai",
      text: `Great! I've added ${selectedPlaces.length} place(s) to your collection. Drag and drop them into your itinerary, then click "Generate Itineraries" to see multiple options!`,
      sender: "ai",
      cards: []
    }]);
    
    // Reset clustering
    setStage("chat");
    setClusteringData(null);
  };

  // --- HANDLER: Generate Itineraries (Stage 2) ---
  const handleGenerateItineraries = async () => {
    if (itinerary.length === 0) {
      alert("Please add places to your itinerary first!");
      return;
    }

    setOptionsLoading(true);
    setStage("options");

    try {
      // Add AI thinking message
      setChat(prev => [...prev, {
        id: Date.now().toString() + "thinking",
        text: "Odyssey is generating 3 different itinerary options for you...",
        sender: "ai",
        cards: []
      }]);

      const res = await fetch("http://localhost:4000/api/ai/generateItineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPlaces: itinerary.map(item => ({
            name: item.name,
            category: item.category || "place",
          })),
          tripDuration: Math.ceil(itinerary.length / 2), // Rough estimate
          userContext: { budget: "medium", pace: "moderate" },
          customRequirements: customRequirements.length > 0 ? customRequirements.join(" | ") : undefined
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate itineraries");
      }

      setItineraryOptions(data.data.itineraries);

      // Add success message
      setChat(prev => [...prev, {
        id: Date.now().toString() + "options",
        text: `Perfect! I've created 3 itinerary options for you. Review them below and select your preferred option!`,
        sender: "ai",
        cards: []
      }]);

    } catch (err) {
      console.error(err);
      alert("Error generating itineraries: " + (err as any).message);
      setStage("chat");
    } finally {
      setOptionsLoading(false);
    }
  };

  // Handler for confirming and saving itinerary
  const handleConfirmItinerary = async (finalTripName: string) => {
    if (!selectedItinerary) {
      alert("No itinerary selected");
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not authenticated. Please login first.");
        return;
      }

      console.log("Token from localStorage:", token ? "✓ Found" : "✗ Not found");

      const tripData = {
        tripName: finalTripName || tripName || "My Trip",
        selectedPlaces: itinerary.map(item => ({
          name: item.name,
          category: item.category || "place"
        })),
        selectedItinerary: {
          id: selectedItinerary.id,
          title: selectedItinerary.title,
          description: selectedItinerary.description,
          paceDescription: selectedItinerary.paceDescription,
          estimatedCost: selectedItinerary.estimatedCost,
          schedule: selectedItinerary.schedule
        },
        status: "draft"
      };

      const res = await fetch("http://localhost:4000/api/trips/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      const data = await res.json();
      console.log("Save response status:", res.status);
      console.log("Save response data:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to save trip");
      }

      // Store the saved itinerary ID and details
      const itineraryId = data.data.id;
      const savedItineraryData = {
        id: itineraryId,
        tripName: finalTripName || tripName || "My Trip",
        title: tripData.selectedItinerary.title,
        description: tripData.selectedItinerary.description,
        paceDescription: tripData.selectedItinerary.paceDescription,
        estimatedCost: tripData.selectedItinerary.estimatedCost,
        schedule: tripData.selectedItinerary.schedule
      };
      
      setSavedItineraryId(itineraryId);
      setSavedItinerary(savedItineraryData);

      // Add success message
      setChat(prev => [...prev, {
        id: Date.now().toString() + "saved",
        text: `✅ Trip saved successfully! Trip ID: ${itineraryId}. You can view it in your dashboard.`,
        sender: "ai",
        cards: []
      }]);

      // Close confirmation modal
      setConfirmationOpen(false);
      setStage("chat");
      setSelectedItinerary(null);
      setItineraryOptions([]);
      // Keep itinerary displayed in left box - don't clear it!

    } catch (err) {
      console.error("Error saving trip:", err);
      const errorMsg = (err as any).message || "Unknown error";
      alert(`Error saving trip: ${errorMsg}`);
    }
  };

  // Handler for Edit & Regenerate
  const handleEditAndRegenerate = () => {
    setConfirmationOpen(false);
    setStage("chat");
    setItineraryOptions([]);
    setSelectedItinerary(null);
    setCustomRequirements([]); // Clear requirements for fresh edit
    
    // Show instruction message
    setChat(prev => [...prev, {
      id: Date.now().toString() + "edit",
      text: "Great! You can now:\n1. Add or remove places from your itinerary (drag them in/out)\n2. Add custom requirements in the box below (e.g., 'visit museum first', 'sunset at beach')\n\nWhen ready, click 'Generate Itineraries' again!",
      sender: "ai",
      cards: []
    }]);
  };

  // Add custom requirement
  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setCustomRequirements(prev => [...prev, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  // Remove custom requirement
  const handleRemoveRequirement = (index: number) => {
    setCustomRequirements(prev => prev.filter((_, i) => i !== index));
  };

  // --- DRAG HANDLERS (EXACT ORIGINAL LOGIC) ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Only drag from Collections or Itinerary (Chat is disabled for drag)
    const item = collections.find((i) => i.id === active.id) || itinerary.find((i) => i.id === active.id);
    if (item) setActiveItem(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;
    const overColumnId = overId === "itinerary" || itinerary.some(i => i.id === overId) ? "itinerary" : 
                         overId === "collections" || collections.some(i => i.id === overId) ? "collections" : null;

    if (!overColumnId) return;

    if (overColumnId === "itinerary") {
        const overIndex = itinerary.findIndex(i => i.id === overId);
        const index = overIndex === -1 ? itinerary.length : overIndex;
        setDropIndicator({ column: "itinerary", index });
    } else if (overColumnId === "collections") {
        const overIndex = collections.findIndex(i => i.id === overId);
        const index = overIndex === -1 ? collections.length : overIndex;
        setDropIndicator({ column: "collections", index });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    setDropIndicator(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = collections.some(i => i.id === activeId) ? "collections" : "itinerary";
    const overColumnId = overId === "itinerary" || itinerary.some(i => i.id === overId) ? "itinerary" :
                         overId === "collections" || collections.some(i => i.id === overId) ? "collections" : null;

    if (!overColumnId) return;

    if (activeColumnId === overColumnId) {
        if (activeColumnId === "itinerary") {
            const oldIndex = itinerary.findIndex(i => i.id === activeId);
            const newIndex = itinerary.findIndex(i => i.id === overId);
            if (oldIndex !== newIndex) setItinerary(arrayMove(itinerary, oldIndex, newIndex));
        } else {
            const oldIndex = collections.findIndex(i => i.id === activeId);
            const newIndex = collections.findIndex(i => i.id === overId);
            if (oldIndex !== newIndex) setCollections(arrayMove(collections, oldIndex, newIndex));
        }
    } else {
        if (activeColumnId === "collections" && overColumnId === "itinerary") {
            const item = collections.find(i => i.id === activeId);
            if (item) {
                setItinerary(prev => [...prev, item]);
                setCollections(prev => prev.filter(i => i.id !== activeId));
            }
        } else if (activeColumnId === "itinerary" && overColumnId === "collections") {
            const item = itinerary.find(i => i.id === activeId);
            if (item) {
                setCollections(prev => [...prev, item]);
                setItinerary(prev => prev.filter(i => i.id !== activeId));
            }
        }
    }
  };

  const sharedTabStyles = (isActive: boolean) => ({
    flex: 1, padding: "6px", borderRadius: "8px", border: "none",
    background: isActive ? "#fff" : "transparent",
    fontWeight: isActive ? 600 : 400, cursor: "pointer", fontSize: "14px"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Inter, sans-serif", background: "#ffffff", overflow: "hidden" }}>
      
      {/* Header */}
      <header style={{ padding: "12px 5%", height: "64px", flexShrink: 0, display: "flex", alignItems: "center", background: "#fff6eb", gap: "12px", borderBottom: "1px solid #e5e7eb" }}>
        <input 
          value={tripName} 
          onChange={(e) => setTripName(e.target.value)} 
          placeholder="Trip name" 
          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #d9d9d9", background: "#fff" }} 
        />
        <button 
          onClick={handleGenerateItineraries}
          disabled={itinerary.length === 0 || optionsLoading}
          style={{ 
            padding: "8px 14px", 
            background: itinerary.length === 0 ? "#d1d5db" : "#7c3aed", 
            color: "#fff", 
            border: "none", 
            borderRadius: "8px", 
            fontWeight: 600, 
            cursor: itinerary.length === 0 ? "not-allowed" : "pointer",
            opacity: optionsLoading ? 0.7 : 1
          }}
          title={itinerary.length === 0 ? "Add places to itinerary first" : "Generate 3 itinerary options"}
        >
          {optionsLoading ? "Generating..." : "✨ Generate Itineraries"}
        </button>
        <button onClick={handleSaveTrip} style={{ padding: "8px 14px", background: "#1db954", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Save</button>
        <button onClick={() => setActiveTab("map")} style={{ padding: "8px 14px", background: activeTab === "map" ? "#000" : "#fff", color: activeTab === "map" ? "#fff" : "#000", border: "1px solid #d9d9d9", borderRadius: "8px", cursor: "pointer" }}>Maps</button>
        <button style={{ padding: "8px 14px", background: "#fff", color: "#000", border: "1px solid #d9d9d9", borderRadius: "8px" }}>Summaries</button>
      </header>

      <main style={{ padding: "20px 5%", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        <DndContext 
          collisionDetection={customCollisionStrategy} 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver} 
          onDragEnd={handleDragEnd} 
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          <div style={{ display: "flex", gap: "30px", marginBottom: "12px", flexShrink: 0 }}>
            <div style={{ width: "55%", display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => router.push("/dashboard")} style={{ background: "white", border: "1px solid #d9d9d9", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>←</button>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "20px" }}>Itinerary</h3>
            </div>
            <div style={{ width: "45%", display: "flex", gap: "4px", background: "#d1d5db", borderRadius: "10px", padding: "4px" }}>
              <button onClick={() => setActiveTab("chat")} style={sharedTabStyles(activeTab === "chat")}>Chat</button>
              <button onClick={() => setActiveTab("destinations")} style={sharedTabStyles(activeTab === "destinations")}>Destinations</button>
              <button onClick={() => setActiveTab("map")} style={sharedTabStyles(activeTab === "map")}>Map</button>
              <button onClick={() => setActiveTab("summaries")} style={sharedTabStyles(activeTab === "summaries")}>Summaries</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "30px", flex: 1, overflow: "hidden", minHeight: 0 }}>
            <div style={{ width: "55%", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              {/* Show Saved Itinerary Info */}
              {savedItinerary && (
                <div style={{
                  padding: "16px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "2px solid #22c55e",
                  marginBottom: "16px",
                  flexShrink: 0,
                  maxHeight: "60vh",
                  overflowY: "auto"
                }}>
                  {/* Header with Title and Clear Button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "2px solid #22c55e" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#15803d" }}>
                      ✅ {savedItinerary.tripName}
                    </h3>
                    <button
                      onClick={() => {
                        setSavedItinerary(null);
                        setSavedItineraryId(null);
                      }}
                      style={{
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Clear
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Duration</p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#15803d" }}>
                        {savedItinerary.schedule?.length || 0} days
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Cost</p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#15803d" }}>
                        ${savedItinerary.estimatedCost?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Pace</p>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#15803d" }}>
                        {savedItinerary.paceDescription?.split(",")[0] || "Moderate"}
                      </p>
                    </div>
                  </div>

                  {/* Day View or Full Schedule */}
                  {selectedDay !== null ? (
                    // DAY VIEW - Selected Day with Checkboxes
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <button
                          onClick={() => setSelectedDay(null)}
                          style={{
                            background: "#22c55e",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          ← Back to Full Plan
                        </button>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#15803d" }}>
                          📅 Day {savedItinerary.schedule?.[selectedDay]?.day} • {savedItinerary.schedule?.[selectedDay]?.date}
                        </h4>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {savedItinerary.schedule?.[selectedDay]?.items?.map((item: any, idx: number) => {
                          const checkboxKey = `${selectedDay}-${idx}`;
                          const isChecked = dayCheckboxes[checkboxKey] || false;
                          
                          return (
                            <div
                              key={idx}
                              style={{
                                padding: "12px",
                                background: isChecked ? "#e8f5e9" : "#fff",
                                border: "2px solid #22c55e",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px"
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  setDayCheckboxes(prev => ({
                                    ...prev,
                                    [checkboxKey]: e.target.checked
                                  }));
                                }}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                  marginTop: "2px",
                                  accentColor: "#22c55e"
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      fontSize: "13px",
                                      color: "#15803d",
                                      textDecoration: isChecked ? "line-through" : "none",
                                      opacity: isChecked ? 0.6 : 1
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      background: "#fef3c7",
                                      color: "#92400e",
                                      padding: "2px 8px",
                                      borderRadius: "3px",
                                      textTransform: "capitalize"
                                    }}
                                  >
                                    {item.time}
                                  </span>
                                </div>
                                <p
                                  style={{
                                    margin: "0 0 8px 0",
                                    fontSize: "12px",
                                    color: "#166534",
                                    opacity: isChecked ? 0.6 : 1
                                  }}
                                >
                                  ⏱️ {item.visitDurationMin}m • {item.timeRange}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "11px",
                                    color: "#999",
                                    fontStyle: "italic"
                                  }}
                                >
                                  {item.notes}
                                </p>
                              </div>
                              <button
                                onClick={() => handleViewDetails(item)}
                                style={{
                                  background: "#22c55e",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "6px 12px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                  flexShrink: 0
                                }}
                              >
                                ℹ️ Info
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    // FULL SCHEDULE VIEW
                    <div>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 700, color: "#15803d", paddingTop: "12px", borderTop: "2px solid #22c55e" }}>
                        📅 Full Schedule
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {savedItinerary.schedule?.map((day: any) => (
                          <div
                            key={day.day}
                            onClick={() => setSelectedDay(day.day - 1)}
                            style={{
                              padding: "12px",
                              background: "#f9fafb",
                              border: "2px solid #22c55e",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#e8f5e9";
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(34, 197, 94, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#f9fafb";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: "#15803d" }}>
                              Day {day.day} • {day.date}
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {day.items?.map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  style={{
                                    fontSize: "11px",
                                    color: "#166534",
                                    padding: "8px",
                                    background: "#fff",
                                    borderRadius: "6px",
                                    border: "1px solid #22c55e",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: "8px"
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                      <span style={{ fontWeight: 600, color: "#15803d" }}>
                                        {item.name}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          background: "#fef3c7",
                                          color: "#92400e",
                                          padding: "2px 6px",
                                          borderRadius: "3px",
                                          textTransform: "capitalize"
                                        }}
                                      >
                                        {item.time}
                                      </span>
                                    </div>
                                    <p style={{ margin: "0", fontSize: "10px", color: "#166534" }}>
                                      ⏱️ {item.visitDurationMin}m • {item.timeRange} • {item.notes}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(item);
                                    }}
                                    style={{
                                      background: "#22c55e",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                      fontSize: "10px",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                      flexShrink: 0
                                    }}
                                    title="View details"
                                  >
                                    ℹ️
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Column 
                id="itinerary" 
                items={itinerary} 
                actionType="remove" 
                dropIndicatorIndex={dropIndicator?.column === "itinerary" ? dropIndicator.index : null} 
                onActionItem={(id: string) => setItinerary(itinerary.filter(i => i.id !== id))} 
                onViewDetails={handleViewDetails} // Pass Modal trigger
              />
            </div>

            <div style={{ width: "45%", display: "flex", flexDirection: "column", background: "#e5e7eb", borderRadius: "20px", padding: "12px", overflow: "hidden", minHeight: 0 }}>
                {activeTab === "chat" && (
                  <>
                    {/* Clustering Stage Display */}
                    {stage === "clustering" && clusteringData && (
                      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", marginBottom: "12px", padding: "12px", background: "#fff", borderRadius: "12px" }}>
                        <ClusteringView 
                          data={clusteringData} 
                          loading={clusteringLoading}
                          onContinue={handleClusteringContinue}
                        />
                      </div>
                    )}

                    {/* Options Selection Stage Display */}
                    {stage === "options" && itineraryOptions.length > 0 && (
                      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", marginBottom: "12px", padding: "12px", background: "#fff", borderRadius: "12px" }}>
                        <MultiOptionSelector 
                          itineraries={itineraryOptions}
                          onSelect={(option) => {
                            setSelectedItinerary(option);
                            setConfirmationOpen(true);
                          }}
                        />
                      </div>
                    )}

                    {/* Regular Chat Display */}
                    {stage === "chat" && (
                      <ChatColumn 
                        messages={chat} 
                        chatInput={chatInput} 
                        setChatInput={setChatInput} 
                        onSendMessage={handleSendMessage}
                        onAddCard={handleAddToCollections}
                        onViewDetails={handleViewDetails}
                        loading={loading}
                      />
                    )}

                    {/* Custom Requirements Box - Only show when editing options */}
                    {stage === "chat" && itineraryOptions.length > 0 && (
                      <div style={{ 
                        marginTop: "12px", 
                        padding: "12px", 
                        background: "#fef3c7", 
                        borderRadius: "12px",
                        border: "2px solid #fcd34d",
                        flexShrink: 0
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#92400e", marginBottom: "8px" }}>
                          📋 Custom Requirements (Regeneration Only)
                        </div>

                        {/* Input for new requirement */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                          <input
                            type="text"
                            value={requirementInput}
                            onChange={(e) => setRequirementInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleAddRequirement()}
                            placeholder="e.g., 'visit museum first' or 'sunset at beach'"
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              border: "1px solid #fcd34d",
                              borderRadius: "8px",
                              fontSize: "13px",
                              background: "#fff",
                              outline: "none"
                            }}
                          />
                          <button
                            onClick={handleAddRequirement}
                            disabled={!requirementInput.trim()}
                            style={{
                              padding: "8px 14px",
                              background: requirementInput.trim() ? "#fcd34d" : "#e5d4a4",
                              color: "#92400e",
                              border: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              fontSize: "12px",
                              cursor: requirementInput.trim() ? "pointer" : "not-allowed",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              if (requirementInput.trim()) {
                                (e.currentTarget as HTMLButtonElement).style.background = "#fbbf24";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (requirementInput.trim()) {
                                (e.currentTarget as HTMLButtonElement).style.background = "#fcd34d";
                              }
                            }}
                          >
                            + Add
                          </button>
                        </div>

                        {/* Requirements List */}
                        {customRequirements.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {customRequirements.map((req, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  background: "#fff",
                                  padding: "8px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  color: "#92400e",
                                  border: "1px solid #fcd34d"
                                }}
                              >
                                <span>✓ {req}</span>
                                <button
                                  onClick={() => handleRemoveRequirement(idx)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    padding: "0 4px",
                                    fontSize: "16px",
                                    fontWeight: "bold"
                                  }}
                                  title="Remove requirement"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {customRequirements.length === 0 && (
                          <div style={{ fontSize: "12px", color: "#a16207", fontStyle: "italic" }}>
                            No custom requirements added yet. Add requirements to regenerate itineraries that prioritize your preferences.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === "destinations" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
                    <div style={{ display: "flex", gap: "12px", background: "#d1d5db", borderRadius: "10px", padding: "4px", marginBottom: "16px", flexShrink: 0 }}>
                      <button onClick={() => setDestinationsView("search")} style={sharedTabStyles(destinationsView === "search")}>Search</button>
                      <button onClick={() => setDestinationsView("collections")} style={sharedTabStyles(destinationsView === "collections")}>Collections ({collections.length})</button>
                    </div>

                    {destinationsView === "search" ? (
                      <Column id="search" items={searchResults} actionType="add" onActionItem={handleAddToCollections} transparent isSortable={false} onViewDetails={handleViewDetails}>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexShrink: 0 }}>
                          <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                            placeholder="Search destinations..." 
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none", background: "#ffffff" }} 
                          />
                          <button onClick={handleSendMessage} style={{ padding: "8px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                            Search
                          </button>
                        </div>
                      </Column>
                    ) : (
                      <Column 
                        id="collections" 
                        items={collections} 
                        actionType="remove" 
                        dropIndicatorIndex={dropIndicator?.column === "collections" ? dropIndicator.index : null} 
                        onActionItem={(id: string) => setCollections(collections.filter(i => i.id !== id))} 
                        transparent 
                        isSortable={true} 
                        onViewDetails={handleViewDetails}
                      />
                    )}
                  </div>
                )}

                {activeTab === "summaries" && <div style={{ textAlign: "center", padding: "20px" }}>No summaries.</div>}
                
                {activeTab === "map" && (
                   <div style={{ height: "100%", borderRadius: "12px", overflow: "hidden" }}>
                      <MapComponent items={itinerary} onClose={() => setActiveTab("chat")} />
                   </div>
                )}
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeItem && (
              <div style={{ 
                padding: "14px", 
                background: "#fff", 
                borderRadius: "12px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: "300px",
                fontSize: "14px",
                opacity: 0.9
              }}>
                {activeItem.name}
              </div>
            )}
          </DragOverlay>

          {/* Modal Injection */}
          <LocationModal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            data={selectedLocation} 
          />

          {/* Confirmation Modal */}
          <ConfirmationModal 
            isOpen={confirmationOpen}
            itinerary={selectedItinerary}
            tripName={tripName}
            onConfirm={handleConfirmItinerary}
            onClose={() => setConfirmationOpen(false)}
            onEdit={handleEditAndRegenerate}
          />

        </DndContext>
      </main>

      <footer style={{ height: "48px", flexShrink: 0, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d9d9d9", background: "#f5f5f5", fontSize: "14px", color: "#666" }}>
        ©Odyssey. Made with ❤️ by Route6
      </footer>
    </div>
  );
}
```

## File: client\odyssey\app\profile\page.tsx
```tsx
// app/profile/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Types & Interfaces ---
interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  image: string;
  dates: string;
  collaborators: number;
  isPublic: boolean;
}

interface ReviewProps {
  id: string;
  placeName: string;
  placeImage: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

interface CollectionProps {
  id: string;
  name: string;
  count: number;
  coverImage: string;
}

// --- Mock Data ---
const userProfile = {
  name: "Alex Rivera",
  username: "@alexrivera",
  bio: "Adventure seeker | Photography enthusiast | Always planning the next trip ✈️",
  joinDate: "January 2024",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  stats: {
    tripsCompleted: 24,
    placesVisited: 87,
    reviewsWritten: 45,
    followers: 342,
    countriesVisited: 12
  },
  travelStyle: ["Adventure", "Photography", "Budget-Friendly", "Solo Travel"]
};

const sharedTrips: TripCardProps[] = [
  {
    id: "1",
    title: "Bali Adventure 2024",
    destination: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=300&fit=crop",
    dates: "Jan 15 - Jan 25, 2024",
    collaborators: 3,
    isPublic: true
  },
  {
    id: "2",
    title: "Darjeeling Tea Tour",
    destination: "Darjeeling, India",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    dates: "Dec 1 - Dec 10, 2023",
    collaborators: 2,
    isPublic: true
  },
  {
    id: "3",
    title: "Tokyo Cherry Blossoms",
    destination: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    dates: "Mar 20 - Apr 2, 2024",
    collaborators: 1,
    isPublic: true
  }
];

const reviews: ReviewProps[] = [
  {
    id: "1",
    placeName: "Tanah Lot Temple",
    placeImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200&fit=crop",
    rating: 5,
    comment: "Absolutely breathtaking sunset views! The temple sits on a rock formation surrounded by the ocean. Best time to visit is during sunset. Can get crowded but totally worth it.",
    date: "2 weeks ago",
    location: "Bali, Indonesia"
  },
  {
    id: "2",
    placeName: "Tiger Hill Sunrise Point",
    placeImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    rating: 4,
    comment: "Worth the early morning wake up! The sunrise over Kanchenjunga is spectacular. Dress warmly as it gets very cold at 4 AM.",
    date: "1 month ago",
    location: "Darjeeling, India"
  },
  {
    id: "3",
    placeName: "Senso-ji Temple",
    placeImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop",
    rating: 5,
    comment: "Tokyo's oldest temple is a must-visit! The surrounding Nakamise shopping street has amazing traditional snacks and souvenirs.",
    date: "3 months ago",
    location: "Tokyo, Japan"
  }
];

const collections: CollectionProps[] = [
  {
    id: "1",
    name: "Beach Paradises",
    count: 15,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Mountain Escapes",
    count: 23,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Urban Adventures",
    count: 18,
    coverImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=300&fit=crop"
  }
];

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "reviews" | "collections" | "settings">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400" : "fill-gray-300"}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">
      {/* --- Navigation (Same as Dashboard) --- */}
      <nav className="sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <img 
                src="/Odyssey_Logo.png" 
                alt="Odyssey Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-xl sm:text-2xl font-medium font-odyssey tracking-wider">
              Odyssey
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a onClick={() => router.push("/dashboard")} className="text-black hover:font-bold transition-all cursor-pointer">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black hover:font-bold transition-all cursor-pointer">Planner</a>
            <a href="#" className="text-black hover:font-bold transition-all">My Trips</a>
            <a href="#" className="text-black hover:font-bold transition-all">Saved places</a>
            <a href="#" className="text-black hover:font-bold transition-all">Co-Travellers</a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <button className="p-2 bg-white bg-opacity-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-3 mt-4 md:hidden pb-2">
            <a onClick={() => router.push("/dashboard")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Planner</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">My Trips</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Saved places</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Co-Travellers</a>
          </div>
        )}
      </nav>

      {/* --- Main Profile Content --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        
        {/* Cover Image + Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 sm:h-64 rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={userProfile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Profile Picture (overlapping cover) */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#FFF5E9] overflow-hidden shadow-xl">
              <img 
                src={userProfile.profileImage} 
                alt={userProfile.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="absolute bottom-4 right-4">
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold shadow-lg transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="mt-20 sm:mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-gray-600 text-lg mt-1">{userProfile.username}</p>
              <p className="text-gray-700 mt-3 max-w-2xl">{userProfile.bio}</p>
              <p className="text-gray-500 text-sm mt-2">Joined {userProfile.joinDate}</p>
            </div>
          </div>

          {/* Travel Style Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {userProfile.travelStyle.map((style, index) => (
              <span 
                key={index}
                className="bg-[#4A9B7F] text-white px-4 py-1.5 rounded-full text-sm font-medium"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.tripsCompleted}</p>
            <p className="text-gray-600 text-sm mt-1">Trips Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.placesVisited}</p>
            <p className="text-gray-600 text-sm mt-1">Places Visited</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.reviewsWritten}</p>
            <p className="text-gray-600 text-sm mt-1">Reviews</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.followers}</p>
            <p className="text-gray-600 text-sm mt-1">Followers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.countriesVisited}</p>
            <p className="text-gray-600 text-sm mt-1">Countries</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#4A9B7F] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("trips")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${
              activeTab === "trips"
                ? "bg-[#4A9B7F] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Shared Trips
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${
              activeTab === "reviews"
                ? "bg-[#4A9B7F] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${
              activeTab === "collections"
                ? "bg-[#4A9B7F] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-[#4A9B7F] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-[#4A9B7F] rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">Completed Trip to Bali</p>
                      <p className="text-gray-600 text-sm mt-1">Visited 8 amazing places • 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                      ⭐
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">Left a review for Tanah Lot Temple</p>
                      <p className="text-gray-600 text-sm mt-1">5 stars • 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                      📍
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">Added 12 places to "Beach Paradises"</p>
                      <p className="text-gray-600 text-sm mt-1">3 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Map Placeholder */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Places I've Been</h3>
                <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 font-semibold">Interactive Travel Map Coming Soon</p>
                </div>
              </div>

              {/* Upcoming Trips */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h3>
                <div className="bg-[#FFF5E9] rounded-xl p-6 text-center">
                  <p className="text-gray-600">No upcoming trips planned yet</p>
                  <button 
                    onClick={() => router.push("/planner")}
                    className="mt-4 bg-[#4A9B7F] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                  >
                    Plan a Trip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SHARED TRIPS TAB */}
          {activeTab === "trips" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedTrips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={trip.image} 
                        alt={trip.title} 
                        className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                      <p className="text-gray-600 text-sm mb-1">📍 {trip.destination}</p>
                      <p className="text-gray-600 text-sm mb-3">📅 {trip.dates}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-gray-600 text-sm">{trip.collaborators} collaborators</span>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Public
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-32 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={review.placeImage} 
                      alt={review.placeName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{review.placeName}</h3>
                        <p className="text-gray-600 text-sm">📍 {review.location}</p>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-gray-500 text-sm mt-1">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COLLECTIONS TAB */}
          {activeTab === "collections" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div key={collection.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={collection.coverImage} 
                        alt={collection.name} 
                        className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{collection.name}</h3>
                      <p className="text-gray-600">{collection.count} places saved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              
              {/* Account Settings */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue={userProfile.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Username</label>
                    <input 
                      type="text" 
                      defaultValue={userProfile.username}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                    <textarea 
                      defaultValue={userProfile.bio}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue="alex.rivera@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Public Profile</p>
                      <p className="text-sm text-gray-600">Allow others to see your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Show Trip History</p>
                      <p className="text-sm text-gray-600">Display your completed trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Show Reviews Publicly</p>
                      <p className="text-sm text-gray-600">Let others see your reviews</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Travel Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Preferred Currency</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>INR - Indian Rupee</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Budget Range (per day)</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]">
                      <option>$0 - $50 (Budget)</option>
                      <option>$50 - $100 (Moderate)</option>
                      <option>$100 - $200 (Comfortable)</option>
                      <option>$200+ (Luxury)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Preferred Accommodation</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]">
                      <option>Hostels</option>
                      <option>Budget Hotels</option>
                      <option>Mid-range Hotels</option>
                      <option>Luxury Hotels</option>
                      <option>Vacation Rentals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Travel Style</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Adventure", "Relaxation", "Culture", "Photography", "Food", "Shopping", "Nature", "History"].map((style) => (
                        <label key={style} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition">
                          <input type="checkbox" defaultChecked={userProfile.travelStyle.includes(style)} className="rounded" />
                          <span className="text-sm font-medium text-gray-700">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Trip Reminders</p>
                      <p className="text-sm text-gray-600">Get reminded about upcoming trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Friend Activity</p>
                      <p className="text-sm text-gray-600">See when friends plan new trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="bg-[#4A9B7F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3d8a6d] transition shadow-lg">
                  Save All Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-300 py-6 text-center mt-16">
        <p className="text-gray-800 text-sm">
          ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;
```

## File: client\odyssey\app\signup\landingPage.css
```css
/* ----------------- Reset & Base ----------------- */
/* * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
} */

body {
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #FFF4E8;
    color: #111;
}

/* ----------------- Layout ----------------- */
.header {
    max-width: 1200px;
    margin: auto;
    padding: 32px;
}

/* ----------------- First Section (Hero) ----------------- */
.first {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    margin-top: 40px;
}

/* Text */
#text {
    max-width: 520px;
}

#text h1 {
    font-size: 56px;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
}

#text p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 28px;
}

/* Buttons */
.btn {
    padding: 12px 22px;
    border-radius: 12px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 12px;
}

#travel {
    background-color: #2FB36D;
    color: #000;
}
#travel:hover{
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(47, 179, 109, 0.35);
}
#learn {
    background-color: #111;
    color: #fff;
}
#learn:hover{
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0,0,0, 0.35);
}
/* Image */
#travelIMG img {
    border-radius: 10px;
    width: 520px;
    max-width: 100%;
}

/* ----------------- Second Section (Features) ----------------- */
.second {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 80px;
}

/* Feature Box */
.box {
    background-color: #fff;
    padding: 24px;
    border-radius: 16px;
    min-height: 140px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

/* ----------------- Responsive ----------------- */
@media (max-width: 900px) {
    .first {
        flex-direction: column;
        text-align: center;
    }

    #text h1 {
        font-size: 42px;
    }

    .second {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    .second {
        grid-template-columns: 1fr;
    }
}
/* ---------------- Navbar (Sticky + Glassmorphic) ---------------- */
.navbar {
    position: sticky;
    top: 16px;
    z-index: 1000;

    -webkit-backdrop-filter: blur(14px);
    background: rgba(245, 239, 230, 0.30);
    backdrop-filter: blur(9px);

    border-radius: 18px;
    padding: 14px 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    max-width: 1200px;
    margin: 20px auto;

    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Left logo */
.nav-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 18px;
}

/* Right links */
.nav-right {
    display: flex;
    align-items: center;
    gap: 28px;
}

.nav-right a {
    text-decoration: none;
    color: #111;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    transition: opacity 0.2s ease;
}

.nav-right a:hover {
    opacity: 0.7;
}

/* Active underline */
.nav-right a.active::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #111;
    left: 0;
    bottom: -6px;
}

/* Sign-in button */
.signin-btn {
    background-color: #2FB36D;
    border: none;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.signin-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(47, 179, 109, 0.35);
}
/* ---------------- Feature Section ---------------- */
.second {
    margin-top: 80px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
}

/* Base card */
.box {
    padding: 26px 28px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.05);
    min-height: 150px;
}

/* Card text */
.box h3 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
}

.box p {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
}

/* Pastel backgrounds */
.box.ai {
    background: linear-gradient(135deg, #FFF1E8, #FFE7DA);
}

.box.routes {
    background: linear-gradient(135deg, #FFF8DC, #FFF1B8);
}

.box.explore {
    background: linear-gradient(135deg, #F5F5F5, #EEEEEE);
}

.box.memory {
    background: linear-gradient(135deg, #FFF6E3, #FFEBC0);
}

.box.community {
    background: linear-gradient(135deg, #F7F7F7, #EFEFEF);
}

.box.budget {
    background: linear-gradient(135deg, #FFF0E8, #FFE2D6);
}

/* ---------------- Responsive ---------------- */
@media (max-width: 900px) {
    .second {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    .second {
        grid-template-columns: 1fr;
    }
}
.third{
    background-color: #000;
    margin-top: 80px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    width: 100%;
}
.sec{
    text-align: center;
    color: #EEEEEE;
    padding: 26px 28px;
    min-height: 150px;
}
.sec h3{
    font-size: 4.5rem;
}
.sec p{
    font-size: 1.5rem;
}

.four {
    background-color: white;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; /* CENTER everything horizontally */
    gap: 12px;
}

/* Title text spacing */
.four h1 {
    font-size: 36px;
}

.four p {
    color: #555;
    margin-bottom: 24px;
}

/* Number circle */
.four h2 {
    width: 3rem;
    height: 3rem;
    background-color: #d9d9d9;
    border-radius: 50%;

    display: flex;              /* CENTER number inside circle */
    align-items: center;
    justify-content: center;

    font-size: 18px;
    font-weight: 600;
}

/* Description text */
.four h4 {
    max-width: 600px;           /* Responsive width */
    color: #333;
    line-height: 1.6;
    margin-bottom: 24px;
}
.five{
    text-align: center;
    background-color: white;
    display: flex;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.start-btn {
    background-color: #2FB36D;
    border: none;
    padding: 8px 18px;
    border-radius: 999px;
    margin: 2%;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.start-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(47, 179, 109, 0.35);
}
.plan{
    width: 600px;  
    max-height: 400px;  
    border-radius: 15px;
    background-color: #FFF4E8;
    padding: 10px;
}
.five h3{
    margin: 5px;
}
.six{
    background-color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 1.3rem;
}
.pad{
    background-color: white;
    padding-top: 80px;
}
```

## File: client\odyssey\app\signup\page.tsx
```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./landingPage.css";

const SignupPage: React.FC = () => {
  const router = useRouter();
  
  // 1. State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Connect to your Backend
      const res = await fetch("http://127.0.0.1:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          dob: formData.dob
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // Success! Save token and go to dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 min-h-screen">
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Odyssey</span>
        </div>

        <div className="nav-right">
          <a className="active" href="#">About</a>
          <a href="#">Destinations</a>
          <a href="#">Pricing</a>
          {/* Sign-in navigates to /login */}
          <Link href="/login">
            <button className="signin-btn">Sign-in</button>
          </Link>
        </div>
      </div>

      {/* Sign-up Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <h2 className="text-white text-2xl font-semibold mb-6">Welcome Traveller</h2>
          
          {error && <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-lg mb-4 border border-red-500">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name / Username */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Username</label>
              <input
                name="username"
                type="text"
                required
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                onChange={handleChange}
                placeholder="Confirm"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Date of Birth</label>
              <input
                name="dob"
                type="date"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500" />
              <label htmlFor="terms" className="text-gray-400 text-sm">
                By signing up, you agree to our{" "}
                <a href="#" className="text-green-500 hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-green-500 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Sign-up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition mt-6 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            {/* Google Sign-in */}
            <button
              type="button"
              className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Sign-in Link */}
            {/* <button
              type="button"
              className="w-full py-3 bg-transparent border-2 border-green-500 hover:bg-green-900 text-green-500 font-medium rounded-lg transition"
              onClick={() => router.push("/login")}
            >
              Log in
            </button> */}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-300 mt-[100px] py-6 text-center">
        <p className="text-gray-800 text-sm">
          ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
        </p>
      </footer>
    </div>
  );
};

export default SignupPage;
```

## File: client\odyssey\resource\login\dashboard1.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Odyssey - Dashboard</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,400;0,700;1,400&family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Tailwind Font Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        odyssey: ['"Playfair Display"', 'serif'],
                        body: ['Manrope', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>

<body class="bg-[#FFF5E9] min-h-screen">
    <!-- Navigation -->
    <nav class="bg-[#FFF5E9] sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
        <div class="flex items-center justify-between">
            <!-- Logo + Text -->
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 flex items-center justify-center">
                    <img src="Odyssey_Logo.png" alt="Odyssey Logo" class="w-full h-full object-contain">
                </div>
                <span class="text-xl sm:text-2xl font-medium font-odyssey tracking-wider">Odyssey</span>
            </div>

            <!-- Desktop Links -->
            <div class="hidden md:flex items-center gap-4 lg:gap-6">
                <a href="#" class="text-gray-900 font-semibold underline">Home</a>
                <a href="#" class="text-black hover:font-bold">Planner</a>
                <a href="#" class="text-black hover:font-bold">My Trips</a>
                <a href="#" class="text-black hover:font-bold">Saved places</a>
                <a href="#" class="text-black hover:font-bold">Co-Travellers</a>
            </div>

            <!-- Buttons -->
            <div class="flex items-center gap-2 sm:gap-3">
                <button class="p-2 hover:bg-white hover:bg-opacity-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
                </button>
                <button class="p-2 hover:bg-white hover:bg-opacity-50 rounded-full">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden">
                <button id="mobile-menu-button" class="p-2 rounded-md bg-gray-200 hover:bg-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden flex-col gap-3 mt-4 md:hidden">
            <a href="#" class="text-black font-medium">Home</a>
            <a href="#" class="text-black font-medium">Planner</a>
            <a href="#" class="text-black font-medium">My Trips</a>
            <a href="#" class="text-black font-medium">Saved places</a>
            <a href="#" class="text-black font-medium">Co-Travellers</a>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <!-- Hero Section with Search -->
        <div class="relative mb-12 rounded-3xl overflow-hidden h-64 sm:h-96 shadow-xl">
            <img src="dashboard-bg.jpg" alt="Travel" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div class="w-full max-w-xl px-4">
                    <div class="flex items-center bg-gray-900 bg-opacity-70 rounded-full overflow-hidden">
                        <input 
                            type="text" 
                            placeholder="Search your next destination..."
                            class="flex-1 px-4 sm:px-6 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                        >
                        <button class="mt-2 mx-4 sm:mt-0 sm:ml-2 bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#F19E39"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Drafts Section -->
        <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Recent Drafts</h2>
            <div class="flex flex-wrap gap-4">
                <div class="relative w-1/2 sm:w-40 h-32 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                    <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=300&fit=crop" alt="Bali Trip" class="w-full h-full object-cover brightness-75">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <span class="absolute bottom-3 left-3 text-white text-sm font-semibold">Bali Trip</span>
                </div>
                <div class="relative w-1/2 sm:w-40 h-32 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop" alt="Darjeeling Trip" class="w-full h-full object-cover brightness-75">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <span class="absolute bottom-3 left-3 text-white text-sm font-semibold">Darjeeling Trip</span>
                </div>
                <div class="w-1/2 sm:w-40 h-32 rounded-2xl bg-gray-300 bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition shadow-lg">
                    <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Recommended Section -->
        <div class="mb-12">
            <h2 class="text-xl font-bold mb-6 text-center">Recommended For You:</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div class="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                    <img src="https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&h=300&fit=crop" alt="Lorem Ipsum" class="w-full h-full object-cover brightness-75">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <span class="absolute bottom-3 left-3 text-white text-sm font-semibold">Summer Vibes</span>
                </div>
                <div class="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                    <img src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop" alt="Winter Trips near you" class="w-full h-full object-cover brightness-75">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <span class="absolute bottom-3 left-3 text-white text-sm font-semibold">Winter Trips near you</span>
                </div>
                <div class="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                    <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop" alt="Shopping this season" class="w-full h-full object-cover brightness-75">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <span class="absolute bottom-3 left-3 text-white text-sm font-semibold">Shopping this season</span>
                </div>
                <div class="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                    <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop" alt="Safari" class="w-full h-full object-cover brightness-75">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <span class="absolute bottom-3 left-3 text-white text-sm font-semibold">Safari</span>
                </div>
            </div>
        </div>

        <!-- Action Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
           <div class="bg-[#3A3A3A] text-white rounded-2xl p-8 flex flex-col items-center justify-center h-52 shadow-xl">
                <h3 class="text-4xl font-bold mb-6 text-center">Check out what your Friends are doing!</h3>
                <button class="bg-gray-300 text-gray-800 px-8 py-3 rounded-full flex items-center justify-center hover:bg-gray-400 transition">
                    <span class="font-bold text-2xl">→</span>
                </button>
            </div>
            <div class="grid grid-rows-2 gap-4">
                <div class="bg-[#ADC4CE] text-gray-900 rounded-2xl flex items-center justify-center shadow-xl h-32 sm:h-full">
                    <h3 class="text-4xl font-bold">Share Pictures</h3>
                </div>
                <div class="bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl h-32 sm:h-full">
                    <h3 class="text-4xl font-bold">Review a place</h3>
                </div>
            </div>
        </div>

        <!-- Your Timeline Section -->
        <div class="bg-gray-300 rounded-2xl p-8 text-center mb-8">
            <h2 class="text-4xl font-bold text-gray-700">Your Timeline</h2>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-300 py-6 text-center mt-16">
        <p class="text-gray-800 text-sm">
            ©Odyssey. Made with <span class="text-red-500">❤️</span> by Route6
        </p>
    </footer>

    <!-- Mobile Menu Toggle Script -->
    <script>
        const btn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    </script>
</body>
</html>

```

## File: client\odyssey\resource\login\landingpage.txt
```txt
"use client"; // Make it a client component for interactivity

import React from "react";
import Link from "next/link";
import "./landingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Odyssey</span>
        </div>

        <div className="nav-right">
          <a className="active" href="#">About</a>
          <a href="#">Destinations</a>
          <a href="#">Pricing</a>
          {/* Sign-in navigates to /login */}
          <Link href="/login">
            <button className="signin-btn">Sign-in</button>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="header">
        <div className="first">
          <div id="text">
            <h1>Your Journey, <br /> Unified</h1>
            <p>
              Simplify trip organization with intuitive planning tools and connect with a vibrant
              community of travelers. Powered by AI for personalized itineraries and optimized
              routes.
            </p>
            <br />
            <button className="btn" id="travel">Start Planning Now</button>
            <button className="btn" id="learn">Learn more</button>
          </div>
          <div id="travelIMG">
            <img src="/cover.png" alt="Travel Cover" />
          </div>
        </div>

        {/* Features */}
        <div className="second">
          <div className="box ai">
            <h3>✨ AI Assistant</h3>
            <p>Personalized itineraries generated in seconds</p>
          </div>

          <div className="box routes">
            <h3>🗺️ Smart Routes</h3>
            <p>
              AI-powered route optimization that saves time and money,
              ensuring you visit attractions in the most efficient sequence.
            </p>
          </div>

          <div className="box explore">
            <h3>🌍 Discover and Explore</h3>
            <p>
              Browse destinations categorized by <strong>Nature</strong>,
              <strong>Urban Lifestyle</strong>, and <strong>History & Museums</strong> to find your
              perfect adventure.
            </p>
          </div>

          <div className="box memory">
            <h3>📸 Memory Lane</h3>
            <p>
              Automatically chronicle your travel history with a beautiful timeline of all the places
              you've visited.
            </p>
          </div>

          <div className="box community">
            <h3>👥 Community</h3>
            <p>Connect with travelers worldwide</p>
          </div>

          <div className="box budget">
            <h3>💰 Budget Estimates</h3>
            <p>
              Get accurate cost estimates for transportation, accommodation, and activities before
              you book.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="third">
        <div className="sec">
          <h3>120K+</h3>
          <p>Happy Travellers</p>
        </div>

        <div className="sec">
          <h3>500K+</h3>
          <p>Destinations</p>
        </div>

        <div className="sec">
          <h3>10K+</h3>
          <p>Shared itineraries</p>
        </div>

        <div className="sec">
          <h3>5K+</h3>
          <p>New users daily</p>
        </div>
      </div>

      {/* How it works */}
      <div className="pad">
        <div className="four">
          <h1>How It Works</h1>
          <p>Start your journey in three simple steps</p>
          <h2>1</h2>
          <h4>Search for your target destination and browse through our curated selection of attractions</h4>
          <h2>2</h2>
          <h4>Use our AI assistant or manual planner to create the perfect itinerary with optimized routes and estimated costs</h4>
          <h2>3</h2>
          <h4>Share your journey with the community and discover hidden gems from fellow travelers.</h4>
        </div>
      </div>

      {/* Call to action */}
      <div className="pad">
        <div className="five">
          <div className="plan">
            <h3>Ready to Start Your Adventure?</h3>
            <p>Join thousands of travelers planning their perfect trips</p>
            <button className="start-btn">Start Planning Now</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pad">
        <div className="six">
          <h6>©Odyssey. Made with ❤️ by Route6</h6>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

```

## File: client\odyssey\resource\login\login.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Odyssey - Login</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,400;0,700;1,400&family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Tailwind Font Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        odyssey: ['"Playfair Display"', 'serif'],
                        body: ['Manrope', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#FFF5E9] min-h-screen flex flex-col">
    <!-- Navigation -->
   <nav class="sticky top-4 z-50 px-8 py-4 mx-4 md:mx-16 my-6
            bg-[#FFF5E9]/10 backdrop-blur-lg
            border border-white/30 rounded-2xl shadow-lg">

    <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 flex items-center justify-center">
                <img src="Odyssey_Logo.png" alt="Odyssey Logo" class="w-full h-full object-contain">
            </div>
            <span class="text-2xl font-medium font-odyssey tracking-wider">Odyssey</span>
        </div>

        <!-- Desktop Menu (UNCHANGED) -->
        <div class="hidden md:flex items-center gap-8">
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">About</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Destinations</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
            <button class="px-6 py-2 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 transition font-medium">
                Sign-in
            </button>
        </div>

        <!-- Mobile Hamburger -->
        <button id="menu-btn" class="md:hidden p-2 rounded-lg hover:bg-white/40 transition">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden mt-6 flex flex-col gap-4">
        <a href="#" class="text-gray-700 font-medium">About</a>
        <a href="#" class="text-gray-700 font-medium">Destinations</a>
        <a href="#" class="text-gray-700 font-medium">Pricing</a>
        <button class="w-full px-6 py-2 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 transition font-medium">
            Sign-in
        </button>
    </div>
</nav>

    <!-- Login Form -->
    <div class="flex-1 flex items-center justify-center px-4">
        <div class="bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 class="text-white text-2xl font-semibold mb-2">Welcome Traveller</h2>
            <p class="text-gray-400 text-sm mb-6">Please login with your Odyssey account</p>
            
            <form class="space-y-4">
                <!-- Username -->
                <div>
                    <input 
                        type="text" 
                        placeholder="Username"
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Password -->
                <div>
                    <input 
                        type="password" 
                        placeholder="Password"
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Google Sign-in -->
                <button 
                    type="button"
                    class="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </button>

                <!-- Login Button -->
                <button 
                    type="submit"
                    class="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
                >
                    Login
                </button>

                <!-- Problem logging in link -->
                <div class="text-center pt-2">
                    <a href="#" class="text-gray-400 text-sm hover:text-gray-300 underline">
                        Problem logging in?
                    </a>
                </div>
            </form>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-300 py-6 text-center">
        <p class="text-gray-800 text-sm">
            ©Odyssey. Made with <span class="text-red-500">❤️</span> by Route6
        </p>
    </footer>

<script>
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
</script>

</body>
</html>
```

## File: client\odyssey\resource\login\signup.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Odyssey - Sign Up</title>
     <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,400;0,700;1,400&family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Tailwind Font Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        odyssey: ['"Playfair Display"', 'serif'],
                        body: ['Manrope', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#FFF5E9] min-h-screen">
    <!-- Navigation -->

   <!-- NAVBAR -->
<nav class="sticky top-4 z-50 px-8 py-4 mx-4 md:mx-16 my-6
            bg-[#FFF5E9]/10 backdrop-blur-lg
            border border-white/30 rounded-2xl shadow-lg">

    <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 flex items-center justify-center">
                <img src="Odyssey_Logo.png" alt="Odyssey Logo" class="w-full h-full object-contain">
            </div>
            <span class="text-2xl font-medium font-odyssey tracking-wider">Odyssey</span>
        </div>

        <!-- Desktop Menu (UNCHANGED) -->
        <div class="hidden md:flex items-center gap-8">
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">About</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Destinations</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
            <button class="px-6 py-2 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 transition font-medium">
                Sign-in
            </button>
        </div>

        <!-- Mobile Hamburger -->
        <button id="menu-btn" class="md:hidden p-2 rounded-lg hover:bg-white/40 transition">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden mt-6 flex flex-col gap-4">
        <a href="#" class="text-gray-700 font-medium">About</a>
        <a href="#" class="text-gray-700 font-medium">Destinations</a>
        <a href="#" class="text-gray-700 font-medium">Pricing</a>
        <button class="w-full px-6 py-2 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 transition font-medium">
            Sign-in
        </button>
    </div>
</nav>

    <!-- Sign-up Form -->
    <div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div class="bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 class="text-white text-2xl font-semibold mb-6">Welcome Traveller</h2>
            
            <form class="space-y-4">
                <!-- Name -->
                <div>
                    <label class="text-gray-400 text-sm block mb-2">Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter your name"
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Email -->
                <div>
                    <label class="text-gray-400 text-sm block mb-2">Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email"
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Password -->
                <div>
                    <label class="text-gray-400 text-sm block mb-2">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password"
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Confirm Password -->
                <div>
                    <label class="text-gray-400 text-sm block mb-2">Confirm Password</label>
                    <input 
                        type="password" 
                        placeholder="Confirm"
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Date of Birth -->
                <div>
                    <label class="text-gray-400 text-sm block mb-2">Date of Birth</label>
                    <input 
                        type="date" 
                        class="w-full px-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                </div>

                <!-- Terms Checkbox -->
                <div class="flex items-start gap-2 pt-2">
                    <input 
                        type="checkbox" 
                        id="terms"
                        class="mt-1 w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    >
                    <label for="terms" class="text-gray-400 text-sm">
                        By signing up, you agree to our <a href="#" class="text-green-500 hover:underline">Terms of Service</a> and <a href="#" class="text-green-500 hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <!-- Sign-up Button -->
                <button 
                    type="submit"
                    class="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition mt-6"
                >
                    Sign-up
                </button>

                <!-- Divider -->
                <div class="relative py-4">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-gray-900 text-gray-400">or</span>
                    </div>
                </div>

                <!-- Google Sign-in -->
                <button 
                    type="button"
                    class="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </button>

                <!-- Sign-in Link -->
                <button 
                    type="button"
                    class="w-full py-3 bg-transparent border-2 border-green-500 hover:bg-green-900 text-green-500 font-medium rounded-lg transition"
                >
                    Log in
                </button>
            </form>
        </div>
    </div>
    <br>
     <!-- Footer -->
    <footer class="bg-gray-300 py-6 text-center">
        <p class="text-gray-800 text-sm">
            ©Odyssey. Made with <span class="text-red-500">❤️</span> by Route6
        </p>
    </footer>

<script>
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
</script>
    
</body>
</html>
```

## File: server\package.json
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "@supabase/supabase-js": "^2.89.0",
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.0.1",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}

```

## File: server\scripts\test-ai.js
```js
async function run(message) {
  const res = await fetch("http://localhost:4000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userContext: null, selectedPlaces: [] }),
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

run("make a 2 day itinerary for Rome");

```

## File: server\src\server.js
```js
require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- CRITICAL FOR FRONTEND CONNECTION
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 
const protectedRoutes = require("./routes/protected");
const aiRoutes = require("./routes/ai.routes");
const placeRoutes = require("./routes/placeRoutes");
const clusteringRoutes = require("./routes/clustering.routes");
const tripRoutes = require("./routes/tripRoutes");


const app = express();

// 1. Enable CORS (Allow localhost:3000 to talk to this server)
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000","http://113.11.100.133:55680"],
  credentials: true
}));


// 2. Body Parser (So we can read JSON)
app.use(express.json());

// 3. Connect Database
connectDB();

// 4. Mount Routes
app.use("/api/ai", aiRoutes);


// This means "server/src/routes/auth.js" becomes "http://localhost:PORT/api/auth/..."
app.use('/api/auth', authRoutes);
app.use('/api/user', protectedRoutes);
app.use('/api/ai', placeRoutes);
app.use('/api/clustering', clusteringRoutes);
app.use('/api/trips', tripRoutes);

// 5. Start Server
const PORT = process.env.PORT || 5001; // Defaults to 5001 if .env is missing
app.listen(PORT, () => {
   console.log(`✅ Server running on http://localhost:${PORT}`);
   console.log(`👉 Login Route: http://localhost:${PORT}/api/auth/login`);
   console.log(`👉 Signup Route: http://localhost:${PORT}/api/auth/signup`);
});
```

## File: server\src\config\db.js
```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;

```

## File: server\src\config\supabaseClient.js
```js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SB_PROJECT_URL;
const supabaseKey = process.env.SB_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

```

## File: server\src\middleware\authMiddleware.js
```js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

  try {
    console.log("Verifying token with JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Not set");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully for user:", decoded.username);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ message: "Token is not valid", error: err.message });
  }
};

module.exports = protect;

// its job is to protect routes so only users with a valid JWT can access them.
```

## File: server\src\models\Itinerary.js
```js
const supabase = require("../config/supabaseClient");

/**
 * ITINERARY TABLE SCHEMA (PostgreSQL via Supabase)
 * 
 * Columns:
 * - id (uuid, primary key)
 * - user_id (string, foreign key to User)
 * - trip_name (string)
 * - selected_places (json array)
 * - selected_itinerary (json object with title, schedule, cost)
 * - status (enum: 'draft', 'confirmed')
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

/**
 * CREATE TABLE itineraries (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id VARCHAR NOT NULL,
 *   trip_name VARCHAR NOT NULL,
 *   selected_places JSONB,
 *   selected_itinerary JSONB,
 *   status VARCHAR DEFAULT 'draft',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */

class ItineraryModel {
  /**
   * Save new itinerary to database
   * @param {string} userId - User ID from JWT
   * @param {object} itineraryData - { tripName, selectedPlaces, selectedItinerary, status }
   * @returns {object} saved itinerary with ID
   */
  static async createItinerary(userId, itineraryData) {
    const { tripName, selectedPlaces, selectedItinerary, status = "draft" } = itineraryData;

    const { data, error } = await supabase
      .from("itineraries")
      .insert({
        user_id: userId,
        trip_name: tripName,
        selected_places: selectedPlaces || [],
        selected_itinerary: selectedItinerary || null,
        status: status,
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(`Failed to save itinerary: ${error.message}`);
    }

    return data[0];
  }

  /**
   * Get itinerary by ID
   */
  static async getItineraryById(itineraryId) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", itineraryId)
      .single();

    if (error) {
      console.error("Supabase fetch error:", error);
      throw new Error(`Failed to fetch itinerary: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all itineraries for a user
   */
  static async getUserItineraries(userId) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw new Error(`Failed to fetch user itineraries: ${error.message}`);
    }

    return data;
  }

  /**
   * Update itinerary (for edits & status changes)
   */
  static async updateItinerary(itineraryId, updateData) {
    const { tripName, selectedPlaces, selectedItinerary, status } = updateData;

    const payload = {};
    if (tripName !== undefined) payload.trip_name = tripName;
    if (selectedPlaces !== undefined) payload.selected_places = selectedPlaces;
    if (selectedItinerary !== undefined) payload.selected_itinerary = selectedItinerary;
    if (status !== undefined) payload.status = status;

    // Always update the updated_at timestamp
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("itineraries")
      .update(payload)
      .eq("id", itineraryId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(`Failed to update itinerary: ${error.message}`);
    }

    return data[0];
  }

  /**
   * Delete itinerary
   */
  static async deleteItinerary(itineraryId) {
    const { error } = await supabase
      .from("itineraries")
      .delete()
      .eq("id", itineraryId);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Failed to delete itinerary: ${error.message}`);
    }

    return { success: true };
  }
}

module.exports = ItineraryModel;

```

## File: server\src\models\User.js
```js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dob: {
    type: Date, 
    required: true
  }
});

// Hash password before saving
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

```

## File: server\src\repositories\places.repo.js
```js
// MOCK DB SEARCH — will be replaced by Postgres later

async function searchPlaces(query, filters = {}) {
  //simulate "DB-first" behavior
  if (query.toLowerCase().includes("sea")) {
    return [
      {
        placeId: "db_001",
        name: "Cox's Bazar",
        category: "nature",
        shortDesc: "World’s longest sandy sea beach.",
        estCostPerDay: 3500,
      },
      {
        placeId: "db_002",
        name: "Kuakata",
        category: "nature",
        shortDesc: "Beach famous for sunrise and sunset.",
        estCostPerDay: 3000,
      },
    ];
  }

  return []; // simulate “DB has no good match”
}

module.exports = { searchPlaces };

```

## File: server\src\routes\ai.routes.js
```js
const router = require("express").Router();
const { detectIntent } = require("../services/ai/intent");
const { searchPlaces } = require("../repositories/places.repo");
const { callGemini } = require("../services/ai/geminiClient");
const { makeValidator } = require("../services/ai/validate");

// itinerary prompt
const {
  systemPrompt: itinerarySystemPrompt,
  responseSchema: itineraryResponseSchema,
} = require("../services/ai/prompts/itinerary.prompt");

// search prompt
const {
  systemPrompt: searchSystemPrompt,
  responseSchema: searchResponseSchema,
} = require("../services/ai/prompts/search.prompt");

// multi-itinerary prompt (Stage 2)
const {
  systemPrompt: multiItinerarySystemPrompt,
  responseSchema: multiItineraryResponseSchema,
} = require("../services/ai/prompts/multiItinerary.prompt");

const validateItinerary = makeValidator(itineraryResponseSchema);
const validateSearch = makeValidator(searchResponseSchema);
const validateMultiItinerary = makeValidator(multiItineraryResponseSchema);

router.post("/chat", async (req, res) => {
  try {
    const { message, userContext, selectedPlaces } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    const intent = detectIntent(message);

    // 1) DB-first search (mock for now)
    const dbResults = await searchPlaces(message);

    // If DB found matches for search intent, return them
    if (intent === "search_places" && dbResults.length > 0) {
      return res.json({
        message: "Here are some places from our database.",
        cards: dbResults,
        itineraryPreview: null,
        source: "db",
      });
    }

    // 2) AI: itinerary
    if (intent === "generate_itinerary") {
    const payload = {
        message,
        userContext: userContext ?? null,
        selectedPlaces: selectedPlaces ?? [],
        dbResults: dbResults ?? [],
    };

    // ✅ Option A: do NOT pass schema to Gemini
    const itineraryJson = await callGemini({
        system: itinerarySystemPrompt,
        user: payload,
    });

    //  Validate AI output server-side
    const v = validateItinerary(itineraryJson);
    if (!v.ok) {
        console.error("Invalid itinerary JSON from AI:", v.errors);
        return res.status(502).json({
        message: "AI response was invalid. Please try again.",
        cards: [],
        itineraryPreview: null,
        source: "ai",
        });
    }

    return res.json({
        message: itineraryJson.reply ?? "Here is an itinerary preview.",
        itineraryPreview: itineraryJson.itineraryPreview ?? null,
        cards: itineraryJson.cards ?? [],
        source: "ai",
    });
    }

  // 3) AI: search/discovery
const payload = {
  message,
  userContext: userContext ?? null,
  dbResults: dbResults ?? [],
};

async function getValidSearchJson(payload) {
  // 1st attempt
  const first = await callGemini({
    system: searchSystemPrompt,
    user: payload,
  });

  let v = validateSearch(first);
  if (v.ok) return first;

  console.error("Invalid search JSON from AI (attempt 1):", v.errors);

  // 2nd attempt (retry with strict instruction)
  const retryPayload = {
    ...payload,
    __validationError:
      "Your previous JSON failed validation. You MUST output at least 2 overviewBullets and 3 to 8 cards. Return ONLY valid JSON matching the required shape.",
  };

  const second = await callGemini({
    system: searchSystemPrompt,
    user: retryPayload,
  });

  v = validateSearch(second);
  if (v.ok) return second;

  console.error("Invalid search JSON from AI (attempt 2):", v.errors);
  return null;
}

const searchJson = await getValidSearchJson(payload);

if (!searchJson) {
  return res.status(502).json({
    message: "AI response was invalid. Please try again.",
    bullets: [],
    cards: [],
    itineraryPreview: null,
    source: "ai",
  });
}

//IMPORTANT: map the new fields from your updated search.prompt.js
return res.json({
  message: searchJson.overviewParagraph ?? "Here are some suggestions.",
  bullets: searchJson.overviewBullets ?? [],
  cards: searchJson.cards ?? [],
  itineraryPreview: null,
  source: "ai",
});

  } catch (err) {
    console.error("AI /chat error:", err);
    return res.status(500).json({ error: err.message || "AI error" });
  }
});

/**
 * POST /api/ai/generateItineraries
 * 
 * Stage 2: Generate 3 distinct itinerary options from selected places
 * 
 * Request body:
 * {
 *   selectedPlaces: [{ name, category, ... }],
 *   tripDuration: 3,
 *   userContext: { budget, pace, interests }
 * }
 * 
 * Response: 3 complete itineraries (Minimalist, Maximum, Balanced)
 */
router.post("/generateItineraries", async (req, res) => {
  try {
    const { selectedPlaces, tripDuration, userContext, customRequirements } = req.body;

    if (!selectedPlaces || !Array.isArray(selectedPlaces) || selectedPlaces.length === 0) {
      return res.status(400).json({ error: "selectedPlaces is required (non-empty array)" });
    }

    if (!tripDuration || tripDuration < 1) {
      return res.status(400).json({ error: "tripDuration is required (integer >= 1)" });
    }

    // Prepare payload for AI
    const payload = {
      selectedPlaces,
      tripDuration,
      userContext: userContext ?? null,
    };

    // Add custom requirements if provided
    if (customRequirements && customRequirements.trim()) {
      payload.customRequirements = customRequirements;
    }

    async function getValidMultiItineraryJson(payload, attempt = 1) {
      // Call Gemini with multi-itinerary prompt
      const multiItineraryJson = await callGemini({
        system: multiItinerarySystemPrompt,
        user: payload,
      });

      // Validate AI output server-side
      const validation = validateMultiItinerary(multiItineraryJson);
      if (validation.ok) return multiItineraryJson;

      console.error(`Invalid multi-itinerary JSON from AI (attempt ${attempt}):`, validation.errors);

      // If first attempt failed, retry with strict instructions
      if (attempt === 1) {
        const retryPayload = {
          ...payload,
          __validationError:
            "Your previous JSON failed validation. IMPORTANT: The 'time' field MUST be EXACTLY one of: 'morning', 'afternoon', or 'evening' (lowercase, no times). Return ONLY valid JSON matching the required shape with exactly 3 itineraries.",
        };

        const second = await callGemini({
          system: multiItinerarySystemPrompt,
          user: retryPayload,
        });

        const validationRetry = validateMultiItinerary(second);
        if (validationRetry.ok) return second;

        console.error(`Invalid multi-itinerary JSON from AI (attempt 2):`, validationRetry.errors);
        return null;
      }

      return null;
    }

    const multiItineraryJson = await getValidMultiItineraryJson(payload);

    if (!multiItineraryJson) {
      return res.status(502).json({
        error: "AI response was invalid after 2 attempts. Please try again.",
      });
    }

    // Success: return 3 itinerary options
    return res.json({
      success: true,
      data: multiItineraryJson,
    });

  } catch (err) {
    console.error("AI /generateItineraries error:", err);
    return res.status(500).json({ error: err.message || "Itinerary generation error" });
  }
});

console.log("callGemini args keys:", Object.keys(arguments[0] || {}));

module.exports = router;

```

## File: server\src\routes\auth.js
```js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// -- API -- //

// SIGNUP
router.post("/signup", async (req, res, next) => {
  console.log("Signup Route Hit!"); // <--- Add this
  // console.log("Body:", req.body);   // <--- Add this
  try {
    const { username, password, email, dob } = req.body;
    if (!username || !password || !email || !dob)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ message: "Username or email already taken" });

    const newUser = await User.create({ username, password, email, dob });
    const token = generateToken(newUser)

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email, dob: newUser.dob },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

```

## File: server\src\routes\clustering.routes.js
```js
// src/routes/clustering.routes.js

const router = require("express").Router();
const { callGemini } = require("../services/ai/geminiClient");
const { makeValidator } = require("../services/ai/validate");
const { systemPrompt: clusteringSystemPrompt, responseSchema: clusteringResponseSchema } = require("../services/ai/prompts/clustering.prompt");
const authMiddleware = require("../middleware/authMiddleware");

const validateClustering = makeValidator(clusteringResponseSchema);

/**
 * POST /api/clustering/analyze
 * 
 * User Input: Trip description + preferences
 * AI Output: Geographic clusters with place recommendations
 * 
 * Request body:
 * {
 *   message: "3-day trip to Bangladesh, I like history and nature",
 *   userContext: { budget: "medium", pace: "relaxed", interests: ["history", "nature"] }
 * }
 * 
 * Response:
 * {
 *   overallReasoning: "...",
 *   recommendedDuration: 3,
 *   clusters: [
 *     { clusterName, description, suggestedDays, places: [{name, category, reasoning, estimatedVisitHours, estimatedCost}] }
 *   ]
 * }
 */
router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    // Prepare payload for AI
    const payload = {
      message,
      userContext: userContext ?? null,
    };

    // Call Gemini with clustering prompt
    const clusteringJson = await callGemini({
      system: clusteringSystemPrompt,
      user: payload,
    });

    // Validate AI output server-side
    const validation = validateClustering(clusteringJson);
    if (!validation.ok) {
      console.error("Invalid clustering JSON from AI:", validation.errors);
      return res.status(502).json({
        error: "AI response was invalid. Please try again.",
        validationErrors: validation.errors,
      });
    }

    // Success: return clustered recommendations
    return res.json({
      success: true,
      data: clusteringJson,
    });

  } catch (err) {
    console.error("Clustering /analyze error:", err);
    return res.status(500).json({ error: err.message || "Clustering error" });
  }
});

module.exports = router;

```

## File: server\src\routes\placeRoutes.js
```js
const express = require("express");
const { searchPlacesDynamic, insertPlaceFromAI } = require("../services/placeService.js");

const router = express.Router();

router.get("/places", async (req, res) => {
  try {
    const filters = req.body;
    const places = await searchPlacesDynamic(filters);
    res.json({ source: "db", places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/places", async (req, res) => {
  try {
    const result = await insertPlaceFromAI(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

## File: server\src\routes\protected.js
```js
const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

// GET /profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile fetched successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

```

## File: server\src\routes\tripRoutes.js
```js
// src/routes/tripRoutes.js

const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const ItineraryModel = require("../models/Itinerary");

/**
 * POST /api/trips/save
 * Save a new itinerary (moves from Stage 2 → Stage 3)
 * 
 * Body:
 * {
 *   tripName: "My Bangladesh Trip",
 *   selectedPlaces: [{ name, category, ... }],
 *   selectedItinerary: { title, schedule, estimatedCost },
 *   status: "draft" | "confirmed"
 * }
 */
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { tripName, selectedPlaces, selectedItinerary, status } = req.body;
    const userId = req.user.id; // From authMiddleware

    console.log("POST /api/trips/save called with:", { tripName, selectedPlaces, userId });

    if (!tripName) {
      return res.status(400).json({ error: "tripName is required" });
    }

    if (!selectedPlaces || !Array.isArray(selectedPlaces)) {
      return res.status(400).json({ error: "selectedPlaces must be an array" });
    }

    const itinerary = await ItineraryModel.createItinerary(userId, {
      tripName,
      selectedPlaces,
      selectedItinerary: selectedItinerary || null,
      status: status || "draft",
    });

    console.log("Itinerary saved successfully:", itinerary);

    return res.status(201).json({
      success: true,
      message: "Itinerary saved successfully",
      data: itinerary,
    });

  } catch (err) {
    console.error("POST /save error:", err);
    return res.status(500).json({ error: err.message || "Failed to save itinerary" });
  }
});

/**
 * GET /api/trips
 * Get all itineraries for logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const itineraries = await ItineraryModel.getUserItineraries(userId);

    return res.json({
      success: true,
      data: itineraries,
    });

  } catch (err) {
    console.error("GET / error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch itineraries" });
  }
});

/**
 * GET /api/trips/:id
 * Get single itinerary by ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const itinerary = await ItineraryModel.getItineraryById(id);

    // Verify ownership
    if (itinerary.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({
      success: true,
      data: itinerary,
    });

  } catch (err) {
    console.error("GET /:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch itinerary" });
  }
});

/**
 * PUT /api/trips/:id
 * Update itinerary (edit places, change status, regenerate)
 * 
 * Body: Partial update
 * {
 *   tripName?: "Updated Name",
 *   selectedPlaces?: [...],
 *   selectedItinerary?: {...},
 *   status?: "confirmed"
 * }
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { tripName, selectedPlaces, selectedItinerary, status } = req.body;

    // Verify ownership first
    const existing = await ItineraryModel.getItineraryById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await ItineraryModel.updateItinerary(id, {
      tripName,
      selectedPlaces,
      selectedItinerary,
      status,
    });

    return res.json({
      success: true,
      message: "Itinerary updated successfully",
      data: updated,
    });

  } catch (err) {
    console.error("PUT /:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to update itinerary" });
  }
});

/**
 * DELETE /api/trips/:id
 * Delete itinerary
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership first
    const existing = await ItineraryModel.getItineraryById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await ItineraryModel.deleteItinerary(id);

    return res.json({
      success: true,
      message: "Itinerary deleted successfully",
    });

  } catch (err) {
    console.error("DELETE /:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete itinerary" });
  }
});

module.exports = router;

```

## File: server\src\services\placeService.js
```js
const supabase = require("../config/supabaseClient");

/// -- ->Note for other developers working with AI -- //
async function searchPlacesDynamic(filters) {
  let query = supabase.from("places").select("*");

  const orConditions = [];

  // ->Optional not mendatory to match but if matches it will provide the matching category from the db
  if (filters.category) {
    orConditions.push(`primary_category.ilike.%${filters.category}%`);
  }

  // ->(Optional) If matches good if not matches will check for other options
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    filters.tags.forEach((tag) => {
      orConditions.push(`tags.cs.{${tag}}`);
    });
  }

  if (orConditions.length > 0) {
    query = query.or(orConditions.join(","));
  }

  // ->Region match (must match if provided)
  if (filters.region) {
    query = query.ilike("region", `%${filters.region}%`);
  }

  // ->Country match (must match if provided)
  if (filters.country) {
    query = query.ilike("country", `%${filters.country}%`);
  }

  // ->(must match if provided)
  if (filters.min_cost) {
    query = query.gte("est_cost_per_day", Number(filters.min_cost));
  }
  // ->(must match if provided)
  if (filters.max_cost) {
    query = query.lte("est_cost_per_day", Number(filters.max_cost));
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}

async function insertPlaceFromAI(place) {
  const {
    name,
    primary_category,
    tags,
    short_desc,
    visit_duration_min,
    est_cost_perday,
    country,
    region,
    latitude,
    longitude
  } = place;

  // Basic Validation
  if (!name || !country || !region || !latitude || !longitude) {
    throw new Error("Missing required fields");
  }

  //Check-1: Name + Region Duplicate Check
   const { data: nameMatches } = await supabase
    .from("places")
    .select("id")
    .ilike("name", name)
    .ilike("country", country)
    .ilike("region", region);

  if (nameMatches && nameMatches.length > 0) {
    return { status: "duplicate", reason: "name_region_match" };
  }

  //Check-2: Geo proximity Check (300m rad)
  const { data: geoMatches } = await supabase.rpc(
    "find_places_nearby",
    {
      lat: latitude,
      lon: longitude,
      radius_meters: 300
    }
  );

  if (geoMatches && geoMatches.length > 0) {
    return { status: "duplicate", reason: "geo_match" };
  }

  //Check-3: Normalize tags & category
  const cleanTags = [...new Set(tags.map(t => t.toLowerCase().trim()))];
  const cleanCategory = primary_category.toLowerCase().trim();

  //Insert
  const { data, error } = await supabase
    .from("places")
    .insert([{
      name,
      primary_category: cleanCategory,
      tags: cleanTags,
      short_desc,
      visit_duration_min,
      est_cost_perday,
      country,
      region,
      location: `POINT(${longitude} ${latitude})`,
      source: "ai",
      verified: false
    }]);

  if (error) throw error;

  return { status: "inserted", data };

}

module.exports = { searchPlacesDynamic, insertPlaceFromAI };

```

## File: server\src\services\ai\geminiClient.js
```js
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function callGemini({ system, user}) {
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");

  const prompt = `
SYSTEM:
${system}

USER:
${typeof user === "string" ? user : JSON.stringify(user)}
`.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!resp.ok) throw new Error(`Gemini error ${resp.status}: ${await resp.text()}`);

  const data = await resp.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini did not return valid JSON. Raw:\n" + text);
  }
}

module.exports = { callGemini };

```

## File: server\src\services\ai\intent.js
```js
function detectIntent(message) {
  const m = message.toLowerCase();

  if (m.includes("itinerary") || m.includes("plan") || m.includes("days")) {
    return "generate_itinerary";
  }

  return "search_places";
}

module.exports = { detectIntent };

```

## File: server\src\services\ai\validate.js
```js
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function makeValidator(schema) {
  const validate = ajv.compile(schema);

  return (data) => {
    const ok = validate(data);
    return {
      ok,
      errors: ok ? null : validate.errors,
    };
  };
}

module.exports = { makeValidator };

```

## File: server\src\services\ai\prompts\clustering.prompt.js
```js
// src/services/ai/prompts/clustering.prompt.js

const systemPrompt = `
You are a travel planning assistant specializing in destination clustering and discovery.

Your task: Analyze the user's trip requirements and suggest which places should be visited,
grouped by SPECIFIC GEOGRAPHIC LOCATIONS (cities, neighborhoods, regions). For each location,
explain why these places work well together.

Hard rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Categories allowed: nature, history, museum, urban, beach, adventure.
- Each place must have: name, placeId (if known, else null), category, reasoning (why include this place).
- Group places by SPECIFIC CITY/REGION names (e.g., "Sylhet City", "Sreemangal", "Cox's Bazar", "Dhaka")
- Use REAL location names that users would recognize (NOT generic names like "Northern Region")
- Provide 2-5 location groups, with 2-4 places per location.
- Add a brief explanation of why these specific locations are recommended for the trip.

OUTPUT JSON SHAPE (example):
{
  "overallReasoning": "string (2-3 sentences on why these locations)",
  "recommendedDuration": "integer (suggested days for all locations)",
  "clusters": [
    {
      "clusterName": "Sylhet City",
      "description": "string (why this location is worth visiting)",
      "suggestedDays": integer (recommended days for this location),
      "places": [
        {
          "name": "string",
          "placeId": "string (Google Place ID if known) or null",
          "category": "nature|history|museum|urban|beach|adventure",
          "reasoning": "string (why include this place for your trip)",
          "estimatedVisitHours": integer (hours to spend),
          "estimatedCost": number (daily cost in local currency)
        }
      ]
    }
  ]
}
`.trim();

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallReasoning: { type: "string" },
    recommendedDuration: { type: "integer", minimum: 1, maximum: 90 },
    clusters: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          clusterName: { type: "string" },
          description: { type: "string" },
          suggestedDays: { type: "integer", minimum: 1, maximum: 30 },
          places: {
            type: "array",
            minItems: 1,
            maxItems: 8,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                placeId: { type: ["string", "null"] },
                category: {
                  type: "string",
                  enum: ["nature", "history", "museum", "urban", "beach", "adventure"],
                },
                reasoning: { type: "string" },
                estimatedVisitHours: { type: "integer", minimum: 1, maximum: 48 },
                estimatedCost: { type: "number", minimum: 0 },
              },
              required: ["name", "placeId", "category", "reasoning", "estimatedVisitHours", "estimatedCost"],
            },
          },
        },
        required: ["clusterName", "description", "suggestedDays", "places"],
      },
    },
  },
  required: ["overallReasoning", "recommendedDuration", "clusters"],
};

module.exports = { systemPrompt, responseSchema };

```

## File: server\src\services\ai\prompts\itinerary.prompt.js
```js
// src/services/ai/prompts/itinerary.prompt.js

const systemPrompt = `
You are a travel planning assistant for a trip planning application.

Rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Categories allowed: nature, history & museum, urban.
- visitDurationMin = typical minutes spent at the place (integer minutes).
- If not from the database, placeId must be null.
- Use time slots: morning, afternoon, evening.

OUTPUT JSON SHAPE (example):
{
  "reply": "string",
  "itineraryPreview": {
    "days": [
      {
        "day": 1,
        "items": [
          {
            "placeId": null,
            "name": "string",
            "category": "nature|history & museum|urban",
            "visitDurationMin": 90,
            "time": "morning|afternoon|evening"
          }
        ]
      }
    ],
    "estimatedTotalCost": 0
  }
}
`.trim();

// KEEP THIS for AJV validation (do NOT send to Gemini in Option A)
const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: { type: "string" },
    itineraryPreview: {
      type: "object",
      additionalProperties: false,
      properties: {
        days: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              day: { type: "integer", minimum: 1 },
              items: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    placeId: { type: ["string", "null"] },
                    name: { type: "string" },
                    category: { type: "string", enum: ["nature", "history & museum", "urban"] },
                    visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
                    time: { type: "string", enum: ["morning", "afternoon", "evening"] }
                  },
                  required: ["placeId", "name", "category", "visitDurationMin", "time"]
                }
              }
            },
            required: ["day", "items"]
          }
        },
        estimatedTotalCost: { type: "number", minimum: 0 }
      },
      required: ["days", "estimatedTotalCost"]
    }
  },
  required: ["reply", "itineraryPreview"]
};

module.exports = { systemPrompt, responseSchema };

```

## File: server\src\services\ai\prompts\multiItinerary.prompt.js
```js
// src/services/ai/prompts/multiItinerary.prompt.js

const systemPrompt = `
You are a travel planning assistant specializing in multi-option itinerary generation.

Your task: Generate 3 DISTINCT itinerary options for the user's trip, each with a different 
travel philosophy (Minimalist, Maximum Adventure, Balanced). Each option should be a complete,
day-by-day schedule with specific times and activities.

CUSTOM REQUIREMENTS (Optional):
If customRequirements field exists in payload, incorporate those preferences into all 3 options.
Example: If user requires "visit museum first", place the museum as the first activity.
However, prioritize valid JSON structure and schema compliance above all else.

Hard rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Generate exactly 3 itineraries with different strategies
- Each itinerary must cover ALL selected places
- Categories allowed: nature, history, museum, urban, beach, adventure.
- visitDurationMin = minutes spent at place (15-1440 minutes)
- time field MUST be EXACTLY ONE OF: "morning", "afternoon", "evening" (lowercase, single word only)
- timeRange field is for detailed times like "09:00-12:30" (separate from time field)
- Each option MUST have: title, description, schedule (days with items), estimatedCost, paceDescription

- Try to include the real Google Maps 'placeId' if you are confident. otherwise set it to null.
CRITICAL: The 'time' field must ONLY contain: morning, afternoon, evening
Do NOT put actual clock times in the 'time' field.

OUTPUT JSON SHAPE (example):
{
  "itineraries": [
    {
      "id": "opt-1",
      "title": "Minimalist Explorer",
      "description": "Relaxed pace with deep immersion at fewer stops",
      "paceDescription": "2-3 hours per place, long transitions",
      "estimatedCost": 8000,
      "schedule": [
        {
          "day": 1,
          "date": "Jan 20, 2025",
          "items": [
            {
              "placeId": null,
              "name": "string",
              "category": "nature|history|museum|urban|beach|adventure",
              "time": "morning",
              "timeRange": "09:00-12:30",
              "visitDurationMin": 180,
              "notes": "Why this timing for this place"
            }
          ]
        }
      ]
    },
    {
      "id": "opt-2",
      "title": "Maximum Adventure",
      "description": "Fast-paced with maximum place coverage",
      "paceDescription": "1-2 hours per place, optimized routing",
      "estimatedCost": 12000,
      "schedule": [...]
    },
    {
      "id": "opt-3",
      "title": "Balanced Discovery",
      "description": "Medium pace balancing exploration and relaxation",
      "paceDescription": "2-3 hours per place, moderate transitions",
      "estimatedCost": 10000,
      "schedule": [...]
    }
  ]
}
`.trim();

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itineraries: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          paceDescription: { type: "string" },
          estimatedCost: { type: "number", minimum: 0 },
          schedule: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                day: { type: "integer", minimum: 1 },
                date: { type: "string" },
                items: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      placeId: { type: ["string", "null"] },
                      name: { type: "string" },
                      category: {
                        type: "string",
                        enum: ["nature", "history", "museum", "urban", "beach", "adventure"],
                      },
                      time: { type: "string", enum: ["morning", "afternoon", "evening"] },
                      timeRange: { type: "string" },
                      visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
                      notes: { type: "string" },
                    },
                    required: ["placeId", "name", "category", "time", "timeRange", "visitDurationMin", "notes"],
                  },
                },
              },
              required: ["day", "date", "items"],
            },
          },
        },
        required: ["id", "title", "description", "paceDescription", "estimatedCost", "schedule"],
      },
    },
  },
  required: ["itineraries"],
};

module.exports = { systemPrompt, responseSchema };

```

## File: server\src\services\ai\prompts\search.prompt.js
```js
// src/services/ai/prompts/search.prompt.js

const systemPrompt = `
You are a travel discovery assistant for a trip planning app.

Hard rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Categories allowed: nature, history, museum, urban.
- If a place is not from the database, placeId must be null.
- This is DISCOVERY mode (itineraryPreview must be null).
- overviewBullets MUST contain at least 2 items.
- cards MUST contain between 3 and 8 items (never fewer than 3).
- If you struggle to find enough places, include the best-known nearby alternatives to reach 3+ cards.

Output structure (MUST follow this order and keys):
1) overviewParagraph (longer): 8–12 sentences, friendly, descriptive.
2) overviewBullets: bullet-style strings (2–6 items). Each bullet MUST mention a place name and typical visit time in minutes.
3) cards: 3–8 place cards.

Field rules for cards:
- shortDesc: 1–2 sentences
- details: 4–8 sentences (more elaborated)
- visitDurationMin: integer minutes
- estCostPerDay: estimated daily cost in local currency (number)

OUTPUT JSON SHAPE (example):
{
  "overviewParagraph": "string",
  "overviewBullets": ["string", "string"],
  "cards": [
    {
      "placeId": null,
      "name": "string",
      "category": "nature|history|museum|urban",
      "shortDesc": "string",
      "details": "string",
      "visitDurationMin": 60,
      "estCostPerDay": 0
    }
  ],
  "itineraryPreview": null
}
`.trim();

// KEPT for AJV validation (do NOT send to Gemini)
const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overviewParagraph: { type: "string" },
    overviewBullets: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: { type: "string" },
    },
    cards: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          placeId: { type: ["string", "null"] },
          name: { type: "string" },
          category: { type: "string", enum: ["nature", "history", "museum", "urban"] },
          shortDesc: { type: "string" },
          details: { type: "string" },
          visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
          estCostPerDay: { type: "number", minimum: 0 },
        },
        required: ["placeId", "name", "category", "shortDesc", "details", "visitDurationMin", "estCostPerDay"],
      },
    },
    itineraryPreview: { type: "null" },
  },
  required: ["overviewParagraph", "overviewBullets", "cards", "itineraryPreview"],
};

module.exports = { systemPrompt, responseSchema };

```

