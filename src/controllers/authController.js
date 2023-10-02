const express = require('express');
const bccrypt = require("bcryptjs");
const UserModel = require ("../model/User");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json")
const generateToken = (user = {}) => {
    return jwt.sign({
        id: user.id,
        name: user.name
    }, authConfig.secret, {
        expiresIn: 86400
    });
    
}

const router = express.Router();

router.post('/register', async (req, res) => {
   const {email} = req.body;

   if (await UserModel.findOne({email})){
        return res.status(400).json({
            error: true,
            message:"Este usuario ja existe"
        })
   }

    const user = await UserModel.create(req.body);

    user.password = undefined;


    return res.json({
        user,
        token: generateToken(user)
    })
})

    router.post("/authenticate", async (req, res) => {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email}).select("+password");
        
        if(!user){
            return res.status(404).json({
                error: true,
                message: "Este usuario nao existe"
            })
        }

        if(!await bccrypt.compare(password, user.password)){
            return res.status(404).send({
                error: true,
                message: "Email ou senha incorreta"
            })
        }
        
        user.password = undefined

      
        return res.json({
            user,
            token: generateToken(user)
        })
         
        return res.json(user);
    })

module.exports = router;