const GTOKEN = process.env.GOOGLEMAP_API;
export const processData = (type) =>
{
    let data = ""
    if(type.type === "result")
    {
    data  = type && type?.selected.map(item => 
          {
            let image = "" 
            let url = "" 
            if(item.photos)
            {
              const image = item?.photos[Math.floor(Math.random()*item?.photos?.length)].photo_reference
              url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference=
            ${image}&key=${GTOKEN}`
            }
            const ob1 = {
              "city": item.name,
              "latitude": item.geometry.location.lat,
              "longitude": item.geometry.location.lng,
              "image": url
          }
            return ob1
          })
    }
    else if(type.type === "select")
    {
      data = type && type?.result?.filter(item => item.place_id === type.selected).map(item => 
        {
          let image = "" 
          let url = "" 
          if(item.photos)
          {
            const image = item?.photos[Math.floor(Math.random()*item?.photos?.length)].photo_reference
            url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference=
          ${image}&key=${GTOKEN}`
          }
          const ob1 = {
            "city": item.placename,
            "latitude": item.geometry.location.lat,
            "longitude": item.geometry.location.lng,
            "image": url
        }
        console.log(ob1)
          return ob1
        })
    }
    else if(type.type === "plannerview")
    {
      data = type?.selected?.map(item => 
        {
          const ob1 = {
            "city": item.placename,
            "latitude": item.locations[1],
            "longitude": item.locations[0],
            "image": "",
            "plannerlocationitemsid": item.plannerlocationitemsid
        }
          return ob1
        }).sort((a,b) => 
        {
          if(a.plannerlocationitemsid > b.plannerlocationitemsid)
            {
                return 1;
            }
            else if(a.plannerlocationitemsid < b.plannerlocationitemsid)
            {
                return -1;
  
            }
            else{
                return 0;
            }
        })
        console.log(data)
    }
    else if (type.type === "planoverview")
    {
      console.log(type.type)
      data = type?.selected?.map(item => 
        {
          const ob1 = {
            "city": item.placename,
            "latitude": item.locations[1],
            "longitude": item.locations[0],
            "image": "",
            "plannerlocationitemsid": item.plannerlocationitemsid
        }
          return ob1
        }).sort((a,b) => 
        {
          if(a.plannerlocationitemsid > b.plannerlocationitemsid)
            {
                return 1;
            }
            else if(a.plannerlocationitemsid < b.plannerlocationitemsid)
            {
                return -1;
  
            }
            else{
                return 0;
            }
        })
        console.log(data)
    }
  
    if(type.type === "POST")
    {
      console.log(type.selected)
      data = type?.selected?.data.map(item => 
        {
          const ob1 = {
            "city": item.placename,
            "latitude": item.locations[1],
            "longitude": item.locations[0],
        }
          return ob1
    })}
    return data
}

export const markerService = (onSelectCity,mapData,data) => 
{
    if(mapData && mapData.selected.length !== 0 )
  {
    if(mapData.type === "select")
      {
        const [ handle ] = data
        onSelectCity(handle,10)
      }
    if(mapData.type === "plannerview")
    {
        const sumLatitudes = data.reduce((acc, current) => acc + current.latitude, 0);
        const sumLongitudes = data.reduce((acc, current) => acc + current.longitude, 0);
        const averageLatitude = sumLatitudes / data.length;
        const averageLongitude = sumLongitudes / data.length;
        onSelectCity({longitude: averageLongitude, latitude: averageLatitude},15)
    }
    console.log(mapData.type)
    if(mapData.type === "planoverview")
    {
        const sumLatitudes = data.reduce((acc, current) => acc + current.latitude, 0);
        const sumLongitudes = data.reduce((acc, current) => acc + current.longitude, 0);
        const averageLatitude = sumLatitudes / data.length;
        const averageLongitude = sumLongitudes / data.length;
        onSelectCity({longitude: averageLongitude, latitude: averageLatitude},10)
    }
  } 
}