import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { Bio } from "../models/userbio.model.js";


export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender, dateOfBirth } = req.body;

    //  check the existing user with email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth
    })

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",

    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  check the existing user with email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      })
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
      return res.status(404).json({
        message: "Invalid Password",
        success: false
      })
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" }).json({
      success: true,
      message: `Welcome back ${user.firstname}`,
      user
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: error.message
    })
  }
}

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: 'posts',
        options: { sort: { createdAt: -1 } }, // Sort posts by createdAt DESC
        populate: {
          path: 'user',
          select: 'firstname lastname profilePicture'
        }
      })
      .populate({ path: 'bio' }).populate({ path: 'friends' });

    return res.status(200).json({
      user,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.id; // Assuming you have user auth middleware
    const file = req.file; // Assuming you're using multer for file upload

    if (!file) {
      return res.status(400).json({
        message: "profile picture is required",
        success: false
      })
    }

    const fileUri = getDataUri(file)
    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(fileUri);

    // Update user document
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully!',
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const updateCoverPhoto = async (req, res) => {
  try {
    const userId = req.id; // Assuming you have user auth middleware
    const file = req.file; // Assuming you're using multer for file upload

    if (!file) {
      return res.status(400).json({
        message: "Cover picture is required",
        success: false
      })
    }

    const fileUri = getDataUri(file)
    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(fileUri);

    // Update user document
    const user = await User.findByIdAndUpdate(
      userId,
      { coverPhoto: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cover photo updated successfully!',
      coverPhoto: user.coverPhoto
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateIntro = async (req, res) => {
  try {
    const userId = req.id; // assuming authentication middleware sets req.user
    const {
      bioText,
      liveIn,
      relationship,
      workplace,
      education,
      phone,
      hometown,
    } = req.body;

    // Find the existing bio or create a new one
    let bio = await Bio.findOne({ user: userId });

    if (!bio) {
      bio = new Bio({ user: userId });
    }

    // Update only provided fields
    if (bioText !== undefined) bio.bioText = bioText;
    if (liveIn !== undefined) bio.liveIn = liveIn;
    if (relationship !== undefined) bio.relationship = relationship;
    if (workplace !== undefined) bio.workplace = workplace;
    if (education !== undefined) bio.education = education;
    if (phone !== undefined) bio.phone = phone;
    if (hometown !== undefined) bio.hometown = hometown;

    await bio.save();

    // Update the user's reference to this bio (if not already set)
    const user = await User.findById(userId);
    if (!user.bio || user.bio.toString() !== bio._id.toString()) {
      user.bio = bio._id;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      bio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating bio",
      error: error.message,
    });
  }
}

export const followUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user to follow
    const currentUserId = req.id; // ID of the logged-in user (assumed from auth middleware)

    if (id === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if already following
    if (currentUser.following.includes(id)) {
      return res.status(400).json({ message: "Already following this user." });
    }

    // Add follow relationship
    currentUser.following.push(id);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully.",user:currentUser, userProfile:userToFollow, success:true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success:false });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user to unfollow
    const currentUserId = req.id; // ID of the logged-in user (from auth middleware)

    if (id === currentUserId) {
      return res.status(400).json({ message: "You can't unfollow yourself." });
    }

    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is not being followed
    if (!currentUser.following.includes(id)) {
      return res.status(400).json({ message: "You are not following this user." });
    }

    // Remove follow relationship
    currentUser.following = currentUser.following.filter(
      (userId) => userId.toString() !== id
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (userId) => userId.toString() !== currentUserId
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully.", success:true, user:currentUser, userProfile:userToUnfollow });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success:false });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You can't send a request to yourself." });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (currentUser.sentRequests.includes(targetUserId)) {
      return res.status(400).json({ message: "Request already sent." });
    }

    currentUser.sentRequests.push(targetUserId);
    targetUser.friendRequests.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Friend request sent.", user: currentUser, userProfile: targetUser, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    currentUser.sentRequests = currentUser.sentRequests.filter(
      (id) => id.toString() !== targetUserId.toString()
    );

    targetUser.friendRequests = targetUser.friendRequests.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: "Friend request canceled.",
      user: currentUser,
      userProfile: targetUser,
      success: true,
    });
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    res.status(500).json({ message: "Server error", error, success: false });
  }
};


export const acceptFriendRequest = async (req, res) => {
  try {
    const requesterId = req.params.id; // ID of user who sent the request
    const currentUserId = req.id; // Logged-in user accepting the request

    const requester = await User.findById(requesterId);
    const currentUser = await User.findById(currentUserId);

    if (!requester || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the request actually exists
    if (!currentUser.friendRequests.includes(requesterId)) {
      return res.status(400).json({ success: false, message: 'No friend request found' });
    }

    // ✅ Remove friend request and sent request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );
    requester.sentRequests = requester.sentRequests.filter(
      (id) => id.toString() !== currentUserId
    );

    // ✅ Add each other to friends
    if (!currentUser.friends.includes(requesterId)) {
      currentUser.friends.push(requesterId);
    }
    if (!requester.friends.includes(currentUserId)) {
      requester.friends.push(currentUserId);
    }

    // ✅ (Optional) Add each other to followers/following if needed
    if (!currentUser.followers.includes(requesterId)) {
      currentUser.followers.push(requesterId);
    }
    if (!currentUser.following.includes(requesterId)) {
      currentUser.following.push(requesterId);
    }
    if (!requester.followers.includes(currentUserId)) {
      requester.followers.push(currentUserId);
    }
    if (!requester.following.includes(currentUserId)) {
      requester.following.push(currentUserId);
    }

    // Save changes
    await currentUser.save();
    await requester.save();

    return res.status(200).json({ message: 'Friend request accepted.', user: currentUser, userProfile: requester, success: true });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({ message: 'Server error', error, success: false });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const senderUserId = req.params.id;   // The person who sent you the request
    const currentUserId = req.id;         // Logged-in user (You - the receiver)

    const senderUser = await User.findById(senderUserId);
    const currentUser = await User.findById(currentUserId);

    if (!senderUser || !currentUser) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Remove sender from your friendRequests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== senderUserId.toString()
    );

    // Remove you from sender's sentRequests
    senderUser.sentRequests = senderUser.sentRequests.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await senderUser.save();

    res.status(200).json({
      message: "Incoming friend request deleted successfully.",
      user: currentUser,
      userProfile: senderUser,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting incoming friend request:", error);
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

export const unfriendUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== targetUserId
    );
    currentUser.friends = currentUser.friends.filter(
      (id)=> id.toString() !== targetUserId
    );

    targetUser.following = targetUser.following.filter(
      (id) => id.toString() !== currentUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    targetUser.friends = targetUser.friends.filter(
      (id)=> id.toString() !== currentUserId
    )

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Unfriended successfully.", user:currentUser, userProfile:targetUser, success:true});
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success:false });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.id)
      .populate('friendRequests', 'firstname lastname profilePicture');

    res.status(200).json({
      requests: currentUser.friendRequests,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error, success: false });
  }
};

export const getSuggestedPeople = async (req, res) => {
  try {
    const currentUser = await User.findById(req.id);

    const excludedIds = [
      currentUser._id,
      ...currentUser.following,
      ...currentUser.followers,
      ...currentUser.friendRequests,
      ...currentUser.sentRequests
    ].map(id => id.toString());

    const suggestions = await User.find({
      _id: { $nin: excludedIds }
    }).select('firstname lastname profilePicture');

    res.status(200).json({ suggestions, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error, success: false });
  }
};

export const getMutualFriendRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.id)
      .populate('friendRequests', 'firstname lastname profilePicture')
      .populate('sentRequests', '_id');

    // Get sent and received IDs
    const sentIds = currentUser.sentRequests.map((u) => u._id.toString());
    const received = currentUser.friendRequests;

    // Find mutual IDs (users in both arrays)
    const mutuals = received.filter((user) => sentIds.includes(user._id.toString()));

    res.status(200).json({ mutualFriendRequests: mutuals, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error, success: false });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.params.id || req.id;

    const user = await User.findById(userId).populate({
      path: 'friends',
      select: 'firstname lastname profilePicture email', // You can add or remove fields
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Friends fetched successfully',
      friends: user.friends,
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ success: false, message: "Empty search" });

    const users = await User.find({
      $or: [
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("firstname lastname username profilePicture");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};