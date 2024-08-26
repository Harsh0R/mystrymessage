import { log } from "console";
import mongoose from "mongoose";
type Connection = {
  isConnected?: number;
};

const connection: Connection = {};

async function connectToDb(): Promise<void> {
  if (connection.isConnected) {
    log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    log("Connected to database to => " , process.env.MONGODB_URI);

  } catch (error) {
    log("Error connecting to database");
    log(error);
    throw error;
    process.exit(1);
  }
}

export default connectToDb;
