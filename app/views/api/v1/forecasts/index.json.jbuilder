json.array! @forecasts.each do |forecast|
  json.id forecast.id
  json.temp forecast.temp
  json.time forecast.created_at
end