const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');


module.exports.Login = async (req, res) => {

    const email=req.body.email;
    const password=req.body.password;

    try{
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '8h'}, (err, token) => {
            if(err){
                res.json({
                    message: "There is some error"
                })
            }else{
                res.status(200).json({
                    user,
                    token
                });
            }
        })

    }catch(error){
        res.status(500).json({ message: 'Server error' });
    }
} 

module.exports.Signup = async (req, res) => {

    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({email});
    
        if (existingUser) {
          return res.status(400).json({ message: 'Email is already taken' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });
    
        await newUser.save();
    
        return res.status(200).json({
            message: "Signup successful",
            newUser
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
} 
