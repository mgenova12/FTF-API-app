Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      get '/forecasts' => 'forecasts#index'
    end
  end

  root :to => 'forecasts#index'
  post '/forecasts' => 'forecasts#create'

end
