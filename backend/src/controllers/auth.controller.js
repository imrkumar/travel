const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try{
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if(existing){
       return res.status(400).json({ message: "Email already registered."})
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  }catch(error){
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET,{expiresIn: '7d'});
        res.status(200).json({ token, user: {id: user._id, name: user.name, email: user.email }});
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}