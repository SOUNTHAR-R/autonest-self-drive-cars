import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/db.json');

export interface DBData {
  admins: any[];
  cars: any[];
  bookings: any[];
}

export const readDB = (): DBData => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultData: DBData = { admins: [], cars: [], bookings: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON DB:', err);
    return { admins: [], cars: [], bookings: [] };
  }
};

export const writeDB = (data: DBData): void => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB:', err);
  }
};

export const initMongoDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/autonest';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.log('MongoDB connection skipped/unavailable, using local persistent DB store.');
  }
};
