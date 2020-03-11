#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR && cd .. && truffle compile && cd $DIR

cp -r ../build .

python -m SimpleHTTPServer 8000
