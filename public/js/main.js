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
          format: timeFormat,
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'value'
        }
      }]
    },
  }
});

// Global chart options

fetch('http://localhost:3000/temp/room')
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

fetch('http://localhost:3000/temp/beer')
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

fetch('http://localhost:3000/temp/outdoor')
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



// function getDataBetween(){
//   myLineChart.data.datasets.pop(data);
// }

//   fetch('http://localhost:3000/temp/room')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     dataset = {
//       fill: true,
//       label: 'Room temp',
//       data: data,
//       borderColor: 'rgba(51, 42, 207, 0.3)',
//       backgroundColor: 'rgba(51, 42, 207, 0.10)',
//       pointRadius: .8,
//       borderWidth: .5,
//       pointHitRadius: 7.5,
//     };
//     myLineChart.data.datasets.push(dataset);
//     myLineChart.update();
//   });

//   fetch('http://localhost:3000/temp/beer')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     dataset = {
//       fill: false,
//       label: 'Beer temp',
//       data: data,
//       borderColor: 'rgba(207, 108, 42, 0.75)',
//       backgroundColor: 'rgba(161, 84, 33, 0.75)',
//       pointRadius: 1,
//       borderWidth: 1.5,
//       pointHitRadius: 7.5
//     };
//     myLineChart.data.datasets.push(dataset);
//     myLineChart.update();
//   });

//   fetch('http://localhost:3000/temp/outdoor')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     dataset = {
//       fill: true,
//       label: 'Outdoor temp',
//       data: data,
//       borderColor: 'rgba(62, 161, 12, 0.9)',    
//       backgroundColor: 'rgba(62, 161, 12, 0.1)',
//       pointRadius: 0,
//       borderWidth: 1.75,
//       pointHitRadius: 7.5
//     };
//     myLineChart.data.datasets.push(dataset);
//     myLineChart.update();
//   });
// };

// $(function() {
//   $('input[name="daterange"]').daterangepicker({
//     opens: 'right',
//     drops: 'up',
//   }, function(start, end, label) {
//     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
//     getDataBetween();
//   });
// });

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