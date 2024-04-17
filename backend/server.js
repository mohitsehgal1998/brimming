const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const Agent = require('./models/Agent');
const Message = require('./models/Message');
const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/message_system')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
const usersRouter = require('./routes/users');
const agentsRouter = require('./routes/agents');
const messagesRouter = require('./routes/messages');

app.use('/users', usersRouter);
app.use('/agents', agentsRouter);
app.use('/messages', messagesRouter);

app.get("/", (request, response) => {
    response.send({ message: "Hello from an Express API!" });
});

app.post('/agents/:agentId/assign', async (req, res) => {
    const agentId = req.params.agentId;
    const formData = req.body.users;
    // Perform actions with agentId and formData (e.g., save to database)
    console.log('Agent ID:', agentId);
    console.log('Form Data:', formData);
    try{
        let sol = await Promise.all(formData.map(async (userId) => {
            const user = await User.findById(userId);
            if (!user) {
                // Handle case where user is not found (skip or throw error)
                console.log(`User with ID ${userId} not found`);
            } else {
                // Update the user's agentId
                user.agent = agentId;
                await user.save();
                console.log(`Assigned user ${userId} to agent ${agentId}`);
            }
        }));
    } catch (error) {
        console.error('Assigning users failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/postmessages/:phone_no', async (req,res)=>{
    const { phone_no } = req.params;
    const formData = req.body.content;

    const newMessageData = new Message({
      text: formData,
      user: phone_no
    });

    // Save the new user document to the database
    const savedData = await newMessageData.save();
    console.log('New Message saved:', savedData);
  });

  app.get('/getMessages/:phone_no', async (req, res) => {
    const { phone_no } = req.params;
  
    try {
      // Find users with the specified phone number
      const messages = await Message.find({ user: phone_no });
      
      if (messages.length === 0) {
        return res.status(404).json({ message: 'No users found with this phone number' });
      }
      
      res.json(messages);
    } catch (error) {
      console.error('Error searching for users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/agents/:agent_id', async (req, res) => {
    // const { agent_id } = req.params;
    // const agentData = await Agent.findOne({ agent_id: agent_id });

    // let phone = [] ;
    // const userData = await User.find({agent : agentData._id})
    // userData.map(async (ele)=>{
    //   let ids = await ele.phone_no ;
    //   console.log(ids) ;
    //   // phone.push(ids) ;
    // })

    // // const phone_no = userData
    // // console.log(phone) ;
    // return userData ;
  });
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));