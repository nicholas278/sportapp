function displayResults(filtersList, sportArray, resultArray, currentPage, maxPage, reloadMap){
    document.getElementById("typebox").innerHTML = "";
    for(var i in filtersList){
        createFilterList(i, filtersList[i]);
    }
    if(reloadMap){
        for(var i in sportArray){
            createMarker(sportArray[i].name, new google.maps.LatLng(sportArray[i].latitude, sportArray[i].longitude));
        }
    }
    if(resultArray.length !== 0){
        document.getElementById("sortoptions").style.display = "block";
        
        for(var i in resultArray){
            var index = (currentPage-1)*10+parseInt(i,10);
            createNewItem(resultArray[i], index);
        }
    }
    else{
        document.getElementById("sortoptions").style.display = "none";
        document.getElementById("results").innerHTML = "0 results returned";
    }
    
    if(markers.length > 0){
        adjustZoom();
    }
    pageNavButtons(currentPage, maxPage);   
}

function createNewItem(resultArray, index){
    var box = createResultBox(index);
    box.appendChild(createIcon());
    box.appendChild(createDistBox(resultArray.distance));
    box.appendChild(createNameBox(resultArray.name));
    box.appendChild(createAddressBox(resultArray.address, resultArray.city, resultArray.province));
    box.appendChild(createSportTypeBox(resultArray.sport));
    box.appendChild(createMoreSportBox());
    var element=document.getElementById("results");
    element.appendChild(box);
}

function createFilterList(filterType, filterItem){
    var content = createElement("div", "filterbox");
    var node = document.createTextNode(filterItem);
    content.appendChild(node);
    content.appendChild(createLink(filterType));
    var element=document.getElementById("typebox");
    element.appendChild(content);
}

function createLink(filterType){
    var a = document.createElement('a');
    var linkText = document.createTextNode(' \u2716');
    a.appendChild(linkText);
    a.href = "#";
    a.id = filterType;
    return a;
}

function createResultBox(index){
    var box = createElement("div", "resultbox");
    box.id = index;
    return box;
}

function createIcon(){
    var content = createElement("div", "boxnumber");
    //content.appendChild(createElement("img", "http://www.clker.com/cliparts/Y/d/d/b/I/5/google-maps-purple-marker-hi.png"));
    return content;
}

function createDistBox(distance){
    var content = createElement("div", "boxdistance");
    if(distance){
        var node=document.createTextNode(distance.toFixed(1)+"km");
        content.appendChild(node);
    }
    return content;
}

function createNameBox(name){
    var content = createElement("div", "boxname");
    var node=document.createTextNode(name);
    content.appendChild(node);
    return content;
}

function createAddressBox(address, city, province){
    var content = createElement("div", "boxaddress");
    var node=document.createTextNode(address+", "+city+" "+province);
    content.appendChild(node);
    return content;
}

function createSportTypeBox(sportType){
    var content = createElement("div", "sportsavailable");
    var node=document.createTextNode(sportType);
    content.appendChild(node);
    return content;
}

function createMoreSportBox(){
    var content = createElement("div", "moresportsbox");
    content.appendChild(createElement("img", "assets/img/moreinfobox.png"));
    return content;
}

function createElement(tag, property){
    var element = document.createElement(tag);
    if(property !== null){
        if(tag === "div"){
            element.className = property;
        }
        else if(tag === "img"){
            element.src = property;
        }
        else{
            element.id = property;
        }
    }
    return element;
}

//Hide or show page navigation buttons when not needed
function pageNavButtons(currentPage, maxPage){
    var element=document.getElementById("currentpage");
    if(currentPage > maxPage){
        element.innerHTML = "";
    }
    else{
        element.innerHTML = currentPage + " / " + maxPage;
    }
    if(currentPage === 1 && currentPage === maxPage || currentPage > maxPage){
        displaySwitch("firstpage", false);
        displaySwitch("previouspage", false);
        displaySwitch("nextpage", false);
        displaySwitch("lastpage", false);
    }
    else if(currentPage === 1){
        displaySwitch("firstpage", false);
        displaySwitch("previouspage", false);
        displaySwitch("nextpage", true);
        displaySwitch("lastpage", true);
    }
    else if(currentPage < maxPage){
        displaySwitch("firstpage", true);
        displaySwitch("previouspage", true);
        displaySwitch("nextpage", true);
        displaySwitch("lastpage", true);
    }
    else if(currentPage === maxPage){
        displaySwitch("firstpage", true);
        displaySwitch("previouspage", true);
        displaySwitch("nextpage", false);
        displaySwitch("lastpage", false);
    } 
}

function displaySwitch(id, on){
    if(on){
        document.getElementById(id).firstElementChild.style.display = "block";
        $('#'+id).mouseover(function(){
            document.getElementById(id).style.backgroundColor = "white";
        });
        $('#'+id).mouseout(function(){
            document.getElementById(id).style.backgroundColor = "transparent";
        });
    }
    else{
        document.getElementById(id).firstElementChild.style.display = "none";
        $('#'+id).unbind("mouseover");
        $('#'+id).unbind("mouseout");
        document.getElementById(id).style.backgroundColor = "transparent";
    }
}

//Sorting the array of sports by distance
function sortSports(sports, lat, lng){
    var sortedList = [];
    for(var i in sports){
        //sortedList.push({dist: distance(sports[i].latitude, sports[i].longitude, lat, lng), sports: sports[i]});
        sports[i]["distance"] = distance(sports[i].latitude, sports[i].longitude, lat, lng);
        sortedList.push(sports[i]);
    }
    sortedList.sort(compare);
    return sortedList;
}

function compare(a,b) {
  if (a["distance"] < b["distance"])
     return -1;
  if (a["distance"] > b["distance"])
    return 1;
  return 0;
}