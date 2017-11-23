#Sound Stumble - a sound search tool that querries Freesound.org's api using a spoke and wheel visual GUI.

##Introduction Sound Stumble - The goal is to create a fun, creative and fast way to stumble onto new sounds one would not have originally chosen.

##Use Case - When trying to find samples for a film or music but want to stumble on related but creative sounds

##UX - the ux is a simple spoke and wheel approach. With each search result 8-12 circle nodes allow a simple mouse rollover to preview sounds. By clicking on a sound the user can dig deeper into related sounds based on the clicked sound. Sounds can also be downloaded by selecting the link in the upper right corner after previewing the sound.

##Technical  After entering a search term the app calls an api to return 13 results based on a search term. It then runs a separate call to return the sound url as it requires a separate search. The audio files for then preloaded so the user can preview the sounds. When the user clicks on a sound then the process repeats itself but using the 'related to’ search to dig deeper, which then also needs to run the sound url call. 
