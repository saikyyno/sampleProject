import posthog from 'posthog-js';

export const useTaskAnalytics = () => {
    const trackTaskCreated = (taskData: { id: string, priority: string, category: string }) => {
        posthog.capture('task_created', {
            task_id: taskData.id,
            priority: taskData.priority,
            category: taskData.category,
            is_authenticated: true,
        });
    };

    const trackTaskCompleted = (taskId: string, timeSeconds: number) => {
        posthog.capture('task_completed', {
            task_id: taskId,
            time_to_complete_seconds: timeSeconds,
        });
    };

    const trackTaskDeleted = (taskId: string, reason: string = 'mistake') => {
        posthog.capture('task_deleted', {
            task_id: taskId,
            reason: reason,
        });
    };

    return { trackTaskCreated, trackTaskCompleted, trackTaskDeleted };
};