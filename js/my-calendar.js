
var dateArray = new Array ()
var request = new XMLHttpRequest();
var url = host + "dates"
var data
var currentMonth
var year
var tFuse = document.getElementById("tFuse")

request.open("GET", url, true);
request.onload = function () {

  data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400)
  {
    for (obj in data)
      dateArray.push(obj)
  }
  else
    alert('Erreur connection au serveur');

  var calendar = document.getElementById("tFuse");
  const fp = flatpickr(calendar,
    {
      locale: "fr",
      inline: true,
      mode: "multiple",
      enable: dateArray,
      onYearChange: function(selectedDates, dateStr, instance)
      {
        year = this.currentYear
      },
      onReady: function(selectedDates, dateStr, instance){
        currentMonth = this.currentMonth
        year = this.currentYear
      },
      onMonthChange: function(selectedDates, dateStr, instance)
      {
        currentMonth = fp.currentMonth
      },
   });
}

request.send();
// event onchange input data calendar (input is hidden)
tFuse.onchange = function(ev, elem)
{
  var list = document.getElementById("file");
  var size = list.childElementCount;
  for (var i = 0; i < size; i++) {
    list.removeChild(list.childNodes[0])
  }

  var list2 = document.getElementById("infos")
  var size2 = list2.childElementCount
  for (var j = 0; j < size2; j++) {
    list2.removeChild(list2.childNodes[0])
  }

  var res = ev.target.value.split(",");
  for (date in res)
  {
    var new_str = res[date].trim();
    if (new_str in data)
    {
      var dateMatchFile = data[new_str];
      for (date in dateMatchFile) {
        //console.log('date : ', dateMatchFile[date])
        createLi(dateMatchFile)
      }
      createDataTable(dateMatchFile)
    }
    else {
      gridOptions.api.setRowData([]);
    }
  }
};

// create list of file from date
function createLi(dateMatchFile) {
  var fileLi = document.createElement("LI");
  var fileText = document.createTextNode(dateMatchFile[date]);
  fileLi.appendChild(fileText)
  document.getElementById("file").appendChild(fileLi)
}

function createDataTable(datas) {
// datas => list of files
  for (file in datas) {
    callApiFile(datas[file])
  }
}

// fill data in ag-grid
function callApiFile(file) {
  gridOptions.api.setRowData([]);
  fetch(host + "file/" + file + "").then(function(response) {
    return response.json();
  }).then(function(data) {
    // set the filename in each elem of data
  for (elem in data) {
    data[elem]['filename'] = String(file)
  }
    gridOptions.api.updateRowData({add: data});
  })
}

function deleteAll()
{
  var calendar = document.getElementById("tFuse");
  const fp = flatpickr(calendar,
    {
      locale: "fr",
      inline: true,
      mode: "multiple",
      enable: dateArray,
      onYearChange: function(selectedDates, dateStr, instance)
      {
        year = this.currentYear
      },
      onMonthChange: function(selectedDates, dateStr, instance)
      {
        currentMonth = fp.currentMonth
      },
      onReady: function(selectedDates, dateStr, instance)
      {
        gridOptions.api.setRowData([]);
        var list = document.getElementById("file")
        var size = list.childElementCount
        for (var i = 0; i < size; i++) {
          list.removeChild(list.childNodes[0])
        }

        var list2 = document.getElementById("infos")
        var size2 = list2.childElementCount
        for (var j = 0; j < size2; j++) {
          list2.removeChild(list2.childNodes[0])
        }
      },
   });
   // get back month && year we where when delete all
   fp.changeMonth(currentMonth, false)
   fp.changeYear(year, false)
}

function selectAllYear()
{
  var calendar = document.getElementById("tFuse");
  const fp = flatpickr(calendar,
    {
      locale: "fr",
      inline: true,
      mode: "multiple",
      enable: dateArray,
      onYearChange: function(selectedDates, dateStr, instance)
      {
        //year = this.currentYear
      },
      onMonthChange: function(selectedDates, dateStr, instance)
      {
        //currentMonth = fp.currentMonth
      },
      onReady: function(selectedDates, dateStr, instance)
      {
        var res = dateStr.split(",");
        for (date in res) {
          var new_str = res[date].trim()
          if (new_str in data) {
            var dateMatchFile = data[new_str]
            for (date in dateMatchFile) {
              createLi(dateMatchFile)
            }
            createDataTable(dateMatchFile)
          }
        }
     },
   });
   var i = 1;
   var maxDate = 31
   var allYearArray = new Array()

   while (i <= 12)
   {
     var j = 1
     while (j <= maxDate)
     {
       allYearArray.push("" + j + "/" + i + "/" + year + "")
       j++;
     }
    i++;
   }
   fp.setDate(allYearArray, true, "d/m/Y")
}

function selectAll()
{
  var calendar = document.getElementById("tFuse");
  const fp = flatpickr(calendar,
    {
      locale: "fr",
      inline: true,
      mode: "multiple",
      enable: dateArray,
      defaultDate: dateArray,
      onYearChange: function(selectedDates, dateStr, instance)
      {
        //year = this.currentYear
      },
      onMonthChange: function(selectedDates, dateStr, instance)
      {
        //currentMonth = fp.currentMonth
      },
      onReady: function(selectedDates, dateStr, instance)
      {
        // currentMonth = this.currentMonth
        // year = this.currentYear

        var res = dateStr.split(",");
        for (date in res) {
          var new_str = res[date].trim()
          if (new_str in data) {
            var dateMatchFile = data[new_str]
            for (date in dateMatchFile) {
              createLi(dateMatchFile)
            }
            createDataTable(dateMatchFile)
          }
          else {
            gridOptions.api.setRowData([]);
          }
        }
     },
   });
}

function selectAllMonth()
{
  var calendar = document.getElementById("tFuse");
  const fp = flatpickr(calendar,
    {
      locale: "fr",
      inline: true,
      mode: "multiple",
      enable: dateArray,
      onYearChange: function(selectedDates, dateStr, instance)
      {
        year = this.currentYear
      },
      onMonthChange: function(selectedDates, dateStr, instance)
      {
        currentMonth = fp.currentMonth
      },
   });
   var day = 1
   var i = 0
   var monthArray = new Array()
   var maxDate = 31
   if ((currentMonth + 1) == 2) {
     maxDate = 27
   }
   if ((currentMonth + 1) == 11) {
     maxDate = 29
   }
   while (i <= maxDate)
   {
     monthArray.push("" + day + "/" + (currentMonth + 1) + "/" + year + "")
     i++;
     day++;
   }
   fp.setDate(monthArray, true, "d/m/Y")
}
