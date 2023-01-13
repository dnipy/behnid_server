#!/bin/sh

NAMED_PATH=`/usr/local/directadmin/directadmin config | grep nameddir | cut -d= -f2`
NAMED_CONF=`/usr/local/directadmin/directadmin config | grep namedconfig | cut -d= -f2`

if [ ! -s $NAMED_CONF ]; then
            echo "Cannot find $NAMED_CONF. Aborting";
            exit 1;
fi

if [ ! -d $NAMED_PATH ]; then
            echo "Cannot find directory $NAMED_PATH. Aborting";
            exit 2;
fi

for u in `ls /usr/local/directadmin/data/users`; do
{
   for i in `cat /usr/local/directadmin/data/users/$u/domains.list; cat /usr/local/directadmin/data/users/$u/domains/*.pointers 2>/dev/null | cut -d= -f1`; do
   {
            echo -n "Checking $i ... ";
       
            COUNT=`grep -c "zone \"$i\"" $NAMED_CONF`
            if [ "$COUNT" -gt 0 ]; then
                        echo "Already exists. Skipping";
                        continue;
            fi
       
            echo "";
            echo "*** Adding $i to ${NAMED_CONF}";
            echo "zone \"${i}\" { type master; file \"${NAMED_PATH}/${i}.db\"; };" >> ${NAMED_CONF}
       
            DBFILE=${NAMED_PATH}/${i}.db
            if [ ! -s ${DBFILE} ]; then
                        echo "Warning: Cannot find ${DBFILE}";
            fi
   };
   done;
};
done;
exit 0;