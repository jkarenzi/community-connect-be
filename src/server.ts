import app from './app'
import dotenv from 'dotenv'
import { AppDataSource } from './config/dataSource';
dotenv.config()

const port = process.env.APP_PORT

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log("Server is running on " + port);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

app.listen()