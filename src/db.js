import path from 'path';
import sqlite3 from 'sqlite3';

path.resolve('/', './db');

const dbModule = () => {
    const _db = new sqlite3.Database(`marathon.db`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to users db');
        }
    });

    const _createUser = (user, cb) => {
        return _db.run(
            'INSERT INTO users (username, password) VALUES (?,?,?)',
            user,
            (err) => {
                cb(err);
            }
        );
    };

    return {
        createUser: (user, cb) => {
            _createUser(user, cb);
        },
        checkUser: (user, cb) => {
            return _db.get(
                `SELECT * FROM users WHERE username = ${user.username} AND password = ${user.password}`,
                (err, row) => {
                    cb(err, row);
                }
            );
        },
    };
};


// export class DbManager {
//     constructor() {
//         this.db = new sqlite3.Database(`marathon.db`, (err) => {
//             if (err) {
//                 console.error(err.message);
//             } else {
//                 console.log('Connected to users db');
//             }
//         });
//     }
//     createUser(user, cb) {
//         return this.db.run(
//             'INSERT INTO users (username, password) VALUES (?,?,?)',
//             user,
//             (err) => {
//                 cb(err);
//             }
//         );
//     }
//     checkUser(user, cb) {
//         return db.get(
//             `SELECT * FROM users WHERE username = ${user.username} AND password = ${user.password}`,
//             (err, row) => {
//                 cb(err, row);
//             }
//         );
//     }
// }
