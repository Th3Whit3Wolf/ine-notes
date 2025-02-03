
## Active Directory Specific

> ℹ️
>
If the target *****is part of***** an Active Directory domain, or a standalone domain controller, then I take a few additional steps *****in addition to***** following my [General Procedure](https://benheater.com/my-ctf-methodology/#general-procedure) below.

### Check the Port Signature

> 💡
>
We can almost always be certain when we've encountered a domain controller by looking at its port signature

```text
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
```

*A typical port signature for an Active Directory domain controller, especially apparent due to DNS, SMB, Kerberos, and LDAP being open on the box*

### Identify the Local Domain

Next, we should check the `nmap` output for the [RootDSE](https://www.ibm.com/docs/en/zos/2.4.0?topic=considerations-root-dse&ref=benheater.com) and any potential hostname (e.g. `DC01.domain.tld`). Once, established, we should add the domain and hostname to our `/etc/hosts` file.

```bash
target_ip='10.10.10.22'
sudo nmap -Pn --script ldap-rootdse.nse $target_ip
```

If you've only run a basic `nmap` scan and need to enumerate the RootDSE

```bash
target_ip='10.10.10.22'
target_domain='domain.tld'
target_hostname="DC01.${target_domain}"

echo -e "${target_ip}\t\t${target_domain} ${target_hostname}" | sudo tee -a /etc/hosts`
```

Run these commands to populate your `/etc/hosts` file

### DNS

If we've established the local domain for the Active Directory environment, we should attempt to enumerate any DNS records for use when assessing other protocols.


```bash
target_ip='10.10.10.22'
target_domain='domain.tld'
host -T -l $target_domain $target_ip
```

Attempt a zone transfer from the DNS server on the target. If configured correctly, the zone transfer should be refused.

```bash
target_ip='10.10.10.22'
target_domain='domain.tld'
dns_wordlist='/usr/share/seclists/Discovery/DNS/namelist.txt'
gobuster dns -r $target_ip -d $target_domain -w $dns_wordlist -t 100
```

If the zone transfer fails, you can try and manually enumerate records in the target domain


### LDAP

A quick win would be the ability to enumerate LDAP records anonymously, as this would allow us to gather a great deal of information about interesting users, groups, and other domain records.

```bash
target_domain='domain.tld'
target_hostname="DC01.${target_domain}"
domain_component=$(echo $target_domain | tr '\.', '\n' | xargs -I % echo "DC=%" | paste -sd, -)

ldapsearch -x -H ldap://$target_hostname -b $domain_component
```
*If configured correctly, you should see an error saying that a successful bind must be completed, meaning you need a credential*

```bash
ldapsearch -x -H ldap://$target_hostname -b $domain_component 'objectClass=*'
```
*However, if you are able to anonymously query LDAP, this is an example command to pull everything from LDAP*

[More example commands here](https://notes.benheater.com/books/active-directory/page/ldapsearch?ref=benheater.com)
### SMB

If we can connect to SMB anonymously, it's worth checking to see if we can enumerate object RIDs anonymously as well. RID cycling would allow us to enumerate a list of users and groups on the computer for further use during testing.

```bash
target_ip='10.10.10.22'
smbclient -N -L //$target_ip
```
*If you can connect to SMB with a null session (and maybe even list shares), we can try and enumerate more and potentially map shares*

```bash
smbclient -N //$target_ip/share_name
```
*Connect to a SMB share via null session*

```bash
# nxc replaces crackmapexec
nxc smb $target_ip -u 'anonymous' -p '' --rid-brute 3000
nxc smb $target_ip -u '' -p '' --rid-brute **3000**
```
*If configured correctly, you should see a permissions error, indicating the tests have failed*

### Kerberos

If you haven't yet managed to compile a list of users from one of the other methods above, we can attempt to use Kerberos pre-authentication and a word list to find usernames.

If we've found some usernames, we can then see if any of them are configured with `UF_DONT_REQUIRE_PREAUTH`, pull some AS-REP hashes, and attempt to crack them offline.

[Kereberos Pre-Auth Username Enumeration](https://notes.benheater.com/books/active-directory/page/kerberos-pre-auth-username-enumeration?ref=benheater.com)

*Attempt to find valid usernames and save them to a log file, then testing for AS-REP hashes and attempting to crack them. If you manage to crack an AS-REP hash for a user account, you could then spray this password around and see what you can access (or at a minimum, dump LDAP).*


> ℹ️
>
At this point, if your Active Directory specific testing hasn't produced any meaningful results, it's time to move onto the [[0 General Procedures]]