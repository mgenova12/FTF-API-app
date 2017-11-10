class Api::V1::ForecastsController < ApplicationController
  def index
    @forecasts = Forecast.all
    render 'index.json.jbuilder'
  end

end
