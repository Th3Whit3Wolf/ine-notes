```bash
# NETWORK DISCOVERY
sudo arp-scan -I eth1 <TARGET_IP/NETWORK>
ping <TARGET_IP>
sudo nmap -sn <TARGET_IP/NETWORK>

## fping
fping -I eth1 -g <TARGET_IP/NETWORK> -a
## fping with no "Host Unreachable errors"
fping -I eth1 -g <TARGET_IP/NETWORK> -a fping -I eth1 -g <TARGET_IP/NETWORK> -a 2>/dev/null
```
