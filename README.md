# fucker

`fucker init <folder>`
create a `folder`folder in home directory
create a `folder/data` folder `inialize git in this`
create a `folder/.fucker` folder `initialize git lfs in this`

Store files in `folder/data`

`fucker split <msg>`
Will check output of `git status`

Creates a list of files which are added or modified
Deletes the folders in `.fucker` which were modified
Loops through the list of files and splits them
Store them in `.fucker` folder
Add the files to git lfs
Commit files commit-msg = `msg: {timestamp}`
push them to github

file : oppy.mkv - 82.4Gbs

`fucker split oppy.mkv`

Creates a folder `oppy.mkv_{nanoid}`

with
meta.json
out.fuck
out1.fuck
....

`fucker join oppy.mkv`


