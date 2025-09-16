import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config()

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

try {
  await client.connect();

  await client.db("noteApp").command({ ping: 1 })
  console.log(" Pinged your deployment. You Successfully connected to MongoDB!")
} catch(err) {
  console.log(err)
}

let db = client.db("noteApp")

export default db;
