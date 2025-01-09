# fucker

Fucks telegram so you can have unlimited storage(can merge with your os if you're not a tourist)

# How

Splits each file into 20mb chunks as telegram only supports that size uploads over api without hosting your own api server.

Joins those files back together when you want to download them.

Streams the file into memory so large files could be loaded, the only problem could be network speeds or telegram throttling speeds for free accounts

# Requirements

- Deno 2.1 or higher
- Brain cells

# Installation

Clone the repository:

`git clone https://github.com/kiraoke/fucker`

# Usage

Create a telegram bot and get the token from BotFather

Create a channel and add the bot as an admin

In this channel is where all your files will be stored.

Go into the cloned direcotry

Create a .env file

Add the following to the .env file

```
BOT_TOKEN=your_bot_token
CHANNEL_NAME=your_channel_name
```

Create a postgres database we recommend you to use supabase

Create a table with the name `files`

The schema of the table must be the following

```
CREATE TABLE files (
    id BIGINT PRIMARY KEY,
    file_name TEXT NOT NULL,
    urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Get your database url

Add the following to the .env file

```
DATABASE_URL=your_database_url
```

Run the following command:

```
deno task start --help
```

Follow the help instructions


# TODO

- Encryption of buffer
- Zstd compression

