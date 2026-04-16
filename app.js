// ChronosTrigger Core Logic
document.addEventListener('DOMContentLoaded', () => {
    const clockEl = document.getElementById('live-clock');
    const reminderInput = document.getElementById('reminder-text');
    const timeInput = document.getElementById('reminder-time');
    const addBtn = document.getElementById('add-btn');
    const remindersList = document.getElementById('reminders-list');
    const triggerOverlay = document.getElementById('trigger-overlay');
    const notifMessage = document.getElementById('notif-message');
    const dismissBtn = document.getElementById('dismiss-btn');

    let reminders = JSON.parse(localStorage.getItem('chronos_reminders')) || [];

    // Initialize
    updateClock();
    renderReminders();
    setInterval(updateClock, 1000);
    setInterval(checkTriggers, 1000);

    // --- Clock Logic ---
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }

    // --- State Management ---
    function saveReminders() {
        localStorage.setItem('chronos_reminders', JSON.stringify(reminders));
    }

    function addReminder() {
        const text = reminderInput.value.trim();
        const timeValue = timeInput.value;

        if (!text || !timeValue) {
            alert("Please provide both a description and a time.");
            return;
        }

        const reminder = {
            id: Date.now(),
            text: text,
            time: timeValue,
            triggered: false
        };

        reminders.push(reminder);
        saveReminders();
        renderReminders();

        // Clear inputs
        reminderInput.value = '';
        timeInput.value = '';
    }

    function deleteReminder(id) {
        reminders = reminders.filter(r => r.id !== id);
        saveReminders();
        renderReminders();
    }

    // --- Rendering ---
    function renderReminders() {
        if (reminders.length === 0) {
            remindersList.innerHTML = `
                <div class="empty-state">
                    <p>No active triggers. Time is flowing...</p>
                </div>
            `;
            return;
        }

        remindersList.innerHTML = '';
        const sortedReminders = [...reminders].sort((a, b) => new Date(a.time) - new Date(b.time));

        sortedReminders.forEach(reminder => {
            const div = document.createElement('div');
            div.className = `reminder-item ${reminder.triggered ? 'triggered' : ''}`;
            const dateStr = new Date(reminder.time).toLocaleString();
            
            div.innerHTML = `
                <div class="reminder-info">
                    <h4>${reminder.text}</h4>
                    <p>${dateStr}</p>
                </div>
                <button class="delete-btn" onclick="deleteLocalReminder(${reminder.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            `;
            remindersList.appendChild(div);
        });
    }

    // --- Trigger Logic (The Simulator) ---
    function checkTriggers() {
        const now = new Date();
        // Zero out seconds and ms for comparison if needed, or check exact match
        // For simplicity, we check if current time is >= reminder time and not yet triggered
        
        let changed = false;
        reminders.forEach(reminder => {
            const reminderTime = new Date(reminder.time);
            if (!reminder.triggered && now >= reminderTime) {
                activateTrigger(reminder);
                reminder.triggered = true;
                changed = true;
            }
        });

        if (changed) {
            saveReminders();
            renderReminders();
        }
    }

    function activateTrigger(reminder) {
        notifMessage.textContent = reminder.text;
        triggerOverlay.classList.remove('hidden');
        
        // Play simple notification sound if possible
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch(e) { console.log("Audio not supported or blocked"); }
    }

    // --- Event Listeners ---
    addBtn.addEventListener('click', addReminder);
    dismissBtn.addEventListener('click', () => {
        triggerOverlay.classList.add('hidden');
    });

    // Global helper for delete (since I used inline onclick for simplicity)
    window.deleteLocalReminder = (id) => deleteReminder(id);
});
