+++
title = "Crackmapexec"
weight = 10
+++

# Crack Map Exec

Strategically Mapping Targets inside the Internal Network

![](/Media/1_JrGsAOTAUadWqYtk-oiV1w.jpeg)

Credits \u2014 Photo by [Danilo Rios](https://unsplash.com/@danrop?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/z9AormQ0e90?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

CrackMapExec, known as CME, is a useful tool to use during internal pentesting assessments to assess the security of Windows networks. It performs network enumeration and identifies hosts and services while enumerating shares, users, and groups within the network.

In this article, we will discuss the initial steps of network reconnaissance, focusing on gathering information from machines that allow anonymous authentication to obtain access to the network. We will use exercises from Hack The Box Academy as examples.

# Table of Contents

- [Enumerating SMB Information](https://medium.com/r3d-buck3t/#1720)
- [Enumerating Users Accounts](https://medium.com/r3d-buck3t/#ad38)
- [Enumerating Password Policies](https://medium.com/r3d-buck3t/#fff4)
- [Enumerating Shares](https://medium.com/r3d-buck3t/#2602)

## Enumerating SMB Information

The tool gathers essential SMB information, such as the fully qualified domain name (FQDN) that helps identify whether a machine is domain-joined or separate, the Windows version and architecture (x86/x64), and the SMB version.

It can also detect if the SMB signing is enabled, which helps us identify machines that could be targeted for stealing hashes and relay attacks.

To enumerate the SMB information, run the `**crackmapexec**`, specify the SMB protocol, and pass the IP/s (separately in a file or use CIDR ranges).

```basj
crackmapexec smb 10.129.204.177
```
![Figure 1- shows SMB information about the target machine. r3d-buck3t](/Media/1_zOdBgGrn8EZHMQk8igW0ZQ.png)

Figure 1- shows SMB information about the target machine.

## Enumerating Users Accounts
Another thing to look for in the initial recon is identifying user accounts. We can create a list of users from machines that allow anonymous sessions and then perform password attacks against them. Or search for roastable (AS-REP) accounts, which can be cracked to gain access to the domain.

To enumerate users, we run `**crackmapexec **`with the `**--users**` option to list all users on the target machines and export them into a file with the option `**--export**`.

The tool does not offer a specific option for anonymous sessions; instead, we can pass an empty string for the username (-u) and password (-p).

```basj
crackmapexec smb 10.129.204.177  -u '' -p '' --users
```

What I like about the `**--users**` option is that it displays not only the users\u2019 accounts but also their description fields, where sometimes we can find credentials we can use or information about the account type, such as service accounts.

![Figure 3- shows the password policy of the targeted machine. r3d-buck3t](/Media/1_eAjPITa1AT3c5DtDhTZ65A.png)

Figure 2 \u2014 shows enumerating users from a machine with a null session.

## Enumerating Password Policies
When conducting network pentests, a common mistake is failing to consider the password policy when attempting password attacks. This can result in accounts being locked out or burning down the network \U0001f525.

Understanding the password policy, especially the **Lockout Threshold**, **Password Complexity, and Length,** is crucial in determining how we structure password spraying or brute-forcing attacks.

To enumerate the password policy, we run `**crackmapexec**` with the `**--pass-pol**` option. The screenshot below sets the lockout threshold to None, meaning the accounts will never be locked out.

In real-world scenarios, you will often see that some organizations may set a low threshold of 3 or 5 failed attempts, while others choose higher attempts of 10 or more to reduce accidental lockouts.

```bash
crackmapexec smb 10.129.204.177  -u '' -p '' --pass-pol
```
![Figure 3- shows the password policy of the targeted machine. r3d buck3t](/Media/1_Ukw3hOehR_W-4cJV9E1G2Q.png)

Figure 3- shows the password policy of the targeted machine.

## Enumerating SMB Shares
Shared folders are the best places to look for juicy information; you will find sensitive data such as confidential documents, financial records, or privileged user credentials that help you move deeply into the network.

To list the available shares, run `**crackmapexec **`with the`**--shares** `option and a random username for the `**-u**` option, such as \u201cguest\u201d. Note that the tool does not accept empty strings as usernames when running the shares option, so we must specify a random username.

```bash
crackmapexec smb 10.129.29.43  -u guest -p '' --shares
```
![Figure 4- shows SMB shares and their permissions. r3d-buck3t](/Media/1_5ZJjmXEc9GRmjOqUCahDCQ.png)

Figure 4- shows SMB shares and their permissions.

The screenshot below shows an access denied error when passing empty strings as username.

![Figure 5\u200a\u2014\u200ashows an access denied error with an empty username string. r3d-buck3t](/Media/1_W0k4LC-5nW-zxYu3qTExtA.png)

Figure 5 \u2014 shows an access denied error with an empty username string.

Also, to display the files and directories in a shared folder, we can use the options `**--spider**` with the share name and `**--regex .**` In the example below, we listed the contents of IT share.

```bash
crackmapexec smb 10.129.203.121 -u guest -p '' --spider IT --regex .
```
![Figure 6\u200a\u2014\u200ashows the contents of the IT share. r3d-buck3t](/Media/1_BdoZRGHS4-XaBpS8Qi3LZw.png)

Figure 6 \u2014 shows the contents of the IT share.

As a pentester, having CrackMapExec tool is valuable for gaining insights about a network and its hosts.

In upcoming articles, we will explore additional ways to utilize the tool in preforming authenticated enumeration, password spraying and relay attacks.

Thanks for stopping by!

\U0001f514You can find a list of all the commands that have been used in this post at R3d Buck3T Notion [*(Internal Pentesting Methodology\u200a\u2014\u200aCrackMapExec)*](https://r3dbuck3t.notion.site/CrackMapExec-458d2660dc5c48d2a04cf51321d49b28?pvs=4)