class ForecastsController < ApplicationController
  def index
  end

  def create
    Forecast.create(temp: params[:temp]);
  end

end
