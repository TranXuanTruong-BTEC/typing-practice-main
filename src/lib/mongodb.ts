import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/typing-practice";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

interface GlobalWithMongo extends NodeJS.Global {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = global as GlobalWithMongo;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Cấu trúc collection notifications:
// {
//   _id: ObjectId,
//   userId: ObjectId, // id người nhận
//   type: string,     // loại thông báo (role_update, message, ...)
//   title: string,    // tiêu đề thông báo
//   content: string,  // nội dung thông báo
//   isRead: boolean,  // đã đọc hay chưa
//   createdAt: Date
// }

// Cấu trúc collection conversations:
// {
//   _id: ObjectId,
//   members: [ObjectId, ObjectId], // 2 user trong hội thoại
//   lastMessage: string,           // nội dung cuối cùng
//   updatedAt: Date
// }

// Cấu trúc collection messages (chat):
// {
//   _id: ObjectId,
//   conversationId: ObjectId,
//   from: ObjectId,               // id người gửi
//   to: ObjectId,                 // id người nhận
//   content: string,              // nội dung tin nhắn
//   isRead: boolean,              // đã đọc hay chưa
//   createdAt: Date
// }

export default clientPromise;