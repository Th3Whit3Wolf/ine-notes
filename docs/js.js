// search script, borrowed from book theme

// Reference Javascript Porter Stemmer. This code corresponds to the original
// 1980 paper available here: http://tartarus.org/martin/PorterStemmer/def.txt
// The latest version of this code is available at https://github.com/kristopolous/Porter-Stemmer
//
// Original comment:
// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
// paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
//  no. 3, pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

var stemmer = (function () {
  var step2list = {
    "ational": "ate",
    "tional": "tion",
    "enci": "ence",
    "anci": "ance",
    "izer": "ize",
    "bli": "ble",
    "alli": "al",
    "entli": "ent",
    "eli": "e",
    "ousli": "ous",
    "ization": "ize",
    "ation": "ate",
    "ator": "ate",
    "alism": "al",
    "iveness": "ive",
    "fulness": "ful",
    "ousness": "ous",
    "aliti": "al",
    "iviti": "ive",
    "biliti": "ble",
    "logi": "log"
  },

    step3list = {
      "icate": "ic",
      "ative": "",
      "alize": "al",
      "iciti": "ic",
      "ical": "ic",
      "ful": "",
      "ness": ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  function dummyDebug() { }

  function realDebug() {
    console.log(Array.prototype.slice.call(arguments).join(' '));
  }

  return function (w, debug) {
    var
      stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4,
      debugFunction,
      origword = w;

    if (debug) {
      debugFunction = realDebug;
    } else {
      debugFunction = dummyDebug;
    }

    if (w.length < 3) { return w; }

    firstch = w.substr(0, 1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) {
      w = w.replace(re, "$1$2");
      debugFunction('1a', re, w);

    } else if (re2.test(w)) {
      w = w.replace(re2, "$1$2");
      debugFunction('1a', re2, w);
    }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        w = w.replace(re, "");
        debugFunction('1b', re, w);
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stem)) {
        w = stem;
        debugFunction('1b', re2, w);

        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");

        if (re2.test(w)) {
          w = w + "e";
          debugFunction('1b', re2, w);

        } else if (re3.test(w)) {
          re = /.$/;
          w = w.replace(re, "");
          debugFunction('1b', re3, w);

        } else if (re4.test(w)) {
          w = w + "e";
          debugFunction('1b', re4, w);
        }
      }
    }

    // Step 1c
    re = new RegExp("^(.*" + v + ".*)y$");
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
      debugFunction('1c', re, w);
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step2list[suffix];
        debugFunction('2', re, w);
      }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step3list[suffix];
        debugFunction('3', re, w);
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stem)) {
        w = stem;
        debugFunction('4', re, w);
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stem)) {
        w = stem;
        debugFunction('4', re2, w);
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
        debugFunction('5', re, re2, re3, w);
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
      re = /.$/;
      w = w.replace(re, "");
      debugFunction('5', re, re2, w);
    }

    // and turn initial Y back to y
    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }


    return w;
  }
})();

function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

// Taken from mdbook
// The strategy is as follows:
// First, assign a value to each word in the document:
//  Words that correspond to search terms (stemmer aware): 40
//  Normal words: 2
//  First word in a sentence: 8
// Then use a sliding window with a constant number of words and count the
// sum of the values of the words within the window. Then use the window that got the
// maximum sum. If there are multiple maximas, then get the last one.
// Enclose the terms in <b>.
function makeTeaser(body, terms) {
  var TERM_WEIGHT = 40;
  var NORMAL_WORD_WEIGHT = 2;
  var FIRST_WORD_WEIGHT = 8;
  var TEASER_MAX_WORDS = 30;


  var stemmedTerms = terms.map(function (w) {
    return stemmer(w.toLowerCase());
  });
  var termFound = false;
  var index = 0;
  var weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  var sentences = body.toLowerCase().split(". ");

  for (var i in sentences) {
    var words = sentences[i].split(" ");
    var value = FIRST_WORD_WEIGHT;

    for (var j in words) {
      var word = words[j];

      if (word.length > 0) {
        for (var k in stemmedTerms) {
          if (stemmer(word).startsWith(stemmedTerms[k])) {
            value = TERM_WEIGHT;
            termFound = true;
          }
        }
        weighted.push([word, value, index]);
        value = NORMAL_WORD_WEIGHT;
      }

      index += word.length;
      index += 1;  // ' ' or '.' if last word in sentence
    }

    index += 1;  // because we split at a two-char boundary '. '
  }

  if (weighted.length === 0) {
    return body;
  }

  var windowWeights = [];
  var windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
  // We add a window with all the weights first
  var curSum = 0;
  for (var i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (var i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  var maxSumIndex = 0;
  if (termFound) {
    var maxFound = 0;
    // backwards
    for (var i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  var teaser = [];
  var startIndex = weighted[maxSumIndex][2];
  for (var i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    var word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push("<b>");
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push("</b>");
    }
  }
  teaser.push("…");
  return teaser.join("");
}

function formatSearchResultItem(item, terms) {
  var li = document.createElement("li");
  li.classList.add("search-results__item");
  li.innerHTML = `<a href="${item.item.url}">${item.item.title}</a>`;
  li.innerHTML += `<div class="search-results__teaser">${makeTeaser(item.item.body, terms)}</div>`;
  return li;
}

// Go from the book view to the search view
function toggleSearchMode() {
  var $wrapContent = document.querySelector("#wrap");
  var $searchIcon = document.querySelector("#search-ico");
  var $searchContainer = document.querySelector(".search-container");
  if ($searchContainer.classList.contains("search-container--is-visible")) {
    $searchContainer.classList.remove("search-container--is-visible");
    $wrapContent.style.display = "";
    $searchIcon.className = "ms-Icon--Search";
  } else {
    $searchContainer.classList.add("search-container--is-visible");
    $wrapContent.style.display = "none";
    $searchIcon.className = "ms-Icon--ChromeClose";
    document.getElementById("search").focus();
  }
}

function initSearch() {
  var $searchInput = document.getElementById("search");
  if (!$searchInput) {
    return;
  }
  var $searchIcon = document.querySelector("#search-ico");
  $searchIcon.addEventListener("click", toggleSearchMode);

  var $searchResults = document.querySelector(".search-results");
  var $searchResultsHeader = document.querySelector(".search-results__header");
  var $searchResultsItems = document.querySelector(".search-results__items");
  var MAX_ITEMS = 100;

  var options = {
    bool: "AND",
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    }
  };
  var currentTerm = "";

  var index = new Fuse(window.searchIndex, {
    includeScore: true,
    keys: ['title', 'body'],
    keys: [
      {
        name: 'title',
        weight: 2
      },
      {
        name: 'body',
        weight: 1
      }
    ]

  })

  /*

  Object { staticSearch: (17) […] }
​
staticSearch: Array(17) [ {…}, {…}, {…}, … ]
 ​
0: Object { item: {…}, refIndex: 17, score: 1.7800828886198141e-16 }
  ​
item: Object { url: "http://127.0.0.1:1111/CLI Tools/nmap/", title: "Nmap", body: 'Nmap\nGolden Search\n\n\n\nTarget Specification\nSWITCHEXAMPLEDESCRIPTION\nnmap 192.168.1.1Scan a single IP\nnmap 192.168.1.1 192.168.2.1Scan specific IPs\nnmap 192.168.1.1-254Scan a range\nnmap scanme.nmap.orgScan a domain\nnmap 192.168.1.0/24Scan using CIDR notation\n-iLnmap -iL targets.txtScan targets from a file\n-iRnmap -iR 100Scan 100 random hosts\n-excludenmap -exclude 192.168.1.1Exclude listed hosts\n\nNmap Scan&nbsp;Techniques\nSWITCHEXAMPLEDESCRIPTION\n-sSnmap 192.168.1.1 -sSTCP SYN port scan (Default)\n-sTnmap 192.168.1.1 -sTTCP connect port scan (Default without root privilege)\n-sUnmap 192.168.1.1 -sUUDP port scan\n-sAnmap 192.168.1.1 -sATCP ACK port scan\n-sWnmap 192.168.1.1 -sWTCP Window port scan\n-sMnmap 192.168.1.1 -sMTCP Maimon port scan\n\nHost Discovery\nSWITCHEXAMPLEDESCRIPTION\n-sLnmap 192.168.1.1-3 -sLNo Scan. List targets only\n-snnmap 192.168.1.1/24 -snDisable port scanning. Host discovery only.\n-Pnnmap 192.168.1.1-5 -PnDisable host discovery. Port scan only.\n-PSnmap 192.168.1.1-5 -PS22-25,80TCP SYN discovery on port x.  Port 80 by default\n-PAnmap 192.168.1.1-5 -PA22-25,80TCP ACK discovery on port x.  Port 80 by default\n-PUnmap 192.168.1.1-5 -PU53UDP discovery on port x.  Port 40125 by default\n-PRnmap 192.168.1.1-1/24 -PRARP discovery on local network\n-nnmap 192.168.1.1 -nNever do DNS resolution\n\nPort Specification\nSWITCHEXAMPLEDESCRIPTION\n-pnmap 192.168.1.1 -p 21Port scan for port x\n-pnmap 192.168.1.1 -p 21-100Port range\n-pnmap 192.168.1.1 -p U:53,T:21-25,80Port scan multiple TCP and UDP ports\n-pnmap 192.168.1.1 -p-Port scan all ports\n-pnmap 192.168.1.1 -p http,httpsPort scan from service name\n-Fnmap 192.168.1.1 -FFast port scan (100 ports)\n-top-portsnmap 192.168.1.1 -top-ports 2000Port scan the top x ports\n-p-65535nmap 192.168.1.1 -p-65535Leaving off initial port in range makes the scan start at port 1\n-p0-nmap 192.168.1.1 -p0-Leaving off end port in range  makes the scan go through to port 65535\n\nService and Version Detection\nSWITCHEXAMPLEDESCRIPTION\n-sVnmap 192.168.1.1 -sVAttempts to determine the version of the service running on port\n-sV -version-intensitynmap 192.168.1.1 -sV -version-intensity 8Intensity level 0 to 9. Higher number increases possibility of correctness\n-sV -version-lightnmap 192.168.1.1 -sV -version-lightEnable light mode. Lower possibility of correctness. Faster\n-sV -version-allnmap 192.168.1.1 -sV -version-allEnable intensity level 9. Higher possibility of correctness. Slower\n-Anmap 192.168.1.1 -AEnables OS detection, version detection, script scanning, and traceroute\n\nOS Detection\nSWITCHEXAMPLEDESCRIPTION\n-Onmap 192.168.1.1 -ORemote OS detection&nbsp;using TCP/IP stack fingerprinting\n-O -osscan-limitnmap 192.168.1.1 -O -osscan-limitIf at least one open and one closed TCP port are not found it will not try OS detection against host\n-O -osscan-guessnmap 192.168.1.1 -O -osscan-guessMakes Nmap guess more aggressively\n-O -max-os-triesnmap 192.168.1.1 -O -max-os-tries 1Set the maximum number x of OS detection tries against a target\n-Anmap 192.168.1.1 -AEnables OS detection, version detection, script scanning, and traceroute\n\nTiming and Performance\nSWITCHEXAMPLEDESCRIPTION\n-T0nmap 192.168.1.1 -T0Paranoid (0) Intrusion Detection System evasion\n-T1nmap 192.168.1.1 -T1Sneaky (1) Intrusion Detection System evasion\n-T2nmap 192.168.1.1 -T2Polite (2) slows down the scan to use less bandwidth and use less target machine resources\n-T3nmap 192.168.1.1 -T3Normal (3) which is default speed\n-T4nmap 192.168.1.1 -T4Aggressive (4) speeds scans; assumes you are on a reasonably fast and reliable network\n-T5nmap 192.168.1.1 -T5Insane (5) speeds scan; assumes you are on an extraordinarily fast network\n\nTiming and Performance Switches\nSWITCHEXAMPLE INPUTDESCRIPTION\n-host-timeout&nbsp;1s; 4m; 2hGive up on target after this long\n-min-rtt-timeout/max-rtt-timeout/initial-rtt-timeout&nbsp;1s; 4m; 2hSpecifies probe round trip time\n-min-hostgroup/max-hostgroup&nbsp;&lt;size50; 1024Parallel host scan group sizes\n-min-parallelism/max-parallelism&nbsp;10; 1Probe parallelization\n-max-retries 3Specify the maximum number of port scan probe retransmissions\n-min-rate&nbsp;100Send packets no slower than&nbsp; per second\n-max-rate 100Send packets no faster than&nbsp; per second\n\nNSE Scripts\nSWITCHEXAMPLEDESCRIPTION\n-sCnmap 192.168.1.1 -sCScan with default NSE scripts. Considered useful for discovery and safe\n-script defaultnmap 192.168.1.1 -script defaultScan with default NSE scripts. Considered useful for discovery and safe\n-scriptnmap 192.168.1.1 -script=bannerScan with a single script. Example banner\n-scriptnmap 192.168.1.1 -script=http*Scan with a wildcard. Example http\n-scriptnmap 192.168.1.1 -script=http,bannerScan with two scripts. Example http and banner\n-scriptnmap 192.168.1.1 -script "not intrusive"Scan default, but remove intrusive scripts\n-script-argsnmap -script snmp-sysdescr -script-args snmpcommunity=admin 192.168.1.1NSE script with arguments\n\nUseful NSE Script Examples\nCOMMANDDESCRIPTION\nnmap -Pn -script=http-sitemap-generator scanme.nmap.orghttp site map generator\nnmap -n -Pn -p 80 -open -sV -vvv -script banner,http-title -iR 1000Fast search for random web servers\nnmap -Pn -script=dns-brute domain.comBrute forces DNS hostnames guessing subdomains\nnmap -n -Pn -vv -O -sV -script smb-enum*,smb-ls,smb-mbenum,smb-os-discovery,smb-s*,smb-vuln*,smbv2* -vv 192.168.1.1Safe SMB scripts to run\nnmap -script whois* domain.comWhois query\nnmap -p80 -script http-unsafe-output-escaping scanme.nmap.orgDetect cross site scripting vulnerabilities\nnmap -p80 -script http-sql-injection scanme.nmap.orgCheck for SQL injections\n\nFirewall / IDS Evasion and Spoofing\nSWITCHEXAMPLEDESCRIPTION\n-fnmap 192.168.1.1 -fRequested scan (including ping scans) use tiny fragmented IP packets. Harder for packet filters\n-mtunmap 192.168.1.1 -mtu 32Set your own offset size\n-Dnmap -D 192.168.1.101,192.168.1.102,192.168.1.103,192.168.1.23 192.168.1.1Send scans from spoofed IPs\n-Dnmap -D decoy-ip1,decoy-ip2,your-own-ip,decoy-ip3,decoy-ip4 remote-host-ipAbove example explained\n-Snmap -S www.microsoft.com www.facebook.comScan Facebook from Microsoft (-e eth0 -Pn may be required)\n-gnmap -g 53 192.168.1.1Use given source port number\n-proxiesnmap -proxies http://192.168.1.1:8080, http://192.168.1.2:8080 192.168.1.1Relay connections through HTTP/SOCKS4 proxies\n-data-lengthnmap -data-length 200 192.168.1.1Appends random data to sent packets\n\nExample IDS Evasion command\nnmap -f -t 0 -n -Pn --data-length 200 -D\n192.168.1.101,192.168.1.102,192.168.1.103,192.168.1.23 192.168.1.1\nOutput\nSWITCHEXAMPLEDESCRIPTION\n-oNnmap 192.168.1.1 -oN normal.fileNormal output to the file normal.file\n-oXnmap 192.168.1.1 -oX xml.fileXML output to the file xml.file\n-oGnmap 192.168.1.1 -oG grep.fileGrepable output to the file grep.file\n-oAnmap 192.168.1.1 -oA resultsOutput in the three major formats at once\n-oG -nmap 192.168.1.1 -oG -Grepable output to screen. -oN -, -oX - also usable\n-append-outputnmap 192.168.1.1 -oN file.file -append-outputAppend a scan to a previous scan file\n-vnmap 192.168.1.1 -vIncrease the verbosity level (use -vv or more for greater effect)\n-dnmap 192.168.1.1 -dIncrease debugging level (use -dd or more for greater effect)\n-reasonnmap 192.168.1.1 -reasonDisplay the reason a port is in a particular state, same output as -vv\n-opennmap 192.168.1.1 -openOnly show open (or possibly open) ports\n-packet-tracenmap 192.168.1.1 -T4 -packet-traceShow all packets sent and received\n-iflistnmap -iflistShows the host interfaces and routes\n-resumenmap -resume results.fileResume a scan\n\nHelpful Nmap Output examples\nCOMMANDDESCRIPTION\nnmap -p80 -sV -oG - -open 192.168.1.1/24 | grep openScan for web servers and grep to show which IPs are running web servers\nnmap -iR 10 -n -oX out.xml | grep "Nmap" | cut -d " " -f5 &gt; live-hosts.txtGenerate a list of the IPs of live hosts\nnmap -iR 10 -n -oX out2.xml | grep "Nmap" | cut -d " " -f5 &gt;&gt; live-hosts.txtAppend IP to the list of live hosts\nndiff scanl.xml scan2.xmlCompare output from nmap using the ndif\nxsltproc nmap.xml -o nmap.htmlConvert nmap xml files to html files\ngrep " open " results.nmap | sed -r ‘s/ +/ /g’ | sort | uniq -c | sort -rn | lessReverse sorted list of how often ports turn up\n\nMiscellaneous Nmap Flags\nSWITCHEXAMPLEDESCRIPTION\n-6nmap -6 2607:f0d0:1002:51::4Enable IPv6 scanning\n-hnmap -hnmap help screen\n\nOther Useful Nmap Commands\nCOMMANDDESCRIPTION\nnmap -iR 10 -PS22-25,80,113,1050,35000 -v -snDiscovery only on ports x, no port scan\nnmap 192.168.1.1-1/24 -PR -sn -vvArp discovery only on local network, no port scan\nnmap -iR 10 -sn -tracerouteTraceroute to random targets, no port scan\nnmap 192.168.1.1-50 -sL -dns-server 192.168.1.1Query the Internal DNS for hosts, list targets only\nnmap 192.168.1.1 --packet-traceShow the details of the packets that are sent and received during a scan and capture the traffic.\n\n', … }
  ​
refIndex: 17
  ​
score: 1.7800828886198141e-16
  ​


  */

  $searchInput.addEventListener("keyup", debounce(function () {
    var term = $searchInput.value.trim();
    if (term === currentTerm || !index) {
      return;
    }
    $searchResults.style.display = term === "" ? "none" : "block";
    $searchResultsItems.innerHTML = "";
    if (term === "") {
      return;
    }

    var results = index.search(term).filter(function (r) {
      return r.item.body !== "";

    });
    if (results.length === 0) {
      $searchResultsHeader.innerText = `Nothing like «${term}»`;
      return;
    }

    currentTerm = term;
    $searchResultsHeader.innerText = `${results.length} found for «${term}»:`;
    for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
      if (!results[i].item.body) {
        continue;
      }
      // var item = document.createElement("li");
      // item.innerHTML = formatSearchResultItem(results[i], term.split(" "));
      $searchResultsItems.appendChild(formatSearchResultItem(results[i], term.split(" ")));
    }
  }, 150));
}

if (document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  initSearch();
} else {
  document.addEventListener("DOMContentLoaded", initSearch);
}

// mobile 

function burger() {
  let x = document.querySelector("#trees");
  let y = document.querySelector("#mobile");

  if (x.style.display === "block") {
    x.style.display = "none";
    y.className = "ms-Icon--GlobalNavButton";
  } else {
    x.style.display = "block";
    y.className = "ms-Icon--ChromeClose";
  }
}

// https://aaronluna.dev/blog/add-copy-button-to-code-blocks-hugo-chroma/

function createCopyButton(highlightDiv) {
  const button = document.createElement("button");
  button.className = "copy-code-button ";
  button.type = "button";
  button.innerHTML = "&#xE8C8;";
  button.addEventListener("click", () =>
    copyCodeToClipboard(button, highlightDiv)
  );
  addCopyButtonToDom(button, highlightDiv);
}

async function copyCodeToClipboard(button, highlightDiv) {
  const codeToCopy = highlightDiv.querySelector(":last-child > code")
    .innerText;
  try {
    result = await navigator.permissions.query({ name: "clipboard-write" });
    if (result.state == "granted" || result.state == "prompt") {
      await navigator.clipboard.writeText(codeToCopy);
    } else {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    }
  } catch (_) {
    copyCodeBlockExecCommand(codeToCopy, highlightDiv);
  } finally {
    codeWasCopied(button);
  }
}

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
  const textArea = document.createElement("textArea");
  textArea.contentEditable = "true";
  textArea.readOnly = "false";
  textArea.className = "copyable-text-area";
  textArea.value = codeToCopy;
  highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
  const range = document.createRange();
  range.selectNodeContents(textArea);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  textArea.setSelectionRange(0, 999999);
  document.execCommand("copy");
  highlightDiv.removeChild(textArea);
}

function codeWasCopied(button) {
  button.blur();
  button.innerHTML = "&#xE74E;";
  setTimeout(function () {
    button.innerHTML = "&#xE8C8;";
  }, 2000);
}

function addCopyButtonToDom(button, highlightDiv) {
  highlightDiv.insertBefore(button, highlightDiv.firstChild);
  const wrapper = document.createElement("div");
  wrapper.className = "highlight-wrapper";
  highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
  wrapper.appendChild(highlightDiv);
}

document
  .querySelectorAll("pre")
  .forEach((highlightDiv) => createCopyButton(highlightDiv));
