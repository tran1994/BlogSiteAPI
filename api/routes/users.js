const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User  = require('../models/users');

// 1-get all users
router.get('/', async (req, res, next) => {

    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!users) {
            return res
                .status(404)
                .json({ success: false, error: `Collection is empty` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
});

//2-post new user
router.post('/',(req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }

    const newUser = new User(body)

    if (!newUser) {
        return res.status(400).json({ success: false, error: err })
    }

    newUser
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: newUser._id,
                message: 'New User Added to database',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
})

//3-get a user by userID(username)
router.get('/:userID', async(req, res) => {
    await User.findOne({ userID: req.params.userID }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}
)

//4-get a user by object ID
router.get('/userIDN/:_id', async(req, res) => {
    await User.findOne({ _id: req.params._id}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}
)

//6-updating user info with certain object id
router.patch('/:userID', (req, res) => {
    const body1 = req.body

    // code for updating only the user info parameters that were changed by end users
    const updateOps = {}; //create a empty array
    for(const ops of req.body){ // loop through the inputs that were changed by end user if user did update any parameters
        updateOps[ops.propName]=ops.value; //insert changed values into array correspsonding with every changed parameter of the prop name
    }

    if (!body1) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user to update',
        })
    }

   User.update({ _id: req.params.userID },{$set:updateOps //mongoose update method reads array and only updates parameters that are in the array only
    /*{
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "userID": req.body.userID,
        "password": req.body.password,
        "email": req.body.email }*/
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }       
    }).exec().then(() => {
        return res.status(200).json({
            success: true,
            message: 'User updated!',
        })
    })
    .catch(error => {
        console.log(error);
        return res.status(404).json({
            error,
            message: 'User not updated!',
        })
    })
})

//7-deleting user with certain userID
router.delete('/:userID', async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.userID }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, message:'User found and deleted' })
    }).catch(err => console.log(err))
}
)
  
module.exports = router;