SSPokemonHUD
------------

SSPokemonHUD is an idea that [ShockSlayer](https://www.youtube.com/c/shockslayer "SS's YouTube Channel") came up with and was starting to work on for his [Twitch streams](https://twitch.tv/shockslayer "SS's Twitch").
This fork specifically removed the Pokeballs, colored backgrounds, nicknames, and levels from the webpage.
It then puts the all the Pokemon together on one row instead of one Pokemon per row.

## Premise
I was wanting to make this as simple as possible. Because of that I have chosen to use a Python based web server.
To the average person running Windows this just means you have to install one program and voila, you have it working. In Linux, Python is _usually_ pre-installed on the distribution of your choice, so that makes running this super simple.

## Install Instructions
### Windows
* Install a version of [Python 3](https://www.python.org/downloads/) from their official website.
* Press the green download button above, then download as a ZIP file. Extract that to where you want it.
  * If you have GIT Bash or a Windows GIT client, you can just clone this project to a folder on your computer.
* Download and put the required resources in their folders [(info is below)](#Resources).
* Run `setup.py`, just to make sure that the Python dependencies are installed. If it says all `Requirement already satisfied` then you should be good.
* Run `start.py` whenever you can to start it up, point OBS to `localhost:251`, and you should be good.

### Linux
Assuming you have both GIT and Python 3 installed, this install is super easy:
```
git clone https://github.com/guitaristtom/SSPokemonHUD.git
```
* Run `setup.py`, just to make sure that Python dependencies and other required files are installed. If it says `Requirement already satisfied` then you should be good.
* Run `start.py` whenever you can to start it up, point OBS to `localhost:251`, and you should be good.

### Mac OS X
`¯\_(ツ)_/¯`

## Resources
You will need to download and put these in the correct folders (and unzip them if needed):

* [Assets Pack](http://www.mediafire.com/file/1m8bm8mj8z1ozrd/SSPokemonHUD-assets.zip) ([backup link](https://mega.nz/#!cUlURKyA!lbQVYxW3pyC6v8rOHfxLR-IS7jMpL5FyfGWRAbc-1Dg)) - put contents in the `assets/` folder
* [Pokemon GB Fonts](http://www.fontspace.com/jackster-productions/pokemon-gb) - put contents in the `fonts/` folder (not actually used by this fork)

## Folder Info
A rather simple description of what each folder is responsible for.

* `assets/` - The various accompanying assets for this little HUD tool
* `css/` - The compiled stylesheets for the `index.html` file
* `extensions/` - This has all of the "automatic" extensions that you need to run if you'd like to read a save state from an emulator
* `fonts/` - The required font files (if you don't have them or want them installed)
* `js/` - The JavaScript files for the `index.html` file
* `luts/` - The various CSV and `look up table` files. Most are from [Veekun](https://github.com/veekun/pokedex/tree/master/pokedex/data/csv)
* `scss/` - The uncompiled SASS stylesheets

## JS Libraries Used
* [jQuery](https://jquery.com/) `3.3.1`
* [Papa Parse](https://www.papaparse.com/) `v4.4.0`

## Python Libraries Used
* `Pip` (to install IntelHex)
* `IntelHex`

## To Do:
* Switch over to probably dependency management
* Clean up the SCSS file
