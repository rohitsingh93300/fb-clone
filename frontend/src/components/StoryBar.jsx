// StoryBar.jsx
import { ChevronLeft, ChevronRight, Image, Plus, Smile, Video, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import userLogo from "../assets/emptyUser.webp"
import axios from 'axios';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FaEarthAmericas } from 'react-icons/fa6';
import { TiArrowSortedDown } from 'react-icons/ti';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { toast } from 'sonner';
import StoryViewer from './StoryViewer';

const stories = [
  {
    id: 1,
    name: 'John Doe',
    profileImg: 'https://randomuser.me/api/portraits/men/32.jpg',
    storyImg: 'https://picsum.photos/id/1011/200/300',
  },
  {
    id: 2,
    name: 'Jane Smith',
    profileImg: 'https://randomuser.me/api/portraits/women/44.jpg',
    storyImg: 'https://picsum.photos/id/1012/200/300',
  },
  {
    id: 3,
    name: 'David Johnson',
    profileImg: 'https://randomuser.me/api/portraits/men/36.jpg',
    storyImg: 'https://picsum.photos/id/1013/200/300',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    profileImg: 'https://randomuser.me/api/portraits/women/58.jpg',
    storyImg: 'https://picsum.photos/id/1014/200/300',
  },
  {
    id: 5,
    name: 'Emma Wilson',
    profileImg: 'https://randomuser.me/api/portraits/women/58.jpg',
    storyImg: 'https://picsum.photos/id/1014/200/300',
  },
  {
    id: 6,
    name: 'Emma Wilson',
    profileImg: 'https://randomuser.me/api/portraits/women/58.jpg',
    storyImg: 'https://picsum.photos/id/1014/200/300',
  },
];


const StoryBar = () => {
  const { user } = useSelector(store => store.auth)
  const [allStory, setAllStory] = useState([])
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false)
  const [refreshStory, setRefreshStory] = useState(false)
  const imageRef = useRef()
  const storiesContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [openStoryViewer, setOpenStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file); // <-- save the file
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const submitHandler = async () => {

    if (!file) {
      toast.error("Story must have an image.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(`https://fb-clone-726q.onrender.com/api/v1/story/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.message)
        setFile(null);
        setImagePreview("");
        setOpen(false);
        setRefreshStory(prev => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to post");

    }
  }

  const getAllStories = async () => {
    try {
      const res = await axios.get(`https://fb-clone-726q.onrender.com/api/v1/story/all`, { withCredentials: true })
      if (res.data.success) {
        setAllStory(res.data.stories)
        setTimeout(checkScrollPosition, 100);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const checkScrollPosition = () => {
    if (storiesContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesContainerRef.current;
      console.log(scrollLeft, scrollWidth, clientWidth);

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollStories = (direction) => {
    if (storiesContainerRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      if (direction === 'left') {
        storiesContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        storiesContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }

      // Check scroll position after a small delay to allow the scroll to complete
      setTimeout(checkScrollPosition, 300);
    }
  };

  useEffect(() => {
    getAllStories()
    // Add event listener for scroll
    const container = storiesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [refreshStory])

  console.log(allStory);
  console.log(storiesContainerRef);


  useEffect(() => {
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scrollStories('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          style={{ marginLeft: '-10px' }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-white" />
        </button>
      )}

      {/* Stories Container */}
      <div
        ref={storiesContainerRef}
        className="flex space-x-3 overflow-x-auto py-4 md:px-2 bg-transparent rounded-lg max-w-[360px] md:max-w-[600px] relative"
        onLoad={checkScrollPosition}
        style={{
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none',  /* Firefox */
        }}
      >
        {/* Add Story Card */}
        <Dialog open={open} onOpenChange={setOpen} className="bg-red-600">
          <div onClick={() => setOpen(true)} className="relative flex-shrink-0 w-24 h-40 rounded-lg bg-white dark:bg-[#262829] flex flex-col cursor-pointer hover:scale-105 transition">
            <img src={user.profilePicture || userLogo} alt="" className='h-30 object-cover rounded-t-lg' />
            <div className="p-1 border-4 border-white dark:border-[#262829] absolute bottom-5 left-7 rounded-full bg-blue-600 text-white text-xl flex items-center justify-center mb-2">
              <Plus />
            </div>
            <p className="text-xs font-semibold text-center mt-3">Create Story</p>
          </div>

          <DialogContent className="sm:max-w-[500px] dark:bg-[#262829]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">Create Story</DialogTitle>
              <hr className='my-2' />
              <div className='flex gap-3 items-center'>
                <Avatar>
                  <AvatarImage src={user.profilePicture || userLogo} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className='font-semibold'>{user.firstname} {user.lastname}</h1>
                  <div className='bg-gray-200 rounded-lg p-1 px-2 flex gap-1 items-center'>
                    <FaEarthAmericas className='text-gray-700 w-4 h-4' />
                    <span className='text-sm'>Public</span>
                    <TiArrowSortedDown />
                  </div>
                </div>
              </div>
            </DialogHeader>
            {imagePreview && (
              <div className='w-full h-64 flex items-center justify-center relative'>
                <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                <button onClick={() => setImagePreview("")} variant="ghost" className="rounded-full p-1 cursor-pointer absolute top-3 right-3 bg-white text-gray-500"><X className='h-6 w-6 ' /></button>
              </div>
            )}
            <div className='border rounded-lg p-4 flex justify-between items-center'>
              <h1 className='font-semibold text-gray-800'>Add to your story</h1>
              <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
              <div className='flex gap-3 items-center'>
                <Image onClick={() => imageRef.current.click()} className='text-green-600 cursor-pointer' />
                <Video onClick={() => imageRef.current.click()} className='text-red-500 cursor-pointer' />
                <Smile className='text-orange-500 cursor-pointer' />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitHandler} type="submit" className="w-full bg-[#0866ff]">Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Story Cards */}
        {allStory.map((story, index) => (
          <div
            key={story._id}
            className="relative flex-shrink-0 w-24 h-40 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
            onClick={() => {
              setSelectedStoryIndex(index);
              setOpenStoryViewer(true);
            }}
          >
            <img
              src={story.imageUrl}
              alt=''
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            <img
              src={story.user.profilePicture || userLogo}
              alt=''
              className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500"
            />
            <p className="absolute bottom-2 left-2 right-2 text-xs text-white font-medium truncate">
              {story.user.firstname} {story.user.lastname}
            </p>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scrollStories('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          style={{ marginRight: '-10px' }}
        >
          <ChevronRight className="h-5 w-5 text-gray-800 dark:text-white" />
        </button>
      )}
      {openStoryViewer && (
        <StoryViewer
          stories={allStory}
          initialIndex={selectedStoryIndex}
          onClose={() => setOpenStoryViewer(false)}
        />
      )}
    </div>
  );
};

export default StoryBar;
