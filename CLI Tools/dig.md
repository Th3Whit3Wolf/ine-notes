---
tags:
  - CLI/dig
---

- Translating IP addresses to domain names:
	- `dig -x [_ip address_]`
- Finding name servers incharge of a given domain:
	- `dig -t ns [domain name]`
- Querying a given name server for all IPs associated to a given domain:
	- `dig @[name server] [domain name] -t A`