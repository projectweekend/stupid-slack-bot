This is dumb

## Pull it
```
docker pull projectweekend/stupid-slack-bot
```

## Configure it
Configuration is saved in a JSON file and passed to the bot via a command line arg:
```
{
    "token": "your-slack-token",
    "channel": "id-for-slack-channel",
    "responses": [
        "This channel sucks",
        "Get out",
        "You get the idea"
    ]
}
```

## Launch it
```
docker run -v /path/to/config.json:/src/config.json projectweekend/stupid-slack-bot -c ./config.json
```
