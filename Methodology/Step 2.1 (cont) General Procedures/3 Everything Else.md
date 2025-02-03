## Unknown Ports and Services

Sometimes you will see uncommon services, uncommon port bindings, and high-number port bindings on certain CTF targets. The key here is being able to tell the difference between:

- An uncommon or high port bound to a service
- Often included by CTF authors to confuse you
- A dynamic port bound to something like RPC
- Just part of the operating system or another service like NFS

Fortunately, `nmap` does a good job of identifying services bound to ports, except for when it can't grab service banners from the port. So, you should be able to identify RPC from other port bindings with ease.

### Examples

```text
49152/tcp open  msrpc        Microsoft Windows RPC  
49153/tcp open  msrpc        Microsoft Windows RPC  
49154/tcp open  msrpc        Microsoft Windows RPC  
49155/tcp open  msrpc        Microsoft Windows RPC  
49156/tcp open  msrpc        Microsoft Windows RPC
```

- Very common to see on Windows targets
- These are dynamic RPC port bindings and can typically be ignored

```text
2869/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
5357/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
10243/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
```

- These port bindings aid in network device discovery
- Can typically be ignored

```text
8080/tcp open  http    Apache httpd 2.4.52 ((Ubuntu))
```

- This is a very typical alternate HTTP port binding
- Explore this further if prior testing has been unsuccessful

```text
5040/tcp  open  unknown
```

- Showing an example of nmap failing to detect a service
- I would completely ignore this port unless everything else failed
- If you decide to probe this further, try:
    - Manually grabbing a service banner using `netcat` or `telnet`
    - Open Wireshark and interact with the service and inspect the packets

```text
PORT      STATE SERVICE      VERSION
8014/tcp  open  http         Apache httpd
60000/tcp open  http         Apache httpd 2.4.38
```

- `nmap` has identified these as alternative Apache HTTP server bindings
- Given the odd port numbers, I'd typically spend little time probing these until later
- You could use `curl` or your browser to open them up briefly and see what they look like, but do so much later after testing more common services

```text
PORT      STATE SERVICE      VERSION
1883/tcp  open  mqtt
```

- An example of an atypical service you could see on a box
- When you encounter a new service for the first time, search on Google
- You could search something like: `tcp 1883 mqtt pentest`
- HackTricks often has excellent articles on getting you started with testing services with which you may be unfamiliar

```
PORT      STATE SERVICE VERSION
2222/tcp  open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
```

- An example of an atypical SSH server binding
- The same SSH principles apply to this server as well
	- Do not try and pentest this service early on, just ignore it initially
	- If you come across a SSH key or a username and password later, that would be a good time to test those credentials on something like this

## Information Re-Use

If you've discovered useful information while probing HTTP or some other service, you should always consider how this information may be able to be used with services you previously looked at.

For example, maybe you found:

- Usernames and/or passwords
- SSH private keys
- Wordlists
- Backups

Can any of this be used to go back and get more information from another service?