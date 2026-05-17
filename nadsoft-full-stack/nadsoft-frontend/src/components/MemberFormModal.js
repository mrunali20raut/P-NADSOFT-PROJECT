import React, { useState, useEffect } from "react";
import API from "../services/api";

function MemberFormModal({ show, setShow, fetchMembers, editData }) {

const [form, setForm] = useState({
  name: "",
  email: "",
  age: "",
  parent_id: ""
});

useEffect(() => {
  if (editData) {
    setForm(editData);
  } else {
    setForm({
      name: "",
      email: "",
      age: "",
      parent_id: ""
    });
  }
}, [editData]);

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (editData) {
    await API.put(`/students/${editData.id}`, form);
  } else {
    await API.post("/students", form);
  }

  fetchMembers();
  setShow(false);
};

if (!show) return null;

return (

<div className="modal fade show d-block" style={{background:"rgba(0,0,0,0.4)"}}>

<div className="modal-dialog modal-dialog-centered">

<div className="modal-content shadow-lg border-0">

{/* Header */}

<div className="modal-header bg-primary text-white">

<h5 className="modal-title">
{editData ? "✏️ Edit Member" : "➕ Add Member"}
</h5>

<button
className="btn-close btn-close-white"
onClick={() => setShow(false)}
></button>

</div>

{/* Body */}

<div className="modal-body">

<form onSubmit={handleSubmit}>

<div className="mb-3">
<label className="form-label fw-bold">Name</label>
<input
type="text"
className="form-control"
placeholder="Enter name"
name="name"
value={form.name}
onChange={handleChange}
required
/>
</div>

<div className="mb-3">
<label className="form-label fw-bold">Email</label>
<input
type="email"
className="form-control"
placeholder="Enter email"
name="email"
value={form.email}
onChange={handleChange}
required
/>
</div>

<div className="mb-3">
<label className="form-label fw-bold">Age</label>
<input
type="number"
className="form-control"
placeholder="Enter age"
name="age"
value={form.age}
onChange={handleChange}
required
/>
</div>

<div className="d-flex justify-content-end">

<button
type="button"
className="btn btn-outline-secondary me-2"
onClick={() => setShow(false)}
>
Cancel
</button>

<button
type="submit"
className="btn btn-success"
>
{editData ? "Update" : "Save"}
</button>

</div>

</form>

</div>

</div>

</div>

</div>

);

}

export default MemberFormModal;