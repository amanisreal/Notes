const express = require('express');
const cors =  require('cors');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
  
const app = express();

app.use(cors())
app.use(express.json());
app.use(userRouter);
app.use(taskRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('Server is live on ' + port)
})