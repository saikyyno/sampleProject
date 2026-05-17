import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import posthog from "posthog-js";
import "./App.css";
import { useTaskAnalytics } from "./hooks/useTaskAnalytics";
import { RegisterPage } from "./pages/RegisterPage";

type Priority = "low" | "medium" | "high";
type Category = "study" | "work" | "personal";
type DeleteReason = "mistake" | "duplicate" | "done_elsewhere";

type ActivityEntry = {
  id: number;
  label: string;
  detail: string;
};

function AnalyticsPlayground() {
  const { trackTaskCreated, trackTaskCompleted, trackTaskDeleted } = useTaskAnalytics();
  const [email, setEmail] = useState("demo.user@example.com");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("study");
  const [deleteReason, setDeleteReason] = useState<DeleteReason>("mistake");
  const [manualEvent, setManualEvent] = useState("manual_test_event");
  const [taskCounter, setTaskCounter] = useState(1);
  const [lastTaskId, setLastTaskId] = useState("task-1");
  const appStatus = import.meta.env.VITE_APP_STATUS ?? "unknown";
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const [activity, setActivity] = useState<ActivityEntry[]>([
    {
      id: 1,
      label: "Viewed playground",
      detail: `Captured analytics_playground_viewed in ${appStatus} mode`,
    },
  ]);

  const addActivity = (label: string, detail: string) => {
    setActivity((current) => [
      {
        id: Date.now() + current.length,
        label,
        detail,
      },
      ...current,
    ].slice(0, 8));
  };

  useEffect(() => {
    posthog.capture("analytics_playground_viewed", {
      app_status: appStatus,
      source: "home_route",
    });
  }, [appStatus]);

  const handleIdentify = () => {
    posthog.identify(email, {
      email,
      plan: "demo",
      role: "student",
    });
    posthog.capture("demo_user_identified", {
      email_domain: email.split("@")[1] ?? "unknown",
    });
    addActivity("Identified user", email);
  };

  const handleReset = () => {
    posthog.capture("demo_identity_reset_clicked", {
      previous_identity: email,
    });
    posthog.reset();
    addActivity("Reset identity", "Cleared the current PostHog user context");
  };

  const handleCreateTask = () => {
    const taskId = `task-${taskCounter}`;
    trackTaskCreated({
      id: taskId,
      priority,
      category,
    });
    setLastTaskId(taskId);
    setTaskCounter((value) => value + 1);
    addActivity("Task created", `${taskId} | ${priority} | ${category}`);
  };

  const handleCompleteTask = () => {
    const completionTime = taskCounter * 12;
    trackTaskCompleted(lastTaskId, completionTime);
    addActivity("Task completed", `${lastTaskId} in ${completionTime}s`);
  };

  const handleDeleteTask = () => {
    trackTaskDeleted(lastTaskId, deleteReason);
    addActivity("Task deleted", `${lastTaskId} | ${deleteReason}`);
  };

  const handlePrimaryCta = () => {
    posthog.capture("demo_cta_clicked", {
      placement: "hero",
      app_status: appStatus,
    });
    addActivity("CTA clicked", "Captured demo_cta_clicked");
  };

  const handleManualEvent = () => {
    const normalizedName = manualEvent.trim().replace(/\s+/g, "_").toLowerCase();

    if (!normalizedName) {
      addActivity("Manual event skipped", "Enter an event name before sending");
      return;
    }

    posthog.capture(normalizedName, {
      triggered_from: "manual_event_panel",
      app_status: appStatus,
    });
    addActivity("Manual event sent", normalizedName);
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">PostHog sandbox</p>
        <h1>Test events from a real UI, not a placeholder page.</h1>
        <p className="hero-copy">
          Use this screen to send named events, exercise the task analytics hook,
          and verify identify/reset flows before wiring analytics into the rest of the app.
        </p>

        <div className="hero-actions">
          <button data-testid="hero-cta-button" className="primary-button" onClick={handlePrimaryCta}>
            Send CTA event
          </button>
          <Link className="secondary-link" to="/register">
            Open registration flow
          </Link>
        </div>

        <dl className="status-grid">
          <div>
            <dt>Mode</dt>
            <dd>{appStatus}</dd>
          </div>
          <div>
            <dt>Host</dt>
            <dd>{posthogHost}</dd>
          </div>
          <div>
            <dt>Last task</dt>
            <dd>{lastTaskId}</dd>
          </div>
        </dl>
      </section>

      <section className="workspace-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Identity</p>
              <h2>User context</h2>
            </div>
          </div>

          <label className="field">
            <span>Email for identify()</span>
            <input
              data-testid="identify-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <div className="button-row">
            <button data-testid="identify-button" onClick={handleIdentify}>
              Identify user
            </button>
            <button data-testid="reset-identity-button" className="ghost-button" onClick={handleReset}>
              Reset identity
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Task events</p>
              <h2>Lifecycle test panel</h2>
            </div>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Priority</span>
              <select
                data-testid="priority-select"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="field">
              <span>Category</span>
              <select
                data-testid="category-select"
                value={category}
                onChange={(event) => setCategory(event.target.value as Category)}
              >
                <option value="study">Study</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Delete reason</span>
            <select
              data-testid="delete-reason-select"
              value={deleteReason}
              onChange={(event) => setDeleteReason(event.target.value as DeleteReason)}
            >
              <option value="mistake">Mistake</option>
              <option value="duplicate">Duplicate</option>
              <option value="done_elsewhere">Done elsewhere</option>
            </select>
          </label>

          <div className="button-stack">
            <button data-testid="create-task-button" onClick={handleCreateTask}>
              Create task event
            </button>
            <button data-testid="complete-task-button" onClick={handleCompleteTask}>
              Complete last task
            </button>
            <button data-testid="delete-task-button" className="ghost-button" onClick={handleDeleteTask}>
              Delete last task
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Custom event</p>
              <h2>Manual sender</h2>
            </div>
          </div>

          <label className="field">
            <span>Event name</span>
            <input
              data-testid="manual-event-input"
              value={manualEvent}
              onChange={(event) => setManualEvent(event.target.value)}
              placeholder="manual_test_event"
            />
          </label>

          <button data-testid="manual-event-button" onClick={handleManualEvent}>
            Send custom event
          </button>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Recent activity</p>
              <h2>What we sent</h2>
            </div>
          </div>

          <ul className="activity-list" data-testid="activity-log">
            {activity.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.label}</strong>
                <span>{entry.detail}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<AnalyticsPlayground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
