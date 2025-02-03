### HTTP — TCP/80 & TCP/443

#### Initial Questions

The first things I want to establish with the web service are:

- Are there any noticeable differences between the `http://` and the `https://` versions of the apps running on the web server? In other words, is `http://` redirecting to `https://`, are they duplicates, or are they completely different in behavior and presentation?
- Is the server making use of any `ServerName` (virtual host) directives that would cause different pages to load depending on the the hostname the client requests?

#### Test the Raw IP Address

- `http://10.10.100.44`
- `https://10.10.100.44`

- If the server loads different content at each unique scheme
- There are distinct configurations per port
- Plan on testing the servers independently
- If the server redirects `TCP/80` to `TCP/443`
- Only need to test `TCP/443` (https)

#### Testing Virtual Hosts

![[Pasted image 20250126205725.png]]

The `Host` header is what the server is looking at to determine which virtual host configuration to serve content from. [*If you're interested in learning more about enumerating virtual hosts, you can see my notes here*](https://notes.benheater.com/books/web/page/virtualhost-enumeration?ref=benheater.com).

We can create a local name resolution entry by editing our `/etc/hosts` file, adding the DNS names we saw in the `nmap` output or any successful zone transfer.

```bash
sudo nano /etc/hosts
```

*Edit the `/etc/hosts` file*

```bash
# Custom Entry
10.10.100.44 mysite.test dev.mysite.test admin.mysite.test
```
*Add these hostnames pointing to '10.10.100.44'*

Again, as before, test the server names against both HTTP and HTTPS and see if there are any ***behavioral differences***.

- `http://mysite.test` and `https://mysite.test`
- `http://dev.mysite.test` and `https://dev.mysite.test`
- `http://admin.mysite.test` and `https://admin.mysite.test`

- If different domain names load the ***same content***
- No difference in page content between `http://mysite.test` and `http://subdomain.mysite.test`
- Safe to assume no virtual hosts are being used
- You can most likely test the server using the raw IP address
- If different domain names load ***unique content***
- `https://mysite.test` and `https://subdomain.mysite.test` load completely different pages
- More than likely this server is using virtual hosts
- Test each virtual host as an individual server

#### Walking The Happy Path
At this stage, we just want to use the web page as a normal user would.

- Not doing anything malicious
- Click links and provide expected inputs in standard fields
- Doing things that a normal user would expectedly do
- Navigating to the URLs we've discovered at this point
- Raw IP addresses
- Domain names
- HTTP/HTTPS
- Just click around on links and interact
- Enter input as a normal user would
- Sign up for an account and view the application as an authenticated user
- Trying to understand the application behavior
#### Checking the Page Source

- Press `CTRL + U`
- Check the page source for any servers that need to be tested
- Raw IP address
- Domain names
- HTTP/HTTPS
- Look for anything interesting visible client side
- Typically in the HTML comments
- Usernames
- Passwords
- Directory names
- File names
- Etc

#### Check for Robots and Sitemap

- `http://10.10.100.44/robots.txt` or `https://mysite.test/robots.txt`
- `https://10.10.100.44/sitemap.xml` or `https://mysite.test/sitemap.xml`
- `robots.txt` and `sitemap.xml` direct legitimate web crawlers and search engines
- They're only effective to the extent bots respect them
- Can also reveal some interesting and sensitive directories or pages
- `robots.txt` may show an entry for the `/admin` directory or similar
- A legitimate web crawler respects this and does not crawl the directory
- Malicious users will see this an opportunity to explore

#### Directory and File Enumeration

- Interesting files and directories may be "hidden" or not directly exposed
- We can send a series of HTTP requests to determine if a file or directory exists
- `HTTP 20x` and `HTTP 30x` responses would be interesting
- `HTTP 403` could be interesting from the perspective of, "What are we ***NOT*** allowed to access?"
- I typically use `gobuster` or `feroxbuster`
- Choose whichever tool is most comfortable for you

```bash
gobuster dir -u http://10.10.100.44 -w /usr/share/seclists/Discovery/Web-Content/directory-list-big.txt -x php,html -t 100 -o gobuster80.txt
```
*HTTP enumeration*

```bash
gobuster dir -k -u https://dev.mysite.test -w /usr/share/seclists/Discovery/Web-Content/big.txt -x php,html -t 100 -o gobuster443.txt
```
*HTTPS domain-specific enumeration example*

- These enumeration scans could reveal:
- "Hidden" pages or pages with unintended access
- Path-based applications such as CMS (eg. WordPress or Drupal)
- Blogs or CMS platforms may be unpatched or use unpatched plugins
- Should check the version numbers for public exploits
- `wp-scan` can be helpful when enumerating WordPress

#### Testing the Application

By now, you should have plenty of places to begin looking for potential vulnerabilities with the web applications running on the server.

You want to begin testing the web applications at various points:

- Vulnerable service or plugin versions
- URL parameters
- Login forms
- Search fields
- File uploads
- Etc.

And, you could test for things like:

- Path traversal
- Local and/or remote file inclusion
- Content type filter bypass
- SQL injection
- Default credentials
- Credential stuffing
- Password spraying
- Much, much more