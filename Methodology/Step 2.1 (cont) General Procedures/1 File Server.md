### FTP — TCP/21

```bash
ftp anonymous@10.10.100.44
```
*Check for anonymous FTP access on the targ*et

When prompted for a password, simply press the Enter key and see if it will allow you to login. If it does, try the following:

- `ls` to list files on the server
- `get` to retrieve files on the server
- `less` or more to read files from the FTP shell
- `cd` to change into any potential directories
- `put` to test write permissions as a way to perhaps chain an exploit with another service

We're trying to uncover:

- Usernames
- Passwords
- Configuration files
- Source code
- Backups
- Anything interesting

If there's a lot of files and folders, you could do a recursive download and parse the files locally.

### SMB — TCP/139 & TCP/445

#### List Shares

```bash
smbclient -N -L //10.10.100.44
```
*No username specified and '-N' for passwordless authentication

If you are able to anonymously ***list*** shares, then there's a decent chance you may be able to ***map*** shares.

Shares that aren't interesting ***from a files perspective*** are, for example:

- `IPC$`
- `print$`

#### Mapping Shares

```bash
smbclient -N //10.10.100.44/myshare
```
*Map the 'myshare' share anonymously*

If you are able to map the share anonymously, try the following:

- `ls` to list files on the server
- `get` to retrieve files on the server
- `less` or `more` to read files from the SMB shell
- `cd` to change into any potential directories
- `put` to test write permissions as a way to perhaps chain an exploit with another service

Like FTP, we're trying to discover anything interesting. If there's a lot of files and folders, you could do a **_recursive_** download and parse the files locally.

