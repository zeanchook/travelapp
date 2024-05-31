import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import Dropzone from 'react-dropzone'
import { useState } from 'react'
import { postMedia } from '../../utilities/upload-request'


export default function UserProfilePage()
{
    const [state, setState] = useState("")
    console.log(state)

    const handleSubmit = async() =>
    {
        if (state) {
            const formData = new FormData();
            formData.append("userId", "123");
            formData.append("description", "123");
            formData.append("image", state);

            // formData.append("image", image);
        console.log(state.path)
        const imgbbResponse = await fetch(
            `https://api.imgbb.com/1/upload?key=ba13ff69ec1abf921610f6ebf28b4565`,
            {
            method: "POST",
            body: formData,
            }
            
        );
        const imgbbData = await imgbbResponse.json();
        console.log(imgbbResponse)
        const imageUrl = imgbbData.data.url;
        }
    }


    const [video, setVideo] = useState("");

    const uploadVideos = async(files) => {
        const reponse = await postMedia(files);    
        setVideo(reponse.secure_url);
        
  };


    return(
    <>

    <div>
      <input type="file" onChange={(e) => uploadVideos(e.target.files)} />
      <video src={video} controls />
    </div>

    <Dropzone 
    acceptedFiles=".jpg,.jpeg,.png"
    multiple={false}
    onDrop={acceptedFiles => setState(acceptedFiles[0])}>
    {({getRootProps, getInputProps}) => (
        <section>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop an image here, or click to select an image</p>
        </div>
        </section>
    )}
    </Dropzone>
    <img src={state.path}></img>
    <button onClick={handleSubmit}>Submit</button>


    <div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input id="dropzone-file" type="file" onChange={(e) => uploadVideos(e.target.files)} className="hidden" />
    </label>
    </div> 




    </>)
}