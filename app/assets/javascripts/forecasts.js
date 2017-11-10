  document.addEventListener("DOMContentLoaded", function(event) { 
  var app = new Vue({
    el: '#app',
    data: {
      apiData: null,
      currentTemp: 0,
      currentTime: '',
      location: '',
      chartTemps: [],
      chartTimes: []
    },
    mounted: function() { //on refresh it should bring up all current data on the api 
        
      $.get('/api/v1/forecasts',function(response){
        this.apiData = response.reverse();
        this.currentTime = response[response.length-1].time;  
        this.location = response[response.length-1].location;         
        this.chartTimes = chart.xAxis[0].categories
        for(i=0; i<response.length; i++){
          this.chartTemps.unshift(parseInt(response[i].temp));          
          this.chartTimes.unshift(new Date(response[i].time));
        }
        while(chart.series.length > 0){
          chart.series[0].remove(true);
        }
        chart.addSeries({
          name: this.location,
          data: this.chartTemps
        })
      }.bind(this));

    },//end mounted
    methods: {
      updateForecasts: function(){ // on fucntion it should make post request to api
        $.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22newyork%2C%20%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function(response) {
          this.currentTemp = parseInt(response.query.results.channel.item.condition.temp);
          this.location = response.query.results.channel.location.city
          console.log(response.query.results.channel) //all
          
        var parameters = {
          temp: this.currentTemp,
          location: this.location
        };

        $.post('/forecasts', parameters, function(response) { 
        
          $.get('/api/v1/forecasts',function(response){
            this.currentTime = response[response.length-1].time;           
            this.chartTemps.push(parseInt(response[response.length-1].temp));          
            this.chartTimes.push(new Date(response[response.length-1].time));
            this.apiData = response.reverse();
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

      }.bind(this));  

      } //end updateForecasts

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



});// end document
