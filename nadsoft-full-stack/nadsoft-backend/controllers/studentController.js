const pool = require('../config/db')

exports.createStudent = async (req,res)=>{
 try{

  const {name,email,age} = req.body;

  const [result] = await pool.query(
   "INSERT INTO students(name,email,age) VALUES(?,?,?)",
   [name,email,age]
  );

  res.json({
    id: result.insertId,
    name,
    email,
    age
  });

 }catch(err){
  res.status(500).json({error:err.message});
 }
};

exports.getStudents = async (req,res)=>{

 try{

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const offset = (page-1)*limit;

  const [students] = await pool.query(
   "SELECT * FROM students LIMIT ? OFFSET ?",
   [limit,offset]
  );

  const [total] = await pool.query("SELECT COUNT(*) as count FROM students");

  res.json({
   data:students,
   total:total[0].count,
   page,
   limit
  });

 }catch(err){
  res.status(500).json({error:err.message});
 }

};

exports.getStudentById = async (req,res)=>{

 try{

  const [result] = await pool.query(
   "SELECT * FROM students WHERE id=?",
   [req.params.id]
  );

  res.json(result[0]);

 }catch(err){
  res.status(500).json({error:err.message});
 }

};

exports.updateStudent = async (req,res)=>{

 try{

  const {name,email,age} = req.body;

  await pool.query(
   "UPDATE students SET name=?,email=?,age=? WHERE id=?",
   [name,email,age,req.params.id]
  );

  res.json({message:"Student updated"});

 }catch(err){
  res.status(500).json({error:err.message});
 }

};

exports.deleteStudent = async (req,res)=>{

 try{

  await pool.query(
   "DELETE FROM students WHERE id=?",
   [req.params.id]
  );

  res.json({message:"Student deleted"});

 }catch(err){
  res.status(500).json({error:err.message});
 }

};