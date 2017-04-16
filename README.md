# Instrucktor

## Start
open client/public/index.html in a browser

## Develop

    npm install
    npm run watch

## Build

    npm run build
    npm run build-dev




## Notepad
- control with right-left key
- 1px = 10m - 1km = 100px




customize
- body color

state
- trucks (players)
- world
- jobs {}


truck
- position int
- config {dir: 0|1, body: hex rgb}
- player {id: str(email), online:true|false, last_online:timestamp}
- stats {}
- jobs []

stats
- total km driven
- total km of jobs driven
- € earned
- jobs completed

job
- state
- truck
- start_point int
- end_point int
- accept_time
- completion_time
- max_duration



rendering / chunking:
- every ~500px, recalculate chunks
- if within 500px on left / right bound, add chunk of items
- remove obsolete chunk items (not within margin)
