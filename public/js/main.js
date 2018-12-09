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

fetch('/temp/room')
.then(function(response) {
  return response.json();
})
.then(function(data) {
  temp_room = data
  dataset = {
    fill: true,
    label: 'Room temp',
    data: temp_room,
    borderColor: 'rgba(51, 42, 207, 0.3)',
    backgroundColor: 'rgba(51, 42, 207, 0.10)',
    pointRadius: .8,
    borderWidth: .5,
    pointHitRadius: 7.5,
  };
  myLineChart.data.datasets.push(dataset);
  myLineChart.update();
});

fetch('/temp/beer')
.then(function(response) {
  return response.json();
})
.then(function(data) {
  temp_beer = data
  dataset = {
    fill: false,
    label: 'Beer temp',
    data: temp_beer,
    borderColor: 'rgba(207, 108, 42, 0.75)',
    backgroundColor: 'rgba(161, 84, 33, 0.75)',
    pointRadius: 1,
    borderWidth: 1.5,
    pointHitRadius: 7.5
  };
  myLineChart.data.datasets.push(dataset);
  myLineChart.update();
  let current_temp = temp_beer[temp_beer.length -1].y;
  console.log(current_temp);
  //let current_temp = document.getElementById('current_temp');
  document.getElementById('current-temp').innerHTML = `Current temp: ${current_temp}`;
});

fetch('/temp/outdoor')
.then(function(response) {
  return response.json();
})
.then(function(data) {
  temp_outdoor = data
  dataset = {
    fill: true,
    label: 'Outdoor temp',
    data: temp_outdoor,
    borderColor: 'rgba(62, 161, 12, 0.9)',    
    backgroundColor: 'rgba(62, 161, 12, 0.1)',
    pointRadius: 0,
    borderWidth: 1.75,
    pointHitRadius: 7.5
  };
  myLineChart.data.datasets.push(dataset);
  myLineChart.update();
});



function getDataBetween(from, to){
  myLineChart.data.datasets.pop(temp_room);
  myLineChart.data.datasets.pop(temp_beer);
  myLineChart.data.datasets.pop(temp_outdoor);
  fetch('/temp/room/' + from + '/' + to)
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

  fetch('/temp/beer/' + from + '/' + to)
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

    myLineChart.data.datasets.push(dataset);
    myLineChart.update();
  });

  fetch('/temp/outdoor/' + from + '/' + to)
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
    opens: 'right',
    drops: 'up',
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