import React from "react";

function Pagination({ page, total, limit, setPage }) {

 const totalPages = Math.ceil(total / limit);

 return (

  <div className="d-flex justify-content-end mt-3">

   <button
    className="btn btn-light me-2"
    disabled={page === 1}
    onClick={() => setPage(1)}
   >
    First
   </button>

   <button
    className="btn btn-light me-2"
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
   >
    Previous
   </button>

   <button className="btn btn-success me-2">
    {page}
   </button>

   <button
    className="btn btn-light me-2"
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
   >
    Next
   </button>

   <button
    className="btn btn-light"
    disabled={page === totalPages}
    onClick={() => setPage(totalPages)}
   >
    Last
   </button>

  </div>

 );
}

export default Pagination;