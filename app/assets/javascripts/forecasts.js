  document.addEventListener("DOMContentLoaded", function(event) { 
  var app = new Vue({
    el: '#app',
    data: {
      apiData: [],
      currentTemp: 0,
      currentTime: '',
      location: '',
      chartTemps: [],
      chartTimes: []
    },
    mounted: function() { //on refresh it should bring up all current data on the api 
      $.get('/api/v1/forecasts',function(response){
        if (response.length > 0){
          this.apiData = response.reverse();  
          this.currentTime = response[0].time;  
          this.currentTemp = response[0].temp;  
          this.location = response[0].location;         
          this.chartTimes = chart.xAxis[0].categories;

          for(i=0; i<response.length; i++){
            this.chartTemps.unshift(parseInt(response[i].temp));          
            this.chartTimes.unshift(new Date(response[i].time).toLocaleString());
          }

          if (chart.series.length > 0){
            chart.series[0].remove(true);
          } else {
            chart.addSeries({
              name: this.location,
              data: this.chartTemps
            })
          }

        }

        setInterval(this.updateForecasts,10000) // on refresh checks updateForcast every 10 sec

      }.bind(this));

    },//end mounted
    methods: {
      updateForecasts: function(){ 
        $.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22newyork%2C%20%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function(response) {
          if (this.currentTime != response.query.results.channel.item.pubDate){
            this.currentTemp = parseInt(response.query.results.channel.item.condition.temp);
            this.location = response.query.results.channel.location.city
            this.currentTime = response.query.results.channel.item.pubDate

            var parameters = {
              temp: this.currentTemp,
              location: this.location,
              pubdate: this.currentTime
            };

            $.post('/forecasts', parameters, function(response) { 
            
              $.get('/api/v1/forecasts',function(response){
                this.apiData = response.reverse();
                this.currentTime = response[response.length-1].time;           
                this.chartTemps.push(parseInt(response[response.length-1].temp)); 
                this.location = response[response.length-1].location;         
                this.chartTimes.push(new Date(response[response.length-1].time).toLocaleString());
                
                while(chart.series.length > 0){
                  chart.series[0].remove(true);
                }

                chart.addSeries({
                  name: this.location,
                  data: this.chartTemps
                })
              
              }.bind(this));

            }.bind(this));

            this.chartTimes = chart.xAxis[0].categories
          }
        }.bind(this));  
        
      }//end updateForecasts

    }//end methods

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

});//end document

