import { useState, useEffect } from "react";

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contact: "",
    meeting: "",
    status: "Pending",
  });

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/volunteers");
      const data = await res.json();
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:5000/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setFormData({
        name: "",
        role: "",
        contact: "",
        meeting: "",
        status: "Pending",
      });

      fetchVolunteers();
    } catch (error) {
      console.error("Error saving volunteer:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/volunteers/${id}`, {
        method: "DELETE",
      });

      fetchVolunteers();
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  return (
    <div>
      <h2>Volunteer Sign-Up Tracker</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Volunteer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="role"
          placeholder="Role (e.g. Snack Helper)"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Info"
          value={formData.contact}
          onChange={handleChange}
        />

        <input
          type="text"
          name="meeting"
          placeholder="Meeting Title"
          value={formData.meeting}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">Add Volunteer</button>
      </form>

      <h3>Saved Volunteers</h3>

      {volunteers.length === 0 ? (
        <p>No volunteers yet.</p>
      ) : (
        volunteers.map((volunteer) => (
          <div key={volunteer._id} className="activity-card">
            <h4>{volunteer.name}</h4>
            <p><strong>Role:</strong> {volunteer.role}</p>
            <p><strong>Contact:</strong> {volunteer.contact || "None"}</p>
            <p><strong>Meeting:</strong> {volunteer.meeting || "None"}</p>
            <p><strong>Status:</strong> {volunteer.status}</p>

            <button onClick={() => handleDelete(volunteer._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Volunteers;