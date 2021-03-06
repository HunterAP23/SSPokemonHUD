// Load Reference Data First
function grabCSV(title, filename) {
    return $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        success: function(data) {
            console.log("Successfully loaded: " + title)
        }
    });
};

function csvToObject(input) {
    var output = Papa.parse(
        input,
        {
            header: true,
            trimHeader: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }
    );
    return output;
}

/**
 * Grabs the team data from the JSON file, and then runs the populate function
 *
 * @return {boolean}
 */
var teamString;
var oldTeamArray = { // Needs a blank set of slots for initial comparison
    "slot1": {}, "slot2": {}, "slot3": {}, "slot4": {}, "slot5": {}, "slot6": {}
};
function grabTeam(){
    var teamFile = "team.json";
    $.getJSON(teamFile, {
    }).done(function(data) {
        if (teamString !== JSON.stringify(data)) {
            teamString = JSON.stringify(data);
            teamArray = data;
            console.log("Current Team Data:");
            console.log(teamArray);
            populateTeam(teamArray, oldTeamArray);
            oldTeamArray = teamArray;
        }
    });

    return true;
};

/**
 * Populates the team with the desired data
 *
 * @param  {array/object}   teamData    Imported JSON team data
 *
 * @return {boolean}
 */
var blankGIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
function populateTeam(teamData, oldTeamData){
    $.each(teamData, function(slotID, slot) {

        // If the slot's values haven't changed, don't touch it at all
        if (JSON.stringify(oldTeamData[slotID]) == JSON.stringify(teamData[slotID])) {
            return;
        }

        // Otherwise, run like normal
        var dexNumber = slot.dexnumber;
        if (dexNumber >= 1) {
            // Sets the background by grabbing the "colour" of the Pokemon, then setting that
            $("#" + slotID).removeClass();
            $("#" + slotID).addClass('slot');
            var colour_id = pkmnSpecies[dexNumber].color_id;
            var colour = colours[colour_id].identifier;
            $("#" + slotID).addClass('bg-' + colour);

            // Pads on a 0 or two 0's if needed, so the file look ups are correct
            var paddedDexNumber = pad(dexNumber, 3);
            if (slot.shiny == false) {
                $("#" + slotID + " .sprite").attr("src", "assets/sprites/" + paddedDexNumber + ".gif");
            } else {
                $("#" + slotID + " .sprite").attr("src", "assets/sprites_s/" + paddedDexNumber + ".gif");
            }

            // Captured Pokeball
            if (slot.ball != "") {
                $("#" + slotID + " .ball").attr("src", "assets/balls/" + slot.ball + ".png");
            } else {
                $("#" + slotID + " .ball").attr("src", blankGIF);
            }

            // Nickname
            if (slot.nickname != "") {
                $("#" + slotID + " .nickname").text(slot.nickname);
            } else {
                $("#" + slotID + " .nickname").text(pkmnNames[dexNumber].name);
            }

            // Level
            $("#" + slotID + " .level").text("Lv. " + slot.level);

        } else if (dexNumber == -1) {
            // If it's an egg
            $("#" + slotID).removeClass();
            $("#" + slotID).addClass('slot');
            $("#" + slotID).addClass('bg-white');

            $("#" + slotID + " .sprite").attr("src", "assets/sprites/egg.gif");

            if (slot.ball != "") {
                $("#" + slotID + " .ball").attr("src", "assets/balls/" + slot.ball + ".png");
            } else {
                $("#" + slotID + " .ball").attr("src", blankGIF);
            }

            $("#" + slotID + " .nickname").text("");
            $("#" + slotID + " .level").text("");

        } else if (dexNumber == 0) {
            // If it's empty
            $("#" + slotID).removeClass();
            $("#" + slotID).addClass('slot');
            $("#" + slotID).addClass('bg-none');

            // Set's the sprite and ball to a 1px x 1px pixel transparent GIF
            $("#" + slotID + " .sprite").attr("src", blankGIF);
            $("#" + slotID + " .ball").attr("src", blankGIF);

            // And empty the text areas
            $("#" + slotID + " .nickname").text("");
            $("#" + slotID + " .level").text("");

        }
    });

    return true;
}

/**
 * Adds X amount of zeros to a number as lead padding
 *
 * @param  {string} num     Input number
 * @param  {int}    size    Desired length of the number string
 *
 * @return {string}         Fixed string, with the leading zeroes
 */
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function cleanLocale(names, languageID) {
    var cleanedNames = []
    $.each(names, function(line, name) {
        if (name.local_language_id == languageID) {
            cleanedNames.push(name);
        }
    });

    console.log("Cleaned Pokemon Names");
    return cleanedNames;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// Loads up all of the LUT (look up table) files, then loads the team, and finally sets the check interval
var colours, basePkmn, pkmnTypes, types;
var getVars = getUrlVars();
$(document).ready(function() {
    $.when(
        grabCSV("Colours", "luts/colors.csv"),
        grabCSV("Pokemon", "luts/pokemon.csv"),
        grabCSV("Pokemon Names", "luts/pokemon_names.csv"),
        grabCSV("Pokemon Species", "luts/pokemon_species.csv"),
        grabCSV("Pokemon Types", "luts/pokemon_types.csv"),
        grabCSV("Types", "luts/types.csv")
    ).done(function(
        coloursCSV,
        pokemonCSV,
        pokemonNamesCSV,
        pokemonSpeciesCSV,
        pokemonTypesCSV,
        typesCSV
    ){
        // Adding a blank first row to keep numbering correct
        colours = csvToObject(coloursCSV[0]).data;
        colours.unshift({});

        // Adding a blank first row to keep numbering correct
        basePkmn = csvToObject(pokemonCSV[0]).data;
        basePkmn.unshift({});

        // Adding a blank first row to keep numbering correct
        pkmnNames = csvToObject(pokemonNamesCSV[0]).data;
        pkmnNames.unshift({});
        pkmnNames = cleanLocale(pkmnNames, 9);
        pkmnNames.unshift({});

        // Adding a blank first row to keep numbering correct
        pkmnSpecies = csvToObject(pokemonSpeciesCSV[0]).data;
        pkmnSpecies.unshift({});

        // Adding a blank first row to keep numbering correct
        pkmnTypes = csvToObject(pokemonTypesCSV[0]).data;
        pkmnTypes.unshift({});

        // Adding a blank first row to keep numbering correct
        types = csvToObject(typesCSV[0]).data;
        types.unshift({});

        // And finally, grab the team data, and set up a loop
        grabTeam();
        setInterval(grabTeam, 500);
    });

    // Sets up different values depending on the GET values in the URL
    $(function(){
        // Sets the background colour, if enabled
        if (getVars["background"] == "true") {
            $('body').css('background-color', '#1E1E1E');
        }

        // Sets the border effect, if enabled
        if (getVars["border"] == "true") {
            $('.slot').css('border', '1px solid #555555');
        }

        // Sets the stagger effect, if enabled
        if (getVars["noslotbg"] == "true") {
            $('#slot1').css('background', 'none');
            $('#slot1').css('background-image', 'none');

            $('#slot2').css('background', 'none');
            $('#slot2').css('background-image', 'none');

            $('#slot3').css('background', 'none');
            $('#slot3').css('background-image', 'none');

            $('#slot4').css('background', 'none');
            $('#slot4').css('background-image', 'none');

            $('#slot5').css('background', 'none');
            $('#slot5').css('background-image', 'none');

            $('#slot6').css('background', 'none');
            $('#slot6').css('background-image', 'none');

        }

        // Sets the stagger effect, if enabled
        if (getVars["compact"] == "true") {
            $("body").addClass('compact');
        }

        // Sets the stagger effect, if enabled
        if (getVars["compact"] == "single") {
            $("body").addClass('single');
        }

        // Sets the stagger effect, if enabled
        if (getVars["stagger"] == "true") {
            $("body").addClass('stagger');
        }
    });
});
