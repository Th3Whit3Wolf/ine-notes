
```bash
hashdump

# JohnTheRipper
john --list=formats | grep NT
john --format=NT hashes.txt

gzip -d /usr/share/wordlists/rockyou.txt.gz
john --format=NT win_hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt


hashcat -a 3 -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -a 3 -m 1000 --show hashes.txt /usr/share/wordlists/rockyou.txt
```

