import { useState, useEffect } from "react";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    badge: "",
    title: "",
    description: "",
    supplies: "",
    duration: "",
    indoorOutdoor: "",
  });

  // 🔹 Fetch activities
  const fetchActivities = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/activities");
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // 🔹 Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit new activity
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:5000/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setFormData({
        badge: "",
        title: "",
        description: "",
        supplies: "",
        duration: "",
        indoorOutdoor: "",
      });

      fetchActivities();
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  // 🔹 Delete activity
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/activities/${id}`, {
        method: "DELETE",
      });

      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div>
      <h2>Leader Activities</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="badge"
          placeholder="Badge (e.g. Outdoor Art)"
          value={formData.badge}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Activity Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="supplies"
          placeholder="Supplies"
          value={formData.supplies}
          onChange={handleChange}
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 20 min)"
          value={formData.duration}
          onChange={handleChange}
        />

        <input
          type="text"
          name="indoorOutdoor"
          placeholder="Indoor or Outdoor"
          value={formData.indoorOutdoor}
          onChange={handleChange}
        />

        <button type="submit">Add Activity</button>
      </form>

      <h3>Saved Activities</h3>

      {activities.length === 0 ? (
        <p>No activities yet.</p>
      ) : (
        activities.map((activity) => (
          <div key={activity._id} className="activity-card">
            <h4>{activity.title}</h4>
            <p><strong>Badge:</strong> {activity.badge}</p>
            <p>{activity.description}</p>
            <p><strong>Supplies:</strong> {activity.supplies}</p>
            <p><strong>Duration:</strong> {activity.duration}</p>
            <p><strong>Type:</strong> {activity.indoorOutdoor}</p>

            <button onClick={() => handleDelete(activity._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Activities;