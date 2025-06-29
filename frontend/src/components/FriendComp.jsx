import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userLogo from "../assets/emptyUser.webp"
import { useNavigate } from 'react-router-dom'

const FriendComp = ({friends}) => {
    // const [friends, setFriends] = useState([])
    const {user} = useSelector(store=>store.auth)
    const navigate = useNavigate()
    // const getAllFriends = async()=>{
    //     try {
    //         const res = await axios.get(`http://localhost:8000/api/v1/auth/user/${user._id}/friends`)
    //         if(res.data.success){
    //             setFriends(res.data.friends)
    //         }
    //     } catch (error) {
    //         console.log(error);
            
    //     }
    // }
    // useEffect(()=>{
    //     getAllFriends()
    // },[])
    console.log(friends);
    
  return (
    <div className='bg-white dark:bg-[#262829] p-5 rounded-lg mt-2 md:mt-5'>
      <h1 className='font-semibold text-xl mb-5'>Friends</h1>

      {
        friends?.length > 0 ? <div className='grid grid-cols-3 gap-2 rounded-2xl'>
        {
            friends?.map((friend)=>{
                return <div key={friend._id} className=''>
                       <img onClick={()=>navigate(`/profile/${friend._id}/post`)} src={friend.profilePicture || userLogo} alt="" className='aspect-square rounded-xl'/>
                       <h1>{friend.firstname} {friend.lastname}</h1>
                </div>
            })
        }
      </div> : <div>
        <h1 className='text-gray-800 dark:text-gray-300'>You have no friends to show</h1>
      </div>
      }
      
    </div>
  )
}

// http://localhost:8000/api/v1/auth/requests/mutual

export default FriendComp
