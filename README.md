# Contact App

A React contact management application built with Vite. Add, edit, delete, search and tag your contacts, all backed by a mock REST API powered by [json-server](https://github.com/typicode/json-server).

## Features

- **Add & Edit contacts** with validation (via `react-hook-form` + `yup`)
- **Delete** single contacts or multiple selected contacts
- **Search/filter** contacts by name, last name, email, phone or tag
- **Tags** to categorize contacts (up to 5 per contact)
- Toast-style alerts and confirmation modals

## Tech Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [react-hook-form](https://react-hook-form.com) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers) + [yup](https://github.com/jquense/yup) for forms & validation
- [axios](https://axios-http.com) for HTTP requests
- [react-icons](https://react-icons.github.io/react-icons)
- [json-server](https://github.com/typicode/json-server) as a mock REST API

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend (json-server)

The app reads/writes contacts on `http://localhost:3000` (see [`src/service/api.js`](src/service/api.js)). Start json-server against the included [`db.json`](db.json):

```bash
npx json-server db.json --port 3000
```

> Alternatively install it globally with `npm install -g json-server` and run `json-server db.json --port 3000`.

### 3. Start the frontend

In a second terminal, start the Vite dev server:

```bash
npm run dev
```

Open the URL printed in the terminal (defaults to `http://localhost:5173`).

## Available Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the Vite dev server         |
| `npm run build`  | Build the production bundle       |
| `npm run preview`| Preview the production build      |
| `npm run lint`   | Run ESLint                        |

## Project Structure

```
├── db.json                      # json-server database (contacts)
├── index.html
├── src/
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # App entry point
│   ├── global.css
│   ├── components/              # UI components (Contacts, TagInput, Modal, ...)
│   ├── const/input.js           # Form input field definitions
│   ├── context/ContactContext.jsx  # Global state + API actions (Context/useReducer)
│   └── service/api.js           # Configured axios instance
```

## API

The app uses a REST API on `http://localhost:3000/contacts`. Endpoints used by the app:

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/contacts`         | List all contacts    |
| POST   | `/contacts`         | Create a contact     |
| PUT    | `/contacts/:id`     | Update a contact     |
| DELETE | `/contacts/:id`     | Delete a contact     |

Contact shape:

```json
{
  "name": "lia",
  "lastName": "testName",
  "email": "example@gmail.com",
  "phone": "9129876543",
  "tags": ["school"],
  "id": "TowRVI4OAd8"
}
```