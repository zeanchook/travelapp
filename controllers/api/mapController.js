const pg = require("pg");
const jwt = require("jsonwebtoken");
const debug = require("debug")("mern:controllers:api:usersController");
const connectionString = process.env.PGDB_URL;
const { Pool, Client } = pg;


const index = async (req,res) => {
    // debug("body: %o", req.body);
        
    const pool = new Pool({
        connectionString,
        });
    console.log("test")
    try
    {
        // const { name, email, password } = req.body;
        const text = `SELECT 
        json_build_object(
          'type', 'FeatureCollection',
          'crs', json_build_object('type', 'name'),
          'features', json_agg(
            json_build_object(
                'type', 'Feature',
                'geometry', json_build_object(
                'type', 'Point', 
                'coordinates', 
                (SELECT locations
                )                         
               )
            )
          )
        )
      FROM planner_items
      WHERE planner_id=$1`;
        const values = [13];
        const response = await pool.query(text, values);
        console.log(response.rows)
        const [ data ] = response.rows
        res.status(201).json(data.json_build_object);
    }
    catch(error)
    {
        debug("error: %o", error);
        res.status(500).json( error.detail );
    }
};




  module.exports = {
    index
  };