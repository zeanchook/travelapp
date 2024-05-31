const connectionString = process.env.PGDB_URL;
const pg = require("pg");
const { Pool, Client } = pg;
const { getUser } = require('../../config/checkToken');

const create = async (req,res) => {
    // debug("body: %o", req.body);
    console.log(req.body);
    const { title, startDate , endDate , daysLength } = req.body
    console.log(title, startDate , endDate , daysLength)

    const pool = new Pool({
        connectionString,
        });

    const currentUser = getUser(req, res);
    console.log(currentUser)
    const [ user ] = currentUser
    const { name } = user
    console.log(name)

    try
    {
        // find user
        const text = "SELECT id FROM users WHERE name=$1";
        const values = [name];
        const response = await pool.query(text,values);
        console.log("this is the response", response.rows)
        const [responseResult] = response.rows
        const { id } = responseResult

        //creating planner
        const plannerQuery = "INSERT INTO planner (user_id, title, startdate, enddate, dayslength) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        const plannerValues = [id, title, startDate , endDate , daysLength]
        const plannerResponse = await pool.query(plannerQuery,plannerValues);
        const [ plannerItems ] = plannerResponse.rows
        console.log(plannerItems.id)
        console.log(plannerItems)

        //creating planner_items
        const query = {text: 
            `INSERT INTO planner_items (date,planner_id) 
            SELECT generate_series(p.startdate, p.enddate, INTERVAL '1 day') , $1
            FROM planner AS p
            WHERE p.id=$1`,
            values:[plannerItems.id]}

        const plannerItemsQueryResponse = await pool.query(query);
        console.log(plannerItemsQueryResponse)


        //return all items that just created 


        // const [responseResult] = response.rows
        // const { id } = responseResult
        // console.log(id)
        // const plannerQuery = "INSERT INTO planner (user_id, title) VALUES ($1, $2) RETURNING title,created_at"
        // const plannerValues = [id,item]
        // const plannerResponse = await pool.query(plannerQuery,plannerValues);
        // res.status(201).json(plannerResponse.rows);
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json( {error: error.detail, hint: error.hint} );
    }
};

const index = async (req,res) => {

    const pool = new Pool({
        connectionString,
        });

    const currentUser = getUser(req, res);
    const [ user ] = currentUser
    const { name } = user
    console.log(name)
    
    // JOIN planner_items ON planner_items.planner_id = planner.id
    try
    {
        
        const text = `SELECT * FROM users
        JOIN planner ON users.id = planner.user_id
        WHERE users.name = $1`;
        const values = [name];
        const response = await pool.query(text,values);
        // console.log("this is the response", response.rows)
        console.log(response.rows.length)
        res.status(201).json(response.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
};


const getDetails = async (req,res) => {

    console.log("passes thru")
    const { id } = req.params
    console.log("here,",id)
    const pool = new Pool({
        connectionString,
        });

    const currentUser = getUser(req, res);
    const [ user ] = currentUser
    const { name } = user
    console.log(name)
    
    // // JOIN planner_items ON planner_items.planner_id = planner.id
    try
    {
        
        const text = `SELECT * FROM users
        JOIN planner ON users.id = planner.user_id
        WHERE users.name = $1`;
        const values = ["s"];
        const response = await pool.query(text,values);
        console.log("this is the response", response.rows)
        // console.log(response.rows.length)
        // res.status(201).json(response.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
};

const verification = async(req,res,next) =>
{
    const pool = new Pool({
        connectionString,
        });

    const currentUser = getUser(req, res);
    const [ user ] = currentUser
    const { name } = user
    console.log(name)
    
    try
    {
        
        const text = `SELECT * FROM users
        JOIN planner ON users.id = planner.user_id
        WHERE users.name = $1`;
        const values = ["s"];
        const response = await pool.query(text,values);
        console.log("this is the response", response.rows)
        next();
        // console.log(response.rows.length)
        // res.status(201).json(response.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
}

module.exports = {
    create,
    index,
    getDetails,
    verification
}