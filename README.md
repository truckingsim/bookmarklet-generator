bookmarklet-generator
=====================

Scrapes pages and returns the form fields in a json response that can be used to build a form to build a bookmarklet.


Setup
=====

First, make sure [PhantomJS](http://phantomjs.org/) is installed. This module expects the ```phantomjs``` binary to be in PATH somewhere. In other words, type this:

    $ phantomjs

If that works, so will phantomjs-node (a node module that is required). It's only been tested with PhantomJS 1.3, and almost certainly doesn't work with anything older.

Once you have that running you need to install 2 node modules, phantom and stdio:

`sudo npm install phantom`

`sudo npm install https://github.com/truckingsim/stdio/archive/0.1.6.tar.gz`


We have to use a custom version of stdio due to the way it handles equal signs.  Any url passed as a parameter with an equal sign (such as with GET parameters) would cause the URL to be broken up into multiple arguments.


Once those are installed you should be good to go! 

To test whether the scraper is going to work after setup run:

    $ node scraper.js test
    
If that returns `success` then all is good however if not here are some explinations of errors.


Troubleshooting
==================

###No phantomjs in your PATH

    events.js:72
        throw er; // Unhandled 'error' event
              ^
    Error: spawn ENOENT
      at errnoException (child_process.js:988:11)
      at Process.ChildProcess._handle.onexit (child_process.js:779:34)

`phantomjs` is likely not in your PATH.

###phantom-node module not installed

    module.js:340
    throw err;
          ^
    Error: Cannot find module '/var/www/phantomjs/node_modules/scraper.js'
        at Function.Module._resolveFilename (module.js:338:15)
        at Function.Module._load (module.js:280:25)
        at Function.Module.runMain (module.js:497:10)
        at startup (node.js:119:16)
        at node.js:902:3

Then you likely don't have phantom-node installed.  Make sure you have run: `sudo npm install phantom`

###stdio module not installed

    module.js:340
        throw err;
              ^
    Error: Cannot find module 'stdio'
        at Function.Module._resolveFilename (module.js:338:15)
        at Function.Module._load (module.js:280:25)
        at Module.require (module.js:364:17)
        at require (module.js:380:17)
        at Object.<anonymous> (/var/www/phantomjs/scraper.js:1:75)
        at Module._compile (module.js:456:26)
        at Object.Module._extensions..js (module.js:474:10)
        at Module.load (module.js:356:32)
        at Function.Module._load (module.js:312:12)
        at Function.Module.runMain (module.js:497:10)

Then you likely don't have stdio installed.  Make sure your run 

    sudo npm install https://github.com/truckingsim/stdio/archive/0.1.6.tar.gz
    
Where 0.1.6 is the latest release.


YUI Copyright
=============

We include the YUI compressor binary in order to output minified javascript easily.

Copyright (c) 2013, Yahoo! Inc.
All rights reserved.