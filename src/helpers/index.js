const fs = require('fs').promises
const path = require('path')

async function createDirectory(output) {
  try {
    await fs.mkdir(output, { recursive: true })
  } catch (err) {
    console.log(err);
  }
}

async function cleanDirectory(directory) {
  try {
    const files = await fs.readdir(directory);
    const deletePromises = files.map(file => fs.unlink(path.join(directory, file)));
    const removed = await Promise.all(deletePromises);

    if (removed) console.log('Directory was cleaned');
  } catch (err) {
    console.error('Error cleaning the HLS directory:', err);
    throw err;
  }
}

async function findFile(directory, fileName) {
  try {
    const files = await fs.readdir(directory);
    return files.includes(fileName);
  } catch (error) {
    console.error('Error reading directory:', error);
    return false;
  }
}

async function checkDirectoryExists(directory) {
  try {
    const response = await fs.readdir(directory)
    if (response) {
      console.log('Directory exists!', directory)
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createDirectory, findFile, checkDirectoryExists, cleanDirectory }