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
            WHERE p.plannerid=$1`,
            values:[plannerItems.plannerid]}

        const plannerItemsQueryResponse = await pool.query(query);
        console.log(plannerItemsQueryResponse)


        //return all items that just created 


        // const [responseResult] = response.rows
        // const { id } = responseResult
        // console.log(id)
        // const plannerQuery = "INSERT INTO planner (user_id, title) VALUES ($1, $2) RETURNING title,created_at"
        // const plannerValues = [id,item]
        // const plannerResponse = await pool.query(plannerQuery,plannerValues);
        res.status(201).json(plannerItemsQueryResponse.rows);
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json( {error: error.detail, hint: error.hint} );
    }
};

const index = async (req,res) => {

    console.log(req.body)
    const [visitedUser] = req.body
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

        //update total location before query

        
        const text = `SELECT * FROM users
        JOIN planner ON users.id = planner.user_id
        WHERE users.name = $1`;
        const values = [visitedUser.name];
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
        
        const text = `SELECT id,name,date,title,startdate,enddate,locations,planner.status,planner.plannerid,planner_items.planner_items_id FROM users
        JOIN planner ON users.id = planner.user_id
        JOIN planner_items ON planner_items.planner_id = planner.plannerid
        WHERE planner_items.planner_id=$1`;
        const values = [id];
        // WHERE users.name=$1 AND planner_items.planner_id=$2`;
        // const values = [name,id];
        const response = await pool.query(text,values);
        console.log("this is the response", response.rows)
        // console.log(response.rows.length)
        res.status(201).json(response.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
};

const getEachDetails = async(req,res) =>
{
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
        JOIN planner_items ON planner_items.planner_id = planner.plannerid
        JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
        WHERE planner_items.planner_id=$1`;
        // WHERE users.name=$1 AND planner_items.planner_id=$2`;
        // const values = [name,id];
        const values = [id];
        const response = await pool.query(text,values);
        console.log("this is the response", response.rows)
        // console.log(response.rows.length)
        res.status(201).json(response.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
}

// const verification = async(req,res,next) =>
// {
//     const pool = new Pool({
//         connectionString,
//         });

//     const currentUser = getUser(req, res);
//     const [ user ] = currentUser
//     const { name } = user
//     console.log(name)
    
//     try
//     {
        
//         const text = `SELECT * FROM users
//         JOIN planner ON users.id = planner.user_id
//         WHERE users.name = $1`;
//         const values = ["s"];
//         const response = await pool.query(text,values);
//         console.log("this is the response", response.rows)
//         next();
//         // console.log(response.rows.length)
//         // res.status(201).json(response.rows);
       
//     }
//     catch(error)
//     {
//         // debug("error: %o", error);
//         console.log(error)
//         res.status(500).json( {error: error.detail} );
//     }
// }


const addtoItinerary = async (req,res) => {

    console.log("passes thru")
    const { planneritemsid } = req.params
    console.log("here,",planneritemsid)
    const { planner_items_id, name, locations, plannerId, coverphoto} = req.body
    console.log(coverphoto)
    
    // console.log(req.body)
    const pool = new Pool({
        connectionString,
        });
console.log(plannerId)
    // const currentUser = getUser(req, res);
    // const [ user ] = currentUser
    // const { name } = user
    // console.log(name)
    
    // // JOIN planner_items ON planner_items.planner_id = planner.id
    try
    {
        
        const text1 = `INSERT INTO planner_location_items (planner_items_id,placename,locations)  VALUES($1,$2,$3)`;
        const values1 = [parseInt(planner_items_id), name, locations];
        const response1 = await pool.query(text1,values1);

        console.log("this is the response", response1.rows)



        const text2 = `SELECT coverphoto FROM planner
        WHERE plannerid = $1`;
        const values2 = [plannerId];
        const respons2 = await pool.query(text2,values2);
        console.log("respons2",respons2.rows)

        //patching total location 
        const patching = `UPDATE planner
        SET ref_count = (
        SELECT COUNT(*) FROM users
        JOIN planner ON users.id = planner.user_id
        JOIN planner_items ON planner_items.planner_id = planner.plannerid
        JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
        WHERE plannerid = $1)
        WHERE plannerid = $1`;

        const patchingVal = [plannerId];
        const patchingResponse = await pool.query(patching,patchingVal);
        console.log("??",patchingResponse)

        if(respons2.rows[0].coverphoto === null && coverphoto !== "")
        {
            const text3 = `UPDATE planner
            SET coverphoto = $1 WHERE plannerid = $2`;
            const values3 = [coverphoto,plannerId];
            const respons3 = await pool.query(text3,values3);
            console.log("respons3",respons3.rows);
            res.status(201).json(respons3.rows);
        }

        
        // // console.log(response.rows.length)
        res.status(201).json(response1.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
};


const patchItinerary = async (req,res) => {

//    console.log(req.body)

const { A_PlannerItemID , A_PlannerLocID , B_PlannerItemID , B_PlannerLocID} = req.body
console.log(A_PlannerItemID , A_PlannerLocID , B_PlannerItemID , B_PlannerLocID)
    // console.log(req.body)
    const pool = new Pool({
        connectionString,
        });


    try
    {
        //temp value
        const text1 = `UPDATE planner_location_items
        SET plannerlocationitemsid = $1 WHERE planner_items_id = $2 AND planner_location_items.plannerlocationitemsid = $3`;
        const values1 = [0, A_PlannerItemID, A_PlannerLocID];
        const response1 = await pool.query(text1,values1);
        console.log("this is the response", response1.rows)

        //update B
        const text2 = `UPDATE planner_location_items
        SET plannerlocationitemsid = $1 WHERE planner_items_id = $2 AND planner_location_items.plannerlocationitemsid = $3`;
        const value2 = [A_PlannerLocID, B_PlannerItemID, B_PlannerLocID];
        const response2 = await pool.query(text2,value2);
        console.log("this is the response", response2.rows)

        //update A
        const text3 = `UPDATE planner_location_items
        SET plannerlocationitemsid = $1 WHERE planner_items_id = $2 AND planner_location_items.plannerlocationitemsid = $3`;
        const value3 = [B_PlannerLocID, A_PlannerItemID, 0];
        const resposne3 = await pool.query(text3,value3);
        console.log("this is the response", resposne3.rows)
    //     // // console.log(response.rows.length)
        // res.status(201).json(response2.rows);
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
};

const patchDaysItinerary = async (req,res) => {

    //    console.log(req.body)
    
    const { A_PlannerItemID , A_PlannerLocID , B_PlannerItemID} = req.body
    console.log(A_PlannerItemID , A_PlannerLocID , B_PlannerItemID)
        // console.log(req.body)
        const pool = new Pool({
            connectionString,
            });
    
        try
        {
            //query1
            const text1 = `UPDATE planner_location_items
            SET planner_items_id = $3 
            WHERE planner_location_items.plannerlocationitemsid = $2
            AND planner_location_items.planner_items_id = $1`;
            const values1 = [A_PlannerItemID , A_PlannerLocID , B_PlannerItemID];
            const response1 = await pool.query(text1,values1);
            console.log("this is the response", response1.rows)
    

            res.status(201).json(response1.rows);
           
        }
        catch(error)
        {
            // debug("error: %o", error);
            console.log(error)
            res.status(500).json( {error: error.detail} );
        }
    };

    const deletePlanner = async (req,res) => {

        //    console.log(req.body)
        
        const { id } = req.params
        console.log(id)
            const pool = new Pool({
                connectionString,
                });
        
            try
            {
                // delete planner location items first
                const text1 = `DELETE FROM planner_location_items
                WHERE planner_items_id IN (SELECT planner_items_id FROM planner_items WHERE planner_id 
                    IN (SELECT plannerid FROM planner WHERE plannerid = $1))`;
                const values1 = [id];

                const response1 = await pool.query(text1,values1);
                console.log("this is the response", response1.rows)


                // delete planner_items
                const text2 = `DELETE FROM planner_items
                WHERE planner_items.planner_id IN (SELECT plannerid FROM planner WHERE plannerid = $1)`;
                const values2 = [id];

                const response2 = await pool.query(text2,values2);
                console.log("this is the response", response2.rows)

                // delete planner_items
                const text3 = `DELETE FROM planner
                WHERE plannerid = $1`;
                const values3 = [id];

                const response3 = await pool.query(text3,values3);
                console.log("this is the response", response3.rows)

                console.log("this is the response", response3)
                res.status(201).json(response3.rows);
               
            }
            catch(error)
            {
                // debug("error: %o", error);
                console.log(error)
                res.status(500).json( {error: error.detail} );
            }
        };


        const patchPlanner = async (req,res) => {

            //    console.log(req.body)
            
            const { id } = req.params
            const { status } = req.body
            console.log(status)
            console.log(id)
                const pool = new Pool({
                    connectionString,
                    });

                
            
                try
                {
                    const text1 = `update planner
                    set status = $1 where plannerid = $2`;
                    const values1 = [status,id];
    
                    const response1 = await pool.query(text1,values1);
                    console.log("this is the response", response1.rows)
                    res.status(201).json(response1.rows);
               
                }
                catch(error)
                {
                    // debug("error: %o", error);
                    console.log(error)
                    res.status(500).json( {error: error.detail} );
                }
            };


            const getUserPlannerStats = async (req,res) => {

                const  user  = (req.body)
                    const pool = new Pool({
                        connectionString,
                        });
    
                    console.log(user)
                
                    try
                    {
                        const text1 = `SELECT users.name, planner.title, planner.status,users.views
                        FROM users
                        JOIN planner ON users.id = planner.user_id
                        JOIN planner_items ON planner_items.planner_id = planner.plannerid
                        JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
                        WHERE users.id = $1`;
                        
                        const values1 = [user.id];
        
                        const response1 = await pool.query(text1,values1);
                        console.log("this is the response", response1.rows)
                        res.status(201).json(response1.rows);
                   
                    }
                    catch(error)
                    {
                        // debug("error: %o", error);
                        // console.log(error)
                        // res.status(500).json( {error: error.detail} );
                    }
                };

                const getAllPlannerStats = async (req,res) => {

                        const pool = new Pool({
                            connectionString,
                            });
                            
                        try
                        {
                            const text1 = `SELECT *
                            FROM users
                            JOIN planner ON users.id = planner.user_id
                            JOIN planner_items ON planner_items.planner_id = planner.plannerid
                            JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id`;        
                            const response1 = await pool.query(text1);
                            console.log("this is the response", response1.rows)
                            res.status(201).json(response1.rows);
                       
                        }
                        catch(error)
                        {
                            // debug("error: %o", error);
                            console.log(error)
                            res.status(500).json( {error: error.detail} );
                        }
                    };


                    
        
const deleteItineraryItem = async (req,res) => {

        const { id } = req.params
        console.log(id)
        const pool = new Pool({
            connectionString,
            });
            
        try
        {
            const text1 = `DELETE FROM planner_location_items
            WHERE plannerlocationitemsid = $1`;
            const values1 = [id];     
            const response1 = await pool.query(text1,values1);
            console.log("this is the response", response1.rows)
            res.status(201).json(response1.rows);
        
        }
        catch(error)
        {
            // debug("error: %o", error);
            console.log(error)
            res.status(500).json( {error: error.detail} );
        }
    };




const testing = async (req,res) => {

    
    const pool = new Pool({
        connectionString,
        });

        // JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
    try
    {
        
        const text = `SELECT * FROM users
        JOIN planner ON users.id = planner.user_id
        JOIN planner_items ON planner_items.planner_id = planner.plannerid
        JOIN planner_location_items ON planner_location_items.planner_items_id = planner_items.planner_items_id
        WHERE users.name=$1 AND planner_items.planner_id=$2`;
        
        const values = ["admin",2];
        const response = await pool.query(text,values);
        console.log("this is the response", response.rows)
        res.json(response.rows)
       
    }
    catch(error)
    {
        // debug("error: %o", error);
        console.log(error)
        res.status(500).json( {error: error.detail} );
    }
};

module.exports = {
    create,
    index,
    getDetails,
    // verification,
    addtoItinerary,
    testing,
    getEachDetails,
    patchItinerary,
    patchDaysItinerary,
    deletePlanner,
    patchPlanner,
    getUserPlannerStats,
    getAllPlannerStats,
    deleteItineraryItem
}