# Homework #2

## Part#1. HTTP-server.
### Description
Server accessed with a GET request, initiates asynchronous operations:
 * Continuous output to the server console of the current date and time in UTC format at certain time intervals.
 * In specified time, stops the console output and completes response, returning the current date and time to the client.

### Instructions:
 * clone this repo: 
 ```
 $ git clone https://github.com/Daryasza/Node_Course.git
 ```
 * go to the current branch: 
 ```
 $ git checkout week2
 ```
 * run:
 ```
 node server.js
 ```

## Part#2. Console sorting app

### Description
A console app organizing files into folders by the first letter in the file name. Works asynchronously. 

### Instructions:
 * clone this repo: 
 ```
 $ git clone https://github.com/Daryasza/Node_Course.git
 ```
 * go to the current branch: 
 ```
 $ git checkout week2
 ```
 * run:
 ```
  node SortingAppAsync/index.js -e ./entryPath ./distPath(optional) -D true(optional)
 ```
where 
- `./entryPath` - is the folder needed to be sorted
- `./distPath` - is the name of the final folder 
-  `-D true` - if you want to delete the entry folder after sorting


