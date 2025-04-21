import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Timetable.css";
import { UserData } from "../../context/UserContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const times = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00", "04:00"];

const Timetable = () => {
  const { user } = UserData();
  const [entries, setEntries] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject: "", day: "", time: "", repeat: "", room: "", teachers: "", note: "", color: "#ffffff"
  });

  const fetchTimetable = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/timetable/${user._id}`);
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTimetable();
  }, [user]);

  const handleDoubleClick = (day, time) => {
    const existing = entries.find(e => e.day === day && e.time === time);
    if (existing) {
      setEditingId(existing._id);
      setFormData({
        subject: existing.subject,
        day: existing.day,
        time: existing.time,
        repeat: existing.repeat,
        room: existing.room,
        teachers: existing.teachers,
        note: existing.note,
        color: existing.color,
      });
    } else {
      setEditingId(null);
      setFormData({ subject: "", day, time, repeat: "", room: "", teachers: "", note: "", color: "#ffffff" });
    }
    setSelectedSlot({ day, time });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, userId: user._id };
      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/timetable/${editingId}`, data);
        setEntries(entries.map(e => (e._id === editingId ? res.data : e)));
      } else {
        const res = await axios.post("http://localhost:5000/api/timetable", data);
        setEntries([...entries, res.data]);
      }
      setSelectedSlot(null);
      setEditingId(null);
      setFormData({ subject: "", day: "", time: "", repeat: "", room: "", teachers: "", note: "", color: "#ffffff" });
    } catch (err) {
      console.error("Error saving timetable entry:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/timetable/${id}`);
      setEntries(entries.filter(e => e._id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <div className="timetable-container">
      <h2>Weekly Timetable</h2>
      <table className="timetable">
        <thead>
          <tr>
            <th>Time</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td>{time}</td>
              {days.map(day => {
                const entry = entries.find(e => e.day === day && e.time === time);
                return (
                  <td key={day} onDoubleClick={() => handleDoubleClick(day, time)}>
                    {entry ? (
                      <div
                        style={{
                          backgroundColor: entry.color,
                          color: "white",
                          padding: "5px",
                          borderRadius: "5px"
                        }}
                      >
                        <strong>{entry.subject}</strong><br />
                        <button onClick={() => handleDelete(entry._id)}>Delete</button>
                      </div>
                    ) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSlot && (
        <div className="add-subject-form">
          <h3>{editingId ? "Edit Subject" : "Add Subject"}</h3>
          <form onSubmit={handleSubmit}>
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
            <input name="teachers" value={formData.teachers} onChange={handleChange} placeholder="Teachers" />
            <input name="note" value={formData.note} onChange={handleChange} placeholder="Note" />
            <select name="repeat" value={formData.repeat} onChange={handleChange}>
              <option value="">Repeat</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
            <input type="color" name="color" value={formData.color} onChange={handleChange} required />
            <div className="form-buttons">
              <button type="submit">{editingId ? "Update" : "Save"}</button>
              <button type="button" onClick={() => {
                setSelectedSlot(null);
                setEditingId(null);
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Timetable;
