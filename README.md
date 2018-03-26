# one-concurrent

Allows you to 'call' an asynchronous function multiple times, each time with a callback supplied, but only ever have one instance of the function running concurrently

## Install

```bash
$ npm install --save one-concurrent
```

## Usage

```javascript
var oneConcurrent = require("one-concurrent");

oneConcurrent(function (callback) {
	// Call your long-running function here, passing it the provided callback variable
	longRunningTask(callback);

}, function (something) {

	// This is your actual callback. (In this case, called by 'longRunningTask')
})
```

* `func` **Function** - An anonymous function with a single callback param, which -inside- calls your real function. Example: `function (callback) { longRunningTask(callback); }`
* `callback` **Function** - Callback to call

## Example

```javascript
var oneConcurrent = require("one-concurrent");

function longRunningTask(callback) {
	
	console.log(`Doing long-running stuff…`);

	setTimeout(function () { // Simulate long-running task
		callback(Math.random()); // Return a random number
	}, 1*1000);
} 

function runTasks() {

	oneConcurrent(function (callback) {
		longRunningTask(callback);

	}, function (randomNumber) {

		console.log(`Got random number: ${randomNumber}`);
	})
}

runTasks();
runTasks();
runTasks();

setTimeout(runTasks, 3*1000); // Run again in 3 seconds

//=> Doing long-running stuff…
//=> Got random number: 0.15694928092347604
//=> Got random number: 0.15694928092347604
//=> Got random number: 0.15694928092347604
//=> Doing long-running stuff…
//=> Got random number: 0.9069438411363342
```