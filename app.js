const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error in MongoDB connection:', error);
  });

const myDataSchema = new mongoose.Schema({
  name: String,
  project: String,
  url: String,
  build: String
});

const MyData = mongoose.model('MyData', myDataSchema);

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  enqueue(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.size++;
  }
}

const queue = new DLL();

app.post('/submit-form', async (req, res) => {
  try {
    const { name, project, url, build } = req.body;
    if (!name || !project || !url || !build) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await MyData.findOne({ project });
    if (isExist) {
      return res.status(400).json({ message: "Project already exists" });
    }

    const newData = new MyData({ name, project, url, build });
    await newData.save();
    queue.enqueue(newData); // Enqueue data
    res.status(200).json({ message: "Data Queued Successfully" });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/push', (req, res) => {
  try {
    const { name, project, url, build } = req.body;
    if (!name || !project || !url || !build) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newData = new MyData({ name, project, url, build });
    queue.enqueue(newData); // Enqueue data
    res.status(200).json({ message: "Data Queued Successfully" });
  } catch (error) {
    console.error('Error pushing data to queue:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/project-status', async (req, res) => {
  try {
    const logs = await MyData.find({});
    res.status(200).json({ logs: 'Project is in building state...' });
  } catch (error) {
    console.error('Error fetching project status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});


/* 
const express=require('express')
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser')

const app = express()
app.use(bodyParser.json())

const Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((error)=>{
    console.log('error in connection');
})

const myDataSchema = new Schema({
    name:String,
    project:String,
    url:String,
    build:String
})

const MyData = mongoose.model('MyData',myDataSchema);

app.use(express.json());

app.use(cors({
    origin:'*',
    method:['GET','POST','PUT','DELETE'],
}));



class Node{
    constructor(data){
        this.data=data;
        this.next=null;
        this.prev=null;
    }
}

class DLL{
    constructor(){
        this.head=null;
        this.tail=null;
        this.size=0;
    }

    enqueue(data){
        const newNode=new Node(data);
        if(!this.head){
            this.head=newNode;
            this.tail=newNode;
        }
        else{
            this.tail.next=newNode;
            newNode.prev=this.tail;
            this.tail=newNode;
        }
        this.size++;
    }
  }

const queue= new DLL();


app.post('/submit-form',async function(req,res){

    try{
        const{name,project,url,build}=req.body;
        const data={name,project,url,build};
        const isExist=await MyData.findOne({project});
        if(isExist){
            res.status(400).json({message:"Project already exists"});
        }
        if(!name || !project || !url || !build){
            res.status(400).json({message:"All fields are required"});
        }        

        await data.save();
        res.status(200).json({ message:"Data Queued Successfully"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }

});

app.post('/push',function(req,res){
    //now pushing that data in queue;
    queue.enqueue(data);
    res.status(200).json({ message:"Data Queued Successfully"});
    
})

app.get('/project-status', async (req, res) => {
    try {
      //show logs
      const Logs = await MyData.find({});
      res.status(200).json({ logs: 'Project is in building state...' });
    } catch (error) {
      // Handle errors
      console.error('Error fetching project status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



app.listen(3000,()=>{
    console.log("Listening on port 3000")
}) */


/* const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error in MongoDB connection:', error);
  });

const myDataSchema = new mongoose.Schema({
  name: String,
  project: String,
  url: String,
  build: String
});

const MyData = mongoose.model('MyData', myDataSchema);

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  enqueue(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.size++;
  }
}

const queue = new DLL();

app.post('/submit-form', async (req, res) => {
  try {
    const { name, project, url, build } = req.body;
    if (!name || !project || !url || !build) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await MyData.findOne({ project });
    if (isExist) {
      return res.status(400).json({ message: "Project already exists" });
    }

    const newData = new MyData({ name, project, url, build });
    await newData.save();
    queue.enqueue(newData); // Enqueue data
    res.status(200).json({ message: "Data Queued Successfully" });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/push', (req, res) => {
  try {
    const { name, project, url, build } = req.body;
    if (!name || !project || !url || !build) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newData = new MyData({ name, project, url, build });
    queue.enqueue(newData); // Enqueue data
    res.status(200).json({ message: "Data Queued Successfully" });
  } catch (error) {
    console.error('Error pushing data to queue:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/project-status', async (req, res) => {
  try {
    const logs = await MyData.find({});
    res.status(200).json({ logs: 'Project is in building state...' });
  } catch (error) {
    console.error('Error fetching project status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
 */