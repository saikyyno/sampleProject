import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com';

if (posthogKey) {
    posthog.init(posthogKey, {
        api_host: posthogHost,
        defaults: '2026-01-30',
        person_profiles: 'identified_only',
        session_recording: {
            maskAllInputs: true,
            maskInputOptions: { password: true },
        },
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
