const pg = require("pg");
const jwt = require("jsonwebtoken");
const { useParams } = require("react-router-dom");
const debug = require("debug")("mern:controllers:api:usersController");
const connectionString = process.env.PGDB_URL;
const { Pool, Client } = pg;


const index = async (req,res) => {
    // debug("body: %o", req.body);
        const { id } = req.params
        console.log(id)
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
                (SELECT planner_location_items.locations
                )                         
               )
            )
          )
        )
        FROM users
        JOIN planner ON users.id = planner.user_id
        JOIN planner_items ON planner_items.planner_id = planner.plannerid
        JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
        WHERE planner_items.planner_id = $1 AND planner.status = $2`;
        const values = [id,"Completed"];
        const response = await pool.query(text, values);
        console.log("here:",response.rows)
        const [ data ] = response.rows
        console.log(data)
        res.status(201).json(data.json_build_object);
    }
    catch(error)
    {
        debug("error: %o", error);
        res.status(500).json( error.detail );
    }
};

const indexByName = async (req,res) => {
  // debug("body: %o", req.body);
      const { id } = req.params
      console.log(id)
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
              (SELECT planner_location_items.locations
              )                         
             )
          )
        )
      )
      FROM users
      JOIN planner ON users.id = planner.user_id
      JOIN planner_items ON planner_items.planner_id = planner.plannerid
      JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
      WHERE users.name = $1 AND planner.status = $2`;
      const values = [id,"Completed"];
      const response = await pool.query(text, values);
      console.log("here:",response.rows)
      const [ data ] = response.rows
      console.log(data)
      res.status(201).json(data.json_build_object);
  }
  catch(error)
  {
      debug("error: %o", error);
      res.status(500).json( error.detail );
  }
};




  module.exports = {
    index,
    indexByName
  };