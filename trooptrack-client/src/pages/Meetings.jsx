import { useState, useEffect } from "react";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    badge: "",
    notes: "",
    weather: null,
  });
  const [editId, setEditId] = useState(null);
  const [weatherPreview, setWeatherPreview] = useState(null);
  const [weatherMessage, setWeatherMessage] = useState("");

  const fetchMeetings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/meetings");
      const data = await res.json();
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleChange = (e) => {
    const updatedForm = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    // If location changes, clear old weather preview
    if (e.target.name === "location") {
      updatedForm.weather = null;
      setWeatherPreview(null);
      setWeatherMessage("");
    }

    setFormData(updatedForm);
  };

  const handleGetWeather = async () => {
    if (!formData.location.trim()) {
      setWeatherMessage("Enter a location first.");
      return;
    }

    try {
      setWeatherMessage("Loading weather...");
      const res = await fetch(
        `http://localhost:5000/api/weather?location=${encodeURIComponent(
          formData.location
        )}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not fetch weather");
      }

      setWeatherPreview(data);
      setFormData({
        ...formData,
        weather: data.weather,
      });
      setWeatherMessage("Weather loaded and ready to save with this meeting.");
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeatherPreview(null);
      setFormData({
        ...formData,
        weather: null,
      });
      setWeatherMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await fetch(`http://localhost:5000/api/meetings/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("http://localhost:5000/api/meetings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      setFormData({
        title: "",
        date: "",
        location: "",
        badge: "",
        notes: "",
        weather: null,
      });
      setEditId(null);
      setWeatherPreview(null);
      setWeatherMessage("");
      fetchMeetings();
    } catch (error) {
      console.error("Error saving meeting:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/meetings/${id}`, {
        method: "DELETE",
      });
      fetchMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleEdit = (meeting) => {
    setFormData({
      title: meeting.title || "",
      date: meeting.date || "",
      location: meeting.location || "",
      badge: meeting.badge || "",
      notes: meeting.notes || "",
      weather: meeting.weather || null,
    });
    setEditId(meeting._id);

    setWeatherPreview(
      meeting.weather
        ? {
            location: meeting.location,
            weather: meeting.weather,
          }
        : null
    );
    setWeatherMessage(
      meeting.weather ? "Saved weather loaded from this meeting." : ""
    );
  };

  return (
    <div>
      <h2>Meetings</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Meeting Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="badge"
          placeholder="Badge (e.g. Outdoor Art)"
          value={formData.badge}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Meeting Notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
        />

        <button type="button" onClick={handleGetWeather}>
          Check Weather
        </button>

        {weatherMessage && <p>{weatherMessage}</p>}

        {weatherPreview && (
          <div className="meeting-card">
            <h4>Weather Preview</h4>
            <p>Location: {weatherPreview.location}</p>
            <p>High: {weatherPreview.weather.temperatureMax}°</p>
            <p>Low: {weatherPreview.weather.temperatureMin}°</p>
            <p>
              Precipitation Chance:{" "}
              {weatherPreview.weather.precipitationProbabilityMax ?? "N/A"}%
            </p>
            <p>Weather Code: {weatherPreview.weather.weatherCode}</p>
          </div>
        )}

        <button type="submit">
          {editId ? "Update Meeting" : "Add Meeting"}
        </button>
      </form>

      <h3>Upcoming Meetings</h3>

      {meetings.length === 0 ? (
        <p>No meetings yet.</p>
      ) : (
        meetings.map((meeting) => (
          <div key={meeting._id} className="meeting-card">
            <h4>{meeting.title}</h4>
            <p>Date: {meeting.date}</p>
            <p>Location: {meeting.location}</p>
            <p>Badge: {meeting.badge || "None"}</p>
            <p>Notes: {meeting.notes || "None"}</p>

            {meeting.weather && (
              <>
                <p>High: {meeting.weather.temperatureMax}°</p>
                <p>Low: {meeting.weather.temperatureMin}°</p>
                <p>
                  Rain Chance:{" "}
                  {meeting.weather.precipitationProbabilityMax ?? "N/A"}%
                </p>
                <p>Weather Code: {meeting.weather.weatherCode}</p>
              </>
            )}

            <button onClick={() => handleEdit(meeting)}>Edit</button>
            <button onClick={() => handleDelete(meeting._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Meetings;