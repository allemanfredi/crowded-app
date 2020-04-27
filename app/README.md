# :iphone: crowded-app

&nbsp;

***

&nbsp;

## :hammer: Dev mode

```
npm install
```

Go to __settings__ and use your LAN ip address within __baseUrl__ option. You should see somenthing like this:

```js
const settings = {
  googlePlacesApiKey: 'your api key',
  baseUrl: 'http://your address/api',
  timeout: 10000,
  storage: {
    ID: 'Id',
  },
}
```

```
npm run start-dev
```

&nbsp;

***

&nbsp;

## :rocket: Deploy

Be sure to have properly setup the __version__ in __app.json__ file.

### IOS


```
expo build:ios
```

```
expo upload:ios
```

### Android

```
expo build:android
```

```
expo upload:android
```

&nbsp;

***

&nbsp;

## :gear: Build and Run on Simulator

### IOS


```
expo build:ios -t simulator
```

Download the tarball with the link given upon completion when running `expo build:status`.
Unpack the tar.gz by running `tar -xvzf your-app.tar.gz`. Then you can run it by starting an iOS Simulator instance, then running

```
xcrun simctl install booted <app path> and xcrun simctl launch booted <app identifier>
```

### Android

Download the .ipa file to your local machine. You are ready to upload your app to TestFlight. Within TestFlight, click the plus icon and create a New App. Make sure your __bundleIdentifier__ matches what you've placed in app.json.
