# Project Odyssey

A smart, interactive travel companion platform that delivers automated, personalized weekly itineraries. Connect with friends, share your travel plans, and unlock gamified achievements as you explore the world.

## Features

- **Personalized Itineraries**: Get automated, tailored travel recommendations delivered to you every week.
- **Social Trip Planning**: Connect with other travelers, plan trips together, and share your experiences.
- **Gamified Experiences**: Earn rewards and unlock achievements as you visit new places and complete travel goals.
- **Geofencing Verification**: Automatically check-in to locations and verify your visits.

## Setup Instructions

### 1. Database Setup (Supabase)

To enable the recommendation system and social features, you must create the required tables in your Supabase project:

1. Open the [Supabase Dashboard](https://app.supabase.com/).
2. Select your project and open the **SQL Editor**.
3. Create a new query.
4. Copy the contents of `server/src/config/create_recommendation_tables.sql` and paste them into the editor.
5. Click **Run**.

### 2. Environment Variables

Ensure your `server/.env` file contains:

- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `SB_PROJECT_URL`: Your Supabase Project URL.
- `SB_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (required for table operations).

### 3. Weekly Automation

The travel recommendations refresh automatically every Sunday at 00:00 server time using `node-cron`.

---

## License & Copyright

**Proprietary and Confidential.**

This software is patented and property of **[Deatrax Innovations](https://github.com/Deatrax-Innovations)**. All rights are reserved by the copyright holder, Sadman Shaharier. 

This repository is provided strictly for nominal viewing and local, non-commercial evaluation purposes by authorized personnel only. 

You are **strictly prohibited** from:
- Copying, reproducing, or permanently downloading this software.
- Modifying or creating derivative works.
- Distributing, publishing, or using this code in any public or private project.
- Utilizing this software for any commercial purpose.
- Reverse-engineering or decompiling the source code in any way.

Any unauthorized use, reproduction, or distribution without explicit prior written permission will result in severe civil and criminal penalties. See the [`LICENSE`](LICENSE) file for complete terms and conditions.
