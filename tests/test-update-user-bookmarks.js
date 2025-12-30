// test-update-user-bookmarks.js
// Run this script with: node test-update-user-bookmarks.js

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI ;
const userId = "6950077638b5a9ffd5f81690"; // <-- Change this to your user _id
const postId = '69501ae87634a9ffd5f8185f'; // <-- Change this to a valid Post _id

const userSchema = new mongoose.Schema({
  firebaseUid: String,
  email: String,
  displayName: String,
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});
const User = mongoose.model('User', userSchema, 'users');

async function run() {
  await mongoose.connect(MONGO_URI);
  const user = await User.findById(userId);
  if (!user) {
    console.log('User not found');
    return;
  }
  console.log('Before:', user.bookmarks);
  user.bookmarks.push(postId);
  user.markModified('bookmarks');
  await user.save();
  const updated = await User.findById(userId);
  console.log('After:', updated.bookmarks);
  await mongoose.disconnect();
}

run().catch(console.error);
