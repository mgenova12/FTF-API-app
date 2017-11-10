class ForecastsController < ApplicationController
  def index
    @forecasts = Forecast.all
  end

  def create
    Forecast.create(
      temp: params[:temp],
      location: params[:location]
      );
  end

end
