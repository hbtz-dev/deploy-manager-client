# deploy-manager-client

For use with [deploy-manager](https://github.com/hbtz-dev/deploy-manager).

`npm run build` takes an optional environment variable `VITE_MANAGER_LOCATION` as the default location of the deploy-manager instance. If not provided, the user can enter it in the UI.

`npm run start` takes a __mandatory__ environment variable `PORT` as the port to serve the app on. Alternatively you can just serve the static files in `dist/` however you like.

TODO:
- Fix state getting stuck if the websocket connect location is invalid and the constructor throws