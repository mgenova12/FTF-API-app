Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      get '/forecasts' => 'forecasts#index'
      post '/forecasts' => 'forecasts#create'
    end
  end

  root :to => 'forecasts#index'

end
