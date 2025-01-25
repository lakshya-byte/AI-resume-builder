# AI Resume Builder 🚀

Create resumes that stand out with **AI-powered tools** and advanced customization options! This project brings together cutting-edge tech to make resume building a breeze.

---

## 🌟 Features

### 1. **AI-Powered Resume Generation**
- Generate work experience and summaries using the **ChatGPT API**.

### 2. **Subscription Tiers with Stripe Checkout**
- Free Plan: Create **1 resume**.
- Pro Plan: Create up to **3 resumes**.
- Pro Plus Plan: **Unlimited resumes**.
- Manage your subscription via a customer portal.

### 3. **Advanced Resume Customization**
- **Dynamic Forms**: Build resumes step-by-step with **React Hook Form** and **useFieldArray**.
- **Drag & Drop**: Reorder sections using **dnd-kit**.
- **Autosave**: Automatically save changes with debounce.
- **Design Options**: Customize layouts and styles.

### 4. **File Handling & Exporting**
- Upload images directly to **Vercel Blob**.
- Print or save resumes as PDF with **react-to-print**.

### 5. **Optimized Performance**
- **Frontend & Backend Validation**: Robust input validation with **Zod schemas**.
- **Intelligent Caching**: Optimized data flow with global context providers.
- **State Management**: Smooth navigation with **Zustand** and URL search params.

### 6. **Responsive & Themed UI**
- Built with **Tailwind CSS** and **Shadcn UI**.
- Fully mobile-responsive.
- Supports **dark mode**, **light mode**, and system theme.

### 7. **Database & Authentication**
- **Postgres DB** powered by **Prisma ORM**.
- Secure authentication using **Clerk v6**.

---

## 📚 Tech Stack

### **Frontend**
- React
- Tailwind CSS
- Zustand
- Shadcn UI

### **Backend**
- Node.js
- Next.js (Server Actions & API Route Handlers)

### **AI Integration**
- OpenAI's ChatGPT API

### **Payments**
- Stripe Checkout & Customer Portal

### **Database**
- PostgreSQL with Prisma ORM

---

## 🛠️ Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/AI-resume-builder.git
cd AI-resume-builder
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
CLERK_API_KEY=your_clerk_api_key
CHATGPT_API_KEY=your_openai_api_key
```

### Run the Application
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

---

## 🌐 Live Demo
[View Live Demo](https://your-live-demo-link.com)

---

## 🤝 Credits

A special thanks to everyone who helped in building this project:
- **[@Lakshya](https://github.com/your-profile)** - Developer & Visionary.
- **[@Krishna](https://github.com/krishna-profile)** - Debugging and Backend Support.
- Community contributors for inspiration and feedback.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 💬 Feedback
Have suggestions or issues? Feel free to open an issue or reach out via [LinkedIn](https://www.linkedin.com/in/your-profile).

---

### Let’s revolutionize resume building with AI! 🚀
