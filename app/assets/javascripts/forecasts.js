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
    mounted: function() { 
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

        this.updateForecasts(); // checks if data is updated immediately on page load
        setInterval(this.updateForecasts, 5*60*1000); // checks if data is updated every 5 minutes

      }.bind(this));
    },
    methods: {
      updateForecasts: function(){ 
        $.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22newyork%2C%20%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function(yahooResponse){
          $.get('/api/v1/forecasts',function(apiResponse1){
          if (apiResponse1[apiResponse1.length-1].time == yahooResponse.query.results.channel.item.pubDate){ 
            this.currentTemp = parseInt(yahooResponse.query.results.channel.item.condition.temp);
            // this.location = yahooResponse.query.results.channel.location.city;
            // this.currentTime = yahooResponse.query.results.channel.item.pubDate;

            var parameters = {
              temp: this.currentTemp,
              location: yahooResponse.query.results.channel.location.city,
              pubdate: yahooResponse.query.results.channel.item.pubDate
            };

            $.post('/forecasts', parameters, function(forcastResponse){ 
            
              $.get('/api/v1/forecasts',function(apiResponse){
                this.apiData = apiResponse.reverse();
                this.currentTime = apiResponse[0].time;
                this.chartTemps.push(parseInt(apiResponse[0].temp)); 
                this.location = apiResponse[0].location;         
                this.chartTimes.push(new Date(apiResponse[0].time).toLocaleString());
                
                while(chart.series.length > 0){
                  chart.series[0].remove(true);
                }

                chart.addSeries({
                  name: this.location,
                  data: this.chartTemps,
                })
              
              }.bind(this));

            }.bind(this));

            this.chartTimes = chart.xAxis[0].categories; //adds chart times to graph
          }
        }.bind(this))
        }.bind(this)); 
      }
    }

  });

  var chart = Highcharts.chart('container', {
      chart: {
          type: 'line',
          backgroundColor: null
      },
      title: {
          text: 'Hourly Temperature'
      },
      subtitle: {
          text: 'Source: Yahoo.com'
      },
      xAxis: {
          categories: [],
          lineColor: '#666666',
          tickColor: '#666666'
      },
      yAxis: {
        gridLineColor: '#666666',
          title: {
              text: 'Temperature (°F)'
          }
      },
      plotOptions: {
        series: {
            color: 'rgb(244, 91, 91)' 
        },
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: true
        }
      },
      series: []
  });

});
