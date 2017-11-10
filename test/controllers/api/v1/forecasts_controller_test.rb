require 'test_helper'

class Api::V1::ForecastsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_forecasts_index_url
    assert_response :success
  end

end
