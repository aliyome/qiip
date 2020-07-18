const commandLineArgs = require('command-line-args');
const args = commandLineArgs([
  { name: 'token', type: String },
  { name: 'title', type: String },
  { name: 'tag', multiple: true, type: String },
  { name: 'tweet', type: Boolean, defaultValue: false },
  { name: 'private', type: Boolean, defaultValue: false },
  { name: 'file', defaultOption: true },
]);
const { token, title, tag: rawTags, tweet, private, file } = args;

if (!token || !title || !file || !rawTags) {
  const commandLineUsage = require('command-line-usage');
  const usage = commandLineUsage([
    {
      header: 'qiip',
      content: [
        'qiip is a cli tool for posting an entry for qiita.',
        '',
        'usage:',
        'qiip --token="<token>" --title="title" --tag="Node" path_to_file.md',
      ],
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'token',
          description: 'Qiita personal access token',
          group: 'required',
        },
        { name: 'title', description: 'Post title' },
        {
          name: 'tag',
          description: 'Tags (ex: --tag="JavaScript" --tag="Node:12")',
          multiple: true,
        },
        { name: 'tweet', type: Boolean, description: 'Tweet on posting entry' },
        { name: 'private', type: Boolean, description: 'Make post private' },
      ],
    },
  ]);
  console.log(usage);
  process.exit(-1);
}

// normalize tags
const tags = rawTags.map((t) => {
  const [name, versions] = t.split(':');
  const result = {};
  result['name'] = name;
  if (versions) {
    result['versions'] = [versions];
  }
  return result;
});

// qiita-js depends on fetch
require('isomorphic-fetch');
const Qiita = require('qiita-js');

// read file
const { readFileSync, existsSync } = require('fs');
if (!existsSync(file)) {
  console.error(`Unable to open file: ${file}`);
  process.exit(-1);
}
const body = readFileSync(file, 'utf8');

// set token
Qiita.setToken(token);
Qiita.setEndpoint('https://qiita.com');

const params = {
  body,
  coediting: false,
  group_url_name: null,
  private: true,
  tags,
  title,
  tweet: !!tweet,
  gist: false,
};

if (process.env.DEBUG) console.log(params);

// post
Qiita.Resources.Item.create_item(params).then(console.log);
