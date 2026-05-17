import { useState } from "react";
const status = import.meta.env.VITE_APP_STATUS;

export function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.includes("@") || password.length < 8) {
            setMessage("Registration failed");
            return;
        }

        setMessage("Registration successful");
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Email:
                        <input
                            data-testid="email-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ display: "block", width: "100%", marginTop: 4 }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Password:
                        <input
                            data-testid="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ display: "block", width: "100%", marginTop: 4 }}
                        />
                    </label>
                </div>

                <button
                    data-testid="submit-button"
                    type="submit"
                    style={{ padding: "6px 12px" }}
                >
                    Sign up
                </button>
            </form>

            {message && (
                <p style={{ marginTop: 16 }}>{message}</p>
            )}
            App mode: {status}
        </div>
    );
}
