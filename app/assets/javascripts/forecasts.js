  document.addEventListener("DOMContentLoaded", function(event) { 
  var app = new Vue({
    el: '#app',
    data: {
      temp: 0

    },
    mounted: function() {
      $.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast ' +
          'where woeid in (select woeid from geo.places(1) where text="NewYork")&format=json', function(response) {
        this.temp = response.query.results.channel.item.condition.temp
        console.log(response.query.results.channel) //all
      }.bind(this))

      $.post('api/v1/forecasts', this.temp, function(response) { 



      })

    }
      



  });

});