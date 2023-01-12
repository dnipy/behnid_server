if ! type pm2 > /dev/null
then
    sudo npm install -g pm2 && pm2 delete expressjs && pm2 start npm --name expressjs -i 2 -- run start -- -p 3001 
else
    pm2 delete expressjs && pm2 start npm --name expressjs -i 2 -- run start -- -p 3001 
fi    