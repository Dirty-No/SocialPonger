#!/bin/bash

# Script to easily launch the project in dev mode

# Setup pgadmin volume to work correctly with docker
sudo chown -R 5050:5050 pgadmin/

# Automatically set env values when in a gitpod workspace
if [ -n "$GITPOD_WORKSPACE_ID" ];then
    export API_PORT=80
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/api
    export WSS_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST/
    export NGINX_DEV_HOST="$API_PORT-$GITPOD_WORKSPACE_HOST"
    export BASE_URL="$NGINX_DEV_HOST"
    export BROWSER_BASE_URL="$BASE_URL"
    source ~/.nvm/nvm-lazy.sh
fi

export NODE_ENV=development
nvm install 17
nvm use 17
cd api ; npm i ; cd ..
cd client ; npm i ; cd ..

cp .env.sample .env
cp api.env.sample api.env
cp db.env.sample db.env
echo API_BASE_URL="$API_BASE_URL" >> api.env

INTRA_SESSION=""
INTRA_APP_ID=9598

CSRF_TOKEN=$(curl "https://profile.intra.42.fr/oauth/applications/$INTRA_APP_ID" -H "cookie: _intra_42_session_production=$INTRA_SESSION" --compressed | grep csrf-token | awk -F '"' '{print $4}')

curl "https://profile.intra.42.fr/oauth/applications/$INTRA_APP_ID" \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundaryLFclr9aAe0GQip6L' \
  -H "cookie: _intra_42_session_production=$INTRA_SESSION" \
  --data-raw $'------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="utf8"\r\n\r\n✓\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="_method"\r\n\r\npatch\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="authenticity_token"\r\n\r\n'$CSRF_TOKEN$'\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[name]"\r\n\r\ntrans\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[image_cache]"\r\n\r\n\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[image]"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[description]"\r\n\r\ntrans\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[website]"\r\n\r\n\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[public]"\r\n\r\n0\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[scopes]"\r\n\r\npublic projects profile elearning tig forum\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="doorkeeper_application[redirect_uri]"\r\n\r\n'$API_BASE_URL$'/auth/42\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nprojects\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nprofile\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nelearning\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\ntig\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="scopes[]"\r\n\r\nforum\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L\r\nContent-Disposition: form-data; name="commit"\r\n\r\nSubmit\r\n------WebKitFormBoundaryLFclr9aAe0GQip6L--\r\n' \
  --compressed

response=$(curl "https://profile.intra.42.fr/oauth/applications/$INTRA_APP_ID" -H "cookie: _intra_42_session_production=$INTRA_SESSION" --compressed)

INTRA_UID=$(grep -A10  UID <<< "$response" | grep data-app-uid | awk -F "'" '{print $4}')
INTRA_SECRET=$(grep -A10 Secret <<< "$response" | grep data-app-secret| awk -F "'" '{print $4}')
echo INTRA42_UID="$INTRA_UID" >> api.env
echo INTRA42_SECRET="$INTRA_SECRET" >> api.env

# Can't use docker restart because I want to be able to use --build flags and logs attached out-of-the-box
docker-compose stop $@
docker-compose up $@
