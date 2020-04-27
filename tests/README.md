# Tests

&nbsp;

***

&nbsp;

## :page_with_curl: Installation

```
npm install
```

&nbsp;

***

&nbsp;

## :rocket: Test

Before running the tests it's suggested to drop the database.
Create an __.env__ file with this format.

```
ENDPOINT=
```

Be sure that endpoint link points to an application running in dev mode


```
npm test
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