# ⚡ ChronosTrigger

**ChronosTrigger** is a high-performance, aesthetically driven reminder system designed to simulate real-time trigger events. Built with modern web technologies, it features a glassmorphism UI and a precision background polling engine.

## 🚀 Key Features

- **Real-time Monitoring**: A 1Hz background loop simulates a hardware trigger check, ensuring sub-second precision for scheduled events.
- **Glassmorphism UI**: A premium, futuristic interface using HSL-tailored color palettes and dynamic background blobs.
- **Audio-Visual Cues**: Simulated frequency-modulated oscillator triggers an audio alert alongside visual overlays when a reminder activates.
- **Persistence**: Automated state management using local storage logic.

## 🕰️ The Scheduling Logic

The core of ChronosTrigger lies in its **Trigger Simulation Engine**. Unlike standard event listeners, it follows a "Monitor and Dispatch" pattern:

1.  **State Initialization**: Reminders are stored as objects in a flat collection.
2.  **The Heartbeat**: A `setInterval` function acts as the internal clock, firing every 1,000ms.
3.  **Comparator Phase**: During each tick, the engine iterates through active reminders and compares the current system timestamp with the scheduled trigger time.
4.  **Activation**: When `currentTime >= scheduledTime`, the trigger is activated, and the reminder state is updated to prevent duplicate firing.

```javascript
function checkTriggers() {
    const now = new Date();
    reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.time);
        if (!reminder.triggered && now >= reminderTime) {
            activateTrigger(reminder); // Dispatch UI/Audio events
            reminder.triggered = true; // State lockdown
        }
    });
}
```

## 🛠️ Installation & Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/USER_NAME/ChronosTrigger.git
    ```
2.  Open `index.html` in any modern browser.
3.  Set your first trigger and watch the precision in action.

## 🎨 Design Philosophy

Designed for the modern developer, ChronosTrigger uses:
- **Figma-inspired Glassmorphism**: High blur values and low-opacity borders.
- **Dynamic Interaction**: CSS transitions and keyframe animations for a "living" interface feeling.
- **Typography**: Optimized readability using *Inter* and *Outfit* fonts.

---
*Built with precision by Antigravity.*
