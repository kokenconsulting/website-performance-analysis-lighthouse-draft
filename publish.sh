# make sure that NPM_TOKEN environment variable is set. If not, throw an exception
if [ -z "$NPM_TOKEN" ]; then
  echo "NPM_TOKEN environment variable is not set. Please set it and try again."
  exit 1
fi
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN

npm publish