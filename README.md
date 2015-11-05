# MongodbBackUpScript
Backup script for mongodb and upload to S3

#How to use
In terminal, enter ```crontab -e```  
Then enter something like this:  
```javascript```
0 0 * * * SECRET_ACCESS_KEY=WY9HsXfYXMHfxebntOeQfRiexF03tHPReoQOh5YI ACCESS_KEY_ID=AKIAIE6SUIZCTS3DO4PA /opt/node/bin/node ~/MongodbBackUpScript/index.js >/dev/null 2>&1
```

#Notes:
### To prevent the output of the command 
Adding ``` >/dev/null 2>&1``` to prevent the output of the command [more info](http://askubuntu.com/questions/222512/cron-info-no-mta-installed-discarding-output-error-in-the-syslog)
### Add ```zip``` package
For Ubuntu ```sudo apt-get install zip```
### Always run ```node``` with full path
Use ```which node``` to get the full path of node (ex ```/opt/node/bin/node```)
### CronTab pattern 
Use (http://www.cronmaker.com/)[http://www.cronmaker.com/]
