<img style="border-radius: 50%" src="./app/assets/group.png" width="120" height="120">

# crowded-app

Crowded is a mobile application that lets you know if a place is crowded or not, so as to avoid crowding and precisely minimize the risk of COVID-19 contagion.
Unfortunately I was unable to publish it as only recognized institutions can publish applications that deal with COVID-19 sensitive data.

&nbsp;

***

&nbsp;

## :deciduous_tree: Repository Structure

```
|
|- app: Mobile Application Code
|
|- backend: Backend Code that uses MongoDB. Can be started both in dev and production mode
|
|- tests: Simple code used to test the backend remotely or locally
```

&nbsp;

***

&nbsp;


## :scream: Test Result

```
  Crowded: majority = (11 person over 30)
    ✓ should not be possible to estabilish a result because of no data
    ✓ should not be possible to estabilish a result because of lack of data (63ms)
    ✓ should be crowded because the majority has voted "yes" in 50 meters (162ms)
    ✓ should be not crowded because the majority has voted and many people say "no" (162ms)
    ✓ should be very crowded because the majority has voted and many people say "yes" (155ms)
    ✓ should be not possible to give a result since majority has not voted and positions are few (77ms)
    ✓ a single user should not vote if 5 minutes are not passed from the last vote


  7 passing (665ms)
```

&nbsp;

***

&nbsp;

## :interrobang: How to run it:

See the __README__ files inside each folder.


