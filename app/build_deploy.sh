set -e
npm run build
cp src/assets/whitt_light.png build/static/media
rsync -avzhe ssh build/* cymbeline:/var/www/html
