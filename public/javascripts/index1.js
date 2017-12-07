
$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'CO2',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'VOC',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'CO2 & VOC Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'CO2',
        type: 'linear',
        scaleLabel: {
          labelString: 'CO2',
          display: true
        },
        position: 'left',
      }, {
          id: 'VOC',
          type: 'linear',
          scaleLabel: {
            labelString: 'VOC',
            display: true
          },
          position: 'right'
        }]
    }
  }
  
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.TVOC) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.TVOC);
      var y=document.getElementById("co2_value");  //查找元素
        y.innerHTML = obj.eCO2;
      var z=document.getElementById("voc_value");  //查找元素
        z.innerHTML = obj.TVOC;
      var q=document.getElementById("fall_value");  //查找元素
        q.innerHTML = obj.isFall;
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.eCO2) {
        humidityData.push(obj.eCO2);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
