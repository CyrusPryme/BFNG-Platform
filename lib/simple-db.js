import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export function getUsers() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data).users;
  } catch (error) {
    return [];
  }
}

export function findUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email);
}
