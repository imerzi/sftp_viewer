
// specify the columns for datatable
var columnDefs = [
{headerName: "Matricule", field: "\ufeffPerson ID", filter: 'agTextColumnFilter', width: 100, headerCheckboxSelection: true, checkboxSelection: true,},
{headerName: "Nom", field: "Last Name", filter: 'agTextColumnFilter', width: 130},
{headerName: "Prénom", field: "First Name", filter: 'agTextColumnFilter', width: 150},
{headerName: "Base", field: "Base", filter: 'agTextColumnFilter', width: 100},
{headerName: "Travail", field: "Job Title", filter: 'agTextColumnFilter', width: 110},
{headerName: "Type d'évenement", field: "Event", filter: 'agTextColumnFilter'},
{headerName: "File", field: "filename", filter: 'agTextColumnFilter', width: 230}
];

// let the grid know which columns and what data to use
var gridOptions = {
rowSelection: 'multiple',
suppressRowClickSelection: true,
enableFilter: true,
columnDefs: columnDefs,
onRowClicked: onRowClicked,
isExternalFilterPresent: isExternalFilterPresent,
doesExternalFilterPass: doesExternalFilterPass,
rowMultiSelectWithClick: true,
 localeText: {
  loadingOoo: 'Chargement...',
  noRowsToShow: 'Aucun colonne a afficher',
},
rowClassRules: {
  'colorEventHire': function(params) { return params.data.Event === "H"},
  'colorEventRehire': function(params) { return params.data.Event === "R"},
  'colorEventCancel': function(params) { return params.data.Event === "26"},
  'colorEventChange': function(params) { return params.data.Event != 'H' && params.data.Event != "R" && params.data.Event != "26"}
  }
};

// input search ag-grid
function onFilterTextBoxChanged() {
    gridOptions.api.setQuickFilter(document.getElementById('filter-text-box').value);
}

// define eventType to all by default
var eventType = 'all';

function isExternalFilterPresent() {
    // if eventType is not all, then we are filtering
    return eventType != 'all';
}

// function of filtering for eventType
function doesExternalFilterPass(node) {
    switch (eventType) {
        case 'hire': return node.data.Event == 'H';
        case 'rehire': return node.data.Event == "R";
        case 'cancel': return node.data.Event == "26";
        case 'change': return node.data.Event != 'H' && node.data.Event != "R" && node.data.Event != "26"
        default: return true;
    }
}

// apply change of filtering
function externalFilterChanged(newValue) {
    eventType = newValue;
    gridOptions.api.onFilterChanged();
}

// event when clicked on row (ag-grid)
function onRowClicked(event) {
  var j = 0;
  fetch(host + "order").then(function(response) {
    return response.json();
  }).then(function(data) {
    var list = document.getElementById("infos");
    var size = list.childElementCount;
    for (var i = 0; i < size; i++) {
      list.removeChild(list.childNodes[0])
    }
    for (key in data)
    {
      for (elem in event.node.data)
      {
        if (elem === data[key]) {
          // left elem create (LABEL)
          var leftElem = document.createElement("div");
          leftElem.className = "col-md-5 my-label my-color"
          leftElem.id = "key-"+j
          var valueText2 = document.createTextNode(elem);
          leftElem.appendChild(valueText2)
          document.getElementById("infos").appendChild(leftElem)

          // copy inner div to clickboard
          leftElem.addEventListener( 'click', function() {
          var number_id = this.id.split("-")
          var value_id = "value-" + number_id[1]
          document.getElementById(value_id).classList.add("color-onclick")
          // Create a new textarea element and give it id='temp_element'
          var textarea = document.createElement('textarea')
          textarea.id = 'temp_element'
          // Optional step to make less noise on the page, if any!
          textarea.style.height = 0
          // Now append it to the page
          document.body.appendChild(textarea)
          // Give our textarea a value of whatever inside the div of id=containerid
          textarea.value = document.getElementById(value_id).innerText
          // Now copy whatever inside the textarea to clipboard
          var selector = document.querySelector('#temp_element')
          selector.select()
          document.execCommand('copy')
          // Remove the textarea
          document.body.removeChild(textarea)
          setTimeout(function() {
              document.getElementById(value_id).classList.remove("color-onclick")
            }, 1500);
          });

          // right elem create (VALUE)
          var rightElem = document.createElement("div");
          rightElem.className = "col-md-6 my-value my-color"
          rightElem.id = "value-"+j
          var valueText = document.createTextNode(event.node.data[elem])
          rightElem.appendChild(valueText)
          document.getElementById("infos").appendChild(rightElem)

          // copy inner div to clickboard
          rightElem.addEventListener( 'click', function() {
          var id = this.id
          this.classList.add("color-onclick")
          // Create a new textarea element and give it id='temp_element'
          var textarea = document.createElement('textarea')
          textarea.id = 'temp_element1'
          // Optional step to make less noise on the page, if any!
          textarea.style.height = 0
          // Now append it to the page
          document.body.appendChild(textarea)
          // Give our textarea a value of whatever inside the div of id=containerid
          textarea.value = document.getElementById(this.id).innerText
          // Now copy whatever inside the textarea to clipboard
          var selector = document.querySelector('#temp_element1')
          selector.select()
          document.execCommand('copy')
          // Remove the textarea
          document.body.removeChild(textarea)
          setTimeout(function() {
              document.getElementById(id).classList.remove("color-onclick")
            }, 1500);
          });
          j++;
        }
      }
    }

// check change in files and salaries if somes add class .salarie-changes //
if (event.node.data.Event != 'H' && event.node.data.Event != "R" && event.node.data.Event != "26") {
    fetch(host + "salarie/" + event.node.data["\ufeffPerson ID"]).then(function(response) {
      return response.json();
    }).then(function(data) {

      var file
      var salarie

      if (data["error"]) {
        alert(data["error"])
      } else {
        for (key in data) {
          for (elem in event.node.data) {
            if (elem == key) {
              file = event.node.data[elem].toLowerCase()
              salarie = data[key].toLowerCase()
              if (file != salarie) {
                var list = document.getElementById("infos");
                var size = list.childElementCount;
                for (var i = 0; i < size; i++) {
                  if (file == list.childNodes[i].innerHTML.toLowerCase()) {
                    list.childNodes[i].className += " salarie-changes"
                  }
                }
              }
            }
          }
        }

      }
    })
  }
  })
}

function convertToCSV(objArray, listIndex) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

        for (var i = 0; i < array.length; i++) {
          var line = '';
          for (key in listIndex) {
            if (line != '') line += '\t'
            var index = listIndex[key]
            if (array[i][index]) {
              line += array[i][index];
            }
            if (array[i][index] == null)
            {
              line += " "
            }
          }
          str += line + '\r\n';
        }
    return str;
}

function exportCSVFile(items, fileTitle, listIndex)
{
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject, listIndex);
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function download()
{
  var itemsFormatted = gridOptions.api.getSelectedRows();
  var fileTitle = 'export';

  if (itemsFormatted.length != 0) {
    fetch(host + "order").then(function(response) {
      return response.json();
    }).then(function(listIndex) {
      // call the exportCSVFile() function to process the JSON and trigger the download
      exportCSVFile(itemsFormatted, fileTitle, listIndex);
    })
  }
  else if (itemsFormatted.length == 0)
  {
    // get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block"

    span.onclick = function() {
      modal.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.columnApi.setColumnVisible('Event', false);
});
