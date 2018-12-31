var ctx = document.getElementById("myChart").getContext('2d');
let timeFormat = 'YYYY/MM/DD HH:mm:ss';

var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets:[],
  },
  options: {
    title: {
      text: 'Chart.js Time Scale'
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          parser: timeFormat,
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }],
      yAxes: [{
        position: 'right',
        ticks: {
          beginAtZero: false,
          max: 25,
          min: 5,
          stepSize: 5
        },
        scaleLabel: {
          display: true,
          labelString: 'Temp C',
        }
      },
      {
        position: 'left',
        ticks: {
          beginAtZero: false,
          max: 25,
          min: 5,
          stepSize: 5
        },
        scaleLabel: {
          display: true,
          labelString: 'Temp C',
        }
      }
      ]
    },
  }
});

let temp_room =null;
let temp_beer =null;
let temp_outdoor =null;
let beer_list = null;

// function targetTemp(date, temp) {
//   this.x = date;
//   this.y = temp;
// }
// var temp_target = new targetTemp(, );

// Template to be used for target temperature, can probably be made smarter
let temp_target = [{
  x: '',
  y: 20
}, {
  x: '',
  y: 20
}];

// Find object in beer list with beer name of X. Returning object
function beerinfo(beerName) {
  let beerObj = beer_list.filter(function(beer){
    return beer.name === beerName;
  })[0];
  console.log(beerObj);
  getFermentationDates(beerObj);
};

// Check if beer is in active fermentation. If more than one beer is active return the latest one
function findAndAddActiveBeer(beerlist) {
  let activeBeers = beerlist.filter(function(beer){
    return beer.is_active === true
  });
  orderedBeer = activeBeers.sort(function(a,b){
    return Date.parse(b.start_ferment) - Date.parse(a.start_ferment);
  });
  getFermentationDates(orderedBeer[0])
}

// If beer does not have end fermentation date yet (due to active fermentation) 
// Instead use current time to call the getDataBwetween(dates) function that will be used in graph
function getFermentationDates(beer) {
  if (beer.end_ferment == null) {
    fermentTo = moment().format('YYYY-MM-DD HH:mm');
  } else {
    fermentTo = beer.end_ferment;
  }
  getDataBetween(beer.start_ferment, fermentTo);
  temp_target[0].y = beer.target_temp;
  temp_target[1].y = beer.target_temp;
}


// Populate beer list to dropdown
fetch('/api/beerlist')
.then(function(response){
  return response.json();
})
.then(function(beerlist) {
  findAndAddActiveBeer(beerlist);
  beer_list = beerlist;
  beerlist.forEach(beer => {
    // Append beer to dropdown list
    let beerList = document.getElementById("beer-list");
    const beerElement = document.createElement('a');
    beerElement.setAttribute("class", "dropdown-item");
    beerElement.setAttribute("href", "#");
    beerElement.textContent = beer.name;
    beerElement.addEventListener('click', function(e){
      let beer_clicked = e.target.innerText
      beerinfo(beer_clicked);
    })
    beerList.appendChild(beerElement);
  });
});

function drawTargetTemp(data) {
  // Set Target temp object
  temp_target[0].x = data[0].x;
  temp_target[1].x = data[data.length -1].x;

  targetDataset = {
    fill: false,
    label: 'Target Temp',
    data: temp_target,
    borderColor: 'rgba(255,0,0)',
    backgroundColor: 'rgba(255,0,0,0)',
    pointRadius: 0,
    borderWidth: 1,
    pointHitRadius: 0,
  };
  myLineChart.data.datasets.push(targetDataset);
  myLineChart.update();
}

function getDataBetween(from, to){
  myLineChart.data.datasets.pop(temp_room);
  myLineChart.data.datasets.pop(temp_beer);
  myLineChart.data.datasets.pop(temp_outdoor);
  myLineChart.data.datasets.pop(temp_target);
  fetch('/api/temp/room/' + from + '/' + to)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    dataset = {
      fill: true,
      label: 'Room temp',
      data: data,
      borderColor: 'rgba(51, 42, 207, 0.3)',
      backgroundColor: 'rgba(51, 42, 207, 0.10)',
      pointRadius: .8,
      borderWidth: .5,
      pointHitRadius: 7.5,
    };
    myLineChart.data.datasets.push(dataset);
    myLineChart.update();
  });
  
  fetch('/api/temp/beer/' + from + '/' + to)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    dataset = {
      fill: false,
      label: 'Beer temp',
      data: data,
      borderColor: 'rgba(207, 108, 42, 0.75)',
      backgroundColor: 'rgba(161, 84, 33, 0.75)',
      pointRadius: 1,
      borderWidth: 1.5,
      pointHitRadius: 7.5
    };
    
    drawTargetTemp(data);
    myLineChart.data.datasets.push(dataset);
    myLineChart.update();
  });
  
  fetch('/api/temp/outdoor/' + from + '/' + to)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    dataset = {
      fill: true,
      label: 'Outdoor temp',
      data: data,
      borderColor: 'rgba(62, 161, 12, 0.9)',    
      backgroundColor: 'rgba(62, 161, 12, 0.1)',
      pointRadius: 0,
      borderWidth: 1.75,
      pointHitRadius: 7.5
    };
    myLineChart.data.datasets.push(dataset);
    myLineChart.update();
  });
};

$(function() {
  $('input[name="daterange"]').daterangepicker({
    opens: 'left',
    drops: 'down',
    endDate: moment().startOf('hour'),
    startDate: moment().startOf('hour').subtract(5, 'day'),
  }, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    let from  = start.format('YYYY-MM-DD');
    let to = end.format('YYYY-MM-DD')
    getDataBetween(from, to);
  });
});

let exampleData = [{
    x: '2018-12-06 03:00:00',
    y: 19
}, {
    x: '2018-12-06 10:00:00',
    y: 40
}, {
    x: '2018-12-06 23:00:00',
    y: 0
},{
    x: '2018-12-07 02:10:00',
    y: 12
}, {
    x: '2018-12-08 00:00:00',
    y: 1
}, {
    x: '2018-12-09 00:00:00',
    y: 7
},{
    x: '2018-12-09 12:00:00',
    y: 10
},{
    x: '2018-12-09 20:00:00',
    y: 15
},{
    x: '2018-12-10 19:00:00',
    y: 9
}];