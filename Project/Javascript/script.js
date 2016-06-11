/*
    Javascript code responsible for:
        - loading the JSON file;
        - Creating the top 5 list;
        - Animating the url shortening components;
        - Changing shortening components behaviours;
        - Copying shortened url to the clipboard;

        Author: Bruno Eduardo D"Angelo de Oliveira - June 2016
*/

//Opens a JSON file and callbacks a function
var getJSON = function(url, callback)
{
    //Will open the JSON file and load its contents
    var xmlhttp = new XMLHttpRequest();
    //TODO: make this work in google chrome
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var objectArray = JSON.parse(xmlhttp.responseText);

            //Sends the array to be converted into a list and added to the page
            callback(objectArray);
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

/*
    This function will create the top 5 list based on the JSON file provided
    by the Chaordic staff and add it to the the top_5_list <div>
*/
var buildTop5List = function(objectArray)
{
    //Sorted
    objectArray = sortList(objectArray);
    var len = objectArray.length;
    if(len > 5)
    {
        len = 5;
    }

    //The div that will contain the list
    listContainer = document.getElementById("top_5_list");

    //The list node
    listNode = document.createElement("ul");
    for(var i = 0; i < len; i++)
    {
        //Data that will be used to create the table
        var url = objectArray[i].url;
        var shortUrl = objectArray[i].shortUrl;
        var hits = formatNumber(objectArray[i].hits.toString());

        /*
            In the next section the HTML nodes, that will create the list,
            will be built and combined in the correct order.

            Final format example:
            <li class="top_5_item"><a href=url><strong>shortUrl</strong></a><span class="top_5_hits">hits</span></li>
        */

        //<li>
        listItem = document.createElement("li");

        if (i != 4)
        {
            //<li class="top_5_item">
            listItem.setAttribute("class", "top_5_item");
        }
        else
        {
            //<li class="last_top_5_item">
            listItem.setAttribute("class", "last_top_5_item");
        }

        //<a href=url>
        var a = document.createElement("a");
        att = a.setAttribute("href", url); //The real url

        //<strong>
        var strong = document.createElement("strong");

        //<strong>shortUrl</strong>
        strong.appendChild(document.createTextNode(shortUrl)); //text to be displayed
        a.appendChild(strong); //<a href=url><strong>shortUrl
        listItem.appendChild(a); //<li class=.....

        var span = document.createElement("span");
        span.setAttribute("class", "top_5_hits")

        //<span class="top_5_hits">hits</span>
        span.appendChild(document.createTextNode(hits)); //number of hits

        listItem.appendChild(span);
        listNode.appendChild(listItem); //Adds the node to the list
    }

    //Adds the finished list to the div
    listContainer.appendChild(listNode);
}

//Sorts list from the biggest to the smallest
var sortList = function(list)
{
    list.sort(function(a, b)
    {
        return parseFloat(b.hits) - parseFloat(a.hits);
    });
    return list;
}

//Makes the shorten button become a copy button and the URL to become "shortened"
//Also fades some components and reveals others after timeout.
var shortenButtonPressed = function()
{
    var inputField = document.getElementById("input_field");
    //No input, so no point in doing anything
    if(inputField.value == "" || inputField == null)
        return;

    var shortenButton = document.getElementById("shorten_button");

    //Here we"ll implement the URL minification and fade effect
    if(shortenButton.value == "encurtar")
    {
        //<span> containing the button text
        var spanNode = shortenButton.firstChild.nextElementSibling;
        var buttonText = spanNode.firstChild;
        spanNode.style.opacity = 0;
        inputField.style.opacity = 0;

        //Fade effect
        window.setTimeout(function()
        {
            var xButton = document.getElementById("hidden_text_button");
            buttonText.nodeValue = "COPIAR";
            shortenButton.value = "copiar";

            inputField.setAttribute("class", "input_white_text");
            inputField.setAttribute("className", "input_white_text");
            inputField.setAttribute("disabled", true);

            inputField.value = "http://chr.dc/xyzxyz"; //implement real hashing function here?? maybe...
            spanNode.style.opacity = 1;
            inputField.style.opacity = 1;
            xButton.style.opacity = 1;

        }, 550);
    }

    //Button is set to copy
    else
    {
        /*This code section works in chrome but not in FF, also a lot of
        other browsers have problems with the execCommand function(mobile apps
        also). So it would be best to implement in some other way, but this is
        just an example of implementation.
        */
        var range = document.createRange();
        range.selectNode(inputField);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    }

}

//Adds the thousands separators
var formatNumber = function(number)
{
    if(number.length < 4)
        return number; //Does not need formatting

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(number))
    {
		number = number.replace(rgx, "$1" + "." + "$2");
    }
    return number;
}

//The X button was pressed, so the url shortener components have to go back
//to the initial state.
var hiddenButtonPressed = function()
{
    var shortenButton = document.getElementById("shorten_button");

    if(shortenButton.value == "encurtar")
        return;

    var inputField = document.getElementById("input_field");
    var spanNode = shortenButton.firstChild.nextElementSibling;
    var buttonText = spanNode.firstChild;
    var xButton = document.getElementById("hidden_text_button");

    inputField.style.opacity = 0;
    xButton.style.opacity = 0;
    spanNode.style.opacity = 0;

    window.setTimeout(function()
    {
        inputField.value = "";
        inputField.setAttribute("class", "input_field");
        inputField.setAttribute("className", "input_field");
        inputField.removeAttribute("disabled");
        inputField.blur();

        buttonText.nodeValue = "ENCURTAR";
        shortenButton.value = "encurtar";

        spanNode.style.opacity = 1;
        inputField.style.opacity = 1;
    }, 550);

}

//Event listeners
//Repository JSON was used because of Google Chrome CORS error
document.addEventListener("DOMContentLoaded",
                        getJSON(
                        "https://raw.githubusercontent.com/chaordic/frontend-intern-challenge/master/Assets/urls.json",
                        buildTop5List),
                        false);

document.getElementById("shorten_button").addEventListener("click", shortenButtonPressed, false);
document.getElementById("hidden_text_button").addEventListener("click", hiddenButtonPressed, false)
