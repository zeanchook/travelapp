const APIKEY = process.env.GOOGLEMAP_API;


const searchPlaces = async (req,res) => {
    
    const {query} = req.params;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${APIKEY}`;
    console.log(url)
    try
    {
        
        const response = await fetch(url)
        const myResults = await response.json();
        res.status(201).json(myResults);
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({ "search error ": error });
    }
};

const searchDetails = async (req,res) => {
    
    const {query} = req.params;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${query}&key=${APIKEY}`;
    console.log(url)
    try
    {
        
        const response = await fetch(url)
        const myResults = await response.json();
        res.status(201).json(myResults);
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({ "search error ": error });
    }
};

module.exports = {
    searchPlaces,
    searchDetails
  };