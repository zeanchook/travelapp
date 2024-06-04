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

const searchVeryDetail = async (req,res) => {
    
    const {query} = req.params;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${APIKEY}`;
    console.log(url)
    try
    {
        
        const response = await fetch(url)
        const myResults = await response.json();

        const lengthMainQuery = myResults.predictions;
        console.log(lengthMainQuery[0].place_id)
        
        const finalData = [];

    
        const promises = lengthMainQuery.map(async(item) => 
            {
                const url2 = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&key=${APIKEY}`;
                const response2 = await fetch(url2)
                const myResults2 = await response2.json();
                const {result} = await myResults2
                // console.log(result)
                // console.log(myResults2.result)
                finalData.push(myResults2.result)
            }
            )
        Promise.all(promises).then(() =>
        {
            console.log("finalData", finalData)
            res.status(201).json(finalData);
        })
        
        
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({ "search error ": error });
    }
};

module.exports = {
    searchPlaces,
    searchDetails,
    searchVeryDetail
  };