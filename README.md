# Emaily: Survey Distribution Application

## Overview
Emaily is a robust application designed to streamline the process of sending surveys via email to thousands of recipients simultaneously. It offers users the flexibility to customize survey emails, track responses through a dynamic dashboard, and manage credits for sending batches of surveys. This pay-as-you-go service is ideal for gathering feedback efficiently and at scale.

## Installation

### Prerequisites
- Node.js installed on your system
- A Google account for OAuth 2.0 login
- (Optional) Stripe account for processing payments

### Cloning the Repository
To get started with Emaily, clone the repository to your local machine:

```bash
git clone https://github.com/gonzalomelov/emaily
cd emaily
npm install
```

### Setting Up Environment
Before running the application, ensure to set up the necessary environment variables including database and API keys. Since these are removed from the GitHub repository for security, you'll need to obtain and configure them according to your setup.

### Running the Application
Navigate to the server directory and start the application using:

```bash
npm run dev
```

This command concurrently starts the client and the server, making the application accessible on your local machine.

## Usage

### Accessing the Application
Emaily is hosted on the cloud and can be accessed through the provided link. Please allow a few seconds for the application to load, especially on the first launch.

### Logging In
Log in securely with your Google account through Passport's Google OAuth 2.0. Support for other social media platforms is in development.

### Adding Credits
Purchase credits ($5 for 5 credits) via the "Add Credits" button. For testing, use the card number 4242 4242 4242 4242 with any valid expiry date and security code to simulate a purchase.

### Sending Surveys
Create and send surveys using the Survey Form page. Add recipient email addresses as comma-separated values, review your survey, and then send it to your list.

### Getting Feedback
Monitor responses through the dashboard, which updates periodically to reflect the latest feedback.

## Technologies

### Front-End
- Axios
- Create-React-App
- React 16
- Reactstrap
- Redux
- Redux Form
- Redux Thunk

### Back-End
- Body Parser
- Concurrently
- Cookie-Session
- Express (Node.js)
- Local Tunnel
- Lodash
- Mongoose
- Nodemon
- Passport (Google OAuth 2.0)
- Path Parser
- SendGrid
- Stripe

## Docs

### Diagrams

- Sequence Diagram: doc/Sequence Diagram.drawio
- Flows: https://www.figma.com/file/LkyBJlYs2rOswjIoEGVAdT?type=design&node-id=0-1&mode=design&t=3lanSSWDcozpuu95-0&fuid=1129119031806398442
- Architecture: https://www.figma.com/file/7SgscasorSm3bF9lysWnRy/Architecture-Diagram?type=whiteboard&node-id=0-1&t=r5f72UKRzFcgK62c-0

## Contributing
We welcome contributions to Emaily! Please feel free to fork the repository, make changes, and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.