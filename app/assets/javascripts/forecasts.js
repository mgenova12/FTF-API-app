  document.addEventListener("DOMContentLoaded", function(event) { 
  var app = new Vue({
    el: '#app',
    data: {
      temp: 0

    },
    mounted: function() {
      $.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22newyork%2C%20ny%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function(response) {
        this.temp = response.query.results.channel.item.condition.temp
        console.log(response.query.results.channel) //all

        var parameters = {
          temp: this.temp
        };

        $.post('/forecasts', parameters, function(response) { 
          console.log(response);
        }.bind(this));

      }.bind(this));

    }//end mounted
      



  });

});