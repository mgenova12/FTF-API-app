class ForecastsController < ApplicationController
  def index
    # @forecasts = Forecast.order(created_at: :desc)
  end

  def create
    Forecast.create(
      temp: params[:temp],
      location: params[:location]
      );
  end

end
