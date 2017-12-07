// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
// -- Bar Chart Example
$(document).ready(function () {
  var timeData=[],
      CO2Data=[],
      VOCData=[];
  var data= {
    labels: timeData,
    datasets: [{
      label: "C02Average",
      backgroundColor: "rgba(2,117,216,1)",
      borderColor: "rgba(2,117,216,1)",
      data: CO2Data,
    },
    {
      label: "VOCAverage",
      backgroundColor: "rgba(24, 120, 240, 0.4)",
      borderColor: "rgba(24, 120, 240, 0.4)",
      data: VOCData,
    }],
  }

var ctx = document.getElementById("BarChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 1000,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
var CO2count=0;
var VOCcount=0;
var CO2sum=0;
var VOCsum=0;
var CO2=0;
var VOC=0;
var CO2allsum=0;
var VOCallsum=0;
var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket1');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.TVOC) {
        return;
      }
      CO2 += obj.eCO2;
      VOC += obj.TVOC;
      CO2allsum++;
      VOCallsum++;
      console(CO2);
      console(VOC);
      console(CO2allsum);
      console(VOCallsum);
      var y=document.getElementById("C02Average");  //查找元素
        y.innerHTML = CO2/CO2allsum;
      var z=document.getElementById("VOCAverage");  //查找元素
        z.innerHTML = VOC/VOCallsum;
      CO2count++;
      CO2sum =CO2sum+obj.eCO2;
      VOCcount++;
      VOCsum= VOCsum +obj.TVOC;
      if(CO2count==0){
        timeData.push(obj.time);
      CO2Data.push(obj.eCO2);
      VOCData.push(obj.TVOC);
      }else{
      CO2Data.pop();
      CO2Data.push(CO2sum/CO2count);
      VOCData.pop();
      VOCData.push(VOCsum/VOCcount);
      }
      if(CO2count>=13){
        timeData.push(obj.time);
        CO2Data.push(obj.eCO2);
        VOCData.push(obj.TVOC);
        CO2count=1;
        VOCcount=1;
        CO2sum=obj.eCO2;
        VOCsum=obj.TVOC;
      }
      // only keep no more than 50 points in the line chart

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});

