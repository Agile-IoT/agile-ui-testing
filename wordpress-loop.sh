#!/bin/bash

cp results-template.json results.json 
npm run wordpress
while [ $? -eq 1 ]
do 
	npm run wordpress
done
