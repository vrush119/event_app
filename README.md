# Event App

A full-stack event management app built with React Native (Expo) for the frontend and Node.js, Apollo Server, and Prisma/PostgreSQL for the backend.

---

## 🚀 Installation & Setup

### 1. **Clone the repository**
```sh
git clone https://github.com/vrush119/event_app.git
cd event_app
```

---

### 2. **Backend Setup**

#### a. Install dependencies
```sh
cd backend
npm install
```

#### b. Configure environment variables

Create a `.env` file in the `backend` folder with the following (edit as needed):
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/eventdb"
JWT_SECRET="supersecret"
```

#### c. Run Prisma migrations & generate client
```sh
npx prisma migrate dev --name init
npx prisma generate
```

#### d. Seed the database
```sh
npx ts-node seed.ts
```

#### e. Start the backend server
```sh
npm run dev
```
The backend will run by default on [http://localhost:4000/graphql](http://localhost:4000/graphql).

---

### 3. **Frontend Setup**

#### a. Install dependencies
```sh
cd ../
npm install
```

#### b. Update Apollo Client URI

In your frontend code (usually in `app/_layout.tsx` or similar), set the Apollo Client URI to your backend server.  
If running on a real device, use your computer's local IP address:
```js
const client = new ApolloClient({
  uri: 'http://YOUR_LOCAL_IP:4000/graphql',
  cache: new InMemoryCache(),
});
```

#### c. Start the Expo app
```sh
npx expo start
```
Scan the QR code with Expo Go app on your mobile device.

---

## 🧑‍💻 How to Run Locally

1. **Start PostgreSQL** and ensure your database is running.
2. **Start the backend** (`npm run dev` in `backend`).
3. **Start the frontend** (`npx expo start` in the project root).
4. **Open the app** in Expo Go on your device or in an emulator.

---

## 🔑 Example Credentials

Use these credentials to log in (from the seed data):

| Email                   | Password |
|-------------------------|----------|
| vrushali@example.com    | pass123  |
| ankit@example.com       | pass123  |
| sana@example.com        | pass123  |
| dev@example.com         | pass123  |

---

## 📝 Notes

- If you change the backend port or database credentials, update them in the `.env` file and frontend Apollo Client URI.
- If you get network errors on a real device, make sure your backend is accessible via your computer's local IP and your firewall allows incoming connections.

---

## 📂 Project Structure

```
event_app/
  app/           # React Native (Expo) frontend
  backend/       # Node.js, Apollo Server, Prisma backend
    prisma/      # Prisma schema and migrations
    seed.ts      # Database seeding script
```

---

## 🤝 Contributing

Pull requests are welcome!
