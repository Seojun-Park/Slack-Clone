#!/bin/bash

echo -e "\t\t\n\n \033[1;33mSlack Clone First Init\033[0m"

npm run schema:drop
npm run schema:sync
npm run seed:run

echo -e "\033[1;31mDone!\033[0m"
