# CSV-Preview demo app

## Run

Run the app via the docker compose:
```
$ cd /<path-to-app-repo>
$ docker compose up
```

## App usage
Upload a file by clicking the cloud icon. Preview the file by clicking the desired file in the list. Extend the file by navigating to the extend tab of specific file and fill out the necessary forms.

### Known issues
- possible css bugs
- filenames with special characters might not be supported as tablenames in db are created from them and there isn't yet some proper name sanitation
