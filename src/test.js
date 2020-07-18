// use .env
import dotenv from 'dotenv';
dotenv.config();

// Require promise and fetch
import 'isomorphic-fetch';

// require in commonjs env
import Qiita from 'qiita-js';
import { exit } from 'process';
const token = process.env.QIITA_TOKEN;

if (!token) {
  exit(-1);
}

// set your token
Qiita.setToken(token);
Qiita.setEndpoint('https://qiita.com');

// fetch resources!
Qiita.Resources.User.get_user('aliyome').then((user) => {
  console.log(user);
});

Qiita.Resources.