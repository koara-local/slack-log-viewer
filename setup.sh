#!/bin/bash

DATADIR=`find data/* -type d`

for dir in $DATADIR
do
    (
        cd $dir
        {
            echo "["
            # find * -name "*.json" | awk '{ print "    { \"filename\": \""$1"\" }," }' | grep -v "filelist.json" | sed '$s/,//'
            find * -name "*.json" | awk '{ print "    \""$1"\"," }' | grep -v "filelist.json" | sed '$s/,//'
            echo "]"
        } > filelist.json
    ) &
done
