## Homework 2

## Description
1. Server accessed with a GET request, initiates asynchronous operations:
      * Continuous output to the server console of the current date and time in UTC format at certain time intervals.
      * In specified time, stops the console output and completes response, returning the current date and time to the client.

      ### How to use: 
      Run: 
      ```
      node server.js
      ```
2. A console app organizing files into folders (async):

      ### How to use:
      Run:
      ```
      node SortingAppAsync/index.js -e ./entryPath ./distPath(optional) -D true(optional)
      ```
    where 
   - `./entryPath` - is the folder needed to be sorted
   - `./distPath` - is the name of the final folder 
   -  `-D true` - if you want to delete the entry folder after sorting


