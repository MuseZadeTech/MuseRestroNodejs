# upgraded node to stable v12.10.0
# removed angular dependencies from package lists
# added npm-shrinkwrap.json to make gulp compatible to latest node v12.10.0

Note To make gulp 3x compatible with node 12x, graceful-fs version must be specified as dependency. make a new file npm-shrinkwrap.json in the root directory and add the code: 
```
{
    "dependencies": {
      "graceful-fs": {
          "version": "4.2.2"
       }
    }
  }
```
  And Then hit npm install
  Then Your gulp is now good to go with higher version of node