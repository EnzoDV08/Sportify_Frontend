![Sportify Header Image](./ReadMeAssets/ReadMeFile.png)
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors](https://img.shields.io/github/contributors/EnzoDV08/Sportify_Frontend.svg?style=for-the-badge)](https://github.com/EnzoDV08/Sportify_Frontend/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/EnzoDV08/Sportify_Frontend.svg?style=for-the-badge)](https://github.com/EnzoDV08/Sportify_Frontend/network/members)
[![Stargazers](https://img.shields.io/github/stars/EnzoDV08/Sportify_Frontend.svg?style=for-the-badge)](https://github.com/EnzoDV08/Sportify_Frontend/stargazers)
[![Issues](https://img.shields.io/github/issues/EnzoDV08/Sportify_Frontend.svg?style=for-the-badge)](https://github.com/EnzoDV08/Sportify_Frontend/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [About Sportify](#about-sportify)
- [Built With](#built-with)
- [How To Install](#how-to-install)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Open the Project Directory](#step-2-open-the-project-directory)
  - [Step 3: Install Dependencies](#step-3-install-dependencies)
  - [Step 4: Environment Setup](#step-4-environment-setup)
  - [Step 5: Running Locally](#step-5-running-locally)
  - [Step 6: Deployment Options](#step-6-deployment-options)
- [Features](#features)
- [The Idea](#the-idea)
- [Development Process](#development-process)
  - [Highlights](#highlights)
  - [Challenges](#challenges)
- [Future Implementations](#future-implementations)
- [Mockups](#mockups)
- [Other Resources](#other-resources)
- [License](#license)
- [Contributing](#contributing)
- [Authors](#authors)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

# About Sportify

**Sportify** is a web-based platform that empowers individuals and organizations to create, host, and participate in a wide range of sporting events. Designed with accessibility, community, and competition in mind, Sportify allows users to browse nearby events, manage participants, invite friends, and compete for rankings on the leaderboard. With features like Google authentication and two-step verification, Sportify ensures a secure and engaging environment for sports enthusiasts of all kinds.

## Built With

<p align="left">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
  <a href="https://daisyui.com/"><img src="https://img.shields.io/badge/DaisyUI-E879F9?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="DaisyUI" /></a>
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=47848F" alt="Electron" /></a>
  <a href="https://developers.google.com/identity"><img src="https://img.shields.io/badge/GoogleAuth-FFFFFF?style=for-the-badge&logo=google&logoColor=4285F4" alt="Google Auth" /></a>
  <a href="https://www.netlify.com/"><img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" /></a>
  <a href="https://render.com/"><img src="https://img.shields.io/badge/Render-00979D?style=for-the-badge&logo=render&logoColor=white" alt="Render" /></a>
  <a href="https://reactrouter.com/"><img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" /></a>
  <a href="https://react-icons.github.io/react-icons/"><img src="https://img.shields.io/badge/React_Icons-4A4A4A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Icons" /></a>
  <a href="https://fkhadra.github.io/react-toastify/"><img src="https://img.shields.io/badge/React_Toastify-FF6D00?style=for-the-badge&logo=react&logoColor=white" alt="React Toastify" /></a>
  <a href="https://unsplash.com/developers"><img src="https://img.shields.io/badge/Unsplash_API-000000?style=for-the-badge&logo=unsplash&logoColor=white" alt="Unsplash API" /></a>
  <a href="https://developers.google.com/maps"><img src="https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Google Maps" /></a>
</p>
<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## How To Install

### Step 1: Clone the Repository

You can either:
- **Option A:** Click "Code" on the [GitHub repo](https://github.com/EnzoDV08/Sportify_Frontend.git), then choose "Open with GitHub Desktop"
- **Option B:** Use the terminal to clone the repo:

```bash
git clone https://github.com/EnzoDV08/Sportify_Frontend.git
```

### Step 2: Open the Project Directory

If using the terminal:
```bash
cd Sportify_Frontend
```
If using GitHub Desktop, the folder should be opened automatically in your editor after cloning.

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Environment Setup

Create a `.env` file in the root directory. Below is an example template—**do not use the actual keys from our deployment**:

```env
VITE_API_BASE_URL=your_backend_url_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_UNSPLASH_KEY=your_unsplash_access_key_here
```

If you're running the backend locally, set `VITE_API_BASE_URL=http://localhost:5000`. Otherwise, use your own Render or similar deployment URL.

### Step 5: Running Locally

```bash
cd Sportify
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 6: Deployment Options

You can run this project in one of the following ways:

1. **Local Deployment** – Follow the steps above with your local backend running.
2. **Deploy to Netlify** – Connect this GitHub repo to [Netlify](https://www.netlify.com/), add your environment variables under Site Settings > Environment, and deploy.
3. **Use Our Hosted Site** – Visit the live site at: [https://sportifydebuggers.netlify.app/](https://sportifydebuggers.netlify.app/) *(or your own deployment URL)*.
te** – Visit the live site at: [https://sportifydebuggers.netlify.app/](https://sportifydebuggers.netlify.app/) *(or your deployment URL)*.


Then open `http://localhost:5173` in your browser.
<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## Features

| Page                      | Description |
|---------------------------|-------------|
| **Sign Up / Login**       | Supports both Google OAuth and email/password login for flexible access. |
| **Organization Signup**   | Dedicated registration form for organizations to host and manage events. |
| **Two-Step Auth**         | Offers enhanced security with 2FA using Google Authenticator. |
| **Home**                  | Displays featured events, events nearby and leaderboard. |
| **All Events**            | Browse all upcoming events, filter by all events and past events. Also displays events this week|
| **Nearby Events**         | Shows a curated list of events near the user's location using IP geolocation. |
| **Create/Edit Event**     | Create events with title, time, image, location, and requirements. |
| **Single Event Page**     | Detailed event view with participant list, map, and actions based on user role. |
| **Invite System**         | Search and invite friends directly to events. |
| **Join Requests**         | Users can request to join private events; hosts can approve or reject. |
| **Profile Page**          | View and edit user info, sports preferences, and availability. |
| **Friend Sidebar**        | Access friend requests, view friends, and navigate to profiles. |
| **Notification System**   | Notifies users of invites. |
| **Account Preferences**   | Toggle two-step authentication and manage privacy settings. |
| **Change Password**       | Update account password securely with 2FA verification. |
| **Leaderboard**           | Displays top performers based on event points. |
| **Admin Page**            | Administrative tools for managing users, events, and manage achievements. |
| **Sidebar Navigation**    | Persistent sidebar with links to all major features and account settings. |
| **Hosted By Bearded**       | Each event from the admin clearly displays "Hosted by Bearded" to represent our client partnership. |

🔗 **Use Our Hosted Site** – Visit the live version of Sportify here: [https://sportifydebuggers.netlify.app/](https://sportifydebuggers.netlify.app/)

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---
## The Idea

Sportify was built to bridge the gap between everyday sports enthusiasts and local event organizers. With a mission to make sports more accessible, interactive, and community-driven, Sportify empowers users to create, discover, and join sporting events in their area. Whether you're an individual looking to stay active, an organization hosting tryouts, or a team wanting to grow its audience—Sportify provides a digital space to connect, compete, and celebrate shared passions. The platform emphasizes inclusivity, security through 2FA, and real-time collaboration through features like invites, join approvals, and user profiles, making sports engagement easier and more exciting for everyone.

---

## Development Process

### Highlights
- ⚙️ **Modular Architecture:** Sportify was developed with a clear separation of concerns using React and Vite, with a structured directory for pages, components, services, models, and styles.
- 🔐 **Authentication System:** Integrated both email/password and Google OAuth sign-in methods, supported by two-factor authentication using Google Authenticator.
- 🌍 **Interactive Maps & Geolocation:** Used Google Maps API and IP-based geolocation to help users discover nearby events visually and contextually.
- 🖼️ **Media Integration:** Integrated the Unsplash API to allow dynamic image selection for event banners, improving UX without hosting overhead.
- ⚡ **Real-Time UI:** Events, invites, join statuses, and user interactions are updated live through effective state management and conditional rendering.

### Challenges
- 📉 **Outdated ERD:** Early misalignment between our Entity Relationship Diagram and the live database caused confusion during model setup and API development.
- 📍 **Inaccurate Location Filtering:** The Nearby Events feature initially returned incorrect results due to mismatches between user geolocation and event location strings.
- 🔐 **2FA QR Code Issues:** The QR code for enabling two-step authentication was not displaying due to incorrect API key routing and frontend state handling.
- 🖼️ **Profile Picture Bugs:** Profile images for users and participants were not rendering reliably because of missing fallback handling and path mismatches.
- 🔄 **Complex Role Management:** Handling multiple user types—regular users, event creators, organizations, and admins—led to challenges in permission-based UI rendering and route protection.
- 🌐 **Cross-Origin Deployment:** We encountered issues syncing frontend (Netlify) and backend (Render) deployments, which required custom CORS configuration and environment tuning.
- 📋 **Form Complexity & Validation:** Creating highly dynamic forms (e.g., event creation, profile edit, organization signup) demanded robust client-side and server-side validation.
- 🎨 **Styling Consistency:** Achieving design coherence using both TailwindCSS and DaisyUI required deliberate style overrides and reuse strategies.

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## Future Implementations

- 💬 **In-App Messaging:** A live chat system for users to communicate within events.
- 🧠 **Smart Recommendations:** Suggest events to users based on past activity, location, and interests.
- 🗓️ **Calendar Sync:** Allow users to sync events to their personal calendars (Google, iCal, Outlook).
- 🔔 **Enhanced Notifications:** Add browser push notifications for real-time event updates and approvals.
- 📱 **Mobile Optimization:** Further improve mobile responsiveness and test for multiple devices.
- 🧾 **Event Analytics:** Provide hosts with stats on attendance, user engagement, and participation trends.
- 🧑‍🤝‍🧑 **Team Formation:** Allow users to form teams, register as a group, and track group performance.
- 🏆 **User-Created Achievements:** Users with event permissions can create and assign unique achievements to participants.
- 🏢 **Advanced Organization Tools:** Support organizations in managing large-scale event portfolios, with custom branding and admin tools.
- ⭐ **Reputation & Reviews:** Introduce a profile review system where participants can rate and leave feedback after events.
- 💭 **Event Discussion Threads:** Enable comment-based chat on event pages for communication among participants.
- 📅 **Poll-Based Schedule Changes:** Allow event creators to request date/time changes that participants can vote on through built-in polls.

The development process for Sportify focused on iteratively building a stable, scalable, and user-focused platform. Regular testing, peer reviews, and client feedback helped us fine-tune the experience while preparing the app for real-world deployment and long-term scalability.
<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## Roadmap

- [x] User registration and login (Google/Auth)
- [x] Event creation and participant management
- [ ] In-app chat feature
- [ ] Profile review and rating system
- [ ] Team formation and group registration
- [ ] Event analytics for hosts
- [ ] Calendar sync integration
- [ ] Reputation & poll-based scheduling

---

## Usage

After launching the app, users can:
- Sign up or log in using Google or email.
- Create or join sports events.
- Manage profiles and friends.
- Use 2FA for secure login.
- Invite others and receive notifications.

_For more screenshots, see the [Mockups](#mockups) section._

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## Mockups

Below are UI mockups that guided the design and development of Sportify:

### 🖼️ Home Page
![Home Page](./ReadMEAssets/mockups/HomePage.png)

### 📝 Sign Up Page
![Sign Up Page](./ReadMEAssets/mockups/SignupPage.png)

### 🔐 Two Factor Authorization
![Friend Sidebar](./ReadMEAssets/mockups/2FA.png)

### 📌 Single Event View
![Single Event](./ReadMEAssets/mockups/SingleEventPage.png)

### 📁 My Event Page
![Single Event](./ReadMEAssets/mockups/MyEvents.png)

### 🧾 Create Event Form
![Create Event](./ReadMEAssets/mockups/CreateEventPage.png)

### 📊 Admin Dashboard
![Admin Dashboard](./ReadMEAssets/mockups/Admin.png)

### 🧍 Profile Page
![Profile Page](./ReadMEAssets/mockups/Profile.png)

### 👥 Friend Sidebar
![Friend Sidebar](./ReadMEAssets/mockups/FriendSidebar.png)

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## Other Resources

### 🔧 Development & Documentation
- [Backend Repo](https://github.com/EnzoDV08/Sportify_Backend)
- [API Documentation (Swagger UI)](https://sportify-backend-znri.onrender.com/swagger/index.html) – Interactive API reference.
- [ERD Diagram](https://drive.google.com/drive/folders/1ecfPPRfGvPg-ANCuGc9bfyZDeHiSIGEZ?usp=sharing) – Visual layout of the database structure.
- **Environment Variable Template:**
```bash
VITE_API_BASE_URL=your_backend_url_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_UNSPLASH_KEY=your_unsplash_access_key_here
```

### 📄 Planning & UX Artifacts
- [Wireframes & UX Flowcharts](https://drive.google.com/drive/folders/1K0UFCTh9_VV8nrpLpLv2eED-PQ-ucDk9?usp=sharing) – Early visual planning materials.
- [Presentation Slides](https://drive.google.com/drive/folders/1Bk7lT40UywcXyK8MkW-Ip4_RKinkE5qM?usp=drive_link) – Slide deck for project summary.
- [Client Brief / Proposal](https://drive.google.com/drive/folders/1SLEht-KUL_kRGhJrQo_w_tAgaA_sl0jv?usp=drive_link) – Original goals and requirements overview.
<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## License

MIT © Sportify. You are free to use, modify, and distribute this project under the conditions of the MIT license.

---

## Contributing

Contributions are welcome! If you'd like to help improve Sportify:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a pull request

### Top Contributors

<a href="https://github.com/EnzoDV08/Sportify_Frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=EnzoDV08/Sportify_Frontend" />
</a>

---

## Authors

- **Zander Bezuidenhout** – [GitHub](https://github.com/ZanderBez)
- **Jaco Mostert** – [GitHub](https://github.com/321008Jaco)
- **Joshua De Klerk** – [GitHub](https://github.com/JoshuaDeKlerk)
- **Enzo De Vittorio** – [GitHub](https://github.com/EnzoDV08)

---

## Contact

📧 [Enzo De Vittorio](mailto:231244@virtualwindow.co.za)  
📧 [Joshua De Klerk](mailto:231207@virtualwindow.co.za)  
📧 [Jaco Mostert](mailto:231008@virtualwindow.co.za)  
📧 [Zander Bezuidenhout](mailto:221205@virtualwindow.co.za)  

<br/>

🌐 [Live App](https://sportifydebuggers.netlify.app/)  
📁 [Frontend Repo](https://github.com/EnzoDV08/Sportify_Frontend)  
🗄️ [Backend Repo](https://github.com/EnzoDV08/Sportify_Backend)

---

## Report Issues

- 💡 [Request a Feature](https://github.com/EnzoDV08/Sportify_Frontend/issues/new?labels=enhancement&template=feature-request.md)
- 🐛 [Report a Bug](https://github.com/EnzoDV08/Sportify_Frontend/issues/new?labels=bug&template=bug-report.md)

---

## Acknowledgements

- **[Armand Pretorius](https://github.com/Armand-OW)** – Lecturer and project supervisor from Open Window, School of Creative Technologies.
- [Stack Overflow](https://stackoverflow.com/) – For troubleshooting and community support.
- [Figma](https://www.figma.com/) – Used for wireframing and UI prototyping.
- [React Icons](https://react-icons.github.io/react-icons/) – Icon library used across the app.
- [Unsplash](https://unsplash.com/) – For free high-quality event imagery.
- [Google Maps Platform](https://developers.google.com/maps) – For event location and geolocation services.
- [Netlify](https://www.netlify.com/) & [Render](https://render.com/) – For frontend and backend deployment respectively.

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---
