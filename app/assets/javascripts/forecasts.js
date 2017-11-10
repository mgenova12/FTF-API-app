  document.addEventListener("DOMContentLoaded", function(event) { 
  var app = new Vue({
    el: '#app',
    data: {
      currentTemp: 0,
      location: '',
      chartTemps: [],
      chartTime: []
    },
    mounted: function() {
      $.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22newyork%2C%20%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function(response) {
          this.currentTemp = parseInt(response.query.results.channel.item.condition.temp);
          this.location = response.query.results.channel.location.city
          console.log(response.query.results.channel) //all
          console.log(this.currentTemp)
          
        var parameters = {
          temp: this.currentTemp,
          location: this.location
        };

        $.post('/forecasts', parameters, function(response) { 
        
          $.get('/api/v1/forecasts',function(response){
            for(i=0; i<response.length; i++){
              this.chartTemps.push(parseInt(response[i].temp));          
              this.chartTime.push(new Date(response[i].time));          
            }

            chart.addSeries({
              name: this.location,
              data: this.chartTemps
            })

          }.bind(this));

        }.bind(this));

      this.chartTime = chart.xAxis[0].categories

      }.bind(this));


    }//end mounted
      
  });//end vue

  var chart = Highcharts.chart('container', {
      chart: {
          type: 'line'
      },
      title: {
          text: 'Hourly Temperature'
      },
      subtitle: {
          text: 'Source: Yahoo.com'
      },
      xAxis: {
          categories: []
      },
      yAxis: {
          title: {
              text: 'Temperature (°F)'
          }
      },
      plotOptions: {
          line: {
              dataLabels: {
                  enabled: true
              },
              enableMouseTracking: false
          }
      },
      series: []
  });



});// end document
