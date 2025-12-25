# 🎬 MOVION

MOVION is a modern, cinematic movie discovery web application that combines real-time data from **TMDB** with **AI-powered recommendations** to deliver a premium, immersive browsing experience. Designed with a strong focus on animations, responsiveness, and user experience, MOVION feels fast, fluid, and visually striking across all devices.

---

## 🚀 Features

### 🎥 Movie Discovery

* Browse movies by **genre** (Action, Romance, Horror, Anime, Sci‑Fi, etc.)
* Popular, top‑rated, and dynamically fetched movie lists
* Infinite scrolling for seamless exploration

### 🤖 AI Recommendations

* Personalized movie recommendations using **Ollama (Qwen 2.5)**
* Smart fallback to TMDB top‑rated content if AI fails
* Watchlist‑aware suggestions (avoids duplicates)

### 🔐 Authentication

* Secure **Login & Signup** flow
* Token‑based authentication
* Protected routes for authenticated users

### ⚡ Performance & UX

* Global animated loader (MOVION wordmark)
* Smooth page transitions using **Framer Motion**
* Zero layout shifts during navigation
* Slider components that never hijack page scroll

### 📱 Fully Responsive

* Optimized for desktop, tablet, and mobile
* Carefully tuned layouts for small screens
* No horizontal overflow or scroll traps

---

## 🛠️ Tech Stack

### Frontend

* **React (Vite)**
* **Tailwind CSS**
* **Framer Motion** (animations)
* **Swiper.js** (sliders)
* **React Router**

### Backend

* **Node.js + Express**
* **MongoDB** (optional, non‑blocking)
* **TMDB API**
* **Ollama (local AI inference)**

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/movion.git
cd movion
```

---

### 2️⃣ Environment Variables

Create a `.env` file in both **frontend** and **backend** (if separated).

#### Backend `.env`

```env
TMDB_API_KEY=your_tmdb_api_key
MONGO_URI=your_mongodb_uri_optional
```

> MongoDB is optional — the app runs even if it is not connected.

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Run Ollama (AI Engine)

Make sure Ollama is installed.

```bash
ollama serve
ollama pull qwen2.5:1.5b
```

Test manually (optional):

```bash
ollama run qwen2.5:1.5b
```

---

### 5️⃣ Start the App

```bash
npm run dev
```

Backend (if separate):

```bash
npm start
```

---

## 🧠 AI Recommendation Flow

1. User preferences are sent to backend
2. Ollama (Qwen 2.5) generates movie titles
3. Titles are enriched using TMDB search
4. Duplicates are removed
5. Fallback to TMDB Top‑Rated if AI fails

This ensures reliability even with non‑deterministic AI output.

---

## 🎨 Design Philosophy

* **Cinematic first** — visuals matter
* **Motion with purpose** — no unnecessary animation
* **Consistency** — same color system, fonts, and spacing everywhere
* **Performance over features** — smoothness beats clutter

---

## 🔒 Security Notes

* Tokens are stored client‑side
* Sensitive keys are never committed
* AI requests are server‑side only
* Input validation on all backend routes

---

## 📈 Future Improvements

* User profiles & saved watchlists
* Streaming platform availability
* Recommendation history
* Social sharing
* PWA support

---

## 🧪 Pre‑Launch Checklist (Passed)

* ✅ Responsive on all screen sizes
* ✅ Global loader implemented
* ✅ Error & empty state handling
* ✅ AI fallback logic
* ✅ No scroll hijacking
* ✅ Clean build with no warnings

---

## 👤 Author

**Khan**
Frontend Developer & UI Engineer

---

## 📄 License

This project is for educational and portfolio purposes.

---

> MOVION is not just a movie app — it is an experience.
"# Movion" 
