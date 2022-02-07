import {
  connectDatabase,
  getAllDocuments,
  insertDocument,
} from "../../../helpers/db-util";

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "connectie met database mislukt" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (!email.includes("@") || !name || !name.trim() === "" || !text) {
      res.status(422).json({ message: "invalid input" });
      client.close();
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    try {
      const result = await insertDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: "Comment is set", comment: newComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "toevoegen van gegevens aan database mislukt" });
      return;
    }
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "comments", { _id: -1 });
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: "gegevens ophalen mislukt" });
      return;
    }
  }
}

export default handler;
