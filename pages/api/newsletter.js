import { MongoClient } from "mongodb";

async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://nestjs:14@cluster0.o0r9z.mongodb.net/events?retryWrites=true&w=majority"
  );
  return client;
}

async function insertDocument(client, document) {
  const db = client.db();
  await db.collection("newsletter").insertOne(document);
}

async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;

    if (!email || !email.includes("@")) {
      res.status(422).json({ message: "invalid email address" });
      return;
    }

    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: "connectie met database mislukt" });
      return;
    }

    try {
      await insertDocument(client, { email: email });
      client.close();
    } catch (error) {
      res
        .status(500)
        .json({ message: "toevoegen van gegevens aan database mislukt" });
      return;
    }

    res.status(201).json({ message: "Signed Up" });
  }
}

export default handler;
