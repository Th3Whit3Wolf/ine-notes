+++
title = "FTP Enumeration"
weight = 40
+++

# FTP Enumeration

### Nmap
```bash
sudo nmap -p 21 -sV -sC -O <TARGET_IP>
nmap -p 21 -sV -O <TARGET_IP>

nmap -p 21 --script ftp-anon <TARGET_IP>
nmap -p 21 --script ftp-brute --script-args userdb=<USERS_LIST> <TARGET_IP>
```
### FTP Client
```bash
ftp <TARGET_IP>
## FTP client
ls
get <filename>
```

### Hydra
```bash
hydra -L /usr/share/metasploit-framework/data/wordlists/common_users.txt -P /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt <TARGET_IP> -t 4 ftp
```