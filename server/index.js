require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const PORT = process.env.PORT || 8000;

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

// Enable preflight across all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://notes-app-mern.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ 
        message: "Welcome to Notes App API",
        version: "1.0.0",
        endpoints: {
            auth: ["/create-account", "/login", "/get-user"],
            notes: ["/add-note", "/edit-note/:noteId", "/get-all-notes", "/delete-note/:noteId", "/update-note-pinned/:noteId"]
        }
    });
});

//create account 
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" })
    };

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" })
    };

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" })
    };

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exist",
        });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await user.save();

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            user: {
                fullName: user.fullName,
                email: user.email,
                _id: user._id,
                createdOn: user.createdOn,
            },
            accessToken,
            message: "Registration Successful",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "An error occurred during registration"
        });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    try {
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, userInfo.password);
        
        if (passwordMatch) {
            const user = { 
                user: {
                    fullName: userInfo.fullName,
                    email: userInfo.email,
                    _id: userInfo._id,
                    createdOn: userInfo.createdOn
                } 
            };
            
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "36000m",
            });

            return res.json({
                error: false,
                message: "Login Successful",
                email,
                accessToken,
            });
        } else {
            return res.status(400).json({
                error: true,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "An error occurred during login"
        });
    }
});

app.get("/get-user", authenticateToken,async (req, res) => {
    const {user} = req.user;
    const isUser = await User.findOne({
        _id:user._id
    });

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:{
            fullName:user.fullName,
            email:isUser.email,
            _id:isUser._id,
            createdOn:isUser.createdOn,
        },
        message:"",
    });
});


app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;

    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();
        
        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server Error",
        });
    }
});


app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned} = req.body;

    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({
            error:true,
            message:"No changes provided"
        });
    }

    try{
        const note = await Note.findOne({ _id:noteId ,userId: user._id});

        if(!note){
            return res.status(400).json({error:true,message:"Note not found"});
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note updated successfully",
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        });
    }
});



app.get("/get-all-notes", authenticateToken, async (req, res) => {

    const {user} = req.user;
    
    try{
        const notes = await Note.find({
            userId:user._id
        }).sort({isPinned: -1});

        return res.json({
            error:false,
            notes,
            message:"All notes retrieved successfully",
        });

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }

});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        const note = await Note.findOne({
            _id:noteId,
            userId:user._id
        });

        if(!note){
            return res.status(404).json({
                error:true,
                message:"Note not found"
            });
        }

        await Note.deleteOne({
            _id:noteId,userId:user._id
        })

        return res.json({
            error:false,
            message:"Note deleted successfully",
        });
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        });
    }

});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {isPinned} = req.body;

    const {user} = req.user;

    try{
        const note = await Note.findOne({ _id:noteId ,userId: user._id});

        if(!note){
            return res.status(400).json({error:true,message:"Note not found"});
        }

        note.isPinned = isPinned ;

        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note updated successfully",
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        });
    }

});



app.listen(PORT,()=>{
    console.log(`Port started on ${PORT}`);
});

module.exports = app;
