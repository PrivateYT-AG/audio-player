# Audio Player

A simple drag-and-drop web audio player. It can:

- Change playback rate, from a range of 0.1 to 4.0
- Option to disable pitch preservation, where disabling it causes pitch to change depending on playback rate (on by default)
- Option to adjust match duration time to playback rate, for example if audio is 20 seconds long and playback rate is 0.5x it will display 40 seconds

The audio player is **fully** client-side, and the files you upload to it are not being sent to a server. It is all processed locally in your browser, and does not require an account to use.