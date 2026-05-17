import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init('ph_project_api_key', {
    api_host: 'https://app.posthog.com', // Change to 'https://eu.posthog.com' if your project is hosted in the EU region
    person_profiles: 'identified_only',

    session_recording: {
        maskAllInputs: true,
        maskInputOptions: { password: true },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);