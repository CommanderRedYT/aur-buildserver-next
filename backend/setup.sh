#!/bin/bash
echo "Setting up project..."

DATABASE_FILENAME="aur-buildserver-next.sqlite"
DATABASE_PATH="./prisma/$DATABASE_FILENAME"
DATABASE_EXISTS=0
FORCE_RESET=0

while getopts ":r" opt; do
    case ${opt} in
        r )
            FORCE_RESET=1
            ;;
        \? )
            echo "Usage: setup.sh [-r]"
            echo "Options:"
            echo "  -r  Reset the database"
            exit 1
            ;;
    esac
done

if [ ! -d ./data ]; then
    echo "Creating data directory"
    mkdir data
fi

if [ ! -f $DATABASE_PATH ]; then
    echo "Creating $DATABASE_FILENAME file"
    touch $DATABASE_PATH
else
    DATABASE_EXISTS=1
fi

if [ $FORCE_RESET -eq 1 ]; then
    echo "Resetting database..."
    rm -f $DATABASE_PATH
    DATABASE_EXISTS=0

    rm -rf ./prisma/*.sqlite* ./prisma/migrations
fi

if [ $DATABASE_EXISTS -eq 0 ]; then
    echo "Creating tables in $DATABASE_FILENAME"
    # initialize prisma
    yarn prisma migrate dev --name init

    # seed the database
    yarn prisma db seed

    # generate prisma client
    yarn prisma generate
fi

echo "Project setup complete"
