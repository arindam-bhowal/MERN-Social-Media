const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// Update User 
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json('Your account has been updated')
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else {
        return res.status(403).json("You can update your account only")
    }
})


// Delete User

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json('Your account has been deleted successfully')

        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else {
        return res.status(403).json("You can delete your account only")
    }
})

// get a user 

router.get('/', async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = username
            ? await User.findOne({ username: username })
            : await User.findById(userId)
        // !user && res.status(403).json('No user found')
        const { password, updatedAt, ...others } = user._doc
        res.status(200).json(others)

    } catch (error) {
        res.status(500).json(error)
    }
})

// follow a user

router.put('/:id/follow', async (req, res) => {
    if (req.params.id != req.body.userId) {
        try {
            const user = await User.findById(req.params.id)
            // const currentUser = await User.findById(req.body.userId)

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await user.updateOne({ $push: { followings: req.body.userId } })
                res.status(200).json('User has been followed successfully')
            }
            else {
                res.status(403).json('You are already a follower')
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json('You cannot follow yourself')
    }
})

// unfollow a user

router.put('/:id/unfollow', async (req, res) => {
    if (req.params.id != req.body.userId) {
        try {
            const user = await User.findById(req.params.id)
            // const currentUser = await User.findById(req.body.userId)

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await user.updateOne({ $pull: { followings: req.body.userId } })
                res.status(200).json('User has been unfollowed successfully')
            }
            else {
                res.status(403).json('You do not follow this user')
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json('You cannot unfollow yourself')
    }
})


// Get Friends 
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router