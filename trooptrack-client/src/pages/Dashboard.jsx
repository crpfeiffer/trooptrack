import { useState, useEffect } from "react";

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/meetings")
      .then((res) => res.json())
      .then(setMeetings);

    fetch("http://localhost:5000/api/activities")
      .then((res) => res.json())
      .then(setActivities);
  }, []);

  return (
    <div className="dashboard">
      <h2>🌼 Troop Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📅 Meetings</h3>
          <p className="big-number">{meetings.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>🎨 Activities</h3>
          <p className="big-number">{activities.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>🌼 Daisy Petals</h3>
          <img
            src="src/pages/images/daisypetals.jpg"
            alt="Daisy Petals Badge"
            className="badge-image"
          />
        </div>
      </div>

      <div className="dashboard-card full-width">
        <h3>Upcoming Meetings</h3>
        {meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          meetings.slice(0, 3).map((m) => (
            <div key={m._id} className="mini-meeting">
              <strong>{m.title}</strong> — {m.date}
              <br />
              <span>{m.location}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;