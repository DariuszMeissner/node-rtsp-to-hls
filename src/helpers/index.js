import fs from 'fs/promises'
import path from 'path';

export async function createDirectory(output) {
  try {
    await fs.mkdir(output, { recursive: true })
  } catch (err) {
    console.log(err);
  }
}

export async function cleanDirectory(directory) {
  try {
    const files = await fs.readdir(directory);
    const deletePromises = files.map(file => fs.unlink(path.join(directory, file)));
    await Promise.all(deletePromises);
  } catch (err) {
    console.error('Error cleaning the HLS directory:', err);
    throw err; // Rethrow if you want to handle this error further up the call stack
  }
}

export async function findFile(directory, fileName) {
  try {
    const files = await fs.readdir(directory);
    return files.includes(fileName);
  } catch (error) {
    console.error('Error reading directory:', error);
    return false;
  }
}

export async function checkDirectoryExists(directory) {
  try {
    await fs.readdir(directory)
  } catch (err) {
    console.log(err);
  }
}