json.array! @forecasts.each do |forecast|
  json.id forecast.id
  json.temp forecast.temp
  json.location forecast.location
  json.time forecast.pubdate
end