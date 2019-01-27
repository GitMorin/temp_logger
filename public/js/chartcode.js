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
        distribution: 'linear', 
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
let current_temp;
let beer_list;
let displaying_beer

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

// Populate beer list to dropdown
fetch('/api/beerlist')
.then(function(response){
  return response.json();
})
.then(function(beerList) {
  // set global beer_list variable
  beer_list = beerList
  latestBeer = getLatestStartedBeer(beerList);
  // set latest beer to global
  displaying_beer = latestBeer;
  updateBeerTitle(latestBeer);

  fermentTo = getEndFermentationDate(latestBeer);
  plotDataBetween(latestBeer.sensor, latestBeer.start_ferment, fermentTo);
  
  // set target temp for latest beer
  temp_target[0].y = latestBeer.target_temp;
  temp_target[1].y = latestBeer.target_temp;
  temp_target[0].x = latestBeer.start_ferment;
  temp_target[1].x = fermentTo;

  // Append beer to dropdown list
  beerList.forEach(beer => {
    let beerList = document.getElementById("beer-list");
    //const icon = document.createElement('i');
    const beerElement = document.createElement('a');

    beerElement.setAttribute("class", "dropdown-item");
    beerElement.setAttribute("href", "#");
    beerElement.setAttribute("beer", beer.name);
    beerElement.innerHTML = beer.name;

    if (beer.is_active == true) {
      beerElement.innerHTML = beer.name + ' ' +'<i class="fas fa-flask"></i>';
    } else {
      beerElement.innerHTML = beer.name + ' ' +'<i class="fas fa-beer"></i>';
    }

    beerElement.addEventListener('click', function(e){
      let beer_clicked = e.target.getAttribute("beer");
      // set global variable with the beer to display
      displaying_beer = getBeerObject(beer_clicked);
      updateBeerTitle(displaying_beer);
      fermentTo = getEndFermentationDate(displaying_beer);
      temp_target[0].y = displaying_beer.target_temp;
      temp_target[1].y = displaying_beer.target_temp;
      temp_target[0].x = displaying_beer.start_ferment;
      temp_target[1].x = fermentTo;
      plotDataBetween(displaying_beer.sensor, displaying_beer.start_ferment, fermentTo);
    })
    beerList.appendChild(beerElement);
  });
});

function getLatestStartedBeer(beerList) {
  latestBeer = beerList.reduce(function (r, a) {
    return r.date > a.date ? r : a;
  });
  return latestBeer;
};

function getEndFermentationDate(beer){
  if (beer.end_ferment == null) {
    return moment().format('YYYY-MM-DD HH:mm');
  } else {
    return beer.end_ferment;
  }
};

// Find object in beer list with beer name of X. Returning object
function getBeerObject(beerName) {
  let beer = beer_list.filter(function(beer){
    return beer.name === beerName;
  });
  return beer[0];
};

function updateBeerTitle(beer) {
  let currentBeer = document.querySelector("#current-beer strong");
  if (beer.is_active === true) {
    currentBeer.textContent = ` ${beer.name} - Currently fermenting`;
  } else {
    currentBeer.textContent = ` ${beer.name} - Is complete`;
  }
}

// If beer does not have end fermentation date yet (due to active fermentation) 
// Instead use current time to call the getDataBwetween(dates) function that will be used in graph
function getFermentationDates(beer) {
  if (beer.end_ferment == null) {
    fermentTo = moment().format('YYYY-MM-DD HH:mm');
  } else {
    fermentTo = beer.end_ferment;
  }
  // getDataBetween(beer.start_ferment, fermentTo);
  // update temp_target object with target temp for beer
  temp_target[0].y = beer.target_temp;
  temp_target[1].y = beer.target_temp;

}

function plotDataBetween(sensor, from, to){
  //myLineChart.data.datasets.pop(temp_room);
  myLineChart.data.datasets.pop(temp_beer);
  myLineChart.data.datasets.pop(temp_outdoor);
  myLineChart.data.datasets.pop(temp_target);
  // fetch('/api/temp/room/' + from + '/' + to)
  // .then(function(response) {
  //   return response.json();
  // })
  // .then(function(data) {
  //   dataset = {
  //     fill: true,
  //     label: 'Room temp',
  //     data: data,
  //     borderColor: 'rgba(51, 42, 207, 0.3)',
  //     backgroundColor: 'rgba(51, 42, 207, 0.10)',
  //     pointRadius: .8,
  //     borderWidth: .5,
  //     pointHitRadius: 7.5,
  //   };
  //   myLineChart.data.datasets.push(dataset);
  //   myLineChart.update();
  // });
  
  fetch('/api/temp/beer/' + sensor + '/' + from + '/' + to)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // sort data by date if it comes out wrong from the db
    data.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.x) - new Date(b.x);
    });
    //console.log(sorted);
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
    
    current_temp = data[data.length -1].y;
    const currentTemp = document.getElementById("current-temp");
    if (displaying_beer.is_active == true) {
      //currentTemp.textContent = current_temp + ' C';
      currentTemp.textContent =  `@ ${current_temp} C`;
    } else {
      currentTemp.textContent = '';
    }
    // set date on temp target temp target
    // temp_target[0].x = data[0].x;
    // temp_target[1].x = data[data.length -1].x;
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

function drawTargetTemp() {

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