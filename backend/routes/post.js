const express = require('express')
const Post = require('../models/Post')
const router = express.Router()
const Posts = require('../models/Post')
const User = require('../models/User')

// Create a post 
router.post('/', async (req, res) => {
    const newPost = new Posts(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})
// Update a post 
router.put('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (post.userId === req.body.userId) {
            const updatedPost = await Posts.updateOne({ $set: req.body })
            res.status(200).json('Your post has been successfully updated')
        } else {
            res.status(403).json('You can update only your post')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
// Delete a post

router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (post.userId === req.body.userId) {
            const updatedPost = await Posts.deleteOne()
            res.status(200).json('Your post has been successfully deleted')
        } else {
            res.status(403).json('You can delete your post only')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// like / dislike a post 

router.put('/:id/likes', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await Posts.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('Your post has been liked succesfully')
        }
        else {
            await Posts.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json('Your post has now been disliked')
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

// get a post 

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get timeline posts

router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Posts.find({ userId: currentUser._id })
        const friendsPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendsPost))

    } catch (error) {
        res.status(500).json(error)
    }
})

// get all users post 

router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({username : req.params.username})
        const posts = await Post.find({userId : user._id})
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router