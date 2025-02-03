This is my generalized approach to every target:

1. File servers
2. Web servers
3. Everything else

I do it this way, because I work my way up by ***level of effort*** and ***amount of time*** involved to enumerate these services.

- File servers are quick and easy to assess, requiring only a widely available client
- Web servers require more work and enumeration due to more complex configurations that are possible on the server
- Everything else comes last when the first two aren't available or they haven't yielded enough info


> [!INFO]- File servers — FTP/SMB
> - May allow anonymous access or may be configured with default credentials
> - This is an *****excellent opportunity***** to gather more information from files
> - Additional information may include usernames, passwords, config files, etc
> - This information maybe useful when assessing other services

> [!INFO]-  Web — HTTP/HTTPS
> - Web is just as simple as opening your web browser
> - Navigate to the target IP or domain name and just start clicking around
> - Make a note of potential input points that could be abused
> - Web pages may contain usernames, passwords, interesting source code, etc

> [!INFO]-  Everything Else
> - Start probing other ports, try to understand how they behave
> - Lots of Googling, probably something on HackTricks about it
> - Try other `nmap` scans to see if additional ports are revealed; UDP or X-Mas scans, for example.


--------
### DNS — UDP/53 & TCP/53

I'm putting this one at the top — above file servers — because this is one of those easy things you can try that can be potentially high-impact.

If you found — for example — in your `nmap` scan that a web server had a TLS certificate with a `commonName=mysite.test` and there is a DNS server running, [you should test to see if a zone transfer is possible](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/dns-works-on-tcp-and-udp?ref=benheater.com).

```bash
target_domain='mysite.test'
target_ip='10.10.100.44'
host -T -l $target_domain $target_ip
```
*Using the `host` command `-l` requests a zone transfer*

If the zone transfer is successful, you could potentially reveal additional HTTP server names to assess later.

```bash
target_ip='10.10.100.44'
target_domain='mysite.test'
dns_wordlist='/usr/share/seclists/Discovery/DNS/namelist.txt'

gobuster dns -r $target_ip -d $target_domain -w $dns_wordlist -t 100
```
*If the zone transfer fails, you can try and manually enumerate records in the target domain*

> 💡
>
While the `gobuster dns` scan is running, go ahead and start your tests on other ports.

