$(document).ready(function () {

  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

});
// Date picker
// $(function() {
//   $('input[name="daterange"]').daterangepicker({
//     opens: 'left',
//     drops: 'down',
//     endDate: moment().startOf('hour'),
//     startDate: moment().startOf('hour').subtract(5, 'day'),
//   }, function(start, end, label) {
//     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
//     let from  = start.format('YYYY-MM-DD');
//     let to = end.format('YYYY-MM-DD')
//     plotDataBetween(sensor, from, to);
//   });
// });