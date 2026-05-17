import React,{useEffect,useState} from "react"
import API from "../services/api"
import Pagination from "./Pagination"
import MemberFormModal from "./MemberFormModal"
import Swal from "sweetalert2"

function MemberList(){

const [members,setMembers]=useState([])
const [page,setPage]=useState(1)
const [total,setTotal]=useState(0)

const [show,setShow]=useState(false)
const [editData,setEditData]=useState(null)

const limit=5

useEffect(()=>{
fetchMembers()
},[page])

const fetchMembers=async()=>{

const res=await API.get(`/students?page=${page}&limit=${limit}`)

setMembers(res.data.data)
setTotal(res.data.total)

}

const deleteMember=(id)=>{

Swal.fire({
title:"Are you sure?",
text:"Delete this student?",
icon:"warning",
showCancelButton:true,
confirmButtonColor:"#d33"
}).then(async(result)=>{

if(result.isConfirmed){

await API.delete(`/students/${id}`)

Swal.fire("Deleted","Student deleted","success")

fetchMembers()

}

})

}

const editMember=(member)=>{

setEditData(member)
setShow(true)

}

return(

<div className="container mt-5">

<div className="card shadow-lg border-0">

<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

<h4 className="mb-0">🎓 Students Management</h4>

<button
className="btn btn-light btn-sm"
onClick={()=>{setShow(true);setEditData(null)}}
>
➕ Add Student
</button>

</div>

<div className="card-body">

<table className="table table-hover table-striped align-middle">

<thead className="table-dark">

<tr>
<th>ID</th>
<th>Name</th>
<th>Email</th>
<th>Age</th>
<th style={{width:"180px"}}>Actions</th>
</tr>

</thead>

<tbody>

{members.length === 0 ? (

<tr>
<td colSpan="5" className="text-center text-muted">
No students found
</td>
</tr>

) : (

members.map((m)=>(
<tr key={m.id}>

<td>{m.id}</td>
<td>{m.name}</td>
<td>{m.email}</td>
<td>{m.age}</td>

<td>

<button
className="btn btn-outline-primary btn-sm me-2"
onClick={()=>editMember(m)}
>
✏ Edit
</button>

<button
className="btn btn-outline-danger btn-sm"
onClick={()=>deleteMember(m.id)}
>
🗑 Delete
</button>

</td>

</tr>
))

)}

</tbody>

</table>

<div className="d-flex justify-content-between align-items-center mt-3">

<span className="text-muted">
Total Students: <b>{total}</b>
</span>

<Pagination
page={page}
total={total}
limit={limit}
setPage={setPage}
/>

</div>

</div>

</div>

<MemberFormModal
show={show}
setShow={setShow}
fetchMembers={fetchMembers}
editData={editData}
/>

</div>

)

}

export default MemberList