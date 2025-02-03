As is the case with most vulnerable boxes, we begin assessing the target by running a `nmap` scan to understand the following:

- What is running on the target, what server names, what versions?
- What client software would we need to connect and assess the target?


```shell
# Nmap help message output
nmap -h
```


```shell
# Slower, but more reliable
sudo nmap -Pn -p- -A -T4 -oN scan.txt <target_ip>
```


```shell
# Faster, target may drop packets, adjust the '--min-rate' if needed
sudo nmap -Pn -p- -A --min-rate 5000 -oN scan.txt <target_ip>
```


```shell
# UDP scan example using '-T4', as going too fast may miss ports
sudo nmap -Pn -sU --top-ports 500 -A -T4 -oN udp-scan.txt <target_ip>
```


>❗
 Don't miss an opportunity to begin collecting as much information about the target as you can — even at the initial nmap scan! There's a lot of good information here to take note of.

Using the example `nmap` syntax above, this is going to run:

- Service version scan
- OS detection
- Default script scan

###  Example Nmap Output


>  Nmap Scan of Vulnhub Funbox: 1

```shell
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         ProFTPD 1.3.3c
22/tcp  open  ssh         OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 a6:0e:30:35:3b:ef:43:44:f5:1c:d7:c6:58:64:09:92 (RSA)
|   256 c2:d8:bd:62:bf:13:89:28:f8:61:e0:a6:c4:f7:a5:bf (ECDSA)
|_  256 12:60:6e:58:ee:f2:bd:9c:ff:b0:35:05:83:08:71:b8 (ED25519)
25/tcp  open  smtp        Postfix smtpd
|_smtp-commands: funbox11, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN
80/tcp  open  http        Apache httpd 2.4.18 ((Ubuntu))
|_http-generator: WordPress 5.7.2
|_http-title: Funbox: Scriptkiddie
|_http-server-header: Apache/2.4.18 (Ubuntu)
110/tcp open  pop3        Dovecot pop3d
|_pop3-capabilities: RESP-CODES UIDL TOP SASL CAPA PIPELINING AUTH-RESP-CODE
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp open  imap        Dovecot imapd
|_imap-capabilities: LOGINDISABLEDA0001 Pre-login more post-login have ENABLE LOGIN-REFERRALS SASL-IR capabilities IMAP4rev1 listed IDLE ID OK LITERAL+
445/tcp open  0�>_y      Samba smbd 4.3.11-Ubuntu (workgroup: WORKGROUP)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94%E=4%D=7/22%OT=21%CT=1%CU=39079%PV=Y%DS=2%DC=T%G=Y%TM=64BB5A4
OS:8%P=x86_64-pc-linux-gnu)SEQ(SP=104%GCD=1%ISR=105%TI=Z%II=I%TS=8)SEQ(SP=1
OS:04%GCD=3%ISR=105%TI=Z%II=I%TS=8)OPS(O1=M5B4ST11NW7%O2=M5B4ST11NW7%O3=M5B
OS:4NNT11NW7%O4=M5B4ST11NW7%O5=M5B4ST11NW7%O6=M5B4ST11)WIN(W1=7120%W2=7120%
OS:W3=7120%W4=7120%W5=7120%W6=7120)ECN(R=Y%DF=N%T=40%W=7210%O=M5B4NNSNW7%CC
OS:=Y%Q=)T1(R=Y%DF=N%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=N)T5(R=Y
OS:%DF=N%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=N)T7(R=N)U1(R=Y%DF=N%T=40%I
OS:PL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)
Network Distance: 2 hops
Service Info: Hosts:  funbox11, FUNBOX11; OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
Host script results:
| smb-os-discovery:
|   OS: Windows 6.1 (Samba 4.3.11-Ubuntu)
|   Computer name: funbox11
|   NetBIOS computer name: FUNBOX11\x00
|   Domain name: \x00
|   FQDN: funbox11
|_  System time: 2023-07-22T06:24:33+02:00
| smb-security-mode:
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time:
|   date: 2023-07-22T04:24:33
|_  start_date: N/A
| smb2-security-mode:
|   3:1:1:
|_    Message signing enabled but not required
|_clock-skew: mean: -39m59s, deviation: 1h09m16s, median: 0s
|_nbstat: NetBIOS name: FUNBOX11, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown) 
```


## Breadcrumbs

Even running the default `nmap` scripts can reveal a good deal of information about the services running on the target. There are additional `enum` and `brute` scripts that often don't get run as a default scan.

Make sure you carefully look over the `nmap` script scan output, as this can have details such as:

- FTP file enumeration
- NFS share names
- HTTP robots.txt and redirects
- DNS names
- Emails
- Computer names
- OS versions
- And, much more

## Open Ports

### Identifying Services

Using the example `nmap` scan output from above, we can see that `nmap` was able to pull service banners for all open ports that it could connect to.

```text
21/tcp  open  ftp         ProFTPD 1.3.3c
  ^       ^    ^             ^
  |       |    |             '----------- Application and version (banner)
  |       |    |
  |       |    '----------------- Well-known service
  |       |
  |       '------------- Port state
  |
  '----------- Port number
               and Transport protocol
```

You can find a list of **_well-known services_** that `nmap` tracks at `/usr/share/nmap/nmap-services`. It's this database that allows `nmap` to assume the service type running a particular port.

> ⚠️
>
Note that for some services — like web servers — the system administrator can often alter or remove the _****service banner****_, so this may not always be complete or accurate.

Take note of all the services running on the target and the version numbers of said services. By looking at the services, you'll also know which client software you'll need to do some manual testing. Based on the example `nmap` output above, we know we'll possibly need:

- FTP client
- SSH client
- SMTP / POP3 (mail) client
- HTTP (web) client
- SMB client


You can find a list of **_well-known services_** that `nmap` tracks at `/usr/share/nmap/nmap-services`. It's this database that allows `nmap` to assume the service type running a particular port.

### No Service Banners?

```text
5040/tcp  open  unknown
```

What if `nmap` was able to connect to the port, but was unable to pull a service name and version from the port? There could be various reasons for this, some of the most common being:

- The port was opened on the box in an attempt to trick you
- The port is coupled with another service and doesn't reveal banners
- The service running on the port may be malfunctioning

You can try to manually pull banners from the service, but in all likelihood, you'll just have to move on:

```bash
nc -nv <target-ip> <target-port>
```


	Try netcat with verbose output, press 'Enter' a couple times to see if there's any output


### Cataloging Possible Exploits

>❗
We are **NOT** exploiting anything at this phase. Just take inventory of service names and versions to determine what **might** be an avenue to a shell on the target.

When I want to get an idea of any public exploits that might be available for any service(s), I will typically search on Google or Exploit Database.

- Google:
	- ProFTPD 1.3.3c exploit
	- ProFTPD 1.3.3c exploit site:github.com
- Exploit Database:
	- Command Line: searchsploit ProFTPD 1.3.3c
	- Web: https://www.exploit-db.com/

In the case of a CTF, a `Denial of Servic`e exploit wouldn't do us much good, but a `Command Execution` or `File Inclusion` exploit would be very interesting.