class ForecastsController < ApplicationController
  def index
  end

  def create
    Forecast.create(
      temp: params[:temp],
      location: params[:location],
      pubdate: params[:pubdate]
      );
  end

end
