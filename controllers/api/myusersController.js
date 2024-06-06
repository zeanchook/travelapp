const pg = require("pg");
const jwt = require("jsonwebtoken");
const debug = require("debug")("mern:controllers:api:usersController");
const bcrypt = require("bcrypt");
const connectionString = process.env.PGDB_URL;
const { Pool, Client } = pg;
const SALT_ROUNDS = 6;


const createJWT = (user) =>
  jwt.sign({ user }, process.env.SECRET, { expiresIn: "1h" });

const passHasher = async(password) =>
{
    return await bcrypt.hash(password, SALT_ROUNDS)
}

const create = async (req,res) => {
    // debug("body: %o", req.body);
        
    const pool = new Pool({
        connectionString,
        });

    try
    {
        const { name, email, password } = req.body;
        const text = "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *";
        const values = [name, email, await passHasher(password)];
        const response = await pool.query(text, values);
        const token = createJWT(response.rows);
        res.status(201).json(token);
    }
    catch(error)
    {
        debug("error: %o", error);
        res.status(500).json( error.detail );
    }
};


const login = async (req,res) => {
    // debug("body: %o", req.body);
        
    const pool = new Pool({
        connectionString,
        });

    try
    {
        const { email, password } = req.body;
        console.log(email)
        const text = "SELECT name,password,usertype FROM users WHERE email=$1";
        const values = [email];
        const response = await pool.query(text, values);
        const responseResult = response.rows
        if(responseResult !== 0)
        {
        const match = await bcrypt.compare(password, responseResult[0].password);
        if (match) {
            const token = createJWT(response.rows);
            res.json(token);
          } else {
            res.status(401).json({ msg: "Password incorrect" });
          }
        }

    }
    catch(error)
    {
        debug("error: %o", error);
        res.status(500).json( error.detail );
    }
};

const index = async (req,res) => {
    // debug("body: %o", req.body);
      
    const pool = new Pool({
        connectionString,
        });

    try
    {
      
        const text = "SELECT * FROM users";
        const response = await pool.query(text);
        const responseResult = response.rows
        console.log(responseResult)
        res.status(201).json(responseResult);
       
    }
    catch(error)
    {
        debug("error: %o", error);
        res.status(500).json( error.detail );
    }
};

const deleteUser = async (req,res) => {
    // debug("body: %o", req.body);
    const pool = new Pool({
        connectionString,
        });
    const ids = req.body
    console.log(ids)
    try
    {
        
        const text = `DELETE FROM users WHERE id = ANY($1) RETURNING *`;
        const values = [ids]
        const response = await pool.query(text,values);
        const responseResult = response.rows
        console.log(responseResult)
        // res.status(201).json(responseResult);
       
    }
    catch(error)
    {
        debug("error: %o", error);
        res.status(500).json( error.detail );
    }
};



//   const create = async (req,res) => {
//     const { Pool, Client } = pg;
//     const connectionString = process.env.PGDB_URL;
  
//       const pool = new Pool({
//           connectionString,
//         });
      
//           //? INSERT INTO bands (name, genre) VALUES ('Rush', 'prog rock');
//           // const text = "INSERT INTO bands(name, genre) VALUES($1, $2) RETURNING *";
//           // const values = ["me", "your music"];
  
//           // await pool.query(text, values);
  
//           // const res = await pool.query("select * from bands");
//           // console.log(res);
//           // await pool.end();
  
//           // const text = "INSERT INTO bands(name, genre) VALUES($1, $2) RETURNING *";
//           // const values = ["me", "your music"];
  
//           // await pool.query(text, values);
  
//           const query = "SELECT * FROM posts JOIN post_locations ON posts.id = post_locations.post_id JOIN locations ON post_locations.location_id = locations.id";
//           // const query = "select * from locations";
//           const cri = "me";
//           const ress = await pool.query(query);
  
//         //   console.log(res.rows);

          
//           const results  = await pool.end();
//           res.status(201).json(ress.rows);
  
//   };
  


  module.exports = {
    create,
    login,
    index,
    deleteUser
  };