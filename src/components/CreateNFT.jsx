import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { create } from 'ipfs-http-client'
import { setGlobalState, useGlobalState, setLoadingMsg,
    setAlert, } from '../store';
import { mintNFT } from '../Blockchain.services';


import axios from 'axios';
import FormData from 'form-data';
// import fs from 'fs';
// const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyOTJmOTQ3Mi1lY2U0LTQyODAtOTFkNi05MWI4MjA5NmRmZmMiLCJlbWFpbCI6ImRldmFzaGlzaGJpc3dhczExQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxNzI3ZjNlYmRmZjE3YTZlZjBmMSIsInNjb3BlZEtleVNlY3JldCI6IjlmMDc4ZGZmNWM2NDA5NzNiY2E0NzZhOWIzN2NiYTJjMmU0YjdmOGU0MTU2NmU2MzdjZmY1ODUxNzViNWZhYjQiLCJpYXQiOjE2OTI4NTEyODZ9.jiFuH3xdDdESo8P_Aph_uV1EXHt-6_K94ItwMckwj0w ' //PASTE_YOUR_PINATA_JWT

const imgHero = 'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg'

const CreateNFT = () => {

    // const auth = 'Basic ' + Buffer.from(
    //     process.env.REACT_APP_INFURIA_PID + ':' + process.env.REACT_APP_INFURIA_API,
    // ).toString('base64')

    // const client = create({
    //     host: 'ipfs.infuria.io',
    //     port: '5001',
    //     protocol: 'https',
    //     headers: {
    //         authorization: auth
    //     },
    // })

    const [modal] = useGlobalState('modal')

    const [ title, setTitle] = useState('')
    const [ description, setDescription] = useState('')
    const [ price, setPrice] = useState('')
    const [ fileUrl, setFileUrl] = useState('')
    const [ imgBase64, setImgBase64] = useState('null')

    const handleSubmit = async (e) => {
        // e.preventDefault()
// 
        if(!title || !description || !price ) return

        setGlobalState('modal', 'scale-0')
        setLoadingMsg('Uploading to IPFS...');
        if(fileUrl)


        try {
            // const created = await client.add(fileUrl)
            const formData = new FormData();
            // const src = "path/to/file.png"; //
    

            // const file = fs.createReadStream(src)//
            formData.append('file', fileUrl)

            const resFile = await axios({
                method: "post",
                url:"https://api.pinata.cloud/pinning/pinFileToIPFS", ///pinning/pinFileToIPFS
                data: formData,
                headers:{
                    // 'pinata_api_key': "1727f3ebdff17a6ef0f1",
                    'pinata_api_key': "290856dc6b3c406697e4",
                    // 'pinata_secret_api_key': "9f078dff5c640973bca476a9b37cba2c2e4b7f8e41566e637cff585175b5fab4",
                    'pinata_secret_api_key': "1320002eb031b91d93fbe8727be905e5ed5338337feb65c5507fcb853e5f48a8",
                    
                    'Content-Type': 'multipart/form-data',
                    // Authorization: JWT
                    
                }


            })

            const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
            console.log(ImgHash);

            setLoadingMsg('Uploaded, approve transaction now ....')
            // const metadataURI = `https://ipfs.io/ipfs/${created.path}`
            // const metadataURI = `https://ipfs.io/ipfs/${formData.path}`
// 
            // const pinataMetadata = JSON.stringify({
            //     name: 'File name',
            //   });
            //   formData.append('pinataMetadata', pinataMetadata);
            const metadataURI = JSON.stringify({
                name: 'File name',
              });
              formData.append('metadataURI', metadataURI);
              
            // const nft = { title, price, description, metadataURI }
            const nft = { title, price, description, metadataURI }
            setLoadingMsg('Intializing transaction...')
            setFileUrl(metadataURI)
            await mintNFT(nft)

            closeModal()
            setAlert('Minting Completed...')
            window.location.reload()

            // console.log(resFile.data);
        } catch (error) {
            console.log('Error uploading file', error)
            setAlert('Minting Failed...', 'red')
            
        }

  

       
    }


    const ChangeImage = async (e) => {
        const reader = new FileReader()
        if(e.target.files[0]) reader.readAsDataURL(e.target.files[0])

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result
            setImgBase64(file)
            setFileUrl(e.target.files[0])
        }
    }

    const closeModal = () => {
        setGlobalState('modal', 'scale-0')
        resetForm()

    }

    const resetForm = () => {
        setFileUrl('')
        setImgBase64('')
        setTitle('')
        setDescription('')
        setPrice('')
    }
  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex items-center bg-black bg-opacity-50 transform transition-transform duration-300 ${modal}`}>
        <div className='bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6'>
            <form onSubmit={handleSubmit} className='flex flex-col'>

            {/* <input type="file" onChange={(e) =>setFileUrl(e.target.files[0])} required /> */}
                <div className='flex justify-between items-center text-gray-500'>
                    <p className='font-semibold'>Add NFT</p>
                    <button
                    type='button'
                    onClick={closeModal}
                    className='border-0 bg-transparent focus:outline-none'>
                        <FaTimes/>
                    </button>
                </div>

                <div className='flex justify-center rounded-xl mt-5 '>
                    <div className='shrink-0 h-20 w-20 rounded-xl overflow-hidden '>
                        <img className='h-full w-full object-cover cursor-pointer' src={imgBase64 ||imgHero} alt='NFT'/>
                    </div>
                </div>

                <div className='flex justify-between items-center bg-gray-800 rounded-xl mt-5'>
                    <label className='block'>
                        <span className='sr-only'>Choose Profile photo</span>
                        <input type='file'
                        accept='imgage/png imgage/gif imgage/jpeg, imgage/jpg imgage/webp'
                        required
                        className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4 file:rounded-full border-0 file:text-sm file:font-semibold hover:file:bg-[#1d2631]
                        focus:outline-none cursor-pointer focus:ring-0'
                        onChange={ChangeImage}
                        // onChange={(e) =>setFileUrl(e.target.files[0])}
                        />
                    </label>
                </div>

                
                <div className='flex justify-between items-center bg-gray-800 rounded-xl mt-5'>
                        <input type='text'
                        className='block w-full text-sm text-slate-500
                        focus:outline-none cursor-pointer focus:ring-0
                        bg-transparent border-0'
                        placeholder='Title'
                        name='title'
                        onChange={(e) =>setTitle(e.target.value)}
                        value={title}
                        required

                        />
                </div>

                <div className='flex justify-between items-center bg-gray-800 rounded-xl mt-5'>
                        <input type='number'
                        required
                        className='block w-full text-sm text-slate-500
                        focus:outline-none cursor-pointer focus:ring-0
                        bg-transparent border-0'
                        placeholder='Price (ETH)'
                        min={0.01}
                        step={0.01}
                        name='price'
                        onChange={(e) =>setPrice(e.target.value)}
                        value={price}
                        />
                </div>

                <div className='flex justify-between items-center bg-gray-800 rounded-xl mt-5'>
                        <textarea type='text'
                        required
                        className='block w-full text-sm text-slate-500
                        focus:outline-none cursor-pointer focus:ring-0
                        bg-transparent border-0 h-20 '
                        placeholder='Description'
                        name='description'
                        onChange={(e) =>setDescription(e.target.value)}
                        value={description}
                        ></textarea>
                </div>
            
               <button
            // type="submit"
            onClick={handleSubmit}
                className="flex flex-row justify-center items-center
                  w-full text-white text-md bg-[#e32970]
                hover:bg-[#bd255f] py-2 px-5 rounded-full
                  drop-shadow-xl border border-transparent
                  hover:bg-transparent hover:text-[#e32970]
                  hover:border hover:border-[#bd255f]
                  focus:outline-none focus:ring mt-5"
                  >
                 Mint Now
               </button>
            </form>
        </div>
    </div>
  )
}

export default CreateNFT