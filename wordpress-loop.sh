#!/bin/bash

cp results-template.json results.json 
rm -r /tmp/perf*
HERE=`pwd`
cd ../performance-monitor/
node src/index.js  > /dev/null 2>&1 &
PRO=$! 
echo "process $PRO"
cd $HERE
npm run wordpress
while [ $? -eq 1 ]
do 
	npm run wordpress
done
kill -INT $PRO

